/* Fase 3: emulação de celular — joystick anda, tap no aviso interage. */
const { chromium, devices } = require("playwright-core");
const URL = "file://" + require("path").resolve(__dirname, "../../index.html");

(async () => {
  const browser = await chromium.launch({
    channel: "chrome", headless: true,
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--allow-file-access-from-files"]
  });
  const ctx = await browser.newContext({ ...devices["Pixel 7"] });
  const page = await ctx.newPage();
  page.on("pageerror", e => console.log("ERRO:", e.message));

  await page.goto(URL);
  await page.waitForFunction(() => window.TOGA && TOGA.ui && TOGA.debug3d);
  await page.evaluate(() => { try { localStorage.setItem("toga.tutorial.v1", "1"); } catch (e) {} });
  await page.tap("#chave-3d");
  await page.tap("#btn-novo");
  await page.waitForTimeout(1500);

  const joy = await page.evaluate(() => {
    const j = document.getElementById("joystick-virtual");
    return j ? getComputedStyle(j).display : "ausente";
  });
  console.log("joystick visível no mundo:", joy === "block" ? "✓" : "✗ (" + joy + ")");

  // arrasta a alavanca para frente por ~1,2s e mede o deslocamento
  const antes = await page.evaluate(() => TOGA.controles3d.estado().pos);
  const r = await page.evaluate(() => {
    const b = document.getElementById("joystick-virtual").getBoundingClientRect();
    return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
  });
  await page.touchscreen.tap(r.x, r.y); // garante foco/gesto inicial
  // gesto contínuo: pointerdown + move para cima + segura
  await page.evaluate(async (c) => {
    const j = document.getElementById("joystick-virtual");
    function ev(tipo, x, y) {
      j.dispatchEvent(new PointerEvent(tipo, { pointerId: 7, clientX: x, clientY: y, bubbles: true }));
    }
    ev("pointerdown", c.x, c.y);
    ev("pointermove", c.x, c.y - 50);
    await new Promise(res => setTimeout(res, 1200));
    ev("pointerup", c.x, c.y - 50);
  }, r);
  const depois = await page.evaluate(() => TOGA.controles3d.estado().pos);
  const dist = Math.hypot(depois.x - antes.x, depois.z - antes.z);
  console.log("andou com o joystick:", dist > 0.5 ? `✓ (${dist.toFixed(2)} m)` : `✗ (${dist.toFixed(2)} m)`);

  // tap no aviso de interação (autos) — deve abrir a tela de autos
  await page.evaluate(() => TOGA.debug3d.teleporte({ x: -11.2, z: -6, angulo: Math.PI }));
  await page.waitForTimeout(600);
  const prompt = await page.evaluate(() => !document.getElementById("prompt-interacao").hidden);
  console.log("prompt visível perto dos autos:", prompt ? "✓" : "✗");
  if (prompt) {
    await page.tap("#prompt-interacao");
    await page.waitForTimeout(500);
    const tela = await page.evaluate(() => (document.querySelector(".tela.ativa") || {}).id);
    console.log("tap no aviso abriu:", tela === "tela-autos" ? "✓ tela-autos" : "✗ " + tela);
  }

  // fog mobile
  const fog = await page.evaluate(() => TOGA.nucleo3d.scene.fog.near);
  console.log("fog mobile (near=14):", fog === 14 ? "✓" : "✗ near=" + fog);

  await browser.close();
})();
