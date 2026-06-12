/* ============================================================
   TOGA — gabarito.js : A REVISÃO COMENTADA
   ------------------------------------------------------------
   O coração pedagógico do pós-jogo: decisão por decisão, o que
   VOCÊ escolheu e qual era a DECISÃO DE REFERÊNCIA daquela cena
   — com a fundamentação completa de ambas. Nada aqui é conteúdo
   novo: tudo vem dos próprios casos (cenas[].decisao.opcoes) e
   do histórico do jogador.

   As citações legais viram LINKS (LexML, base oficial) — quem
   estiver online clica e lê a lei de verdade; offline, o texto
   continua perfeito.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.gabarito = (function () {

  const NOMES_ACERTO = {
    otimo: "Decisão exemplar", bom: "Decisão defensável",
    ruim: "Decisão frágil", grave: "Erro grave", neutro: "Registrada"
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  }

  /* ---------- Citações legais viram links (LexML) ---------- */
  const PADROES_LEI = [
    /Lei n?\.?º? ?[\d.]+\/\d{2,4}/g,
    /Súmula(?: Vinculante)? \d+(?:\/(?:STF|STJ))?/g,
    /(?:CPP|CPC|CP|CC|CF|ECA|CLT|LOMAN), arts?\. ?[\d.]+(?:[ºo°ª])?(?:, ?[IVXLC§\d][\wº°§., ]{0,12})?/g,
    /REsp [\d.]+(?:\/[A-Z]{2})?/g,
    /HC [\d.]+/g,
    /ARE [\d.]+/g,
    /Tema \d+(?:\/(?:STF|STJ))?/g,
    /Res(?:olução|\.) ?CNJ \d+(?:\/\d{4})?/g
  ];

  function linkificarLei(texto) {
    let html = esc(texto);
    PADROES_LEI.forEach(function (re) {
      html = html.replace(re, function (m) {
        const q = encodeURIComponent(m);
        return '<a class="link-lei" target="_blank" rel="noopener" ' +
          'href="https://www.lexml.gov.br/busca/search?keyword=' + q + '">' + m + '</a>';
      });
    });
    return html;
  }

  /* ---------- Localiza a decisão original a partir do histórico ---------- */
  function localizarOpcoes(item) {
    if (item.caso === "gabinete") {
      const d = (TOGA.despachos || []).find(x => x.id === item.cena);
      return d ? { prompt: "Concluso: " + d.titulo, opcoes: d.opcoes, origem: d } : null;
    }
    const caso = TOGA.motor.casoPorId(item.caso);
    const cena = caso && caso.cenas[item.cena];
    if (!cena || !cena.decisao) return null;
    return { prompt: cena.decisao.prompt, opcoes: cena.decisao.opcoes, origem: caso };
  }

  function melhorOpcao(opcoes) {
    return opcoes.find(o => (o.feedback || {}).acerto === "otimo") ||
           opcoes.find(o => (o.feedback || {}).acerto === "bom") || null;
  }

  /* ---------- Um item de revisão (a sua escolha × a referência) ---------- */
  function blocoDecisao(item) {
    const loc = localizarOpcoes(item);
    if (!loc) return "";
    const escolhida = loc.opcoes.find(o => o.rotulo === item.rotulo) || null;
    const melhor = melhorOpcao(loc.opcoes);
    const acertou = melhor && escolhida === melhor;
    const fbSeu = escolhida && escolhida.feedback;

    let html = `<div class="revisao-decisao acerto-${item.acerto}">
      <div class="revisao-prompt">${esc(loc.prompt)}</div>
      <div class="revisao-escolha">
        <span class="tag-acerto selo-${item.acerto}">${NOMES_ACERTO[item.acerto] || item.acerto}</span>
        <strong>Sua decisão:</strong> ${esc(item.rotulo)}
        ${escolhida && escolhida.fundamento ? `<div class="revisao-fundamento">${linkificarLei(escolhida.fundamento)}</div>` : ""}
      </div>`;

    if (fbSeu) {
      html += `<div class="revisao-feedback">
        <strong>${esc(fbSeu.titulo || "")}.</strong> ${linkificarLei(fbSeu.texto || "")}</div>`;
    }

    if (acertou) {
      html += `<div class="revisao-referencia foi-referencia">✓ Você escolheu a decisão de referência desta cena.</div>`;
    } else if (melhor) {
      html += `<div class="revisao-referencia">
        <div class="rotulo-referencia">⚖ A decisão de referência</div>
        <strong>${esc(melhor.rotulo)}</strong>
        ${melhor.fundamento ? `<div class="revisao-fundamento">${linkificarLei(melhor.fundamento)}</div>` : ""}
        ${melhor.feedback ? `<div class="revisao-feedback">${linkificarLei(melhor.feedback.texto || "")}</div>` : ""}
        ${melhor.requerFoco ? `<div class="revisao-foco">🔍 Esta opção exigia ter estudado o foco correspondente nos autos.</div>` : ""}
      </div>`;
    }
    return html + "</div>";
  }

  /* ---------- Render completo ---------- */
  function render() {
    const estado = TOGA.motor.estado;
    const alvo = document.getElementById("gabarito-conteudo");
    if (!estado || !alvo) return;

    const grupos = [];   // [{titulo, selo?, itens[]}]
    TOGA.motor.casosDaPauta().forEach(function (caso) {
      const itens = estado.historico.filter(h => h.caso === caso.id);
      if (!itens.length) return;
      const concluido = estado.concluidos.find(c => c.id === caso.id);
      grupos.push({ titulo: caso.hora + " — " + caso.titulo, selo: concluido && concluido.selo, itens: itens });
    });
    const gabinete = estado.historico.filter(h => h.caso === "gabinete");
    if (gabinete.length) grupos.push({ titulo: "Gabinete — os conclusos do dia", itens: gabinete });

    const otimas = estado.historico.filter(h => h.acerto === "otimo").length;
    alvo.innerHTML = `
      <div class="resumo-gabarito">
        Você tomou <strong>${estado.historico.length}</strong> decisões;
        <strong>${otimas}</strong> coincidiram com a decisão de referência.
        Abaixo, cada uma — a sua e a do gabarito — com a fundamentação completa.
        <span class="suave">As citações legais são clicáveis (LexML) quando houver internet.</span>
      </div>
      ${grupos.map(g => `
        <section class="revisao-caso">
          <h3>${esc(g.titulo)}
            ${g.selo ? `<span class="selo-resultado selo-${g.selo}">${esc(g.selo)}</span>` : ""}</h3>
          ${g.itens.map(blocoDecisao).join("")}
        </section>`).join("")}`;
  }

  /* ---------- Boletim do Modo Prova ---------- */
  function boletim(ep) {
    const estado = TOGA.motor.estado;
    const r = ep.reputacao;
    const geral = Math.round((r.tec + r.hum + r.cel + r.imp) / 4);
    const pct = ep.decisoes ? Math.round((ep.otimas / ep.decisoes) * 100) : 0;
    return `
      <div class="boletim-prova">
        <div class="eyebrow">📝 Boletim do Modo Prova</div>
        <div class="notas-prova">
          <div class="nota"><span>${r.tec}</span>⚖ Técnica</div>
          <div class="nota"><span>${r.hum}</span>❤ Humanidade</div>
          <div class="nota"><span>${r.cel}</span>⏱ Celeridade</div>
          <div class="nota"><span>${r.imp}</span>🛡 Imparcialidade</div>
          <div class="nota geral"><span>${geral}</span>Nota geral</div>
        </div>
        <p>${ep.otimas} de ${ep.decisoes} decisões coincidiram com a referência (${pct}%).
        A correção completa está na <strong>revisão comentada</strong> — é lá que a prova ensina.</p>
      </div>`;
  }

  return { render: render, boletim: boletim, linkificarLei: linkificarLei };
})();
