(function () {
  const architecture = window.PancreAIArchitecture || {};
  const nutritionCount = window.PancreAIData?.nutritionDatabase?.foods?.length || 0;
  const structuredMealCount = window.PancreAIData?.mealDatabase?.meals?.length || 0;
  const demoCount = window.PancreAIServices?.simulatedCaptureService?.getSimulatedMealImages?.().length || 0;

  const overviewCards = [
    {
      icon: "camera",
      title: "Câmera e galeria usam fotos reais",
      text: "Com a permissão do usuário, o navegador captura uma foto pela câmera ou abre uma imagem da galeria. Antes do envio, o app valida, redimensiona e comprime o arquivo."
    },
    {
      icon: "food",
      title: "A IA sugere, não decide",
      text: "Um modelo OpenAI com visão sugere alimentos, porções e qualidade da foto. Essas sugestões podem estar erradas e precisam ser revisadas antes do cálculo."
    },
    {
      icon: "db",
      title: "Os nutrientes vêm do banco local",
      text: "A resposta da IA é relacionada ao catálogo do PancreAI. Gordura, proteína, carboidratos e calorias vêm somente desse banco; itens sem correspondência permanecem desconhecidos."
    },
    {
      icon: "security",
      title: "O cálculo é separado da IA",
      text: "Depois da revisão obrigatória, regras determinísticas somam a gordura, aplicam os dados de tratamento cadastrados e geram avisos. A IA não escolhe nem altera a dose."
    }
  ];

  const aiItems = [
    "Foto enviada a um serviço externo por um backend protegido",
    "Sugestão inicial de alimentos e porções",
    "Confiança e qualidade estimadas para a foto",
    "Resposta dependente de internet e disponibilidade do serviço",
    "Possibilidade de omissões e identificações incorretas"
  ];

  const localItems = [
    "Preparação e compressão da foto no navegador",
    "Correspondência com o banco nutricional local",
    "Revisão manual obrigatória dos alimentos e porções",
    "Ingredientes ocultos e ajuste de quantidade",
    "Cálculo determinístico de gordura, lipase e unidades",
    "Avisos, favoritos, lembretes e histórico local"
  ];

  const dataSources = [
    {
      title: "Análise visual externa",
      badge: "via backend",
      items: ["A chave da API permanece no servidor", "A IA devolve apenas sugestões estruturadas", "Nenhum nutriente retornado pela IA é usado no cálculo"]
    },
    {
      title: "Banco nutricional local",
      badge: `${nutritionCount} alimentos`,
      items: ["Fonte dos nutrientes usados no cálculo", "Valores recalculados pela quantidade confirmada", "Pesquisa para adicionar ou substituir alimentos"]
    },
    {
      title: "Modo demonstrativo explícito",
      badge: `${demoCount} casos`,
      items: ["Usa imagens e análises preparadas", "Só é ativado quando o usuário escolhe a demonstração", `O banco estruturado mantém ${structuredMealCount} combinações para testes`]
    }
  ];

  const appFlow = [
    "Câmera ou galeria real",
    "Imagem preparada",
    "Backend protegido",
    "Sugestões da IA",
    "Revisão obrigatória",
    "Banco nutricional local",
    "Ingredientes ocultos",
    "Cálculo determinístico",
    "Validação",
    "Resultado e histórico"
  ];

  const currentFlow = architecture.currentFlow || [
    "Foto real",
    "OpenAI Vision",
    "Revisão obrigatória",
    "Banco nutricional local",
    "Cálculo determinístico",
    "Validação"
  ];

  const demoFlow = architecture.demoFlow || [
    "Modo demonstrativo explícito",
    "Caso preparado",
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
      text: "Uma foto não mostra com precisão absoluta a quantidade, o preparo ou os ingredientes ocultos. O app sinaliza itens desconhecidos e dados que precisam de correção."
    },
    {
      icon: "history",
      badge: "Privacidade",
      title: "Envie somente a imagem necessária",
      text: "A foto da refeição é enviada ao serviço externo para análise. Evite rostos, documentos, rótulos com dados pessoais e informações de saúde desnecessárias."
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
          <h2>Como o PancreAI funciona nesta versão</h2>
          <p>A câmera e a galeria recebem fotos reais. A imagem preparada é enviada por um backend protegido a um modelo OpenAI com visão, que sugere alimentos e porções.</p>
          <p>O usuário precisa revisar essas sugestões. Depois, o banco local fornece os nutrientes e o motor de cálculo aplica regras determinísticas aos dados confirmados e ao tratamento cadastrado.</p>
          <strong class="summary-callout">A IA fornece um ponto de partida. Somente a lista revisada pelo usuário alimenta o cálculo.</strong>
        </div>
        <div class="summary-metrics" aria-label="Dados desta versão">
          <div><strong>1</strong><span>serviço visual externo</span><small>Acessado por backend protegido</small></div>
          <div><strong>${nutritionCount}</strong><span>alimentos pesquisáveis</span><small>Base nutricional local</small></div>
          <div><strong>${demoCount}</strong><span>casos demonstrativos</span><small>Disponíveis apenas no modo demo</small></div>
        </div>
      </section>

      <section class="intention-grid" aria-label="Etapas principais do aplicativo">
        ${overviewCards.map(renderOverviewCard).join("")}
      </section>

      <section class="comparison-panel" aria-label="Responsabilidades da IA e do aplicativo">
        <span class="demo-eyebrow">Responsabilidades separadas</span>
        <h2>IA para sugerir, regras locais para calcular</h2>
        <p>O reconhecimento visual não controla o banco nutricional, a prescrição nem o cálculo. Essa separação reduz o impacto de uma sugestão incorreta e torna a revisão visível.</p>
        <div class="comparison-grid">
          <article><h3>Análise visual externa</h3>${renderList(aiItems)}</article>
          <article><h3>Funciona dentro do PancreAI</h3>${renderList(localItems)}</article>
        </div>
      </section>

      <section class="database-panel" aria-label="Fontes de dados do PancreAI">
        <div class="database-panel__head">
          <span class="demo-card__icon" data-pa-icon="db" aria-hidden="true"></span>
          <div>
            <span class="demo-eyebrow">Organização dos dados</span>
            <h2>Cada fonte tem uma responsabilidade</h2>
            <p>A IA sugere nomes e porções; o banco local fornece nutrientes; o modo demonstrativo mantém casos preparados separados do fluxo real.</p>
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

      <section class="flow-panel architecture-flow" aria-label="Fluxo real e modo demonstrativo">
        <div><span class="demo-eyebrow">Fluxo real</span>${renderFlow(currentFlow, "current")}</div>
        <div><span class="demo-eyebrow">Modo demonstrativo explícito</span>${renderFlow(demoFlow, "future")}</div>
        <strong>Uma falha na análise real nunca é escondida por um resultado simulado.</strong>
        <p>Se o serviço externo estiver indisponível, o app mostra um erro. Os casos preparados só são usados quando o modo demonstrativo é escolhido explicitamente.</p>
      </section>

      <section class="truth-note" aria-label="Limites desta versão">
        <strong>Uso responsável</strong>
        <p>A foto é enviada a um serviço externo. Fotografe somente a refeição e não inclua dados pessoais ou informações desnecessárias.</p>
        <p>A identificação visual e a estimativa de porções podem conter erros. Revise todos os alimentos, quantidades e ingredientes ocultos antes de continuar.</p>
        <strong class="truth-note__final">O PancreAI é um protótipo educacional, não um dispositivo médico, e não deve ser usado para alterar tratamento sem orientação profissional.</strong>
      </section>
    `;

    window.PancreAIIcons?.mount(root);
    window.PancreAII18n?.apply?.(root);
  }

  window.PancreAIDemoExplanationView = { render };
})();