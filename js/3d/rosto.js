/* ============================================================
   TOGA 3D — rosto.js : o ROSTO dos bonecos
   ------------------------------------------------------------
   O truque central do modo 3D: as expressões do jogo 2D são
   "paths" SVG (ex.: a boca triste é "M -9 -31 Q 0 -37 9 -31").
   O canvas 2D entende EXATAMENTE essa sintaxe via Path2D —
   então o rosto 3D desenha as MESMAS bocas, sobrancelhas e
   lágrimas do 2D num pequeno canvas, que vira textura
   (THREE.CanvasTexture) colada na frente da cabeça.

   Trocar a emoção = redesenhar o canvas + avisar a textura
   (needsUpdate). Custo: desprezível (1–2 vezes por fala).
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.rosto3d = (function () {
  if (!window.THREE) return {};

  const TAM = 256;
  // O espaço de coordenadas do avatar SVG: cabeça em (0,-46) r=24.
  // Mapeamos esse quadrado (48×48 em torno do centro da cabeça)
  // para o canvas inteiro.
  const ESCALA = TAM / 52;

  function criarTextura(avatar) {
    avatar = avatar || {};
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = TAM;
    const ctx = canvas.getContext("2d");
    const texture = new THREE.CanvasTexture(canvas);
    let emocaoAtual = "neutro";

    /* vida facial: piscar e boca que acompanha a fala */
    let piscando = false;
    let proximaPiscada = 1.5 + Math.random() * 4;   // dessincroniza os rostos
    let falando = false;
    let bocaAberta = false;
    let tFala = 0;

    function desenhar() {
      const e = (TOGA.cena2d.EXPRESSOES || {})[emocaoAtual] || TOGA.cena2d.EXPRESSOES.neutro;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, TAM, TAM);

      // sistema de coordenadas do SVG: origem no centro da cabeça
      ctx.setTransform(ESCALA, 0, 0, ESCALA, TAM / 2, TAM / 2 + 46 * ESCALA);
      ctx.lineCap = "round";

      // olhos
      ctx.fillStyle = "#231a10";
      [[-9, -50], [9, -50]].forEach(p => {
        ctx.beginPath(); ctx.arc(p[0], p[1], 2.6, 0, Math.PI * 2); ctx.fill();
      });

      // pálpebras: da emoção (semicerradas) OU da piscada (fechadas)
      if (e.palpebra || piscando) {
        ctx.strokeStyle = avatar.pele || "#d8a87f";
        ctx.lineWidth = piscando ? 6.5 : 4.5;
        ctx.beginPath(); ctx.moveTo(-13, -51); ctx.lineTo(-5, -51); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(5, -51); ctx.lineTo(13, -51); ctx.stroke();
      }

      // sobrancelhas (rotação = emoção, igual ao 2D)
      ctx.strokeStyle = "#2c2418";
      ctx.lineWidth = 2.4;
      [[-9, e.sobE], [9, e.sobD]].forEach(par => {
        ctx.save();
        ctx.translate(par[0], -57);
        ctx.rotate(par[1] * Math.PI / 180);
        ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(5, 0); ctx.stroke();
        ctx.restore();
      });

      // BOCA: aberta enquanto fala (lip-flap) OU o path da emoção
      if (falando && bocaAberta) {
        ctx.fillStyle = "#3a201a";
        ctx.beginPath(); ctx.ellipse(0, -32, 4.2, 3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#5a3326";
        ctx.lineWidth = 1.6;
        ctx.stroke();
      } else {
        ctx.strokeStyle = "#5a3326";
        ctx.lineWidth = 2.2;
        try { ctx.stroke(new Path2D(e.boca)); } catch (err) { /* path inválido? segue sem boca */ }
      }

      // lágrima
      if (e.lagrima) {
        ctx.fillStyle = "#7fb2d8";
        try { ctx.fill(new Path2D("M -14 -44 q -3 7 0 9 q 3 -2 0 -9")); } catch (err) {}
      }

      // barba (desenhada no canvas: mais barato que geometria)
      if (avatar.barba) {
        ctx.fillStyle = avatar.corCabelo || "#3a2a1a";
        try { ctx.fill(new Path2D("M -16 -42 Q -18 -26 0 -23 Q 18 -26 16 -42 Q 8 -30 0 -30 Q -8 -30 -16 -42 Z")); } catch (err) {}
      }

      // óculos
      if (avatar.oculos) {
        ctx.strokeStyle = "#2c2418";
        ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.arc(-9, -49, 6.5, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(9, -49, 6.5, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-2.5, -49); ctx.lineTo(2.5, -49); ctx.stroke();
      }

      texture.needsUpdate = true;
    }

    desenhar();

    /* relógio do rosto: o boneco chama a cada quadro.
       Redesenha só quando algo muda (piscada/boca) — barato. */
    function tick(dt) {
      // piscar
      proximaPiscada -= dt;
      if (!piscando && proximaPiscada <= 0) {
        piscando = true;
        proximaPiscada = 0.12;            // olhos fechados por 120 ms
        desenhar();
      } else if (piscando && proximaPiscada <= 0) {
        piscando = false;
        proximaPiscada = 2.5 + Math.random() * 3.5;
        desenhar();
      }
      // boca da fala (~7 aberturas/segundo)
      if (falando) {
        tFala += dt;
        const aberta = Math.floor(tFala / 0.14) % 2 === 0;
        if (aberta !== bocaAberta) { bocaAberta = aberta; desenhar(); }
      }
    }

    return {
      texture: texture,
      tick: tick,
      setEmocao: function (nome) {
        if (nome === emocaoAtual) return;
        emocaoAtual = nome;
        desenhar();
      },
      setFalando: function (sim) {
        sim = !!sim;
        if (sim === falando) return;
        falando = sim;
        tFala = 0;
        if (!sim && bocaAberta) { bocaAberta = false; }
        desenhar();                        // restaura a boca da emoção
      }
    };
  }

  return { criarTextura: criarTextura };
})();
