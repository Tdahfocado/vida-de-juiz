/* ============================================================
   TOGA — conquistas.js : MEDALHAS, NÍVEIS E HONRARIAS
   ------------------------------------------------------------
   O sistema de recompensas de longo prazo do jogo:

   - CONQUISTAS: medalhas persistentes entre os dias (localStorage),
     desbloqueadas por feitos — com toast dourado na hora e
     vitrine no menu;
   - NÍVEL DE CARREIRA: os selos "ótimo" acumulados no quadro de
     carreira viram um título reputacional com estrelas;
   - HONRARIAS: certas conquistas (elogio funcional, selo
     Excelência...) também viram OBJETOS no gabinete — a parede
     de honrarias (js/lembrancas.js lê daqui).

   Nada disso altera a pontuação dos casos: recompensa reconhece,
   não distorce a pedagogia.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.conquistas = (function () {

  const CHAVE = "toga.conquistas.v1";

  /* ---------- contexto que as condições recebem ---------- */
  function contexto(gatilho, extra) {
    const M = TOGA.motor;
    const estado = M && M.estado;
    const flags = (estado && estado.flags) || {};
    const carreira = (M && M.carreira) ? M.carreira() : { casos: {}, pautas: {} };
    return Object.assign({
      gatilho: gatilho,
      estado: estado,
      flags: flags,
      carreira: carreira,
      otimosCarreira: Object.values(carreira.casos || {}).filter(s => s === "otimo").length,
      pautasConcluidas: Object.keys(carreira.pautas || {}).length,
      lembrancasAtivas: (TOGA.lembrancas && estado) ? TOGA.lembrancas.ativas(flags).length : 0
    }, extra || {});
  }

  function pautaCompleta(c) {
    return c.estado && TOGA.motor.fimDaPauta &&
      c.estado.concluidos.length >= TOGA.motor.casosDaPauta().length;
  }

  /* ---------- AS MEDALHAS ---------- */
  const LISTA = [
    { id: "primeiraToga", icone: "⚖", nome: "Primeira toga",
      desc: "Conclua a sua primeira audiência.",
      se: c => c.gatilho === "caso" && c.estado && c.estado.concluidos.length >= 1 },

    { id: "maoEstendida", icone: "🤲", nome: "Mão estendida",
      desc: "Receba em mãos a primeira lembrança de alguém que passou pela sua sala.",
      se: c => c.gatilho === "entrega" },

    { id: "portaDestrancada", icone: "🚪", nome: "Porta destrancada",
      desc: "Deixe Marlene dormir com a porta destrancada por dentro.",
      se: c => !!c.flags.protegida },

    { id: "semAlgemas", icone: "⛓", nome: "A regra é a mão livre",
      desc: "Retire as algemas de quem não precisava delas (Súmula Vinculante 11).",
      se: c => !!c.flags.jonasSemAlgemas || !!c.flags.algemasRetiradas },

    { id: "colecionador", icone: "🖼", nome: "Colecionador(a) do gabinete",
      desc: "Tenha 8 lembranças no gabinete ao mesmo tempo.",
      se: c => c.lembrancasAtivas >= 8 },

    { id: "diaExemplar", icone: "🌟", nome: "Dia exemplar",
      desc: "Feche um dia inteiro com todos os casos no selo ótimo.",
      se: c => c.gatilho === "epilogo" && pautaCompleta(c) &&
               c.estado.concluidos.every(x => x.selo === "otimo") },

    { id: "madrugadaEmClaro", icone: "🌙", nome: "Madrugada em claro",
      desc: "Conclua o Plantão Noturno.",
      se: c => c.gatilho === "epilogo" && c.estado && c.estado.pauta === "dia3" && pautaCompleta(c) },

    { id: "sereno", icone: "🧘", nome: "Sereno(a)",
      desc: "Termine um dia com o estresse abaixo de 30.",
      se: c => c.gatilho === "epilogo" && pautaCompleta(c) && (c.estado.estresse || 0) < 30 },

    { id: "maratonista", icone: "🏃", nome: "Maratonista da toga",
      desc: "Conclua os três dias de trabalho.",
      se: c => c.pautasConcluidas >= 3 },

    { id: "leitorDeAutos", icone: "📚", nome: "Leitor(a) de autos",
      desc: "Entre em todas as audiências de um dia com os 2 focos marcados.",
      se: c => c.gatilho === "epilogo" && pautaCompleta(c) &&
               (c.estado._casos2focos || 0) >= TOGA.motor.casosDaPauta().length },

    { id: "fundamentacaoEmSerie", icone: "✦", nome: "Fundamentação em série",
      desc: "Acerte 4 decisões exemplares seguidas.",
      se: c => c.estado && (c.estado.comboOtimo || 0) >= 4 },

    { id: "aComarcaLembra", icone: "🔁", nome: "A comarca lembra",
      desc: "Reencontre alguém do Dia 1 no Dia 2.",
      se: c => c.gatilho === "interludio" && c.interludio && /^int_d1_/.test(c.interludio.id) },

    { id: "semMancha", icone: "🛡", nome: "Sem mancha",
      desc: "Feche um dia inteiro sem nenhuma decisão grave.",
      se: c => c.gatilho === "epilogo" && pautaCompleta(c) &&
               !c.estado.historico.some(h => h.acerto === "grave") },

    { id: "hidratado", icone: "🚰", nome: "Hidratado(a)",
      desc: "Beba água três vezes no mesmo dia. O fórum agradece.",
      se: c => c.estado && (c.estado._aguas || 0) >= 3 },

    { id: "cumprimentador", icone: "👋", nome: "Bom dia, fórum!",
      desc: "Cumprimente, no mesmo dia, todo mundo que faz a casa funcionar: Laís, Bruna, Beatriz, Samantha, dona Lourdes, seu Matias, a assistente social, o médico e o policial.",
      se: c => ["assessora", "bruna", "beatriz", "samantha", "lourdes", "matias", "assistencia", "medico", "guarda"]
        .every(k => !!c.flags["_cump_" + k]) },

    { id: "cooperacaoJudiciaria", icone: "⚖", nome: "Juiz que ajuda juiz",
      desc: "Aceite o pedido da Dra. Adriana, do Núcleo de Custódia, e assuma a audiência de Jonas no mutirão (CPC, art. 69).",
      se: c => !!c.flags.ajudaAdriana },

    { id: "eleitorDoFuturo", icone: "🗳", nome: "Eleitor do Futuro",
      desc: "Aceite o pedido da escola municipal e ensine às crianças e adolescentes, no Salão do Júri, o valor do voto — contra fake news e de zoeira nunca.",
      se: c => c.gatilho === "eleitor" },

    { id: "explorador", icone: "🧭", nome: "Dono(a) da casa",
      desc: "Visite, no mesmo dia, todos os doze espaços do fórum — do gabinete à Sala de Imprensa.",
      se: c => ["gabinete", "copa", "brinquedoteca", "diretoria", "custodia",
                "assistencia", "saude", "sala1", "vara2", "juri",
                "imprensa", "oab"]
        .every(k => !!c.flags["_visita_" + k]) },

    { id: "perspectivaGenero", icone: "🛡⚖", nome: "Perspectiva de gênero",
      desc: "Presida o plenário do júri aplicando o Protocolo da Res. CNJ 492/2023 e o art. 400-A do CPP: a vítima não vira ré — e o veredicto nasce limpo.",
      se: c => !!c.flags.vitimaProtegidaPlenario && !!c.flags.feminicidioCondenado },

    { id: "portaVoz", icone: "🎙", nome: "Porta-voz da Justiça",
      desc: "Depois do júri, atenda a imprensa na sala nova e explique o veredicto em linguagem que qualquer pessoa entende.",
      se: c => c.gatilho === "coletiva" },

    { id: "pontesNaoMuros", icone: "🚔", nome: "Pontes, não muros",
      desc: "Visite a Delegacia da comarca e converse de instituição para instituição — flagrante bem documentado protege todo mundo.",
      se: c => c.gatilho === "visita-delegacia" },

    { id: "sementeCidadania", icone: "🏫", nome: "Semente de cidadania",
      desc: "Visite a Escola Municipal e explique às crianças o que um juiz faz — sem virar bicho-papão.",
      se: c => c.gatilho === "visita-escola" },

    { id: "professorMagistratura", icone: "🎓", nome: "Professor(a) da magistratura",
      desc: "Dirija até a ESMEC e ministre a aula para os juízes que estão chegando — a coroação da carreira.",
      se: c => c.gatilho === "aula-esmec" },

    { id: "simplesEMagico", icone: "🪄", nome: "Simples e Mágico",
      desc: "Na palestra do Juiz Montezuma Herbster, na ESMEC, traduza os três trechos de juridiquês para a língua de gente — sem perder um grama de precisão.",
      se: c => c.gatilho === "linguagem-simples" && !!c.gabaritou },

    { id: "lapidadorSentencas", icone: "📝", nome: "Lapidador(a) de sentenças",
      desc: "Na Oficina de Sentenças da ESMEC, enxugue relatório, fundamentação e dispositivo sem errar um corte (CPC, art. 489).",
      se: c => c.gatilho === "oficina-sentencas" && !!c.gabaritou },

    { id: "artesaoConsensos", icone: "🤝", nome: "Artesão(ã) de consensos",
      desc: "Na Sala de Mediação da ESMEC, conduza a simulação inteira sem impor nada: escuta, reformulação e o acordo que nasce das partes.",
      se: c => c.gatilho === "mediacao" && !!c.gabaritou },

    { id: "cidadaoAoVolante", icone: "🚗", nome: "Cidadão(ã) ao volante",
      desc: "Faça a viagem até a ESMEC sem uma única infração: cinto, sinal, faixa de pedestres e radar.",
      se: c => c.gatilho === "viagem-limpa" },

    { id: "amigoDoCaramelo", icone: "🐕", nome: "Amigo(a) do Razumikin",
      desc: "Faça carinho no cachorro do fórum. Ele já gostava de você antes.",
      se: c => c.gatilho === "caramelo" },

    { id: "banqueteRazumikin", icone: "🍖", nome: "O banquete do Razumikin",
      desc: "Pegue a comida na copa e sirva o jantar do fiscal do corredor.",
      se: c => c.gatilho === "caramelo-comida" },

    { id: "recreio", icone: "🪁", nome: "Hora do recreio",
      desc: "Sente no banquinho pequeno e brinque com as crianças da brinquedoteca.",
      se: c => c.gatilho === "brincadeira" },

    { id: "professorDaRede", icone: "📖", nome: "Professor(a) da rede",
      desc: "Ministre o treinamento jurídico à equipe da assistência social.",
      se: c => c.gatilho === "treino-assistencia" },

    { id: "capacitadorTJCE", icone: "🎓", nome: "Capacitador(a) do TJCE",
      desc: "Aceite o convite do Des. Raimundo Nonato e treine a sua equipe no Salão do Júri.",
      se: c => c.gatilho === "capacitacao" },

    { id: "prerrogativas", icone: "📣", nome: "A voz das prerrogativas",
      desc: "Confirme a palestra da ACM: vitaliciedade, inamovibilidade e irredutibilidade são garantias da sociedade.",
      se: c => !!c.flags.palestraACM },

    { id: "docenteESMEC", icone: "🏛", nome: "Docente da ESMEC",
      desc: "Aceite o convite da Juíza Coordenadora Ana Paula Feitosa Oliveira para o corpo docente permanente da Escola da Magistratura.",
      se: c => !!c.flags.esmecAceita },

    /* ---- honrarias institucionais (também viram objeto no gabinete) ---- */
    { id: "excelencia", icone: "🏵", nome: "Excelência na Prestação Jurisdicional",
      desc: "Feche um dia com os quatro eixos em 75 ou mais.",
      se: c => c.gatilho === "epilogo" && pautaCompleta(c) && c.estado &&
               ["tec", "hum", "cel", "imp"].every(k => c.estado.reputacao[k] >= 75) },

    { id: "elogiado", icone: "📜", nome: "Elogio funcional",
      desc: "Receba o elogio da Corregedoria pelo conjunto da obra.",
      se: c => c.gatilho === "interludio" && c.interludio && c.interludio.id === "int_elogio" },

    { id: "salaDeAula", icone: "🎓", nome: "Sala de aula",
      desc: "Receba a visita dos estudantes de Direito.",
      se: c => c.gatilho === "interludio" && c.interludio && c.interludio.id === "int_estudantes" },

    { id: "comunidade", icone: "💛", nome: "Querido(a) da comarca",
      desc: "Receba o abaixo-assinado de agradecimento do bairro.",
      se: c => c.gatilho === "interludio" && c.interludio && c.interludio.id === "int_comunidade" },

    { id: "vozDaJustica", icone: "🎙", nome: "A voz da Justiça",
      desc: "Conceda a entrevista institucional sem ferir o decoro.",
      se: c => !!c.flags.entrevistaInstitucional },

    { id: "palestrante", icone: "🎤", nome: "Palestrante da Escola Judicial",
      desc: "Aceite o convite para contar como foi esse dia.",
      se: c => !!c.flags.palestraAceita }
  ];

  /* ---------- persistência ---------- */
  let ganhas = null;
  function carregarGanhas() {
    if (ganhas) return ganhas;
    try { ganhas = JSON.parse(localStorage.getItem(CHAVE)) || {}; }
    catch (e) { ganhas = {}; }
    return ganhas;
  }
  function salvarGanhas() {
    try { localStorage.setItem(CHAVE, JSON.stringify(carregarGanhas())); } catch (e) {}
  }

  function tem(id) { return !!carregarGanhas()[id]; }

  function quantasGanhas() { return Object.keys(carregarGanhas()).length; }

  /* novas do dia (para o bloco do epílogo) */
  let novas = [];

  /* ---------- avaliação (chamada nos gatilhos do jogo) ---------- */
  function avaliar(gatilho, extra) {
    const c = contexto(gatilho, extra);
    LISTA.forEach(m => {
      if (tem(m.id)) return;
      let passou = false;
      try { passou = !!m.se(c); } catch (e) {}
      if (!passou) return;
      carregarGanhas()[m.id] = true;
      salvarGanhas();
      novas.push(m);
      anunciar(m);
    });
    // medalha nova pode destravar atividade externa (atividades.js)
    if (TOGA.atividades && TOGA.atividades.checarDesbloqueios) {
      TOGA.atividades.checarDesbloqueios();
    }
  }

  /* ---------- o toast dourado ---------- */
  let filaAnuncio = [];
  let anunciando = false;
  function anunciar(m) {
    filaAnuncio.push(m);
    if (!anunciando) proximoAnuncio();
  }
  function proximoAnuncio() {
    const m = filaAnuncio.shift();
    if (!m) { anunciando = false; return; }
    anunciando = true;
    let area = document.getElementById("area-medalhas");
    if (!area) {
      area = document.createElement("div");
      area.id = "area-medalhas";
      area.setAttribute("aria-live", "polite");
      document.body.appendChild(area);
    }
    const el = document.createElement("div");
    el.className = "toast-medalha";
    el.innerHTML = `<span class="icone-medalha">${m.icone}</span>
      <span><strong>Conquista — ${m.nome}</strong><br>${m.desc}</span>`;
    area.appendChild(el);
    if (TOGA.audio) TOGA.audio.tocar("sino");
    setTimeout(() => {
      el.classList.add("sumindo");
      setTimeout(() => { el.remove(); proximoAnuncio(); }, 500);
    }, 3400);
  }

  /* ---------- nível de carreira ---------- */
  const NIVEIS = [
    { min: 0,  titulo: "Magistrado(a) em afirmação" },
    { min: 3,  titulo: "Magistrado(a) respeitado(a) na comarca" },
    { min: 6,  titulo: "Referência da região" },
    { min: 10, titulo: "Orgulho da Escola Judicial" },
    { min: 14, titulo: "Lenda do fórum" }
  ];

  function nivelCarreira() {
    const carreira = TOGA.motor && TOGA.motor.carreira ? TOGA.motor.carreira() : { casos: {} };
    const otimos = Object.values(carreira.casos || {}).filter(s => s === "otimo").length;
    let nivel = 0;
    NIVEIS.forEach((n, i) => { if (otimos >= n.min) nivel = i; });
    const proximo = NIVEIS[nivel + 1] || null;
    return {
      indice: nivel,
      estrelas: nivel + 1,
      titulo: NIVEIS[nivel].titulo,
      otimos: otimos,
      faltam: proximo ? proximo.min - otimos : 0,
      proximoTitulo: proximo ? proximo.titulo : null
    };
  }

  /* ---------- a vitrine (modal) ---------- */
  function abrirVitrine() {
    let modal = document.getElementById("modal-conquistas");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "modal-conquistas";
      modal.innerHTML = '<div class="cartao-tutorial"><div class="eyebrow">o que a comarca já viu você fazer</div>' +
        '<h2>Conquistas</h2><div class="nivel-vitrine" id="nivel-vitrine"></div>' +
        '<div class="atividades-vitrine" id="atividades-vitrine"></div>' +
        '<div class="grade-conquistas" id="grade-conquistas"></div>' +
        '<div class="acoes-desfecho"><button class="btn-secundario" id="btn-conquistas-fechar">‹ Voltar</button></div></div>';
      document.body.appendChild(modal);
      modal.querySelector("#btn-conquistas-fechar").addEventListener("click", () => { modal.hidden = true; });
      modal.addEventListener("click", ev => { if (ev.target === modal) modal.hidden = true; });
    }
    const n = nivelCarreira();
    const obtidas = quantasGanhas();
    modal.querySelector("#nivel-vitrine").innerHTML =
      `<span class="estrelas">${"★".repeat(n.estrelas)}${"☆".repeat(5 - n.estrelas)}</span> ${n.titulo}` +
      (n.proximoTitulo ? `<span class="suave"> · faltam ${n.faltam} selos ótimos para “${n.proximoTitulo}”</span>` : "") +
      `<span class="total-conquistas">🏅 ${obtidas} de ${LISTA.length} conquistas obtidas` +
      (obtidas >= LISTA.length ? " — a vitrine está completa, Excelência" : "") + `</span>`;
    const areaAtiv = modal.querySelector("#atividades-vitrine");
    if (areaAtiv && TOGA.atividades) {
      areaAtiv.innerHTML = "<h3>🌳 Atividades da comarca</h3>" +
        TOGA.atividades.resumo().map(function (a) {
          const pct = Math.round(100 * a.progresso / a.limiar);
          const estado = a.concluida ? "✓ concluída"
            : a.destravada ? "destravada — saia do fórum ao fim da pauta"
            : a.progresso + "/" + a.limiar + " conquistas";
          return '<div class="ativ-linha' + (a.destravada ? " destravada" : "") + '" title="' + a.hint + '">' +
            '<span class="ativ-icone">' + (a.destravada ? a.icone : "🔒") + "</span>" +
            '<span class="ativ-nome">' + a.nome + "</span>" +
            '<span class="ativ-barra"><i style="width:' + pct + '%"></i></span>' +
            '<span class="ativ-estado">' + estado + "</span></div>";
        }).join("");
    }
    const grade = modal.querySelector("#grade-conquistas");
    grade.innerHTML = LISTA.map(m => {
      const ok = tem(m.id);
      return `<div class="conquista ${ok ? "ganha" : "bloqueada"}" title="${m.desc}">
        <span class="icone-medalha">${ok ? m.icone : "🔒"}</span>
        <span class="nome-medalha">${ok ? m.nome : "???"}</span>
        <span class="desc-medalha">${m.desc}</span>
      </div>`;
    }).join("");
    modal.hidden = false;
  }

  /* "novas do dia" para o epílogo (lê e limpa) */
  function colherNovas() {
    const n = novas.slice();
    novas = [];
    return n;
  }

  return {
    avaliar: avaliar, tem: tem, nivelCarreira: nivelCarreira,
    abrirVitrine: abrirVitrine, colherNovas: colherNovas,
    total: function () { return LISTA.length; },
    quantasGanhas: quantasGanhas
  };
})();
