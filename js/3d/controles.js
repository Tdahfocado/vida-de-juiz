/* ============================================================
   TOGA 3D — controles.js : ANDAR PELO FÓRUM (terceira pessoa)
   ------------------------------------------------------------
   - W/S (ou ↑/↓): anda na direção da câmera; A/D: passo lateral
   - ← / →: giram a câmera (o jogo é 100% jogável só no teclado)
   - Arrastar o mouse no canvas: gira a câmera (sem pointer lock,
     sem permissões — funciona até em file://)
   - O boneco do juiz vira sozinho para a direção do movimento
     (estilo "mini-GTA": a câmera é sua, o corpo segue os pés)

   FÍSICA: o jogador é um círculo (raio 0,35 m) no plano XZ;
   o mundo é uma lista de retângulos (AABB). A colisão resolve
   eixo por eixo — por isso o personagem "desliza" ao longo das
   paredes em vez de grudar nelas. Sem motor de física: 30 linhas.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.controles3d = (function () {
  if (!window.THREE) return {};

  const RAIO = 0.35, VEL = 3.2;
  let camera = null, jogador = null, colisores = [], paredesCamera = [];
  let provObstaculos = null;        // fornece obstáculos dinâmicos (NPCs, cachorro)
  let obstaculosCache = [];         // recalculado uma vez por quadro
  let multVel = 1;                  // multiplicador de velocidade (1 a pé, >1 de bike)
  let ativo = false;
  let yaw = 0, pitch = -0.26;                  // ângulos da câmera (visão um pouco mais alta)
  let velAtual = new THREE.Vector3();          // velocidade suavizada
  const teclas = {};
  const eixoVirtual = { frente: 0, lado: 0 };  // joystick de toque (toque3d.js)
  let arrastando = false, ultimoMouse = { x: 0, y: 0 };
  let inicioClique = null;                     // p/ distinguir clique de arrasto
  const raycaster = new THREE.Raycaster();

  /* ---------- CLIQUE-PARA-MOVER ----------
     Clique (ou toque curto) no chão: o juiz caminha sozinho até
     lá, com a MESMA física de colisão. Sem pathfinding: se uma
     parede travar o caminho por ~0,7 s, o destino é cancelado
     com aviso — a bússola de objetivo orienta o contorno.     */
  let destinoClique = null;     // {x, z} ou null
  let presoHa = 0;              // segundos sem progresso rumo ao destino
  const planoChao = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const pontoChao = new THREE.Vector3();
  let aoDefinirDestino = null;  // callback (cena3d desenha o marcador)
  let zoomAlvo = 3.4;           // wheel ajusta; a câmera persegue suavemente

  let interacaoPendente = null;   // clique em objeto: agir ao chegar

  function cliqueParaMover(clientX, clientY) {
    if (!ativo || !camera) return;
    const ndc = new THREE.Vector2(
      (clientX / window.innerWidth) * 2 - 1,
      -(clientY / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    raycaster.far = 80;

    // clique DIRETO num objeto/NPC interagível: se já está no
    // alcance, age na hora; senão, anda até ele e age ao chegar
    if (TOGA.interacao3d && TOGA.interacao3d.alvoDoRaio) {
      const alvo = TOGA.interacao3d.alvoDoRaio(raycaster);
      if (alvo && jogador) {
        const dx = alvo.pos.x - jogador.position.x, dz = alvo.pos.z - jogador.position.z;
        if (Math.sqrt(dx * dx + dz * dz) <= alvo.raio) {
          TOGA.interacao3d.disparar(alvo.id);
          return;
        }
        interacaoPendente = alvo;
        destinoClique = { x: alvo.pos.x, z: alvo.pos.z };
        presoHa = 0;
        if (aoDefinirDestino) aoDefinirDestino(destinoClique);
        return;
      }
    }
    if (!raycaster.ray.intersectPlane(planoChao, pontoChao)) return;
    interacaoPendente = null;
    destinoClique = { x: pontoChao.x, z: pontoChao.z };
    presoHa = 0;
    if (aoDefinirDestino) aoDefinirDestino(destinoClique);
  }

  function cancelarDestino() {
    destinoClique = null;
    interacaoPendente = null;
    if (aoDefinirDestino) aoDefinirDestino(null);
  }

  /* ---------- Entrada ---------- */
  function aoTeclar(ev, baixo) {
    if (!ativo) return;
    const k = ev.key.toLowerCase();
    if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) {
      teclas[k] = baixo;
      ev.preventDefault();
    }
  }

  function ligarEntrada(canvas) {
    document.addEventListener("keydown", e => aoTeclar(e, true));
    document.addEventListener("keyup", e => aoTeclar(e, false));
    canvas.addEventListener("mousedown", e => {
      arrastando = true;
      ultimoMouse = { x: e.clientX, y: e.clientY };
      inicioClique = { x: e.clientX, y: e.clientY };
    });
    window.addEventListener("mouseup", e => {
      // clique "limpo" (sem arrasto > 6 px) = andar até o ponto
      if (arrastando && inicioClique && ativo &&
          Math.abs(e.clientX - inicioClique.x) < 6 && Math.abs(e.clientY - inicioClique.y) < 6 &&
          e.target === canvas) {
        cliqueParaMover(e.clientX, e.clientY);
      }
      arrastando = false;
      inicioClique = null;
    });
    window.addEventListener("mousemove", e => {
      if (!arrastando || !ativo) return;
      yaw -= (e.clientX - ultimoMouse.x) * 0.005;
      pitch = Math.max(-0.62, Math.min(0.25, pitch - (e.clientY - ultimoMouse.y) * 0.003));
      ultimoMouse = { x: e.clientX, y: e.clientY };
    });
    // zoom: a roda aproxima/afasta a câmera
    canvas.addEventListener("wheel", e => {
      if (!ativo) return;
      e.preventDefault();
      zoomAlvo = Math.max(2.2, Math.min(5.6, zoomAlvo + (e.deltaY > 0 ? 0.4 : -0.4)));
    }, { passive: false });
    // toque: arrastar gira; TOQUE CURTO no cenário = andar até lá
    canvas.addEventListener("touchstart", e => {
      if (e.touches[0]) {
        arrastando = true;
        ultimoMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        inicioClique = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });
    window.addEventListener("touchend", e => {
      const t = e.changedTouches && e.changedTouches[0];
      if (t && inicioClique && ativo &&
          Math.abs(t.clientX - inicioClique.x) < 10 && Math.abs(t.clientY - inicioClique.y) < 10 &&
          t.target === canvas) {
        cliqueParaMover(t.clientX, t.clientY);
      }
      arrastando = false;
      inicioClique = null;
    });
    window.addEventListener("touchmove", e => {
      if (!arrastando || !ativo || !e.touches[0]) return;
      yaw -= (e.touches[0].clientX - ultimoMouse.x) * 0.006;
      ultimoMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });
  }

  /* ---------- Colisão círculo × AABB ---------- */
  function colide(x, z) {
    for (let i = 0; i < colisores.length; i++) {
      const c = colisores[i];
      const px = Math.max(c.minX, Math.min(x, c.maxX));
      const pz = Math.max(c.minZ, Math.min(z, c.maxZ));
      const dx = x - px, dz = z - pz;
      if (dx * dx + dz * dz < RAIO * RAIO) return true;
    }
    // obstáculos dinâmicos: personagens e o cachorro (círculos)
    for (let i = 0; i < obstaculosCache.length; i++) {
      const o = obstaculosCache[i];
      const dx = x - o.x, dz = z - o.z;
      const rr = RAIO + (o.raio || 0.34);
      if (dx * dx + dz * dz < rr * rr) return true;
    }
    return false;
  }

  /* ---------- O tick de cada quadro ---------- */
  function tick(dt) {
    if (!ativo || !jogador) return;

    // obstáculos dinâmicos do quadro (personagens, cachorro). Quem JÁ está
    // sobreposto ao juiz é ignorado, para que um NPC que encoste nunca o prenda.
    if (provObstaculos) {
      const px = jogador.position.x, pz = jogador.position.z;
      const todos = provObstaculos();
      obstaculosCache = [];
      for (let i = 0; i < todos.length; i++) {
        const o = todos[i], dx = px - o.x, dz = pz - o.z, rr = (RAIO + (o.raio || 0.34)) * 0.9;
        if (dx * dx + dz * dz >= rr * rr) obstaculosCache.push(o);
      }
    } else { obstaculosCache = []; }

    // giro pelo teclado
    if (teclas["arrowleft"]) yaw += 2.2 * dt;
    if (teclas["arrowright"]) yaw -= 2.2 * dt;

    // direção desejada no plano, relativa à câmera (teclas + joystick)
    const frente = (teclas["w"] || teclas["arrowup"] ? 1 : 0) - (teclas["s"] || teclas["arrowdown"] ? 1 : 0)
      + eixoVirtual.frente;
    const lado = (teclas["d"] ? 1 : 0) - (teclas["a"] ? 1 : 0) + eixoVirtual.lado;
    // yaw=0 olha para +z; "direita da tela" nessa orientação é -x
    const dir = new THREE.Vector3(
      Math.sin(yaw) * frente - Math.cos(yaw) * lado,
      0,
      Math.cos(yaw) * frente + Math.sin(yaw) * lado
    );
    if (dir.lengthSq() > 1) dir.normalize();

    // input manual cancela o destino do clique (o jogador assumiu)
    if (destinoClique && dir.lengthSq() > 0.01) cancelarDestino();

    // sem input manual: o destino do clique guia o passo
    if (destinoClique && dir.lengthSq() < 0.01) {
      const ddx = destinoClique.x - jogador.position.x;
      const ddz = destinoClique.z - jogador.position.z;
      const ddist = Math.sqrt(ddx * ddx + ddz * ddz);
      // chegando num OBJETO clicado: para no raio dele e age
      const alvoRaio = interacaoPendente ? Math.max(0.5, interacaoPendente.raio - 0.4) : 0.3;
      if (ddist < alvoRaio) {
        const pendente = interacaoPendente;
        cancelarDestino();
        if (pendente && TOGA.interacao3d) TOGA.interacao3d.disparar(pendente.id);
      } else {
        dir.set(ddx / ddist, 0, ddz / ddist);
      }
    }

    // a toga pesa: com estresse alto, o passo encurta. De bicicleta, voa.
    let vel = VEL * multVel;
    const est = TOGA.motor && TOGA.motor.estado ? (TOGA.motor.estado.estresse || 0) : 0;
    if (est >= 85) vel *= 0.72;
    else if (est >= 70) vel *= 0.85;

    // aceleração suavizada (lerp da velocidade)
    velAtual.lerp(dir.multiplyScalar(vel), Math.min(1, 10 * dt));

    // move eixo a eixo (deslize nas paredes)
    const p = jogador.position;
    const antesX = p.x, antesZ = p.z;
    const nx = p.x + velAtual.x * dt;
    if (!colide(nx, p.z)) p.x = nx;
    const nz = p.z + velAtual.z * dt;
    if (!colide(p.x, nz)) p.z = nz;

    // anti-preso do clique-para-mover: sem progresso por ~0,7 s, desiste
    if (destinoClique) {
      const moveu = Math.abs(p.x - antesX) + Math.abs(p.z - antesZ);
      presoHa = moveu < 0.004 ? presoHa + dt : 0;
      if (presoHa > 0.7) {
        cancelarDestino();
        if (TOGA.cena3d && TOGA.cena3d.toastMundo) {
          TOGA.cena3d.toastMundo("🚧 O caminho está bloqueado por aqui — contorne o móvel ou siga a bússola do objetivo.");
        }
      }
    }

    // o corpo vira para onde anda
    if (velAtual.lengthSq() > 0.05) {
      const alvo = Math.atan2(velAtual.x, velAtual.z);
      let delta = alvo - jogador.rotation.y;
      while (delta > Math.PI) delta -= 2 * Math.PI;
      while (delta < -Math.PI) delta += 2 * Math.PI;
      jogador.rotation.y += delta * Math.min(1, 12 * dt);
    }

    // animação de passos (balanço sutil do grupo, lido pelo boneco)
    jogador.userData.andando = velAtual.lengthSq() > 0.3;
    if (jogador.userData.andando && TOGA.audio) TOGA.audio.passo();

    atualizarCamera(dt);
  }

  /* ---------- Câmera follow com clip de parede ---------- */
  let DIST = 3.4;
  const ALT = 2.15;
  function atualizarCamera(dt) {
    DIST += (zoomAlvo - DIST) * Math.min(1, 8 * dt);   // zoom suave (roda do mouse)
    const cabeca = new THREE.Vector3(jogador.position.x, 1.55, jogador.position.z);
    const ideal = new THREE.Vector3(
      cabeca.x - Math.sin(yaw) * DIST * Math.cos(pitch),
      ALT - DIST * Math.sin(pitch),
      cabeca.z - Math.cos(yaw) * DIST * Math.cos(pitch)
    );

    // raycast da cabeça à posição ideal: parede no meio? encurta.
    const dirCam = ideal.clone().sub(cabeca);
    const distIdeal = dirCam.length();
    raycaster.set(cabeca, dirCam.normalize());
    raycaster.far = distIdeal;
    const hits = raycaster.intersectObjects(paredesCamera, false);
    const dist = hits.length ? Math.max(0.4, hits[0].distance - 0.25) : distIdeal;
    const alvo = cabeca.clone().add(dirCam.multiplyScalar(dist));

    camera.position.lerp(alvo, Math.min(1, 9 * dt));
    camera.lookAt(cabeca.x, cabeca.y + 0.15, cabeca.z);
  }

  /* ---------- API ---------- */
  return {
    iniciar: function (cam, jogadorGrupo, mundoInfo) {
      camera = cam; jogador = jogadorGrupo;
      colisores = mundoInfo.colisores || [];
      paredesCamera = mundoInfo.paredesCamera || [];
      ligarEntrada(TOGA.nucleo3d.renderer ? TOGA.nucleo3d.renderer.domElement : document.body);
      TOGA.nucleo3d.aoFrame(tick);
    },
    /* troca o boneco controlado (ex.: o jogador personalizou o juiz) */
    definirJogador: function (grupo) { jogador = grupo; },
    ativar: function () { ativo = true; },
    desativar: function () {
      ativo = false;
      Object.keys(teclas).forEach(k => teclas[k] = false);
      eixoVirtual.frente = 0; eixoVirtual.lado = 0;
      velAtual.set(0, 0, 0);
      cancelarDestino();
    },
    /* o cena3d registra aqui o desenho do marcador de destino */
    aoDestino: function (fn) { aoDefinirDestino = fn; },
    /* fornecedor de obstáculos dinâmicos (NPCs, cachorro): () => [{x,z,raio}] */
    definirObstaculos: function (fn) { provObstaculos = fn; },
    /* multiplicador de velocidade (1 a pé, ~1.9 de bicicleta) */
    definirMultiplicadorVel: function (m) { multVel = m || 1; },
    get yaw() { return yaw; },
    setEixoVirtual: function (frente, lado) {
      eixoVirtual.frente = Math.max(-1, Math.min(1, frente || 0));
      eixoVirtual.lado = Math.max(-1, Math.min(1, lado || 0));
    },
    /* troca o conjunto de colisores/paredes (viagem entre locais) */
    setMundo: function (info) {
      colisores = (info && info.colisores) || [];
      paredesCamera = (info && info.paredesCamera) || [];
    },
    teleportar: function (x, z, angulo) {
      if (!jogador) return;
      jogador.position.set(x, 0, z);
      if (typeof angulo === "number") { jogador.rotation.y = angulo; yaw = angulo; }
      if (camera) { atualizarCamera(1); camera.position.copy(
        new THREE.Vector3(x - Math.sin(yaw) * DIST, ALT, z - Math.cos(yaw) * DIST)); }
    },
    estado: function () {
      return jogador ? {
        pos: { x: jogador.position.x, z: jogador.position.z },
        dir: { x: Math.sin(yaw), z: Math.cos(yaw) }
      } : null;
    },
    get ativo() { return ativo; }
  };
})();
