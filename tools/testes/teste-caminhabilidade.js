/* Caminhabilidade: BFS em grade de 20 cm sobre os colisores da
   ESMEC e da RUA — todo ponto de interesse precisa ser alcançável
   a partir do spawn (raio do jogador: 0,35 m). Acusa obstáculos
   intransponíveis ANTES de qualquer jogador encontrá-los.       */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const raiz = path.resolve(__dirname, "../..");
const ctx = { console, Math, JSON, setTimeout: (f) => f && null };
ctx.window = ctx;
ctx.self = ctx;
ctx.document = {
  createElement: () => ({ getContext: () => null }),
  createElementNS: () => ({}),
  body: { classList: { contains: () => false, add() {}, remove() {} } },
  getElementById: () => null,
  querySelector: () => null
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(raiz, "js/vendor/three.min.js"), "utf8"), ctx);
ctx.THREE = ctx.THREE || ctx.window.THREE;

// stubs mínimos: texturas (o BFS só precisa de geometria), bonecos e rotinas
ctx.TOGA = {
  config: { qualidade3d: "baixa" },
  texturas3d: {
    matPlastico: (cor) => new ctx.THREE.MeshLambertMaterial({ color: cor }),
    placa: () => new ctx.THREE.Texture(),
    letreiro: () => new ctx.THREE.Texture(),
    retrato: () => new ctx.THREE.Texture(),
    quadro: () => new ctx.THREE.Texture(),
    asfalto: null, granitoRosa: null, pisoEsmec: null, pisoAuditorioEsmec: null,
    desenhoSuperJuiz: () => new ctx.THREE.Texture()
  },
  boneco3d: { criar: () => ({
    grupo: new ctx.THREE.Group(),
    setEmocao() {}, segurar() {}, sentar() {}, falando() {}, olharPara() {},
    executarAcao() {}
  }) },
  rotinas3d: { adicionarRotina() {} },
  juizesTJCE: null
};
vm.runInContext(fs.readFileSync(path.join(raiz, "js/dados/juizes-tjce.js"), "utf8"), ctx);
vm.runInContext(fs.readFileSync(path.join(raiz, "js/3d/cidade3d.js"), "utf8"), ctx);
vm.runInContext(fs.readFileSync(path.join(raiz, "js/3d/esmec3d.js"), "utf8"), ctx);

const RAIO = 0.35, PASSO = 0.2;
function analisar(nome, info, spawn, alvos, bounds) {
  const colisores = info.colisores;
  function livre(x, z) {
    for (const c of colisores) {
      const dx = x - Math.max(c.minX, Math.min(x, c.maxX));
      const dz = z - Math.max(c.minZ, Math.min(z, c.maxZ));
      if (dx * dx + dz * dz < RAIO * RAIO) return false;
    }
    return true;
  }
  const cols = Math.round((bounds.x2 - bounds.x1) / PASSO);
  const rows = Math.round((bounds.z2 - bounds.z1) / PASSO);
  const visit = new Uint8Array(cols * rows);
  const idx = (x, z) => {
    const i = Math.round((x - bounds.x1) / PASSO), j = Math.round((z - bounds.z1) / PASSO);
    return (i < 0 || j < 0 || i >= cols || j >= rows) ? -1 : j * cols + i;
  };
  // alinha o início à grade (spawn fora de múltiplo de 20 cm fazia
  // o arredondamento colidir índices vizinhos e matar o flood)
  const sx = bounds.x1 + Math.round((spawn.x - bounds.x1) / PASSO) * PASSO;
  const sz = bounds.z1 + Math.round((spawn.z - bounds.z1) / PASSO) * PASSO;
  const fila = [[sx, sz]];
  visit[idx(sx, sz)] = 1;
  while (fila.length) {
    const [x, z] = fila.shift();
    [[PASSO, 0], [-PASSO, 0], [0, PASSO], [0, -PASSO]].forEach(([dx, dz]) => {
      const nx = x + dx, nz = z + dz, k = idx(nx, nz);
      if (k < 0 || visit[k]) return;
      if (!livre(nx, nz)) return;
      visit[k] = 1;
      fila.push([nx, nz]);
    });
  }
  let falhas = 0;
  Object.keys(alvos).forEach((nomeAlvo) => {
    const a = alvos[nomeAlvo];
    // alcançável = alguma célula livre num raio de 1,2 m do ponto
    let ok = false;
    for (let dx = -1.2; dx <= 1.2 && !ok; dx += PASSO) {
      for (let dz = -1.2; dz <= 1.2 && !ok; dz += PASSO) {
        const k = idx(a.x + dx, a.z + dz);
        if (k >= 0 && visit[k]) ok = true;
      }
    }
    console.log((ok ? "✓" : "✗ INALCANÇÁVEL") + " " + nome + ": " + nomeAlvo +
      " (" + a.x.toFixed(1) + ", " + a.z.toFixed(1) + ")");
    if (!ok) { falhas++; process.exitCode = 1; }
  });
  return falhas;
}

// ---- RUA ----
const rua = ctx.TOGA.cidade3d.construir(new ctx.THREE.Scene());
const PR = rua.pontos;
analisar("RUA", rua, PR.spawnRua,
  { portaForum: PR.portaForum, delegada: PR.delegada, oitiva: PR.oitiva,
    investigacao: PR.investigacao, salaProvas: PR.salaProvas, cafeDelegacia: PR.cafeDelegacia,
    kitLacres: PR.kitLacres, professora: PR.professora, cantinhoLeitura: PR.cantinhoLeitura,
    amarelinha: PR.amarelinha, horta: PR.horta, merenda: PR.merenda,
    bebedouroEscola: PR.bebedouroEscola, muralDesenhos: PR.muralDesenhos, carroJuiz: PR.carroJuiz },
  { x1: 180, z1: -16, x2: 220, z2: 32 });

// ---- ESMEC ----
const esmec = ctx.TOGA.esmec3d.construir(new ctx.THREE.Scene());
const PE = esmec.pontos;
analisar("ESMEC", esmec, PE.spawnEsmec,
  { entrada: PE.entrada, recepcao: PE.recepcao, memorial: PE.memorial, galeria: PE.galeria,
    jardim: PE.jardim, biblioteca: PE.biblioteca, laboratorio: PE.laboratorio,
    salaAula: PE.salaAula, quadroAula: PE.quadroAula, oficina: PE.oficina,
    mediacao: PE.mediacao, coordenacao: PE.coordenacao, muralCursos: PE.muralCursos,
    credenciamento: PE.credenciamento, coffee: PE.coffee, livroVisitas: PE.livroVisitas,
    assentoPalestra: PE.assentoPalestra, palestrante: PE.palestrante, pulpito: PE.pulpito,
    auditorio: PE.auditorio, vaga: PE.vaga },
  { x1: 376, z1: -8, x2: 424, z2: 40 });
