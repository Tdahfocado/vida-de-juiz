/* F5: joga a protetiva até a preventiva fundamentada (3D, sem bot),
   fotografa a escolta e confere o preso na cela + persistência.  */
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
  await page.waitForFunction(() => window.TOGA && TOGA.debug3d);
  await page.evaluate(() => localStorage.setItem("toga.tutorial.v1", "1"));
  await page.evaluate(v => { TOGA.config.modo3d = v; try { localStorage.setItem("toga.modo3d", v ? "1" : "0"); } catch (e) {} }, true);
  await page.click("[data-pauta=dia1]");
  await page.waitForTimeout(1200);

  // abre autos, marca o foco da vizinha (requerFoco da preventiva ótima)
  await page.evaluate(() => TOGA.debug3d.interagir("autos"));
  await page.waitForTimeout(400);
  await page.evaluate(() => { TOGA.motor.setFoco("f_vizinha"); TOGA.motor.setFoco("f_laudo"); });
  await page.click("#btn-iniciar-audiencia");
  await page.waitForTimeout(2700);
  await page.evaluate(() => TOGA.debug3d.interagir("bancada"));
  await page.waitForTimeout(6000);

  // avança escolhendo sempre a opção cujo rótulo contém "preventiva fundamentando"
  // (ou a primeira ótima disponível), até a prisão acontecer
  let preso = false;
  for (let i = 0; i < 80 && !preso; i++) {
    const r = await page.evaluate(() => {
      const ops = [...document.querySelectorAll("#painel-decisao .opcao:not([disabled])")];
      if (ops.length) {
        const alvo = ops.find(o => /preventiva fundamentando/i.test(o.textContent)) ||
                     ops.find(o => /risco ATUAL/i.test(o.textContent));
        if (alvo) { alvo.click(); return "PRENDEU"; }
        ops[0].click(); return "decidiu";
      }
      const btn = document.querySelector("#painel-decisao .btn");
      if (btn) { btn.click(); return "prosseguiu"; }
      const cf = document.getElementById("caixa-fala");
      if (cf) cf.click();
      return "fala";
    });
    if (r === "PRENDEU") preso = true;
    await page.waitForTimeout(420);
  }
  console.log("opção de preventiva clicada:", preso ? "✓" : "✗");

  // escolta em andamento: screenshots
  await page.waitForTimeout(2500);
  await page.addStyleTag({ content: ".tela,.hud,#cortina{display:none!important}" });
  await page.screenshot({ path: "f5-algemas.png" });
  await page.waitForTimeout(7000);
  // câmera na cela para ver o preso
  await page.evaluate(() => {
    const cam = TOGA.nucleo3d.camera;
    cam.position.set(13.7, 1.7, 0.6);
    cam.lookAt(14.3, 1.0, -5.0);
  });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: "f5-cela-ocupada.png" });
  const naCela = await page.evaluate(() => TOGA.prisao3d.ocupada() && TOGA.prisao3d.nomesPresos());
  console.log("cela ocupada:", JSON.stringify(naCela));

  // persistência: recarrega e confere a sincronização por flags
  await page.reload();
  await page.waitForFunction(() => window.TOGA && TOGA.ui);
  await page.evaluate(() => localStorage.setItem("toga.tutorial.v1", "1"));
  await page.click("[data-pauta=dia1]");
  await page.waitForTimeout(1500);
  const aposReload = await page.evaluate(() => TOGA.prisao3d.ocupada() && TOGA.prisao3d.nomesPresos());
  console.log("cela após reload (sincronizarCela):", JSON.stringify(aposReload));

  await browser.close();
})();
