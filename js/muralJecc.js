/* ============================================================
   TOGA — muralJecc.js : O MURAL DE FOTOS DA EQUIPE (galeria DOM)
   ------------------------------------------------------------
   As fotos REAIS da equipe do Juizado Especial moram em /jecc.
   No 3D não dá para usá-las como textura (o Chrome "contamina"
   a tela WebGL com arquivos locais — ver texturas3d.js), mas
   um <img> no DOM funciona até abrindo por duplo clique
   (file://). Então o mural do salão abre ESTA galeria: cortiça,
   polaroids com tachinha, clique para ampliar.

   As legendas são GENÉRICAS e ficam aqui em cima, fáceis de
   editar/renomear depois — basta trocar o texto de `legenda`.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.muralJecc = (function () {

  const PASTA = "jecc/";

  // arquivo + legenda (genérica, editável). A ordem é a do mural.
  const FOTOS = [
    { arq: "WhatsApp Image 2026-06-20 at 11.32.07.jpeg",     legenda: "A equipe do Juizado Especial reunida" },
    { arq: "WhatsApp Image 2026-06-20 at 11.32.07 (1).jpeg", legenda: "Comemorando o 4º título consecutivo" },
    { arq: "WhatsApp Image 2026-06-20 at 11.32.08.jpeg",     legenda: "Certificação Excelência — a mais alta" },
    { arq: "WhatsApp Image 2026-06-20 at 11.32.08 (1).jpeg", legenda: "Prêmio + Gestão do TJCE" },
    { arq: "WhatsApp Image 2026-06-20 at 11.32.08 (2).jpeg", legenda: "Cinco anos de trabalho intenso" },
    { arq: "WhatsApp Image 2026-06-20 at 11.32.08 (3).jpeg", legenda: "A unidade mais rápida do Ceará" },
    { arq: "WhatsApp Image 2026-06-20 at 11.32.08 (4).jpeg", legenda: "Da gestão à entrega: justiça que anda" },
    { arq: "WhatsApp Image 2026-06-20 at 11.32.08 (5).jpeg", legenda: "Equipe afinada, indicadores em dia" },
    { arq: "WhatsApp Image 2026-06-20 at 11.32.09.jpeg",     legenda: "Brinde ao quarto título" },
    { arq: "WhatsApp Image 2026-06-20 at 11.32.09 (1).jpeg", legenda: "Sorrisos de quem fez por merecer" },
    { arq: "WhatsApp Image 2026-06-20 at 11.32.09 (2).jpeg", legenda: "O Juizado em festa" },
    { arq: "WhatsApp Image 2026-06-20 at 11.32.09 (3).jpeg", legenda: "Gente que faz a diferença" },
    { arq: "WhatsApp Image 2026-06-20 at 11.32.10.jpeg",     legenda: "Congestionamento de ~60% para ~16%" },
    { arq: "WhatsApp Image 2026-06-20 at 11.32.10 (1).jpeg", legenda: "A menor taxa do Estado, em todas as competências" },
    { arq: "WhatsApp Image 2026-06-20 at 11.32.10 (2).jpeg", legenda: "União que vira resultado" },
    { arq: "WhatsApp Image 2026-06-20 at 12.01.54.jpeg",     legenda: "Memórias do Juizado Especial" },
    { arq: "WhatsApp Image 2026-06-20 at 12.01.54 (1).jpeg", legenda: "A celebração da equipe" },
    { arq: "WhatsApp Image 2026-06-20 at 12.01.54 (2).jpeg", legenda: "Quatro anos no topo, sem parar" },
    { arq: "WhatsApp Image 2026-06-20 at 12.01.54 (3).jpeg", legenda: "O laço que fica para sempre" },
    { arq: "WhatsApp Image 2026-06-20 at 12.01.54 (4).jpeg", legenda: "Trabalho, orgulho e afeto" },
    { arq: "WhatsApp Image 2026-06-20 at 12.01.54 (5).jpeg", legenda: "A família do Juizado" },
    { arq: "WhatsApp Image 2026-06-20 at 12.01.55.jpeg",     legenda: "Justo e rápido ao mesmo tempo" },
    { arq: "WhatsApp Image 2026-06-20 at 12.01.55 (1).jpeg", legenda: "A despedida que sela o vínculo" },
    { arq: "WhatsApp Image 2026-06-20 at 12.01.55 (2).jpeg", legenda: "Até onde a custódia levar, leva-se isto" },
    { arq: "WhatsApp Image 2026-06-20 at 12.01.55 (3).jpeg", legenda: "Obrigado, equipe" },
    { arq: "WhatsApp Image 2026-06-20 at 12.01.55 (4).jpeg", legenda: "O melhor time do Ceará" }
  ];

  let overlay = null;

  function fechar() {
    if (overlay) { overlay.remove(); overlay = null; }
    document.removeEventListener("keydown", aoTeclar);
  }

  function aoTeclar(ev) {
    if (ev.key === "Escape") { ev.preventDefault(); fechar(); }
  }

  function ampliar(foto) {
    const lb = document.createElement("div");
    lb.className = "mural-lightbox";
    const img = document.createElement("img");
    img.src = encodeURI(PASTA + foto.arq);
    img.alt = foto.legenda;
    const cap = document.createElement("div");
    cap.className = "mural-lightbox-legenda";
    cap.textContent = foto.legenda;
    lb.appendChild(img); lb.appendChild(cap);
    lb.addEventListener("click", function () { lb.remove(); });
    overlay.appendChild(lb);
  }

  function abrir() {
    if (overlay) return;
    overlay = document.createElement("div");
    overlay.className = "mural-overlay";

    const painel = document.createElement("div");
    painel.className = "mural-painel";

    const cabec = document.createElement("div");
    cabec.className = "mural-cabecalho";
    cabec.innerHTML = '<h2>🖼 Mural da Equipe — Juizado Especial</h2>' +
      '<p>4º título consecutivo · Prêmio + Gestão TJCE · Certificação Excelência</p>';

    const fechaBtn = document.createElement("button");
    fechaBtn.className = "mural-fechar";
    fechaBtn.textContent = "✕ fechar";
    fechaBtn.addEventListener("click", fechar);
    cabec.appendChild(fechaBtn);

    const grade = document.createElement("div");
    grade.className = "mural-grade";

    FOTOS.forEach(function (foto, i) {
      const card = document.createElement("figure");
      card.className = "mural-polaroid";
      card.style.transform = "rotate(" + (((i % 5) - 2) * 1.4) + "deg)";
      const tachinha = document.createElement("span");
      tachinha.className = "mural-tachinha";
      const img = document.createElement("img");
      img.loading = "lazy";
      img.src = encodeURI(PASTA + foto.arq);
      img.alt = foto.legenda;
      img.addEventListener("error", function () {
        card.classList.add("mural-faltando");
        img.remove();
        const aviso = document.createElement("div");
        aviso.className = "mural-aviso";
        aviso.textContent = "foto não encontrada";
        card.insertBefore(aviso, card.firstChild);
      });
      img.addEventListener("click", function () { ampliar(foto); });
      const cap = document.createElement("figcaption");
      cap.textContent = foto.legenda;
      card.appendChild(tachinha);
      card.appendChild(img);
      card.appendChild(cap);
      grade.appendChild(card);
    });

    painel.appendChild(cabec);
    painel.appendChild(grade);
    overlay.appendChild(painel);
    overlay.addEventListener("click", function (ev) { if (ev.target === overlay) fechar(); });
    document.body.appendChild(overlay);
    document.addEventListener("keydown", aoTeclar);
  }

  return { abrir: abrir, fechar: fechar, FOTOS: FOTOS };
})();
