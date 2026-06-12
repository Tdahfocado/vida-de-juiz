/* ============================================================
   TOGA 3D — diretor3d.js : a CÂMERA da audiência
   ------------------------------------------------------------
   Durante o ato, a câmera deixa de ser fixa e passa a ser
   "dirigida": um plano GERAL da bancada (o enquadramento de
   sempre) e um plano de FOCO, que desliza por cima do ombro
   do juiz em direção a quem está falando, fechando levemente
   o ângulo de visão (FOV 58 → 48, um dolly-zoom discreto).

   Nada de cortes secos: posição, ponto de mira e FOV são
   interpolados a cada quadro. Quem prefere menos movimento
   (prefers-reduced-motion) ou roda o bot de testes recebe
   trocas instantâneas — enquadrar sem deslizar.

   Só atua quando a cena3d o ativa (audiência). No modo mundo,
   a câmera continua nas mãos do controles3d.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.diretor3d = (function () {
  if (!window.THREE) return null;

  const FOV_GERAL = 58, FOV_FOCO = 48;
  let registrado = false;
  let ativo = false;
  let snap = false;              // bot/animações rápidas: sem deslize
  let base = null;               // { pos, alvo } — o plano geral (cameraBancada)
  let foco = null;               // função () => Vector3 com a cabeça do orador
  let olharAtual = null;         // mira interpolada (lookAt não acumula sozinho)
  let alvoFov = FOV_GERAL;

  const reduzMovimento = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function v(p) { return new THREE.Vector3(p.x, p.y, p.z); }

  function iniciar() {
    if (registrado) return;
    registrado = true;
    TOGA.nucleo3d.aoFrame(tick);
  }

  function ativar(cameraBancada, rapido) {
    base = cameraBancada;
    snap = !!rapido;
    ativo = true;
    foco = null;
    olharAtual = v(base.alvo);
    alvoFov = FOV_GERAL;
  }

  function desativar() {
    ativo = false;
    foco = null;
    const cam = TOGA.nucleo3d.camera;
    if (cam && cam.fov !== FOV_GERAL) { cam.fov = FOV_GERAL; cam.updateProjectionMatrix(); }
  }

  /* Plano geral: a sala inteira, vista da bancada. */
  function geral() {
    foco = null;
    alvoFov = FOV_GERAL;
  }

  /* Plano de foco: aproxima na cabeça de quem fala, vindo da
     direção da bancada (por cima do ombro do juiz). Recebe uma
     FUNÇÃO que devolve a posição — assim a câmera acompanha o
     orador mesmo que ele ainda esteja andando até o assento.  */
  function focar(posicaoCabeca) {
    if (!ativo || !base || !posicaoCabeca) return;
    foco = (typeof posicaoCabeca === "function")
      ? posicaoCabeca
      : function () { return posicaoCabeca; };
    alvoFov = FOV_FOCO;
  }

  function tick(dt) {
    if (!ativo || !base) return;
    const cam = TOGA.nucleo3d.camera;
    if (!cam) return;

    // alvos do quadro atual (recalculados: o orador pode se mover)
    let alvoPos, alvoOlhar;
    if (foco) {
      const cabeca = foco();
      const recuo = 0.45; // 0 = em cima do orador, 1 = posição geral
      alvoPos = new THREE.Vector3(
        cabeca.x + (base.pos.x - cabeca.x) * recuo,
        Math.max(cabeca.y + 0.55, 1.9),
        cabeca.z + (base.pos.z - cabeca.z) * recuo
      );
      alvoOlhar = cabeca;
    } else {
      alvoPos = v(base.pos);
      alvoOlhar = v(base.alvo);
    }

    // sem movimento contínuo: troca de plano vira um corte limpo
    const k = (snap || reduzMovimento) ? 1 : Math.min(1, 3 * dt);
    cam.position.lerp(alvoPos, k);
    olharAtual.lerp(alvoOlhar, k);
    cam.lookAt(olharAtual);
    const novoFov = cam.fov + (alvoFov - cam.fov) * ((snap || reduzMovimento) ? 1 : Math.min(1, 2.5 * dt));
    if (Math.abs(novoFov - cam.fov) > 0.01) { cam.fov = novoFov; cam.updateProjectionMatrix(); }
  }

  return {
    iniciar: iniciar,
    ativar: ativar,
    desativar: desativar,
    geral: geral,
    focar: focar,
    get ativo() { return ativo; }
  };
})();
