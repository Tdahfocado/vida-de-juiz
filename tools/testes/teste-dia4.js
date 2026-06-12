/* Dia 4 — Plenário do feminicídio: os 3 padrões de condução no
   motor (ótimo → condenação limpa; vícios → condenação com
   ressalvas; omissão → absolvição contaminada), os ecos
   (interlúdios, manchetes, lembrança, conquista) e o dia
   completo via bot em 2D e 3D (palco do júri).               */
const { chromium } = require("playwright-core");
const URL = "file://" + require("path").resolve(__dirname, "../../index.html");
const ARGS = ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--allow-file-access-from-files"];

/* Joga o caso direto no motor escolhendo pelo "acerto" desejado */
async function padraoMotor(browser, alvo) {
  const page = await browser.newPage();
  const erros = [];
  page.on("pageerror", e => erros.push(e.message));
  await page.goto(URL);
  await page.waitForFunction(() => window.TOGA && TOGA.motor && TOGA.casos);
  const r = await page.evaluate((alvo) => {
    localStorage.clear();
    const M = TOGA.motor;
    M.novoJogo("dia4");
    M.iniciarCaso();
    const caso = M.casoDaVez();
    let id = caso.inicio, passos = 0, fim = null;
    while (passos++ < 30) {
      const c = M.cena(id);
      if (!c) return { erro: "cena inexistente: " + id };
      if (c.fim) { fim = c.fim; M.concluirCaso(c.fim); break; }
      if (!c.decisao) return { erro: "cena sem decisão e sem fim: " + id };
      const ops = c.decisao.opcoes;
      const ordem = alvo === "grave"
        ? ["grave", "ruim", "bom", "otimo"]
        : alvo === "vicios"
          ? (id === "p1" ? ["ruim"] : ["otimo", "bom"])  // um vício consignado, resto limpo
          : ["otimo", "bom", "neutro"];
      let idx = -1;
      for (const a of ordem) {
        idx = ops.findIndex(o => o.feedback && o.feedback.acerto === a);
        if (idx >= 0) break;
      }
      if (idx < 0) idx = 0;
      const res = M.decidir(id, idx);
      if (!res.proxima) return { erro: "decisão sem próxima em " + id };
      id = res.proxima;
    }
    if (!fim) return { erro: "não chegou a um fim em 30 passos" };
    const f = M.estado.flags;
    const manchetes = (TOGA.manchetes || []).filter(m =>
      (m.pauta === "dia4") && m.condicao(f, M.estado.reputacao)).length;
    const interludios = M.interludiosPendentes().map(i => i.id);
    const lembranca = TOGA.lembrancas
      ? TOGA.lembrancas.ativas(f).some(l => l.id === "fotoIracema") : false;
    return {
      selo: fim.selo, titulo: fim.titulo,
      flags: {
        condenado: !!f.feminicidioCondenado,
        vitimaProtegida: !!f.vitimaProtegidaPlenario,
        vicios: !!f.condenacaoComVicios,
        absolvicao: !!f.absolvicaoContaminada,
        mancha: !!f.manchaGrave
      },
      manchetes, interludios, lembranca
    };
  }, alvo);
  await page.close();
  if (r.erro) { console.log(`padrão ${alvo}: ✗ ${r.erro}`); process.exitCode = 1; return; }
  console.log(`padrão ${alvo}: ${r.selo} — "${r.titulo}"`);
  console.log(`   flags: ${JSON.stringify(r.flags)}`);
  console.log(`   manchetes dia4: ${r.manchetes} | interlúdios: ${r.interludios.join(", ") || "—"} | lembrança foto: ${r.lembranca}`);
  const ok =
    (alvo === "otimo" && r.selo === "otimo" && r.flags.condenado && r.flags.vitimaProtegida && r.lembranca && r.interludios.includes("int_juri_foto")) ||
    (alvo === "vicios" && r.selo === "bom" && r.flags.condenado && r.flags.vicios) ||
    (alvo === "grave" && r.selo === "grave" && r.flags.absolvicao && r.flags.mancha && r.interludios.includes("int_juri_rede"));
  console.log(`   coerência do desfecho: ${ok ? "✓" : "✗"}`);
  if (!ok) process.exitCode = 1;
  if (erros.length) { console.log("   ERROS:", erros.slice(0, 4).join(" | ")); process.exitCode = 1; }
}

/* Dia inteiro via bot (UI real; em 3D monta o palco do júri) */
async function botDia4(browser, modo3d) {
  const page = await browser.newPage();
  const erros = [];
  page.on("pageerror", e => erros.push(e.message));
  await page.goto(URL);
  await page.waitForFunction(() => window.TOGA && TOGA.ui && TOGA.debug3d);
  await page.evaluate(() => { try { localStorage.setItem("toga.tutorial.v1", "1"); } catch (e) {} });
  if (modo3d) { await page.click("#chave-3d"); await page.waitForTimeout(300); }
  await page.evaluate(() => TOGA.debug3d.botDia(0, "dia4"));
  try {
    await page.waitForFunction(
      () => (document.querySelector(".tela.ativa") || {}).id === "tela-epilogo",
      null, { timeout: 300000 });
    const r = await page.evaluate(() => ({
      veredito: document.getElementById("veredito-selo").textContent,
      casos: TOGA.motor.estado.concluidos.map(c => c.id + ":" + c.selo).join(", ")
    }));
    console.log(`bot dia4 ${modo3d ? "3D" : "2D"} ✓ ${r.veredito} — ${r.casos}`);
  } catch (e) {
    const tela = await page.evaluate(() => (document.querySelector(".tela.ativa") || {}).id).catch(() => "?");
    console.log(`bot dia4 ${modo3d ? "3D" : "2D"} ✗ TRAVOU em ${tela}`);
    process.exitCode = 1;
  }
  if (erros.length) { console.log("   ERROS:", erros.slice(0, 4).join(" | ")); process.exitCode = 1; }
  await page.close();
}

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true, args: ARGS });
  await padraoMotor(browser, "otimo");
  await padraoMotor(browser, "vicios");
  await padraoMotor(browser, "grave");
  await botDia4(browser, false);
  await botDia4(browser, true);
  await browser.close();
})();
