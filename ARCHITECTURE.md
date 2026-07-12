# Arquitetura atual do PancreAI

O PancreAI é um protótipo web estático em HTML, CSS e JavaScript. Ele recebe uma
foto real de uma refeição, usa uma rede neural local para sugerir alimentos e
porções, exige revisão e calcula uma estimativa com regras determinísticas.

O protótipo não é um dispositivo médico, não prescreve tratamento e não foi
validado para uso clínico.

## Entrada e análise da imagem

- A câmera captura um quadro real com a permissão do navegador.
- A galeria aceita JPEG, PNG ou WebP escolhidos pelo usuário.
- O navegador valida, redimensiona e comprime a imagem.
- `foodRecognitionWorker.js` carrega o modelo Food-101 quantizado e executa a
  inferência fora da linha principal, mantendo botões e animações responsivos.
- A imagem é dividida em uma visão geral e regiões do prato para produzir
  sugestões conservadoras.
- A foto não é enviada a uma API de visão.

O modelo reconhece categorias do conjunto Food-101, não todos os ingredientes
existentes. Por isso, somente equivalências claras entram automaticamente; os
demais rótulos ficam desconhecidos e exigem correção manual.

## Responsabilidades separadas

- `src/services/realImageCaptureService.js`: captura, valida e prepara a foto.
- `src/workers/foodRecognitionWorker.js`: baixa e executa a rede neural local.
- `src/services/recognition/realMealRecognitionProvider.js`: recorta a imagem,
  coordena o worker, avalia qualidade e normaliza as sugestões.
- `src/services/recognition/foodMatcher.js`: associa rótulos ao catálogo local.
- `src/data/nutritionDatabase.js`: única fonte de nutrientes usada pelo app.
- `src/services/doseCalculator.js`: realiza o cálculo depois da revisão.
- `src/services/safetyValidator.js`: apresenta avisos antes do resultado.
- `src/services/historyService.js`: mantém o histórico local no navegador.

## Fluxo principal

1. O usuário fotografa a refeição ou escolhe uma imagem.
2. O navegador prepara a foto e gera regiões de análise.
3. O worker executa o modelo Food-101 e devolve rótulos e confiança.
4. O provedor conserva apenas mapeamentos claros para o banco local.
5. O usuário revisa, corrige quantidades, remove erros e adiciona itens ausentes.
6. O banco local calcula nutrientes para as quantidades confirmadas.
7. O cálculo soma a gordura e aplica apenas o tratamento cadastrado.
8. Avisos são mostrados antes de salvar o resultado no histórico local.

Não existe fallback silencioso. Casos preparados são usados somente quando o
modo demonstrativo é escolhido explicitamente.

## Cálculo determinístico

A IA não escolhe a dose. O cálculo usa a gordura confirmada na revisão:

1. gordura total × dose prescrita em U/g = lipase necessária;
2. lipase necessária ÷ lipase por unidade do medicamento = unidades estimadas.

Os parâmetros de tratamento devem ter sido informados conforme orientação
profissional. O PancreAI não recomenda mudanças de prescrição.

## Limites conhecidos

- O primeiro uso baixa cerca de 60 MB e depende da conexão.
- O desempenho varia de acordo com o aparelho e o navegador.
- Food-101 classifica pratos completos e pode não separar todos os componentes.
- Uma foto não revela com precisão ingredientes ocultos ou quantidades.
- Toda sugestão precisa ser revisada antes do cálculo.
