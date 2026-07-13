(function () {
  "use strict";

  const CAMERA_COMMAND = "abrirCamera";
  const GALLERY_COMMAND = "abrirGaleria";
  const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
  const MAX_BASE64_CHARS = Math.ceil(MAX_IMAGE_BYTES * 4 / 3) + 16;
  const SESSION_KEY = "pancreaiMitBridgeEnabled";
  const SOURCE_SESSION_KEY = "pancreaiMitCaptureSource";
  const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
  const EXTENSIONS = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp"
  };

  let imageReceiver = null;
  let pendingSource = null;
  let receiving = false;
  let forcedNativeMode = null;
  let queuedDelivery = null;

  function safeSessionGet() {
    try {
      return window.sessionStorage?.getItem(SESSION_KEY) === "true";
    } catch (_) {
      return false;
    }
  }

  function safeSessionSet(enabled) {
    try {
      if (enabled) window.sessionStorage?.setItem(SESSION_KEY, "true");
      else window.sessionStorage?.removeItem(SESSION_KEY);
    } catch (_) {
      // Storage may be disabled inside some WebViews.
    }
  }

  function safeSourceGet() {
    try {
      const source = window.sessionStorage?.getItem(SOURCE_SESSION_KEY);
      return source === "camera" || source === "gallery" ? source : null;
    } catch (_) {
      return null;
    }
  }

  function safeSourceSet(source) {
    try {
      if (source === "camera" || source === "gallery") {
        window.sessionStorage?.setItem(SOURCE_SESSION_KEY, source);
      } else {
        window.sessionStorage?.removeItem(SOURCE_SESSION_KEY);
      }
    } catch (_) {
      // Storage may be disabled inside some WebViews.
    }
  }

  function safeWebViewStringGet() {
    try {
      if (typeof window.AppInventor?.getWebViewString === "function") {
        return window.AppInventor.getWebViewString();
      }
    } catch (_) {
      // The native interface may be unavailable while the WebView is resuming.
    }
    return null;
  }

  function safeWebViewStringClear() {
    try {
      if (typeof window.AppInventor?.setWebViewString === "function") {
        window.AppInventor.setWebViewString("");
      }
    } catch (_) {
      // A failed cleanup must not discard an image already delivered to the app.
    }
  }

  function bridgePreference() {
    try {
      const preference = new URLSearchParams(window.location?.search || "").get("bridge");
      if (preference === "mit") {
        forcedNativeMode = true;
        safeSessionSet(true);
        return true;
      }
      if (preference === "browser") {
        forcedNativeMode = false;
        safeSessionSet(false);
        return false;
      }
    } catch (_) {
      // Continue with runtime detection.
    }
    return null;
  }

  function isLikelyAndroidWebView() {
    const userAgent = String(window.navigator?.userAgent || "");
    return /Android/i.test(userAgent) && /(?:\bwv\b|; wv\))/i.test(userAgent);
  }

  function isNativeCaptureEnabled() {
    const preference = bridgePreference();
    if (preference !== null) return preference;
    if (forcedNativeMode !== null) return forcedNativeMode;
    if (window.PancreAIAppInventorBridge === true) return true;
    if (typeof window.AppInventor?.getWebViewString === "function") return true;
    return safeSessionGet() || isLikelyAndroidWebView();
  }

  function enable() {
    forcedNativeMode = true;
    window.PancreAIAppInventorBridge = true;
    safeSessionSet(true);
    return true;
  }

  function disable() {
    forcedNativeMode = false;
    window.PancreAIAppInventorBridge = false;
    safeSessionSet(false);
    return true;
  }

  function normalizeSource(value) {
    const source = String(value || pendingSource || safeSourceGet() || "gallery").toLowerCase();
    return /camera|câmera|foto/.test(source) ? "camera_native_mit" : "gallery_native_mit";
  }

  function requestCapture(source) {
    pendingSource = source === "camera" ? "camera" : "gallery";
    safeSourceSet(pendingSource);
    console.log(pendingSource === "camera" ? CAMERA_COMMAND : GALLERY_COMMAND);
    return isNativeCaptureEnabled();
  }

  function unwrapPayload(value, source) {
    let payload = value;
    let payloadSource = source;

    if (payload == null || payload === "") {
      payload = safeWebViewStringGet();
    }

    if (typeof payload === "string") {
      const trimmed = payload.trim();
      if (/^(?:"[\s\S]*"|\{[\s\S]*\})$/.test(trimmed)) {
        try {
          const parsed = JSON.parse(trimmed);
          if (typeof parsed === "string") payload = parsed;
          else if (parsed && typeof parsed === "object") {
            payload = parsed.base64Data ?? parsed.base64 ?? parsed.image ?? parsed.data;
            payloadSource = parsed.source ?? parsed.origin ?? payloadSource;
          }
        } catch (_) {
          // Strict Base64 validation below will reject malformed serialized data.
        }
      }
    } else if (payload && typeof payload === "object") {
      payloadSource = payload.source ?? payload.origin ?? payloadSource;
      payload = payload.base64Data ?? payload.base64 ?? payload.image ?? payload.data;
    }

    return { value: payload, source: payloadSource };
  }

  function normalizeBase64(value) {
    if (typeof value !== "string") return null;
    let raw = value.trim();
    if (!raw) return null;

    let declaredMimeType = null;
    if (/^data:/i.test(raw)) {
      const match = /^data:([^;,]+);base64,([\s\S]+)$/i.exec(raw);
      if (!match) return null;
      declaredMimeType = String(match[1] || "").toLowerCase();
      if (declaredMimeType === "image/jpg") declaredMimeType = "image/jpeg";
      if (!ALLOWED_MIME_TYPES.has(declaredMimeType)) return null;
      raw = match[2];
    }

    raw = raw
      .replace(/\s+/g, "")
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .replace(/,+$/g, (padding) => "=".repeat(padding.length));

    if (!raw || raw.length > MAX_BASE64_CHARS || raw.length % 4 === 1) return null;
    const remainder = raw.length % 4;
    if (remainder) raw += "=".repeat(4 - remainder);
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(raw)) return null;

    const paddingLength = raw.endsWith("==") ? 2 : raw.endsWith("=") ? 1 : 0;
    const decodedSize = Math.floor(raw.length * 3 / 4) - paddingLength;
    if (decodedSize <= 0 || decodedSize > MAX_IMAGE_BYTES) return null;
    return { encoded: raw, declaredMimeType };
  }

  function detectMimeType(bytes) {
    if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
      return "image/jpeg";
    }
    if (
      bytes.length >= 8 &&
      bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
      bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a
    ) {
      return "image/png";
    }
    if (
      bytes.length >= 12 &&
      String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
    ) {
      return "image/webp";
    }
    return null;
  }

  function decodeImage(value) {
    const normalized = normalizeBase64(value);
    if (!normalized) return null;

    let binary;
    try {
      binary = window.atob ? window.atob(normalized.encoded) : atob(normalized.encoded);
    } catch (_) {
      return null;
    }
    if (!binary || binary.length > MAX_IMAGE_BYTES) return null;

    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    const mimeType = detectMimeType(bytes);
    if (!mimeType || (normalized.declaredMimeType && normalized.declaredMimeType !== mimeType)) return null;

    const filename = `pancreai-mit-${Date.now()}.${EXTENSIONS[mimeType]}`;
    const blob = new Blob([bytes], { type: mimeType });
    try {
      return new File([blob], filename, { type: mimeType, lastModified: Date.now() });
    } catch (_) {
      blob.name = filename;
      blob.lastModified = Date.now();
      return blob;
    }
  }

  async function deliver(file, source) {
    if (receiving || typeof imageReceiver !== "function") return false;
    receiving = true;
    try {
      await imageReceiver(file, source);
      pendingSource = null;
      safeSourceSet(null);
      safeWebViewStringClear();
      console.log("pancreaiImagemPronta");
      return true;
    } catch (_) {
      console.warn("PancreAI: não foi possível preparar a imagem recebida do MIT.");
      return false;
    } finally {
      receiving = false;
    }
  }

  function setImageReceiver(receiver) {
    imageReceiver = typeof receiver === "function" ? receiver : null;
    if (imageReceiver && queuedDelivery) {
      const delivery = queuedDelivery;
      queuedDelivery = null;
      void deliver(delivery.file, delivery.source);
    } else if (imageReceiver) {
      const pendingImage = safeWebViewStringGet();
      if (typeof pendingImage === "string" && pendingImage.trim()) {
        void Promise.resolve().then(() => {
          if (imageReceiver && !receiving) void receiveImageBase64(pendingImage);
        });
      }
    }
    return Boolean(imageReceiver);
  }

  async function receiveImageBase64(value, source) {
    if (receiving) return false;
    const payload = unwrapPayload(value, source);
    const file = decodeImage(payload.value);
    if (!file) {
      console.warn("PancreAI: imagem Base64 inválida ou não suportada.");
      return false;
    }

    const normalizedSource = normalizeSource(payload.source);
    console.log("pancreaiImagemRecebida");
    if (typeof imageReceiver !== "function") {
      queuedDelivery = { file, source: normalizedSource };
      return true;
    }
    return deliver(file, normalizedSource);
  }

  const api = {
    CAMERA_COMMAND,
    GALLERY_COMMAND,
    MAX_IMAGE_BYTES,
    isNativeCaptureEnabled,
    enable,
    disable,
    requestCamera: () => requestCapture("camera"),
    requestGallery: () => requestCapture("gallery"),
    setImageReceiver,
    receiveImageBase64
  };

  window.PancreAIServices = {
    ...(window.PancreAIServices || {}),
    mitAppInventorBridge: api
  };
  window.PancreAIReceiveImageBase64 = receiveImageBase64;
  window.PancreAIReceiveImageFromWebViewString = (source) => receiveImageBase64(undefined, source);
  window.EyessistantReceiveImageBase64 = receiveImageBase64;
  window.EyesistantReceiveImageBase64 = receiveImageBase64;
  window.PancreAIEnableMITBridge = enable;
  window.PancreAIDisableMITBridge = disable;
})();
