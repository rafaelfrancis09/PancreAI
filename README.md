# PancreAI

O PancreAI é um aplicativo web funcional que analisa uma foto real da refeição,
usa o Gemini 3.5 Flash para reconhecer alimentos e estimar porções visuais e exige
que o usuário revise cada item antes do cálculo. Os nutrientes vêm exclusivamente
do banco local, e a estimativa usa os dados de tratamento previamente cadastrados.

## Como funciona

1. A câmera ou a galeria fornece uma imagem real.
2. O navegador valida, redimensiona e comprime a foto.
3. O frontend envia a imagem ao endpoint seguro `POST /api/analyze-meal`.
4. O backend, com a chave protegida no servidor, solicita a análise visual ao
   Gemini 3.5 Flash, com fallback automático para o Gemini 3.1 Flash-Lite.
5. O app aceita somente alimentos ligados ao catálogo local e mostra as sugestões
   para revisão.
6. O usuário corrige alimentos, porções e ingredientes ocultos.
7. O cálculo determinístico usa apenas a lista confirmada, o banco nutricional
   local e o tratamento salvo.

A IA reconhece alimentos e estima porções visuais. Ela não fornece os nutrientes
usados pelo app, não escolhe medicamento e não define dose. Itens incertos ficam
disponíveis para correção manual, e a revisão é obrigatória.

## Configuração da análise com Gemini

O projeto utiliza uma função de backend para impedir que a chave do Gemini seja
exposta no navegador. Copie `.env.example` para o ambiente de implantação e
configure pelo menos:

```text
GEMINI_API_KEY=sua_chave_do_google_ai_studio
GEMINI_MODEL=gemini-3.5-flash
```

O nível gratuito do Gemini pode ser usado dentro das cotas disponíveis, que podem
mudar e gerar limitação temporária. Ele não é ilimitado. Conforme as condições do
serviço, conteúdo enviado no nível gratuito pode ser usado pelo Google para
melhoria dos produtos e passar por revisão humana.

## Publicação

O caminho recomendado é publicar o app inteiro na Vercel, porque o GitHub Pages
não executa a função `/api/analyze-meal`.

1. Envie as alterações para a branch `main` do repositório.
2. Importe `rafaelfrancis09/PancreAI` na Vercel.
3. Use a raiz `./`, o preset `Other` e deixe Build Command e Output Directory
   vazios.
4. Cadastre `GEMINI_API_KEY` em Production e, se necessário, Preview.
5. Mantenha `GEMINI_MODEL=gemini-3.5-flash` e
   `MAX_REQUESTS_PER_MINUTE=10`.
6. Faça o deploy e confirme `/api/health` antes de analisar uma foto real.

No domínio da própria Vercel, `ALLOWED_ORIGINS` é opcional. Se o frontend
continuar no GitHub Pages, será necessário apontar o meta
`pancreai-analysis-endpoint` para a URL absoluta da função e autorizar a origem
do Pages.

## Privacidade e segurança

A foto da refeição é enviada pelo backend ao serviço Gemini para análise. Envie
somente a imagem do prato, sem pessoas, documentos ou dados pessoais
desnecessários. A chave da API permanece apenas no servidor. Dados de tratamento,
preferências, favoritos e histórico permanecem no navegador nesta versão.

Antes do primeiro envio, o app solicita a confirmação de um responsável adulto.
O modo infantil altera somente a apresentação da interface e deve ser usado com
supervisão.

## Limitação médica

O PancreAI não é um dispositivo médico. A identificação visual e as porções podem
estar erradas, e o sistema não substitui avaliação médica ou nutricional. Não
altere tratamento, medicamento ou dose sem orientação profissional.

Os detalhes técnicos estão em [ARCHITECTURE.md](ARCHITECTURE.md).
