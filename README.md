# PancreAI

O PancreAI é um protótipo web que analisa uma foto real da refeição, sugere
categorias de alimentos e porções aproximadas e exige que o usuário revise cada
item antes do cálculo. Os nutrientes vêm exclusivamente do banco local, e a
estimativa usa os dados de tratamento previamente cadastrados.

## Como funciona

1. A câmera ou a galeria fornece uma imagem real.
2. O navegador valida, redimensiona e prepara a foto.
3. Uma rede neural Food-101 quantizada analisa a imagem dentro de um Web Worker.
4. O app relaciona somente sugestões seguras ao banco nutricional local.
5. O usuário corrige alimentos, porções e ingredientes ocultos.
6. O cálculo determinístico usa apenas a lista confirmada e o tratamento salvo.

A IA não calcula nutrientes, não escolhe medicamento e não define dose. Itens
sem correspondência segura permanecem como não identificados para correção
manual. O modo demonstrativo continua separado e nunca substitui uma falha real
silenciosamente.

## IA gratuita e local

- Biblioteca: Transformers.js.
- Modelo: `onnx-community/swin-finetuned-food101-ONNX`.
- Execução: no navegador, fora da linha principal da interface.
- Custo de API: nenhum.
- Chave ou conta: nenhuma.
- Envio da foto para análise: nenhum.

No primeiro uso, o navegador baixa aproximadamente 60 MB do modelo quantizado a
partir do Hugging Face Hub. O arquivo pode ficar armazenado no cache, tornando
as análises seguintes mais rápidas. É necessário acesso à internet para esse
primeiro carregamento; depois, a disponibilidade offline depende do cache do
navegador.

## Publicação

O projeto continua sendo um site estático em HTML, CSS e JavaScript e pode ser
publicado diretamente pelo GitHub Pages. Não é necessário configurar Vercel,
variáveis de ambiente, chave de API ou servidor de análise.

## Privacidade e segurança

A foto é processada localmente e não é enviada pelo PancreAI a um serviço de
visão. Dados de tratamento, preferências e histórico também ficam no navegador
nesta versão. Ainda assim, fotografe apenas o prato e revise todas as sugestões.

## Limitação médica

O PancreAI é um protótipo educacional, não um dispositivo médico. A identificação
visual e as porções podem estar erradas, e o sistema não substitui avaliação
médica ou nutricional. Não altere tratamento ou dose sem orientação profissional.

Os detalhes técnicos estão em [ARCHITECTURE.md](ARCHITECTURE.md).
