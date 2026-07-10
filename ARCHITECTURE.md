# Arquitetura atual do PancreAI

O PancreAI é um MVP em HTML, CSS e JavaScript que demonstra a revisão de uma refeição e a estimativa de unidades de enzima pancreática a partir da gordura confirmada pelo usuário.

## O que acontece com a foto

A câmera e a galeria são simuladas. A câmera escolhe um dos casos visuais preparados e a galeria permite escolher uma dessas imagens diretamente. Cada foto está vinculada a uma análise inicial específica, com alimentos, porções, confiança, qualidade e sugestões de ingredientes ocultos.

O app não acessa a câmera real, não importa imagens externas e não executa reconhecimento visual por inteligência artificial nesta versão.

## Fontes de dados separadas

- `src/services/simulatedCaptureService.js`: catálogo visual usado pela câmera e galeria simuladas. Liga cada foto ao caso correspondente.
- `src/data/nutritionDatabase.js`: banco nutricional pesquisável. É usado para adicionar ou substituir alimentos e calcular os nutrientes de acordo com a quantidade.
- `src/data/mealDatabase.js`: banco estruturado de refeições e acompanhamentos. Continua disponível para organização, testes e evolução do reconhecimento, mas não troca o caso ligado à foto selecionada.

## Fluxo atual

1. O usuário abre a câmera simulada ou escolhe uma imagem da galeria simulada.
2. O caso visual ligado à foto fornece a análise inicial.
3. O usuário revisa os alimentos, altera quantidades, remove itens ou pesquisa no banco nutricional para adicionar e substituir.
4. O usuário marca ingredientes ocultos e suas quantidades.
5. `DoseCalculator` soma a gordura confirmada, aplica a dose prescrita e converte a lipase necessária em unidades do medicamento cadastrado.
6. `SafetyValidator` produz avisos para dados ausentes ou valores que exigem conferência.
7. O resultado confirmado é salvo localmente pelo histórico.

## Cálculo

O cálculo usa a gordura da lista revisada e dos ingredientes ocultos:

1. `gordura total × dose prescrita em U/g = lipase necessária`
2. `lipase necessária ÷ lipase por unidade do medicamento = unidades estimadas`

Quando há resultado, o número é arredondado para a próxima unidade inteira. Casos configurados sem necessidade de enzima permanecem em zero.

## Evolução futura

Um provedor real de visão poderá substituir a entrada simulada e devolver uma análise inicial no mesmo formato. A revisão humana, o banco nutricional, o cálculo, a validação e o histórico continuam como etapas separadas.
