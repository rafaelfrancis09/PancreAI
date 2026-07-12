(function () {
  const architecture = window.PancreAIArchitecture || {};
  const nutritionCount = window.PancreAIData?.nutritionDatabase?.foods?.length || 0;

  const overviewCards = [
    {
      icon: "camera",
      title: "Câmera e galeria usam fotos reais",
      text: "Com a permissão do usuário, o navegador captura uma foto ou abre uma imagem da galeria. O app valida, redimensiona e comprime o arquivo antes do envio."
    },
    {
      icon: "food",
      title: "O Gemini faz a análise visual",
      text: "A foto é enviada pelo backend ao Gemini 2.5 Flash, que reconhece alimentos e estima porções visuais. A IA pode errar, por isso cada sugestão precisa ser revisada."
    },
    {
      icon: "db",
      title: "Os nutrientes vêm do banco local",
      text: "A resposta da IA é relacionada ao catálogo do PancreAI. Gordura, proteína, carboidratos e calorias vêm somente do banco local e das quantidades confirmadas."
    },
    {
      icon: "security",
      title: "O cálculo é separado da IA",
      text: "Depois da revisão obrigatória, regras locais somam a gordura, aplicam os dados de tratamento cadastrados e geram avisos. A IA não escolhe nem altera a dose."
    }
  ];

  const aiItems = [
    "Reconhecimento visual de alimentos na foto",
    "Estimativa visual de porções aproximadas",
    "Indicação de confiança e qualidade da imagem",
    "Possibilidade de omissões e identificações incorretas",
    "Nenhum nutriente, medicamento ou dose fornecido pela IA é usado no cálculo"
  ];

  const localItems = [
    "Validação e compressão da foto no navegador",
    "Correspondência com o banco nutricional local",
    "Revisão manual obrigatória dos alimentos e porções",
    "Ingredientes ocultos e ajuste de quantidade",
    "Cálculo determinístico de gordura, lipase e unidades",
    "Tratamento, preferências, favoritos e histórico salvos localmente"
  ];

  const dataSources = [
    {
      title: "Análise visual com Gemini",
      badge: "via backend",
      items: ["A chave da API fica somente no servidor", "A foto é enviada ao serviço Gemini para análise", "A resposta contém apenas sugestões visuais para revisão"]
    },
    {
      title: "Banco nutricional local",
      badge: String(nutritionCount),
      items: ["Fonte dos nutrientes usados no cálculo", "Valores recalculados pela quantidade confirmada", "Pesquisa para adicionar ou substituir alimentos"]
    },
    {
      title: "Dados no dispositivo",
      badge: "armazenamento local",
      items: ["Tratamento e preferências permanecem no navegador", "Histórico e favoritos ficam no dispositivo", "A chave do Gemini nunca é incluída no código da página"]
    }
  ];

  const appFlow = [
    "Câmera ou galeria",
    "Imagem validada",
    "Backend seguro",
    "Gemini 2.5 Flash",
    "Revisão obrigatória",
    "Banco nutricional local",
    "Ingredientes ocultos",
    "Cálculo determinístico",
    "Validação",
    "Resultado e histórico"
  ];

  const currentFlow = architecture.currentFlow || [
    "Foto real",
    "Backend seguro",
    "Gemini 2.5 Flash",
    "Revisão obrigatória",
    "Banco nutricional local",
    "Cálculo determinístico",
    "Validação"
  ];

  const resultCards = [
    {
      icon: "warning",
      badge: "Limites",
      title: "Toda análise exige conferência",
      text: "Uma foto não revela com precisão absoluta quantidades, preparo ou ingredientes ocultos. Corrija itens errados e adicione o que não foi reconhecido antes de calcular."
    },
    {
      icon: "history",
      badge: "Privacidade",
      title: "Envie somente a imagem necessária",
      text: "A foto é enviada para análise pelo Gemini. Fotografe apenas o prato, sem pessoas, documentos ou dados pessoais desnecessários."
    }
  ];

  function renderFlow(items, modifier) {
    return `
      <div class="flow-line flow-line--${modifier}">
        ${items.map((item, index) => `
          <span>${item}</span>
          ${index < items.length - 1 ? '<i aria-hidden="true"></i>' : ""}
        `).join("")}
      </div>`;
  }

  function renderList(items) {
    return `<ul class="technical-list">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
  }

  function renderOverviewCard(card) {
    return `
      <article class="intention-card">
        <span class="demo-card__icon" data-pa-icon="${card.icon}" aria-hidden="true"></span>
        <h3>${card.title}</h3>
        <p>${card.text}</p>
      </article>`;
  }

  function renderDataSource(source) {
    return `
      <article>
        <div class="demo-card__top">
          <h3>${source.title}</h3>
          <span class="demo-badge">${source.badge}</span>
        </div>
        ${renderList(source.items)}
      </article>`;
  }

  function renderResultCard(card) {
    return `
      <article class="demo-card">
        <div class="demo-card__top">
          <span class="demo-card__icon" data-pa-icon="${card.icon}" aria-hidden="true"></span>
          <span class="demo-badge">${card.badge}</span>
        </div>
        <h2>${card.title}</h2>
        <p>${card.text}</p>
      </article>`;
  }

  function renderModule(module) {
    return `
      <article class="module-chip">
        <strong>${module.name}</strong>
        <span>${module.label}</span>
      </article>`;
  }

  function render(root) {
    root.innerHTML = `
      <section class="demo-important" aria-label="Resumo sobre esta versão">
        <span class="demo-important__icon" data-pa-icon="info" aria-hidden="true"></span>
        <div>
          <span class="demo-eyebrow">Sobre esta versão</span>
          <p>Esta página descreve o funcionamento real do PancreAI, da captura da foto ao resultado revisado.</p>
        </div>
      </section>

      <section class="demo-summary" aria-label="Como o PancreAI funciona atualmente">
        <div>
          <span class="demo-eyebrow">Visão geral</span>
          <h2>Como o PancreAI funciona</h2>
          <p>A câmera e a galeria recebem fotos reais. O backend envia a imagem ao Gemini 2.5 Flash, que reconhece alimentos e estima porções visuais.</p>
          <p>O usuário revisa essas sugestões. Depois, o banco local fornece os nutrientes e o motor de cálculo aplica regras determinísticas aos dados confirmados e ao tratamento cadastrado.</p>
          <strong class="summary-callout">A IA fornece sugestões visuais. Somente a lista revisada pelo usuário alimenta o cálculo.</strong>
        </div>
        <div class="summary-metrics" aria-label="Dados desta versão">
          <div><strong>1</strong><span>modelo visual</span><small>Gemini 2.5 Flash via backend</small></div>
          <div><strong>${nutritionCount}</strong><span>alimentos pesquisáveis</span><small>Base nutricional local</small></div>
          <div><strong>100%</strong><span>revisão necessária</span><small>Antes de todo cálculo</small></div>
        </div>
      </section>

      <section class="intention-grid" aria-label="Etapas principais do aplicativo">
        ${overviewCards.map(renderOverviewCard).join("")}
      </section>

      <section class="comparison-panel" aria-label="Responsabilidades da IA e do aplicativo">
        <span class="demo-eyebrow">Responsabilidades separadas</span>
        <h2>IA para reconhecer, regras locais para calcular</h2>
        <p>O reconhecimento visual não controla o banco nutricional, a prescrição nem o cálculo. Essa separação reduz o impacto de uma sugestão incorreta e mantém a revisão visível.</p>
        <div class="comparison-grid">
          <article><h3>Gemini 2.5 Flash</h3>${renderList(aiItems)}</article>
          <article><h3>Funciona dentro do PancreAI</h3>${renderList(localItems)}</article>
        </div>
      </section>

      <section class="database-panel" aria-label="Fontes de dados do PancreAI">
        <div class="database-panel__head">
          <span class="demo-card__icon" data-pa-icon="db" aria-hidden="true"></span>
          <div>
            <span class="demo-eyebrow">Organização dos dados</span>
            <h2>Cada fonte tem uma responsabilidade</h2>
            <p>O Gemini sugere nomes e porções visuais; o banco local fornece nutrientes; o navegador mantém tratamento e histórico no dispositivo.</p>
          </div>
        </div>
        <div class="database-examples database-examples--sources">
          ${dataSources.map(renderDataSource).join("")}
        </div>
      </section>

      <section class="technical-panel" aria-label="Fluxo atual do PancreAI">
        <span class="demo-eyebrow">Fluxo atual</span>
        <h2>Da foto real ao histórico</h2>
        <p>Cada etapa conserva uma responsabilidade clara, e o cálculo só acontece depois da conferência do usuário.</p>
        ${renderFlow(appFlow, "mvp")}
      </section>

      <section class="formula-panel" aria-label="Como a estimativa é calculada">
        <span class="demo-eyebrow">Cálculo da estimativa</span>
        <h2>O cálculo usa a gordura da refeição revisada</h2>
        <p>Primeiro, o app soma a gordura dos alimentos confirmados e dos ingredientes ocultos marcados. Depois aplica a dose prescrita em unidades de lipase por grama de gordura.</p>
        <div class="formula-box">
          <span>Gordura dos alimentos + ingredientes ocultos</span>
          <i aria-hidden="true">&times;</i>
          <span>Dose prescrita</span>
          <i aria-hidden="true">=</i>
          <strong>Lipase necessária</strong>
        </div>
        <div class="formula-box">
          <span>Lipase necessária</span>
          <i aria-hidden="true">/</i>
          <span>Lipase por unidade do medicamento</span>
          <i aria-hidden="true">=</i>
          <strong>Unidades estimadas</strong>
        </div>
        <p>A IA não participa dessas operações. Os parâmetros de tratamento devem ter sido informados conforme orientação profissional.</p>
      </section>

      <section class="demo-card-grid" aria-label="Limites e privacidade">
        ${resultCards.map(renderResultCard).join("")}
      </section>

      <section class="module-grid" aria-label="Partes atuais do aplicativo">
        ${(architecture.modules || []).map(renderModule).join("")}
      </section>

      <section class="flow-panel architecture-flow" aria-label="Fluxo funcional da análise">
        <div><span class="demo-eyebrow">Fluxo funcional</span>${renderFlow(currentFlow, "current")}</div>
        <strong>A chave do Gemini permanece protegida no servidor.</strong>
        <p>Se o serviço estiver indisponível, exceder a cota ou não reconhecer a imagem, o app informa a falha e permite tentar novamente. Nenhum resultado preparado substitui a análise.</p>
      </section>

      <section class="truth-note" aria-label="Limites desta versão">
        <strong>Uso responsável e privacidade</strong>
        <p>A análise visual é destinada ao uso por um responsável adulto. O modo infantil altera apenas a apresentação e deve ser usado com supervisão.</p>
        <p>A foto é enviada ao Gemini para análise. No nível gratuito, o serviço está sujeito a cotas, e o conteúdo pode ser usado pelo Google para melhoria dos produtos e passar por revisão humana.</p>
        <p>A identificação visual e a estimativa de porções podem conter erros. Revise todos os alimentos, quantidades e ingredientes ocultos antes de continuar.</p>
        <strong class="truth-note__final">O PancreAI não é um dispositivo médico e não deve ser usado para alterar tratamento sem orientação profissional.</strong>
      </section>
    `;

    window.PancreAIIcons?.mount(root);
    window.PancreAII18n?.apply?.(root);
  }

  window.PancreAIDemoExplanationView = { render };
})();
