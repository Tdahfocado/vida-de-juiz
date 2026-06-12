/* Teste de regressão do TOGA: joga o dia inteiro com o botDia
   em 2D e em 3D, num Chrome headless, abrindo via file://.   */
const { chromium } = require("playwright-core");

const URL = "file://" + require("path").resolve(__dirname, "../../index.html");
const TIMEOUT_DIA_MS = 240000;

async function jogarDia(page, modo3d) {
  await page.goto(URL);
  await page.waitForFunction(() => window.TOGA && TOGA.ui && TOGA.debug3d);
  await page.evaluate(() => { try { localStorage.setItem("toga.tutorial.v1", "1"); } catch (e) {} });

  await page.evaluate(v => { TOGA.config.modo3d = v; try { localStorage.setItem("toga.modo3d", v ? "1" : "0"); } catch (e) {} }, modo3d);

  await page.evaluate(() => TOGA.debug3d.botDia(0));

  await page.waitForFunction(
    () => document.querySelector(".tela.ativa") &&
          document.querySelector(".tela.ativa").id === "tela-epilogo",
    null, { timeout: TIMEOUT_DIA_MS }
  );

  return await page.evaluate(() => ({
    veredito: document.getElementById("veredito-selo").textContent,
    manchetes: document.querySelectorAll(".colunas-jornal article").length +
               (document.querySelector(".manchete-principal") ? 1 : 0),
    concluidos: TOGA.motor.estado.concluidos.map(c => c.id + ":" + c.selo),
    reputacao: TOGA.motor.estado.reputacao
  }));
}

(async () => {
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--allow-file-access-from-files"]
  });
  const erros = [];
  for (const modo3d of [false, true]) {
    const page = await browser.newPage();
    page.on("pageerror", e => erros.push((modo3d ? "[3D] " : "[2D] ") + e.message));
    page.on("console", m => {
      if (m.type() !== "error") return;
      const url = (m.location() && m.location().url) || "";
      if (url.indexOf("assets/audio") >= 0) return;  // sons opcionais ausentes: esperado
      erros.push((modo3d ? "[3D] " : "[2D] ") + m.text() + " @ " + url);
    });
    try {
      const r = await jogarDia(page, modo3d);
      console.log((modo3d ? "3D" : "2D") + " — dia completo ✓");
      console.log("   veredito:", r.veredito, "| casos:", r.concluidos.join(", "));
      console.log("   reputação:", JSON.stringify(r.reputacao), "| manchetes:", r.manchetes);
    } catch (e) {
      console.log((modo3d ? "3D" : "2D") + " — FALHOU:", e.message.split("\n")[0]);
      const tela = await page.evaluate(() =>
        (document.querySelector(".tela.ativa") || {}).id).catch(() => "?");
      console.log("   tela ativa no momento da falha:", tela);
      process.exitCode = 1;
    }
    await page.close();
  }
  if (erros.length) {
    console.log("\nErros de página capturados:");
    erros.slice(0, 12).forEach(e => console.log("  ", e));
    process.exitCode = 1;
  } else {
    console.log("\nNenhum erro de JS na página.");
  }
  await browser.close();
})();
