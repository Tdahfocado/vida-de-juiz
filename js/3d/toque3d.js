/* ============================================================
   TOGA 3D — toque3d.js : JOGAR NO CELULAR
   ------------------------------------------------------------
   Em telas de toque, o fórum ganha um joystick virtual no
   canto inferior esquerdo (andar) — o resto da tela continua
   girando a câmera ao arrastar, como já fazia. O aviso de
   interação ("E — abrir os autos") vira um BOTÃO: tocar nele
   executa a ação, dispensando o teclado.

   Detalhe de arquitetura: a tela do mundo (#tela-mundo) tem
   pointer-events:none para o arrasto chegar ao canvas; por
   isso o joystick é um nó próprio com pointer-events:auto.
   Toques no joystick nunca chegam ao canvas — não há conflito
   com o giro de câmera, sem precisar arbitrar pointerIds.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.toque3d = (function () {
  if (!window.THREE) return {};

  const RAIO_BASE = 60;        // px — metade do diâmetro da base
  let base = null, alavanca = null;
  let pointerAtivo = null;

  function telaDeToque() {
    return window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  }

  function criarDom() {
    base = document.createElement("div");
    base.id = "joystick-virtual";
    base.className = "joystick";
    alavanca = document.createElement("div");
    alavanca.className = "alavanca";
    base.appendChild(alavanca);
    // dentro da tela do mundo: aparece e some junto com ela
    const tela = document.getElementById("tela-mundo");
    (tela || document.body).appendChild(base);
  }

  function aplicar(dx, dy) {
    const dist = Math.sqrt(dx * dx + dy * dy);
    const k = dist > RAIO_BASE ? RAIO_BASE / dist : 1;
    dx *= k; dy *= k;
    alavanca.style.transform = "translate(calc(-50% + " + dx + "px), calc(-50% + " + dy + "px))";
    // tela: y cresce para baixo; jogo: frente é -y
    TOGA.controles3d.setEixoVirtual(-dy / RAIO_BASE, dx / RAIO_BASE);
  }

  function soltar() {
    pointerAtivo = null;
    alavanca.style.transform = "translate(-50%, -50%)";
    TOGA.controles3d.setEixoVirtual(0, 0);
  }

  function ligarEntrada() {
    base.addEventListener("pointerdown", function (ev) {
      pointerAtivo = ev.pointerId;
      try { base.setPointerCapture(ev.pointerId); } catch (e) { /* ponteiro sintético */ }
      const r = base.getBoundingClientRect();
      aplicar(ev.clientX - (r.left + r.width / 2), ev.clientY - (r.top + r.height / 2));
      ev.preventDefault();
    });
    base.addEventListener("pointermove", function (ev) {
      if (ev.pointerId !== pointerAtivo) return;
      const r = base.getBoundingClientRect();
      aplicar(ev.clientX - (r.left + r.width / 2), ev.clientY - (r.top + r.height / 2));
      ev.preventDefault();
    });
    base.addEventListener("pointerup", soltar);
    base.addEventListener("pointercancel", soltar);
  }

  function iniciar() {
    if (base) return;
    criarDom();
    ligarEntrada();
    if (telaDeToque()) {
      const dica = document.getElementById("dica-controles");
      if (dica) dica.textContent = "alavanca — andar · arrastar a tela — girar · toque no aviso — interagir";
    }
  }

  return { iniciar: iniciar, telaDeToque: telaDeToque };
})();
