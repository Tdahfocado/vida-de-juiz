/* ============================================================
   TOGA — minijogos.js : OS MINIJOGOS DA ACM (de verdade)
   ------------------------------------------------------------
   Joguinhos REAIS em canvas, em tempo real, jogados com e contra
   juízas e juízes do TJCE (TOGA.juizesTJCE):

     • ⚽ Pênaltis   — você MIRA (◄ ►), segura AÇÃO p/ FORÇA e solta
                       para chutar; ao defender, você PULA para o canto.
     • 🎾 Beach Tennis — rebata a bola (raquete move com ◄ ►; AÇÃO dá
                       potência) num rali estilo Pong; ponto de quem passa.
     • 🏊 Natação    — nade alternando as braçadas (◄ e ► alternados);
                       ritmo constante vence a raia dos colegas.

   Teclas: ◄/A · ►/D · AÇÃO = Espaço/▲/W. Há botões na tela (toque).
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.minijogos = (function () {
  const CW = 760, CH = 460;
  let overlay = null, canvas = null, ctx = null, raf = null, emJogo = false;
  const pressed = { esq: false, dir: false, acao: false };
  let onPress = null;     // callback de borda (uma vez por pressionar)

  function sortear(n) {
    const j = TOGA.juizesTJCE;
    return (j && j.sortearJuizes) ? j.sortearJuizes(n)
      : Array.from({ length: n }, function (_, i) { return { nome: "Colega " + (i + 1), lotacao: "Comarca" }; });
  }
  function prim(nome) { return nome.split(" ")[0]; }

  /* ---------- entrada (teclado + botões de toque) ---------- */
  function tecla(e) { const k = e.key.toLowerCase(); return k === "arrowleft" || k === "a" ? "esq"
    : k === "arrowright" || k === "d" ? "dir"
    : k === " " || k === "arrowup" || k === "w" ? "acao" : null; }
  function setBotao(nome, val) {
    if (!nome) return;
    if (val && !pressed[nome]) { pressed[nome] = true; if (onPress) onPress(nome); }
    else if (!val) pressed[nome] = false;
  }
  function kd(e) { const n = tecla(e); if (n) { e.preventDefault(); setBotao(n, true); } }
  function ku(e) { const n = tecla(e); if (n) { e.preventDefault(); setBotao(n, false); } }

  function abrir() {
    emJogo = true;
    pressed.esq = pressed.dir = pressed.acao = false; onPress = null;
    overlay = document.createElement("div");
    overlay.id = "minijogo-overlay"; overlay.className = "minijogo-overlay";
    canvas = document.createElement("canvas");
    canvas.width = CW; canvas.height = CH; canvas.className = "minijogo-canvas";
    overlay.appendChild(canvas);
    // botões de toque
    const barra = document.createElement("div"); barra.className = "minijogo-botoes";
    [["◄", "esq"], ["AÇÃO", "acao"], ["►", "dir"]].forEach(function (b) {
      const btn = document.createElement("button");
      btn.className = "mj-btn" + (b[1] === "acao" ? " mj-acao" : "");
      btn.textContent = b[0];
      btn.addEventListener("pointerdown", function (ev) { ev.preventDefault(); setBotao(b[1], true); });
      btn.addEventListener("pointerup", function () { setBotao(b[1], false); });
      btn.addEventListener("pointerleave", function () { setBotao(b[1], false); });
      barra.appendChild(btn);
    });
    overlay.appendChild(barra);
    document.body.appendChild(overlay);
    ctx = canvas.getContext("2d");
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
  }
  function fechar() {
    if (raf) cancelAnimationFrame(raf); raf = null;
    window.removeEventListener("keydown", kd);
    window.removeEventListener("keyup", ku);
    if (overlay) { overlay.remove(); overlay = null; }
    emJogo = false; onPress = null;
  }
  function loop(passo) {
    let last = null;
    function step(now) {
      if (!emJogo) return;
      if (last == null) last = now;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      passo(dt);
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }

  /* ---------- helpers de desenho ---------- */
  function fundo(c1, c2) {
    const g = ctx.createLinearGradient(0, 0, 0, CH);
    g.addColorStop(0, c1); g.addColorStop(1, c2);
    ctx.fillStyle = g; ctx.fillRect(0, 0, CW, CH);
  }
  function texto(t, x, y, font, cor, align) {
    ctx.fillStyle = cor || "#f4ecd9"; ctx.font = font || "bold 20px Georgia, serif";
    ctx.textAlign = align || "center"; ctx.textBaseline = "middle"; ctx.fillText(t, x, y);
  }
  function painelTopo(titulo, placar) {
    ctx.fillStyle = "rgba(10,8,5,.55)"; ctx.fillRect(0, 0, CW, 56);
    texto(titulo, 18, 28, "bold 22px Georgia, serif", "#e7cf9a", "left");
    if (placar) texto(placar, CW - 18, 28, "bold 22px Georgia, serif", "#fff", "right");
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
  // tela de “toque/clique para começar/continuar”
  function aguardarAcao(cb) {
    const ant = onPress;
    onPress = function (n) { if (n === "acao") { onPress = ant; cb(); } };
  }

  /* ============================================================
     ⚽ PÊNALTIS — mira + força (segura) + pulo na defesa
     ============================================================ */
  function penaltis(aoFim) {
    if (emJogo) return; abrir();
    const js = sortear(2), bat = js[0], gol = js[1];
    const GX = CW / 2, GW = 360, GTOP = 70, GBOT = 168, golY = GBOT;
    const zonas = [GX - GW / 2 + GW / 6, GX, GX + GW / 2 - GW / 6];  // centros L/C/R
    const N = 5;
    let gv = 0, ge = 0, rod = 0, modo = "cobrar", fase = "pronto";
    let aimX = GX, dir = 1, power = 0, carregando = false;
    let bola = { x: GX, y: 400, vx: 0, vy: 0 }, alvo = null, resultado = "", tRes = 0;
    let golKeeper = GX, golAlvo = GX, pulou = false, pulouZona = -1, msgFlash = "";

    function zonaDe(x) { return x < GX - GW / 6 ? 0 : x > GX + GW / 6 ? 2 : 1; }

    onPress = function (n) {
      if (modo === "cobrar" && fase === "mirar" && n === "acao") { carregando = true; }
      if (modo === "defender" && fase === "voando" && !pulou && (n === "esq" || n === "dir" || n === "acao")) {
        pulou = true; pulouZona = n === "esq" ? 0 : n === "dir" ? 2 : 1;
        golAlvo = zonas[pulouZona];
      }
    };

    function novaRodada() {
      power = 0; carregando = false; pulou = false; pulouZona = -1; resultado = ""; msgFlash = "";
      golKeeper = GX; golAlvo = GX;
      if (rod >= N && gv !== ge) { fim(); return; }
      if (rod >= N) msgFlash = "EMPATE — morte súbita!";
      if (modo === "cobrar") { fase = "mirar"; bola = { x: GX, y: 400 }; aimX = GX; }
      else { // defender: o adversário escolhe um alvo escondido
        fase = "voando"; bola = { x: GX, y: 400 };
        alvo = zonas[Math.floor(Math.random() * 3)];
        bola.vx = (alvo - GX) / 0.85; bola.vy = (golY - 400) / 0.85;
      }
    }

    function passo(dt) {
      // ---- atualização ----
      if (modo === "cobrar") {
        if (fase === "mirar") {
          if (pressed.esq) aimX -= 240 * dt;
          if (pressed.dir) aimX += 240 * dt;
          aimX = Math.max(GX - GW / 2 + 14, Math.min(GX + GW / 2 - 14, aimX));
          if (carregando) {
            power = Math.min(100, power + 95 * dt);
            if (!pressed.acao) {   // soltou → chuta
              fase = "voando"; alvo = aimX;
              bola.vx = (alvo - GX) / 0.5; bola.vy = (golY - 400) / 0.5;
              const zb = zonaDe(alvo);
              golAlvo = zonas[(Math.random() < 0.5) ? zb : Math.floor(Math.random() * 3)];  // o goleiro chuta/erra
            }
          }
        } else if (fase === "voando") {
          bola.x += bola.vx * dt; bola.y += bola.vy * dt;
          golKeeper += (golAlvo - golKeeper) * Math.min(1, 9 * dt);
          if (bola.y <= golY) {
            bola.y = golY;
            const zb = zonaDe(alvo), zk = zonaDe(golKeeper);
            if (power > 92) { resultado = "FORA!"; }
            else if (power < 20) { resultado = "FRACO — DEFENDEU"; }
            else if (zb === zk) { resultado = "DEFENDEU!"; }
            else { resultado = "GOOOL!"; gv++; }
            fase = "resultado"; tRes = 0;
          }
        } else if (fase === "resultado") {
          tRes += dt;
          if (tRes > 1.5) { rod++; modo = "defender"; novaRodada(); }
        }
      } else { // DEFENDER
        if (fase === "voando") {
          bola.x += bola.vx * dt; bola.y += bola.vy * dt;
          if (pulou) golKeeper += (golAlvo - golKeeper) * Math.min(1, 12 * dt);
          if (bola.y <= golY) {
            bola.y = golY;
            const zb = zonaDe(alvo);
            if (pulou && pulouZona === zb) { resultado = "DEFENDEU!"; }
            else { resultado = "GOL DELES"; ge++; }
            fase = "resultado"; tRes = 0;
          }
        } else if (fase === "resultado") {
          tRes += dt;
          if (tRes > 1.5) { rod++; modo = "cobrar"; novaRodada(); }
        }
      }

      // ---- desenho ----
      fundo("#3e6e9e", "#2b8a4a");
      // gramado
      ctx.fillStyle = "#2f8a46"; ctx.fillRect(0, 200, CW, CH - 200);
      ctx.strokeStyle = "rgba(255,255,255,.25)"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(GX, golY, 70, 0, Math.PI); ctx.stroke();   // meia-lua
      // gol
      ctx.strokeStyle = "#f4f4f4"; ctx.lineWidth = 6;
      ctx.strokeRect(GX - GW / 2, GTOP, GW, GBOT - GTOP);
      ctx.lineWidth = 1; ctx.strokeStyle = "rgba(255,255,255,.4)";
      for (let i = 1; i < 9; i++) { ctx.beginPath(); ctx.moveTo(GX - GW / 2 + i * GW / 9, GTOP); ctx.lineTo(GX - GW / 2 + i * GW / 9, GBOT); ctx.stroke(); }
      for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(GX - GW / 2, GTOP + i * (GBOT - GTOP) / 4); ctx.lineTo(GX + GW / 2, GTOP + i * (GBOT - GTOP) / 4); ctx.stroke(); }
      // goleiro
      const keeperX = (modo === "cobrar" || fase !== "pronto") ? golKeeper : GX;
      ctx.fillStyle = "#e0c020";
      ctx.fillRect(keeperX - 16, GTOP + 22, 32, 96);
      ctx.beginPath(); ctx.arc(keeperX, GTOP + 14, 13, 0, Math.PI * 2); ctx.fillStyle = "#d8a87f"; ctx.fill();
      // bola
      ctx.beginPath(); ctx.arc(bola.x, bola.y, 11, 0, Math.PI * 2); ctx.fillStyle = "#fff"; ctx.fill();
      ctx.strokeStyle = "#222"; ctx.lineWidth = 1.5; ctx.stroke();
      // mira (cobrança)
      if (modo === "cobrar" && fase === "mirar") {
        ctx.strokeStyle = "#e8413a"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(aimX, GTOP + (GBOT - GTOP) / 2, 16, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(aimX - 22, GTOP + (GBOT - GTOP) / 2); ctx.lineTo(aimX + 22, GTOP + (GBOT - GTOP) / 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(aimX, GTOP + (GBOT - GTOP) / 2 - 22); ctx.lineTo(aimX, GTOP + (GBOT - GTOP) / 2 + 22); ctx.stroke();
        // barra de força
        ctx.fillStyle = "rgba(0,0,0,.4)"; ctx.fillRect(GX - 120, 410, 240, 22);
        ctx.fillStyle = power > 92 ? "#e8413a" : power < 20 ? "#888" : "#5bbf6a";
        ctx.fillRect(GX - 118, 412, 236 * power / 100, 18);
        texto("FORÇA — segure AÇÃO e solte para chutar", GX, 444, "bold 14px Georgia", "#f4ecd9");
      }
      if (modo === "defender" && fase === "voando" && !pulou) {
        texto("PULE! ◄ canto esq · AÇÃO centro · ► canto dir", GX, 420, "bold 16px Georgia", "#ffe2a8");
      }
      if (resultado) texto(resultado, GX, 250, "bold 40px Georgia, serif",
        resultado.indexOf("GOL") === 0 || resultado.indexOf("GOOOL") === 0 ? (modo === "cobrar" ? "#7CFC9A" : "#e8413a")
          : resultado.indexOf("DEFENDEU") >= 0 ? (modo === "cobrar" ? "#e8413a" : "#7CFC9A") : "#ffd24a");
      painelTopo(modo === "cobrar" ? "⚽ Sua cobrança" : "⚽ Você no gol",
        "Você " + gv + " × " + ge + " " + prim(bat.nome));
      if (msgFlash) texto(msgFlash, GX, 78, "bold 18px Georgia", "#ffd24a");
      texto(modo === "cobrar" ? ("goleiro: " + prim(gol.nome)) : ("batedor: " + prim(bat.nome)),
        GX, 192, "italic 15px Georgia", "rgba(255,255,255,.85)");
    }

    function fim() {
      const v = gv > ge; fechar();
      aplicarFim(v, "penaltis",
        v ? "🏆 Vitória nos pênaltis, " + gv + "×" + ge + "! Você mirou, dosou a força e ainda voou no gol. " + prim(bat.nome) + ": “falta o senhor no nosso time, Excelência.”"
          : "🤝 A seleção de " + prim(bat.nome) + " levou, " + ge + "×" + gv + ". Bola, suor e nenhuma sentença — e o estresse foi junto. (aliviado)", aoFim);
    }

    // intro
    fundo("#3e6e9e", "#2b8a4a");
    texto("⚽ PÊNALTIS", GX, 150, "bold 40px Georgia, serif", "#e7cf9a");
    texto("Você cobra 5 e defende 5 contra a seleção de " + prim(bat.nome) + ".", GX, 210, "bold 18px Georgia", "#f4ecd9");
    texto("MIRE com ◄ ►, SEGURE AÇÃO para a força e solte para chutar.", GX, 245, "16px Georgia", "#f4ecd9");
    texto("No gol, PULE: ◄ / AÇÃO / ► para o canto.", GX, 275, "16px Georgia", "#f4ecd9");
    texto("▶ aperte AÇÃO para começar", GX, 340, "bold 20px Georgia", "#ffe2a8");
    aguardarAcao(function () { modo = "cobrar"; novaRodada(); loop(passo); });
  }

  /* ============================================================
     🎾 BEACH TENNIS — rali estilo Pong, com potência
     ============================================================ */
  function beachTennis(aoFim) {
    if (emJogo) return; abrir();
    const js = sortear(2), adv = js[0], parc = js[1];
    const ALVO = 5;
    let voce = 0, eles = 0;
    const padW = 120, padH = 16, meuY = CH - 70, advY = 70;
    let meuX = CW / 2, advX = CW / 2;
    let bola = { x: CW / 2, y: CH / 2, vx: 160, vy: -260, r: 11 };
    let golpe = "", tGolpe = 0;
    function saque(dir) { bola = { x: CW / 2, y: CH / 2, vx: (Math.random() * 160 - 80), vy: dir * 260, r: 11 }; }

    function passo(dt) {
      // raquete do jogador
      if (pressed.esq) meuX -= 420 * dt;
      if (pressed.dir) meuX += 420 * dt;
      meuX = Math.max(padW / 2, Math.min(CW - padW / 2, meuX));
      // IA do adversário (segue a bola com folga)
      const alvo = bola.vy < 0 ? bola.x : CW / 2;
      advX += Math.max(-300 * dt, Math.min(300 * dt, (alvo - advX)));
      advX = Math.max(padW / 2, Math.min(CW - padW / 2, advX));
      // bola
      bola.x += bola.vx * dt; bola.y += bola.vy * dt;
      if (bola.x < bola.r) { bola.x = bola.r; bola.vx = Math.abs(bola.vx); }
      if (bola.x > CW - bola.r) { bola.x = CW - bola.r; bola.vx = -Math.abs(bola.vx); }
      // rebatida do jogador (embaixo)
      if (bola.vy > 0 && bola.y + bola.r >= meuY && bola.y < meuY + padH && Math.abs(bola.x - meuX) < padW / 2 + 6) {
        bola.y = meuY - bola.r; bola.vy = -Math.abs(bola.vy);
        const dx = (bola.x - meuX) / (padW / 2);
        bola.vx = dx * 230;
        const pot = pressed.acao ? 1.35 : 1.06;     // AÇÃO = potência
        bola.vy *= pot; bola.vx *= pot;
        golpe = pressed.acao ? "POTÊNCIA!" : "rebatida"; tGolpe = 0;
        bola.vy = Math.max(-560, bola.vy);
      }
      // rebatida do adversário (em cima) — erra às vezes
      if (bola.vy < 0 && bola.y - bola.r <= advY + padH && bola.y > advY && Math.abs(bola.x - advX) < padW / 2 + 4) {
        bola.y = advY + padH + bola.r; bola.vy = Math.abs(bola.vy) * (0.98 + Math.random() * 0.12);
        bola.vx = (bola.x - advX) / (padW / 2) * (180 + Math.random() * 120);
      }
      // ponto
      if (bola.y > CH + 20) { eles++; if (eles < ALVO && voce < ALVO) saque(-1); else fim(); }
      else if (bola.y < -20) { voce++; if (voce < ALVO && eles < ALVO) saque(1); else fim(); }
      if (golpe) { tGolpe += dt; if (tGolpe > 0.7) golpe = ""; }

      // desenho
      fundo("#e7c98a", "#d8a44a");                  // areia
      ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 3;
      ctx.strokeRect(20, 20, CW - 40, CH - 40);
      ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(20, CH / 2); ctx.lineTo(CW - 20, CH / 2); ctx.stroke(); ctx.setLineDash([]);
      // raquetes
      ctx.fillStyle = "#2f6a8a"; ctx.fillRect(meuX - padW / 2, meuY, padW, padH);
      ctx.fillStyle = "#8e3a2a"; ctx.fillRect(advX - padW / 2, advY, padW, padH);
      // bola
      ctx.beginPath(); ctx.arc(bola.x, bola.y, bola.r, 0, Math.PI * 2); ctx.fillStyle = "#f2e85a"; ctx.fill();
      ctx.strokeStyle = "#5a5a20"; ctx.lineWidth = 1.5; ctx.stroke();
      if (golpe) texto(golpe, meuX, meuY - 26, "bold 18px Georgia", golpe === "POTÊNCIA!" ? "#e8413a" : "#fff");
      painelTopo("🎾 Beach Tennis (até " + ALVO + ")", "Você " + voce + " × " + eles + " " + prim(adv.nome));
      texto("◄ ► move a raquete · segure AÇÃO ao rebater para POTÊNCIA", CW / 2, CH - 26, "bold 14px Georgia", "#3a2c12");
    }
    function fim() {
      const v = voce > eles; fechar();
      aplicarFim(v, "beachTennis",
        v ? "🏆 Game seu, " + voce + "×" + eles + "! " + prim(adv.nome) + " tira o boné: “raquetada de Excelência!”."
          : "🤝 Game de " + prim(adv.nome) + ", " + eles + "×" + voce + ". Você ri, devolve a bola e aperta a mão — na ACM o placar some. (estresse aliviado)", aoFim);
    }
    fundo("#e7c98a", "#d8a44a");
    texto("🎾 BEACH TENNIS", CW / 2, 150, "bold 40px Georgia, serif", "#5a3a12");
    texto("Rali contra " + prim(adv.nome) + " — primeiro a " + ALVO + " pontos.", CW / 2, 210, "bold 18px Georgia", "#3a2c12");
    texto("Mova a raquete com ◄ ►. Segure AÇÃO ao rebater para dar POTÊNCIA.", CW / 2, 245, "16px Georgia", "#3a2c12");
    texto("▶ aperte AÇÃO para sacar", CW / 2, 330, "bold 20px Georgia", "#8e3a2a");
    aguardarAcao(function () { saque(-1); loop(passo); });
  }

  /* ============================================================
     🏊 NATAÇÃO 200m — braçadas alternadas (◄ e ►)
     ============================================================ */
  function natacao(aoFim) {
    if (emJogo) return; abrir();
    const js = sortear(2), r1 = js[0], r2 = js[1];
    const META = 100;
    let prog = 0, vel = 0, ultimo = "", combo = 0;
    let p1 = 0, p2 = 0;
    const v1 = 9.5 + Math.random() * 2.5, v2 = 9.5 + Math.random() * 2.5;
    let acabou = false, tFim = 0;

    onPress = function (n) {
      if (acabou) return;
      if (n === "esq" || n === "dir") {
        if (ultimo && n !== ultimo) { vel += 2.2; combo++; }   // alternou: braçada boa
        else { vel = Math.max(0, vel - 1.0); combo = 0; }       // mesma mão: perdeu o ritmo
        ultimo = n;
      }
    };
    function passo(dt) {
      if (!acabou) {
        vel = Math.max(0, vel - 5.5 * dt);          // atrito: precisa manter o ritmo
        prog = Math.min(META, prog + vel * dt);
        p1 = Math.min(META, p1 + v1 * dt);
        p2 = Math.min(META, p2 + v2 * dt);
        if (prog >= META || p1 >= META || p2 >= META) acabou = true;
      } else { tFim += dt; if (tFim > 0.9) { fim(); return; } }

      fundo("#1f6f9a", "#2a8fb8");
      // raias
      const raias = [{ p: prog, c: "#ffe28a", n: "VOCÊ", eu: true }, { p: p1, c: "#e8e2d2", n: prim(r1.nome) }, { p: p2, c: "#cfd8df", n: prim(r2.nome) }];
      raias.forEach(function (r, i) {
        const y = 120 + i * 110;
        ctx.fillStyle = "rgba(255,255,255,.08)"; ctx.fillRect(40, y - 36, CW - 80, 72);
        ctx.strokeStyle = "rgba(255,255,255,.3)"; ctx.setLineDash([10, 10]);
        ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(CW - 80, y); ctx.stroke(); ctx.setLineDash([]);
        const x = 60 + (CW - 150) * r.p / META;
        ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.fillStyle = r.c; ctx.fill();
        ctx.strokeStyle = "#15405a"; ctx.lineWidth = 2; ctx.stroke();
        texto(r.n, 44, y - 48, "bold 14px Georgia", r.eu ? "#ffe28a" : "#e8e2d2", "left");
        texto(Math.round(r.p) + "%", CW - 44, y, "bold 16px Georgia", "#fff", "right");
      });
      // chegada
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.setLineDash([6, 6]);
      ctx.beginPath(); ctx.moveTo(CW - 86, 80); ctx.lineTo(CW - 86, CH - 16); ctx.stroke(); ctx.setLineDash([]);
      painelTopo("🏊 Natação 200m", "ritmo: " + (combo > 3 ? "🔥" : combo > 0 ? "ok" : "—"));
      if (acabou) texto("🏁 CHEGADA!", CW / 2, CH / 2, "bold 44px Georgia, serif", "#ffe28a");
      texto("ALTERNE ◄ e ► para nadar — ritmo constante mantém a velocidade!", CW / 2, CH - 24, "bold 15px Georgia", "#eaf6ff");
    }
    function fim() {
      const arr = [{ n: "Você", p: prog, eu: true }, { n: prim(r1.nome), p: p1 }, { n: prim(r2.nome), p: p2 }]
        .sort(function (a, b) { return b.p - a.p; });
      const pos = arr.findIndex(function (x) { return x.eu; }) + 1;
      fechar();
      const v = pos === 1;
      aplicarFim(v, "natacao",
        v ? "🥇 1º LUGAR! Braçadas no compasso, você toca a borda primeiro. " + prim(r1.nome) + ", ofegante: “onde o senhor treina, Excelência?”"
          : pos === 2 ? "🥈 2º lugar por uma braçada, atrás de " + arr[0].n + ". Revanche marcada."
            : "🥉 3º lugar — mas o cloro levou o estresse junto. A pauta ficou lá fora. (aliviado)", aoFim);
    }
    fundo("#1f6f9a", "#2a8fb8");
    texto("🏊 NATAÇÃO 200m", CW / 2, 150, "bold 40px Georgia, serif", "#eaf6ff");
    texto("Raia 4, contra " + prim(r1.nome) + " e " + prim(r2.nome) + ".", CW / 2, 210, "bold 18px Georgia", "#eaf6ff");
    texto("ALTERNE ◄ e ► (braço esquerdo / direito). Ritmo constante = velocidade!", CW / 2, 245, "16px Georgia", "#eaf6ff");
    texto("▶ aperte AÇÃO para mergulhar", CW / 2, 330, "bold 20px Georgia", "#ffe28a");
    aguardarAcao(function () { loop(passo); });
  }

  /* ============================================================
     ⚡ CORRIDA DO ALVARÁ — a Núbia, "setor de alvarás"
     Alterne ◄ e ► para a Núbia carimbar alvarás. Ritmo constante
     = mais alvarás antes do relógio zerar. (dinâmica da festa)
     ============================================================ */
  function corridaAlvara(aoFim) {
    if (emJogo) return; abrir();
    const META = 16, TEMPO = 22;
    let prog = 0, vel = 0, ultimo = "", combo = 0, conta = 0, tempo = TEMPO;
    let acabou = false, tFim = 0, flash = 0, braco = 0;

    onPress = function (n) {
      if (acabou) return;
      if (n === "esq" || n === "dir") {
        if (ultimo && n !== ultimo) { vel += 2.4; combo++; }
        else { vel = Math.max(0, vel - 1.2); combo = 0; }
        ultimo = n; braco = n === "esq" ? -1 : 1;
      }
    };
    function passo(dt) {
      if (!acabou) {
        vel = Math.max(0, vel - 5.5 * dt);
        prog += vel * dt * 12;
        while (prog >= 100) { prog -= 100; conta++; flash = 0.35; }
        tempo -= dt;
        if (conta >= META || tempo <= 0) acabou = true;
      } else { tFim += dt; if (tFim > 0.9) { fim(); return; } }
      if (flash > 0) flash -= dt;

      fundo("#3a2c52", "#23396b");
      painelTopo("⚡ Corrida do Alvará — Núbia", "alvarás: " + conta + "/" + META);
      // balcão
      ctx.fillStyle = "#5e3f22"; ctx.fillRect(120, 250, CW - 240, 120);
      ctx.fillStyle = "#7a5230"; ctx.fillRect(120, 250, CW - 240, 16);
      // a Núbia carimbando (braço sobe e desce)
      const bx = CW / 2;
      ctx.fillStyle = "#a86a48"; ctx.beginPath(); ctx.arc(bx, 210, 26, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#4a5a6e"; ctx.fillRect(bx - 30, 232, 60, 60);
      const erguer = (flash > 0 ? -22 : 0) + Math.sin(combo) * 2;
      ctx.strokeStyle = "#a86a48"; ctx.lineWidth = 10; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(bx + braco * 18, 244); ctx.lineTo(bx + braco * 40, 268 + erguer); ctx.stroke();
      // carimbo
      ctx.fillStyle = "#7a2e2e"; ctx.fillRect(bx + braco * 40 - 9, 262 + erguer, 18, 14);
      // pilha de alvarás restantes (diminui)
      const restam = Math.max(0, META - conta);
      for (let i = 0; i < Math.min(restam, 12); i++) {
        ctx.fillStyle = i % 2 ? "#f4ecd9" : "#e2d6ba";
        ctx.fillRect(CW - 220 + (i % 4) * 4, 300 - i * 4, 70, 10);
      }
      // alvará carimbado voando
      if (flash > 0) { texto("✔ CARIMBADO!", bx, 150, "bold 24px Georgia", "#7CFC9A"); }
      // barra de tempo
      ctx.fillStyle = "rgba(0,0,0,.4)"; ctx.fillRect(120, 400, CW - 240, 20);
      ctx.fillStyle = tempo < 6 ? "#e8413a" : "#5bbf6a";
      ctx.fillRect(122, 402, (CW - 244) * Math.max(0, tempo) / TEMPO, 16);
      texto("ALTERNE ◄ e ► para carimbar — ritmo constante!", CW / 2, 438, "bold 15px Georgia", "#ffe2a8");
      if (acabou) texto(conta >= META ? "🏆 FILA ZERADA!" : "⏰ TEMPO!", CW / 2, 150, "bold 40px Georgia, serif", conta >= META ? "#7CFC9A" : "#ffd24a");
    }
    function fim() {
      const v = conta >= META; fechar();
      aplicarFim(v, "alvaraJecc",
        v ? "⚡ " + conta + " alvarás carimbados! Núbia limpa a testa, vitoriosa: “setor de alvarás NUNCA falha, doutor. Antes do café, lembra?”"
          : "⚡ O relógio venceu desta vez (" + conta + " alvarás). Núbia ri: “amanhã eu zero antes do senhor piscar.” (estresse aliviado)", aoFim);
    }
    fundo("#3a2c52", "#23396b");
    texto("⚡ CORRIDA DO ALVARÁ", CW / 2, 150, "bold 38px Georgia, serif", "#ffe2a8");
    texto("Ajude a Núbia a zerar a fila: " + META + " alvarás em " + TEMPO + "s.", CW / 2, 210, "bold 18px Georgia", "#f4ecd9");
    texto("ALTERNE ◄ e ► para manter o ritmo dos carimbos.", CW / 2, 245, "16px Georgia", "#f4ecd9");
    texto("▶ aperte AÇÃO para começar", CW / 2, 330, "bold 20px Georgia", "#ffe2a8");
    aguardarAcao(function () { loop(passo); });
  }

  /* ============================================================
     🎂 BRINDE DO 4º TÍTULO — timing (4 velas / 4 taças)
     Pare o marcador na zona dourada para acender cada vela.
     ============================================================ */
  function brindeJuizado(aoFim) {
    if (emJogo) return; abrir();
    const RODADAS = 4;
    let rod = 0, acertos = 0, marker = 0, dir = 1, vveloc = 0.9, parado = false;
    let resultado = "", tRes = 0, acabou = false, tFim = 0;
    const zonaC = 0.5, zonaMeia = 0.11;     // centro e meia-largura da zona dourada

    onPress = function (n) {
      if (acabou || parado) return;
      if (n === "acao") {
        parado = true; tRes = 0;
        const ok = Math.abs(marker - zonaC) <= zonaMeia;
        if (ok) { acertos++; resultado = "✔ ACENDEU!"; } else { resultado = "✘ quase!"; }
      }
    };
    function novaRodada() {
      marker = 0; dir = 1; parado = false; resultado = "";
      vveloc = 0.9 + rod * 0.18;            // cada vela mais difícil
    }
    function passo(dt) {
      if (!acabou) {
        if (!parado) {
          marker += dir * vveloc * dt;
          if (marker > 1) { marker = 1; dir = -1; }
          if (marker < 0) { marker = 0; dir = 1; }
        } else {
          tRes += dt;
          if (tRes > 1.0) { rod++; if (rod >= RODADAS) { acabou = true; tFim = 0; } else novaRodada(); }
        }
      } else { tFim += dt; if (tFim > 1.1) { fim(); return; } }

      fundo("#5a2e3a", "#23396b");
      painelTopo("🎂 Brinde do 4º Título", "velas: " + acertos + "/" + RODADAS);
      // bolo
      const bx = CW / 2, by = 250;
      ctx.fillStyle = "#f4ecd9"; ctx.fillRect(bx - 120, by, 240, 90);
      ctx.fillStyle = "#9c2b22"; ctx.fillRect(bx - 120, by - 14, 240, 16);
      // 4 velas (acendem conforme acertos)
      for (let i = 0; i < RODADAS; i++) {
        const vx = bx - 90 + i * 60;
        ctx.fillStyle = "#e7cf9a"; ctx.fillRect(vx - 4, by - 50, 8, 40);
        if (i < acertos) {
          ctx.beginPath(); ctx.arc(vx, by - 58, 9, 0, Math.PI * 2);
          ctx.fillStyle = "#ffcf6a"; ctx.fill();
        }
      }
      // barra de timing
      const barX = 140, barW = CW - 280, barY = 400;
      ctx.fillStyle = "rgba(0,0,0,.4)"; ctx.fillRect(barX, barY, barW, 24);
      ctx.fillStyle = "rgba(255,210,106,.45)";
      ctx.fillRect(barX + barW * (zonaC - zonaMeia), barY, barW * zonaMeia * 2, 24);   // zona dourada
      ctx.fillStyle = "#fff"; ctx.fillRect(barX + barW * marker - 3, barY - 6, 6, 36); // marcador
      texto("aperte AÇÃO quando o marcador estiver na zona DOURADA", CW / 2, 440, "bold 15px Georgia", "#ffe2a8");
      if (resultado) texto(resultado, CW / 2, 150, "bold 34px Georgia, serif", resultado.indexOf("✔") === 0 ? "#7CFC9A" : "#ffd24a");
      if (acabou) texto(acertos >= 3 ? "🥂 SAÚDE, EQUIPE!" : "🥂 Brinde feito!", CW / 2, 110, "bold 34px Georgia, serif", "#ffe2a8");
    }
    function fim() {
      const v = acertos >= 3; fechar();
      aplicarFim(v, "brindeJecc",
        v ? "🥂 Quatro velas, quatro títulos — e o brinde saiu perfeito! A equipe ergue as taças: “à unidade mais rápida do Ceará!”"
          : "🥂 O brinde saiu meio torto (" + acertos + "/4), mas ninguém liga: o que vale é a turma reunida. (estresse aliviado)", aoFim);
    }
    fundo("#5a2e3a", "#23396b");
    texto("🎂 BRINDE DO 4º TÍTULO", CW / 2, 150, "bold 36px Georgia, serif", "#ffe2a8");
    texto("Acenda as 4 velas: pare o marcador na zona dourada.", CW / 2, 210, "bold 18px Georgia", "#f4ecd9");
    texto("Cada vela vem mais rápida que a anterior.", CW / 2, 245, "16px Georgia", "#f4ecd9");
    texto("▶ aperte AÇÃO para começar", CW / 2, 330, "bold 20px Georgia", "#ffe2a8");
    aguardarAcao(function () { novaRodada(); loop(passo); });
  }

  /* ============================================================
     🖨 O SCANNER DO CARLOS TIERRY — digitalize antes que TRAVE
     A cabeça de leitura varre o papel; aperte AÇÃO quando ela
     estiver alinhada (faixa verde). Fora dela: TRAVOU! (a saga)
     ============================================================ */
  function scannerTierry(aoFim) {
    if (emJogo) return; abrir();
    const META = 7, TEMPO = 24;
    let conta = 0, tempo = TEMPO, head = 0, dir = 1, veloc = 0.85;
    let travado = 0, flash = 0, flashMsg = "", acabou = false, tFim = 0;
    const alvoC = 0.5, alvoMeia = 0.1;

    onPress = function (n) {
      if (acabou || travado > 0) return;
      if (n === "acao") {
        if (Math.abs(head - alvoC) <= alvoMeia) {
          conta++; flash = 0.4; flashMsg = "✔ página " + conta;
          veloc = 0.85 + conta * 0.12;          // vai ficando nervoso
        } else {
          travado = 1.1; flash = 0.4; flashMsg = "TRAVOU! 🖨";
        }
      }
    };
    function passo(dt) {
      if (!acabou) {
        if (travado > 0) { travado -= dt; }
        else {
          head += dir * veloc * dt;
          if (head > 1) { head = 1; dir = -1; }
          if (head < 0) { head = 0; dir = 1; }
        }
        tempo -= dt;
        if (conta >= META || tempo <= 0) acabou = true;
      } else { tFim += dt; if (tFim > 0.9) { fim(); return; } }
      if (flash > 0) flash -= dt;

      fundo("#2a2d33", "#15110c");
      painelTopo("🖨 Scanner do Carlos Tierry", "páginas: " + conta + "/" + META);
      // corpo do scanner
      const sx = 150, sw = CW - 300, sy = 210, sh = 120;
      ctx.fillStyle = "#3a3d42"; ctx.fillRect(sx, sy, sw, sh);
      ctx.fillStyle = "#cfd8df"; ctx.fillRect(sx + 14, sy + 16, sw - 28, sh - 32);   // vidro
      // faixa-alvo (verde)
      ctx.fillStyle = "rgba(91,191,106,.35)";
      ctx.fillRect(sx + 14 + (sw - 28) * (alvoC - alvoMeia), sy + 16, (sw - 28) * alvoMeia * 2, sh - 32);
      // cabeça de leitura
      const hx = sx + 14 + (sw - 28) * head;
      ctx.fillStyle = travado > 0 ? "#e8413a" : "#3ad6ff";
      ctx.fillRect(hx - 4, sy + 12, 8, sh - 24);
      // estagiário
      ctx.fillStyle = "#d8a87f"; ctx.beginPath(); ctx.arc(CW / 2, 130, 22, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#4a5a6e"; ctx.fillRect(CW / 2 - 26, 150, 52, 44);
      if (flash > 0) texto(flashMsg, CW / 2, 92, "bold 24px Georgia", flashMsg.indexOf("✔") === 0 ? "#7CFC9A" : "#e8413a");
      if (travado > 0) texto("reiniciando...", CW / 2, sy + sh + 26, "bold 16px Georgia", "#e8413a");
      // barra de tempo
      ctx.fillStyle = "rgba(0,0,0,.4)"; ctx.fillRect(sx, 400, sw, 20);
      ctx.fillStyle = tempo < 6 ? "#e8413a" : "#5bbf6a";
      ctx.fillRect(sx + 2, 402, (sw - 4) * Math.max(0, tempo) / TEMPO, 16);
      texto("AÇÃO quando a luz cruzar a faixa VERDE — erre e ele TRAVA!", CW / 2, 440, "bold 15px Georgia", "#ffe2a8");
      if (acabou) texto(conta >= META ? "🏆 TUDO DIGITALIZADO!" : "⏰ TEMPO!", CW / 2, sy - 60, "bold 36px Georgia, serif", conta >= META ? "#7CFC9A" : "#ffd24a");
    }
    function fim() {
      const v = conta >= META; fechar();
      aplicarFim(v, "scannerJecc",
        v ? "🖨 " + conta + " páginas digitalizadas e nos autos! Carlos Tierry comemora: “venci o scanner, doutor! ...na sétima tentativa, mas venci!”"
          : "🖨 O scanner travou mais que digitalizou (" + conta + " páginas). Carlos Tierry: “a pós não me preparou pra isso.” (estresse aliviado)", aoFim);
    }
    fundo("#2a2d33", "#15110c");
    texto("🖨 O SCANNER DO CARLOS TIERRY", CW / 2, 150, "bold 30px Georgia, serif", "#ffe2a8");
    texto("Digitalize " + META + " páginas em " + TEMPO + "s — sem deixar travar.", CW / 2, 210, "bold 18px Georgia", "#f4ecd9");
    texto("Aperte AÇÃO quando a luz cruzar a faixa verde.", CW / 2, 245, "16px Georgia", "#f4ecd9");
    texto("▶ aperte AÇÃO para começar", CW / 2, 330, "bold 20px Georgia", "#ffe2a8");
    aguardarAcao(function () { loop(passo); });
  }

  return {
    penaltis: penaltis,
    beachTennis: beachTennis,
    natacao: natacao,
    corridaAlvara: corridaAlvara,
    brindeJuizado: brindeJuizado,
    scannerTierry: scannerTierry,
    get emJogo() { return emJogo; }
  };
})();
