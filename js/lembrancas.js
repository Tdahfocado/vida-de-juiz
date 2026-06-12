/* ============================================================
   TOGA — lembrancas.js : O REGISTRO das lembranças
   ------------------------------------------------------------
   A lista ÚNICA do que as decisões deixam no gabinete do juiz,
   dirigida pelas flags do save. SEM Three.js: este arquivo é
   só DADOS, e por isso vale para os dois mundos:

   - o modo 3D (lembrancas3d.js) cria os objetos físicos;
   - o modo 2D (epilogo.js) monta o mural do gabinete com as
     MESMAS artes (js/arte.js);
   - o validador confere se cada caso deixa rastro tangível.

   Campos: { id, se(flags), titulo, rotulo, arte? (nome em
   TOGA.arte) | texto? (citação) }                            */

window.TOGA = window.TOGA || {};

TOGA.lembrancas = (function () {

  const REGISTRO = [

    /* ===== Dia 1 ===== */
    { id: "fotoThor",
      se: function (f) { return !!f.thorFeliz; },
      titulo: "Thor — 1ª semana do acordo",
      rotulo: "olhar a foto na parede",
      arte: "fotoThor" },

    { id: "mangas",
      se: function (f) { return !!f.pazVizinhos; },
      titulo: "A cesta de mangas",
      rotulo: "olhar a cesta de mangas",
      texto: "🥭 “Da árvore da divisa. Metade de cada um. Sem processo.” Jurisprudência não dá fruto; acordo, sim." },

    { id: "plaquinhaFrajola",
      se: function (f) { return !!f.pactoGatos; },
      titulo: "O muro do Frajola",
      rotulo: "olhar a foto da plaquinha",
      arte: "plaquinhaFrajola" },

    /* ===== Dia 2 ===== */
    { id: "cartaJonas",
      se: function (f) { return !!f.jonasLivre && !!f.criancasAcolhidas; },
      titulo: "A carta do filho de Jonas",
      rotulo: "ler a carta sobre a mesa",
      arte: "cartaJonas" },

    { id: "desenhoAlice",
      se: function (f) { return !!f.liminarSaude; },
      titulo: "O desenho da Alice",
      rotulo: "olhar o desenho da Alice",
      arte: "desenhoSuperJuiz" },

    { id: "desenhoFoguete",
      se: function (f) { return !!f.familiaAcolheu; },
      titulo: "O foguete do Caio",
      rotulo: "olhar o desenho do foguete",
      arte: "desenhoFoguete" },

    { id: "comprovanteAluguel",
      se: function (f) { return !!f.acordoMoradia; },
      titulo: "O primeiro aluguel social",
      rotulo: "ler o comprovante com o clipe",
      arte: "comprovanteAluguel" },

    { id: "fotoFisioterapia",
      se: function (f) { return !!f.tutelaAlimentar; },
      titulo: "Sr. Edivaldo, 1ª sessão",
      rotulo: "olhar a foto da fisioterapia",
      arte: "fotoFisioterapia" },

    { id: "bilheteJandira",
      se: function (f) { return !!f.vitimaSegura; },
      titulo: "O recado de Jandira",
      rotulo: "ler o bilhete transcrito",
      arte: "bilheteJandira" },

    /* ===== Dia 3 — Plantão Noturno ===== */
    { id: "desenhoDino",
      se: function (f) { return !!f.vidaSalva && !!f.familiaRespeitada; },
      titulo: "Davi e o dino — a família junta",
      rotulo: "olhar o desenho do dinossauro",
      arte: "desenhoDino" },

    { id: "cartaEntrega",
      se: function (f) { return !!f.entregaLegal; },
      titulo: "Sem remetente — um ano depois",
      rotulo: "ler a carta sem remetente",
      arte: "cartaEntrega" },

    { id: "certidaoMadrugada",
      se: function (f) { return !!f.protegidaMadrugada; },
      titulo: "A certidão da 01h10",
      rotulo: "reler a certidão da madrugada",
      arte: "certidaoMadrugada" },

    { id: "fotoIracema",
      se: function (f) { return !!f.feminicidioCondenado && !!f.vitimaProtegidaPlenario; },
      titulo: "A fotografia da formatura",
      rotulo: "olhar a fotografia de Iracema",
      arte: "fotoIracema" },

    { id: "fotoTurmaEsmec",
      se: function () { return !!(TOGA.atividades && TOGA.atividades.concluida("esmec")); },
      titulo: "A turma da ESMEC",
      rotulo: "olhar a foto da turma da ESMEC",
      arte: "fotoTurmaEsmec" },

    /* ===== Despachos e reencontros ===== */
    { id: "certidaoSebastiana",
      se: function (f) { return !!f.cidadaVisivel; },
      titulo: "A primeira via de Sebastiana",
      rotulo: "olhar a certidão emoldurada",
      arte: "certidaoLembranca" },

    { id: "cartaMarlene",
      se: function (f) { return !!f.d1_protegida; },
      titulo: "A carta de Marlene, oito meses depois",
      rotulo: "ler a carta de Marlene",
      arte: "cartaMarlene" },

    /* ===== A parede de honrarias (conquistas institucionais) =====
       Estas não dependem das flags do dia: são PERMANENTES —
       lêem o registro de conquistas (js/conquistas.js).      */
    { id: "elogioFuncional",
      se: function () { return !!(TOGA.conquistas && TOGA.conquistas.tem("elogiado")); },
      titulo: "Elogio funcional — Corregedoria",
      rotulo: "reler o elogio funcional",
      arte: "elogioFuncional" },

    { id: "seloExcelencia",
      se: function () { return !!(TOGA.conquistas && TOGA.conquistas.tem("excelencia")); },
      titulo: "Selo Excelência na Prestação Jurisdicional",
      rotulo: "olhar a placa de Excelência",
      arte: "seloExcelencia" },

    { id: "certificadoPalestra",
      se: function (f) { return !!f.palestraAceita || !!(TOGA.conquistas && TOGA.conquistas.tem("palestrante")); },
      titulo: "Palestra na Escola Judicial",
      rotulo: "olhar o certificado da palestra",
      arte: "certificadoPalestra" },

    { id: "placaComunidade",
      se: function () { return !!(TOGA.conquistas && TOGA.conquistas.tem("comunidade")); },
      titulo: "O abaixo-assinado do bairro",
      rotulo: "ler o agradecimento da comunidade",
      arte: "placaComunidade" },

    { id: "agradecimentoTJCE",
      se: function () { return !!(TOGA.conquistas && TOGA.conquistas.tem("capacitadorTJCE")); },
      titulo: "Agradecimento — Des. Raimundo Nonato (TJCE)",
      rotulo: "reler o agradecimento do TJCE",
      arte: "agradecimentoTJCE" },

    { id: "placaESMEC",
      se: function () { return !!(TOGA.conquistas && TOGA.conquistas.tem("docenteESMEC")); },
      titulo: "Docente permanente — ESMEC",
      rotulo: "olhar a placa da ESMEC",
      arte: "placaESMEC" },

    /* ===== O peso ===== */
    { id: "corregedoria",
      se: function (f) { return !!f.manchaGrave; },
      titulo: "Ofício da Corregedoria",
      rotulo: "ler o ofício sobre a mesa",
      texto: "📄 CORREGEDORIA — “Solicita informações, em 48 horas, sobre os fundamentos da decisão.” O papel pesa mais que a mesa." }
  ];

  /* as lembranças acesas pelas flags atuais */
  function ativas(flags) {
    return REGISTRO.filter(function (i) { return i.se(flags || {}); });
  }

  /* visualizador em tela cheia — o modo 2D e o 3D abrem o MESMO modal */
  function ver(item) {
    if (!item || !item.arte || !TOGA.arte || !TOGA.arte[item.arte]) return;
    let modal = document.getElementById("modal-lembranca");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "modal-lembranca";
      modal.innerHTML = '<div class="moldura-modal"><h3></h3><canvas width="512" height="512"></canvas>' +
        '<p class="suave">clique para fechar</p></div>';
      modal.addEventListener("click", function () { modal.hidden = true; });
      document.body.appendChild(modal);
    }
    modal.querySelector("h3").textContent = item.titulo || "";
    const cv = modal.querySelector("canvas");
    const ctx = cv.getContext("2d");
    ctx.clearRect(0, 0, 512, 512);
    ctx.drawImage(TOGA.arte[item.arte](), 0, 0, 512, 512);
    modal.hidden = false;
  }

  /* lista textual curta (o "Vidas tocadas" do epílogo usa) */
  function listar(flags) {
    return ativas(flags).map(function (i) { return i.rotulo.replace(/^olhar |^ler /, ""); });
  }

  return { REGISTRO: REGISTRO, ativas: ativas, listar: listar, ver: ver };
})();
