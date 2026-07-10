(function () {
  const architecture = window.PancreAIArchitecture || {};
  const nutritionCount = window.PancreAIData?.nutritionDatabase?.foods?.length || 0;
  const structuredMealCount = window.PancreAIData?.mealDatabase?.meals?.length || 0;
  const captureCount = window.PancreAIServices?.simulatedCaptureService?.getSimulatedMealImages?.().length || 0;

  const overviewCards = [
    {
      icon: "camera",
      title: "A foto abre um caso visual preparado",
      text: "A c&acirc;mera simulada escolhe um dos casos dispon&iacute;veis e a galeria permite selecionar diretamente uma imagem. Cada foto j&aacute; est&aacute; ligada a uma refei&ccedil;&atilde;o, aos alimentos esperados, &agrave;s por&ccedil;&otilde;es iniciais e aos ingredientes ocultos sugeridos."
    },
    {
      icon: "food",
      title: "A revis&atilde;o controla o resultado",
      text: "Depois da an&aacute;lise simulada, o usu&aacute;rio pode corrigir quantidades, remover itens, substituir um alimento n&atilde;o identificado e adicionar o que faltou. O c&aacute;lculo usa a lista revisada, n&atilde;o apenas a sugest&atilde;o inicial."
    },
    {
      icon: "db",
      title: "Os alimentos ficam em uma base separada",
      text: "A busca de adicionar ou substituir consulta o banco nutricional de alimentos. Essa base guarda gordura, prote&iacute;na, carboidratos e calorias por 100 g e permite recalcular qualquer quantidade informada."
    },
    {
      icon: "security",
      title: "C&aacute;lculo e seguran&ccedil;a s&atilde;o etapas pr&oacute;prias",
      text: "O reconhecimento n&atilde;o define a enzima. O motor soma a gordura confirmada, inclui ingredientes ocultos, aplica a prescri&ccedil;&atilde;o cadastrada e executa valida&ccedil;&otilde;es antes de exibir a estimativa."
    }
  ];

  const simulatedItems = [
    "Captura pela c&acirc;mera do dispositivo",
    "Sele&ccedil;&atilde;o de imagens externas do aparelho",
    "Reconhecimento visual por intelig&ecirc;ncia artificial",
    "Confian&ccedil;a e qualidade inicial da foto",
    "Alimentos e por&ccedil;&otilde;es sugeridos pela imagem"
  ];

  const functionalItems = [
    "Casos visuais vinculados &agrave;s fotos da demonstra&ccedil;&atilde;o",
    "Edi&ccedil;&atilde;o, remo&ccedil;&atilde;o e inclus&atilde;o de alimentos",
    "Busca no banco nutricional separado",
    "Ingredientes ocultos e ajuste de quantidade",
    "C&aacute;lculo de gordura, lipase e unidades do medicamento",
    "Avisos de seguran&ccedil;a, favoritos, lembretes e hist&oacute;rico local"
  ];

  const dataSources = [
    {
      title: "Cat&aacute;logo visual da demonstra&ccedil;&atilde;o",
      badge: `${captureCount} casos`,
      items: ["Fotos exibidas na c&acirc;mera e galeria simuladas", "Alimentos e por&ccedil;&otilde;es ligados a cada foto", "Sugest&otilde;es de ingredientes ocultos"]
    },
    {
      title: "Banco nutricional de alimentos",
      badge: `${nutritionCount} alimentos`,
      items: ["Usado ao adicionar ou substituir um alimento", "Valores nutricionais calculados pela quantidade", "Pesquisa por nome dentro da revis&atilde;o"]
    },
    {
      title: "Banco estruturado de refei&ccedil;&otilde;es",
      badge: `${structuredMealCount} combina&ccedil;&otilde;es`,
      items: ["Mant&eacute;m refei&ccedil;&otilde;es e acompanhamentos organizados", "Apoia testes e evolu&ccedil;&atilde;o do reconhecimento", "N&atilde;o altera o caso da foto que o usu&aacute;rio escolheu"]
    }
  ];

  const appFlow = [
    "C&acirc;mera ou galeria simulada",
    "Caso visual da foto",
    "An&aacute;lise inicial",
    "Revis&atilde;o dos alimentos",
    "Ingredientes ocultos",
    "Banco nutricional",
    "C&aacute;lculo da enzima",
    "Valida&ccedil;&atilde;o",
    "Resultado e hist&oacute;rico"
  ];

  const currentFlow = [
    "Foto preparada",
    "MockVision",
    "Revis&atilde;o humana",
    "Banco nutricional",
    "C&aacute;lculo",
    "Seguran&ccedil;a"
  ];

  const futureFlow = [
    "Foto real",
    "Provedor de vis&atilde;o",
    "Revis&atilde;o humana",
    "Banco nutricional",
    "C&aacute;lculo",
    "Seguran&ccedil;a"
  ];

  const resultCards = [
    {
      icon: "warning",
      badge: "Valida&ccedil;&atilde;o",
      title: "O resultado passa por confer&ecirc;ncias",
      text: "O app sinaliza dados ausentes, alimento n&atilde;o identificado, valores muito altos, arredondamento elevado e situa&ccedil;&otilde;es que exigem revis&atilde;o. A estimativa n&atilde;o substitui a orienta&ccedil;&atilde;o da equipe de sa&uacute;de."
    },
    {
      icon: "history",
      badge: "Dados locais",
      title: "A refei&ccedil;&atilde;o confirmada vira hist&oacute;rico",
      text: "Ao finalizar, o app salva localmente a foto, os alimentos revisados, as quantidades, os ingredientes ocultos, a gordura total, a sugest&atilde;o de enzima e os ajustes feitos. Favoritos, lembretes e prefer&ecirc;ncias tamb&eacute;m permanecem no navegador."
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
      <section class="demo-important" aria-label="Resumo sobre esta vers&atilde;o">
        <span class="demo-important__icon" data-pa-icon="info" aria-hidden="true"></span>
        <div>
          <span class="demo-eyebrow">Sobre esta vers&atilde;o</span>
          <p>Esta p&aacute;gina explica o funcionamento real do PancreAI atual, separando o que &eacute; demonstrado com dados preparados do que j&aacute; responde &agrave;s escolhas feitas no aplicativo.</p>
        </div>
      </section>

      <section class="demo-summary" aria-label="Como o PancreAI funciona atualmente">
        <div>
          <span class="demo-eyebrow">Vis&atilde;o geral</span>
          <h2>Como o PancreAI funciona nesta vers&atilde;o</h2>
          <p>A c&acirc;mera e a galeria s&atilde;o simuladas. Elas usam fotos preparadas, e cada imagem abre o caso correspondente em vez de analisar uma foto real do dispositivo.</p>
          <p>Da revis&atilde;o em diante, o fluxo &eacute; interativo: o usu&aacute;rio corrige a refei&ccedil;&atilde;o, consulta o banco de alimentos, marca ingredientes ocultos e recebe um c&aacute;lculo baseado no perfil e no medicamento cadastrados.</p>
          <strong class="summary-callout">A foto fornece o ponto de partida. A lista confirmada pelo usu&aacute;rio &eacute; o que alimenta o c&aacute;lculo.</strong>
        </div>
        <div class="summary-metrics" aria-label="Dados desta demonstra&ccedil;&atilde;o">
          <div><strong>${captureCount}</strong><span>casos visuais</span><small>Fotos vinculadas a refei&ccedil;&otilde;es</small></div>
          <div><strong>${nutritionCount}</strong><span>alimentos pesquis&aacute;veis</span><small>Base nutricional separada</small></div>
          <div><strong>0</strong><span>APIs externas</span><small>Execu&ccedil;&atilde;o local</small></div>
        </div>
      </section>

      <section class="intention-grid" aria-label="Etapas principais do aplicativo">
        ${overviewCards.map(renderOverviewCard).join("")}
      </section>

      <section class="comparison-panel" aria-label="Partes simuladas e funcionais">
        <span class="demo-eyebrow">O que &eacute; simulado</span>
        <h2>Simula&ccedil;&atilde;o visual, revis&atilde;o funcional</h2>
        <p>O limite da demonstra&ccedil;&atilde;o est&aacute; na entrada da imagem e na sugest&atilde;o inicial. As altera&ccedil;&otilde;es feitas depois disso modificam os dados e o resultado.</p>
        <div class="comparison-grid">
          <article><h3>Preparado para a demonstra&ccedil;&atilde;o</h3>${renderList(simulatedItems)}</article>
          <article><h3>Funciona no app atual</h3>${renderList(functionalItems)}</article>
        </div>
      </section>

      <section class="database-panel" aria-label="Fontes de dados do PancreAI">
        <div class="database-panel__head">
          <span class="demo-card__icon" data-pa-icon="db" aria-hidden="true"></span>
          <div>
            <span class="demo-eyebrow">Organiza&ccedil;&atilde;o dos dados</span>
            <h2>Tr&ecirc;s fontes de dados, tr&ecirc;s responsabilidades</h2>
            <p>O cat&aacute;logo de fotos, o banco nutricional de alimentos e o banco estruturado de refei&ccedil;&otilde;es continuam separados para que cada etapa use apenas os dados de que precisa.</p>
          </div>
        </div>
        <div class="database-examples database-examples--sources">
          ${dataSources.map(renderDataSource).join("")}
        </div>
      </section>

      <section class="technical-panel" aria-label="Fluxo atual do PancreAI">
        <span class="demo-eyebrow">Fluxo atual</span>
        <h2>Da foto ao hist&oacute;rico</h2>
        <p>O app mant&eacute;m cada responsabilidade em uma etapa clara. A busca de alimentos pode completar ou corrigir o caso visual antes do c&aacute;lculo.</p>
        ${renderFlow(appFlow, "mvp")}
      </section>

      <section class="formula-panel" aria-label="Como a estimativa &eacute; calculada">
        <span class="demo-eyebrow">C&aacute;lculo da estimativa</span>
        <h2>O c&aacute;lculo usa a gordura da refei&ccedil;&atilde;o revisada</h2>
        <p>Primeiro, o app soma a gordura dos alimentos confirmados e dos ingredientes ocultos marcados. Depois aplica a dose prescrita em unidades de lipase por grama de gordura.</p>
        <div class="formula-box">
          <span>Gordura dos alimentos + ingredientes ocultos</span>
          <i aria-hidden="true">&times;</i>
          <span>Dose prescrita</span>
          <i aria-hidden="true">=</i>
          <strong>Lipase necess&aacute;ria</strong>
        </div>
        <div class="formula-box">
          <span>Lipase necess&aacute;ria</span>
          <i aria-hidden="true">/</i>
          <span>Lipase por unidade do medicamento</span>
          <i aria-hidden="true">=</i>
          <strong>Unidades estimadas</strong>
        </div>
        <p>Quando existe resultado, o valor &eacute; arredondado para a pr&oacute;xima unidade inteira. Casos configurados sem necessidade de enzima permanecem em zero.</p>
      </section>

      <section class="demo-card-grid" aria-label="Valida&ccedil;&atilde;o e dados locais">
        ${resultCards.map(renderResultCard).join("")}
      </section>

      <section class="module-grid" aria-label="Partes atuais do aplicativo">
        ${(architecture.modules || []).map(renderModule).join("")}
      </section>

      <section class="flow-panel architecture-flow" aria-label="Funcionamento atual e evolu&ccedil;&atilde;o futura">
        <div><span class="demo-eyebrow">Hoje</span>${renderFlow(currentFlow, "current")}</div>
        <div><span class="demo-eyebrow">Com reconhecimento real</span>${renderFlow(futureFlow, "future")}</div>
        <strong>A entrada visual pode evoluir sem trocar o restante do fluxo.</strong>
        <p>No futuro, um provedor de vis&atilde;o pode receber fotos reais e devolver os alimentos sugeridos. A revis&atilde;o humana, o banco nutricional, o c&aacute;lculo, os avisos e o hist&oacute;rico continuam com as mesmas responsabilidades.</p>
      </section>

      <section class="truth-note" aria-label="Limites desta vers&atilde;o">
        <strong>O que esta vers&atilde;o demonstra</strong>
        <p>O PancreAI atual demonstra a jornada completa com imagens e an&aacute;lises preparadas. Ele n&atilde;o acessa a c&acirc;mera real, n&atilde;o importa fotos externas e n&atilde;o usa intelig&ecirc;ncia artificial para reconhecer a imagem.</p>
        <p>Mesmo assim, a revis&atilde;o, a busca no banco de alimentos, os ingredientes ocultos, o c&aacute;lculo, os avisos, os favoritos, os lembretes e o hist&oacute;rico respondem &agrave;s a&ccedil;&otilde;es do usu&aacute;rio.</p>
        <strong class="truth-note__final">O objetivo &eacute; mostrar com clareza o que funciona hoje e o que ser&aacute; substitu&iacute;do quando o reconhecimento real for integrado.</strong>
      </section>
    `;

    window.PancreAIIcons?.mount(root);
    window.PancreAII18n?.apply?.(root);
  }

  window.PancreAIDemoExplanationView = { render };
})();
