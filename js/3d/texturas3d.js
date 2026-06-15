/* ============================================================
   TOGA 3D — texturas3d.js : MATERIAIS com cara de fórum
   ------------------------------------------------------------
   Texturas desenhadas em canvas e viradas THREE.CanvasTexture.

   Por que canvas e não arquivos .png? O jogo abre por duplo
   clique (file://) — e, nesse modo, o Chrome BLOQUEIA texturas
   WebGL vindas de arquivos locais (canvas "tainted"). Canvas
   desenhado no próprio documento funciona sempre, pesa zero
   bytes no projeto e ainda respeita a paleta do CSS.

   Cada textura é desenhada UMA vez na inicialização e
   reaproveitada (cache) por todos os meshes que a usarem.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.texturas3d = (function () {
  if (!window.THREE) return {};

  const cache = {};

  function criar(nome, tam, desenhar) {
    if (cache[nome]) return cache[nome];
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = tam;
    desenhar(canvas.getContext("2d"), tam);
    const tx = new THREE.CanvasTexture(canvas);
    tx.wrapS = tx.wrapT = THREE.RepeatWrapping;
    const r = TOGA.nucleo3d && TOGA.nucleo3d.renderer;
    if (r) tx.anisotropy = r.capabilities.getMaxAnisotropy();
    cache[nome] = tx;
    return tx;
  }

  /* ruído determinístico barato (sem Math.random: a textura
     fica idêntica entre sessões e o desenho é reproduzível) */
  function ruido(i) { return (Math.sin(i * 127.1 + 311.7) * 43758.5453) % 1; }

  /* ---------- O STUD desenhado (peça de montar em 2D) ----------
     Círculo da cor base com arco de luz no topo-esquerda e arco
     de sombra na base-direita — o suficiente para o olho ler
     "pino de Lego" sem custo de geometria.                     */
  function stud(ctx, cx, cy, r, corClara, corEscura) {
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,.06)"; ctx.fill();
    ctx.lineWidth = Math.max(1.4, r * 0.22);
    ctx.strokeStyle = corClara;
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.86, Math.PI * 0.8, Math.PI * 1.55); ctx.stroke();
    ctx.strokeStyle = corEscura;
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.86, Math.PI * 1.85, Math.PI * 0.55); ctx.stroke();
  }

  /* ---------- Placa-base Lego (pisos) ---------- */
  function placaBase(ctx, tam, corBase, corClara, corEscura) {
    ctx.fillStyle = corBase;
    ctx.fillRect(0, 0, tam, tam);
    // leve variação de "placas" 2×2 para quebrar a monotonia
    const meia = tam / 2;
    ctx.fillStyle = "rgba(255,255,255,.025)";
    ctx.fillRect(0, 0, meia, meia); ctx.fillRect(meia, meia, meia, meia);
    // grade 8×8 de studs
    const passo = tam / 8;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        stud(ctx, i * passo + passo / 2, j * passo + passo / 2, passo * 0.30, corClara, corEscura);
      }
    }
    // junta entre placas
    ctx.strokeStyle = "rgba(0,0,0,.30)";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, tam, tam);
  }

  function pisoSala() {
    return criar("pisoSala", 256, function (ctx, tam) {
      placaBase(ctx, tam, "#3a2b1b", "rgba(255,232,190,.30)", "rgba(0,0,0,.40)");
    });
  }

  function pisoCorredor() {
    return criar("pisoCorredor", 256, function (ctx, tam) {
      placaBase(ctx, tam, "#2e2114", "rgba(255,232,190,.26)", "rgba(0,0,0,.42)");
    });
  }

  /* ---------- Painéis de parede (placas lisas + studs no friso) ---------- */
  function parede() {
    return criar("parede", 256, function (ctx, tam) {
      // parte alta clara e dessaturada (tom pedra): separa a parede
      // do piso escuro e deixa a luz fria aparecer
      ctx.fillStyle = "#5d5444";
      ctx.fillRect(0, 0, tam, tam);
      // lambri inferior, tom de outra "peça"
      ctx.fillStyle = "#443a28";
      ctx.fillRect(0, tam * 0.62, tam, tam * 0.38);
      // juntas mais SUAVES que antes: a identidade de "peça" fica,
      // a repetição gritante vai embora
      ctx.strokeStyle = "rgba(0,0,0,.20)";
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(0, tam * 0.62); ctx.lineTo(tam, tam * 0.62); ctx.stroke();
      // encaixes verticais de placa no lambri
      ctx.strokeStyle = "rgba(0,0,0,.16)";
      ctx.lineWidth = 2;
      for (let x = 0; x <= tam; x += tam / 4) {
        ctx.beginPath(); ctx.moveTo(x, tam * 0.62); ctx.lineTo(x, tam); ctx.stroke();
      }
      // fileira de studs ao longo do friso (a parede também é peça)
      const passo = tam / 8;
      for (let i = 0; i < 8; i++) {
        stud(ctx, i * passo + passo / 2, tam * 0.62 - passo * 0.34, passo * 0.24,
          "rgba(255,232,190,.14)", "rgba(0,0,0,.20)");
      }
      // divisões horizontais de placas na parte alta
      ctx.strokeStyle = "rgba(0,0,0,.10)";
      ctx.lineWidth = 2;
      [0.21, 0.42].forEach(function (f) {
        ctx.beginPath(); ctx.moveTo(0, tam * f); ctx.lineTo(tam, tam * f); ctx.stroke();
      });
    });
  }

  /* ---------- Madeira de verdade (tampos, bancada) ----------
     Tábuas com veios — quebra a monotonia do plástico chapado
     sem abandonar a paleta quente do fórum.                  */
  function madeira() {
    return criar("madeira", 256, function (ctx, tam) {
      ctx.fillStyle = "#6e4a2a";
      ctx.fillRect(0, 0, tam, tam);
      const altura = tam / 4;                      // 4 tábuas
      for (let i = 0; i < 4; i++) {
        const y = i * altura;
        ctx.fillStyle = i % 2 ? "#75502e" : "#684525";
        ctx.fillRect(0, y, tam, altura);
        // veios: curvas suaves, determinísticas
        ctx.strokeStyle = "rgba(40,24,10,.28)";
        ctx.lineWidth = 1.4;
        for (let v = 0; v < 5; v++) {
          const vy = y + 6 + v * (altura / 5);
          ctx.beginPath();
          ctx.moveTo(0, vy);
          for (let x = 0; x <= tam; x += 32) {
            ctx.quadraticCurveTo(x + 16, vy + Math.sin(ruido(i * 31 + v * 7 + x) * 6.28) * 3.2, x + 32, vy);
          }
          ctx.stroke();
        }
        // nó de madeira ocasional
        if (i % 2 === 0) {
          const nx = 40 + Math.abs(ruido(i * 13)) * (tam - 80);
          ctx.strokeStyle = "rgba(40,24,10,.4)";
          ctx.beginPath(); ctx.ellipse(nx, y + altura / 2, 7, 4, 0.3, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.ellipse(nx, y + altura / 2, 3, 1.8, 0.3, 0, Math.PI * 2); ctx.stroke();
        }
        // junta entre tábuas
        ctx.strokeStyle = "rgba(0,0,0,.4)";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(tam, y); ctx.stroke();
      }
    });
  }

  /* ---------- Tapete vinho (corredor central da sala) ---------- */
  function tapete() {
    return criar("tapete", 128, function (ctx, tam) {
      ctx.fillStyle = "#5e2424";
      ctx.fillRect(0, 0, tam, tam);
      // tramas
      ctx.strokeStyle = "rgba(0,0,0,.25)";
      ctx.lineWidth = 1;
      for (let y = 0; y < tam; y += 5) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(tam, y); ctx.stroke();
      }
      // barras douradas nas bordas
      ctx.fillStyle = "#c9a35c";
      ctx.fillRect(0, 0, 8, tam);
      ctx.fillRect(tam - 8, 0, 8, tam);
    });
  }

  /* ---------- Brasão da Justiça (o mesmo do menu) ---------- */
  function brasao() {
    return criar("brasao", 512, function (ctx, tam) {
      const k = tam / 100;       // o SVG do menu usa viewBox 0..100
      ctx.fillStyle = "#463422";
      ctx.fillRect(0, 0, tam, tam);
      ctx.strokeStyle = "#c9a35c";
      ctx.fillStyle = "#c9a35c";
      ctx.lineCap = "round";
      // círculo externo
      ctx.lineWidth = 2.5 * k;
      ctx.beginPath(); ctx.arc(50 * k, 50 * k, 44 * k, 0, Math.PI * 2); ctx.stroke();
      // haste e travessão da balança
      ctx.lineWidth = 4 * k;
      ctx.beginPath(); ctx.moveTo(50 * k, 16 * k); ctx.lineTo(50 * k, 70 * k); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(22 * k, 28 * k); ctx.lineTo(78 * k, 28 * k); ctx.stroke();
      // pratos
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
      // base
      ctx.fillRect(36 * k, 70 * k, 28 * k, 7 * k);
    });
  }

  /* ---------- Papéis do mural ---------- */
  function mural() {
    return criar("mural", 256, function (ctx, tam) {
      ctx.fillStyle = "#5a4128";        // cortiça
      ctx.fillRect(0, 0, tam, tam);
      const folhas = [
        [14, 18, 70, 92, -0.05], [98, 26, 64, 80, 0.04], [176, 14, 66, 88, -0.03],
        [30, 128, 64, 84, 0.06], [120, 124, 72, 92, -0.04], [200, 132, 48, 70, 0.05]
      ];
      folhas.forEach(function (f, i) {
        ctx.save();
        ctx.translate(f[0] + f[2] / 2, f[1] + f[3] / 2);
        ctx.rotate(f[4]);
        ctx.fillStyle = i % 3 === 0 ? "#f4ecd9" : i % 3 === 1 ? "#efe5c8" : "#e2d6ba";
        ctx.fillRect(-f[2] / 2, -f[3] / 2, f[2], f[3]);
        // linhas de "texto"
        ctx.strokeStyle = "rgba(40,30,16,.5)";
        ctx.lineWidth = 2;
        for (let y = -f[3] / 2 + 12; y < f[3] / 2 - 6; y += 9) {
          ctx.beginPath();
          ctx.moveTo(-f[2] / 2 + 6, y);
          ctx.lineTo(f[2] / 2 - 6 - Math.abs(ruido(i * 9 + y)) * 14, y);
          ctx.stroke();
        }
        // tachinha
        ctx.fillStyle = "#7a2e2e";
        ctx.beginPath(); ctx.arc(0, -f[3] / 2 + 5, 3.4, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });
    });
  }

  /* ---------- Quadro de parede (paisagem genérica) ---------- */
  function quadro(n) {
    return criar("quadro" + n, 128, function (ctx, tam) {
      // moldura
      ctx.fillStyle = "#c9a35c";
      ctx.fillRect(0, 0, tam, tam);
      ctx.fillStyle = n === 1 ? "#7c93a8" : "#9a8a5a";    // céu / campo
      ctx.fillRect(10, 10, tam - 20, tam - 20);
      ctx.fillStyle = n === 1 ? "#4a5d42" : "#6a5232";    // morros / terra
      ctx.beginPath();
      ctx.moveTo(10, tam - 10);
      ctx.quadraticCurveTo(tam * 0.35, tam * 0.45, tam * 0.6, tam * 0.7);
      ctx.quadraticCurveTo(tam * 0.8, tam * 0.85, tam - 10, tam * 0.6);
      ctx.lineTo(tam - 10, tam - 10);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(255,226,160,.8)";             // sol
      ctx.beginPath(); ctx.arc(tam * 0.72, tam * 0.32, 9, 0, Math.PI * 2); ctx.fill();
    });
  }

  /* ---------- Artes das lembranças (js/arte.js) viram texturas ----------
     O desenho mora em TOGA.arte (canvas puro, compartilhado com o
     modo 2D); aqui só embrulhamos o MESMO canvas numa CanvasTexture. */
  function deArte(nome) {
    const chave = "arte:" + nome;
    if (cache[chave]) return cache[chave];
    const tx = new THREE.CanvasTexture(TOGA.arte[nome]());
    const r = TOGA.nucleo3d && TOGA.nucleo3d.renderer;
    if (r) tx.anisotropy = r.capabilities.getMaxAnisotropy();
    cache[chave] = tx;
    return tx;
  }

  function fotoThor() { return deArte("fotoThor"); }
  function desenhoSuperJuiz() { return deArte("desenhoSuperJuiz"); }
  function certidaoLembranca() { return deArte("certidaoLembranca"); }

  /* ---------- Placas de identificação (texto em latão) ---------- */
  function placa(texto) {
    return criar("placa:" + texto, 256, function (ctx, tam) {
      ctx.fillStyle = "#c9a35c";
      ctx.fillRect(0, 0, tam, tam);
      ctx.fillStyle = "#15110c";
      ctx.fillRect(8, tam * 0.36, tam - 16, tam * 0.28);
      ctx.fillStyle = "#e7cf9a";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "bold " + Math.floor(tam / (texto.length > 12 ? 12 : 8)) + "px Georgia, serif";
      ctx.fillText(texto, tam / 2, tam * 0.50, tam - 28);
    });
  }

  /* ---------- Texturas da CIDADE e da ESMEC ---------- */

  /* granito rosado da fachada da ESMEC (placas com juntas) */
  function granitoRosa() {
    return criar("granitoRosa", 128, function (ctx, tam) {
      ctx.fillStyle = "#b08572";
      ctx.fillRect(0, 0, tam, tam);
      for (let i = 0; i < 240; i++) {
        const x = Math.abs(ruido(i)) * tam, y = Math.abs(ruido(i + 99)) * tam;
        ctx.fillStyle = i % 3 ? "rgba(140,95,80,.35)" : "rgba(205,170,150,.3)";
        ctx.fillRect(x, y, 2.2, 2.2);
      }
      // juntas das placas
      ctx.strokeStyle = "rgba(70,45,38,.5)";
      ctx.lineWidth = 1.4;
      for (let i = 0; i <= 4; i++) {
        ctx.beginPath(); ctx.moveTo(0, i * tam / 4); ctx.lineTo(tam, i * tam / 4); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(i * tam / 4, 0); ctx.lineTo(i * tam / 4, tam); ctx.stroke();
      }
    });
  }

  /* porcelanato branco do hall da ESMEC, com faixa de granito
     cinza em diagonal (as fotos do hall) */
  function pisoEsmec() {
    return criar("pisoEsmec", 128, function (ctx, tam) {
      ctx.fillStyle = "#e8e6e0";
      ctx.fillRect(0, 0, tam, tam);
      ctx.strokeStyle = "rgba(150,148,140,.45)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        ctx.beginPath(); ctx.moveTo(0, i * tam / 4); ctx.lineTo(tam, i * tam / 4); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(i * tam / 4, 0); ctx.lineTo(i * tam / 4, tam); ctx.stroke();
      }
      // a faixa diagonal de granito cinza
      ctx.save();
      ctx.translate(tam / 2, tam / 2); ctx.rotate(Math.PI / 4);
      ctx.fillStyle = "#9a958d";
      ctx.fillRect(-tam, -7, tam * 2, 14);
      ctx.restore();
    });
  }

  /* granitina cinza do auditório, com a faixa vermelha de corredor */
  function pisoAuditorioEsmec() {
    return criar("pisoAudEsmec", 128, function (ctx, tam) {
      ctx.fillStyle = "#9aa09a";
      ctx.fillRect(0, 0, tam, tam);
      for (let i = 0; i < 200; i++) {
        const x = Math.abs(ruido(i + 7)) * tam, y = Math.abs(ruido(i + 51)) * tam;
        ctx.fillStyle = i % 2 ? "rgba(70,75,70,.3)" : "rgba(220,220,215,.3)";
        ctx.fillRect(x, y, 1.8, 1.8);
      }
      ctx.fillStyle = "rgba(178,52,52,.85)";
      ctx.fillRect(0, tam * 0.46, tam, tam * 0.08);
    });
  }

  /* letreiro/testeira: texto sobre fundo de cor (fachadas) */
  function letreiro(texto, corFundo, corTexto, sub) {
    return criar("letreiro:" + texto + ":" + corFundo, 512, function (ctx, tam) {
      ctx.fillStyle = corFundo;
      ctx.fillRect(0, 0, tam, tam);
      ctx.fillStyle = corTexto;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (sub) {
        ctx.font = "bold " + Math.floor(tam / 22) + "px Georgia, serif";
        ctx.fillText(sub, tam / 2, tam * 0.34, tam - 30);
        ctx.font = "bold " + Math.floor(tam / 13) + "px Georgia, serif";
        ctx.fillText(texto, tam / 2, tam * 0.62, tam - 24);
      } else {
        ctx.font = "bold " + Math.floor(tam / (texto.length > 10 ? 7 : 4)) + "px Georgia, serif";
        ctx.fillText(texto, tam / 2, tam * 0.52, tam - 24);
      }
    });
  }

  /* retrato de galeria (molduras pretas do hall da ESMEC) */
  function retrato(n) {
    return criar("retrato" + n, 64, function (ctx, tam) {
      ctx.fillStyle = "#15110c";
      ctx.fillRect(0, 0, tam, tam);
      ctx.fillStyle = "#ddd6c8";
      ctx.fillRect(5, 5, tam - 10, tam - 10);
      const pele = ["#d8a87f", "#c98e66", "#a86a48", "#8a5436"][n % 4];
      ctx.fillStyle = pele;
      ctx.beginPath(); ctx.arc(tam / 2, tam * 0.42, tam * 0.17, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#2a2a30";
      ctx.fillRect(tam * 0.28, tam * 0.58, tam * 0.44, tam * 0.3);
      ctx.fillStyle = "#241a10";
      ctx.beginPath(); ctx.arc(tam / 2, tam * 0.36, tam * 0.17, Math.PI, 0); ctx.fill();
    });
  }

  /* ---------- LOGO DA ACM ----------
     Recriação em canvas (idioma do jogo, sem asset externo) da
     marca da Associação Cearense de Magistrados: a silhueta navy
     do mapa/asa do Ceará com o acento verde, "ACM" e o nome. */
  function logoAcm() {
    return criar("logoAcm", 512, function (ctx, tam) {
      const navy = "#23396b", verde = "#4f8a3a";
      ctx.fillStyle = "#f6f4ee"; ctx.fillRect(0, 0, tam, tam);
      const cx = tam * 0.5, ey = tam * 0.30, S = tam * 0.30;
      // acento verde (folha curva) atrás, à esquerda
      ctx.fillStyle = verde;
      ctx.beginPath();
      ctx.moveTo(cx - 1.05 * S, ey + 0.35 * S);
      ctx.bezierCurveTo(cx - 0.9 * S, ey + 0.95 * S, cx - 0.1 * S, ey + 1.05 * S, cx + 0.35 * S, ey + 0.75 * S);
      ctx.bezierCurveTo(cx - 0.15 * S, ey + 1.35 * S, cx - 1.0 * S, ey + 1.2 * S, cx - 1.2 * S, ey + 0.55 * S);
      ctx.closePath(); ctx.fill();
      // emblema navy (mapa/asa estilizado do Ceará, apontando à esquerda)
      ctx.fillStyle = navy;
      ctx.beginPath();
      ctx.moveTo(cx - 1.15 * S, ey + 0.15 * S);     // bico/ponta oeste
      ctx.bezierCurveTo(cx - 0.5 * S, ey - 0.95 * S, cx + 0.55 * S, ey - 1.0 * S, cx + 0.95 * S, ey - 0.35 * S);
      ctx.bezierCurveTo(cx + 1.2 * S, ey + 0.1 * S, cx + 0.7 * S, ey + 0.55 * S, cx + 0.25 * S, ey + 0.55 * S);
      ctx.bezierCurveTo(cx - 0.1 * S, ey + 0.55 * S, cx - 0.2 * S, ey + 0.95 * S, cx - 0.45 * S, ey + 0.9 * S);
      ctx.bezierCurveTo(cx - 0.85 * S, ey + 0.8 * S, cx - 1.1 * S, ey + 0.55 * S, cx - 1.15 * S, ey + 0.15 * S);
      ctx.closePath(); ctx.fill();
      // "ACM"
      ctx.fillStyle = navy; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = "bold " + Math.floor(tam * 0.23) + "px Georgia, serif";
      ctx.fillText("ACM", cx, tam * 0.70);
      // nome por extenso
      ctx.font = "bold " + Math.floor(tam * 0.046) + "px Georgia, serif";
      ctx.fillText("Associação Cearense de Magistrados", cx, tam * 0.86, tam * 0.92);
    });
  }

  /* ---------- ÁGUA (mar/lago/piscina) ----------
     Textura de ondas para rolar (offset animado no cena3d) e dar
     a sensação de água em movimento. RepeatWrapping já vem do criar. */
  function agua() {
    return criar("agua", 256, function (ctx, tam) {
      ctx.fillStyle = "#1f6f9a"; ctx.fillRect(0, 0, tam, tam);
      // faixas de onda claras, onduladas
      ctx.lineWidth = 3;
      for (let y = 0; y < tam; y += 16) {
        ctx.strokeStyle = (y % 32 === 0) ? "rgba(255,255,255,.16)" : "rgba(150,220,240,.12)";
        ctx.beginPath();
        for (let x = 0; x <= tam; x += 8) {
          const yy = y + Math.sin((x / tam) * Math.PI * 4 + y * 0.4) * 4;
          if (x === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
        }
        ctx.stroke();
      }
      // brilhos pontuais de sol na água
      ctx.fillStyle = "rgba(255,255,255,.14)";
      for (let i = 0; i < 80; i++) {
        const x = Math.abs(ruido(i * 3 + 1)) * tam, y = Math.abs(ruido(i * 3 + 7)) * tam;
        ctx.fillRect(x, y, 3, 2);
      }
    });
  }

  /* ---------- O VÍDEO-PROVA (caso eleitoral, Dia 5) ----------
     Um "frame" da gravação da reunião de compra de votos, em canvas:
     a mesa, as silhuetas, o maço de notas, o REC e o timecode. Vira
     textura (3D) ou fundo do painel (2D). */
  const canvasCache = {};
  function videoEleitoralCanvas() {
    if (canvasCache.videoEleitoral) return canvasCache.videoEleitoral;
    const c = document.createElement("canvas");
    c.width = 512; c.height = 320;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#14171c"; ctx.fillRect(0, 0, 512, 320);
    ctx.fillStyle = "#1e242c"; ctx.fillRect(0, 0, 512, 150);          // parede
    ctx.fillStyle = "#3a2c1e"; ctx.fillRect(60, 205, 392, 86);        // mesa
    ctx.fillStyle = "#4a3826"; ctx.fillRect(60, 205, 392, 14);
    ctx.fillStyle = "#0c0e12";                                         // silhuetas sentadas
    [92, 172, 340, 420].forEach(function (x) {
      ctx.beginPath(); ctx.arc(x, 180, 23, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(x - 25, 200, 50, 58);
    });
    // o candidato em pé, no centro, com o maço de notas
    ctx.fillStyle = "#10131a";
    ctx.beginPath(); ctx.arc(256, 96, 27, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(229, 120, 54, 92);
    ctx.fillStyle = "#3a7a3a";                                         // dinheiro (verde)
    for (let i = 0; i < 5; i++) ctx.fillRect(298 + i * 3, 150 - i * 2, 46, 24);
    ctx.fillStyle = "#bfe6bf"; ctx.fillRect(310, 156, 22, 3);
    ctx.fillStyle = "#e7cf9a"; ctx.font = "italic bold 21px Georgia, serif"; ctx.textAlign = "center";
    ctx.fillText("“é duzentos por cabeça...”", 256, 304);
    ctx.fillStyle = "#e03030"; ctx.beginPath(); ctx.arc(30, 28, 9, 0, Math.PI * 2); ctx.fill();  // REC
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 16px monospace";
    ctx.textAlign = "left"; ctx.fillText("REC", 44, 33);
    ctx.textAlign = "right"; ctx.fillText("28/09 00:14", 492, 33);
    ctx.strokeStyle = "#000000"; ctx.lineWidth = 8; ctx.strokeRect(4, 4, 504, 312);
    ctx.fillStyle = "rgba(0,0,0,.12)";                                 // scanlines baked
    for (let y = 0; y < 320; y += 4) ctx.fillRect(0, y, 512, 2);
    canvasCache.videoEleitoral = c;
    return c;
  }
  function videoEleitoral() {
    if (cache.videoEleitoral) return cache.videoEleitoral;
    const tx = new THREE.CanvasTexture(videoEleitoralCanvas());
    cache.videoEleitoral = tx;
    return tx;
  }

  /* asfalto com faixa central tracejada (a avenida da viagem) */
  function asfalto() {
    return criar("asfalto", 128, function (ctx, tam) {
      ctx.fillStyle = "#3a3d42";
      ctx.fillRect(0, 0, tam, tam);
      for (let i = 0; i < 160; i++) {
        const x = Math.abs(ruido(i + 31)) * tam, y = Math.abs(ruido(i + 77)) * tam;
        ctx.fillStyle = i % 2 ? "rgba(0,0,0,.25)" : "rgba(255,255,255,.06)";
        ctx.fillRect(x, y, 2, 2);
      }
      ctx.fillStyle = "#d8c84a";
      ctx.fillRect(tam / 2 - 3, 8, 6, tam * 0.36);
      ctx.fillRect(tam / 2 - 3, tam * 0.58, 6, tam * 0.36);
    });
  }

  /* ---------- Material "plástico ABS" (estilo Lego) ----------
     Phong com brilho discreto — compartilhado por TODOS os
     bonecos e móveis (cache por cor). Na qualidade "baixa",
     devolve Lambert (mais barato em GPU de celular).         */
  const matCache = {};
  function matPlastico(cor) {
    const baixa = (window.TOGA && TOGA.config && TOGA.config.qualidade3d) === "baixa";
    const chave = String(cor) + (baixa ? "|b" : "|a");
    if (!matCache[chave]) {
      matCache[chave] = baixa
        ? new THREE.MeshLambertMaterial({ color: cor })
        : new THREE.MeshPhongMaterial({ color: cor, shininess: 38, specular: 0x2a2118 });
    }
    return matCache[chave];
  }

  return {
    pisoSala: pisoSala,
    pisoCorredor: pisoCorredor,
    parede: parede,
    madeira: madeira,
    tapete: tapete,
    brasao: brasao,
    mural: mural,
    quadro: quadro,
    placa: placa,
    granitoRosa: granitoRosa,
    pisoEsmec: pisoEsmec,
    pisoAuditorioEsmec: pisoAuditorioEsmec,
    letreiro: letreiro,
    retrato: retrato,
    logoAcm: logoAcm,
    agua: agua,
    videoEleitoral: videoEleitoral,
    videoEleitoralCanvas: videoEleitoralCanvas,
    asfalto: asfalto,
    deArte: deArte,
    fotoThor: fotoThor,
    desenhoSuperJuiz: desenhoSuperJuiz,
    certidaoLembranca: certidaoLembranca,
    matPlastico: matPlastico
  };
})();
