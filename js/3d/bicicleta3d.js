/* ============================================================
   TOGA 3D — bicicleta3d.js : A BICICLETA DO JUIZ
   ------------------------------------------------------------
   Só o MODELO (em linguagem de blocos do jogo) e um utilitário
   para girar as rodas durante o passeio. A lógica do passeio
   (câmera, trajeto, alívio de estresse) fica no cena3d, que
   monta a bici sob o juiz e conduz um trajeto leve, sem
   obstáculos — relaxante, à beira do lago ou rumo à ACM.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.bicicleta3d = (function () {
  if (!window.THREE) return null;

  function mat(cor) {
    return TOGA.texturas3d ? TOGA.texturas3d.matPlastico(cor)
                           : new THREE.MeshLambertMaterial({ color: cor });
  }

  /* devolve um THREE.Group orientado com a FRENTE em +z (a mesma
     convenção do boneco), pronto para virar filho do jogador.   */
  function criar(corQuadro) {
    const g = new THREE.Group();
    const corpo = mat(corQuadro || 0x2f6a8a);
    const metal = mat(0x9aa0a8);
    const pneu = mat(0x15110c);

    function roda(z) {
      const r = new THREE.Group();
      const aro = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.05, 8, 20), pneu);
      const cubo = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 8), metal);
      cubo.rotation.x = Math.PI / 2;
      // raios
      for (let i = 0; i < 4; i++) {
        const raio = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.62, 0.02), metal);
        raio.rotation.z = i * Math.PI / 4;
        r.add(raio);
      }
      r.add(aro, cubo);
      r.position.set(0, 0.33, z);
      g.add(r);
      return r;
    }
    const rodaTras = roda(-0.55);
    const rodaFrente = roda(0.55);

    // quadro (tubos)
    function tubo(x1, y1, z1, x2, y2, z2, esp) {
      const dx = x2 - x1, dy = y2 - y1, dz = z2 - z1;
      const len = Math.hypot(dx, dy, dz);
      const m = new THREE.Mesh(new THREE.CylinderGeometry(esp || 0.03, esp || 0.03, len, 8), corpo);
      m.position.set((x1 + x2) / 2, (y1 + y2) / 2, (z1 + z2) / 2);
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(dx, dy, dz).normalize());
      g.add(m);
    }
    tubo(0, 0.33, -0.55, 0, 0.62, 0.1);     // traseiro inferior
    tubo(0, 0.62, 0.1, 0, 0.33, 0.55);      // garfo dianteiro
    tubo(0, 0.62, 0.1, 0, 0.66, -0.3);      // tubo do selim
    tubo(0, 0.66, -0.3, 0, 0.33, -0.55);    // tubo inferior tras

    // selim
    const selim = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.28), mat(0x1d150d));
    selim.position.set(0, 0.72, -0.32); g.add(selim);
    // guidão
    const guidao = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.05), metal);
    guidao.position.set(0, 0.72, 0.18); g.add(guidao);
    tubo(0, 0.62, 0.1, 0, 0.72, 0.18, 0.025);
    // pedais
    const pedais = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.04, 0.06), metal);
    pedais.position.set(0, 0.34, -0.1); g.add(pedais);

    g.userData.rodas = [rodaTras, rodaFrente];
    return g;
  }

  /* gira as rodas conforme a velocidade do passeio */
  function girarRodas(bike, dt, vel) {
    if (!bike || !bike.userData.rodas) return;
    bike.userData.rodas.forEach(function (r) { r.rotation.x -= (vel || 4) * dt; });
  }

  return { criar: criar, girarRodas: girarRodas };
})();
