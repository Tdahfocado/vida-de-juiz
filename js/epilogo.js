/* ============================================================
   TOGA — epilogo.js : a GAZETA DA COMARCA
   ------------------------------------------------------------
   O mural de recortes vira um JORNAL de verdade, com capa
   (manchete principal + colunas) e uma segunda página que
   "vira" em 3D mostrando a árvore das suas decisões: caso a
   caso, o que você decidiu, com a cor de cada acerto — e
   quantos caminhos ficaram por explorar (rejogabilidade!).

   Tudo gerado dos mesmos dados que já existiam: ep.manchetes
   (main.js) e o histórico do motor. Sem mexer nos casos.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.epilogo = (function () {

  const NOMES_ACERTO = { otimo: "exemplar", bom: "defensável", ruim: "frágil", grave: "erro grave", neutro: "—" };

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  }

  /* vidas tocadas e notas de futuro são sempre dirigidas/relativas
     ao juiz: vocativos adaptados ao gênero escolhido (js/juiz.js) */
  function vox(s) {
    return TOGA.juiz ? TOGA.juiz.adaptarDireto(s) : s;
  }

  /* Manchete principal = a primeira do tom dominante do dia */
  function escolherPrincipal(manchetes) {
    if (!manchetes.length) return null;
    const graves = manchetes.filter(m => m.tom === "grave");
    const dominaGrave = graves.length > manchetes.length / 2;
    return (dominaGrave ? graves[0] : manchetes.find(m => m.tom !== "grave")) || manchetes[0];
  }

  function capa(ep) {
    const principal = escolherPrincipal(ep.manchetes);
    const demais = ep.manchetes.filter(m => m !== principal);
    return `
      <header class="cabecalho-jornal">
        <div class="orelha">edição do dia seguinte · R$ 2,50</div>
        <div class="nome-jornal">Gazeta da Comarca</div>
        <div class="orelha">tiragem: a cidade inteira</div>
      </header>
      ${principal ? `
        <div class="manchete-principal ${principal.tom === "grave" ? "grave" : ""}">
          <div class="fonte-jornal">${esc(principal.fonte)}</div>
          <h1>${esc(principal.titulo)}</h1>
        </div>` : ""}
      <div class="colunas-jornal">
        ${demais.map(m => `
          <article class="${m.tom === "grave" ? "grave" : ""}">
            <div class="fonte-jornal">${esc(m.fonte)}</div>
            <h3>${esc(m.titulo)}</h3>
          </article>`).join("")}
      </div>`;
  }

  /* O saldo humano do dia — e o que ficou no gabinete */
  let lembrancasAtivas = [];   // preenchido a cada render (os cliques do mural usam)

  function vidasTocadas(ep) {
    const vidas = ep.vidas || [];
    const flags = (TOGA.motor.estado || {}).flags || {};
    lembrancasAtivas = (TOGA.lembrancas && TOGA.lembrancas.ativas)
      ? TOGA.lembrancas.ativas(flags) : [];
    const presos = (TOGA.prisao3d && TOGA.prisao3d.presosPorFlags)
      ? TOGA.prisao3d.presosPorFlags(flags) : [];
    if (!vidas.length && !lembrancasAtivas.length && !presos.length) return "";
    return `
      <h2 class="titulo-verso">Vidas tocadas</h2>
      <ul class="vidas-tocadas">
        ${vidas.map(v => `<li class="tom-${v.tom}">${esc(vox(v.texto))}
          <span class="origem-vida">${esc(v.caso)}</span></li>`).join("")}
      </ul>
      ${muralGabinete(lembrancasAtivas)}
      <p class="lembrancas-gabinete">Ao fim do dia, a cela de custódia: ${presos.length
        ? "ocupada — " + esc(presos.join(", ")) + ". Toda prisão tem endereço e prazo de revisão."
        : "vazia. E oxalá continue assim."}</p>
      ${saldoDoJuiz()}`;
  }

  /* O MURAL DO GABINETE no 2D: as lembranças físicas, com as
     mesmas artes do modo 3D (js/arte.js). Clicar amplia.    */
  function muralGabinete(itens) {
    if (!itens.length) return "";
    return `
      <h2 class="titulo-verso">No seu gabinete, ao fim do dia</h2>
      <div class="mural-gabinete">
        ${itens.map((i, n) => i.arte
          ? `<button class="moldura-mural" data-lembranca="${n}" title="ampliar">
               <canvas data-arte="${esc(i.arte)}" width="200" height="200" aria-hidden="true"></canvas>
               <span>${esc(i.titulo)}</span>
             </button>`
          : `<div class="moldura-mural so-texto"><span>${esc(i.texto || i.titulo)}</span></div>`).join("")}
      </div>`;
  }

  /* E você? — o saldo do PRÓPRIO juiz, ao lado das vidas tocadas */
  function saldoDoJuiz() {
    const e = TOGA.motor.estado || {};
    const v = e.estresse || 0;
    const frase =
      v >= 85 ? "Você encerrou o expediente no limite — mãos pesadas, vista cansada. A comarca precisa das suas decisões amanhã também: passe no setor de saúde antes de vestir a toga de novo." :
      v >= 60 ? "Você saiu do fórum com o peso do dia nos ombros. Jantar em casa, dormir cedo: autocuidado também é dever do cargo (Res. CNJ 207)." :
      v >= 35 ? "Cansaço honesto de um dia inteiro de jurisdição. A toga pesou — mas você soube carregá-la." :
                "Você fechou o gabinete inteiro: decidiu, ouviu, bebeu água, respirou. Há quem chame isso de rotina; a Resolução 207 do CNJ chama de exemplo.";
    return `<p class="saldo-juiz"><strong>E você?</strong> ${esc(frase)}</p>`;
  }

  /* ---------- UM ANO DEPOIS ----------
     Quando os DOIS dias estão concluídos, a Gazeta publica o
     caderno especial: o que a Justiça da comarca mudou no longo
     prazo, cruzando flags dos dois saves (motor.flagsDeDia). */
  const NOTAS_FUTURO = [
    { se: (f1) => !!f1.protegida, tom: "bom",
      texto: "Marlene abriu um pequeno salão no quintal de casa. A cliente mais assídua é a técnica do CREAS — que hoje vai lá só para cortar o cabelo." },
    { se: (f1) => !!f1.mpuRevogada, tom: "grave",
      texto: "O processo de Ivan terminou em condenação. Marlene reconstruiu a vida em outra cidade — e conta que o mais difícil foi voltar a confiar que um papel da Justiça segura alguma coisa." },
    { se: (f1) => !!f1.acordoSofia, tom: "bom",
      texto: "Sofia passou de ano. No mural da escola, o desenho da família tem duas casas, um calendário — e ninguém no meio." },
    { se: (f1) => !!f1.thorFeliz, tom: "bom",
      texto: "Thor segue com duas casas, duas camas e uma guia em cada porta. O veterinário atesta: é o cachorro mais sociável da rua." },
    { se: (f1, f2) => !!f2.jonasLivre && !!f2.criancasAcolhidas, tom: "bom",
      texto: "Jonas trabalha na padaria do bairro — contratado pelo mesmo comerciante que registrou a ocorrência dos R$ 32. “Li a sentença inteira”, ele explica. “Aí entendi.”" },
    { se: (f1, f2) => !!f2.fiancaInutil || !!f2.jonasPreso, tom: "grave",
      texto: "O caso dos R$ 32 virou aula nos cursos de formação de magistrados da região — como exemplo do que a audiência de custódia existe para evitar." },
    { se: (f1, f2) => !!f2.liminarSaude, tom: "bom",
      texto: "O pai de Alice levou a filha no primeiro dia de aula do ano. O desenho do “super juiz” ganhou um irmão: agora há um de toda a família — com o pai no meio." },
    { se: (f1, f2) => !!f2.familiaAcolheu, tom: "bom",
      texto: "Caio chama a avó de vó-mãe até hoje. O CREAS encerrou o acompanhamento por “superação plena dos motivos” — o relatório final tem um foguete desenhado na última página." },
    { se: (f1, f2) => !!f2.acordoMoradia, tom: "bom",
      texto: "O “acordo-ponte” do despejo virou modelo: o Município firmou convênio com a vara para oferecer aluguel social em conciliações de moradia. Nenhuma família despejada desde então." },
    { se: (f1, f2) => !!f2.tutelaAlimentar, tom: "bom",
      texto: "Sr. Edivaldo voltou ao trabalho — como mestre de obras, dos que apontam do chão. O braço chega a 90 graus: “o suficiente pra apontar erro de prumo”, diz ele." },
    { se: (f1, f2) => !!f2.vitimaSegura, tom: "bom",
      texto: "Jandira faz o caminho do trabalho a pé, pela rua de sempre. Voltou a parecer pouco — e é exatamente assim que ela queria que parecesse." },
    { se: (f1, f2, f3) => !!f3.entregaLegal, tom: "bom",
      texto: "No aniversário de um ano da “noite da entrega”, uma carta sem remetente chegou ao fórum: “Ele tem família. Eu tenho paz. O senhor teve parte nas duas coisas.”" },
    { se: (f1, f2, f3) => !!f3.vidaSalva && !!f3.familiaRespeitada, tom: "bom",
      texto: "Davi começou a natação. Os pais mandaram a foto da primeira medalha — pelo mesmo cartório do plantão, “porque foi por aqui que ele continuou existindo”." },
    { se: (f1, f2, f3) => !!f3.internacaoComCuidado, tom: "bom",
      texto: "Ramiro segue em acompanhamento no CAPS e voltou a trabalhar na oficina do tio. D. Zenaide é hoje voluntária do grupo de familiares — “para ninguém mais ter que pedir ajuda achando que é polícia”." },
    { se: (f1, f2, f3) => !!f3.protegidaMadrugada, tom: "bom",
      texto: "Eunice terminou o curso de corte e costura e tirou a guarda definitiva do filho. A cópia da medida da meia-noite continua na mesinha de cabeceira — dobrada em quatro, do lado de dentro." },
    { se: (f1, f2, f3) => !!f3.riscoMadrugada || !!f3.adocaoDireta || !!f3.transfusaoNegada, tom: "grave",
      texto: "As decisões do plantão noturno que o Tribunal reformou viraram estudo de caso na Escola Judicial — na aula sobre o custo das horas." },
    { se: (f1, f2) => !!f1.manchaGrave || !!f2.manchaGrave, tom: "grave",
      texto: "O expediente da Corregedoria segue em tramitação. A defesa apresentou as informações; a comarca, a memória." }
  ];

  function umAnoDepois() {
    const M = TOGA.motor;
    if (!M.peekSave || !M.flagsDeDia) return "";
    const p1 = M.peekSave("dia1"), p2 = M.peekSave("dia2");
    if (!p1 || !p1.concluido || !p2 || !p2.concluido) return "";
    const f1 = M.flagsDeDia("dia1"), f2 = M.flagsDeDia("dia2"), f3 = M.flagsDeDia("dia3");
    const notas = NOTAS_FUTURO.filter(n => {
      try { return !!n.se(f1, f2, f3); } catch (e) { return false; }
    });
    if (!notas.length) return "";
    return `
      <h2 class="titulo-verso">Um ano depois</h2>
      <p class="intro-futuro">Com os dois dias de trabalho concluídos, a Gazeta publica o caderno
      especial: o que a Justiça desta comarca mudou — para melhor e para pior.</p>
      <ul class="vidas-tocadas um-ano-depois">
        ${notas.map(n => `<li class="tom-${n.tom || "bom"}">${esc(vox(n.texto))}</li>`).join("")}
      </ul>`;
  }

  function arvoreDecisoes() {
    const estado = TOGA.motor.estado;
    const historico = (estado && estado.historico) || [];
    return TOGA.motor.casosDaPauta().map(caso => {
      const passos = historico.filter(h => h.caso === caso.id);
      if (!passos.length) return "";
      const cenasVisitadas = new Set(passos.map(p => p.cena)).size;
      const totalCenas = Object.keys(caso.cenas || {}).length;
      const naoVistos = Math.max(0, totalCenas - cenasVisitadas);
      const selo = (estado.concluidos.find(c => c.id === caso.id) || {}).selo;
      return `
        <section class="ramo-caso">
          <h3>${esc(caso.hora)} — ${esc(caso.titulo)}
            ${selo ? `<span class="selo-resultado selo-${selo}">${esc(selo)}</span>` : ""}</h3>
          <ol>
            ${passos.map(p => `
              <li class="passo acerto-${p.acerto}">
                <span class="ponto"></span>
                <span class="rotulo">${esc(p.rotulo)}</span>
                <span class="tag-acerto selo-${p.acerto}">${NOMES_ACERTO[p.acerto] || p.acerto}</span>
              </li>`).join("")}
          </ol>
          ${naoVistos > 0 ? `<div class="nao-percorrido">⋯ ${naoVistos} cena${naoVistos > 1 ? "s" : ""} deste caso ficaram sem visitar — outros rumos eram possíveis.</div>` : ""}
        </section>`;
    }).join("");
  }

  function render(ep) {
    const alvo = document.getElementById("mural-manchetes");
    if (!alvo) return;
    alvo.classList.add("área-jornal");
    alvo.innerHTML = `
      <div class="jornal">
        <div class="jornal-miolo" id="jornal-miolo">
          <div class="pagina-jornal frente">
            ${capa(ep)}
            <button class="btn-secundario virar-pagina">Virar página — suas decisões ›</button>
          </div>
          <div class="pagina-jornal verso">
            ${vidasTocadas(ep)}
            ${umAnoDepois()}
            <h2 class="titulo-verso">O dia, decisão por decisão</h2>
            <div class="arvore-decisoes">${arvoreDecisoes()}</div>
            <button class="btn-secundario virar-pagina">‹ Voltar à capa</button>
          </div>
        </div>
      </div>`;
    const miolo = document.getElementById("jornal-miolo");
    let muralPendurado = false;
    alvo.querySelectorAll(".virar-pagina").forEach(b =>
      b.addEventListener("click", function () {
        if (TOGA.audio) TOGA.audio.tocar("papel");
        miolo.classList.toggle("virado");
        // na 1ª virada, as molduras são PENDURADAS uma a uma na parede
        if (miolo.classList.contains("virado") && !muralPendurado) {
          muralPendurado = true;
          pendurarMural(alvo);
        }
      }));

    // o mural do gabinete: desenha as artes e liga o clique-para-ampliar
    alvo.querySelectorAll("canvas[data-arte]").forEach(cv => {
      const fn = TOGA.arte && TOGA.arte[cv.dataset.arte];
      if (fn) cv.getContext("2d").drawImage(fn(), 0, 0, cv.width, cv.height);
    });
    alvo.querySelectorAll("[data-lembranca]").forEach(btn =>
      btn.addEventListener("click", function () {
        TOGA.lembrancas.ver(lembrancasAtivas[+btn.dataset.lembranca]);
      }));
  }

  /* As molduras entram uma a uma — com a batidinha de quem
     prega um quadro na parede do gabinete. */
  function pendurarMural(alvo) {
    const reduz = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const molduras = alvo.querySelectorAll(".moldura-mural");
    if (reduz || !molduras.length) return;
    molduras.forEach((m, i) => {
      m.classList.add("pendurando");
      setTimeout(() => {
        m.classList.remove("pendurando");
        m.classList.add("pendurada");
        if (TOGA.audio) TOGA.audio.tocar(i === 0 ? "martelo" : "papel");
      }, 500 + i * 340);
    });
  }

  return { render: render };
})();
