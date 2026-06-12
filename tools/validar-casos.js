/* ============================================================
   TOGA — tools/validar-casos.js : VALIDADOR DOS CASOS
   ------------------------------------------------------------
   Roda FORA do navegador (Node.js) e confere a integridade
   estrutural de cada caso da pauta:

   - toda cena tem falas e (decisao OU fim);
   - toda "proxima" aponta para uma cena que existe
     (inclusive os ramos-função, testados com flags simuladas);
   - todo "requerFoco" cita um foco declarado no caso;
   - todo personagem citado nas falas existe;
   - todo assento usado existe na sala (cena.js).

   Uso:  node tools/validar-casos.js
   É o "revisor do gabinete": não muda nada, só aponta.
   ============================================================ */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const RAIZ = path.join(__dirname, "..");
const ASSENTOS = ["centro", "esq1", "esq2", "esq3", "dir1", "dir2", "dir3"];

// Simula o ambiente do navegador só o bastante para os casos rodarem.
const sandbox = { window: {}, TOGA: { casos: [] } };
sandbox.window.TOGA = sandbox.TOGA;
vm.createContext(sandbox);

// Carrega os casos na MESMA ordem do index.html (a ordem da pauta).
const html = fs.readFileSync(path.join(RAIZ, "index.html"), "utf8");
const scripts = [...html.matchAll(/<script src="(js\/casos\/[^"]+)"><\/script>/g)].map(m => m[1]);
for (const s of scripts) {
  vm.runInContext(fs.readFileSync(path.join(RAIZ, s), "utf8"), sandbox, { filename: s });
}
// ... e as pautas (dias de trabalho) + despachos de gabinete.
try {
  vm.runInContext(fs.readFileSync(path.join(RAIZ, "js/pautas.js"), "utf8"), sandbox, { filename: "js/pautas.js" });
} catch (e) { /* sem pautas.js: segue só com os casos */ }
try {
  vm.runInContext(fs.readFileSync(path.join(RAIZ, "js/despachos.js"), "utf8"), sandbox, { filename: "js/despachos.js" });
} catch (e) { /* sem despachos.js: segue */ }
// ... e os interlúdios/manchetes (main.js) + lembranças, para conferir se as
// flags de cada caso ECOAM em alguma consequência tangível (diretriz do projeto).
sandbox.document = { addEventListener: function () {} };  // main.js só registra o DOMContentLoaded
try {
  vm.runInContext(fs.readFileSync(path.join(RAIZ, "js/lembrancas.js"), "utf8"), sandbox, { filename: "js/lembrancas.js" });
} catch (e) { /* sem lembrancas.js: a checagem de eco fica parcial */ }
try {
  vm.runInContext(fs.readFileSync(path.join(RAIZ, "js/main.js"), "utf8"), sandbox, { filename: "js/main.js" });
} catch (e) { /* sem main.js: a checagem de eco fica muda */ }

/* Fontes onde uma flag pode "ecoar" como consequência visível:
   condições de interlúdios, manchetes e lembranças do gabinete. */
const FONTES_ECO = []
  .concat((sandbox.TOGA.interludios || []).map(i => String(i.condicao)))
  .concat((sandbox.TOGA.manchetes || []).map(m => String(m.condicao)))
  .concat(((sandbox.TOGA.lembrancas && sandbox.TOGA.lembrancas.REGISTRO) || []).map(l => String(l.se)))
  .join("\n");

let erros = 0, avisos = 0;
const erro = m => { console.error("  ✗ " + m); erros++; };
const aviso = m => { console.warn("  ⚠ " + m); avisos++; };

