/* ============================================================
   TOGA — minijogos.js : OS MINIJOGOS DA ACM
   ------------------------------------------------------------
   Três minijogos esportivos no Clube dos Magistrados, todos
   jogados COM e CONTRA juízas e juízes REAIS, sorteados da
   Relação de Magistrados do TJCE (TOGA.juizesTJCE):

     • 🏖 Beach Tennis — dupla, gestão de fôlego (ataque cansa).
     • ⚽ Pênaltis      — você cobra E defende; 5 cada, morte súbita.
     • 🏊 Natação 200m  — corrida de raia, gestão de energia.

     Vencer (ou só jogar) alivia o estresse. Painel reaproveita o
     visual das "visitas" (.painel-visita / .cartao-visita).
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.minijogos = (function () {
  const J = function () { return TOGA.juizesTJCE; };

  let painel = null, emJogo = false;

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function abrir() {
    emJogo = true;
    document.body.classList.add("em-visita");
    painel = el("div", "painel-visita minijogo");
    document.body.appendChild(painel);
  }
  function fechar() {
    if (painel) { painel.remove(); painel = null; }
    document.body.classList.remove("em-visita");
    emJogo = false;
  }
  function sortear(n) {
    const j = J();
    return (j && j.sortearJuizes) ? j.sortearJuizes(n)
      : Array.from({ length: n }, function (_, i) { return { nome: "Colega " + (i + 1), lotacao: "Comarca" }; });
  }
  function prim(nome) { return nome.split(" ")[0]; }
  function nomeLot(j) { return j.nome + " (" + j.lotacao + ")"; }
  function rnd() { return Math.random(); }
  function escolha(arr) { return arr[Math.floor(rnd() * arr.length)]; }

  /* render de uma rodada: título, placar, texto, prompt e opções.
     opcoes = [{ rotulo, onClick }]  (sem opções → nada).            */
  function mostrar(titulo, placarHtml, texto, prompt, opcoes) {
    if (!painel) return;
    painel.innerHTML = "";
    const cartao = el("div", "cartao-visita");
    cartao.appendChild(el("h3", "", titulo));
    if (placarHtml) cartao.appendChild(el("div", "placar-mini", placarHtml));
    if (texto) cartao.appendChild(el("p", "texto-visita", texto));
    if (prompt) cartao.appendChild(el("p", "prompt-visita", prompt));
    (opcoes || []).forEach(function (op) {
      const b = el("button", "opcao opcao-visita", op.rotulo);
      b.addEventListener("click", op.onClick);
      cartao.appendChild(b);
    });
    painel.appendChild(cartao);
  }

  function aplicarFim(venceu, jogo, msg, aoFim) {
    const M = TOGA.motor;
    if (M && M.estado) {
      M.alterarEstresse(venceu ? -9 : -5);
      M.estado.flags = M.estado.flags || {};
      if (venceu) M.estado.flags["_mini_" + jogo] = true;
      M.salvar();
    }
    if (TOGA.ui && TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
    if (TOGA.conquistas) TOGA.conquistas.avaliar("minijogo-acm", { jogo: jogo, venceu: venceu });
    if (TOGA.cena3d && TOGA.cena3d.toastMundo) TOGA.cena3d.toastMundo(msg);
    if (aoFim) aoFim({ venceu: venceu });
  }

  function botaoSair(aoFim) {
    return { rotulo: "↩ deixar para depois", onClick: function () { fechar(); if (aoFim) aoFim({ venceu: false, saiu: true }); } };
  }

  /* ============== 🏖 BEACH TENNIS (dupla) ============== */
  function beachTennis(aoFim) {
    if (emJogo) return; abrir();
    const js = sortear(3), parc = js[0], a1 = js[1], a2 = js[2];
    let voce = 0, eles = 0, energia = 100, ponto = 0;
    const ALVO = 4;
    function placar() {
      return "🏖 BEACH TENNIS — game até " + ALVO +
        "<br><b>Você + " + prim(parc.nome) + "</b> &nbsp;<b>" + voce + " × " + eles + "</b>&nbsp; <b>" + prim(a1.nome) + " + " + prim(a2.nome) + "</b>" +
        "<br>🔋 fôlego: " + Math.round(energia) + "%";
    }
    function intro() {
      mostrar("🏖 Beach Tennis na ACM", placar(),
        "Areia fofa, rede esticada, sol a pino. Você forma dupla com " + nomeLot(parc) +
        " contra " + prim(a1.nome) + " e " + prim(a2.nome) + ". Ataque potente cansa; devolver seguro recupera o fôlego — administre, Excelência.",
        "Pronto para o primeiro saque?",
        [{ rotulo: "🎾 Começar o game", onClick: pontoFn }, botaoSair(aoFim)]);
    }
    function pontoFn() {
      mostrar("🏖 Beach Tennis — ponto " + (ponto + 1), placar(),
        energia < 35 ? "Você está ofegante; o braço pesa no smash." : "Pernas firmes na areia, bola subindo.",
        "Que bola você joga?",
        [{ rotulo: "💥 Ataque — smash potente (cansa)", onClick: function () { resolver("ataque"); } },
         { rotulo: "🎯 Jogada colocada (equilíbrio)", onClick: function () { resolver("equilibrio"); } },
         { rotulo: "🛡 Devolução segura (recupera fôlego)", onClick: function () { resolver("defesa"); } }]);
    }
    function resolver(tipo) {
      let p;
      if (tipo === "ataque") { p = 0.60 + (energia - 50) * 0.0038; energia = Math.max(0, energia - 18); }
      else if (tipo === "equilibrio") { p = 0.51; energia = Math.max(0, energia - 6); }
      else { p = 0.44; energia = Math.min(100, energia + 13); }
      p = Math.max(0.16, Math.min(0.86, p));
      const ganhou = rnd() < p;
      if (ganhou) voce++; else eles++;
      ponto++;
      const txt = ganhou
        ? escolha(["💢 Ponto SEU! " + (tipo === "ataque" ? "Smash que levantou areia — " + prim(a1.nome) + " nem viu passar." : tipo === "defesa" ? prim(a2.nome) + " forçou demais e mandou para fora." : "Colocadinha no cantinho, impecável."),
                   "✅ Ponto da sua dupla! " + prim(parc.nome) + " bate na sua mão: “é isso!”."])
        : escolha(["😬 Ponto deles. " + (tipo === "ataque" ? "O smash bateu na fita e voltou." : prim(a1.nome) + " devolveu numa paralela perfeita."),
                   "😅 Ponto para " + prim(a1.nome) + " e " + prim(a2.nome) + ". A dupla deles está afiada."]);
      const fim = (voce >= ALVO || eles >= ALVO);
      mostrar("🏖 Beach Tennis", placar(), txt, null,
        [{ rotulo: fim ? "ver o resultado ▸" : "próximo ponto ▸", onClick: fim ? fimJogo : pontoFn }]);
    }
    function fimJogo() {
      const v = voce > eles;
      fechar();
      aplicarFim(v, "beachTennis",
        v ? "🏆 Game seu, " + voce + "×" + eles + "! " + prim(parc.nome) + " ergue a raquete: “dupla afiada, Excelência!”. " + prim(a1.nome) + " e " + prim(a2.nome) + " já marcam a revanche."
          : "🤝 Game para " + prim(a1.nome) + " e " + prim(a2.nome) + ", " + eles + "×" + voce + ". Você tira o boné e aperta a mão de todos — na ACM, o placar some, a parceria fica. (estresse aliviado)", aoFim);
    }
    intro();
  }

  /* ============== ⚽ PÊNALTIS (cobrar e defender) ============== */
  function penaltis(aoFim) {
    if (emJogo) return; abrir();
    const js = sortear(2), bat = js[0], gol = js[1];
    const CANTOS = ["esquerda", "meio", "direita"];
    let gv = 0, ge = 0, rod = 0; const N = 5;
    function placar() {
      return "⚽ PÊNALTIS — melhor de " + N +
        "<br><b>Você " + gv + " × " + ge + " Seleção de " + prim(bat.nome) + "</b>" +
        "<br>cobrança " + (rod + 1) + (rod >= N ? " (morte súbita)" : "/" + N);
    }
    function chutarFase() {
      mostrar("⚽ Sua cobrança", placar(),
        "Na trave, o goleiro " + nomeLot(gol) + " salta de um lado para o outro, tentando te ler.",
        "Onde você bate?",
        CANTOS.map(function (c) { return { rotulo: "🥅 Chutar à " + c, onClick: function () { chutar(c); } }; }));
    }
    function chutar(c) {
      const pulo = escolha(CANTOS);
      const gol_ = (c !== pulo) ? true : (rnd() < 0.35);
      if (gol_) gv++;
      const txt = gol_
        ? escolha(["⚽ GOOOL! " + (c === pulo ? "No cantinho, sem chance pro goleiro." : "Você deslocou " + prim(gol.nome) + " e mandou no canto oposto."),
                   "⚽ É GOL! A torcida do clube vai à loucura."])
        : "🧤 DEFENDEU! " + prim(gol.nome) + " voou no " + pulo + " e espalmou. Que defesão.";
      mostrar("⚽ Pênaltis", placar(), txt, null, [{ rotulo: "agora você defende ▸", onClick: defesaFase }]);
    }
    function defesaFase() {
      mostrar("⚽ Sua defesa", placar(),
        prim(bat.nome) + " (" + bat.lotacao + ") ajeita a bola, respira fundo e mira. Agora o goleiro é VOCÊ.",
        "Para que canto você se atira?",
        CANTOS.map(function (c) { return { rotulo: "🧤 Pular à " + c, onClick: function () { defender(c); } }; }));
    }
    function defender(c) {
      const chute = escolha(CANTOS);
      const defendeu = (c === chute) ? (rnd() < 0.65) : false;
      if (!defendeu) ge++;
      const txt = defendeu
        ? "🧤 PEGOU! Você adivinhou o canto de " + prim(bat.nome) + " e fez a defesa do jogo!"
        : "⚽ Eles marcam. " + prim(bat.nome) + (c === chute ? " bateu forte demais no seu canto." : " mandou no " + chute + " e você foi pro outro lado.");
      rod++;
      const decidido = rod >= N && gv !== ge;
      const seguir = (rod >= N && gv === ge) ? "morte súbita — cobrar de novo ▸" : (rod >= N ? "resultado ▸" : "próxima cobrança ▸");
      mostrar("⚽ Pênaltis", placar() + (rod >= N && gv === ge ? "<br><b>EMPATE — vai para a morte súbita!</b>" : ""),
        txt, null, [{ rotulo: seguir, onClick: decidido ? finalizar : chutarFase }]);
    }
    function finalizar() {
      const v = gv > ge;
      fechar();
      aplicarFim(v, "penaltis",
        v ? "🏆 Vitória nos pênaltis, " + gv + "×" + ge + "! Você cobrou e defendeu como gente grande. " + prim(bat.nome) + " ri: “falta o senhor no nosso time, Excelência.”"
          : "🤝 A seleção de " + prim(bat.nome) + " levou, " + ge + "×" + gv + ". Você cumprimenta o goleiro " + prim(gol.nome) + " — bola, suor e nenhuma sentença. (estresse aliviado)", aoFim);
    }
    chutarFase();
  }

  /* ============== 🏊 NATAÇÃO 200m (gestão de energia) ============== */
  function natacao(aoFim) {
    if (emJogo) return; abrir();
    const js = sortear(2), r1 = js[0], r2 = js[1];
    const N = 4;
    let energia = 100, tempo = 0, seg = 0;
    const t1 = [], t2 = [];
    for (let i = 0; i < N; i++) { t1.push(29.5 + rnd() * 3.5); t2.push(29.5 + rnd() * 3.5); }
    function placar() {
      return "🏊 NATAÇÃO 200m — raia 4" +
        "<br>🔋 energia: " + Math.round(energia) + "% · trecho " + Math.min(seg + 1, N) + "/" + N +
        "<br>⏱ seu tempo: " + tempo.toFixed(1) + "s";
    }
    function intro() {
      mostrar("🏊 Corrida na piscina da ACM", placar(),
        "Quatro raias, 200 metros. Nas raias ao lado, " + nomeLot(r1) + " e " + prim(r2.nome) +
        ". Sprint nada mais rápido, mas queima energia; poupar recupera o fôlego. Sem energia, vem a cãibra. Quem tocar a borda primeiro vence.",
        "Pronto no bloco de partida?",
        [{ rotulo: "🏊 Mergulhar!", onClick: trecho }, botaoSair(aoFim)]);
    }
    function trecho() {
      mostrar("🏊 Trecho " + (seg + 1) + "/" + N, placar(),
        energia < 25 ? "Os braços pesam, uma cãibra ronda a panturrilha." : "Braçadas firmes, a água espelha o sol.",
        "Como você nada este trecho?",
        [{ rotulo: "⚡ Sprint (rápido, cansa muito)", onClick: function () { nadar("sprint"); } },
         { rotulo: "🌊 Ritmo (constante)", onClick: function () { nadar("ritmo"); } },
         { rotulo: "😮‍💨 Poupar (recupera fôlego)", onClick: function () { nadar("poupar"); } }]);
    }
    function nadar(tipo) {
      let t, txt;
      if (tipo === "sprint") {
        if (energia > 15) { t = 26.8 + rnd() * 1.4; txt = "⚡ Explosão na água — você abre vantagem!"; }
        else { t = 33.5 + rnd() * 2; txt = "🥵 Tentou o sprint sem fôlego e travou — cãibra! Perdeu tempo."; }
        energia = Math.max(0, energia - 26);
      } else if (tipo === "ritmo") { t = 30 + rnd() * 1.4; txt = "🌊 Braçada constante, respiração no compasso."; energia = Math.max(0, energia - 9); }
      else { t = 33 + rnd() * 1.4; txt = "😮‍💨 Você alivia o ritmo e recupera o fôlego para o final."; energia = Math.min(100, energia + 14); }
      tempo += t; seg++;
      const fim = seg >= N;
      mostrar("🏊 Natação", placar(), txt, null,
        [{ rotulo: fim ? "🏁 chegada ▸" : "próximo trecho ▸", onClick: fim ? finalizar : trecho }]);
    }
    function finalizar() {
      const tt1 = t1.reduce(function (a, b) { return a + b; }, 0);
      const tt2 = t2.reduce(function (a, b) { return a + b; }, 0);
      const arr = [{ n: "Você", t: tempo, eu: true }, { n: prim(r1.nome), t: tt1 }, { n: prim(r2.nome), t: tt2 }]
        .sort(function (a, b) { return a.t - b.t; });
      const pos = arr.findIndex(function (x) { return x.eu; }) + 1;
      fechar();
      const v = pos === 1;
      const msg = v
        ? "🥇 1º LUGAR, " + tempo.toFixed(1) + "s! Você toca a borda primeiro. " + prim(r1.nome) + ", ofegante: “onde o senhor treina, Excelência?”"
        : pos === 2
          ? "🥈 2º lugar por pouco — " + tempo.toFixed(1) + "s, atrás de " + arr[0].n + ". Revanche marcada na próxima visita."
          : "🥉 3º lugar — " + tempo.toFixed(1) + "s. Não venceu, mas o cloro levou o estresse junto: a pauta ficou lá fora. (estresse aliviado)";
      aplicarFim(v, "natacao", msg, aoFim);
    }
    intro();
  }

  return {
    beachTennis: beachTennis,
    penaltis: penaltis,
    natacao: natacao,
    get emJogo() { return emJogo; }
  };
})();
