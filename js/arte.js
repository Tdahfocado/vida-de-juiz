/* ============================================================
   TOGA — arte.js : as ARTES das lembranças (canvas puro)
   ------------------------------------------------------------
   Tudo o que as partes deixam com o juiz — fotos, desenhos,
   cartas, comprovantes — é desenhado AQUI, em canvas comum,
   SEM depender de WebGL/Three.js. Assim:

   - o modo 2D mostra as mesmas lembranças do modo 3D
     (mural do gabinete no epílogo, anexos dos interlúdios);
   - o modo 3D embrulha o MESMO canvas numa CanvasTexture
     (texturas3d.js delega para cá);
   - o jogo continua abrindo por duplo clique (file://),
     porque canvas local nunca é bloqueado.

   Sem Math.random: cada arte é determinística e cacheada.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.arte = (function () {

  const cache = {};

  /* desenha uma vez, devolve sempre o MESMO canvas */
  function canvasDe(nome, tam, desenhar) {
    if (cache[nome]) return cache[nome];
    const cv = document.createElement("canvas");
    cv.width = cv.height = tam;
    desenhar(cv.getContext("2d"), tam);
    cache[nome] = cv;
    return cv;
  }

  /* ---------- Os LOGOS OFICIAIS (arquivos da pasta do jogo) ----------
     Usados nos OFÍCIOS exibidos em tela (anexos de despacho e
     interlúdio, modal de ampliação) — onde imagem local funciona.
     Nas MOLDURAS 3D fica o desenho vetorial: imagem `file://` em
     textura WebGL é bloqueada pelo navegador (canvas "tainted").
     Se o arquivo faltar ou ainda não tiver carregado, o desenho
     vetorial assume — o jogo nunca quebra por causa de um PNG.  */
  const ARQUIVOS_LOGO = {
    tjce:  "cropped-logo-tjce-2025-horizontal-padrao-azul-OFICIAL-scaled-1.png",
    acm:   "images.png",
    esmec: "channels4_profile.jpg"
  };
  const logos = {};
  (function precarregarLogos() {
    if (typeof Image === "undefined") return;   // ambientes de teste
    Object.keys(ARQUIVOS_LOGO).forEach(function (k) {
      const im = new Image();
      im.onload = function () {
        logos[k] = im;
        // invalida os ofícios já desenhados: o próximo uso sai com o logo real
        ["oficioTJCE", "oficioACM", "oficioESMEC"].forEach(function (n) { delete cache[n]; });
      };
      im.onerror = function () { /* sem o arquivo, fica o vetorial */ };
      im.src = ARQUIVOS_LOGO[k];
    });
  })();

  /* desenha o logo real centrado em (x,y) com a largura dada,
     preservando a proporção; devolve false se ainda não há imagem */
  function logoReal(ctx, chave, cx, y, larg) {
    const im = logos[chave];
    if (!im || !im.width) return false;
    const alt = larg * im.height / im.width;
    ctx.drawImage(im, cx - larg / 2, y, larg, alt);
    return true;
  }

  /* ---------- Foto de lembrança: Thor no parque ---------- */
  function fotoThor() {
    return canvasDe("fotoThor", 256, function (ctx, tam) {
      // moldura + papel fotográfico
      ctx.fillStyle = "#c9a35c"; ctx.fillRect(0, 0, tam, tam);
      ctx.fillStyle = "#f4ecd9"; ctx.fillRect(10, 10, tam - 20, tam - 20);
      // céu e grama
      ctx.fillStyle = "#a8c8e0"; ctx.fillRect(18, 18, tam - 36, tam * 0.5);
      ctx.fillStyle = "#7fa05a"; ctx.fillRect(18, tam * 0.5, tam - 36, tam * 0.42);
      // Thor: corpo, cabeça, orelha, rabo, língua de fora
      ctx.fillStyle = "#8a5a2a";
      ctx.fillRect(tam * 0.36, tam * 0.52, tam * 0.3, tam * 0.18);            // corpo
      ctx.fillRect(tam * 0.62, tam * 0.42, tam * 0.14, tam * 0.14);           // cabeça
      ctx.fillRect(tam * 0.64, tam * 0.36, tam * 0.05, tam * 0.08);           // orelha
      ctx.fillRect(tam * 0.40, tam * 0.68, tam * 0.05, tam * 0.12);           // pata
      ctx.fillRect(tam * 0.58, tam * 0.68, tam * 0.05, tam * 0.12);           // pata
      ctx.save(); ctx.translate(tam * 0.34, tam * 0.52); ctx.rotate(-0.7);
      ctx.fillRect(-tam * 0.02, 0, tam * 0.04, tam * 0.14); ctx.restore();    // rabo p/ cima
      ctx.fillStyle = "#d96b6b";
      ctx.fillRect(tam * 0.72, tam * 0.54, tam * 0.035, tam * 0.05);          // língua
      // legenda a caneta
      ctx.fillStyle = "#2b2316";
      ctx.font = "italic " + Math.floor(tam / 16) + "px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText("1ª semana do acordo. Funcionando.", tam / 2, tam - 24);
    });
  }

  /* ---------- O desenho da Alice: o "super juiz" ----------
     Desenho infantil de giz de cera: juiz palito de toga e
     capa, martelo, sol, corações e a letra trêmula de uma
     criança de 7 anos.                                     */
  function desenhoSuperJuiz() {
    return canvasDe("desenhoSuperJuiz", 512, function (ctx, tam) {
      // papel sulfite
      ctx.fillStyle = "#fdf8ec";
      ctx.fillRect(0, 0, tam, tam);
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      function giz(cor, larg) { ctx.strokeStyle = cor; ctx.lineWidth = larg; }
      function tremido(pontos) {
        ctx.beginPath();
        pontos.forEach(function (p, i) {
          const x = p[0] + Math.sin(i * 7.3) * 2.5, y = p[1] + Math.cos(i * 5.1) * 2.5;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }
      // sol no canto
      giz("#f2b53a", 7);
      ctx.beginPath(); ctx.arc(80, 80, 36, 0, Math.PI * 2); ctx.stroke();
      for (let i = 0; i < 8; i++) {
        const a = i * Math.PI / 4;
        tremido([[80 + Math.cos(a) * 48, 80 + Math.sin(a) * 48], [80 + Math.cos(a) * 70, 80 + Math.sin(a) * 70]]);
      }
      // chão de grama
      giz("#6fae4e", 6);
      for (let x = 20; x < tam - 10; x += 26) tremido([[x, 470], [x + 9, 452], [x + 18, 470]]);
      // o SUPER JUIZ: cabeça, toga triangular, capa vermelha
      giz("#3a2a1a", 6);
      ctx.beginPath(); ctx.arc(256, 200, 38, 0, Math.PI * 2); ctx.stroke();   // cabeça
      ctx.fillStyle = "#3a2a1a";
      ctx.beginPath(); ctx.arc(244, 194, 4, 0, Math.PI * 2); ctx.fill();      // olhos
      ctx.beginPath(); ctx.arc(268, 194, 4, 0, Math.PI * 2); ctx.fill();
      giz("#c94f4f", 5);
      ctx.beginPath(); ctx.arc(256, 208, 16, 0.2, Math.PI - 0.2); ctx.stroke(); // sorrisão
      giz("#1d1d22", 7);                                                       // toga
      tremido([[256, 238], [212, 380], [300, 380], [256, 238]]);
      giz("#c94f4f", 7);                                                       // capa de herói
      tremido([[238, 250], [150, 350], [210, 370]]);
      giz("#3a2a1a", 6);                                                       // pernas e braços
      tremido([[232, 380], [230, 452]]);
      tremido([[280, 380], [284, 452]]);
      tremido([[224, 280], [160, 250]]);                                       // braço esquerdo
      tremido([[288, 280], [360, 230]]);                                       // braço com o martelo
      giz("#8a5a2a", 9);                                                       // martelo
      tremido([[360, 228], [392, 196]]);
      tremido([[372, 178], [410, 214]]);
      // corações
      giz("#e06a8a", 5);
      [[440, 120], [120, 300], [430, 330]].forEach(function (c) {
        ctx.beginPath();
        ctx.moveTo(c[0], c[1] + 12);
        ctx.bezierCurveTo(c[0] - 16, c[1] - 6, c[0] - 4, c[1] - 16, c[0], c[1] - 4);
        ctx.bezierCurveTo(c[0] + 4, c[1] - 16, c[0] + 16, c[1] - 6, c[0], c[1] + 12);
        ctx.stroke();
      });
      // a letra da Alice
      ctx.fillStyle = "#3556a8";
      ctx.font = "bold 44px 'Comic Sans MS', 'Chalkboard SE', cursive";
      ctx.textAlign = "center";
      ctx.save(); ctx.translate(256, 58); ctx.rotate(-0.03);
      ctx.fillText("OBRIGADA JUIZ!", 0, 0); ctx.restore();
      ctx.font = "28px 'Comic Sans MS', 'Chalkboard SE', cursive";
      ctx.save(); ctx.translate(256, 500); ctx.rotate(0.02);
      ctx.fillText("voce salvou meu pai — Alice, 7 anos", 0, 0); ctx.restore();
    });
  }

  /* ---------- A certidão da Sebastiana ---------- */
  function certidaoLembranca() {
    return canvasDe("certidaoLembranca", 512, function (ctx, tam) {
      ctx.fillStyle = "#f4ecd9";
      ctx.fillRect(0, 0, tam, tam);
      // moldura dupla de cartório
      ctx.strokeStyle = "#5a2020"; ctx.lineWidth = 6;
      ctx.strokeRect(18, 18, tam - 36, tam - 36);
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 30, tam - 60, tam - 60);
      ctx.fillStyle = "#5a2020";
      ctx.textAlign = "center";
      ctx.font = "bold 34px Georgia, serif";
      ctx.fillText("CERTIDÃO DE NASCIMENTO", tam / 2, 92);
      ctx.font = "20px Georgia, serif";
      ctx.fillText("— 1ª via · registro tardio —", tam / 2, 126);
      ctx.fillStyle = "#2b2316";
      ctx.font = "bold 40px Georgia, serif";
      ctx.fillText("SEBASTIANA", tam / 2, 220);
      ctx.font = "26px Georgia, serif";
      ctx.fillText("66 anos · lavradora", tam / 2, 262);
      // linhas de assento
      ctx.strokeStyle = "rgba(90,65,40,.5)"; ctx.lineWidth = 1.6;
      for (let y = 310; y <= 380; y += 24) {
        ctx.beginPath(); ctx.moveTo(70, y); ctx.lineTo(tam - 70, y); ctx.stroke();
      }
      // selo e bilhete
      ctx.fillStyle = "#c9a35c";
      ctx.beginPath(); ctx.arc(tam - 110, 380, 34, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#5a2020";
      ctx.font = "italic 24px Georgia, serif";
      ctx.fillText("“pra moldura, se o doutor quiser”", tam / 2, 452);
    });
  }

  /* ---------- Carta manuscrita (fábrica genérica) ----------
     Papel pautado, margem vermelha, dobras marcadas e letra
     cursiva — UMA função serve todas as cartas do jogo.
     `linhas`: array de strings; `assinatura`: linha final.  */
  const FONTE_CURSIVA = "'Segoe Script', 'Bradley Hand', 'Comic Sans MS', cursive";

  function carta(id, linhas, assinatura) {
    return canvasDe("carta:" + id, 512, function (ctx, tam) {
      // papel pautado
      ctx.fillStyle = "#fbf6e8";
      ctx.fillRect(0, 0, tam, tam);
      ctx.strokeStyle = "rgba(90,120,180,.35)"; ctx.lineWidth = 1.4;
      for (let y = 88; y < tam - 30; y += 42) {
        ctx.beginPath(); ctx.moveTo(36, y); ctx.lineTo(tam - 36, y); ctx.stroke();
      }
      // margem vermelha
      ctx.strokeStyle = "rgba(190,80,80,.45)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(70, 30); ctx.lineTo(70, tam - 30); ctx.stroke();
      // vincos de quem dobrou em quatro
      ctx.fillStyle = "rgba(120,100,70,.12)";
      ctx.fillRect(0, tam / 2 - 2, tam, 4);
      ctx.fillRect(tam / 2 - 2, 0, 4, tam);
      // o texto, em letra de quem escreve pouco mas quis escrever
      ctx.fillStyle = "#2d3a6b";
      ctx.textAlign = "left";
      ctx.font = "26px " + FONTE_CURSIVA;
      linhas.forEach(function (l, i) {
        ctx.save();
        ctx.translate(84, 80 + i * 42);
        ctx.rotate(Math.sin(i * 2.7) * 0.008);   // a linha "respira" de leve
        ctx.fillText(l, 0, 0, tam - 130);
        ctx.restore();
      });
      if (assinatura) {
        ctx.font = "italic 28px " + FONTE_CURSIVA;
        ctx.textAlign = "right";
        ctx.save();
        ctx.translate(tam - 56, 86 + linhas.length * 42 + 30);
        ctx.rotate(-0.02);
        ctx.fillText(assinatura, 0, 0);
        ctx.restore();
      }
    });
  }

  /* ---------- As cartas do jogo ---------- */
  function cartaJonas() {
    return carta("jonas",
      ["seu juis,", "", "o pai falou que o senhor mandou", "a gente ter janta e cama.",
       "a janta tinha arroz e ovo.", "obrigado pela janta."],
      "— Luan, 9 anos, filho do Jonas");
  }

  function cartaMarlene() {
    return carta("marlene",
      ["Doutor,", "", "faz oito meses que a casa dorme", "com a porta destrancada por dentro.",
       "Os meninos voltaram a fazer bagunça.", "Bagunça de criança, da boa.",
       "A senhora da rede vem toda quinta."],
      "— Marlene");
  }

  function bilheteJandira() {
    return carta("jandira",
      ["(transcrito pelo agente do CREAS,", "a pedido da assistida)", "",
       "“Diga ao doutor que eu voltei ao", "trabalho a pé, pela rua de sempre.",
       "Parece pouco. Não é.”"],
      "— Jandira");
  }

  function cartaEntrega() {
    return carta("entrega",
      ["(sem remetente — chegou ao fórum", "no aniversário de um ano)", "",
       "Ele tem família. Eu tenho paz.", "O senhor teve parte nas duas coisas.",
       "Obrigada por não me julgar", "naquela noite."],
      "— R.");
  }

  /* ---------- O dinossauro do Davi (a família de mãos dadas) ---------- */
  function desenhoDino() {
    return canvasDe("desenhoDino", 512, function (ctx, tam) {
      ctx.fillStyle = "#fdf8ec";
      ctx.fillRect(0, 0, tam, tam);
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      function giz(cor, larg) { ctx.strokeStyle = cor; ctx.lineWidth = larg; }
      function tremido(pontos) {
        ctx.beginPath();
        pontos.forEach(function (p, i) {
          const x = p[0] + Math.sin(i * 5.9) * 2.6, y = p[1] + Math.cos(i * 4.3) * 2.6;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }
      // o DINOSSAURO verde, sorridente
      giz("#5a9a4e", 8);
      tremido([[90, 380], [110, 300], [150, 260], [220, 250], [270, 280], [285, 350], [240, 390], [120, 392], [90, 380]]); // corpo
      tremido([[150, 260], [140, 200], [170, 170], [205, 185], [200, 230]]);   // pescoço e cabeça
      tremido([[285, 350], [340, 330], [370, 300]]);                            // rabo
      [[150, 388], [200, 390], [245, 386]].forEach(function (p) { tremido([[p[0], p[1]], [p[0] + 4, p[1] + 44]]); }); // patas
      ctx.fillStyle = "#3a2a1a";
      ctx.beginPath(); ctx.arc(180, 192, 5, 0, Math.PI * 2); ctx.fill();        // olho
      giz("#c94f4f", 4);
      ctx.beginPath(); ctx.arc(178, 205, 9, 0.3, Math.PI - 0.5); ctx.stroke();  // sorriso
      // placas nas costas
      giz("#f2913a", 6);
      [[160, 252], [205, 244], [250, 262]].forEach(function (p) {
        tremido([[p[0] - 12, p[1]], [p[0], p[1] - 22], [p[0] + 12, p[1]]]);
      });
      // as TRÊS figuras de mãos dadas (pai, Davi, mãe)
      const figuras = [[380, 300, 30, "#3556a8"], [430, 320, 22, "#5a9a4e"], [474, 300, 30, "#c94f4f"]];
      figuras.forEach(function (f) {
        giz(f[3], 5);
        ctx.beginPath(); ctx.arc(f[0], f[1], f[2] * 0.45, 0, Math.PI * 2); ctx.stroke(); // cabeça
        tremido([[f[0], f[1] + f[2] * 0.45], [f[0], f[1] + f[2] * 1.8]]);                 // corpo
        tremido([[f[0] - f[2] * 0.5, f[1] + f[2] * 2.6], [f[0], f[1] + f[2] * 1.8], [f[0] + f[2] * 0.5, f[1] + f[2] * 2.6]]); // pernas
      });
      giz("#3a2a1a", 5);                                                          // as mãos dadas
      tremido([[392, 340], [418, 348]]);
      tremido([[442, 348], [462, 340]]);
      // legenda da mãe
      ctx.fillStyle = "#3556a8";
      ctx.font = "bold 38px 'Comic Sans MS', 'Chalkboard SE', cursive";
      ctx.textAlign = "center";
      ctx.save(); ctx.translate(256, 64); ctx.rotate(-0.02);
      ctx.fillText("DAVI E O DINO", 0, 0); ctx.restore();
      ctx.font = "26px 'Comic Sans MS', 'Chalkboard SE', cursive";
      ctx.save(); ctx.translate(256, 480); ctx.rotate(0.02);
      ctx.fillText("pro doutor que deixou a gente junto — a mãe do Davi", 0, 0); ctx.restore();
    });
  }

  /* ---------- Foto: Sr. Edivaldo na fisioterapia ---------- */
  function fotoFisioterapia() {
    return canvasDe("fotoFisioterapia", 256, function (ctx, tam) {
      // moldura + papel fotográfico
      ctx.fillStyle = "#c9a35c"; ctx.fillRect(0, 0, tam, tam);
      ctx.fillStyle = "#f4ecd9"; ctx.fillRect(10, 10, tam - 20, tam - 20);
      // sala clara de clínica
      ctx.fillStyle = "#dfe8e2"; ctx.fillRect(18, 18, tam - 36, tam * 0.62);
      ctx.fillStyle = "#b9c8bf"; ctx.fillRect(18, tam * 0.62, tam - 36, tam * 0.3);
      // espaldar na parede
      ctx.strokeStyle = "#8a6240"; ctx.lineWidth = 4;
      for (let y = 34; y < tam * 0.6; y += 18) {
        ctx.beginPath(); ctx.moveTo(34, y); ctx.lineTo(86, y); ctx.stroke();
      }
      // Sr. Edivaldo: camisa, cabeça grisalha, braço na faixa elástica
      ctx.fillStyle = "#5a6a7a";
      ctx.fillRect(tam * 0.46, tam * 0.42, tam * 0.2, tam * 0.3);             // tronco
      ctx.fillStyle = "#caa28a";
      ctx.beginPath(); ctx.arc(tam * 0.56, tam * 0.34, tam * 0.075, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#b9b3a6";
      ctx.fillRect(tam * 0.50, tam * 0.265, tam * 0.12, tam * 0.03);          // cabelo grisalho
      // braço em recuperação puxando a faixa
      ctx.strokeStyle = "#caa28a"; ctx.lineWidth = 9; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(tam * 0.5, tam * 0.47); ctx.lineTo(tam * 0.36, tam * 0.38); ctx.stroke();
      ctx.strokeStyle = "#d96b6b"; ctx.lineWidth = 4;                          // faixa elástica
      ctx.beginPath(); ctx.moveTo(tam * 0.36, tam * 0.38); ctx.lineTo(tam * 0.2, tam * 0.24); ctx.stroke();
      // o polegar erguido — o da mão boa
      ctx.strokeStyle = "#caa28a"; ctx.lineWidth = 9;
      ctx.beginPath(); ctx.moveTo(tam * 0.64, tam * 0.5); ctx.lineTo(tam * 0.76, tam * 0.42); ctx.stroke();
      ctx.fillStyle = "#caa28a";
      ctx.fillRect(tam * 0.745, tam * 0.345, 9, 16);
      // legenda a caneta
      ctx.fillStyle = "#2b2316";
      ctx.font = "italic " + Math.floor(tam / 17) + "px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText("1ª sessão. Autorizada pelo cliente.", tam / 2, tam - 36);
      ctx.fillText("O polegar é o da mão boa — por enquanto.", tam / 2, tam - 18);
    });
  }

  /* ---------- O desenho do foguete (Caio, 6 anos) ---------- */
  function desenhoFoguete() {
    return canvasDe("desenhoFoguete", 512, function (ctx, tam) {
      ctx.fillStyle = "#fdf8ec";
      ctx.fillRect(0, 0, tam, tam);
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      function giz(cor, larg) { ctx.strokeStyle = cor; ctx.lineWidth = larg; }
      function tremido(pontos) {
        ctx.beginPath();
        pontos.forEach(function (p, i) {
          const x = p[0] + Math.sin(i * 6.1) * 2.8, y = p[1] + Math.cos(i * 4.7) * 2.8;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }
      // estrelas tortas
      giz("#f2b53a", 4);
      [[70, 90], [150, 50], [420, 70], [460, 160]].forEach(function (e) {
        tremido([[e[0] - 12, e[1]], [e[0] + 12, e[1]]]);
        tremido([[e[0], e[1] - 12], [e[0], e[1] + 12]]);
      });
      // o FOGUETE subindo na diagonal
      giz("#4a6ab8", 7);
      tremido([[160, 360], [220, 240], [260, 230], [280, 290], [200, 400], [160, 360]]); // corpo
      giz("#c94f4f", 6);
      tremido([[220, 240], [250, 190], [276, 250]]);                                     // bico
      giz("#f2913a", 7);                                                                  // fogo
      tremido([[180, 392], [150, 450], [196, 420], [180, 470]]);
      // janelinha com DUAS cabeças (ele e a avó)
      giz("#3a2a1a", 5);
      ctx.beginPath(); ctx.arc(228, 300, 26, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "#3a2a1a";
      ctx.beginPath(); ctx.arc(220, 300, 7, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(238, 298, 9, 0, Math.PI * 2); ctx.fill();
      // a CASA da vó-mãe no destino, com fumaça na chaminé
      giz("#8a5a2a", 6);
      tremido([[360, 330], [360, 410], [450, 410], [450, 330]]);
      giz("#c94f4f", 6);
      tremido([[348, 332], [405, 280], [462, 332]]);
      giz("#3a2a1a", 4);
      tremido([[395, 410], [395, 372], [420, 372], [420, 410]]);                          // porta
      giz("#9a9a9a", 5);
      tremido([[438, 286], [444, 266], [436, 250]]);                                      // fumaça
      // coração ENORME entre o foguete e a casa
      giz("#e06a8a", 6);
      ctx.beginPath();
      ctx.moveTo(330, 200);
      ctx.bezierCurveTo(296, 158, 318, 130, 330, 158);
      ctx.bezierCurveTo(342, 130, 364, 158, 330, 200);
      ctx.stroke();
      // a letra do Caio
      ctx.fillStyle = "#3556a8";
      ctx.font = "bold 36px 'Comic Sans MS', 'Chalkboard SE', cursive";
      ctx.textAlign = "center";
      ctx.save(); ctx.translate(256, 54); ctx.rotate(-0.02);
      ctx.fillText("O FOGETE INDO PRA CASA", 0, 0); ctx.restore();
      ctx.font = "26px 'Comic Sans MS', 'Chalkboard SE', cursive";
      ctx.save(); ctx.translate(256, 496); ctx.rotate(0.02);
      ctx.fillText("da vó-mãe — Caio, 6 anos", 0, 0); ctx.restore();
    });
  }

  /* ---------- O comprovante do 1º aluguel social ---------- */
  function comprovanteAluguel() {
    return canvasDe("comprovanteAluguel", 512, function (ctx, tam) {
      ctx.fillStyle = "#f4ecd9";
      ctx.fillRect(0, 0, tam, tam);
      // comprovante bancário (recibo térmico)
      ctx.save();
      ctx.translate(tam / 2, 200); ctx.rotate(-0.025);
      ctx.fillStyle = "#fdfdf8";
      ctx.fillRect(-180, -150, 360, 300);
      ctx.strokeStyle = "rgba(0,0,0,.18)"; ctx.lineWidth = 2;
      ctx.strokeRect(-180, -150, 360, 300);
      ctx.fillStyle = "#2b2316";
      ctx.textAlign = "center";
      ctx.font = "bold 22px 'Courier New', monospace";
      ctx.fillText("MUNICÍPIO — ALUGUEL SOCIAL", 0, -112);
      ctx.font = "18px 'Courier New', monospace";
      ctx.fillText("repasse 01/12 · contrato homologado", 0, -82);
      ctx.fillText("favorecido: AURÉLIO P. (locador)", 0, -50);
      ctx.font = "bold 34px 'Courier New', monospace";
      ctx.fillText("R$ 700,00", 0, 0);
      ctx.font = "18px 'Courier New', monospace";
      ctx.fillText("+ R$ 150,00 — depósito de Cleide S.", 0, 38);
      ctx.font = "bold 20px 'Courier New', monospace";
      ctx.fillStyle = "#2f4a3e";
      ctx.fillText("SITUAÇÃO: EM DIA", 0, 76);
      ctx.font = "16px 'Courier New', monospace";
      ctx.fillStyle = "#2b2316";
      ctx.fillText("— em dia pela 1ª vez em 6 meses —", 0, 106);
      ctx.restore();
      // clipe de metal segurando o bilhete do escrivão
      ctx.strokeStyle = "#8a8a8a"; ctx.lineWidth = 6; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(120, 46); ctx.lineTo(120, 110); ctx.stroke();
      ctx.beginPath(); ctx.arc(120, 46, 12, Math.PI, 0); ctx.stroke();
      // o bilhete, fora dos autos
      ctx.save();
      ctx.translate(tam / 2, 420); ctx.rotate(0.03);
      ctx.fillStyle = "#fff7c8";
      ctx.fillRect(-170, -52, 340, 104);
      ctx.fillStyle = "#2d3a6b";
      ctx.textAlign = "center";
      ctx.font = "26px " + FONTE_CURSIVA;
      ctx.fillText("“esse acordo eu emolduro.”", 0, -6);
      ctx.font = "italic 22px " + FONTE_CURSIVA;
      ctx.fillText("— o escrivão", 0, 32);
      ctx.restore();
    });
  }

  /* ---------- A certidão da madrugada (cumprida à 01h10) ---------- */
  function certidaoMadrugada() {
    return canvasDe("certidaoMadrugada", 512, function (ctx, tam) {
      ctx.fillStyle = "#f4ecd9";
      ctx.fillRect(0, 0, tam, tam);
      // cabeçalho de documento oficial
      ctx.strokeStyle = "#2b2316"; ctx.lineWidth = 2;
      ctx.strokeRect(26, 26, tam - 52, tam - 52);
      ctx.fillStyle = "#2b2316";
      ctx.textAlign = "center";
      ctx.font = "bold 26px Georgia, serif";
      ctx.fillText("PODER JUDICIÁRIO — PLANTÃO", tam / 2, 72);
      ctx.font = "bold 22px Georgia, serif";
      ctx.fillText("CERTIDÃO DE CUMPRIMENTO", tam / 2, 104);
      ctx.font = "16px Georgia, serif";
      ctx.fillText("medidas protetivas de urgência — Lei 11.340/2006", tam / 2, 130);
      // corpo datilografado
      ctx.textAlign = "left";
      ctx.font = "17px 'Courier New', monospace";
      ["Certifico que, em diligência encerrada à", "01h10, dei cumprimento integral à decisão:",
       "o requerido foi afastado do lar e cienti-", "ficado da proibição de aproximação e do",
       "crime do art. 24-A; a requerente foi re-", "conduzida ao lar com escolta, recebendo",
       "cópia da decisão em mãos."].forEach(function (l, i) {
        ctx.fillText(l, 54, 172 + i * 26);
      });
      // carimbo CUMPRIDO
      ctx.save();
      ctx.translate(tam - 140, 200); ctx.rotate(-0.18);
      ctx.strokeStyle = "rgba(47,74,62,.8)"; ctx.lineWidth = 4;
      ctx.strokeRect(-78, -26, 156, 52);
      ctx.fillStyle = "rgba(47,74,62,.8)";
      ctx.textAlign = "center";
      ctx.font = "bold 30px Georgia, serif";
      ctx.fillText("CUMPRIDO", 0, 10);
      ctx.restore();
      // a anotação do oficial, à mão, fora do protocolo
      ctx.save();
      ctx.translate(tam / 2, 412); ctx.rotate(-0.015);
      ctx.fillStyle = "#2d3a6b";
      ctx.textAlign = "center";
      ctx.font = "23px " + FONTE_CURSIVA;
      ctx.fillText("no verso: “a requerente dobrou o papel em", 0, 0);
      ctx.fillText("quatro e guardou no bolso da blusa,", 0, 34);
      ctx.fillText("do lado de dentro.”", 0, 68);
      ctx.restore();
    });
  }

  /* ---------- A foto da formatura de Iracema ---------- */
  function fotoIracema() {
    return canvasDe("fotoIracema", 256, function (ctx, tam) {
      // moldura escura, papel fotográfico levemente amarelado pelo tempo
      ctx.fillStyle = "#3a2a1a"; ctx.fillRect(0, 0, tam, tam);
      ctx.fillStyle = "#f2e9d4"; ctx.fillRect(12, 12, tam - 24, tam - 24);
      // fundo do estúdio: cortina azul desbotada
      ctx.fillStyle = "#5a6a8e"; ctx.fillRect(20, 20, tam - 40, tam * 0.66);
      ctx.fillStyle = "#4a5a7e";
      for (let i = 0; i < 5; i++) ctx.fillRect(28 + i * 42, 20, 12, tam * 0.66);
      // Iracema: uniforme branco de formatura, faixa e diploma
      const cx = tam / 2;
      ctx.fillStyle = "#6e4226";                       // rosto
      ctx.beginPath(); ctx.arc(cx, 84, 26, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#1d1209";                       // cabelo preso
      ctx.beginPath(); ctx.arc(cx, 72, 27, Math.PI, 0); ctx.fill();
      ctx.fillRect(cx - 27, 70, 54, 8);
      ctx.fillStyle = "#f4f2ec";                       // o branco do uniforme
      ctx.fillRect(cx - 34, 112, 68, 64);
      ctx.fillStyle = "#e7c43a";                       // faixa de formanda
      ctx.save(); ctx.translate(cx, 144); ctx.rotate(0.5);
      ctx.fillRect(-44, -7, 88, 14); ctx.restore();
      ctx.fillStyle = "#f2e9d4";                       // diploma na mão
      ctx.save(); ctx.translate(cx + 30, 158); ctx.rotate(0.35);
      ctx.fillRect(-7, -18, 14, 36); ctx.restore();
      // o sorriso (a parte da foto que ninguém esquece)
      ctx.strokeStyle = "#2b1a10"; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.arc(cx, 90, 11, 0.25, Math.PI - 0.25); ctx.stroke();
      // legenda à mão, na borda da foto
      ctx.fillStyle = "#2d3a6b";
      ctx.textAlign = "center";
      ctx.font = "19px " + FONTE_CURSIVA;
      ctx.fillText("Iracema — dia da formatura", cx, tam - 26);
    });
  }

  /* ---------- A plaquinha do Frajola (em forma de peixe) ---------- */
  function plaquinhaFrajola() {
    return canvasDe("plaquinhaFrajola", 256, function (ctx, tam) {
      ctx.fillStyle = "#f4ecd9";
      ctx.fillRect(0, 0, tam, tam);
      // o muro atrás
      ctx.fillStyle = "#b9b3a6";
      ctx.fillRect(0, tam * 0.2, tam, tam * 0.7);
      ctx.strokeStyle = "rgba(0,0,0,.15)"; ctx.lineWidth = 2;
      for (let y = tam * 0.2; y < tam * 0.9; y += 26) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(tam, y); ctx.stroke();
      }
      // a plaquinha-peixe em latão
      ctx.save();
      ctx.translate(tam / 2, tam / 2);
      ctx.fillStyle = "#c9a35c";
      ctx.beginPath();                                  // corpo do peixe
      ctx.ellipse(0, 0, 86, 44, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();                                  // rabo
      ctx.moveTo(78, 0); ctx.lineTo(112, -28); ctx.lineTo(112, 28);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#15110c";                        // olho
      ctx.beginPath(); ctx.arc(-56, -10, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#15110c";
      ctx.textAlign = "center";
      ctx.font = "bold 21px Georgia, serif";
      ctx.fillText("FRAJOLA", -6, -4);
      ctx.font = "bold 14px Georgia, serif";
      ctx.fillText("7 ANOS DE MURO", -6, 18);
      ctx.restore();
      // parafusos
      ctx.fillStyle = "#7a6a4a";
      [[tam / 2 - 70, tam / 2 - 34], [tam / 2 + 58, tam / 2 + 34]].forEach(function (p) {
        ctx.beginPath(); ctx.arc(p[0], p[1], 4, 0, Math.PI * 2); ctx.fill();
      });
    });
  }

  /* ---------- brasão da Justiça (reuso nas honrarias) ---------- */
  function brasaoEm(ctx, cx, cy, r, cor) {
    const k = r / 50;
    ctx.save();
    ctx.translate(cx - 50 * k, cy - 50 * k);
    ctx.strokeStyle = cor; ctx.fillStyle = cor; ctx.lineCap = "round";
    ctx.lineWidth = 2.5 * k;
    ctx.beginPath(); ctx.arc(50 * k, 50 * k, 44 * k, 0, Math.PI * 2); ctx.stroke();
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

  /* ---------- O logotipo do TJCE (vetorial, file://-safe) ----------
     Redesenho procedural do logo oficial: as colunas azuis em
     degraus com o topo dourado, a sigla TJCE e o nome por extenso. */
  const TJCE_AZUL = "#1d3e6e";
  const TJCE_OURO = "#d99e2b";

  function logoTJCEEm(ctx, x, y, larg) {
    const k = larg / 300;   // proporção do logo oficial (~300 de largura)
    ctx.save();
    ctx.translate(x, y);
    // as cinco colunas em degraus (a "escadaria" da Justiça)
    for (let i = 0; i < 5; i++) {
      const cx = i * 16 * k;
      const alt = (34 + i * 14) * k;
      ctx.fillStyle = TJCE_AZUL;
      ctx.fillRect(cx, 96 * k - alt, 11 * k, alt);
    }
    // a faixa dourada diagonal sobre as colunas
    ctx.fillStyle = TJCE_OURO;
    ctx.save();
    ctx.translate(0, 28 * k);
    ctx.rotate(-0.32);
    ctx.fillRect(-2 * k, -10 * k, 92 * k, 11 * k);
    ctx.restore();
    // a sigla
    ctx.fillStyle = TJCE_AZUL;
    ctx.textAlign = "left";
    ctx.font = "900 " + Math.round(58 * k) + "px Archivo, Arial, sans-serif";
    ctx.fillText("TJCE", 92 * k, 62 * k);
    // o nome por extenso
    ctx.font = "700 " + Math.round(15 * k) + "px Archivo, Arial, sans-serif";
    ctx.fillText("Tribunal de Justiça", 94 * k, 82 * k);
    ctx.fillStyle = TJCE_OURO;
    ctx.font = "italic 600 " + Math.round(13 * k) + "px Archivo, Arial, sans-serif";
    ctx.fillText("do Estado do Ceará", 94 * k, 98 * k);
    ctx.restore();
  }

  /* ---------- Ofício do Desembargador: o convite ---------- */
  function oficioTJCE() {
    return canvasDe("oficioTJCE", 512, function (ctx, tam) {
      ctx.fillStyle = "#fdfbf4";
      ctx.fillRect(0, 0, tam, tam);
      ctx.strokeStyle = TJCE_AZUL; ctx.lineWidth = 3;
      ctx.strokeRect(18, 18, tam - 36, tam - 36);
      if (!logoReal(ctx, "tjce", tam / 2, 42, 300)) logoTJCEEm(ctx, 110, 36, 290);
      ctx.fillStyle = "#2b2316";
      ctx.textAlign = "center";
      ctx.font = "bold 19px Georgia, serif";
      ctx.fillText("OFÍCIO Nº 112/2026 — GAB. DES. RAIMUNDO NONATO", tam / 2, 182);
      ctx.font = "16px Georgia, serif";
      ctx.textAlign = "left";
      ["Excelência,", "",
       "Considerando os resultados desta comarca nos painéis",
       "de produtividade, solicito a Vossa Excelência que",
       "promova CAPACITAÇÃO para a equipe da unidade sobre:",
       "  I — produtividade e gestão de processos;",
       "  II — uso de tecnologia no dia a dia forense.",
       "",
       "O bom exemplo, quando ensinado, vira política pública."].forEach(function (l, i) {
        ctx.fillText(l, 48, 222 + i * 24);
      });
      ctx.textAlign = "center";
      ctx.font = "italic 17px Georgia, serif";
      ctx.fillText("Respeitosamente,", tam / 2, 446);
      ctx.font = "bold 18px Georgia, serif";
      ctx.fillStyle = TJCE_AZUL;
      ctx.fillText("Des. Raimundo Nonato Silva Santos", tam / 2, 472);
      ctx.font = "13px Georgia, serif";
      ctx.fillText("Tribunal de Justiça do Estado do Ceará", tam / 2, 490);
    });
  }

  /* ---------- Ofício de agradecimento (a honraria) ---------- */
  function agradecimentoTJCE() {
    return canvasDe("agradecimentoTJCE", 512, function (ctx, tam) {
      ctx.fillStyle = "#fdfbf4";
      ctx.fillRect(0, 0, tam, tam);
      ctx.strokeStyle = TJCE_OURO; ctx.lineWidth = 5;
      ctx.strokeRect(18, 18, tam - 36, tam - 36);
      ctx.strokeStyle = TJCE_AZUL; ctx.lineWidth = 2;
      ctx.strokeRect(30, 30, tam - 60, tam - 60);
      logoTJCEEm(ctx, 110, 44, 290);
      ctx.fillStyle = TJCE_AZUL;
      ctx.textAlign = "center";
      ctx.font = "bold 22px Georgia, serif";
      ctx.fillText("AGRADECIMENTO", tam / 2, 196);
      ctx.fillStyle = "#2b2316";
      ctx.font = "16px Georgia, serif";
      ["O Gabinete do Des. Raimundo Nonato Silva Santos",
       "agradece os préstimos do juízo desta comarca pela",
       "capacitação ministrada à equipe da unidade —",
       "produtividade, gestão de processos e tecnologia —",
       "realizada com a didática de quem pratica o que ensina.",
       "",
       "Que o exemplo siga em cascata: equipe bem treinada",
       "é jurisdição que chega mais cedo a quem espera."].forEach(function (l, i) {
        ctx.fillText(l, tam / 2, 234 + i * 24);
      });
      ctx.font = "italic 17px Georgia, serif";
      ctx.fillText("Com apreço,", tam / 2, 442);
      ctx.font = "bold 18px Georgia, serif";
      ctx.fillStyle = TJCE_AZUL;
      ctx.fillText("Des. Raimundo Nonato Silva Santos", tam / 2, 468);
      ctx.fillStyle = TJCE_OURO;
      ctx.font = "13px Georgia, serif";
      ctx.fillText("“O bom exemplo, quando ensinado, vira política pública.”", tam / 2, 490);
    });
  }

  /* ---------- O logotipo da ACM (vetorial, fiel ao oficial) ----------
     O mapa do Ceará em duas metades — azul-marinho ao norte,
     verde ao sul — ao lado da sigla. */
  function logoACMEm(ctx, x, y, larg) {
    const k = larg / 240;
    ctx.save();
    ctx.translate(x, y);
    // o mapa do Ceará, simplificado em dois polígonos
    ctx.fillStyle = "#1d3e6e";   // metade norte (azul)
    ctx.beginPath();
    ctx.moveTo(18 * k, 6 * k); ctx.lineTo(46 * k, 0); ctx.lineTo(66 * k, 10 * k);
    ctx.lineTo(60 * k, 34 * k); ctx.lineTo(34 * k, 40 * k); ctx.lineTo(10 * k, 30 * k);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#4a7a4e";   // metade sul (verde)
    ctx.beginPath();
    ctx.moveTo(12 * k, 34 * k); ctx.lineTo(34 * k, 44 * k); ctx.lineTo(58 * k, 38 * k);
    ctx.lineTo(50 * k, 66 * k); ctx.lineTo(30 * k, 78 * k); ctx.lineTo(16 * k, 56 * k);
    ctx.closePath(); ctx.fill();
    // a sigla
    ctx.fillStyle = "#1d3e6e";
    ctx.textAlign = "left";
    ctx.font = "900 " + Math.round(52 * k) + "px Archivo, Arial, sans-serif";
    ctx.fillText("ACM", 76 * k, 56 * k);
    // o nome por extenso
    ctx.font = "700 " + Math.round(12.5 * k) + "px Archivo, Arial, sans-serif";
    ctx.fillText("Associação Cearense de Magistrados", 8 * k, 96 * k);
    ctx.restore();
  }

  /* ---------- Ofício da ACM: a palestra das prerrogativas ---------- */
  function oficioACM() {
    return canvasDe("oficioACM", 512, function (ctx, tam) {
      ctx.fillStyle = "#fdfbf4";
      ctx.fillRect(0, 0, tam, tam);
      ctx.strokeStyle = "#1d3e6e"; ctx.lineWidth = 3;
      ctx.strokeRect(18, 18, tam - 36, tam - 36);
      if (!logoReal(ctx, "acm", tam / 2, 32, 230)) logoACMEm(ctx, 128, 40, 260);
      ctx.fillStyle = "#2b2316";
      ctx.font = "16px Georgia, serif";
      ctx.textAlign = "left";
      ["Excelência,", "",
       "A ACM tem a honra de convidar Vossa Excelência",
       "para a palestra de abertura do ciclo anual:", "",
       "  “A IMPORTÂNCIA DAS PRERROGATIVAS",
       "  CONSTITUCIONAIS DA MAGISTRATURA",
       "  PARA A SOCIEDADE”", "",
       "Porque vitaliciedade, inamovibilidade e",
       "irredutibilidade não protegem o juiz —",
       "protegem o jurisdicionado."].forEach(function (l, i) {
        ctx.fillText(l, 48, 200 + i * 22);
      });
      ctx.textAlign = "center";
      ctx.font = "italic 16px Georgia, serif";
      ctx.fillText("Cordialmente,", tam / 2, 448);
      ctx.font = "bold 17px Georgia, serif";
      ctx.fillStyle = "#1d3e6e";
      ctx.fillText("José Hercy Ponte de Alencar — Presidente da ACM", tam / 2, 472);
    });
  }

  /* ---------- O logotipo da ESMEC (vetorial, fiel ao oficial) ----------
     O capitel dourado abraçando as três colunas azuis. */
  function logoESMECEm(ctx, x, y, larg) {
    const k = larg / 200;
    ctx.save();
    ctx.translate(x, y);
    // o capitel dourado: um arco grosso de cantos arredondados
    ctx.strokeStyle = TJCE_OURO;
    ctx.lineWidth = 17 * k;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(28 * k, 44 * k);
    ctx.lineTo(28 * k, 22 * k);
    ctx.quadraticCurveTo(28 * k, 8 * k, 44 * k, 8 * k);
    ctx.lineTo(116 * k, 8 * k);
    ctx.quadraticCurveTo(132 * k, 8 * k, 132 * k, 22 * k);
    ctx.lineTo(132 * k, 44 * k);
    ctx.stroke();
    // as três colunas azuis
    ctx.fillStyle = "#1d3e6e";
    [-1, 0, 1].forEach(function (i) {
      ctx.fillRect((80 + i * 22 - 7) * k, 24 * k, 14 * k, 58 * k);
    });
    // a base
    ctx.fillRect(48 * k, 84 * k, 64 * k, 8 * k);
    ctx.fillRect(42 * k, 93 * k, 76 * k, 6 * k);
    // a sigla e o nome
    ctx.textAlign = "center";
    ctx.font = "900 " + Math.round(44 * k) + "px Archivo, Arial, sans-serif";
    ctx.fillText("ESMEC", 80 * k, 140 * k);
    ctx.font = "600 " + Math.round(12 * k) + "px Archivo, Arial, sans-serif";
    ctx.fillText("Escola Superior da Magistratura", 80 * k, 158 * k);
    ctx.fillText("do Estado do Ceará", 80 * k, 173 * k);
    ctx.restore();
  }

  /* ---------- Ofício da ESMEC: o convite permanente ---------- */
  function oficioESMEC() {
    return canvasDe("oficioESMEC", 512, function (ctx, tam) {
      ctx.fillStyle = "#fdfbf4";
      ctx.fillRect(0, 0, tam, tam);
      ctx.strokeStyle = TJCE_AZUL; ctx.lineWidth = 3;
      ctx.strokeRect(18, 18, tam - 36, tam - 36);
      if (!logoReal(ctx, "esmec", tam / 2, 20, 178)) logoESMECEm(ctx, 184, 28, 180);
      ctx.fillStyle = "#2b2316";
      ctx.font = "16px Georgia, serif";
      ctx.textAlign = "left";
      ["Excelência,", "",
       "Chegou ao conhecimento desta Coordenação a",
       "capacitação ministrada por Vossa Excelência à",
       "equipe da comarca, a pedido da Presidência.",
       "",
       "A ESMEC convida Vossa Excelência a integrar o",
       "corpo docente PERMANENTE da Escola — formação",
       "inicial e continuada de magistrados e servidores."].forEach(function (l, i) {
        ctx.fillText(l, 48, 218 + i * 23);
      });
      ctx.textAlign = "center";
      ctx.font = "italic 16px Georgia, serif";
      ctx.fillText("Cordialmente,", tam / 2, 444);
      ctx.font = "bold 17px Georgia, serif";
      ctx.fillStyle = TJCE_AZUL;
      ctx.fillText("Juíza Ana Paula Feitosa Oliveira — Coordenadora da ESMEC", tam / 2, 468);
      ctx.fillStyle = TJCE_OURO;
      ctx.font = "12px Georgia, serif";
      ctx.fillText("“Quem ensina um juiz, julga junto em todas as comarcas.”", tam / 2, 488);
    });
  }

  /* ---------- A placa de docente permanente da ESMEC ---------- */
  function placaESMEC() {
    return canvasDe("placaESMEC", 512, function (ctx, tam) {
      ctx.fillStyle = "#2a1d12"; ctx.fillRect(0, 0, tam, tam);
      const g = ctx.createLinearGradient(0, 70, 0, tam - 70);
      g.addColorStop(0, "#e8eef7"); g.addColorStop(1, "#c7d2e2");
      ctx.fillStyle = g;
      ctx.fillRect(48, 70, tam - 96, tam - 140);
      ctx.strokeStyle = TJCE_AZUL; ctx.lineWidth = 4;
      ctx.strokeRect(62, 84, tam - 124, tam - 168);
      logoESMECEm(ctx, 168, 100, 220);
      ctx.fillStyle = TJCE_AZUL;
      ctx.textAlign = "center";
      ctx.font = "bold 26px Georgia, serif";
      ctx.fillText("DOCENTE PERMANENTE", tam / 2, 340);
      ctx.fillStyle = TJCE_OURO;
      ctx.font = "italic 16px Georgia, serif";
      ctx.fillText("“Quem ensina um juiz, julga junto", tam / 2, 396);
      ctx.fillText("em todas as comarcas.”", tam / 2, 418);
    });
  }

  /* ---------- HONRARIAS: a parede de cima do gabinete ---------- */
  function elogioFuncional() {
    return canvasDe("elogioFuncional", 512, function (ctx, tam) {
      ctx.fillStyle = "#f4ecd9"; ctx.fillRect(0, 0, tam, tam);
      ctx.strokeStyle = "#8a6a2a"; ctx.lineWidth = 5;
      ctx.strokeRect(20, 20, tam - 40, tam - 40);
      ctx.lineWidth = 1.6; ctx.strokeRect(32, 32, tam - 64, tam - 64);
      brasaoEm(ctx, tam / 2, 100, 44, "#8a6a2a");
      ctx.fillStyle = "#5a4a20";
      ctx.textAlign = "center";
      ctx.font = "bold 30px Georgia, serif";
      ctx.fillText("ELOGIO FUNCIONAL", tam / 2, 196);
      ctx.font = "17px Georgia, serif";
      ctx.fillText("Corregedoria-Geral da Justiça", tam / 2, 226);
      ctx.fillStyle = "#2b2316";
      ctx.font = "19px Georgia, serif";
      ["Consigne-se nos assentamentos funcionais", "o ELOGIO ao(à) magistrado(a) desta comarca,",
       "pela condução técnica, humana e célere", "das audiências, reiteradamente confirmada",
       "pelas instâncias superiores."].forEach(function (l, i) {
        ctx.fillText(l, tam / 2, 282 + i * 30);
      });
      ctx.font = "italic 18px Georgia, serif";
      ctx.fillStyle = "#5a4a20";
      ctx.fillText("Publique-se. Registre-se. Comemore-se com moderação.", tam / 2, tam - 56);
    });
  }

  function seloExcelencia() {
    return canvasDe("seloExcelencia", 512, function (ctx, tam) {
      // placa em latão sobre madeira
      ctx.fillStyle = "#3a2a1c"; ctx.fillRect(0, 0, tam, tam);
      const g = ctx.createLinearGradient(0, 60, 0, tam - 60);
      g.addColorStop(0, "#e3c277"); g.addColorStop(0.5, "#c9a35c"); g.addColorStop(1, "#a8843f");
      ctx.fillStyle = g;
      ctx.fillRect(48, 60, tam - 96, tam - 120);
      ctx.strokeStyle = "#6a521f"; ctx.lineWidth = 4;
      ctx.strokeRect(62, 74, tam - 124, tam - 148);
      brasaoEm(ctx, tam / 2, 158, 50, "#3a2a14");
      ctx.fillStyle = "#2b1f0c";
      ctx.textAlign = "center";
      ctx.font = "bold 34px Georgia, serif";
      ctx.fillText("EXCELÊNCIA", tam / 2, 268);
      ctx.font = "bold 22px Georgia, serif";
      ctx.fillText("NA PRESTAÇÃO JURISDICIONAL", tam / 2, 300);
      ctx.font = "17px Georgia, serif";
      ctx.fillText("Técnica · Humanidade · Celeridade · Imparcialidade", tam / 2, 342);
      ctx.font = "italic 17px Georgia, serif";
      ctx.fillText("conferido pela comarca que dorme em paz", tam / 2, 386);
      // parafusos
      ctx.fillStyle = "#6a521f";
      [[78, 90], [tam - 78, 90], [78, tam - 90], [tam - 78, tam - 90]].forEach(function (p) {
        ctx.beginPath(); ctx.arc(p[0], p[1], 6, 0, Math.PI * 2); ctx.fill();
      });
    });
  }

  function certificadoPalestra() {
    return canvasDe("certificadoPalestra", 512, function (ctx, tam) {
      ctx.fillStyle = "#fbf6e8"; ctx.fillRect(0, 0, tam, tam);
      // moldura ornamental dupla
      ctx.strokeStyle = "#2f4a3e"; ctx.lineWidth = 6;
      ctx.strokeRect(22, 22, tam - 44, tam - 44);
      ctx.lineWidth = 2; ctx.strokeRect(36, 36, tam - 72, tam - 72);
      ctx.fillStyle = "#2f4a3e";
      ctx.textAlign = "center";
      ctx.font = "bold 26px Georgia, serif";
      ctx.fillText("ESCOLA JUDICIAL", tam / 2, 96);
      ctx.font = "italic 20px Georgia, serif";
      ctx.fillText("certifica que", tam / 2, 150);
      ctx.fillStyle = "#2b2316";
      ctx.font = "bold 28px Georgia, serif";
      ctx.fillText("O(A) MAGISTRADO(A) DESTA COMARCA", tam / 2, 200);
      ctx.font = "19px Georgia, serif";
      ["ministrou a palestra", "“Um dia de audiências: a técnica", "que protege e a escuta que repara”,",
       "para a turma de formação inicial,", "com avaliação máxima dos alunos."].forEach(function (l, i) {
        ctx.fillText(l, tam / 2, 246 + i * 30);
      });
      // selo de cera
      ctx.fillStyle = "#7a2e2e";
      ctx.beginPath(); ctx.arc(tam - 110, tam - 110, 36, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#e8d9b0";
      ctx.font = "bold 18px Georgia, serif";
      ctx.fillText("EJ", tam - 110, tam - 103);
      ctx.fillStyle = "#2f4a3e";
      ctx.font = "italic 18px Georgia, serif";
      ctx.textAlign = "left";
      ctx.fillText("a diretora,", 70, tam - 116);
      ctx.beginPath(); ctx.moveTo(70, tam - 92); ctx.lineTo(230, tam - 92); ctx.stroke();
    });
  }

  function placaComunidade() {
    return canvasDe("placaComunidade", 512, function (ctx, tam) {
      ctx.fillStyle = "#fbf6e8"; ctx.fillRect(0, 0, tam, tam);
      ctx.strokeStyle = "#7a5a2a"; ctx.lineWidth = 4;
      ctx.strokeRect(24, 24, tam - 48, tam - 48);
      ctx.fillStyle = "#5a4128";
      ctx.textAlign = "center";
      ctx.font = "bold 26px Georgia, serif";
      ctx.fillText("AO JUÍZO DESTA COMARCA", tam / 2, 86);
      ctx.fillStyle = "#2b2316";
      ctx.font = "19px Georgia, serif";
      ["Nós, moradores do bairro, que entramos", "no fórum com medo e saímos com resposta,",
       "deixamos registrado: a Justiça daqui", "tem porta, tem ouvido e tem pressa", "do tamanho da nossa."].forEach(function (l, i) {
        ctx.fillText(l, tam / 2, 136 + i * 30);
      });
      // as assinaturas — muitas, tortas, de canetas diferentes
      const nomes = ["Marlene", "Seu Anísio", "D. Iolanda", "Edson", "Roseane e Alice", "Jonas",
                     "Cleide", "Aurélio", "Dona Zenaide", "Eunice", "o pessoal da feira", "+ 214 assinaturas"];
      ctx.textAlign = "left";
      nomes.forEach(function (n, i) {
        const col = i % 2, lin = Math.floor(i / 2);
        ctx.save();
        ctx.translate(76 + col * 220, 322 + lin * 30);
        ctx.rotate(Math.sin(i * 3.7) * 0.05);
        ctx.fillStyle = ["#2d3a6b", "#3a3a3a", "#5a2020"][i % 3];
        ctx.font = (i === nomes.length - 1 ? "bold 17px Georgia, serif" : "20px " + FONTE_CURSIVA);
        ctx.fillText(n, 0, 0);
        ctx.restore();
      });
    });
  }

  return {
    canvasDe: canvasDe,
    carta: carta,
    oficioTJCE: oficioTJCE,
    agradecimentoTJCE: agradecimentoTJCE,
    oficioESMEC: oficioESMEC,
    placaESMEC: placaESMEC,
    oficioACM: oficioACM,
    elogioFuncional: elogioFuncional,
    seloExcelencia: seloExcelencia,
    certificadoPalestra: certificadoPalestra,
    placaComunidade: placaComunidade,
    fotoThor: fotoThor,
    desenhoSuperJuiz: desenhoSuperJuiz,
    certidaoLembranca: certidaoLembranca,
    cartaJonas: cartaJonas,
    cartaMarlene: cartaMarlene,
    bilheteJandira: bilheteJandira,
    cartaEntrega: cartaEntrega,
    desenhoDino: desenhoDino,
    certidaoMadrugada: certidaoMadrugada,
    fotoFisioterapia: fotoFisioterapia,
    desenhoFoguete: desenhoFoguete,
    comprovanteAluguel: comprovanteAluguel,
    plaquinhaFrajola: plaquinhaFrajola,
    fotoIracema: fotoIracema
  };
})();
