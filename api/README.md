# API de análise visual

Esta pasta contém a função serverless usada pelo PancreAI para analisar fotos de
refeições com o Gemini 3.5 Flash, com fallback automático para o Gemini 3.1
Flash-Lite, sem expor a chave no navegador.

## Rotas

- `POST /api/analyze-meal`: valida a imagem, envia o conteúdo ao Gemini e devolve
  sugestões de alimentos e porções visuais vinculadas ao catálogo permitido.
- `GET /api/health`: verifica se a função está configurada, sem revelar segredos.

## Variáveis de ambiente

```text
GEMINI_API_KEY=sua_chave_do_google_ai_studio
GEMINI_MODEL=gemini-3.5-flash
ALLOWED_ORIGINS=https://seu-dominio.example
MAX_REQUESTS_PER_MINUTE=10
```

`GEMINI_API_KEY` é obrigatória e deve existir somente no ambiente do servidor.
Nunca coloque a chave em HTML, JavaScript do navegador, URL ou commit. O modelo
padrão é `gemini-3.5-flash`; se ele estiver temporariamente indisponível, o
backend tenta `gemini-3.1-flash-lite` automaticamente.

Se o frontend e a função estiverem no mesmo domínio, o endpoint relativo
`/api/analyze-meal` funciona diretamente. Para manter o frontend no GitHub Pages,
publique esta API em uma plataforma serverless, configure o endpoint absoluto no
frontend e adicione a origem do Pages em `ALLOWED_ORIGINS`.

O nível gratuito do Gemini está sujeito às cotas e políticas do Google. A API pode
responder com limite temporário; o app deve permitir nova tentativa e nunca
substituir a falha por um resultado preparado.
