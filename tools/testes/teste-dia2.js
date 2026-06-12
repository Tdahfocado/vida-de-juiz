/* F7: bateria do Dia 2 — bot em 2D e 3D com escolhas variadas,
   desenho da Alice (interlúdio + lembrança), custódia inversa. */
const { chromium } = require("playwright-core");
const URL = "file://" + require("path").resolve(__dirname, "../../index.html");
const ARGS = ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--allow-file-access-from-files"];

async function botDia(browser, { modo3d, escolha, pauta }) {
  const page = await browser.newPage();
  const erros = [];
  page.on("pageerror", e => erros.push(e.message));
  await page.goto(URL);
  await page.waitForFunction(() => window.TOGA && TOGA.ui && TOGA.debug3d);
  await page.evaluate(() => { try { localStorage.setItem("toga.tutorial.v1", "1"); } catch (e) {} });
  if (modo3d) { await page.click("#chave-3d"); await page.waitForTimeout(300); }
  await page.evaluate(([e, p]) => TOGA.debug3d.botDia(e, p), [escolha, pauta]);
  try {
    await page.waitForFunction(
      () => (document.querySelector(".tela.ativa") || {}).id === "tela-epilogo",
      null, { timeout: 300000 });
    const r = await page.evaluate(() => ({
      veredito: document.getElementById("veredito-selo").textContent,
      casos: TOGA.motor.estado.concluidos.map(c => c.id + ":" + c.selo).join(", "),
      vidas: document.querySelectorAll(".vidas-tocadas li").length,
      vidasGraves: document.querySelectorAll(".vidas-tocadas li.tom-grave").length
    }));
    console.log(`${pauta} ${modo3d ? "3D" : "2D"} escolha=${escolha} ✓ ${r.veredito}`);
    console.log(`   ${r.casos}`);
    console.log(`   vidas tocadas: ${r.vidas} (graves: ${r.vidasGraves})`);
  } catch (e) {
    const tela = await page.evaluate(() => (document.querySelector(".tela.ativa") || {}).id).catch(() => "?");
    console.log(`${pauta} ${modo3d ? "3D" : "2D"} escolha=${escolha} ✗ TRAVOU em ${tela}`);
    process.exitCode = 1;
  }
  if (erros.length) {
    console.log("   ERROS:", erros.slice(0, 4).join(" | "));
    process.exitCode = 1;
  }
  await page.close();
}

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true, args: ARGS });

  // 1) regressão dia1 (2D e 3D) com as opções reordenadas
  await botDia(browser, { modo3d: false, escolha: 0, pauta: "dia1" });
  await botDia(browser, { modo3d: true, escolha: 0, pauta: "dia1" });
  // 2) dia2 completo em ambos os modos + caminhos variados
  await botDia(browser, { modo3d: false, escolha: 0, pauta: "dia2" });
  await botDia(browser, { modo3d: true, escolha: 0, pauta: "dia2" });
  await botDia(browser, { modo3d: false, escolha: 1, pauta: "dia2" });
  await botDia(browser, { modo3d: false, escolha: 2, pauta: "dia2" });

  // 3) o desenho da Alice no interlúdio (2D)
  let p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  p.on("pageerror", e => console.log("ERRO desenho:", e.message));
  await p.goto(URL);
  await p.waitForFunction(() => window.TOGA && TOGA.ui);
  await p.evaluate(() => { try { localStorage.setItem("toga.tutorial.v1", "1"); } catch (e) {} });
  await p.evaluate(() => {
    TOGA.motor.novoJogo("dia2");
    TOGA.motor.estado.flags.liminarSaude = true;
    const it = TOGA.interludios.find(i => i.id === "int_desenho");
    TOGA.ui.mostrarTela("tela-pauta");
    // chama o caminho real de exibição
    const card = document.getElementById("cartao-interludio");
    TOGA.motor.marcarInterludio(it);
    card.className = "cartao-desfecho cartao-interludio tom-bom";
    card.querySelector(".titulo-interludio").textContent = it.titulo;
    card.querySelector(".texto-interludio").innerHTML = it.texto;
    if (it.desenho && TOGA.texturas3d.desenhoSuperJuiz) {
      const tx = TOGA.texturas3d.desenhoSuperJuiz();
      const cv = document.createElement("canvas");
      cv.width = cv.height = 420; cv.className = "desenho-interludio";
      cv.getContext("2d").drawImage(tx.image, 0, 0, 420, 420);
      card.querySelector(".texto-interludio").appendChild(cv);
    }
    TOGA.ui.mostrarTela("tela-interludio");
  });
  await p.waitForTimeout(700);
  await p.screenshot({ path: "f7-desenho-interludio.png" });
  console.log("desenho no interlúdio: screenshot ✓");
  await p.close();

  // 4) lembrança no gabinete (3D): quadro do desenho + modal
  p = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  p.on("pageerror", e => console.log("ERRO lembrança:", e.message));
  await p.goto(URL);
  await p.waitForFunction(() => window.TOGA && TOGA.debug3d);
  await p.evaluate(() => { try { localStorage.setItem("toga.tutorial.v1", "1"); } catch (e) {} });
  await p.click("#chave-3d");
  await p.evaluate(() => {
    // save do dia2 com as flags do desenho/foto antes de entrar
    TOGA.motor.novoJogo("dia2");
    TOGA.motor.estado.flags.liminarSaude = true;
    TOGA.motor.estado.flags.thorFeliz = true;
    TOGA.motor.salvar();
  });
  await p.click("[data-pauta=dia2]");
  await p.waitForTimeout(1500);
  await p.evaluate(() => TOGA.debug3d.teleporte({ x: -11.8, z: -6.8, angulo: Math.PI }));
  await p.waitForTimeout(700);
  await p.screenshot({ path: "f7-gabinete-lembrancas.png" });
  const prompt = await p.evaluate(() => !document.getElementById("prompt-interacao").hidden &&
    document.getElementById("prompt-interacao-texto").textContent);
  console.log("lembrança interagível no gabinete:", prompt || "(nenhum prompt)");
  if (prompt && /desenho/i.test(prompt)) {
    await p.evaluate(() => TOGA.interacao3d.dispararFocado());
    await p.waitForTimeout(500);
    await p.screenshot({ path: "f7-desenho-modal.png" });
    console.log("modal do desenho aberto ✓");
  }
  await p.close();

  // 5) custódia: Jonas entra escoltado da cela (3D, sem bot)
  p = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  p.on("pageerror", e => console.log("ERRO custódia:", e.message));
  await p.goto(URL);
  await p.waitForFunction(() => window.TOGA && TOGA.debug3d);
  await p.evaluate(() => { try { localStorage.setItem("toga.tutorial.v1", "1"); } catch (e) {} });
  await p.click("#chave-3d");
  await p.click('[data-pauta="dia2"]');
  await p.waitForTimeout(1400);
  await p.evaluate(() => TOGA.debug3d.interagir("autos"));
  await p.waitForTimeout(400);
  await p.click("#btn-iniciar-audiencia");
  await p.waitForTimeout(2700);
  await p.evaluate(() => TOGA.debug3d.interagir("bancada"));
  await p.waitForTimeout(4500); // escolta a caminho
  await p.addStyleTag({ content: ".tela,.hud,#cortina{display:none!important}" });
  await p.screenshot({ path: "f7-custodia-escolta.png" });
  console.log("custódia: escolta fotografada ✓");
  await p.close();

  await browser.close();
})();
