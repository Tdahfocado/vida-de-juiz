/* ============================================================
   TOGA — ui.js : a INTERFACE
   ------------------------------------------------------------
   Este arquivo é a ponte entre o jogador e o jogo:
   - mostra/esconde telas;
   - "digita" as falas (efeito máquina de escrever);
   - desenha os cartões de decisão;
   - dispara carimbos, toasts e o painel do Modo Estudo;
   - conduz você de cena em cena até o epílogo.

   Ele NÃO contém regras (motor.js) nem desenhos (cena.js):
   só apresentação. Essa separação em camadas é o mesmo
   princípio de arquitetura usado em sistemas grandes.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.ui = (function () {
  const $ = sel => document.querySelector(sel);
  const M = () => TOGA.motor;
  // vocativos adaptados ao gênero do juiz (js/juiz.js):
  // adapt() vale em qualquer fala ("doutor"); adaptDir() só nos
  // textos SEMPRE dirigidos ao juiz (interlúdios, corredor, despachos)
  const adapt = t => (TOGA.juiz ? TOGA.juiz.adaptar(t) : t);
  const adaptDir = t => (TOGA.juiz ? TOGA.juiz.adaptarDireto(t) : t);

  /* ---------- Navegação entre telas ---------- */
  function modo3d() { return document.body.classList.contains("modo-3d"); }

  function mostrarTela(id) {
    document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
    $("#" + id).classList.add("ativa");
    window.scrollTo({ top: 0 });
    if (TOGA.audio && id === "tela-menu") TOGA.audio.ambiente(false);

    // No modo 3D: telas que COBREM o mundo pausam o render;
    // os controles de andar só valem no próprio mundo.
    if (modo3d() && TOGA.nucleo3d && TOGA.nucleo3d.pausar) {
      const cobre = (id === "tela-menu" || id === "tela-epilogo" || id === "tela-autos" ||
                     id === "tela-despacho" || id === "tela-gabarito");
      if (cobre) TOGA.nucleo3d.pausar(); else TOGA.nucleo3d.retomar();
      if (TOGA.controles3d && TOGA.controles3d.ativar) {
        if (id === "tela-mundo") TOGA.controles3d.ativar();
        else TOGA.controles3d.desativar();
      }
    }
  }

  /* ---------- HUD: relógio + barras de reputação ----------
     As barras "reagem": flash dourado/vinho no trilho e um
     número fantasma (+6 / −4) flutuando ao lado da mudança. */
  let repAnterior = null;
  function atualizarHUD() {
    const e = M().estado;
    $("#hud-relogio").textContent = M().horaTexto();
    const relogioMundo = $("#hud-relogio-mundo");
    if (relogioMundo) relogioMundo.textContent = M().horaTexto();
    TOGA.cena.ajustarRelogio(e.minutos);
    [["tec", "#barra-tec"], ["hum", "#barra-hum"], ["cel", "#barra-cel"], ["imp", "#barra-imp"]]
      .forEach(([k, sel]) => {
        const valor = e.reputacao[k];
        $(sel).style.width = valor + "%";
        $(sel + "-val").textContent = valor;
        const eixoMeter = $(sel).closest(".barra-eixo");
        if (eixoMeter) eixoMeter.setAttribute("aria-valuenow", valor);
        if (repAnterior && repAnterior[k] !== valor && !(e.modoProva)) {
          const delta = valor - repAnterior[k];
          const eixo = $(sel).closest(".barra-eixo");
          eixo.classList.remove("subiu", "desceu");
          void eixo.offsetWidth;                     // reinicia a animação
          eixo.classList.add(delta > 0 ? "subiu" : "desceu");
          const fantasma = document.createElement("span");
          fantasma.className = "delta-fantasma " + (delta > 0 ? "positivo" : "negativo");
          fantasma.textContent = (delta > 0 ? "+" : "") + delta;
          eixo.appendChild(fantasma);
          setTimeout(() => { fantasma.remove(); eixo.classList.remove("subiu", "desceu"); }, 1400);
        }
      });
    repAnterior = Object.assign({}, e.reputacao);

    // barra de estresse + visão turva no nível crítico
    atualizarEstresse();
  }

  let turvaAtiva = false;
  let colapsoArmado = false;     // trava de reentrância da emergência aos 100
  function atualizarEstresse() {
    const e = M().estado;
    if (!e) return;
    const v = e.estresse || 0;
    const barra = $("#barra-est");
    if (barra) {
      barra.style.width = v + "%";
      $("#barra-est-val").textContent = v;
      const eixo = barra.closest(".barra-eixo");
      eixo.setAttribute("aria-valuenow", v);
      eixo.classList.toggle("alerta", v >= 60 && v < 85);
      eixo.classList.toggle("critico", v >= 85);
    }
    ["#estresse-mundo", "#estresse-pauta"].forEach(sel => {
      const p = $(sel);
      if (!p) return;
      p.textContent = "🫀 " + v;
      p.classList.toggle("alerta", v >= 60 && v < 85);
      p.classList.toggle("critico", v >= 85);
    });
    // histerese: turva em 85, só limpa abaixo de 75
    if (v >= 85 && !turvaAtiva) turvaAtiva = true;
    else if (v < 75 && turvaAtiva) turvaAtiva = false;
    document.body.classList.toggle("visao-turva", turvaAtiva);

    // a vinheta gradual do 3D: começa a fechar a partir de 45
    const peso = Math.max(0, Math.min(1, (v - 45) / 55));
    document.body.style.setProperty("--peso-estresse", (peso * 0.85).toFixed(2));

    // aviso narrativo ao CRUZAR 70 (uma vez por dia, só no 3D)
    if (v >= 70 && !e.flags._avisoEstresse70 && modo3d() &&
        TOGA.cena3d && TOGA.cena3d.toastMundo) {
      e.flags._avisoEstresse70 = true;
      M().salvar();
      TOGA.cena3d.toastMundo("💬 Laís, baixinho, na porta do gabinete: “doutor, com licença o registro: o senhor está há horas sem uma pausa, e eu vejo daqui o seu passo pesando. A pauta precisa do senhor INTEIRO — copa, água ou setor de saúde. Escolha um, que eu seguro o expediente.”");
    }

    // COLAPSO aos 100: o juiz passa mal e o atendimento médico é acionado.
    // O guard _colapsoPendente impede re-disparo enquanto a cena animada
    // (adiada para quando o juiz voltar ao mundo 3D) ainda não rodou —
    // assim o estresse NÃO cai sozinho antes da cena.
    if (v >= 100 && !colapsoArmado && !(e.flags && e.flags._colapsoPendente)) {
      colapsoArmado = true;
      if (modo3d() && TOGA.cena3d && TOGA.cena3d.emergenciaMedica) {
        TOGA.cena3d.emergenciaMedica(function () { colapsoArmado = false; });
      } else {
        // fallback fora do 3D (audiência/modo clássico): normaliza com aviso
        e.estresse = 45;
        e.minutos += 30;
        e.flags._colapsou = true;
        M().salvar();
        if (TOGA.conquistas) TOGA.conquistas.avaliar("colapso-medico");
        const area = $("#linha-pausas");
        if (area) {
          const aviso = document.createElement("div");
          aviso.className = "aviso-pausa";
          aviso.textContent = "🚑 O estresse chegou ao limite: o senhor passou mal e foi atendido pela equipe médica do fórum. Pressão normalizada, mas perdeu 30 minutos. Cuide-se, Excelência.";
          area.after(aviso);
          setTimeout(() => aviso.remove(), 6000);
        }
        setTimeout(() => { colapsoArmado = false; atualizarHUD(); }, 50);
      }
    }
  }

  /* Pausas de autocuidado (água, frigobar, setor de saúde) —
     valem nos dois modos; no 3D também existem como lugares. */
  function pausa(tipo) {
    const e = M().estado;
    if (!e) return;
    const def = {
      agua:   { estresse: -8,  tempo: 2,  msg: "🚰 Água gelada. O próximo processo agradece a calma." },
      lanche: { estresse: -14, tempo: 6,  msg: "🥪 Um lanche do frigobar. A toga pesa menos de estômago forrado." },
      saude:  { estresse: -40, tempo: 15, msg: "🩺 Pressão aferida, respiração guiada e uma conversa franca: “Excelência, o fórum precisa do senhor inteiro — não só hoje.”" }
    }[tipo];
    if (!def) return;
    M().alterarEstresse(def.estresse);
    e.minutos += def.tempo;
    if (tipo === "agua") e._aguas = (e._aguas || 0) + 1;   // conquista "Hidratado(a)"
    M().salvar();
    atualizarHUD();
    atualizarPausas();
    if (TOGA.conquistas) TOGA.conquistas.avaliar("pausa");
    return def.msg;
  }

  function atualizarPausas() {
    const e = M().estado;
    if (!e) return;
    const saude = $("#btn-saude");
    if (saude) saude.hidden = (e.estresse || 0) < 60;
    const conclusos = $("#btn-conclusos");
    if (conclusos && M().despachosPendentes) {
      const n = M().despachosPendentes().length;
      conclusos.hidden = n === 0;
      $("#qtd-conclusos").textContent = "(" + n + ")";
    }
    const pilula = $("#estresse-pauta");
    if (pilula) pilula.textContent = "🫀 " + (e.estresse || 0);
  }

  /* ---------- Cortina cinematográfica ----------
     Fade preto com um cartão ("Pauta das 09:00 — ...") entre
     uma tela e outra. Quem prefere menos animação pula direto. */
  let cortinaEl = null;
  function mostrarCortina(eyebrow, titulo, cb) {
    const reduz = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduz) { cb(); return; }
    if (!cortinaEl) {
      cortinaEl = document.createElement("div");
      cortinaEl.id = "cortina";
      cortinaEl.innerHTML = '<div class="cartao-cortina"><div class="eyebrow"></div><h2></h2></div>';
      document.body.appendChild(cortinaEl);
    }
    cortinaEl.querySelector(".eyebrow").textContent = eyebrow || "";
    cortinaEl.querySelector("h2").textContent = titulo || "";
    cortinaEl.classList.remove("fechando");
    cortinaEl.classList.add("aberta");
    setTimeout(cb, 650);
    setTimeout(function () {
      cortinaEl.classList.add("fechando");
      setTimeout(function () { cortinaEl.classList.remove("aberta", "fechando"); }, 650);
    }, 1600);
  }

  function toast(variacoes) {
    const area = $("#area-toasts");
    // Modo Prova: deltas de reputação ficam ocultos (só o estresse aparece)
    if (M().estado && M().estado.modoProva) variacoes = variacoes.filter(v => v.estresse);
    variacoes.forEach((v, i) => {
      setTimeout(() => {
        const el = document.createElement("div");
        // no estresse, SUBIR é ruim — a cor inverte
        const bom = v.estresse ? v.delta < 0 : v.delta > 0;
        el.className = "toast " + (bom ? "positivo" : "negativo");
        el.textContent = `${v.rotulo} ${v.delta > 0 ? "+" : ""}${v.delta}`;
        area.appendChild(el);
        setTimeout(() => el.remove(), 2700);
      }, i * 220);
    });
  }

  /* ---------- Máquina de escrever ----------
     Guardamos a função de "completar" para que um clique
     no meio da digitação mostre o texto inteiro de uma vez. */
  let digitando = null;
  function escrever(el, texto, aoTerminar) {
    if (digitando) digitando();           // completa a anterior
    // quem desativa animações no sistema lê o texto inteiro de uma vez
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = texto;
      if (aoTerminar) aoTerminar(true);
      return;
    }
    el.textContent = "";
    let i = 0, viva = true;
    const timer = setInterval(() => {
      el.textContent = texto.slice(0, ++i);
      if (i >= texto.length) parar(true);
    }, 16);
    function parar(natural) {
      if (!viva) return;
      viva = false; clearInterval(timer);
      el.textContent = texto;
      digitando = null;
      if (aoTerminar) aoTerminar(natural);
    }
    digitando = () => parar(false);
  }

  /* ---------- Estado local da audiência ---------- */
  let casoAtivo = null;
  let filaFalas = [];          // falas ainda não exibidas da cena atual
  let cenaAtualId = null;
  let aposFalas = null;        // o que fazer quando as falas acabarem

  const COR_PAPEL = {
    "Juiz": "var(--latao-claro)", "Promotor": "#d8a0a0", "Promotora": "#d8a0a0",
    "Defensora Pública": "#9fc3ae", "Advogada": "#a8b8d8", "Advogado": "#a8b8d8",
    "Narrador": "var(--texto-suave)"
  };

  function personagem(id) {
    if (id === "narrador") return { nome: "", papel: "Narrador" };
    if (id === "voce") return { nome: "Você", papel: "Juiz" };
    return casoAtivo.personagens.find(p => p.id === id) || { nome: id, papel: "" };
  }

  /* Exibe a próxima fala da fila (chamado também pelo clique). */
  function proximaFala() {
    if (filaFalas.length === 0) {
      $("#dica-continuar").style.visibility = "hidden";
      if (aposFalas) { const fn = aposFalas; aposFalas = null; fn(); }
      return;
    }
    const f = filaFalas.shift();
    const p = personagem(f.quem);
    $("#quem-fala").innerHTML = f.quem === "narrador"
      ? `<span style="color:${COR_PAPEL.Narrador}">— audiência —</span>`
      : `<span style="color:${COR_PAPEL[p.papel] || 'var(--texto)'}">${p.nome}</span><span class="cargo">${p.papel}</span>`;

    TOGA.cena.falar(f.quem !== "narrador" && f.quem !== "voce" ? f.quem : null);
    if (f.emocao && f.quem !== "narrador" && f.quem !== "voce") TOGA.cena.setEmocao(f.quem, f.emocao);

    const textoFala = adapt(f.texto);

    // narração por voz (acessibilidade): "Nome, papel: fala"
    if (TOGA.narrador && TOGA.narrador.ligado) {
      const prefixo = (f.quem === "narrador") ? "" : p.nome + (p.papel ? ", " + p.papel : "") + ": ";
      TOGA.narrador.falar(prefixo + textoFala);
    }

    $("#dica-continuar").style.visibility = "visible";
    escrever($("#texto-fala"), textoFala);
  }

  /* ---------- Roda uma cena do caso ---------- */
  let relidasNaCena = new Set();   // opções destravadas relendo os autos (por cena)

  function rodarCena(idCena) {
    cenaAtualId = idCena;
    relidasNaCena = new Set();
    const c = M().cena(idCena);
    $("#painel-decisao").innerHTML = "";

    filaFalas = (c.falas || []).slice();
    aposFalas = () => {
      if (c.decisao) renderDecisao(c);
      else if (c.fim) desfechoDoCaso(c.fim);
    };
    proximaFala();
  }

  /* ---------- Cartões de decisão ---------- */
  function renderDecisao(c) {
    const e = M().estado;
    TOGA.cena.falar(null);   // ninguém em destaque: a decisão é sua (no 3D, plano geral)
    const cont = $("#painel-decisao");
    const caixa = document.createElement("div");
    caixa.innerHTML = `<div class="pergunta-decisao">${c.decisao.prompt}</div>`;
    const lista = document.createElement("div");
    lista.className = "opcoes";

    c.decisao.opcoes.forEach((op, i) => {
      const btn = document.createElement("button");
      // Sem o foco estudado a opção NÃO trava: ela exige RELER os
      // autos na hora — destrava num clique, mas custa minutos.
      // Quem estudou antes decide de graça: o preparo segue valendo.
      const semFoco = op.requerFoco && !M().temFoco(op.requerFoco) && !relidasNaCena.has(i);
      btn.className = "opcao" + (semFoco ? " reler" : "");
      btn.innerHTML = `
        <span class="rotulo-opcao">${op.rotulo}</span>
        ${semFoco
          ? `<span class="fundamento aviso-reler">📖 Você não estudou este ponto. Reler os autos agora <strong>(+4 min)</strong> ›</span>`
          : op.fundamento ? `<span class="fundamento">${op.fundamento}</span>` : ""}
        ${op.efeitos && op.efeitos.tempo ? `<span class="custo-tempo">⏱ ~${op.efeitos.tempo} min</span>` : ""}`;
      btn.onclick = () => {
        if (semFoco) {
          relidasNaCena.add(i);
          M().aplicarEfeitos({ tempo: 4 });
          M().salvar();
          if (TOGA.audio) TOGA.audio.tocar("papel");
          toast([{ rotulo: "📖 Releu os autos", delta: 4, estresse: true }]);
          atualizarHUD();
          $("#painel-decisao").innerHTML = "";
          renderDecisao(c);            // reabre com a opção destravada
          return;
        }
        escolher(i);
      };
      lista.appendChild(btn);
    });
    caixa.appendChild(lista);
    cont.appendChild(caixa);

    // teclado: ↑/↓ circulam entre as opções; Enter decide
    lista.addEventListener("keydown", ev => {
      if (ev.key !== "ArrowDown" && ev.key !== "ArrowUp") return;
      const ops = [...lista.querySelectorAll(".opcao:not([disabled])")];
      const i = ops.indexOf(document.activeElement);
      if (i < 0 || !ops.length) return;
      ev.preventDefault();
      ops[(i + (ev.key === "ArrowDown" ? 1 : ops.length - 1)) % ops.length].focus();
    });
    const primeira = lista.querySelector(".opcao:not([disabled])");
    if (primeira) primeira.focus();
  }

  function escolher(indice) {
    if (TOGA.narrador) TOGA.narrador.calar();   // decidir interrompe a narração
    const resultado = M().decidir(cenaAtualId, indice);
    const op = resultado.opcao;
    $("#painel-decisao").innerHTML = "";

    // 1) Carimbo + martelo (a consequência É SENTIDA NO ATO)
    const acerto = (op.feedback || {}).acerto;
    const tomCarimbo = { otimo: "dourado", bom: "positivo", ruim: null, grave: null };
    TOGA.cena.carimbar(op.carimbo || "DECIDIDO", tomCarimbo[acerto]);

    // eventos de cena declarados pelo caso (prisão, soltura...)
    if (op.evento && TOGA.cena.evento) TOGA.cena.evento(op.evento, casoAtivo && casoAtivo.id);

    // decisões ruins fazem a sala cochichar; as graves SACODEM o fórum
    if (TOGA.audio && (acerto === "ruim" || acerto === "grave")) TOGA.audio.tocar("murmurio");
    if (acerto === "grave") {
      if (TOGA.audio) TOGA.audio.tocar("grave");
      document.body.classList.add("tremer");
      setTimeout(() => document.body.classList.remove("tremer"), 500);
    }

    // 2) Toasts de reputação + HUD
    toast(resultado.variacoes);
    atualizarHUD();

    // combo de decisões exemplares: o badge acende a partir de 2
    atualizarCombo(acerto);
    if (TOGA.conquistas) TOGA.conquistas.avaliar("decisao");

    // 3) Reações imediatas das pessoas na sala
    filaFalas = (op.reacoes || []).slice();
    aposFalas = () => painelEstudo(op, resultado.proxima);
    setTimeout(proximaFala, 650);
  }

  /* ---------- Combo de decisões exemplares (✦) ---------- */
  function atualizarCombo(acertoAgora) {
    const e = M().estado;
    if (!e) return;
    let badge = document.getElementById("badge-combo");
    const combo = e.comboOtimo || 0;
    document.body.classList.toggle("combo-alto", combo >= 3);   // o carimbo brilha
    if (combo >= 2) {
      if (!badge) {
        badge = document.createElement("div");
        badge.id = "badge-combo";
        const palco = document.querySelector(".palco");
        if (palco) palco.appendChild(badge); else return;
      }
      badge.textContent = "✦×" + combo + " fundamentação em série";
      badge.classList.remove("pulsa"); void badge.offsetWidth; badge.classList.add("pulsa");
      badge.hidden = false;
    } else if (badge) {
      badge.hidden = true;
    }
  }

  /* ---------- Painel "Fundamentação" (Modo Estudo) ---------- */
  function painelEstudo(op, proxima) {
    const cont = $("#painel-decisao");
    cont.innerHTML = "";
    const fb = op.feedback;
    const estudoLigado = M().estado.modoEstudo && !M().estado.modoProva;

    if (M().estado.modoProva) {
      const nota = document.createElement("div");
      nota.className = "nota-prova";
      nota.textContent = "📝 Decisão registrada — a correção completa vem na revisão comentada, ao fim do dia.";
      cont.appendChild(nota);
    }

    if (fb && estudoLigado) {
      const nomes = { otimo: "Decisão exemplar", bom: "Decisão defensável", ruim: "Decisão frágil", grave: "Erro grave" };
      const box = document.createElement("div");
      box.className = "painel-estudo acerto-" + (fb.acerto || "bom");
      box.innerHTML = `
        <header>📚 ${nomes[fb.acerto] || "Fundamentação"} — ${fb.titulo || ""}</header>
        <div class="corpo">${fb.texto}</div>`;
      cont.appendChild(box);
    }

    const btn = document.createElement("button");
    btn.className = "btn";
    btn.style.marginTop = "14px";
    btn.textContent = "Prosseguir com a audiência";
    btn.onclick = () => rodarCena(proxima);
    cont.appendChild(btn);
    btn.focus();
  }

  /* ---------- Desfecho do caso ---------- */
  let ultimoDesfecho = null;   // {caso, fim} — o cartão compartilhável usa

  function desfechoDoCaso(fim) {
    if (fim.evento && TOGA.cena.evento) TOGA.cena.evento(fim.evento, casoAtivo && casoAtivo.id);
    ultimoDesfecho = { caso: casoAtivo, fim: fim };
    M().concluirCaso(fim);
    if (TOGA.conquistas) TOGA.conquistas.avaliar("caso");
    const card = $("#cartao-desfecho");
    card.querySelector(".selo-grande").textContent = fim.titulo;
    card.querySelector(".selo-grande").className = "selo-grande selo-" + fim.selo;
    card.querySelector(".texto-desfecho").innerHTML = adapt(fim.texto);
    mostrarTela("tela-desfecho");
  }

  function continuarAposDesfecho() {
    // No 3D, desfechos e interlúdios devolvem o juiz ao MUNDO:
    // o objetivo no HUD aponta o próximo passo (assessora, autos,
    // bancada ou a porta de saída). As consequências viram lugares.
    if (modo3d()) {
      if (TOGA.cena3d.emAudiencia) TOGA.cena3d.encerrarAudiencia();
      TOGA.cena3d.entrarMundo();
      return;
    }
    // arco emocional: a cena "no corredor", antes de tudo
    const arco = M().arcoPendente && M().arcoPendente();
    if (arco) { mostrarArco(arco); return; }
    const pendentes = M().interludiosPendentes();
    if (pendentes.length) { mostrarInterludio(pendentes[0]); return; }
    if (M().fimDaPauta()) { mostrarEpilogo(); return; }
    renderPauta(); mostrarTela("tela-pauta");
  }

  /* O arco do caso vira um cartão "No corredor" (modo 2D);
     no 3D, o cena3d encena as falas no próprio mundo. */
  function mostrarArco(arco) {
    M().marcarArco(arco.caso.id);
    const card = $("#cartao-interludio");
    card.className = "cartao-desfecho cartao-interludio tom-" + ((arco.ramo && arco.ramo.tom) || "neutro");
    card.querySelector(".titulo-interludio").textContent = "No corredor — " + arco.caso.titulo;
    [".cena-entrega", ".rostos-corredor"].forEach(sel => {
      const velho = card.querySelector(sel);
      if (velho) velho.remove();
    });
    $("#btn-continuar-interludio").hidden = false;

    const falas = (arco.ramo && arco.ramo.falas) || [];
    card.querySelector(".texto-interludio").innerHTML =
      falas.map(f => {
        const p = (arco.caso.personagens || []).find(x => x.id === f.quem);
        const nome = p ? p.nome : (f.quem === "narrador" ? "" : f.quem);
        return nome ? `<strong>${nome}:</strong> “${adaptDir(f.texto)}”` : adaptDir(f.texto);
      }).join("<br><br>");

    // os ROSTOS do corredor: quem fala aparece, com a emoção da fala
    if (TOGA.cena2d && TOGA.cena2d.avatarSolo) {
      const vistos = {};
      const presentes = falas.filter(f => {
        const p = (arco.caso.personagens || []).find(x => x.id === f.quem);
        if (!p || vistos[p.id]) return false;
        vistos[p.id] = true;
        return true;
      }).slice(0, 3);
      if (presentes.length) {
        const fila = document.createElement("div");
        fila.className = "rostos-corredor";
        presentes.forEach(f => {
          const p = arco.caso.personagens.find(x => x.id === f.quem);
          const cel = document.createElement("div");
          cel.className = "rosto-corredor";
          cel.appendChild(TOGA.cena2d.avatarSolo(p, f.emocao || "neutro"));
          const nome = document.createElement("span");
          nome.textContent = p.nome;
          cel.appendChild(nome);
          fila.appendChild(cel);
        });
        card.querySelector(".texto-interludio").before(fila);
      }
    }
    mostrarTela("tela-interludio");
  }

  /* 3D: a assessora/balcão chamam isto para "entregar" o interlúdio */
  function abrirInterludioPendente() {
    const pendentes = M().interludiosPendentes();
    if (pendentes.length) mostrarInterludio(pendentes[0]);
  }

  function mostrarInterludio(it) {
    M().marcarInterludio(it);
    if (TOGA.conquistas) TOGA.conquistas.avaliar("interludio", { interludio: it });
    const card = $("#cartao-interludio");
    card.className = "cartao-desfecho cartao-interludio tom-" + (it.tom || "neutro");
    card.querySelector(".titulo-interludio").textContent = adaptDir(it.titulo);
    card.querySelector(".texto-interludio").innerHTML = adaptDir(it.texto);
    [".cena-entrega", ".rostos-corredor"].forEach(sel => {
      const velho = card.querySelector(sel);
      if (velho) velho.remove();
    });
    const btnContinuar = $("#btn-continuar-interludio");
    btnContinuar.hidden = false;

    if (it.entrega && TOGA.cena2d && TOGA.cena2d.avatarSolo) {
      // alguém ENTRA e entrega o objeto em mãos: a consequência vira cena
      btnContinuar.hidden = true;
      montarEntrega(card, it, () => { btnContinuar.hidden = false; btnContinuar.focus(); });
    } else {
      // anexo estático: o desenho, a carta ou o comprovante DE VERDADE
      const nomeArte = it.anexo || (it.desenho ? "desenhoSuperJuiz" : null);
      if (nomeArte && TOGA.arte && TOGA.arte[nomeArte]) {
        const cv = document.createElement("canvas");
        cv.width = cv.height = 420;
        cv.className = "desenho-interludio";
        cv.getContext("2d").drawImage(TOGA.arte[nomeArte](), 0, 0, 420, 420);
        card.querySelector(".texto-interludio").appendChild(cv);
      }
    }
    mostrarTela("tela-interludio");
  }

  /* ---------- A CENA DE ENTREGA ----------
     Formato (campo opcional `entrega` do interlúdio):
       entrega: { quem: {nome, papel?, escala?, avatar}, falas: [{texto, emocao?}],
                  objeto?: "nomeEmTOGA.arte", rotuloReceber?: "..." }
     A pessoa entra (avatar da sala), fala em balão com a máquina
     de escrever, e ESTENDE o objeto — que o juiz clica para
     receber, vê em tela cheia e guarda no gabinete.          */
  function montarEntrega(card, it, aoConcluir) {
    const ent = it.entrega || {};
    ent.falas = ent.falas || [];
    const cena = document.createElement("div");
    cena.className = "cena-entrega";
    cena.innerHTML = `
      <div class="lado-pessoa">
        <div class="nome-visita">${ent.quem.nome}${ent.quem.papel ? `<span>${ent.quem.papel}</span>` : ""}</div>
      </div>
      <div class="lado-fala">
        <div class="balao-entrega" title="Clique para continuar">
          <span class="texto-balao"></span>
          <div class="dica-continuar">clique para continuar ▸</div>
        </div>
      </div>`;
    const avatar = TOGA.cena2d.avatarSolo(ent.quem, (ent.falas[0] && ent.falas[0].emocao) || "neutro");
    if (ent.quem.escala) avatar.style.width = Math.round(130 * ent.quem.escala) + "px";
    cena.querySelector(".lado-pessoa").prepend(avatar);
    card.querySelector(".acoes-desfecho").before(cena);

    const fila = ent.falas.slice();
    const balao = cena.querySelector(".balao-entrega");
    const textoBalao = cena.querySelector(".texto-balao");
    const dica = cena.querySelector(".dica-continuar");
    let entregue = false;

    function proxima() {
      if (!fila.length) { estenderObjeto(); return; }
      const f = fila.shift();
      const textoFala = adaptDir(f.texto);
      if (f.emocao) TOGA.cena2d.aplicarEmocao(avatar, f.emocao);
      if (TOGA.narrador && TOGA.narrador.ligado) TOGA.narrador.falar(ent.quem.nome + ": " + textoFala);
      escrever(textoBalao, textoFala);
    }
    balao.addEventListener("click", () => {
      if (entregue) return;
      if (digitando) { digitando(); return; }   // 1º clique completa, 2º avança
      proxima();
    });

    function estenderObjeto() {
      entregue = true;
      dica.style.visibility = "hidden";
      const nomeArte = ent.objeto || it.anexo;
      const fn = nomeArte && TOGA.arte && TOGA.arte[nomeArte];
      if (!fn) { aoConcluir(); return; }
      if (TOGA.audio) TOGA.audio.tocar("papel");
      const ato = document.createElement("div");
      ato.className = "ato-entrega";
      const cv = document.createElement("canvas");
      cv.width = cv.height = 320;
      cv.className = "objeto-entregue";
      cv.getContext("2d").drawImage(fn(), 0, 0, 320, 320);
      const btn = document.createElement("button");
      btn.className = "btn btn-receber";
      btn.textContent = ent.rotuloReceber || "🤲 Receber";
      ato.appendChild(cv);
      ato.appendChild(btn);
      cena.querySelector(".lado-fala").appendChild(ato);
      btn.focus();
      function receber() {
        if (TOGA.audio) TOGA.audio.tocar("papel");
        if (TOGA.conquistas) TOGA.conquistas.avaliar("entrega");
        TOGA.cena2d.aplicarEmocao(avatar, "feliz");
        TOGA.lembrancas.ver({ arte: nomeArte, titulo: it.titulo });   // vê em tela cheia
        btn.remove();
        cv.classList.add("guardado");
        const aviso = document.createElement("div");
        aviso.className = "aviso-guardado";
        aviso.textContent = "✓ Guardado no seu gabinete";
        ato.appendChild(aviso);
        aoConcluir();
      }
      btn.addEventListener("click", receber);
      cv.addEventListener("click", () => { if (!btn.isConnected) TOGA.lembrancas.ver({ arte: nomeArte, titulo: it.titulo }); else receber(); });
    }
    proxima();
  }

  /* O corredor também existe no 2D: uma linha viva no cartão do
     caso da vez descreve quem espera — e COMO espera.        */
  const FRASE_ESPERA = {
    medo: "espera no corredor, olhos fixos na porta",
    choro: "espera no corredor, enxugando os olhos",
    triste: "espera no corredor, cabisbaixa, mãos no colo",
    vergonha: "espera no corredor sem encarar ninguém",
    raiva: "anda de um lado a outro do corredor",
    neutro: "aguarda no banco do corredor"
  };
  const PAPEL_OPERADOR = /advogad|promotor|defensor|procurador|perito|conselheir|assistente|polici/i;

  function linhaCorredor(caso) {
    if (!caso) return "";
    const linhas = [];
    const preso = (caso.personagens || []).find(p => p.preso);
    if (preso) linhas.push(`🔒 ${preso.nome} aguarda algemado na cela de custódia.`);
    if (caso.arco && caso.arco.antes) {
      const parte = (caso.personagens || []).find(p => !p.preso && !PAPEL_OPERADOR.test(p.papel || ""));
      if (parte) {
        const frase = FRASE_ESPERA[caso.arco.antes.emocao] || FRASE_ESPERA.neutro;
        linhas.push(`🚪 ${parte.nome} ${frase}${caso.arco.antes.gesto === "angustia" ? ", as mãos inquietas" : ""}.`);
      }
    }
    return linhas.join(" ");
  }

  /* ---------- Telas: pauta, autos, audiência ---------- */
  function renderPauta() {
    const e = M().estado;
    atualizarPausas();
    $("#pauta-data").textContent = M().pautaAtual().titulo + " — " + M().horaTexto();
    const lista = $("#lista-pauta");
    lista.innerHTML = "";
    const NOMES_SELO = { otimo: "ótimo", bom: "defensável", ruim: "frágil", grave: "grave" };
    const recordes = (M().carreira ? M().carreira().casos : {}) || {};
    M().casosDaPauta().forEach((caso, i) => {
      const btn = document.createElement("button");
      const feito = e.concluidos.find(c => c.id === caso.id);
      const daVez = i === e.casoAtual;
      btn.className = "cartao-caso" + (feito ? " concluido" : "") +
        (!feito && !daVez ? " travado" : "") + (daVez && !feito ? " da-vez" : "");
      const corredor = (daVez && !feito) ? linhaCorredor(caso) : "";
      // o convite a rejogar: seu melhor resultado neste caso, em qualquer dia
      const recorde = recordes[caso.id];
      const linhaRecorde = !feito
        ? (recorde
            ? (recorde === "otimo"
                ? `<div class="recorde-caso e-otimo">🏅 seu melhor aqui: ótimo</div>`
                : `<div class="recorde-caso">🎯 seu melhor aqui: ${NOMES_SELO[recorde] || recorde} — dá para superar</div>`)
            : `<div class="recorde-caso inedito">✧ inédito na sua carreira</div>`)
        : "";
      btn.innerHTML = `
        <span class="hora">${caso.hora}</span>
        <span>
          <span class="area">${caso.area}</span>
          <div class="nome">${caso.titulo}</div>
          <div class="resuminho">${caso.subtitulo}</div>
          ${corredor ? `<div class="linha-corredor">${corredor}</div>` : ""}
          ${linhaRecorde}
        </span>
        ${feito ? `<span class="selo-resultado selo-${feito.selo}">${feito.titulo}</span>`
                : daVez ? `<span class="selo-resultado selo-bom">Chamar →</span>` : `<span class="suave">aguardando</span>`}`;
      if (daVez && !feito) btn.onclick = abrirAutos;
      else btn.disabled = true;
      lista.appendChild(btn);
    });
  }

  /* ---------- Marca-texto nos autos ----------
     Selecionar um trecho da peça mostra "✏ grifar"; o grifo
     fica salvo no save e reaparece ao reabrir. Marcar um FOCO
     de estudo acende nos autos os trechos que aquele foco
     declara (campo opcional `grifos` do caso).             */
  let pecaAtual = 0;

  function aplicarMarcas(textoHtml, trecho, classe) {
    const i = textoHtml.indexOf(trecho);
    if (i < 0) return textoHtml;   // texto mudou ou trecho cruzou outra marca: ignora
    return textoHtml.slice(0, i) +
      `<mark class="${classe}">${trecho}</mark>` +
      textoHtml.slice(i + trecho.length);
  }

  function btnGrifar() {
    let b = document.getElementById("btn-grifar");
    if (!b) {
      b = document.createElement("button");
      b.id = "btn-grifar";
      b.textContent = "✏ grifar";
      b.hidden = true;
      document.body.appendChild(b);
    }
    return b;
  }

  function abrirAutos() {
    const { caso } = M().iniciarCaso();
    casoAtivo = caso;
    if (TOGA.audio) TOGA.audio.tocar("papel");
    $("#autos-titulo").textContent = caso.titulo;
    $("#autos-area").textContent = caso.area + " · pauta das " + caso.hora;
    $("#autos-resumo").textContent = caso.autos.resumo;
    // a espera do corredor, visível também aqui (modo 2D)
    const corredorAntigo = document.getElementById("autos-corredor");
    if (corredorAntigo) corredorAntigo.remove();
    const corredor = !modo3d() && linhaCorredor(caso);
    if (corredor) {
      const div = document.createElement("div");
      div.id = "autos-corredor";
      div.className = "linha-corredor";
      div.textContent = corredor;
      $("#autos-resumo").after(div);
    }

    // Abas das peças processuais
    const abas = $("#abas-pecas"); abas.innerHTML = "";
    const corpo = $("#corpo-peca");

    function abrirPeca(idx, semSom) {
      pecaAtual = idx;
      abas.querySelectorAll(".aba-peca").forEach((a, i) => a.classList.toggle("ativa", i === idx));
      if (TOGA.audio && !semSom) TOGA.audio.tocar("papel");
      const p = caso.autos.pecas[idx];
      let texto = p.texto;
      // grifos do jogador (toggle: clicar no grifo remove)
      M().grifosDe(caso.id).filter(g => g.peca === p.id)
        .forEach(g => { texto = aplicarMarcas(texto, g.trecho, "grifo"); });
      // trechos apontados pelos focos de estudo marcados
      caso.focos.filter(f => M().temFoco(f.id) && f.grifos)
        .forEach(f => f.grifos.filter(g => g.peca === p.id)
          .forEach(g => { texto = aplicarMarcas(texto, g.trecho, "grifo-foco"); }));
      corpo.innerHTML = `<h3>${p.titulo}</h3><p>${texto}</p>`;
      corpo.querySelectorAll("mark.grifo").forEach(m => {
        m.title = "clique para remover o grifo";
        m.onclick = () => { M().alternarGrifo(caso.id, p.id, m.textContent); abrirPeca(idx, true); };
      });
    }

    caso.autos.pecas.forEach((p, i) => {
      const a = document.createElement("button");
      a.className = "aba-peca"; a.textContent = p.titulo;
      a.onclick = () => abrirPeca(i);
      abas.appendChild(a);
    });
    abrirPeca(0, true);

    // Seleção de texto → botão flutuante "✏ grifar"
    const botao = btnGrifar();
    corpo.onmouseup = corpo.ontouchend = () => {
      setTimeout(() => {
        const sel = window.getSelection();
        const trecho = sel ? sel.toString().trim() : "";
        if (!trecho || trecho.length < 3 || !corpo.contains(sel.anchorNode)) { botao.hidden = true; return; }
        const r = sel.getRangeAt(0).getBoundingClientRect();
        botao.style.left = (r.left + r.width / 2 + window.scrollX) + "px";
        botao.style.top = (r.top + window.scrollY - 40) + "px";
        botao.hidden = false;
        botao.onclick = () => {
          M().alternarGrifo(caso.id, caso.autos.pecas[pecaAtual].id, trecho);
          botao.hidden = true;
          sel.removeAllRanges();
          abrirPeca(pecaAtual, true);
        };
      }, 10);
    };
    document.addEventListener("mousedown", ev => {
      if (ev.target !== botao) botao.hidden = true;
    });

    // Cartões de foco (estratégia: estude até 2 pontos)
    const pf = $("#lista-focos"); pf.innerHTML = "";
    caso.focos.forEach(f => {
      const b = document.createElement("button");
      b.className = "cartao-foco";
      b.innerHTML = `<span class="titulo-foco">${f.rotulo}</span><br><span class="dica-foco">${f.dica}</span>`;
      b.onclick = () => {
        M().setFoco(f.id);
        b.classList.toggle("marcado", M().temFoco(f.id));
        $("#contagem-focos").textContent = M().estado.focos.length + " / 2 pontos marcados";
        abrirPeca(pecaAtual, true);   // acende/apaga os trechos do foco na peça aberta
      };
      pf.appendChild(b);
    });
    $("#contagem-focos").textContent = "0 / 2 pontos marcados";
    mostrarTela("tela-autos");
  }

  /* No 3D: "Apregoar" nos autos não inicia o ato na hora —
     marca que está tudo pronto e manda o juiz ANDAR até a
     bancada. A audiência começa quando ele se senta (tecla E). */
  let prontoParaAudiencia = false;
  function audienciaPronta() { return prontoParaAudiencia; }

  function prepararOuIniciarAudiencia() {
    if (modo3d()) {
      prontoParaAudiencia = true;
      // entrarMundo() já recalcula o objetivo (seta + texto) pela ordem de
      // prioridade: se houver interlúdio/recado pendente, ele vem ANTES da
      // bancada — definir "bancada" aqui à força criava a contradição entre
      // a seta (apontando o recado) e o texto (mandando à bancada).
      TOGA.cena3d.entrarMundo();
      return;
    }
    iniciarAudiencia();
  }

  function iniciarAudiencia() {
    const caso = casoAtivo;
    prontoParaAudiencia = false;
    // contador da conquista "Leitor(a) de autos" (2 focos em todo caso)
    const e = M().estado;
    if (e && e.focos.length >= 2) { e._casos2focos = (e._casos2focos || 0) + 1; M().salvar(); }
    if (TOGA.audio) TOGA.audio.tocar("sino");
    mostrarCortina("Pauta das " + caso.hora + " · " + caso.area, caso.titulo, function () {
      $("#hud-caso").textContent = caso.titulo;
      $("#hud-area").textContent = caso.area;
      TOGA.cena.montar($("#palco-svg"), caso.personagens);
      atualizarHUD();
      mostrarTela("tela-audiencia");
      rodarCena(caso.inicio);
    });
  }

  /* ---------- Despachos de gabinete (a pilha de conclusos) ---------- */
  let despachoAtual = null;

  function abrirDespachos() {
    const pendentes = M().despachosPendentes();
    if (!pendentes.length) { sairDosDespachos(); return; }
    despachoAtual = pendentes[0];
    if (TOGA.audio) TOGA.audio.tocar("papel");
    $("#despacho-area").textContent = despachoAtual.area + " · conclusos do gabinete";
    $("#despacho-titulo").textContent = despachoAtual.titulo;
    $("#despacho-texto").innerHTML = `<p>${adaptDir(despachoAtual.texto)}</p>`;
    // despachos também podem trazer o DOCUMENTO de verdade (ofício timbrado...)
    if (despachoAtual.anexo && TOGA.arte && TOGA.arte[despachoAtual.anexo]) {
      const cv = document.createElement("canvas");
      cv.width = cv.height = 420;
      cv.className = "desenho-interludio";
      cv.getContext("2d").drawImage(TOGA.arte[despachoAtual.anexo](), 0, 0, 420, 420);
      $("#despacho-texto").appendChild(cv);
    }

    const cont = $("#despacho-opcoes");
    cont.innerHTML = `<div class="pergunta-decisao">Como decide, Excelência?</div>`;
    const lista = document.createElement("div");
    lista.className = "opcoes";
    despachoAtual.opcoes.forEach((op, i) => {
      const btn = document.createElement("button");
      btn.className = "opcao";
      btn.innerHTML = `
        <span class="rotulo-opcao">${op.rotulo}</span>
        ${op.fundamento ? `<span class="fundamento">${op.fundamento}</span>` : ""}
        ${op.efeitos && op.efeitos.tempo ? `<span class="custo-tempo">⏱ ~${op.efeitos.tempo} min</span>` : ""}`;
      btn.onclick = () => decidirDespachoUI(i);
      lista.appendChild(btn);
    });
    cont.appendChild(lista);

    // a pilha não prende ninguém: dá para sair e despachar o resto depois
    const restantes = M().despachosPendentes().length - 1;
    const sair = document.createElement("button");
    sair.className = "btn-secundario";
    sair.style.marginTop = "14px";
    sair.textContent = restantes > 0
      ? "‹ Deixar este e os demais (" + (restantes + 1) + ") para depois"
      : "‹ Deixar este concluso para depois";
    sair.onclick = sairDosDespachos;
    cont.appendChild(sair);

    const primeira = lista.querySelector(".opcao");
    if (primeira) primeira.focus();
    mostrarTela("tela-despacho");
  }

  function decidirDespachoUI(indice) {
    const r = M().decidirDespacho(despachoAtual.id, indice);
    if (!r) return;
    toast(r.variacoes);
    atualizarHUD();
    atualizarPausas();
    if (TOGA.conquistas) TOGA.conquistas.avaliar("despacho");   // ESMEC, entrevista, palestra...

    const cont = $("#despacho-opcoes");
    cont.innerHTML = "";
    const fb = r.opcao.feedback;
    if (fb && M().estado.modoEstudo && !M().estado.modoProva) {
      const nomes = { otimo: "Decisão exemplar", bom: "Decisão defensável", ruim: "Decisão frágil", grave: "Erro grave" };
      const box = document.createElement("div");
      box.className = "painel-estudo acerto-" + (fb.acerto || "bom");
      box.innerHTML = `<header>📚 ${nomes[fb.acerto] || "Fundamentação"} — ${fb.titulo || ""}</header>
        <div class="corpo">${fb.texto}</div>`;
      cont.appendChild(box);
    }
    const res = r.opcao.resultado;
    if (res) {
      const card = document.createElement("div");
      card.className = "cartao-desfecho cartao-interludio tom-" + (res.tom || "neutro");
      card.style.margin = "16px 0 0";
      card.innerHTML = `<div class="eyebrow">a consequência</div>
        <h3 style="margin:6px 0 8px;">${adaptDir(res.titulo)}</h3><p>${adaptDir(res.texto)}</p>`;
      cont.appendChild(card);
    }
    const restantes = M().despachosPendentes().length;
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.style.marginTop = "16px";
    btn.textContent = restantes ? `Próximo concluso (${restantes}) ›` : "Encerrar o expediente de gabinete";
    btn.onclick = () => restantes ? abrirDespachos() : sairDosDespachos();
    cont.appendChild(btn);
    // despachou o que dava: o resto espera na pilha sem ressentimento
    if (restantes) {
      const sair = document.createElement("button");
      sair.className = "btn-secundario";
      sair.style.marginTop = "10px";
      sair.textContent = "Por hoje chega — deixar os outros " + restantes + " para depois";
      sair.onclick = sairDosDespachos;
      cont.appendChild(sair);
    }
    btn.focus();
  }

  function sairDosDespachos() {
    despachoAtual = null;
    if (modo3d()) { TOGA.cena3d.entrarMundo(); return; }
    renderPauta();
    mostrarTela("tela-pauta");
  }

  /* ---------- Epílogo ---------- */
  /* As atividades externas no epílogo: no modo clássico é a porta
     de entrada delas; no 3D, um lembrete (lá fora é melhor). */
  function montarAtividadesEpilogo() {
    const velho = document.getElementById("atividades-epilogo");
    if (velho) velho.remove();
    if (!TOGA.atividades) return;
    const destravadas = TOGA.atividades.resumo().filter(a => a.destravada);
    if (!destravadas.length) return;
    const area = document.createElement("div");
    area.id = "atividades-epilogo";
    area.className = "atividades-epilogo";
    area.innerHTML = "<h3>🌳 Atividades da comarca destravadas</h3>";
    destravadas.forEach(a => {
      const b = document.createElement("button");
      b.className = "btn";
      b.textContent = a.icone + " " + a.nome + (a.concluida ? " ✓ (rever)" : "");
      b.addEventListener("click", () => {
        if (modo3d()) {
          alert("No modo 3D, saia para a rua pela porta do fórum ao fim da pauta — a cidade espera lá fora.");
          return;
        }
        TOGA.atividades.executarVisita(a.id, () => montarAtividadesEpilogo());
      });
      area.appendChild(b);
    });
    const ancora = document.getElementById("quadro-final");
    if (ancora) ancora.after(area);
  }

  function mostrarEpilogo() {
    if (TOGA.audio) TOGA.audio.ambiente(false);
    const ep = M().epilogo();
    montarAtividadesEpilogo();
    $("#veredito-selo").textContent = ep.veredito.titulo;
    $("#veredito-selo").className = "selo-grande selo-" + ep.veredito.selo;
    $("#veredito-texto").textContent = ep.veredito.texto;

    // Modo Prova: o boletim entra no topo do epílogo
    const boletimAntigo = document.getElementById("boletim-prova-area");
    if (boletimAntigo) boletimAntigo.remove();
    if (M().estado.modoProva && TOGA.gabarito) {
      const area = document.createElement("div");
      area.id = "boletim-prova-area";
      area.innerHTML = TOGA.gabarito.boletim(ep);
      $("#veredito-texto").after(area);
    }

    // quadro de carreira: registra os melhores resultados do dia
    ["linha-recorde", "bloco-excelencia", "bloco-conquistas-dia", "bloco-nivel"].forEach(id => {
      const velho = document.getElementById(id);
      if (velho) velho.remove();
    });
    const nivelAntes = TOGA.conquistas ? TOGA.conquistas.nivelCarreira() : null;
    if (M().registrarCarreira) {
      const reg = M().registrarCarreira(ep);
      if (reg.recorde) {
        const linha = document.createElement("p");
        linha.id = "linha-recorde";
        linha.className = "linha-recorde";
        linha.textContent = "🏅 Novo recorde pessoal registrado no seu quadro de carreira.";
        $("#veredito-texto").after(linha);
      }
    }

    if (TOGA.conquistas) {
      // medalhas do fim do dia (Excelência, dia exemplar, sereno...)
      TOGA.conquistas.avaliar("epilogo", { ep: ep });

      // 🏵 Selo Excelência: o dia fechou com os 4 eixos em alta
      const excelente = ["tec", "hum", "cel", "imp"].every(k => ep.reputacao[k] >= 75);
      if (excelente) {
        const selo = document.createElement("div");
        selo.id = "bloco-excelencia";
        selo.className = "bloco-excelencia";
        selo.innerHTML = `<span class="icone-medalha">🏵</span>
          <span><strong>Selo Excelência na Prestação Jurisdicional</strong><br>
          Técnica, Humanidade, Celeridade e Imparcialidade — todas em alta no mesmo dia.
          A placa já está no seu gabinete.</span>`;
        $("#veredito-texto").after(selo);
      }

      // subida de nível: a comarca passou a vê-lo(a) de outro jeito
      const nivelDepois = TOGA.conquistas.nivelCarreira();
      if (nivelAntes && nivelDepois.indice > nivelAntes.indice) {
        const bloco = document.createElement("div");
        bloco.id = "bloco-nivel";
        bloco.className = "bloco-nivel";
        bloco.innerHTML = `<div class="eyebrow">a carreira subiu de patamar</div>
          <div class="estrelas">${"★".repeat(nivelDepois.estrelas)}${"☆".repeat(5 - nivelDepois.estrelas)}</div>
          <strong>${nivelDepois.titulo}</strong>
          <p class="suave">É assim que a comarca passou a falar de você.</p>`;
        $("#veredito-texto").after(bloco);
        if (TOGA.audio) TOGA.audio.tocar("sino");
      }

      // conquistas desbloqueadas hoje
      const novas = TOGA.conquistas.colherNovas();
      if (novas.length) {
        const bloco = document.createElement("div");
        bloco.id = "bloco-conquistas-dia";
        bloco.className = "bloco-conquistas-dia";
        bloco.innerHTML = `<div class="eyebrow">conquistas do dia</div>` +
          novas.map(m => `<span class="chip-conquista">${m.icone} ${m.nome}</span>`).join("");
        $("#quadro-final").before(bloco);
      }
    }

    if (TOGA.epilogo && TOGA.epilogo.render) {
      TOGA.epilogo.render(ep);            // o jornal folheável (epilogo.js)
    } else {
      const mural = $("#mural-manchetes"); mural.innerHTML = "";
      ep.manchetes.forEach(m => {
        const r = document.createElement("div");
        r.className = "recorte" + (m.tom === "grave" ? " recorte-grave" : "");
        r.innerHTML = `<div class="fonte-jornal">${m.fonte}</div><h3>${m.titulo}</h3>`;
        mural.appendChild(r);
      });
    }

    const q = $("#quadro-final"); q.innerHTML = "";
    const nomes = { tec: "⚖ Técnica", hum: "❤ Humanidade", cel: "⏱ Celeridade", imp: "🛡 Imparcialidade" };
    Object.keys(nomes).forEach(k => {
      q.innerHTML += `<div class="metrica"><div class="valor">${ep.reputacao[k]}</div><div class="nome-eixo">${nomes[k]}</div></div>`;
    });
    q.innerHTML += `<div class="metrica"><div class="valor">${ep.otimas}/${ep.decisoes}</div><div class="nome-eixo">decisões exemplares</div></div>`;
    mostrarTela("tela-epilogo");
  }

  /* ---------- Tutorial da primeira partida ---------- */
  function mostrarTutorial(forcar) {
    // `forcar` = reabrir pelo botão "Como jogar" (ignora demo e a flag de
    // "já vi"); sem ele, só aparece uma vez, na primeira partida.
    if (!forcar) {
      if (TOGA.config && TOGA.config.demo) return;   // demonstração: direto ao caso
      try { if (localStorage.getItem("toga.tutorial.v1")) return; } catch (e) {}
    }
    const ehToque = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    const cartoes = [
      { titulo: "Bem-vindo(a) à comarca, Excelência",
        texto: "Você é o juiz. Cada decisão precisa de <strong>fundamento</strong> — e cada uma mexe nos quatro eixos da sua reputação: ⚖ Técnica, ❤ Humanidade, ⏱ Celeridade e 🛡 Imparcialidade. Não existe vencer: existe <em>decidir bem</em>." },
      { titulo: "A sequência do dia — onde clicar, na ordem",
        texto: "1) <strong>Consulte a pauta</strong> (no 3D, o computador do gabinete; no clássico, ela já abre). 2) Escolha um caso e <strong>abra os autos</strong> na mesa. 3) Clique em <strong>“🔔 Apregoar as partes”</strong> para <strong>iniciar a audiência</strong>. 4) Entre audiências, despache os <strong>📥 conclusos</strong> que chegam ao gabinete (decisões sem audiência). 5) Atenda os <strong>expedientes da Diretoria</strong> (a servidora Samantha) — pedidos administrativos. Feche o dia na <strong>porta de saída</strong>." },
      { titulo: "Antes de cada audiência",
        texto: "Abra os <strong>autos</strong> e leia as peças. Marque até <strong>2 focos de estudo</strong>: as decisões ligadas a eles saem <strong>de graça</strong>. Sem o foco, dá para <strong>reler os autos na hora</strong> — mas custa minutos, e o relógio do fórum não perdoa. Dá até para <strong>grifar</strong> trechos com o marca-texto: é seu caderno de juiz." },
      { titulo: "Na audiência",
        texto: "As falas avançam com " + (ehToque ? "um toque" : "clique (ou Enter)") + ". Nas decisões, leia o <strong>fundamento</strong> de cada opção — a primeira nem sempre é a certa. Com o Modo Estudo ligado, você recebe a explicação jurídica após decidir. E sim: o <strong>martelo</strong> é " + (ehToque ? "tocável" : "clicável") + "." },
      { titulo: "A toga pesa",
        texto: "A barra 🫀 <strong>Estresse</strong> sobe com decisões erradas, casos difíceis e gente gritando. No limite, a visão embaça, você <strong>mal consegue ler os fundamentos</strong> e cada decisão custa minutos a mais. Alivie: <strong>beba água</strong>, coma algo no <strong>frigobar</strong> — e, se precisar, passe no <strong>setor de saúde</strong>. Se chegar ao limite, você passa mal e a equipe médica entra em ação. Há também a pilha de <strong>conclusos</strong>: despachos que decidem vidas sem audiência." },
      { titulo: "A comarca além do fórum",
        texto: "O <strong>🌳 Parque da Cidade</strong> é de <strong>acesso livre A QUALQUER HORA</strong> — saia pela <strong>porta dos fundos</strong>, no <strong>fim do corredor leste</strong> (longe da entrada principal). Lá há lago, fonte, playground e a <strong>bicicleta</strong>, que você <strong>pilota livre</strong> para <strong>aliviar o estresse</strong>. Na <strong>orla ao norte do Parque</strong> fica visível a <strong>🏖 ACM</strong>, o Clube dos Magistrados à beira-mar (auditório, esportes e a Diretoria) — entre pelo portão dela com <strong>5 conquistas</strong>. Ao <strong>fim da pauta</strong>, a saída principal abre a <strong>rua</strong> (Delegacia, Escola, ESMEC). Tudo aparece no <strong>🏅 quadro de Conquistas</strong>." }
    ];
    if (modo3d()) {
      cartoes.push({ titulo: "Andando pelo fórum",
        texto: ehToque
          ? "Use o <strong>joystick</strong> para andar, arraste a tela para girar e <strong>toque no aviso</strong> para interagir. O objetivo no topo sempre diz o próximo passo."
          : "Use <strong>W A S D</strong> para andar, ← → ou o mouse para girar e <strong>E</strong> para interagir. O objetivo no topo sempre diz o próximo passo." });
    }

    let i = 0;
    const overlay = document.createElement("div");
    overlay.id = "tutorial";
    overlay.innerHTML = `
      <div class="cartao-tutorial">
        <div class="eyebrow">como se joga · <span id="tut-passo"></span></div>
        <h2 id="tut-titulo"></h2>
        <p id="tut-texto"></p>
        <div class="acoes-desfecho">
          <button class="btn" id="tut-proximo">Próximo ›</button>
          <button class="btn-secundario pular" id="tut-pular">Pular tutorial</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    function render() {
      overlay.querySelector("#tut-passo").textContent = (i + 1) + " / " + cartoes.length;
      overlay.querySelector("#tut-titulo").textContent = cartoes[i].titulo;
      overlay.querySelector("#tut-texto").innerHTML = cartoes[i].texto;
      overlay.querySelector("#tut-proximo").textContent =
        i === cartoes.length - 1 ? "⚖ Começar o expediente" : "Próximo ›";
    }
    function fechar() {
      try { localStorage.setItem("toga.tutorial.v1", "1"); } catch (e) {}
      overlay.remove();
    }
    overlay.querySelector("#tut-proximo").addEventListener("click", () => {
      if (i < cartoes.length - 1) { i++; render(); } else fechar();
    });
    overlay.querySelector("#tut-pular").addEventListener("click", fechar);
    render();
  }

  /* ---------- Amarrações de eventos fixos ---------- */
  function ligarEventos() {
    $("#caixa-fala").addEventListener("click", () => {
      if (digitando) { digitando(); return; }  // 1º clique completa o texto
      proximaFala();                            // 2º clique avança
    });

    // Teclado também avança a audiência (Enter, Espaço ou →) —
    // acessibilidade: nem todo jogador usa mouse.
    document.addEventListener("keydown", (ev) => {
      if (!$("#tela-audiencia").classList.contains("ativa")) return;
      if (ev.key !== "Enter" && ev.key !== " " && ev.key !== "ArrowRight") return;
      if (document.activeElement && document.activeElement.tagName === "BUTTON") return; // botão focado decide por si
      ev.preventDefault();
      if (digitando) { digitando(); return; }
      if ($("#painel-decisao").children.length === 0) proximaFala();
    });
    $("#btn-iniciar-audiencia").addEventListener("click", prepararOuIniciarAudiencia);
    $("#btn-voltar-pauta-autos").addEventListener("click", () => {
      if (modo3d()) { TOGA.cena3d.entrarMundo(); return; }
      renderPauta(); mostrarTela("tela-pauta");
    });
    $("#btn-continuar-desfecho").addEventListener("click", continuarAposDesfecho);
    $("#btn-continuar-interludio").addEventListener("click", continuarAposDesfecho);

    const conclusos = $("#btn-conclusos");
    if (conclusos) conclusos.addEventListener("click", abrirDespachos);

    // revisão comentada (gabarito)
    $("#btn-gabarito").addEventListener("click", () => {
      TOGA.gabarito.render();
      mostrarTela("tela-gabarito");
    });
    $("#btn-voltar-epilogo").addEventListener("click", () => mostrarTela("tela-epilogo"));

    // cartão do caso recém-decidido (compartilhável)
    const btnCartaoCaso = $("#btn-cartao-caso");
    if (btnCartaoCaso) {
      if (TOGA.cartao && TOGA.cartao.suportaShare()) btnCartaoCaso.textContent = "🖼 Compartilhar este caso";
      btnCartaoCaso.addEventListener("click", () => {
        if (!ultimoDesfecho || !TOGA.cartao) return;
        if (TOGA.cartao.suportaShare()) TOGA.cartao.compartilharCaso(ultimoDesfecho.caso, ultimoDesfecho.fim);
        else TOGA.cartao.baixarCaso(ultimoDesfecho.caso, ultimoDesfecho.fim);
      });
    }

    // cartão do dia (compartilhável)
    const btnCartao = $("#btn-cartao");
    if (btnCartao) {
      if (TOGA.cartao && TOGA.cartao.suportaShare()) btnCartao.textContent = "🖼 Compartilhar meu cartão do dia";
      btnCartao.addEventListener("click", () => {
        const ep = M().epilogo();
        if (TOGA.cartao.suportaShare()) TOGA.cartao.compartilhar(ep);
        else TOGA.cartao.baixar(ep);
      });
    }

    // código do resultado (estatística de turma sem servidor)
    const btnCodigo = $("#btn-codigo");
    if (btnCodigo) btnCodigo.addEventListener("click", () => {
      if (!TOGA.resultado) return;
      TOGA.resultado.copiar((ok) => {
        const original = "📋  Copiar código do resultado (para o professor)";
        btnCodigo.textContent = ok ? "✓ Código copiado — cole onde o professor pediu" : original;
        if (ok) setTimeout(() => { btnCodigo.textContent = original; }, 3500);
      });
    });

    // pausas de autocuidado na pauta (modo 2D)
    [["#btn-agua", "agua"], ["#btn-lanche", "lanche"], ["#btn-saude", "saude"]].forEach(([sel, tipo]) => {
      const b = $(sel);
      if (b) b.addEventListener("click", () => {
        const msg = pausa(tipo);
        renderPauta();                 // atualiza relógio/atraso
        if (msg) {
          const aviso = document.createElement("div");
          aviso.className = "aviso-pausa";
          aviso.textContent = msg;
          $("#linha-pausas").after(aviso);
          setTimeout(() => aviso.remove(), 4200);
        }
      });
    });
  }

  return { mostrarTela, renderPauta, atualizarHUD, ligarEventos, mostrarEpilogo,
           pausa, atualizarPausas, abrirDespachos, mostrarTutorial,
           // expostos para o modo 3D (o mundo "aperta os mesmos botões")
           abrirAutos, iniciarAudiencia, audienciaPronta, abrirInterludioPendente };
})();