for (const caso of sandbox.TOGA.casos) {
  console.log(`\n— Caso "${caso.id}" (${caso.titulo})`);

  for (const ch of ["id", "titulo", "area", "hora", "autos", "focos", "personagens", "inicio", "cenas"])
    if (!caso[ch]) erro(`campo obrigatório ausente: ${ch}`);

  const cenas = caso.cenas || {};
  const idsFocos = (caso.focos || []).map(f => f.id);
  const idsPers = (caso.personagens || []).map(p => p.id).concat(["narrador", "voce"]);

  for (const p of caso.personagens || [])
    if (!ASSENTOS.includes(p.assento)) erro(`personagem "${p.id}" em assento inexistente: "${p.assento}"`);

  if (caso.inicio && !cenas[caso.inicio]) erro(`cena de início "${caso.inicio}" não existe`);

  // Campos do arco emocional e das vidas tocadas (opcionais)
  const EMOCOES = ["neutro", "firme", "feliz", "triste", "choro", "raiva", "surpresa", "medo", "vergonha"];
  if (caso.arco) {
    if (caso.arco.antes && caso.arco.antes.emocao && !EMOCOES.includes(caso.arco.antes.emocao))
      erro(`arco.antes: emoção desconhecida "${caso.arco.antes.emocao}"`);
    (caso.arco.depois || []).forEach((ramo, i) => {
      if (typeof ramo.se !== "function") erro(`arco.depois[${i}]: falta a condição "se" (função)`);
      (ramo.falas || []).forEach(fl => {
        if (!idsPers.includes(fl.quem)) erro(`arco.depois[${i}]: fala de personagem desconhecido "${fl.quem}"`);
        if (fl.emocao && !EMOCOES.includes(fl.emocao)) erro(`arco.depois[${i}]: emoção desconhecida "${fl.emocao}"`);
      });
    });
  }
  for (const v of caso.vidasTocadas || []) {
    if (!v.texto) erro(`vidasTocadas: item sem texto`);
    if (typeof v.se !== "function" && typeof v.se !== "string") erro(`vidasTocadas: "se" deve ser função ou nome de flag`);
    if (v.tom && !["bom", "grave"].includes(v.tom)) erro(`vidasTocadas: tom inválido "${v.tom}"`);
  }

  // Diretriz do projeto: TODO caso precisa de desfechos positivos E negativos
  // visíveis — no arco emocional do corredor e no saldo humano do epílogo.
  const tons = lista => (lista || []).map(r => r.tom || "bom");
  if (!caso.arco || !(caso.arco.depois || []).length) {
    erro(`sem arco.depois — o caso precisa de reações emocionais no corredor (ramos de tom "bom" E "grave")`);
  } else {
    const t = tons(caso.arco.depois);
    if (!t.includes("bom")) erro(`arco.depois sem nenhum ramo de tom "bom" — falta o desfecho positivo visível`);
    if (!t.includes("grave")) erro(`arco.depois sem nenhum ramo de tom "grave" — falta o desfecho negativo visível`);
  }
  if (!(caso.vidasTocadas || []).length) {
    erro(`sem vidasTocadas — o caso precisa entrar no saldo humano do epílogo (tons "bom" E "grave")`);
  } else {
    const t = tons(caso.vidasTocadas);
    if (!t.includes("bom")) erro(`vidasTocadas sem item de tom "bom"`);
    if (!t.includes("grave")) erro(`vidasTocadas sem item de tom "grave"`);
  }

  // Diretriz do projeto: consequências TANGÍVEIS — alguma flag deste caso
  // deve ecoar em interlúdio, manchete ou lembrança do gabinete.
  const flagsDoCaso = new Set();
  const coletarSetFlags = o => { for (const k of Object.keys(o || {})) flagsDoCaso.add(k); };
  for (const c of Object.values(cenas)) {
    for (const op of (c.decisao && c.decisao.opcoes) || []) coletarSetFlags(op.setFlags);
    if (c.fim) coletarSetFlags(c.fim.setFlags);
  }
  if (flagsDoCaso.size && FONTES_ECO && ![...flagsDoCaso].some(fl => FONTES_ECO.includes(fl)))
    aviso(`nenhuma flag do caso ecoa em interlúdios, manchetes ou lembranças — a consequência tangível está faltando`);

  // Grifos declarados nos focos: a peça existe? O trecho está MESMO no texto?
  const pecasPorId = {};
  for (const p of (caso.autos && caso.autos.pecas) || []) pecasPorId[p.id] = p;
  for (const f of caso.focos || []) {
    for (const g of f.grifos || []) {
      const peca = pecasPorId[g.peca];
      if (!peca) { erro(`foco "${f.id}": grifo aponta peça inexistente "${g.peca}"`); continue; }
      if (!g.trecho || peca.texto.indexOf(g.trecho) < 0)
        erro(`foco "${f.id}": trecho do grifo não encontrado na peça "${g.peca}": "${(g.trecho || "").slice(0, 50)}..."`);
    }
  }

  // Flags simuladas: testa os ramos-função com false e true.
  const flagsFalsas = new Proxy({}, { get: () => false });
  const flagsVerdadeiras = new Proxy({}, { get: () => true });

  const verificarEvento = (origem, evento) => {
    if (evento == null) return;
    const m = /^(prisao|soltura):(.+)$/.exec(evento);
    if (!m) return erro(`cena "${origem}": evento inválido "${evento}" (use "prisao:<id>" ou "soltura:<id>")`);
    if (!idsPers.includes(m[2])) erro(`cena "${origem}": evento aponta personagem inexistente "${m[2]}"`);
  };

  const verificarDestino = (origem, proxima) => {
    if (proxima == null) return erro(`cena "${origem}": opção sem "proxima"`);
    const destinos = typeof proxima === "function"
      ? [proxima(flagsFalsas), proxima(flagsVerdadeiras)]
      : [proxima];
    for (const d of destinos)
      if (!cenas[d]) erro(`cena "${origem}": destino "${d}" não existe`);
  };

  for (const [id, c] of Object.entries(cenas)) {
    if (!c.decisao && !c.fim) erro(`cena "${id}" não tem nem decisao nem fim (beco sem saída)`);
    for (const f of c.falas || [])
      if (!idsPers.includes(f.quem)) erro(`cena "${id}": fala de personagem desconhecido "${f.quem}"`);
    if (c.decisao) {
      if (!c.decisao.opcoes || !c.decisao.opcoes.length) erro(`cena "${id}": decisão sem opções`);
      (c.decisao.opcoes || []).forEach((op, i) => {
        verificarDestino(id, op.proxima);
        verificarEvento(id, op.evento);
        if (op.requerFoco && !idsFocos.includes(op.requerFoco))
          erro(`cena "${id}" opção ${i + 1}: requerFoco "${op.requerFoco}" não está em focos`);
        for (const f of op.reacoes || [])
          if (!idsPers.includes(f.quem)) erro(`cena "${id}" opção ${i + 1}: reação de desconhecido "${f.quem}"`);
        if (!op.feedback) aviso(`cena "${id}" opção ${i + 1} ("${op.rotulo}"): sem feedback (Modo Estudo fica mudo)`);
      });
    }
    if (c.fim && !c.fim.selo) erro(`cena "${id}": fim sem selo`);
    if (c.fim) verificarEvento(id, c.fim.evento);
  }

  // Cenas órfãs: ninguém leva até elas.
  const alcancaveis = new Set([caso.inicio]);
  let mudou = true;
  while (mudou) {
    mudou = false;
    for (const id of [...alcancaveis]) {
      const c = cenas[id];
      if (!c || !c.decisao) continue;
      for (const op of c.decisao.opcoes || []) {
        const destinos = typeof op.proxima === "function"
          ? [op.proxima(flagsFalsas), op.proxima(flagsVerdadeiras)]
          : [op.proxima];
        for (const d of destinos)
          if (cenas[d] && !alcancaveis.has(d)) { alcancaveis.add(d); mudou = true; }
      }
    }
  }
  for (const id of Object.keys(cenas))
    if (!alcancaveis.has(id)) aviso(`cena "${id}" parece órfã (nenhum caminho testado chega nela)`);

  // Previsibilidade: a MELHOR opção não pode morar sempre no 1º lugar.
  let decisoesComMelhor = 0, melhorNoTopo = 0;
  for (const c of Object.values(cenas)) {
    if (!c.decisao) continue;
    const acertos = (c.decisao.opcoes || []).map(o => (o.feedback || {}).acerto || "");
    let melhor = acertos.indexOf("otimo");
    if (melhor < 0) melhor = acertos.indexOf("bom");
    if (melhor < 0) continue;
    decisoesComMelhor++;
    if (melhor === 0) melhorNoTopo++;
  }
  if (decisoesComMelhor >= 2 && melhorNoTopo / decisoesComMelhor > 0.5)
    erro(`melhor opção está em 1º lugar em ${melhorNoTopo}/${decisoesComMelhor} decisões — embaralhe as posições (diretriz: a opção certa nunca pode ser previsível)`);

  if (!erros) console.log("  ✓ estrutura íntegra");
}

