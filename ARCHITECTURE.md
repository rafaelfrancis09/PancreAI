# Arquitetura atual do PancreAI

O PancreAI é um protótipo web em HTML, CSS e JavaScript que recebe uma foto real de uma refeição, sugere alimentos e porções para revisão e calcula uma estimativa de unidades de enzima pancreática a partir da gordura confirmada pelo usuário.

O protótipo não é um dispositivo médico, não prescreve tratamento e não foi validado para uso clínico.

## Entrada da imagem

- A câmera usa o acesso permitido pelo navegador e captura um quadro real do dispositivo.
- A galeria aceita uma imagem escolhida pelo usuário.
- Antes do envio, o navegador valida, redimensiona e comprime a imagem.
- A foto preparada é enviada ao backend /api/analyze-meal, que mantém a chave da API fora do navegador e consulta um modelo OpenAI com capacidade de visão.
- A resposta visual contém apenas sugestões iniciais de alimentos, porções, confiança e qualidade da foto. Ela não define nutrientes nem unidades de enzima.

O usuário deve fotografar somente a refeição e evitar rostos, documentos, rótulos com dados pessoais ou qualquer informação desnecessária. A imagem sai do dispositivo para ser analisada por um serviço externo.

## Responsabilidades separadas

- src/services/realImageCaptureService.js: abre a câmera, captura quadros, valida arquivos e prepara a imagem.
- src/services/recognition/realMealRecognitionProvider.js: envia a imagem ao backend e normaliza a resposta sem aceitar nutrientes fornecidos pela IA.
- src/services/recognition/foodMatcher.js: relaciona nomes sugeridos ao catálogo local; itens sem correspondência permanecem desconhecidos.
- api/analyze-meal.js: protege a chave, valida a requisição e chama a OpenAI pelo servidor.
- src/data/nutritionDatabase.js: fonte local dos valores nutricionais usados pelo aplicativo.
- src/data/mealDatabase.js: combinações estruturadas para organização, testes e modo demonstrativo.
- src/services/doseCalculator.js: executa o cálculo determinístico depois da revisão.
- src/services/safetyValidator.js: produz avisos para dados ausentes ou valores que exigem conferência.
- src/services/historyService.js: salva o resultado confirmado localmente no navegador.

## Fluxo principal

1. O usuário fotografa a refeição ou escolhe uma imagem real da galeria.
2. O navegador prepara a foto e a envia ao backend.
3. O backend consulta o modelo de visão e devolve sugestões estruturadas.
4. O FoodMatcher relaciona cada sugestão ao banco local. Alimentos sem correspondência não recebem nutrientes inventados.
5. O usuário obrigatoriamente revisa os alimentos, corrige porções, remove erros, adiciona itens ausentes e confirma ingredientes ocultos.
6. O banco local fornece os nutrientes para as quantidades confirmadas.
7. O DoseCalculator soma a gordura e aplica somente os dados de tratamento cadastrados.
8. O SafetyValidator apresenta avisos antes do resultado.
9. A refeição finalizada pode ser salva no histórico local.

Não existe fallback silencioso para uma análise simulada. Se o serviço estiver indisponível, o aplicativo informa o erro. O modo demonstrativo usa casos preparados apenas quando é escolhido explicitamente.

## Cálculo determinístico

A IA não calcula nem escolhe a dose. O cálculo usa a gordura confirmada na revisão:

1. gordura total × dose prescrita em U/g = lipase necessária
2. lipase necessária ÷ lipase por unidade do medicamento = unidades estimadas

Quando existe resultado, o número é arredondado para a próxima unidade inteira. Os parâmetros de tratamento devem ter sido fornecidos por um profissional; o PancreAI não recomenda mudanças de prescrição.

## Limites conhecidos

- Uma foto não revela com precisão absoluta quantidades, preparo ou ingredientes ocultos.
- A IA pode omitir, confundir ou classificar incorretamente alimentos.
- O banco local pode não conter todos os alimentos sugeridos.
- O resultado depende da foto, das correções do usuário, do banco nutricional e dos dados de tratamento informados.
- O protótipo requer validação técnica, nutricional, clínica, de segurança e de privacidade antes de qualquer uso assistencial.