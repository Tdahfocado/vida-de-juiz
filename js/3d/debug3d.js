/* ============================================================
   TOGA 3D — debug3d.js : TESTAR O MUNDO SEM ANDAR NELE
   ------------------------------------------------------------
   Ferramentas para o bot de teste e para depuração no console:
   teleporte instantâneo, disparo programático de interagíveis
   e um "modo sem render" que valida o fluxo lógico completo
   mesmo em ambientes sem GPU (CI/headless).

   Nada aqui roda durante o jogo normal — é só uma porta de
   serviço, como a entrada dos fundos do fórum.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.debug3d = (function () {
  if (!window.THREE) return {};

  return {
    /* teleporte("gabinete"|"corredor"|"sala"|"bancada"|{x,z}) */
    teleporte: function (alvo) {
      TOGA.cena3d.garantirIniciado();
      let p = null;
      if (typeof alvo === "string") {
        const pontos = TOGA.mundo3d.pontos;
        p = pontos["spawn" + alvo[0].toUpperCase() + alvo.slice(1)] || pontos[alvo];
      } else p = alvo;
      if (!p) return false;
      TOGA.controles3d.teleportar(p.x, p.z, p.angulo || 0);
      return true;
    },

    interagir: function (id) { return TOGA.interacao3d.disparar(id); },

    listarInteragiveis: function () { return TOGA.interacao3d.listar(); },

    pularAnimacoes: function (sim) { TOGA.cena3d.animacoesRapidas = sim !== false; },

    /* inicializa o mundo SEM renderer (valida lógica sem GPU) */
    modoSemRender: function () { TOGA.cena3d.garantirIniciado(true); },

    /* Ensaio de elenco: percorre cada personagem do caso atual
       em todas as emoções (poses + câmera + spotlight), para
       inspeção visual. Retorna uma função que interrompe.     */
    ensaiarEmocoes: function (intervaloMs) {
      const e = TOGA.motor.estado;
      if (!e) { console.warn("ensaiarEmocoes: inicie um jogo antes."); return; }
      const pauta = TOGA.motor.casosDaPauta();
      const caso = pauta[Math.min(e.casoAtual, pauta.length - 1)];
      const emocoes = Object.keys(TOGA.cena2d.EXPRESSOES);
      const fila = [];
      caso.personagens.forEach(function (p) {
        emocoes.forEach(function (em) { fila.push([p.id, em]); });
      });
      let i = 0;
      const timer = setInterval(function () {
        if (i >= fila.length) {
          clearInterval(timer);
          TOGA.cena.falar(null);
          console.log("ensaiarEmocoes: concluído");
          return;
        }
        const par = fila[i++];
        TOGA.cena.falar(par[0]);
        TOGA.cena.setEmocao(par[0], par[1]);
        console.log("ensaio:", par[0], "→", par[1]);
      }, intervaloMs || 800);
      return function parar() { clearInterval(timer); };
    },

    /* Joga o dia inteiro sozinho (2D ou 3D), sempre escolhendo a
       opção de índice `escolha` (ou a primeira desbloqueada).
       Com render ligado vira um demo automático; com
       modoSemRender + pularAnimacoes valida o fluxo em segundos. */
    botDia: function (escolha, pautaId) {
      const self = this;
      if (self._botTimer) clearInterval(self._botTimer);
      escolha = escolha || 0;
      pautaId = pautaId || "dia1";
      self.pularAnimacoes(true);
      try { localStorage.setItem("toga.tutorial.v1", "1"); } catch (e) {}  // bot não assiste tutorial
      TOGA.motor.apagarSave(pautaId);                                      // bot sempre começa do zero
      function clica(sel) {
        const b = document.querySelector(sel);
        if (b && !b.disabled) { b.click(); return true; }
        return false;
      }
      self._botTimer = setInterval(function () {
        const tela = (document.querySelector(".tela.ativa") || {}).id;
        if (tela === "tela-epilogo") { self.pararBot(); console.log("botDia: dia concluído"); return; }
        if (tela === "tela-menu") { clica('[data-pauta="' + pautaId + '"]'); return; }
        if (tela === "tela-pauta") {
          if (TOGA.motor.fimDaPauta()) TOGA.ui.mostrarEpilogo();
          else TOGA.ui.abrirAutos();
          return;
        }
        if (tela === "tela-autos") { clica("#btn-iniciar-audiencia"); return; }
        if (tela === "tela-desfecho") { clica("#btn-continuar-desfecho"); return; }
        if (tela === "tela-interludio") { clica("#btn-continuar-interludio"); return; }
        if (tela === "tela-mundo") {
          const m = TOGA.motor;
          const pend = m.interludiosPendentes();
          if (pend.length) {
            const alvo = (TOGA.cena3d.alvoDoInterludio && TOGA.cena3d.alvoDoInterludio(pend[0])) || "assessora";
            TOGA.interacao3d.disparar(alvo);
            return;
          }
          if (m.fimDaPauta()) { TOGA.interacao3d.disparar("saida"); return; }
          if (TOGA.ui.audienciaPronta()) {
            if (!TOGA.interacao3d.disparar("bancada")) TOGA.interacao3d.disparar("bancadaJuri");
            return;
          }
          TOGA.interacao3d.disparar("autos");
          return;
        }
        if (tela === "tela-audiencia") {
          const opcoes = document.querySelectorAll("#painel-decisao .opcao:not([disabled])");
          if (opcoes.length) { opcoes[Math.min(escolha, opcoes.length - 1)].click(); return; }
          if (clica("#painel-decisao .btn")) return;
          clica("#caixa-fala");
        }
      }, 200);
      return "botDia rodando — TOGA.debug3d.pararBot() interrompe";
    },

    /* ---- atalhos das atividades externas (exigem o modo de
       teste liberado por senha: TOGA.atividades.liberarTudo) ---- */
    irLocal: function (onde) {
      if (!TOGA.atividades || !TOGA.atividades.liberadas) {
        return "modo de teste desligado — TOGA.atividades.liberarTudo(senha) primeiro.";
      }
      if (onde === "rua") { TOGA.cena3d.entrarRua(); return "na rua."; }
      if (onde === "esmec") { TOGA.cena3d.entrarEsmec(); return "na ESMEC."; }
      return 'use "rua" ou "esmec".';
    },
    viagem: function (turbo) {
      if (!TOGA.atividades || !TOGA.atividades.liberadas) {
        return "modo de teste desligado — TOGA.atividades.liberarTudo(senha) primeiro.";
      }
      if (turbo) TOGA.config._turboViagem = turbo;
      TOGA.cena3d.dirigirEsmec();
      return "ao volante" + (turbo ? " (turbo ×" + turbo + ")" : "") + ".";
    },

    pararBot: function () {
      if (this._botTimer) { clearInterval(this._botTimer); this._botTimer = null; }
    },

    /* Mede o desempenho: loga o FPS médio a cada 2 s.
       Retorna uma função que desliga o medidor.        */
    fps: function () {
      let quadros = 0, acumulado = 0;
      function medidor(dt) {
        quadros++; acumulado += dt;
        if (acumulado >= 2) {
          console.log("fps médio:", (quadros / acumulado).toFixed(1));
          quadros = 0; acumulado = 0;
        }
      }
      TOGA.nucleo3d.aoFrame(medidor);
      return function parar() { TOGA.nucleo3d.removerAoFrame(medidor); };
    },

    estado: function () {
      return {
        controle: TOGA.controles3d.estado(),
        emAudiencia: TOGA.cena3d.emAudiencia,
        telaAtiva: (document.querySelector(".tela.ativa") || {}).id || null,
        renderPausado: TOGA.nucleo3d.pausado()
      };
    }
  };
})();
