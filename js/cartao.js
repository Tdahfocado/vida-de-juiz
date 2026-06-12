/* ============================================================
   TOGA — cartao.js : O CARTÃO DO DIA (compartilhável)
   ------------------------------------------------------------
   Gera, em canvas (file://-safe, sem servidor), uma imagem
   1080×1350 com o resultado do dia: brasão, veredito, as
   barras de reputação, o estresse, 2–3 "vidas tocadas" e o
   convite "Você decidiria diferente?".

   Baixa como PNG (canvas.toBlob → <a download>) e, onde o
   navegador suportar (celulares), compartilha nativamente
   via navigator.share — é assim que o jogo viaja.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.cartao = (function () {

  const L = 1080, A = 1350;
  const CORES_SELO = { otimo: "#e7cf9a", bom: "#7fa08f", ruim: "#c98c5c", grave: "#d96b6b" };

  function urlJogo() { return (TOGA.config && TOGA.config.urlJogo) || ""; }

  /* ---------- O retrato do(a) juiz(a) ----------
     O avatar 2D (SVG) vira imagem uma única vez; se ainda não
     carregou quando o cartão for gerado, ele simplesmente sai
     sem retrato — nada quebra.                              */
  let retratoJuiz = null;
  function atualizarRetrato() {
    retratoJuiz = null;
    try {
      if (!TOGA.cena2d || !TOGA.cena2d.avatarSolo || !TOGA.juiz) return;
      const svg = TOGA.cena2d.avatarSolo({ id: "retrato", avatar: TOGA.juiz.avatar() }, "firme");
      const xml = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      img.onload = function () { retratoJuiz = img; };
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
    } catch (e) { /* sem retrato, o cartão segue */ }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", atualizarRetrato);
  } else atualizarRetrato();

  /* a última linha do cartão: o endereço do jogo, se publicado */
  function rodape(ctx, larg, alt) {
    ctx.fillStyle = "#8a7d65";
    ctx.font = "26px Archivo, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(urlJogo() || "jogo educativo sobre a vida na magistratura · jogue você também",
      larg / 2, alt - 52);
  }

  function brasao(ctx, cx, cy, r) {
    // o mesmo desenho do menu/3D, em escala
    const k = r / 50;
    ctx.save();
    ctx.translate(cx - 50 * k, cy - 50 * k);
    ctx.strokeStyle = "#c9a35c";
    ctx.fillStyle = "#c9a35c";
    ctx.lineCap = "round";
    ctx.lineWidth = 2.5 * k;
    ctx.beginPath(); ctx.arc(50 * k, 50 * k, 47 * k, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 4 * k;
    ctx.beginPath(); ctx.moveTo(50 * k, 16 * k); ctx.lineTo(50 * k, 70 * k); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(22 * k, 28 * k); ctx.lineTo(78 * k, 28 * k); ctx.stroke();
    ctx.lineWidth = 2.5 * k;
    [[22, 1], [78, -1]].forEach(function (par) {
      const x = par[0];
      ctx.beginPath();
      ctx.moveTo(x * k, 28 * k);
      ctx.lineTo((x - 9) * k, 46 * k);
      ctx.arc(x * k, 46 * k, 9 * k, Math.PI, 0, true);
      ctx.lineTo(x * k, 28 * k);
      ctx.stroke();
    });
    ctx.fillRect(36 * k, 70 * k, 28 * k, 7 * k);
    ctx.restore();
  }

  function barra(ctx, x, y, larg, rotulo, valor, cor) {
    ctx.font = "600 30px Archivo, sans-serif";
    ctx.fillStyle = "#b9ad96";
    ctx.textAlign = "left";
    ctx.fillText(rotulo, x, y);
    ctx.textAlign = "right";
    ctx.fillStyle = "#ede6d6";
    ctx.fillText(String(valor), x + larg, y);
    // trilho + preenchimento
    ctx.fillStyle = "#1a140d";
    ctx.beginPath(); ctx.roundRect(x, y + 14, larg, 18, 9); ctx.fill();
    ctx.fillStyle = cor;
    ctx.beginPath(); ctx.roundRect(x, y + 14, Math.max(18, larg * valor / 100), 18, 9); ctx.fill();
  }

  function quebrar(ctx, texto, larguraMax) {
    const palavras = texto.split(" ");
    const linhas = [];
    let atual = "";
    palavras.forEach(function (p) {
      const tentativa = atual ? atual + " " + p : p;
      if (ctx.measureText(tentativa).width > larguraMax && atual) {
        linhas.push(atual); atual = p;
      } else atual = tentativa;
    });
    if (atual) linhas.push(atual);
    return linhas;
  }

  function desenhar(ep) {
    const estado = TOGA.motor.estado;
    const cv = document.createElement("canvas");
    cv.width = L; cv.height = A;
    const ctx = cv.getContext("2d");

    // fundo madeira
    const grad = ctx.createLinearGradient(0, 0, 0, A);
    grad.addColorStop(0, "#3a2a1c"); grad.addColorStop(0.5, "#2a1d12"); grad.addColorStop(1, "#1f150c");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, L, A);
    // moldura dourada
    ctx.strokeStyle = "#c9a35c"; ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, L - 60, A - 60);
    ctx.lineWidth = 2;
    ctx.strokeRect(46, 46, L - 92, A - 92);

    brasao(ctx, L / 2, 165, 95);

    // o retrato de quem vestiu a toga hoje
    if (retratoJuiz) {
      ctx.drawImage(retratoJuiz, 110, 84, 150, 238);
    }

    ctx.textAlign = "center";
    ctx.fillStyle = "#e7cf9a";
    ctx.font = "700 76px Fraunces, Georgia, serif";
    ctx.fillText("TOGA", L / 2, 330);
    ctx.fillStyle = "#b9ad96";
    ctx.font = "italic 32px 'Source Serif 4', Georgia, serif";
    ctx.fillText("a vida de um juiz — " + TOGA.motor.pautaAtual().titulo, L / 2, 378);

    // a insígnia de carreira (estrelas + título reputacional)
    if (TOGA.conquistas && TOGA.conquistas.nivelCarreira) {
      const nv = TOGA.conquistas.nivelCarreira();
      ctx.fillStyle = "#c9a35c";
      ctx.font = "600 28px Archivo, sans-serif";
      ctx.fillText("★".repeat(nv.estrelas) + "  " + nv.titulo, L / 2, 420);
    }

    // veredito
    const corSelo = CORES_SELO[ep.veredito.selo] || "#e7cf9a";
    ctx.save();
    ctx.translate(L / 2, 480);
    ctx.rotate(-0.03);
    ctx.font = "700 54px Fraunces, Georgia, serif";
    const wSelo = ctx.measureText(ep.veredito.titulo.toUpperCase()).width;
    ctx.strokeStyle = corSelo; ctx.lineWidth = 5;
    ctx.strokeRect(-wSelo / 2 - 34, -52, wSelo + 68, 84);
    ctx.lineWidth = 2;
    ctx.strokeRect(-wSelo / 2 - 26, -44, wSelo + 52, 68);
    ctx.fillStyle = corSelo;
    ctx.fillText(ep.veredito.titulo.toUpperCase(), 0, 14);
    ctx.restore();

    // barras de reputação + estresse
    const bx = 140, blarg = L - 280;
    barra(ctx, bx, 600, blarg, "⚖ Técnica", ep.reputacao.tec, "#c9a35c");
    barra(ctx, bx, 675, blarg, "❤ Humanidade", ep.reputacao.hum, "#b96a6a");
    barra(ctx, bx, 750, blarg, "⏱ Celeridade", ep.reputacao.cel, "#6f9bbf");
    barra(ctx, bx, 825, blarg, "🛡 Imparcialidade", ep.reputacao.imp, "#7fa08f");
    barra(ctx, bx, 900, blarg, "🫀 Estresse ao fim do dia", (estado && estado.estresse) || 0, "#d96b6b");

    // decisões exemplares
    ctx.textAlign = "center";
    ctx.fillStyle = "#ede6d6";
    ctx.font = "600 34px Archivo, sans-serif";
    ctx.fillText(ep.otimas + " de " + ep.decisoes + " decisões coincidiram com o gabarito", L / 2, 1000);

    // vidas tocadas (até 3, priorizando 1 grave se houver)
    const vidas = (ep.vidas || []).slice();
    const grave = vidas.find(v => v.tom === "grave");
    const boas = vidas.filter(v => v.tom !== "grave");
    const escolhidas = boas.slice(0, grave ? 2 : 3).concat(grave ? [grave] : []);
    let y = 1060;
    ctx.font = "italic 28px 'Source Serif 4', Georgia, serif";
    escolhidas.forEach(function (v) {
      ctx.fillStyle = v.tom === "grave" ? "#e08a8a" : "#cfe0c8";
      const linhas = quebrar(ctx, "“" + v.texto + "”", L - 260);
      linhas.slice(0, 2).forEach(function (l) {
        ctx.fillText(l, L / 2, y);
        y += 36;
      });
      y += 12;
    });

    // convite
    ctx.fillStyle = "#e7cf9a";
    ctx.font = "700 40px Fraunces, Georgia, serif";
    ctx.fillText("Você decidiria diferente?", L / 2, A - 90);
    rodape(ctx, L, A);

    return cv;
  }

  /* ---------- O CARTÃO DO CASO ----------
     Ao fim de cada audiência, um cartão quadrado (1080×1080)
     com o caso decidido e o selo do desfecho — o convite mais
     direto possível: "hoje eu decidi ESTE caso".            */
  function desenharCaso(caso, fim) {
    const T = 1080;
    const cv = document.createElement("canvas");
    cv.width = cv.height = T;
    const ctx = cv.getContext("2d");

    const grad = ctx.createLinearGradient(0, 0, 0, T);
    grad.addColorStop(0, "#3a2a1c"); grad.addColorStop(0.5, "#2a1d12"); grad.addColorStop(1, "#1f150c");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, T, T);
    ctx.strokeStyle = "#c9a35c"; ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, T - 60, T - 60);
    ctx.lineWidth = 2;
    ctx.strokeRect(46, 46, T - 92, T - 92);

    brasao(ctx, T / 2, 150, 72);

    ctx.textAlign = "center";
    ctx.fillStyle = "#e7cf9a";
    ctx.font = "700 56px Fraunces, Georgia, serif";
    ctx.fillText("TOGA", T / 2, 280);
    ctx.fillStyle = "#b9ad96";
    ctx.font = "italic 30px 'Source Serif 4', Georgia, serif";
    ctx.fillText("hoje, na cadeira do juiz, eu decidi:", T / 2, 330);

    // o caso
    ctx.fillStyle = "#ede6d6";
    ctx.font = "700 52px Fraunces, Georgia, serif";
    const linhasTitulo = quebrar(ctx, caso.titulo, T - 220).slice(0, 2);
    linhasTitulo.forEach(function (l, i) { ctx.fillText(l, T / 2, 426 + i * 62); });
    ctx.fillStyle = "#8a7d65";
    ctx.font = "28px Archivo, sans-serif";
    ctx.fillText(caso.area, T / 2, 436 + linhasTitulo.length * 62);

    // selo do desfecho (carimbo torto, como nos autos)
    const corSelo = CORES_SELO[fim.selo] || "#e7cf9a";
    ctx.save();
    ctx.translate(T / 2, 660);
    ctx.rotate(-0.035);
    ctx.font = "700 50px Fraunces, Georgia, serif";
    const wSelo = ctx.measureText(fim.titulo.toUpperCase()).width;
    ctx.strokeStyle = corSelo; ctx.lineWidth = 5;
    ctx.strokeRect(-wSelo / 2 - 32, -48, wSelo + 64, 80);
    ctx.lineWidth = 2;
    ctx.strokeRect(-wSelo / 2 - 24, -40, wSelo + 48, 64);
    ctx.fillStyle = corSelo;
    ctx.fillText(fim.titulo.toUpperCase(), 0, 14);
    ctx.restore();

    // um respiro do desfecho (sem HTML, 3 linhas no máximo)
    const textoPlano = String(fim.texto || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    ctx.fillStyle = "#cfc4ab";
    ctx.font = "italic 30px 'Source Serif 4', Georgia, serif";
    let y = 780;
    quebrar(ctx, "“" + textoPlano + "”", T - 240).slice(0, 3).forEach(function (l, i, arr) {
      ctx.fillText(i === arr.length - 1 && textoPlano.length > 200 ? l + "…" : l, T / 2, y);
      y += 42;
    });

    // convite
    ctx.fillStyle = "#e7cf9a";
    ctx.font = "700 44px Fraunces, Georgia, serif";
    ctx.fillText("Você decidiria diferente?", T / 2, T - 110);
    rodape(ctx, T, T);

    return cv;
  }

  /* ---------- exportação ---------- */
  function exportarCanvas(cv, nomeArquivo) {
    cv.toBlob(function (blob) {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = nomeArquivo;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
    }, "image/png");
  }

  function compartilharCanvas(cv, nomeArquivo, titulo, texto) {
    cv.toBlob(function (blob) {
      if (!blob) return;
      const arquivo = new File([blob], nomeArquivo, { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [arquivo] })) {
        navigator.share({
          files: [arquivo],
          title: titulo,
          text: texto + (urlJogo() ? " Jogue: " + urlJogo() : "")
        }).catch(function () { /* usuário cancelou */ });
      } else {
        exportarCanvas(cv, nomeArquivo);   // sem share nativo: baixa o arquivo
      }
    }, "image/png");
  }

  function baixar(ep) { exportarCanvas(desenhar(ep), "toga-meu-dia.png"); }

  function compartilhar(ep) {
    const manchete = (ep.manchetes && ep.manchetes[0]) ? " “" + ep.manchetes[0].titulo + "”." : "";
    const cargo = (TOGA.juiz && TOGA.juiz.ehJuiza()) ? "juíza" : "juiz";
    compartilharCanvas(desenhar(ep), "toga-meu-dia.png", "TOGA — meu dia como " + cargo,
      "Meu dia na toga: " + ep.veredito.titulo + "." + manchete + " Você decidiria diferente?");
  }

  function baixarCaso(caso, fim) {
    exportarCanvas(desenharCaso(caso, fim), "toga-caso-" + caso.id + ".png");
  }

  function compartilharCaso(caso, fim) {
    compartilharCanvas(desenharCaso(caso, fim), "toga-caso-" + caso.id + ".png",
      "TOGA — " + caso.titulo,
      "Hoje decidi o caso “" + caso.titulo + "” — desfecho: " + fim.titulo + ". Você decidiria diferente?");
  }

  function suportaShare() {
    try {
      return !!(navigator.canShare &&
        navigator.canShare({ files: [new File([""], "t.png", { type: "image/png" })] }));
    } catch (e) { return false; }
  }

  return { desenhar: desenhar, baixar: baixar, compartilhar: compartilhar,
           desenharCaso: desenharCaso, baixarCaso: baixarCaso, compartilharCaso: compartilharCaso,
           suportaShare: suportaShare, atualizarRetrato: atualizarRetrato };
})();
