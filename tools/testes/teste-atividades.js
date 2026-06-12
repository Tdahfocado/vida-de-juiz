/* A comarca além do fórum: desbloqueio por conquistas, a rua
   (delegacia + escola), a viagem de carro até a ESMEC (piloto
   automático cumprindo as regras) e a aula — de ponta a ponta
   no 3D, mais o acesso pelo epílogo no modo clássico.        */
const { chromium } = require("playwright-core");
const URL = "file://" + require("path").resolve(__dirname, "../../index.html");
const ARGS = ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--allow-file-access-from-files"];

function ok(rotulo, cond) {
  console.log((cond ? "✓" : "✗") + " " + rotulo);
  if (!cond) process.exitCode = 1;
}

async function cliqueVisita(page) {
  // atravessa o painel da visita clicando sempre na opção ÓTIMA
  // quando houver decisão (a 2ª ou 3ª — nunca a 1ª) e em seguir
  const abriu = await page.evaluate(() => !!document.querySelector(".painel-visita"));
  if (!abriu) return false;
  for (let i = 0; i < 30; i++) {
    const fim = await page.evaluate(() => !document.querySelector(".painel-visita"));
    if (fim) return true;
    const clicou = await page.evaluate(() => {
      const seguir = document.querySelector(".btn-seguir-visita");
      if (seguir) { seguir.click(); return "seguir"; }
      const ops = [...document.querySelectorAll(".opcao-visita")];
      const otima = ops.find(o => o.dataset.tom === "otimo");
      if (ops.length) { (otima || ops[ops.length - 1]).click(); return "opcao"; }
      return null;
    });
    if (!clicou) await page.waitForTimeout(300);
    await page.waitForTimeout(120);
  }
  return false;
}

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true, args: ARGS });

  /* ================= 3D: o passeio completo ================= */
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const erros = [];
  page.on("pageerror", e => erros.push(e.message));
  await page.goto(URL);
  await page.waitForFunction(() => window.TOGA && TOGA.ui && TOGA.atividades);
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem("toga.tutorial.v1", "1");
    // 24 conquistas de carreira simuladas: destrava as três atividades
    const falsas = {};
    for (let i = 0; i < 24; i++) falsas["simulada" + i] = true;
    localStorage.setItem("toga.conquistas.v1", JSON.stringify(falsas));
  });
  await page.reload();
  await page.waitForFunction(() => window.TOGA && TOGA.ui && TOGA.atividades);
  await page.evaluate(() => { TOGA.config.modo3d = true; localStorage.setItem("toga.modo3d", "1"); });

  const resumo = await page.evaluate(() => TOGA.atividades.resumo());
  ok("24 conquistas destravam as 3 atividades", resumo.every(a => a.destravada));

  // dia carregado com a pauta JÁ encerrada (a cidade abre no fim do dia)
  await page.evaluate(() => {
    TOGA.motor.novoJogo("dia4");
    TOGA.motor.estado.casoAtual = 1;
    TOGA.motor.estado.concluidos.push({ id: "feminicidio", selo: "otimo", titulo: "x" });
    // os interlúdios do dia já foram lidos (a cidade abre depois deles)
    TOGA.motor.interludiosPendentes().forEach(i =>
      TOGA.motor.estado.flags["_visto_" + i.id] = true);
    TOGA.motor.salvar();
    TOGA.config.qualidade3d = "baixa";      // viagem em piloto automático
    TOGA.config._turboViagem = 7;           // ... acelerada para o teste
    TOGA.cena3d.entrarMundo("gabinete");
  });
  await page.waitForTimeout(1500);

  // sair para a rua
  const saiu = await page.evaluate(() => TOGA.interacao3d.disparar("cidade"));
  await page.waitForTimeout(600);
  const naRua = await page.evaluate(() => TOGA.cena3d.localAtivo);
  ok("porta do fórum leva à rua", saiu && naRua === "rua");

  // a delegacia
  await page.evaluate(() => TOGA.interacao3d.disparar("delegacia"));
  await page.waitForTimeout(400);
  ok("painel da visita à delegacia abre", await page.evaluate(() => !!document.querySelector(".painel-visita")));
  ok("visita à delegacia concluída", await cliqueVisita(page));
  const c1 = await page.evaluate(() => ({
    conquista: TOGA.conquistas.tem("pontesNaoMuros"),
    concluida: TOGA.atividades.concluida("delegacia"),
    flag: !!TOGA.motor.estado.flags.visitaDelegaciaExemplar
  }));
  ok("conquista + flag exemplar da delegacia", c1.conquista && c1.concluida && c1.flag);

  // a escola
  await page.evaluate(() => TOGA.interacao3d.disparar("escola"));
  await page.waitForTimeout(400);
  ok("visita à escola concluída", await cliqueVisita(page));
  ok("conquista da escola", await page.evaluate(() => TOGA.conquistas.tem("sementeCidadania")));

  // a viagem até a ESMEC (autopilot + turbo)
  await page.evaluate(() => TOGA.interacao3d.disparar("carroJuiz"));
  await page.waitForFunction(() => TOGA.cena3d.localAtivo === "esmec", null, { timeout: 120000 });
  const v = await page.evaluate(() => ({
    limpa: TOGA.conquistas.tem("cidadaoAoVolante"),
    flag: !!TOGA.motor.estado.flags.dirigiuExemplar
  }));
  ok("viagem em piloto automático chega sem infrações", v.limpa && v.flag);

  // a aula na ESMEC
  await page.evaluate(() => TOGA.interacao3d.disparar("coordenadora"));
  await page.waitForTimeout(400);
  ok("aula na ESMEC concluída", await cliqueVisita(page));
  const e1 = await page.evaluate(() => ({
    conquista: TOGA.conquistas.tem("professorMagistratura"),
    lembranca: TOGA.lembrancas.ativas(TOGA.motor.estado.flags).some(l => l.id === "fotoTurmaEsmec")
  }));
  ok("conquista da ESMEC + lembrança da turma", e1.conquista && e1.lembranca);

  // a volta
  await page.evaluate(() => TOGA.interacao3d.disparar("carroVolta"));
  await page.waitForTimeout(600);
  ok("volta ao fórum", await page.evaluate(() => TOGA.cena3d.localAtivo === "forum"));

  if (erros.length) { console.log("ERROS 3D:", erros.slice(0, 6).join(" | ")); process.exitCode = 1; }
  await page.close();

  /* ================= 2D: o acesso pelo epílogo ================= */
  const p2 = await browser.newPage();
  const erros2 = [];
  p2.on("pageerror", e => erros2.push(e.message));
  await p2.goto(URL);
  await p2.waitForFunction(() => window.TOGA && TOGA.ui && TOGA.atividades);
  await p2.evaluate(() => {
    localStorage.clear();
    localStorage.setItem("toga.tutorial.v1", "1");
    localStorage.setItem("toga.modo3d", "0");      // modo clássico
    const falsas = {};
    for (let i = 0; i < 15; i++) falsas["simulada" + i] = true;
    localStorage.setItem("toga.conquistas.v1", JSON.stringify(falsas));
  });
  await p2.reload();
  await p2.waitForFunction(() => window.TOGA && TOGA.ui && TOGA.atividades);
  await p2.evaluate(() => {
    TOGA.motor.novoJogo("dia1");
    TOGA.motor.estado.casoAtual = 6;
    ["protetiva", "guarda", "vizinhos", "thor", "gatos", "juri"].forEach(id =>
      TOGA.motor.estado.concluidos.push({ id: id, selo: "bom", titulo: "x" }));
    TOGA.motor.interludiosPendentes().forEach(i =>
      TOGA.motor.estado.flags["_visto_" + i.id] = true);
    TOGA.motor.salvar();
    TOGA.ui.mostrarEpilogo();
  });
  await p2.waitForTimeout(500);
  const botoes = await p2.evaluate(() =>
    [...document.querySelectorAll("#atividades-epilogo .btn")].map(b => b.textContent));
  ok("epílogo 2D lista as destravadas (15 → delegacia e escola)", botoes.length === 2);
  await p2.evaluate(() => document.querySelector("#atividades-epilogo .btn").click());
  await p2.waitForTimeout(300);
  ok("visita 2D abre pelo epílogo", await p2.evaluate(() => !!document.querySelector(".painel-visita")));
  ok("visita 2D concluída", await cliqueVisita(p2));
  ok("conquista no 2D", await p2.evaluate(() => TOGA.conquistas.tem("pontesNaoMuros")));

  if (erros2.length) { console.log("ERROS 2D:", erros2.slice(0, 6).join(" | ")); process.exitCode = 1; }
  await p2.close();
  await browser.close();
})();
