const LOCAL_ANALYSIS_INFO = Object.freeze({
  provider: "transformersjs-food101",
  providerLabel: "IA local Food-101",
  model: "onnx-community/swin-finetuned-food101-ONNX",
  execution: "browser",
  serverRequired: false,
  imageUpload: false
});

module.exports = { LOCAL_ANALYSIS_INFO };
