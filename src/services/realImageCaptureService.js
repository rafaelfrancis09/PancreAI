(function () {
  const DEFAULTS = Object.freeze({
    maxInputBytes: 12 * 1024 * 1024,
    maxOutputBytes: 2.4 * 1024 * 1024,
    maxDimension: 1600,
    quality: 0.86
  });
  const ALLOWED_INPUT_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

  function createCaptureError(code, message) {
    const error = new Error(message);
    error.code = code;
    return error;
  }

  function validateImageFile(file, options = {}) {
    const maxInputBytes = Number(options.maxInputBytes || DEFAULTS.maxInputBytes);
    if (!(file instanceof Blob)) {
      throw createCaptureError("INVALID_FILE", "Selecione uma imagem válida.");
    }
    if (!ALLOWED_INPUT_TYPES.has(String(file.type || "").toLowerCase())) {
      throw createCaptureError("UNSUPPORTED_TYPE", "Use uma imagem JPG, PNG ou WEBP.");
    }
    if (!file.size) {
      throw createCaptureError("EMPTY_FILE", "A imagem selecionada está vazia.");
    }
    if (file.size > maxInputBytes) {
      throw createCaptureError("FILE_TOO_LARGE", "A imagem é muito grande. Escolha uma foto de até 12 MB.");
    }
    return true;
  }

  function readBlobAsDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(String(reader.result || "")), { once: true });
      reader.addEventListener("error", () => reject(createCaptureError("READ_FAILED", "Não foi possível ler a imagem.")), { once: true });
      reader.readAsDataURL(blob);
    });
  }

  function loadImage(dataUrl) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = "async";
      image.addEventListener("load", () => resolve(image), { once: true });
      image.addEventListener("error", () => reject(createCaptureError("DECODE_FAILED", "Não foi possível abrir a imagem.")), { once: true });
      image.src = dataUrl;
    });
  }

  function canvasToBlob(canvas, type, quality) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(createCaptureError("ENCODE_FAILED", "Não foi possível preparar a imagem."));
      }, type, quality);
    });
  }

  function fitInside(width, height, maxDimension) {
    const longest = Math.max(width, height);
    if (!longest || longest <= maxDimension) return { width, height };
    const scale = maxDimension / longest;
    return {
      width: Math.max(1, Math.round(width * scale)),
      height: Math.max(1, Math.round(height * scale))
    };
  }

  async function prepareImageFile(file, options = {}) {
    validateImageFile(file, options);
    const settings = { ...DEFAULTS, ...options };
    const dataUrl = await readBlobAsDataUrl(file);
    const image = await loadImage(dataUrl);
    const size = fitInside(image.naturalWidth, image.naturalHeight, settings.maxDimension);
    const canvas = document.createElement("canvas");
    canvas.width = size.width;
    canvas.height = size.height;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) throw createCaptureError("CANVAS_UNAVAILABLE", "Seu navegador não conseguiu preparar a foto.");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, size.width, size.height);
    context.drawImage(image, 0, 0, size.width, size.height);

    let quality = Number(settings.quality);
    let blob = await canvasToBlob(canvas, "image/jpeg", quality);
    while (blob.size > settings.maxOutputBytes && quality > 0.58) {
      quality -= 0.08;
      blob = await canvasToBlob(canvas, "image/jpeg", quality);
    }

    if (blob.size > settings.maxOutputBytes) {
      throw createCaptureError("COMPRESSED_FILE_TOO_LARGE", "Não foi possível reduzir a foto. Tente outra imagem.");
    }

    const baseName = String(file.name || "refeicao").replace(/\.[^.]+$/, "") || "refeicao";
    return new File([blob], `${baseName}.jpg`, {
      type: "image/jpeg",
      lastModified: Date.now()
    });
  }

  async function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw createCaptureError("CAMERA_UNAVAILABLE", "A câmera ao vivo não está disponível neste navegador.");
    }
    try {
      return await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 1280 }
        }
      });
    } catch (cause) {
      const denied = cause?.name === "NotAllowedError" || cause?.name === "SecurityError";
      throw createCaptureError(
        denied ? "CAMERA_PERMISSION_DENIED" : "CAMERA_START_FAILED",
        denied
          ? "Permita o acesso à câmera ou use o seletor de fotos."
          : "Não foi possível iniciar a câmera. Use o seletor de fotos."
      );
    }
  }

  function stopCamera(stream) {
    stream?.getTracks?.().forEach((track) => track.stop());
  }

  async function captureVideoFrame(video) {
    if (!video || video.readyState < 2 || !video.videoWidth || !video.videoHeight) {
      throw createCaptureError("CAMERA_NOT_READY", "A câmera ainda está iniciando.");
    }
    const size = fitInside(video.videoWidth, video.videoHeight, DEFAULTS.maxDimension);
    const canvas = document.createElement("canvas");
    canvas.width = size.width;
    canvas.height = size.height;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) throw createCaptureError("CANVAS_UNAVAILABLE", "Seu navegador não conseguiu capturar a foto.");
    context.drawImage(video, 0, 0, size.width, size.height);
    const blob = await canvasToBlob(canvas, "image/jpeg", DEFAULTS.quality);
    return new File([blob], `pancreai-${Date.now()}.jpg`, {
      type: "image/jpeg",
      lastModified: Date.now()
    });
  }

  window.PancreAIServices = {
    ...(window.PancreAIServices || {}),
    realImageCaptureService: {
      DEFAULTS,
      validateImageFile,
      prepareImageFile,
      startCamera,
      stopCamera,
      captureVideoFrame
    }
  };
})();