// ---------- Pautas: ids existem, sem repetição, horários crescentes ----------
const idsCasos = sandbox.TOGA.casos.map(c => c.id);
for (const pauta of sandbox.TOGA.pautas || []) {
  console.log(`\n— Pauta "${pauta.id}" (${pauta.titulo})`);
  const vistos = new Set();
  let minAnterior = -1;
  for (const id of pauta.casos || []) {
    if (!idsCasos.includes(id)) { erro(`caso "${id}" não existe`); continue; }
    if (vistos.has(id)) erro(`caso "${id}" repetido na pauta`);
    vistos.add(id);
    const caso = sandbox.TOGA.casos.find(c => c.id === id);
    const [h, m] = caso.hora.split(":").map(Number);
    const min = h * 60 + m;
    if (min <= minAnterior) erro(`horário de "${id}" (${caso.hora}) não é crescente na pauta`);
    minAnterior = min;
  }
  if (!erros) console.log("  ✓ pauta íntegra");
}

// ---------- Despachos de gabinete ----------
const idsDesp = new Set();
for (const d of sandbox.TOGA.despachos || []) {
  console.log(`\n— Despacho "${d.id}" (${d.titulo})`);
  if (idsDesp.has(d.id)) erro(`id repetido`);
  idsDesp.add(d.id);
  if (!d.titulo || !d.area || !d.texto) erro(`faltam campos obrigatórios (titulo/area/texto)`);
  if (!d.opcoes || d.opcoes.length < 2) erro(`menos de 2 opções`);
  let melhorNoTopoD = -1;
  (d.opcoes || []).forEach((op, i) => {
    if (!op.rotulo) erro(`opção ${i + 1} sem rótulo`);
    if (!op.feedback || !["otimo", "bom", "ruim", "grave"].includes(op.feedback.acerto))
      erro(`opção ${i + 1}: feedback/acerto inválido`);
    if (!op.resultado || !op.resultado.titulo || !op.resultado.texto)
      erro(`opção ${i + 1}: falta o "resultado" (a consequência)`);
    if (op.feedback && op.feedback.acerto === "otimo" && melhorNoTopoD < 0) melhorNoTopoD = i;
  });
  if (melhorNoTopoD === 0) erro(`a melhor opção está em 1º lugar — embaralhe (diretriz: a opção certa nunca pode ser previsível)`);
  for (const v of d.vidasTocadas || []) {
    if (!v.texto) erro(`vidasTocadas sem texto`);
  }
  if (!erros) console.log("  ✓ despacho íntegro");
}

console.log(`\n${sandbox.TOGA.casos.length} casos verificados — ${erros} erro(s), ${avisos} aviso(s).`);
process.exit(erros ? 1 : 0);
