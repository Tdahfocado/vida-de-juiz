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
    deArte: deArte,
    fotoThor: fotoThor,
    desenhoSuperJuiz: desenhoSuperJuiz,
    certidaoLembranca: certidaoLembranca,
    matPlastico: matPlastico
  };
})();
