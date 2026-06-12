/* Ala leste: corredor estendido, Sala de Imprensa e Sala da OAB
   acessíveis (vãos com folga para o raio do jogador), saúde selada
   a leste, relógio 2 registrado, ESPACOS com 12 entradas.        */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const raiz = path.resolve(__dirname, "../..");
const ctx = {
  console, Math, JSON,
  window: {}, self: {}, document: {
    createElement: () => ({ getContext: () => null }),
    createElementNS: () => ({})
  }
};
ctx.window = ctx;
ctx.self = ctx;
vm.createContext(ctx);

vm.runInContext(fs.readFileSync(path.join(raiz, "js/vendor/three.min.js"), "utf8"), ctx);
ctx.THREE = ctx.THREE || ctx.window.THREE;
ctx.TOGA = {
  texturas3d: { matPlastico: cor => new ctx.THREE.MeshLambertMaterial({ color: cor }) },
  config: { qualidade3d: "baixa" }
};
vm.runInContext(fs.readFileSync(path.join(raiz, "js/3d/mundo.js"), "utf8"), ctx);

const scene = new ctx.THREE.Scene();
const info = ctx.TOGA.mundo3d.construir(scene);
const colisores = info.colisores;
console.log("colisores:", colisores.length, "| pontos novos:",
  ["imprensa", "oab", "extintor", "relogioParede2"].every(k => info.pontos[k]) ? "✓" : "✗");

const RAIO = 0.35;
function colide(x, z) {
  for (const c of colisores) {
    const dx = x - Math.max(c.minX, Math.min(x, c.maxX));
    const dz = z - Math.max(c.minZ, Math.min(z, c.maxZ));
    if (dx * dx + dz * dz < RAIO * RAIO) return true;
  }
  return false;
}
function caminhar(nome, x1, z1, x2, z2) {
  const passos = 200;
  for (let i = 0; i <= passos; i++) {
    const x = x1 + (x2 - x1) * i / passos, z = z1 + (z2 - z1) * i / passos;
    if (colide(x, z)) {
      console.log(nome + ": ✗ preso em (" + x.toFixed(2) + ", " + z.toFixed(2) + ")");
      return false;
    }
  }
  console.log(nome + ": ✓");
  return true;
}

caminhar("corredor leste (29→37.3, z=0)", 29, 0, 37.3, 0);
caminhar("entrar na Sala de Imprensa", 34, 0, 34, 4.4) &&
  caminhar("circular na imprensa", 34, 4.4, 34, 5.4);
caminhar("entrar na Sala da OAB", 34, 0, 34, -4.0) &&
  caminhar("circular na OAB", 34, -4.0, 34.4, -3.0);

// saúde precisa estar SELADA a leste (parede em x=30, z −8..−2)
let selada = false;
for (let i = 0; i <= 100; i++) {
  if (colide(29 + 2 * i / 100, -5)) { selada = true; break; }
}
console.log("saúde selada a leste:", selada ? "✓" : "✗");

// porta do júri continua livre (regressão)
caminhar("porta do Salão do Júri", 24, 1.4, 24, 7.0);
