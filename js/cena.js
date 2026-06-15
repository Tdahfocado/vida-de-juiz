/* ============================================================
   TOGA — cena.js : a SALA DE AUDIÊNCIAS
   ------------------------------------------------------------
   Este arquivo desenha a parte visual da audiência usando SVG.

   SVG é "desenho por código": em vez de uma imagem pronta
   (foto/png), descrevemos formas — retângulos, círculos,
   caminhos — e o navegador as renderiza em qualquer tamanho,
   sem perder qualidade. Por ser código, podemos ANIMAR e
   MUDAR o desenho em tempo real: trocar a expressão de um
   personagem, acender um foco de luz sobre quem fala, girar
   os ponteiros do relógio da parede.

   A câmera é a VISÃO DO PRÓPRIO JUIZ: você enxerga a sala da
   sua bancada — autos e martelo em primeiro plano, a parte
   depondo ao centro, acusação/requerente à esquerda e
   defesa/requerido à direita.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.cena = (function () {

  /* ---------- 1. Onde cada papel se senta ----------
     Coordenadas dentro do "palco" SVG (viewBox 1200x560).
     x,y = ponto onde o tronco encontra a mesa; s = escala
     (quem está mais perto do juiz aparece maior).        */
  const ASSENTOS = {
    centro: { x: 600, y: 336, s: 1.18 },
    esq1:   { x: 330, y: 352, s: 1.04 },
    esq2:   { x: 232, y: 332, s: 0.94 },
    esq3:   { x: 150, y: 316, s: 0.86 },
    dir1:   { x: 870, y: 352, s: 1.04 },
    dir2:   { x: 968, y: 332, s: 0.94 },
    dir3:   { x: 1050, y: 316, s: 0.86 }
  };

  /* ---------- 2. Dicionário de expressões ----------
     Cada emoção define: o desenho da BOCA (um "path" SVG),
     a inclinação das SOBRANCELHAS e extras (lágrima, pálpebra).
     Trocar emoção = trocar esses atributos. Simples e poderoso. */
  const EXPRESSOES = {
    neutro:   { boca: "M -9 -34 Q 0 -32 9 -34",            sobE: 0,   sobD: 0,   palpebra: false, lagrima: false },
    firme:    { boca: "M -9 -33 L 9 -33",                  sobE: 4,   sobD: -4,  palpebra: false, lagrima: false },
    feliz:    { boca: "M -10 -36 Q 0 -27 10 -36",          sobE: -4,  sobD: 4,   palpebra: false, lagrima: false },
    triste:   { boca: "M -9 -31 Q 0 -37 9 -31",            sobE: -10, sobD: 10,  palpebra: true,  lagrima: false },
    choro:    { boca: "M -8 -30 Q 0 -37 8 -30",            sobE: -12, sobD: 12,  palpebra: true,  lagrima: true  },
    raiva:    { boca: "M -9 -31 Q 0 -36 9 -31",            sobE: 14,  sobD: -14, palpebra: false, lagrima: false },
    surpresa: { boca: "M -5 -34 Q 0 -27 5 -34 Q 0 -39 -5 -34", sobE: -8, sobD: 8, palpebra: false, lagrima: false },
    medo:     { boca: "M -6 -32 Q -2 -35 0 -32 Q 2 -29 6 -32", sobE: -12, sobD: 12, palpebra: false, lagrima: false },
    vergonha: { boca: "M -7 -32 L 7 -32",                  sobE: -8,  sobD: 8,   palpebra: true,  lagrima: false }
  };

  /* ---------- 3. Construção de um personagem ----------
     Cada avatar é um grupo <g> com peças nomeadas (boca,
     sobrancelhas...) para podermos alterá-las depois.      */
  function pecaCabelo(av) {
    const c = av.corCabelo || "#3a2a1a";
    switch (av.cabelo) {
      case "coque":
        return `<path d="M -25 -52 Q 0 -84 25 -52 L 25 -46 Q 0 -64 -25 -46 Z" fill="${c}"/>
                <circle cx="0" cy="-76" r="9" fill="${c}"/>`;
      case "longo":
        return `<path d="M -26 -50 Q 0 -86 26 -50 L 28 -8 Q 20 -2 16 -10 L 16 -42 Q 0 -58 -16 -42 L -16 -10 Q -20 -2 -28 -8 Z" fill="${c}"/>`;
      case "calvo":
        return `<path d="M -25 -50 Q -27 -40 -22 -36 L -22 -44 Q -23 -48 -19 -52 Z" fill="${c}"/>
                <path d="M 25 -50 Q 27 -40 22 -36 L 22 -44 Q 23 -48 19 -52 Z" fill="${c}"/>`;
      default: /* curto */
        return `<path d="M -25 -50 Q 0 -82 25 -50 L 25 -44 Q 0 -62 -25 -44 Z" fill="${c}"/>`;
    }
  }

  function pecaTraje(av) {
    const cor = av.corTraje || "#33424f";
    const camisa = `<path d="M -12 -14 L 0 2 L 12 -14 L 8 -18 L 0 -8 L -8 -18 Z" fill="#f2efe6"/>`;
    if (av.traje === "terno") {
      return `<path d="M -34 30 Q -36 -8 -16 -16 L 0 4 L 16 -16 Q 36 -8 34 30 Z" fill="${cor}"/>
              ${camisa}
              <path d="M 0 -8 L 4 -2 L 0 14 L -4 -2 Z" fill="${av.corGravata || '#7a2e2e'}"/>
              <path d="M -16 -16 L -4 -10 L -14 6 Z" fill="${cor}" stroke="#00000022"/>
              <path d="M 16 -16 L 4 -10 L 14 6 Z" fill="${cor}" stroke="#00000022"/>`;
    }
    if (av.traje === "blazer") {
      return `<path d="M -33 30 Q -35 -8 -15 -16 L 0 0 L 15 -16 Q 35 -8 33 30 Z" fill="${cor}"/>
              <path d="M -10 -16 Q 0 -6 10 -16 L 8 4 L -8 4 Z" fill="${av.corBlusa || '#e8e2d2'}"/>`;
    }
    if (av.traje === "vestido") {
      return `<path d="M -32 30 Q -33 -6 -14 -15 Q 0 -4 14 -15 Q 33 -6 32 30 Z" fill="${cor}"/>`;
    }
    if (av.traje === "toga") {   // a beca do(a) magistrado(a), com a faixa dourada
      return `<path d="M -36 30 Q -38 -10 -16 -17 L 0 2 L 16 -17 Q 38 -10 36 30 Z" fill="#15110c"/>
              <path d="M -12 -14 L 0 0 L 12 -14 L 8 -18 L 0 -9 L -8 -18 Z" fill="#f2efe6"/>
              <path d="M -16 -17 Q 0 -2 16 -17 L 14 -12 Q 0 2 -14 -12 Z" fill="none" stroke="#c9a35c" stroke-width="3"/>`;
    }
    /* camisa simples */
    return `<path d="M -32 30 Q -34 -6 -15 -16 L 0 -4 L 15 -16 Q 34 -6 32 30 Z" fill="${cor}"/>
            <path d="M -6 -14 L 0 -6 L 6 -14 L 0 -18 Z" fill="#00000022"/>`;
  }

  function svgPersonagem(p) {
    const av = p.avatar || {};
    const pele = av.pele || "#d8a87f";
    const e = EXPRESSOES.neutro;
    const oculos = av.oculos
      ? `<g stroke="#2c2418" stroke-width="2" fill="none">
           <circle cx="-9" cy="-49" r="6.5"/><circle cx="9" cy="-49" r="6.5"/>
           <line x1="-2.5" y1="-49" x2="2.5" y2="-49"/></g>` : "";
    const barba = av.barba
      ? `<path d="M -16 -42 Q -18 -26 0 -23 Q 18 -26 16 -42 Q 8 -30 0 -30 Q -8 -30 -16 -42 Z" fill="${av.corCabelo || '#3a2a1a'}"/>` : "";

    /* Observação didática: data-id é um "atributo de dados" —
       um jeito de o HTML/SVG guardar informação para o JS ler. */
    return `
    <g class="pers" id="pers-${p.id}" data-id="${p.id}"
       transform="translate(${0},${0})">
      <ellipse class="foco-luz" cx="0" cy="-26" rx="58" ry="64"
               fill="url(#luzFala)" opacity="0"/>
      ${pecaTraje(av)}
      <rect x="-7" y="-26" width="14" height="12" rx="4" fill="${pele}"/>
      <circle cx="0" cy="-46" r="24" fill="${pele}"/>
      ${pecaCabelo(av)}
      ${barba}
      <g class="olhos">
        <circle class="olho" cx="-9" cy="-50" r="2.6" fill="#231a10"/>
        <circle class="olho" cx="9"  cy="-50" r="2.6" fill="#231a10"/>
        <line class="palpebra" x1="-13" y1="-51" x2="-5" y2="-51"
              stroke="${pele}" stroke-width="4" opacity="0"/>
        <line class="palpebra" x1="5" y1="-51" x2="13" y2="-51"
              stroke="${pele}" stroke-width="4" opacity="0"/>
      </g>
      <line class="sobrancelha sE" x1="-14" y1="-57" x2="-4" y2="-57"
            stroke="#2c2418" stroke-width="2.4" stroke-linecap="round"/>
      <line class="sobrancelha sD" x1="4" y1="-57" x2="14" y2="-57"
            stroke="#2c2418" stroke-width="2.4" stroke-linecap="round"/>
      <path class="boca" d="${e.boca}" stroke="#5a3326" stroke-width="2.2"
            fill="none" stroke-linecap="round"/>
      <path class="lagrima" d="M -14 -44 q -3 7 0 9 q 3 -2 0 -9" fill="#7fb2d8" opacity="0"/>
      ${oculos}
    </g>`;
  }

  /* ---------- 4. O cenário fixo da sala ---------- */
  function svgSala(personagens) {
    const fileiraPublico = [210, 330, 450, 750, 870, 990]
      .map(x => `<g transform="translate(${x},236) scale(.62)">
                   <circle cx="0" cy="-46" r="22" fill="#241b12"/>
                   <path d="M -30 28 Q -32 -8 0 -14 Q 32 -8 30 28 Z" fill="#1d150d"/>
                 </g>`).join("");

    const persDesenhados = (personagens || [])
      .slice()
      .sort((a, b) => (ASSENTOS[a.assento].y - ASSENTOS[b.assento].y)) // trás primeiro
      .map(p => {
        const a = ASSENTOS[p.assento];
        return `<g transform="translate(${a.x},${a.y}) scale(${a.s})">${svgPersonagem(p)}</g>`;
      }).join("");

    return `
<svg viewBox="0 0 1200 560" xmlns="http://www.w3.org/2000/svg" role="img"
     aria-label="Sala de audiências vista da bancada do juiz">
  <defs>
    <linearGradient id="parede" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#463422"/><stop offset="1" stop-color="#2c2014"/>
    </linearGradient>
    <linearGradient id="piso" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3a2b1b"/><stop offset="1" stop-color="#211709"/>
    </linearGradient>
    <linearGradient id="madeiraMesa" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#7a5634"/><stop offset="1" stop-color="#4a3018"/>
    </linearGradient>
    <linearGradient id="bancada" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8a6240"/><stop offset=".18" stop-color="#5e3f22"/>
      <stop offset="1" stop-color="#33200e"/>
    </linearGradient>
    <radialGradient id="luzFala" cx=".5" cy=".4" r=".6">
      <stop offset="0" stop-color="#ffe9b8" stop-opacity=".5"/>
      <stop offset="1" stop-color="#ffe9b8" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="luzJanela" cx=".5" cy=".3" r=".8">
      <stop offset="0" stop-color="#ffdf9e"/><stop offset="1" stop-color="#caa05a"/>
    </radialGradient>
  </defs>

  <!-- parede do fundo, com painéis de madeira -->
  <rect x="0" y="0" width="1200" height="300" fill="url(#parede)"/>
  <g stroke="#00000033" stroke-width="2">
    <line x1="0" y1="96" x2="1200" y2="96"/>
    ${[100, 250, 400, 800, 950, 1100].map(x => `<line x1="${x}" y1="96" x2="${x}" y2="300"/>`).join("")}
  </g>

  <!-- janelas altas com luz quente -->
  <g>
    <rect x="60" y="20" width="120" height="66" rx="6" fill="url(#luzJanela)" opacity=".85"/>
    <rect x="1020" y="20" width="120" height="66" rx="6" fill="url(#luzJanela)" opacity=".85"/>
    <g stroke="#3a2b18" stroke-width="4">
      <line x1="120" y1="20" x2="120" y2="86"/><line x1="60" y1="53" x2="180" y2="53"/>
      <line x1="1080" y1="20" x2="1080" y2="86"/><line x1="1020" y1="53" x2="1140" y2="53"/>
    </g>
  </g>

  <!-- porta dupla central e relógio da sala -->
  <g>
    <rect x="540" y="60" width="120" height="220" rx="4" fill="#241809" stroke="#5a4128" stroke-width="3"/>
    <line x1="600" y1="60" x2="600" y2="280" stroke="#5a4128" stroke-width="3"/>
    <circle cx="585" cy="180" r="4" fill="#c9a35c"/><circle cx="615" cy="180" r="4" fill="#c9a35c"/>
  </g>
  <g id="relogio-parede" transform="translate(390,52)">
    <circle r="26" fill="#f4ecd9" stroke="#5a4128" stroke-width="4"/>
    <line id="ponteiro-h" x1="0" y1="0" x2="0" y2="-12" stroke="#241c10" stroke-width="3.4" stroke-linecap="round"/>
    <line id="ponteiro-m" x1="0" y1="0" x2="0" y2="-19" stroke="#241c10" stroke-width="2" stroke-linecap="round"/>
    <circle r="2.4" fill="#7a2e2e"/>
  </g>
  <g transform="translate(810,52)">
    <rect x="-34" y="-24" width="68" height="48" rx="4" fill="#1d150d" stroke="#5a4128" stroke-width="3"/>
    <path d="M -20 12 L -4 -10 L 8 4 L 20 -14" stroke="#c9a35c" stroke-width="3" fill="none"/>
  </g>

  <!-- piso -->
  <rect x="0" y="300" width="1200" height="260" fill="url(#piso)"/>
  <g stroke="#00000040" stroke-width="2">
    <line x1="180" y1="560" x2="380" y2="300"/><line x1="1020" y1="560" x2="820" y2="300"/>
    <line x1="0" y1="380" x2="1200" y2="380"/>
  </g>

  <!-- bancos do público (decorativos) -->
  <rect x="120" y="246" width="420" height="14" rx="4" fill="#33220f"/>
  <rect x="660" y="246" width="420" height="14" rx="4" fill="#33220f"/>
  ${fileiraPublico}

  <!-- PERSONAGENS (atrás das mesas) -->
  <g id="camada-personagens">${persDesenhados}</g>

  <!-- mesas: requerente/MP à esquerda, defesa à direita, depoente ao centro -->
  <path d="M 70 320 L 430 358 L 430 408 L 70 366 Z" fill="url(#madeiraMesa)" stroke="#241809" stroke-width="3"/>
  <path d="M 1130 320 L 770 358 L 770 408 L 1130 366 Z" fill="url(#madeiraMesa)" stroke="#241809" stroke-width="3"/>
  <path d="M 520 346 L 680 346 L 692 402 L 508 402 Z" fill="url(#madeiraMesa)" stroke="#241809" stroke-width="3"/>
  <!-- microfone do depoente -->
  <g transform="translate(600,346)">
    <line x1="0" y1="0" x2="10" y2="-26" stroke="#1a1208" stroke-width="3"/>
    <circle cx="11" cy="-29" r="5" fill="#0e0a06" stroke="#c9a35c" stroke-width="1.4"/>
  </g>

  <!-- BANCADA DO JUIZ: primeiríssimo plano (suas mãos ficariam aqui) -->
  <rect x="0" y="448" width="1200" height="112" fill="url(#bancada)"/>
  <rect x="0" y="444" width="1200" height="7" fill="#c9a35c" opacity=".85"/>
  <!-- autos sobre a mesa -->
  <g transform="translate(150,470) rotate(-3)">
    <rect x="0" y="14" width="200" height="16" rx="2" fill="#d9cdaf"/>
    <rect x="6" y="2" width="200" height="16" rx="2" fill="#efe5c8"/>
    <rect x="2" y="-10" width="200" height="16" rx="2" fill="#f4ecd9" stroke="#bda87a"/>
    <text x="18" y="3" font-family="Georgia, serif" font-size="11" fill="#5a2020">AUTOS Nº — CONCLUSOS</text>
  </g>
  <!-- martelo (gavel) com base -->
  <g id="martelo" transform="translate(960,486)">
    <ellipse cx="0" cy="22" rx="46" ry="10" fill="#241809"/>
    <g id="martelo-corpo" transform="rotate(-22)">
      <rect x="-6" y="-56" width="12" height="58" rx="5" fill="#6e4a26"/>
      <rect x="-26" y="-78" width="52" height="26" rx="9" fill="#8a6240" stroke="#241809" stroke-width="2"/>
    </g>
  </g>
  <!-- plaquinha do juiz -->
  <g transform="translate(600,506)">
    <rect x="-138" y="-18" width="276" height="34" rx="5" fill="#1d150d" stroke="#c9a35c" stroke-width="2"/>
    <text x="0" y="5" text-anchor="middle" font-family="Georgia, serif" font-size="15"
          fill="#e7cf9a" letter-spacing="3">VOCÊ — JUÍZO DA COMARCA</text>
  </g>

  <style>
    .pers { transition: transform .35s ease; }
    .pers.falando { filter: drop-shadow(0 0 14px rgba(255, 224, 160, .55)); }
    .pers.falando .foco-luz { opacity: 1; transition: opacity .4s ease; }
    .sobrancelha, .boca, .lagrima, .palpebra { transition: all .3s ease; }
    #martelo { cursor: pointer; }
    #martelo-corpo { transform-origin: 0px -10px; }
    #martelo-corpo.batendo { animation: bateMartelo .5s ease; }
    @keyframes bateMartelo {
      0% { transform: rotate(-22deg); } 40% { transform: rotate(14deg); }
      60% { transform: rotate(-2deg); } 100% { transform: rotate(-22deg); }
    }
    /* flashes de emoção no personagem que fala (só filter: não mexe no assento) */
    .pers.emo-forte { animation: emoForte 1s ease; }
    .pers.emo-pop   { animation: emoPop .7s ease; }
    .pers.emo-triste{ animation: emoTriste 1.4s ease; }
    @keyframes emoForte {
      0% { filter: drop-shadow(0 0 2px rgba(217,107,107,0)); }
      25% { filter: drop-shadow(0 0 16px rgba(217,107,107,.9)); }
      55% { filter: drop-shadow(0 0 8px rgba(231,207,154,.7)); }
      100% { filter: none; }
    }
    @keyframes emoPop {
      0% { filter: brightness(1); }
      30% { filter: brightness(1.7) drop-shadow(0 0 14px rgba(255,240,200,.9)); }
      100% { filter: brightness(1); }
    }
    @keyframes emoTriste {
      0% { filter: brightness(1); }
      40% { filter: brightness(.82) drop-shadow(0 0 12px rgba(110,150,200,.7)); }
      100% { filter: brightness(1); }
    }
  </style>
</svg>`;
  }

  /* ---------- 5. API pública da cena ----------
     "API" = o conjunto de funções que os OUTROS arquivos podem
     chamar. ui.js e motor.js não precisam saber COMO a sala é
     desenhada; só chamam cena.montar(...), cena.falar(...) etc. */

  let raizAtual = null;
  let elencoAtual = [];

  function montar(container, personagens) {
    raizAtual = container;
    elencoAtual = personagens || [];
    container.innerHTML = svgSala(personagens);
    // o martelo é seu: clique nele quando quiser pedir ordem
    const g = container.querySelector("#martelo");
    if (g) g.addEventListener("click", martelo);
    // réu preso (audiência de custódia): policial fica ao lado
    elencoAtual.forEach(p => { if (p.preso) policialAoLado(p); });
  }

  /* ---------- Eventos de cena: prisão e soltura (2D) ----------
     O policial é um personagem SVG (farda + quepe) que entra
     pela porta central, vai até a pessoa e a leva embora —
     a mesma linguagem do jogo, sem cortes de tela.          */
  function svgPolicial(escala) {
    const pol = svgPersonagem({ id: "policial-ato", avatar: {
      pele: "#c98e66", cabelo: "curto", corCabelo: "#241a10",
      traje: "camisa", corTraje: "#2b3340" } });
    // quepe desenhado por cima
    const quepe = `<path d="M -25 -58 Q 0 -74 25 -58 L 25 -52 L -25 -52 Z" fill="#1d2430"/>
                   <rect x="-14" y="-54" width="28" height="5" rx="2" fill="#10141c"/>`;
    return `<g class="pers policial-evento" style="transition: transform 1.6s ease, opacity .8s ease;"
              transform="translate(600,210) scale(${escala || 0.7})" opacity="0">
              ${pol}${quepe}</g>`;
  }

  function assentoDe(idPers) {
    const p = elencoAtual.find(x => x.id === idPers);
    return p ? ASSENTOS[p.assento] || ASSENTOS.centro : null;
  }

  function policialAoLado(p) {
    const camada = raizAtual && raizAtual.querySelector("#camada-personagens");
    const a = ASSENTOS[p.assento] || ASSENTOS.centro;
    if (!camada) return;
    camada.insertAdjacentHTML("beforeend", svgPolicial(a.s * 0.92));
    const pol = camada.querySelector(".policial-evento:last-of-type");
    pol.setAttribute("transform", `translate(${a.x + 70 * a.s},${a.y - 8}) scale(${a.s * 0.92})`);
    pol.setAttribute("opacity", "1");
  }

  /* o vídeo-prova do caso eleitoral: painel que desce do topo, "roda"
     a gravação e recolhe (overlay DOM — vale também no modo clássico) */
  function videoProvaDOM() {
    if (document.getElementById("video-prova")) return;
    const ov = document.createElement("div");
    ov.id = "video-prova"; ov.className = "video-prova";
    const tela = document.createElement("div");
    tela.className = "video-prova-tela";
    if (TOGA.texturas3d && TOGA.texturas3d.videoEleitoralCanvas) {
      try { tela.style.backgroundImage = "url(" + TOGA.texturas3d.videoEleitoralCanvas().toDataURL() + ")"; } catch (e) {}
    }
    const rec = document.createElement("div");
    rec.className = "video-prova-rec"; rec.textContent = "● REC";
    tela.appendChild(rec);
    ov.appendChild(tela);
    document.body.appendChild(ov);
    setTimeout(function () { ov.classList.add("recolher"); }, 7000);
    setTimeout(function () { ov.remove(); }, 8200);
  }

  function evento(spec) {
    if (!spec) return;
    const partes = String(spec).split(":");
    const tipo = partes[0], id = partes[1];
    if (tipo === "video") { videoProvaDOM(); return; }
    if (!raizAtual) return;
    const a = assentoDe(id);
    const alvo = raizAtual.querySelector("#pers-" + id);
    const camada = raizAtual.querySelector("#camada-personagens");
    if (!a || !alvo || !camada) return;

    if (tipo === "prisao") {
      setEmocao(id, "vergonha");
      camada.insertAdjacentHTML("beforeend", svgPolicial(0.7));
      const pol = camada.querySelector(".policial-evento:last-of-type");
      // 1) entra pela porta; 2) chega ao lado; 3) os dois saem
      requestAnimationFrame(() => {
        pol.setAttribute("opacity", "1");
        pol.setAttribute("transform", `translate(${a.x + 60 * a.s},${a.y - 6}) scale(${a.s * 0.95})`);
      });
      setTimeout(() => {
        if (TOGA.audio) TOGA.audio.tocar("algemas");
        alvo.style.transition = "transform 1.8s ease, opacity .9s ease";
        alvo.setAttribute("transform", `translate(${(600 - a.x) / a.s},${(225 - a.y) / a.s}) scale(.62)`);
        alvo.style.opacity = "0";
        pol.setAttribute("transform", `translate(600,212) scale(.6)`);
        pol.style.opacity = "0";
        setTimeout(() => { pol.remove(); alvo.style.display = "none"; }, 2000);
      }, 1900);
    }

    if (tipo === "soltura") {
      if (TOGA.audio) TOGA.audio.tocar("algemas");
      // se a pessoa tinha sido levada (reconsideração), ela VOLTA à cena
      if (alvo.style.display === "none" || alvo.style.opacity === "0") {
        alvo.style.display = "";
        alvo.style.opacity = "1";
        alvo.setAttribute("transform", "translate(0,0)");
      }
      setEmocao(id, "feliz");
      const pol = camada.querySelector(".policial-evento");
      if (pol) {
        pol.setAttribute("transform", `translate(600,212) scale(.6)`);
        pol.style.opacity = "0";
        setTimeout(() => pol.remove(), 1800);
      }
    }
  }

  /* Aplica uma emoção a QUALQUER nó que contenha as peças do rosto
     (a sala usa nos assentos; os avatares avulsos usam fora dela). */
  function aplicarEmocao(raiz, emocao) {
    const e = EXPRESSOES[emocao] || EXPRESSOES.neutro;
    const boca = raiz && raiz.querySelector(".boca");
    if (!boca) return;
    boca.setAttribute("d", e.boca);
    raiz.querySelector(".sE").setAttribute("transform", `rotate(${e.sobE} -9 -57)`);
    raiz.querySelector(".sD").setAttribute("transform", `rotate(${e.sobD} 9 -57)`);
    raiz.querySelectorAll(".palpebra").forEach(p => p.setAttribute("opacity", e.palpebra ? 1 : 0));
    raiz.querySelector(".lagrima").setAttribute("opacity", e.lagrima ? 1 : 0);
  }

  // cada emoção forte dá um "flash" no personagem (o SVG usa o atributo
  // transform para o assento, então a ênfase vai pelo filter/glow — sem
  // brigar com o posicionamento)
  const EMO_CLASSE = {
    raiva: "emo-forte", firme: "emo-forte", surpresa: "emo-pop",
    choro: "emo-triste", medo: "emo-triste", triste: "emo-triste", vergonha: "emo-triste"
  };
  function setEmocao(idPers, emocao) {
    if (!raizAtual) return;
    const g = raizAtual.querySelector("#pers-" + idPers);
    aplicarEmocao(g, emocao);
    if (g) {
      g.classList.remove("emo-forte", "emo-pop", "emo-triste");
      const cls = EMO_CLASSE[emocao];
      if (cls) { void g.getBoundingClientRect(); g.classList.add(cls); }   // reinicia a animação
    }
  }

  /* ---------- Avatar avulso ----------
     O MESMO boneco da sala, num <svg> independente — para as
     pessoas saírem da audiência e aparecerem no resto do jogo:
     a Alice entregando o desenho, Marlene na porta do gabinete,
     os rostos do corredor. id renomeado para não colidir com a
     sala (que continua montada em outra tela).               */
  let soloSeq = 0;
  function avatarSolo(p, emocao) {
    const corpo = svgPersonagem(Object.assign({}, p, { id: "solo-" + (p.id || "v") + "-" + (++soloSeq) }));
    const wrap = document.createElement("div");
    wrap.innerHTML = '<svg class="avatar-solo" viewBox="-46 -110 92 146" aria-hidden="true">' + corpo + "</svg>";
    const svg = wrap.firstChild;
    aplicarEmocao(svg, emocao || "neutro");
    return svg;
  }

  function falar(idPers) {
    if (!raizAtual) return;
    raizAtual.querySelectorAll(".pers.falando").forEach(p => p.classList.remove("falando"));
    if (idPers) {
      const g = raizAtual.querySelector("#pers-" + idPers);
      if (g) g.classList.add("falando");
    }
  }

  function ajustarRelogio(minutosDoDia) {
    if (!raizAtual) return;
    const h = Math.floor(minutosDoDia / 60) % 12;
    const m = minutosDoDia % 60;
    const ph = raizAtual.querySelector("#ponteiro-h");
    const pm = raizAtual.querySelector("#ponteiro-m");
    if (ph) ph.setAttribute("transform", `rotate(${h * 30 + m * 0.5})`);
    if (pm) pm.setAttribute("transform", `rotate(${m * 6})`);
  }

  /* ---------- 6. Som do martelo (Web Audio API) ----------
     Não usamos arquivos .mp3: o navegador SINTETIZA o som —
     um estalo grave + ruído seco. Áudio só pode iniciar após
     um gesto do usuário (regra dos navegadores), por isso o
     contexto é criado "preguiçosamente" no primeiro clique.  */
  let audioCtx = null;
  /* O SOM do martelo, separado da animação: assim o modo 3D
     reaproveita o mesmo áudio sintetizado sem duplicar código. */
  function somMartelo() {
    if (!TOGA.som || !TOGA.som.ligado) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const t = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(170, t);
      osc.frequency.exponentialRampToValueAtTime(60, t + 0.12);
      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t); osc.stop(t + 0.2);

      const ruido = audioCtx.createBufferSource();
      const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.05, audioCtx.sampleRate);
      const dados = buf.getChannelData(0);
      for (let i = 0; i < dados.length; i++) dados[i] = (Math.random() * 2 - 1) * (1 - i / dados.length);
      ruido.buffer = buf;
      const g2 = audioCtx.createGain(); g2.gain.value = 0.25;
      ruido.connect(g2).connect(audioCtx.destination);
      ruido.start(t);
    } catch (e) { /* sem áudio? o jogo segue normalmente */ }
  }

  function martelo() {
    const g = raizAtual && raizAtual.querySelector("#martelo-corpo");
    if (g) { g.classList.remove("batendo"); void g.getBBox(); g.classList.add("batendo"); }
    somMartelo();
  }

  /* Carimbo de decisão sobre a cena (o "tchan" visual do jogo) */
  function carimbar(texto, tom) {
    const palco = document.querySelector(".palco");
    if (!palco) return;
    const el = document.createElement("div");
    el.className = "carimbo bater";
    el.textContent = texto;
    if (tom === "positivo") el.style.color = "var(--verde-claro)", el.style.borderColor = "var(--verde-claro)";
    if (tom === "dourado") el.style.color = "var(--latao-claro)", el.style.borderColor = "var(--latao)";
    palco.appendChild(el);
    palco.classList.remove("soco"); void palco.offsetWidth; palco.classList.add("soco");
    martelo();
    setTimeout(() => { el.classList.add("sumir"); setTimeout(() => el.remove(), 600); }, 1400);
  }

  return { montar, setEmocao, falar, ajustarRelogio, martelo, carimbar,
           evento, somMartelo, EXPRESSOES, avatarSolo, aplicarEmocao };
})();

/* O modo 3D troca TOGA.cena em tempo de execução; este alias
   garante que a cena 2D continue sempre acessível. */
TOGA.cena2d = TOGA.cena;
