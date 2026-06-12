/* ============================================================
   TOGA — atividades.js : A COMARCA ALÉM DO FÓRUM
   ------------------------------------------------------------
   Sistema de progressão de longo prazo: as CONQUISTAS (que já
   persistem entre os dias) destravam atividades fora do fórum.

     8 conquistas → visita à DELEGACIA   (a pé)
    15 conquistas → visita à ESCOLA      (a pé)
    24 conquistas → aula na ESMEC        (dirigindo o próprio carro)

   Cada atividade é uma VISITA INTERATIVA: um roteiro de passos
   (texto + decisões com tons, a melhor nunca em 1º lugar) que
   roda num painel DOM — funciona por cima do mundo 3D e também
   no modo clássico (epílogo). Concluir rende conquista própria,
   flags de manchete e, no caso da ESMEC, uma lembrança.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.atividades = (function () {

  const CHAVE = "toga.atividades.v1";   // { concluidas: {id:true}, avisadas: {id:true} }

  const ATIVIDADES = [
    { id: "delegacia", icone: "🚔", nome: "Visita à Delegacia", limiar: 8,
      hint: "Conheça o outro lado do flagrante: a casa da Polícia Judiciária." },
    { id: "escola", icone: "🏫", nome: "Visita à Escola Municipal", limiar: 15,
      hint: "Uma aula sobre Justiça para quem ainda escreve a lápis." },
    { id: "esmec", icone: "🎓", nome: "Aula na ESMEC", limiar: 24,
      hint: "Dirija até a Escola Superior da Magistratura e ensine quem está chegando." }
  ];

  /* ---------- persistência (fora do save: é da CARREIRA) ---------- */
  let dados = null;
  function carregar() {
    if (dados) return dados;
    try { dados = JSON.parse(localStorage.getItem(CHAVE)) || {}; }
    catch (e) { dados = {}; }
    dados.concluidas = dados.concluidas || {};
    dados.avisadas = dados.avisadas || {};
    return dados;
  }
  function salvar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(carregar())); } catch (e) {}
  }

  function ganhas() {
    return (TOGA.conquistas && TOGA.conquistas.quantasGanhas)
      ? TOGA.conquistas.quantasGanhas() : 0;
  }

  function destravada(id) {
    const a = ATIVIDADES.find(x => x.id === id);
    return !!a && ganhas() >= a.limiar;
  }
  function concluida(id) { return !!carregar().concluidas[id]; }
  function marcarConcluida(id) {
    carregar().concluidas[id] = true;
    salvar();
  }

  /* O aviso de desbloqueio: chamado pelo conquistas.avaliar após
     cada medalha nova — anuncia UMA vez por atividade. */
  function checarDesbloqueios() {
    const n = ganhas();
    ATIVIDADES.forEach(function (a) {
      if (n < a.limiar || carregar().avisadas[a.id]) return;
      carregar().avisadas[a.id] = true;
      salvar();
      const msg = a.icone + " Atividade destravada: " + a.nome +
        " — saia do fórum ao fim da pauta para visitá-la.";
      if (TOGA.cena3d && document.body.classList.contains("modo-3d") &&
          TOGA.cena3d.toastMundo) {
        TOGA.cena3d.toastMundo(msg);
      } else {
        // fora do 3D: reusa o visual do toast de medalha
        const area = document.getElementById("area-medalhas");
        if (area) {
          const el = document.createElement("div");
          el.className = "toast-medalha";
          el.innerHTML = "<strong>" + a.icone + " Nova atividade!</strong><span>" +
            a.nome + "</span>";
          area.appendChild(el);
          setTimeout(function () { el.classList.add("sumir"); }, 5200);
          setTimeout(function () { el.remove(); }, 6000);
        }
      }
    });
  }

  /* ============================================================
     OS ROTEIROS — cada passo: { texto } ou { texto, decisao }.
     decisao: { prompt, opcoes: [{rotulo, tom, feedback}] } — a
     melhor opção NUNCA na 1ª posição. `so3d`/`so2d` filtram
     passos por modo (a viagem de carro é vivida no 3D; no 2D
     ela vira decisões narradas).
     ============================================================ */
  const ROTEIROS = {

    delegacia: {
      titulo: "🚔 Visita à Delegacia",
      flagBoa: "visitaDelegaciaExemplar",
      gatilho: "visita-delegacia",
      passos: [
        { texto: "A delegada titular, Dra. Socorro Andrade, recebe você na porta com um aperto de mão firme: “Excelência, bem-vindo à casa onde os seus processos nascem. O senhor vai ver que aqui o papel ainda está quente.” A recepção tem cheiro de café e de carimbo." },
        { texto: "Primeiro, a carceragem: limpa, ventilada, dentro da capacidade. “Custódia aqui dura horas, não semanas — desde que as audiências do fórum andem”, diz a delegada, olhando para você com metade de um sorriso. O plantonista mostra o livro de ocorrências do fim de semana: 14 registros, 3 flagrantes." },
        { texto: "Na sala de provas, a delegada abre um caso real: um flagrante de tráfico da madrugada. Ela mesma aponta, antes de você: “o lacre da sacola veio sem a assinatura do condutor. A cadeia de custódia (CPP, art. 158-A) manda o rito completo — e eu já devolvi para refazer o auto.”",
          decisao: {
            prompt: "A delegada pergunta, de colega para colega: “na dúvida entre prender logo e documentar direito, o que o fórum prefere?”",
            opcoes: [
              { rotulo: "“Prender logo. Papelada se corrige depois — o que importa é tirar o criminoso da rua.”",
                tom: "ruim",
                feedback: "A delegada balança a cabeça: “foi assim que eu perdi meus três primeiros flagrantes na audiência de custódia, Excelência.” Prova mal documentada solta culpado e prende inocente — a pressa de hoje é o relaxamento de amanhã (CPP, arts. 158-A a 158-F)." },
              { rotulo: "“Documentar direito. Flagrante que não sobrevive à custódia não protege ninguém — nem a vítima.”",
                tom: "otimo",
                feedback: "“É por isso que eu devolvi o auto”, ela sorri. A cadeia de custódia não é burocracia: é o que faz a prova valer na frente de qualquer juiz. Vocês combinam um canal direto entre o plantão da delegacia e o cartório das custódias — a ponte institucional que faltava." },
              { rotulo: "“Isso é problema da polícia. O fórum só recebe o que chega.”",
                tom: "ruim",
                feedback: "O sorriso da delegada esfria um grau. Instituições que se tratam como repartições alheias produzem exatamente os autos malfeitos que atravancam as duas. Cooperação não é ingerência — é o art. 3º-A do CPP funcionando." }
            ]
          } },
        { texto: "Na saída, a Dra. Socorro entrega a você um exemplar encadernado do fluxo de flagrantes da unidade. “Volte sempre, Excelência. Juiz que conhece a delegacia despacha melhor — e delegado que conhece o fórum prende menos errado.”" }
      ]
    },

    escola: {
      titulo: "🏫 Visita à Escola Municipal",
      flagBoa: "visitaEscolaExemplar",
      gatilho: "visita-escola",
      passos: [
        { texto: "A Escola Municipal Chico Albuquerque tem muro pintado de peixes e um portão que range. A professora Francisca — “tia Chica”, corrige uma menina no corredor — leva você pelo pátio até a sala do 4º ano: 23 crianças, um mapa do Ceará na parede e um silêncio de expectativa que nenhum plenário consegue." },
        { texto: "“Crianças, este é o juiz da nossa cidade.” Um menino da segunda fileira levanta a mão antes de você sentar: “o senhor já prendeu alguém HOJE?”. A sala inteira prende a respiração.",
          decisao: {
            prompt: "Vinte e três pares de olhos esperam. O que o juiz responde?",
            opcoes: [
              { rotulo: "“Já, e prendo todo dia. Quem faz coisa errada vai preso — e quem não estudar também acaba mal.”",
                tom: "ruim",
                feedback: "O menino encolhe. A professora franze a testa. Justiça virou bicho-papão — e estudo virou ameaça. A pior aula possível em duas frases." },
              { rotulo: "“Prender é a parte pequena do trabalho. A parte grande é resolver briga sem briga: vizinho com vizinho, pai com mãe, gente que precisa de remédio. Juiz é mais quebra-galho do que carcereiro.”",
                tom: "otimo",
                feedback: "“Tipo a tia Chica quando separa briga no recreio?” — “Exatamente. Só que com mais papel.” A sala ri. Em trinta segundos, a Justiça deixou de ser um lugar de medo e virou um serviço de gente." },
              { rotulo: "“Essa informação é sigilosa.”",
                tom: "ruim",
                feedback: "Silêncio constrangido. Tecnicamente correto, pedagogicamente um desastre — a criança perguntou para se aproximar, e a resposta a empurrou para longe." }
            ]
          } },
        { texto: "A aula vira conversa: por que existem regras, quem inventou a Constituição (“um livro de combinados gigante”, você explica, e a tia Chica anota a definição no quadro), o que fazer quando o combinado é descumprido. No recreio, o menino da pergunta puxa a sua manga: “quando eu crescer, quero ser quebra-galho também.”" },
        { texto: "A diretora se despede com a agenda aberta: “a senhora juíza... perdão, o senhor volta semestre que vem? A última visita de autoridade aqui foi o carro do IPTU.” Você anota. O Judiciário acabou de ganhar 23 advogados de defesa." }
      ]
    },

    esmec: {
      titulo: "🎓 Aula na ESMEC",
      flagBoa: "aulaEsmecExemplar",
      gatilho: "aula-esmec",
      passos: [
        { so2d: true,
          texto: "Sábado, 8h. Você tira o carro da garagem — sem motorista: dirigir até a ESMEC faz parte do compromisso. Cinto afivelado antes de dar a partida, sinal verde, avenida tranquila.",
          decisao: {
            prompt: "No cruzamento da avenida, o sinal fecha no amarelo. A pista está vazia e você está adiantado.",
            opcoes: [
              { rotulo: "Acelerar e passar: amarelo é quase verde, e ninguém está olhando.",
                tom: "ruim",
                feedback: "Um flash conhecido pisca no retrovisor. O radar não pergunta a profissão. A multa chega em quinze dias — e a lição, na hora: a toga não anda no porta-luvas." },
              { rotulo: "Parar e esperar o vermelho abrir: a lei não tem horário de expediente.",
                tom: "otimo",
                feedback: "Do carro ao lado, um senhor de bigode reconhece você da audiência dos vizinhos e acena com respeito. Juiz parado no sinal vazio ensina mais trânsito que campanha de maio." }
            ]
          } },
        { so2d: true,
          texto: "A fachada curva de granito rosado aparece no fim da alameda de palmeiras: ESMEC — Escola Superior da Magistratura do Estado do Ceará, Des. Júlio Carlos de Miranda Bezerra. Você estaciona, atravessa o hall de piso espelhado — a vitrine do memorial, a galeria de retratos dos diretores — e a coordenadora vem ao seu encontro." },
        { so3d: true,
          texto: "Você atravessou a cidade ao volante e estacionou diante da fachada curva de granito. No hall de piso espelhado, entre a vitrine do memorial e a galeria de retratos, a coordenadora vem ao seu encontro." },
        { texto: "“Pontualidade de quem dirige o próprio carro”, sorri a juíza Ana Paula Feitosa Oliveira, coordenadora da Escola. “A turma de hoje é especial: juízas e juízes recém-empossados, primeira semana de formação inicial. Eles sabem TUDO de lei. O que eles não sabem... é o que o senhor vai contar.”",
          decisao: {
            prompt: "No auditório, quarenta togas novas esperam. Por onde começar a aula?",
            opcoes: [
              { rotulo: "Pela teoria: duas horas de doutrina sobre os poderes instrutórios do juiz, com 80 slides.",
                tom: "ruim",
                feedback: "No slide 23, um juiz novo confere o celular. No 40, a coordenadora oferece um café. Eles passaram cinco anos estudando teoria para passar no concurso — vieram aqui buscar o que não está nos livros." },
              { rotulo: "Pelos casos: as pessoas que passaram pela sua sala — o que cada decisão tocou, o que você acertou e o que faria diferente.",
                tom: "otimo",
                feedback: "Você conta os seus dias: a porta destrancada de Marlene, as algemas que saíram do Jonas, o plenário em que a vítima não virou ré. Quarenta canetas correm no papel. No fim, a pergunta que importa: “e quando o senhor erra?” — “Eu corrijo em ata, no mesmo dia. Errar faz parte; esconder é que não.”" },
              { rotulo: "Pela carreira: como produzir números que impressionam a corregedoria.",
                tom: "ruim",
                feedback: "A coordenadora intervém com elegância: “produtividade a Escola ensina com planilha, doutor. O senhor foi convidado pelo que não cabe nelas.” A aula se recupera — mas o recado ficou." }
            ]
          } },
        { texto: "Ao final, a turma se levanta — não por protocolo. A coordenadora entrega a você uma foto emoldurada da turma na escadaria da entrada: “para a parede do seu gabinete. Quando a pauta apertar, olhe para eles: é para isso que a gente ensina.” No estacionamento, o seu carro espera — e a volta, você dirige mais devagar, sem nenhum motivo de trânsito." }
      ]
    }
  };

  /* ============================================================
     O EXECUTOR — painel DOM por cima de qualquer tela.
     ============================================================ */
  let painel = null;
  let emVisita = false;

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function fecharPainel() {
    if (painel) { painel.remove(); painel = null; }
    emVisita = false;
    document.body.classList.remove("em-visita");
  }

  function executarVisita(id, aoTerminar) {
    const roteiro = ROTEIROS[id];
    if (!roteiro || emVisita) return false;
    emVisita = true;
    document.body.classList.add("em-visita");

    const modo3d = document.body.classList.contains("modo-3d");
    const passos = roteiro.passos.filter(function (p) {
      if (p.so3d && !modo3d) return false;
      if (p.so2d && modo3d) return false;
      return true;
    });

    let i = 0;
    let tropecos = 0;       // decisões fora do tom ótimo

    painel = el("div", "painel-visita");
    document.body.appendChild(painel);

    function render() {
      const p = passos[i];
      painel.innerHTML = "";
      const cartao = el("div", "cartao-visita");
      cartao.appendChild(el("h3", "", roteiro.titulo));
      cartao.appendChild(el("p", "texto-visita", p.texto));

      if (p.decisao) {
        cartao.appendChild(el("p", "prompt-visita", p.decisao.prompt));
        p.decisao.opcoes.forEach(function (op) {
          const b = el("button", "opcao opcao-visita", op.rotulo);
          b.dataset.tom = op.tom;
          b.addEventListener("click", function () {
            if (op.tom !== "otimo") tropecos++;
            // feedback no lugar das opções
            cartao.querySelectorAll(".opcao-visita, .prompt-visita").forEach(x => x.remove());
            const fb = el("p", "feedback-visita " + (op.tom === "otimo" ? "fb-otimo" : "fb-ruim"),
              op.feedback);
            cartao.appendChild(fb);
            cartao.appendChild(botaoSeguir("continuar ▸"));
          });
          cartao.appendChild(b);
        });
      } else {
        cartao.appendChild(botaoSeguir(i === passos.length - 1 ? "encerrar a visita ✓" : "continuar ▸"));
      }
      painel.appendChild(cartao);
    }

    function botaoSeguir(rotulo) {
      const b = el("button", "btn btn-seguir-visita", rotulo);
      b.addEventListener("click", function () {
        i++;
        if (i < passos.length) render();
        else concluir();
      });
      return b;
    }

    function concluir() {
      fecharPainel();
      const exemplar = tropecos === 0;
      marcarConcluida(id);
      // flags do dia (alimentam manchetes do epílogo) + reputação leve
      const M = TOGA.motor;
      if (M && M.estado) {
        M.estado.flags["_visita_" + id + "Feita"] = true;
        if (exemplar) M.estado.flags[roteiro.flagBoa] = true;
        else M.estado.flags["visitaComTropeco"] = true;
        if (M.aplicarEfeitos) M.aplicarEfeitos(exemplar ? { hum: 3, imp: 2 } : { hum: 1 });
        M.salvar();
      }
      if (TOGA.conquistas) {
        TOGA.conquistas.avaliar(roteiro.gatilho, { exemplar: exemplar });
      }
      if (aoTerminar) aoTerminar({ exemplar: exemplar });
    }

    render();
    return true;
  }

  /* ---------- resumo p/ vitrine e epílogo ---------- */
  function resumo() {
    const n = ganhas();
    return ATIVIDADES.map(function (a) {
      return {
        id: a.id, icone: a.icone, nome: a.nome, limiar: a.limiar, hint: a.hint,
        destravada: n >= a.limiar,
        concluida: concluida(a.id),
        progresso: Math.min(n, a.limiar)
      };
    });
  }

  return {
    LISTA: ATIVIDADES,
    destravada: destravada,
    concluida: concluida,
    marcarConcluida: marcarConcluida,
    checarDesbloqueios: checarDesbloqueios,
    executarVisita: executarVisita,
    resumo: resumo,
    get emVisita() { return emVisita; }
  };
})();
