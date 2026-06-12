/* Fase 5: grifo livre persiste (reabrir + recarregar), grifo por foco,
   pauta-pasta e epílogo-jornal com virada de página.                  */
const { chromium } = require("playwright-core");
const URL = "file://" + require("path").resolve(__dirname, "../../index.html");

(async () => {
  const browser = await chromium.launch({
    channel: "chrome", headless: true,
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--allow-file-access-from-files"]
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  page.on("pageerror", e => console.log("ERRO:", e.message));

  await page.goto(URL);
  await page.waitForFunction(() => window.TOGA && TOGA.ui);
  await page.evaluate(() => localStorage.setItem("toga.tutorial.v1", "1"));
  await page.click("[data-pauta=dia1]");
  await page.screenshot({ path: "f5-pauta.png" });

  await page.evaluate(() => TOGA.ui.abrirAutos());
  await page.waitForTimeout(300);

  // grifo livre: simula a seleção via API do motor + re-render (a UI usa o mesmo caminho)
  await page.evaluate(() => {
    TOGA.motor.alternarGrifo("protetiva", "bo", "te encontro lá fora");
  });
  await page.evaluate(() => TOGA.ui.abrirAutos());   // reabre: o grifo deve reaparecer
  const grifoLivre = await page.evaluate(() =>
    document.querySelectorAll("#corpo-peca mark.grifo").length);
  console.log("grifo livre persiste ao reabrir:", grifoLivre === 1 ? "✓" : "✗ (" + grifoLivre + ")");

  // grifo por foco: marca f_filhos (peça "bo" aberta) → trecho acende
  await page.evaluate(() => {
    const botoes = document.querySelectorAll("#lista-focos .cartao-foco");
    botoes[3].click(); // f_filhos
  });
  const grifoFoco = await page.evaluate(() =>
    document.querySelectorAll("#corpo-peca mark.grifo-foco").length);
  console.log("grifo de foco acende na peça:", grifoFoco === 1 ? "✓" : "✗ (" + grifoFoco + ")");
  await page.screenshot({ path: "f5-autos-grifos.png" });

  // persistência via save: recarrega a página e continua
  await page.reload();
  await page.waitForFunction(() => window.TOGA && TOGA.ui);
  await page.evaluate(() => localStorage.setItem("toga.tutorial.v1", "1"));
  await page.click("[data-pauta=dia1]");
  await page.evaluate(() => TOGA.ui.abrirAutos());
  const aposReload = await page.evaluate(() =>
    document.querySelectorAll("#corpo-peca mark.grifo").length);
  console.log("grifo sobrevive ao reload + continuar:", aposReload === 1 ? "✓" : "✗ (" + aposReload + ")");

  // clicar no grifo remove
  await page.evaluate(() => document.querySelector("#corpo-peca mark.grifo").click());
  const aposRemover = await page.evaluate(() =>
    document.querySelectorAll("#corpo-peca mark.grifo").length);
  console.log("clicar no grifo remove:", aposRemover === 0 ? "✓" : "✗");

  // epílogo-jornal: joga o dia com o bot e confere capa + virada
  await page.evaluate(() => TOGA.debug3d.botDia(0));
  await page.waitForFunction(
    () => (document.querySelector(".tela.ativa") || {}).id === "tela-epilogo",
    null, { timeout: 240000 });
  await page.waitForTimeout(600);
  const jornal = await page.evaluate(() => ({
    capa: !!document.querySelector(".pagina-jornal.frente .nome-jornal"),
    manchetes: document.querySelectorAll(".colunas-jornal article").length + (document.querySelector(".manchete-principal") ? 1 : 0),
    ramos: document.querySelectorAll(".ramo-caso").length,
    passos: document.querySelectorAll(".ramo-caso .passo").length
  }));
  console.log("jornal: capa", jornal.capa ? "✓" : "✗",
    "| manchetes:", jornal.manchetes, "| ramos (casos):", jornal.ramos, "| passos (decisões):", jornal.passos);
  await page.screenshot({ path: "f5-jornal-capa.png" });
  await page.click(".pagina-jornal.frente .virar-pagina");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "f5-jornal-verso.png" });
  console.log("página virada (screenshot)");

  await browser.close();
})();
