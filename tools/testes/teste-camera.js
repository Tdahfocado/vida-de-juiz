/* Diagnóstico do diretor de câmera: durante falas de NPCs,
   projeta a cabeça do orador em coordenadas de tela e confere
   se o enquadramento centraliza (NDC perto de 0,0).          */
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
  await page.waitForFunction(() => window.TOGA && TOGA.ui && TOGA.debug3d);
  await page.evaluate(() => localStorage.setItem("toga.tutorial.v1", "1"));
  await page.click("#chave-3d");
  await page.click("[data-pauta=dia1]");
  await page.waitForTimeout(800);
  await page.evaluate(() => TOGA.debug3d.interagir("autos"));
  await page.waitForTimeout(300);
  await page.click("#btn-iniciar-audiencia");
  await page.waitForTimeout(400);
  await page.evaluate(() => TOGA.debug3d.interagir("bancada"));
  await page.waitForTimeout(7000); // elenco termina de entrar e sentar

  // percorre algumas falas e mede o enquadramento de cada orador
  for (let i = 0; i < 10; i++) {
    await page.click("#caixa-fala");
    await page.waitForTimeout(1400); // câmera converge
    const m = await page.evaluate(() => {
      const quem = document.getElementById("quem-fala").textContent.trim();
      const caso = TOGA.casos[TOGA.motor.estado.casoAtual];
      // acha o orador atual comparando com o texto do balão
      const p = (caso.personagens || []).find(x => quem.indexOf(x.nome) === 0);
      if (!p) return { quem: quem, npc: false };
      // reconstrói a posição da cabeça via API de debug: usa a cena
      const cam = TOGA.nucleo3d.camera;
      let pos = null;
      TOGA.nucleo3d.scene.traverse(() => {});
      // cabeça via TOGA.cena3d não é exposta; estima pelo assento
      const a = TOGA.mundo3d.ASSENTOS3D[p.assento] || TOGA.mundo3d.ASSENTOS3D.centro;
      const v = new THREE.Vector3(a.x, 1.3, a.z);
      const ndc = v.clone().project(cam);
      return { quem: quem, npc: true, fov: cam.fov.toFixed(1),
               ndcX: ndc.x.toFixed(2), ndcY: ndc.y.toFixed(2),
               cam: cam.position.toArray().map(n => n.toFixed(1)).join(",") };
    });
    if (m.npc) console.log(`fala ${i}: ${m.quem} | fov=${m.fov} | NDC=(${m.ndcX}, ${m.ndcY}) | cam=(${m.cam})`);
    else console.log(`fala ${i}: ${m.quem} (narrador/você — plano geral)`);
    const decisao = await page.evaluate(() => document.querySelectorAll("#painel-decisao .opcao").length);
    if (decisao) { console.log("painel de decisão chegou — fim do diagnóstico"); break; }
  }
  await browser.close();
})();
