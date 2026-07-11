# PancreAI

O PancreAI é um protótipo web que usa uma foto real da refeição para sugerir alimentos e porções. O usuário revisa obrigatoriamente essas sugestões; depois, o banco nutricional local fornece os nutrientes e um motor determinístico estima as unidades de enzima com base no tratamento previamente cadastrado.

## Como funciona

1. A câmera ou a galeria fornece uma imagem real.
2. O navegador reduz e prepara a foto.
3. O backend envia a imagem para um modelo OpenAI com visão e recebe sugestões estruturadas.
4. O app relaciona os nomes ao banco local. A IA não fornece os nutrientes usados no cálculo.
5. O usuário corrige alimentos, porções e ingredientes ocultos.
6. O cálculo usa apenas a lista confirmada, a prescrição cadastrada e a potência do medicamento selecionado.

Se a análise externa falhar, o app mostra um erro; ele não substitui silenciosamente o resultado por dados simulados. Casos preparados permanecem disponíveis somente no modo demonstrativo explícito.

## Componentes principais

- Frontend estático em HTML, CSS e JavaScript.
- Captura real e preparação local da imagem.
- Função serverless em api/analyze-meal.js para proteger a chave da OpenAI.
- Banco nutricional local com mapeamento conservador de nomes.
- Revisão humana, ingredientes ocultos, cálculo, avisos, histórico e relatório.

## Configuração do servidor

Defina as variáveis no ambiente de hospedagem, nunca no JavaScript público:

- OPENAI_API_KEY: obrigatória e secreta.
- OPENAI_MODEL: opcional; seleciona o modelo configurado no backend.
- ALLOWED_ORIGINS: origens autorizadas a chamar a API, separadas por vírgula.
- MAX_REQUESTS_PER_MINUTE: limite básico de análises por IP e por instância.

O caminho mais simples é importar este repositório na Vercel: os arquivos estáticos e a função /api/analyze-meal ficam na mesma origem. Depois, cadastre as variáveis acima no painel da Vercel e publique novamente.

Se o frontend continuar no GitHub Pages e somente a API for publicada na Vercel, altere a meta tag pancreai-analysis-endpoint de home.html para a URL HTTPS completa da função, por exemplo https://seu-projeto.vercel.app/api/analyze-meal. Inclua também https://rafaelfrancis09.github.io em ALLOWED_ORIGINS. A chave da OpenAI nunca deve ser colocada nessa meta tag nem em qualquer arquivo público.

O endpoint GET /api/health permite verificar se o backend recebeu a configuração, sem revelar a chave.

## Privacidade e segurança

A foto é enviada a um serviço externo para análise. Fotografe somente o prato e não inclua rostos, documentos, dados pessoais ou informações de saúde desnecessárias. A chave da API deve permanecer exclusivamente no servidor.

## Limitação médica

O PancreAI é um protótipo educacional, não um dispositivo médico. A identificação visual e as porções podem estar erradas, e o sistema não substitui avaliação médica ou nutricional. Não altere tratamento ou dose sem orientação profissional.

Mais detalhes estão em ARCHITECTURE.md.