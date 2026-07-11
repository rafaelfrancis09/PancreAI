# API de análise visual do PancreAI

O endpoint `POST /api/analyze-meal` recebe a foto de uma refeição e usa a
Responses API da OpenAI para identificar alimentos visíveis, estimar porções e
avaliar a qualidade da foto. A API não calcula nem devolve dose, medicamento ou
nutrientes. O cálculo continua sendo responsabilidade do código validado do app,
depois da confirmação do usuário.

## Configuração na Vercel

Cadastre estas variáveis no projeto da Vercel:

- `OPENAI_API_KEY`: chave secreta da API. Nunca coloque a chave no JavaScript do navegador.
- `OPENAI_MODEL`: opcional; o padrão é `gpt-5.6-luna`.
- `ALLOWED_ORIGINS`: origens permitidas, separadas por vírgula. Use somente a origem, sem o caminho `/PancreAI`.
- MAX_REQUESTS_PER_MINUTE: limite básico por IP e por instância serverless; o padrão é 10 e o máximo aceito é 60.

Exemplo para o GitHub Pages:

```text
ALLOWED_ORIGINS=https://rafaelfrancis09.github.io,http://localhost:8017,http://127.0.0.1:8017
```

## Formatos aceitos

### Arquivo da câmera ou galeria

Envie `multipart/form-data` com:

- `image`: arquivo JPEG, PNG ou WebP de até 3 MB;
- `catalog`: JSON opcional com no máximo 250 itens `{ "id": "...", "name": "..." }`;
- `locale`: idioma da interface, por exemplo `pt-BR`.

### Data URL

Também é aceito `application/json`:

```json
{
  "image": "data:image/jpeg;base64,...",
  "locale": "pt-BR",
  "catalog": [
    { "id": "arroz_branco", "name": "Arroz branco" }
  ]
}
```

Quando o catálogo é enviado, a API somente confirma um alimento se conseguir
associá-lo a um nome canônico da lista. Itens incertos são devolvidos em
`unknownItems` para revisão humana.

## Verificação de configuração

GET /api/health devolve 200 quando a chave foi configurada e 503 quando ela ainda está ausente. A resposta nunca contém a chave. Esse endpoint serve para diagnóstico de implantação, não para monitorar saldo ou disponibilidade da OpenAI.

O limitador incluído reduz abusos simples, mas a memória não é compartilhada entre todas as instâncias serverless. Em produção, complemente-o com limites e alertas de gasto da conta e, se necessário, proteção de borda da hospedagem.

## Resposta

```json
{
  "id": "ai_analysis_...",
  "provider": "openai",
  "providerLabel": "OpenAI Vision",
  "isSimulated": false,
  "mealName": "Arroz, feijão e frango",
  "category": "Almoço",
  "confidence": 88,
  "photoQuality": {
    "label": "Foto boa",
    "level": "good",
    "message": "A foto permite uma boa identificação visual da refeição."
  },
  "detectedItems": [
    { "name": "Arroz branco", "quantityGrams": 120, "confidence": 91 }
  ],
  "warnings": ["Confirme os alimentos e as porções estimadas antes de continuar."],
  "unknownItems": [],
  "packaging": null
}
```

## Testes

Execute `npm test`. Os testes validam arquivos, Data URLs, catálogo, CORS,
normalização e contrato da OpenAI sem fazer chamadas reais e sem consumir saldo.
