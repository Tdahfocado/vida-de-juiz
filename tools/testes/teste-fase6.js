/* Fase 6: navegação por teclado, ARIA, alto contraste, narrador. */
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

  // alto contraste persiste
  await page.click("#chave-contraste");
  const hc = await page.evaluate(() => document.body.classList.contains("alto-contraste"));
  await page.reload();
  await page.waitForFunction(() => window.TOGA && TOGA.ui);
  await page.evaluate(() => localStorage.setItem("toga.tutorial.v1", "1"));
  const hcReload = await page.evaluate(() => document.body.classList.contains("alto-contraste"));
  console.log("alto contraste liga e persiste:", hc && hcReload ? "✓" : "✗");
  await page.click("#chave-contraste"); // desliga para não poluir o resto

  // narrador: suporte + chave
  const nar = await page.evaluate(() => ({
    suportado: TOGA.narrador.suportado,
    desabilitada: document.getElementById("chave-narracao").disabled
  }));
  console.log("narrador: suportado =", nar.suportado, "| chave coerente:",
    nar.suportado === !nar.desabilitada ? "✓" : "✗");

  // audiência só no teclado: Enter avança, setas navegam, Enter decide
  await page.click("[data-pauta=dia1]");
  await page.evaluate(() => TOGA.ui.abrirAutos());
  await page.click("#btn-iniciar-audiencia");
  await page.waitForTimeout(2600); // cortina
  for (let i = 0; i < 18; i++) {
    const op = await page.evaluate(() => document.querySelectorAll("#painel-decisao .opcao:not([disabled])").length);
    if (op) break;
    await page.keyboard.press("Enter");
    await page.waitForTimeout(250);
  }
  const focoNaOpcao = await page.evaluate(() =>
    document.activeElement && document.activeElement.classList.contains("opcao"));
  console.log("primeira opção recebe foco:", focoNaOpcao ? "✓" : "✗");
  await page.keyboard.press("ArrowDown");
  const segundaFocada = await page.evaluate(() => {
    const ops = [...document.querySelectorAll("#painel-decisao .opcao:not([disabled])")];
    return ops.indexOf(document.activeElement) === 1;
  });
  console.log("seta ↓ move o foco:", segundaFocada ? "✓" : "✗");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(900);
  const decidiu = await page.evaluate(() => TOGA.motor.estado.historico.length >= 1);
  console.log("Enter decide:", decidiu ? "✓" : "✗");

  // ARIA
  const aria = await page.evaluate(() => ({
    meter: document.querySelectorAll('.barra-eixo[role="meter"]').length,
    valuenow: document.querySelector('.barra-eixo[role="meter"]').getAttribute("aria-valuenow"),
    live: document.getElementById("texto-fala").getAttribute("aria-live")
  }));
  console.log("ARIA: meters =", aria.meter, "| aria-valuenow =", aria.valuenow, "| texto-fala live =", aria.live);

  // reduced-motion: typewriter instantâneo
  const ctx2 = await browser.newContext({ reducedMotion: "reduce" });
  const p2 = await ctx2.newPage();
  p2.on("pageerror", e => console.log("ERRO RM:", e.message));
  await p2.goto(URL);
  await p2.waitForFunction(() => window.TOGA && TOGA.ui);
  await p2.click("[data-pauta=dia1]");
  await p2.evaluate(() => TOGA.ui.abrirAutos());
  await p2.click("#btn-iniciar-audiencia");   // sem cortina sob reduced-motion
  await p2.waitForTimeout(400);
  const instantaneo = await p2.evaluate(() => {
    const el = document.getElementById("texto-fala");
    return el.textContent.length > 30;        // texto inteiro, sem digitação
  });
  console.log("reduced-motion: sem cortina + texto instantâneo:", instantaneo ? "✓" : "✗");

  await browser.close();
})();
