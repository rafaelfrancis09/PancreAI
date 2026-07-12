# Arquitetura atual do PancreAI

O PancreAI é um aplicativo web em HTML, CSS e JavaScript com uma função de backend
para análise de imagens. Ele recebe uma foto real da refeição, usa o Gemini 2.5
Flash para reconhecer alimentos e estimar porções visuais, exige revisão e calcula
uma estimativa com regras determinísticas e dados locais.

O aplicativo não é um dispositivo médico, não prescreve tratamento e não foi
validado para decisões clínicas.

## Entrada e análise da imagem

- A câmera captura um quadro real com a permissão do navegador.
- A galeria aceita JPEG, PNG ou WebP escolhidos pelo usuário.
- O navegador valida, redimensiona e comprime a imagem.
- `realMealRecognitionProvider.js` envia a foto e o catálogo permitido ao endpoint
  `POST /api/analyze-meal`.
- A função serverless valida o arquivo e solicita uma resposta estruturada ao
  Gemini 2.5 Flash com `GEMINI_API_KEY`, disponível somente no servidor.
- O backend devolve sugestões visuais normalizadas; nutrientes, medicamento e dose
  não são solicitados nem aceitos da IA.

A foto é enviada ao serviço Gemini para a análise. Imagens podem ter alimentos
ambíguos, sobrepostos ou parcialmente visíveis, então o resultado sempre exige
conferência manual.

## Responsabilidades separadas

- `src/services/realImageCaptureService.js`: captura, valida e prepara a foto.
- `src/services/recognition/realMealRecognitionProvider.js`: envia a imagem ao
  backend e normaliza a resposta para a interface.
- `api/analyze-meal.js`: protege a chave, valida a requisição e coordena o Gemini.
- `api/_lib/meal-analysis.js`: aplica limites, catálogo permitido, esquema de
  resposta e regras de segurança.
- `src/services/recognition/foodMatcher.js`: associa sugestões ao catálogo local.
- `src/data/nutritionDatabase.js`: única fonte de nutrientes usada pelo app.
- `src/services/doseCalculator.js`: realiza o cálculo depois da revisão.
- `src/services/safetyValidator.js`: apresenta avisos antes do resultado.
- `src/services/historyService.js`: mantém o histórico local no navegador.

## Fluxo principal

1. O usuário fotografa a refeição ou escolhe uma imagem.
2. O navegador valida e prepara a foto.
3. O backend envia a imagem ao Gemini 2.5 Flash e solicita somente a análise visual.
4. A resposta é limitada aos nomes do catálogo e às porções aproximadas.
5. O usuário revisa, corrige quantidades, remove erros e adiciona itens ausentes.
6. O banco local calcula nutrientes para as quantidades confirmadas.
7. O cálculo soma a gordura e aplica apenas o tratamento cadastrado.
8. Avisos são mostrados antes de salvar o resultado no histórico local.

Se a API estiver indisponível, a cota for excedida ou a imagem não puder ser
analisada, o app informa a falha e permite tentar novamente. Não há substituição
por resultado preparado.

## Dados e confiança

- A chave do Gemini existe somente como variável de ambiente do backend.
- A foto é enviada ao Gemini; o usuário deve evitar pessoas, documentos e outros
  dados pessoais na imagem.
- Tratamento, preferências, favoritos e histórico continuam armazenados localmente.
- O nível gratuito está sujeito a cotas e limites. Conteúdo enviado nesse nível
  pode ser usado pelo Google para melhoria dos produtos e passar por revisão humana.
- Antes do primeiro envio, o app solicita confirmação de um responsável adulto. O modo infantil é apenas uma
  apresentação visual simplificada e requer supervisão.

## Cálculo determinístico

A IA não escolhe a dose. O cálculo usa a gordura confirmada na revisão:

1. gordura total × dose prescrita em U/g = lipase necessária;
2. lipase necessária ÷ lipase por unidade do medicamento = unidades estimadas.

Os parâmetros de tratamento devem ter sido informados conforme orientação
profissional. O PancreAI não recomenda mudanças de prescrição.

## Limites conhecidos

- O reconhecimento depende da qualidade e do enquadramento da foto.
- Uma imagem não revela com precisão ingredientes ocultos ou quantidades.
- O serviço Gemini exige conexão, uma chave válida e cota disponível.
- Toda sugestão precisa ser revisada antes do cálculo.
