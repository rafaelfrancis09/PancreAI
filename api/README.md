# Compatibilidade da rota de análise

O PancreAI não precisa mais de uma API de visão, chave secreta ou função
serverless. A classificação Food-101 é executada no navegador por
`src/workers/foodRecognitionWorker.js`, e a foto não é enviada ao servidor.

As rotas desta pasta foram mantidas somente para que implantações antigas não
falhem silenciosamente:

- `GET /api/analyze-meal` informa que a análise é local.
- `POST /api/analyze-meal` devolve `405 local_analysis_only` e não processa a foto.
- `GET /api/health` confirma que nenhum servidor é necessário.

A versão publicada no GitHub Pages usa apenas os arquivos estáticos do projeto.
