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

  /* ---------- MODO DE TESTE (autor) ----------
     Liberação por senha, SÓ em memória: nada persiste, nada de
     URL. No código fica apenas o hash — a senha é do autor.   */
  let liberadas = false;
  function djb2(txt) {
    let h = 5381;
    for (let i = 0; i < txt.length; i++) h = ((h << 5) + h + txt.charCodeAt(i)) | 0;
    return h >>> 0;
  }
  const HASH_TESTE = 2943863176;

  function senhaConfere(senha) {
    return typeof senha === "string" && djb2(senha) === HASH_TESTE;
  }

  function liberarTudo(senha) {
    if (!senhaConfere(senha)) return "nada aconteceu.";
    liberadas = true;
    if (TOGA.cena3d && document.body.classList.contains("modo-3d") &&
        TOGA.cena3d.toastMundo) {
      TOGA.cena3d.toastMundo("🔓 Modo de teste das atividades LIGADO (só nesta aba — recarregar tranca de novo). A porta da rua aparece a qualquer momento do dia.");
    }
    return resumo();
  }

  function resetar(senha) {
    if (!senhaConfere(senha)) return "nada aconteceu.";
    dados = null;
    try { localStorage.removeItem(CHAVE); } catch (e) {}
    return "conclusões e avisos das atividades zerados.";
  }

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
    return !!a && (liberadas || ganhas() >= a.limiar);
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
     A PALESTRA "SIMPLES E MÁGICO" — minigame de linguagem
     simples no auditório da ESMEC, com o Juiz Luis Gustavo
     Montezuma Herbster. Três rodadas: escolher a tradução
     SIMPLES E FIEL do juridiquês (nunca em 1º lugar).
     ============================================================ */
  const PALESTRA = {
    titulo: "🪄 Simples e Mágico — Linguagem Simples",
    gatilho: "linguagem-simples",
    passos: [
      { texto: "O Juiz Luis Gustavo Montezuma Herbster apoia as anotações no púlpito de acrílico e sorri para a plateia: “Colegas, o programa chama-se SIMPLES E MÁGICO porque é isso que acontece quando a parte ENTENDE a sentença: a mágica de a Justiça caber na vida das pessoas. Juridiquês não é tradição — é pedágio. Vamos treinar? Eu mostro o trecho, vocês traduzem.”" },
      { texto: "No telão, o primeiro trecho: “Indefiro o pleito formulado pelo autor, eis que carecedor de supedâneo jurídico, restando cediço que a exordial não se desincumbiu do ônus probatório que lhe competia.”",
        decisao: {
          prompt: "Qual é a tradução SIMPLES — e fiel — para a parte que vai ler?",
          opcoes: [
            { rotulo: "“Nego o pedido do autor, por absoluta ausência de substrato probatório mínimo apto a corroborar a tese autoral.”",
              tom: "ruim",
              feedback: "Montezuma ri com a plateia: “trocamos um juridiquês por outro de gravata nova! ‘Substrato probatório mínimo apto a corroborar’... a dona Maria entende isso?” Simplificar não é trocar o difícil por outro difícil." },
            { rotulo: "“Nego o pedido. O autor não apresentou as provas do que afirmou — e quem afirma, precisa provar (CPC, art. 373, I).”",
              tom: "otimo",
              feedback: "“PERFEITO. Curto, direto, com a regra citada para quem quiser conferir — e a dona Maria entende na primeira leitura. Reparem: não perdemos UM grama de precisão técnica.” A plateia anota. Alguém fotografa o telão." },
            { rotulo: "“O pedido foi negado porque o juiz achou que não tinha provas suficientes.”",
              tom: "ruim",
              feedback: "“Quase! Mas ‘o juiz achou’ esconde a regra do jogo: parece capricho pessoal, e não é. A parte precisa saber que existe uma norma — quem afirma, prova. Simples não pode virar impreciso.”" }
          ]
        } },
      { texto: "Segundo trecho no telão: “Ante o exposto, hei por bem deferir o pedido liminar initio litis e inaudita altera pars, eis que presentes o fumus boni iuris e o periculum in mora.”",
        decisao: {
          prompt: "E agora — como fica em português de gente?",
          opcoes: [
            { rotulo: "“Defiro a liminar initio litis, presentes os pressupostos autorizadores do provimento de urgência.”",
              tom: "ruim",
              feedback: "“Colega, ainda sobrou um ‘initio litis’ aí dentro!”, aponta Montezuma, e o auditório ri junto. “Latim em decisão é tempero: uma pitada explica, duas pitadas escondem.”" },
            { rotulo: "“Concedo a liminar agora, sem ouvir a outra parte ainda, porque o pedido é bem fundamentado e esperar poderia causar um prejuízo difícil de desfazer. A outra parte será ouvida em seguida.”",
              tom: "otimo",
              feedback: "“Olhem a MÁGICA: fumus, periculum e inaudita altera pars — tudo isso está aí dentro, em português, sem perder nada. E a frase final avisa a outra parte do que vem: transparência também é linguagem simples.” Aplausos curtos e sinceros." },
            { rotulo: "“Dou a liminar porque o caso é urgente.”",
              tom: "ruim",
              feedback: "“Simples demais a ponto de sumir o fundamento — a parte contrária vai perguntar POR QUÊ, e a resposta tem que estar na decisão. Linguagem simples encurta a forma, nunca a motivação (CF, art. 93, IX).”" }
          ]
        } },
      { texto: "Último trecho — Montezuma pisca para a plateia: “esse eu peguei de uma intimação de verdade”. No telão: “Fica Vossa Senhoria intimada a comparecer ao átrio do fórum, no dia aprazado, sob as penas da lei, a fim de prestar depoimento pessoal, sob pena de confissão ficta.”",
        decisao: {
          prompt: "A intimação que a testemunha precisa entender. Traduza:",
          opcoes: [
            { rotulo: "“Compareça ao fórum na data marcada para prestar depoimento, sob pena de aplicação dos efeitos da confissão ficta.”",
              tom: "ruim",
              feedback: "“‘Confissão ficta’ continua lá, intacta e incompreensível! Se a consequência é a parte da frase que mais importa, é justamente ela que TEM de estar em português.”" },
            { rotulo: "“O senhor precisa ir ao fórum no dia marcado para responder a perguntas. ATENÇÃO: se não for, a lei permite que o juiz considere verdadeiros os fatos que a outra parte afirmou (CPC, art. 385, §1º).”",
              tom: "otimo",
              feedback: "“É ISSO. A consequência explicada dói mais que o latim — e é assim que a pessoa COMPARECE. Intimação que se entende é audiência que acontece: linguagem simples é gestão de pauta também.” Montezuma fecha as anotações: “era esse o segredo. Simples... e mágico.”" },
            { rotulo: "“Vá ao fórum no dia marcado, senão o senhor perde o processo.”",
              tom: "ruim",
              feedback: "“Opa — ‘perde o processo’ é mais do que a lei diz! A confissão ficta atinge os FATOS, não decide a causa sozinha. Assustar com consequência errada é tão ruim quanto esconder a certa.”" }
          ]
        } },
      { texto: "A plateia se levanta para o café. No telão, o slide final do programa Simples e Mágico: “Se a parte não entendeu, a Justiça ainda não chegou.” Montezuma desce do púlpito e vem apertar a sua mão: “e aí, colega — quantas sentenças suas a dona Maria entenderia hoje?”" }
    ]
  };

  /* ============================================================
     MISSÕES DA ESMEC — minigames curtos nas salas de capacitação.
     ============================================================ */
  const MISSOES = {

    oficina: {
      titulo: "📝 Oficina de Sentenças",
      gatilho: "oficina-sentencas",
      passos: [
        { texto: "No mesão da oficina, uma sentença real (anonimizada) espera cirurgia. A dupla de colegas abre espaço: “chegou reforço! A regra da casa é uma só: o que não ajuda a decidir, atrapalha. Vamos por partes — relatório, fundamentação, dispositivo.”" },
        { texto: "PARTE 1 — o relatório tem catorze páginas: transcreve a inicial inteira, a contestação inteira e cada despacho de mero expediente.",
          decisao: {
            prompt: "O que fazer com o relatório?",
            opcoes: [
              { rotulo: "Manter tudo: relatório completo nunca anulou sentença — e mostra trabalho.",
                tom: "ruim",
                feedback: "“Mostra trabalho de quem? O leitor se perde na página três”, ri a colega. Relatório é síntese do essencial (CPC, art. 489, I) — copiar e colar não relata: empilha." },
              { rotulo: "Resumir em uma página: pedido, defesa e os incidentes que importam para a decisão.",
                tom: "otimo",
                feedback: "“Catorze páginas viraram uma — e ficou MAIS claro de onde o processo veio e para onde vai.” O essencial relatado, o resto referido. A sentença começa a respirar." },
              { rotulo: "Cortar o relatório por inteiro: ninguém lê mesmo.",
                tom: "ruim",
                feedback: "“Calma, bisturi!” O relatório é elemento essencial da sentença (CPC, art. 489, I) — salvo nos juizados (Lei 9.099, art. 38). Suprimir não é simplificar: é amputar." }
            ]
          } },
        { texto: "PARTE 2 — na fundamentação, o colega aponta um parágrafo: “Nesse sentido, a jurisprudência pacífica dos tribunais pátrios, aplicável ao caso em tela.” Sem ementa, sem número, sem dizer POR QUE se aplica.",
          decisao: {
            prompt: "O parágrafo fica ou sai?",
            opcoes: [
              { rotulo: "Fica: invocar a jurisprudência dá peso e ninguém impugna o que é pacífico.",
                tom: "ruim",
                feedback: "O CPC chama isso pelo nome: NÃO é fundamentada a decisão que invoca precedente sem identificá-lo nem demonstrar que o caso se ajusta a ele (art. 489, §1º, V). Peso de papel, não de razão." },
              { rotulo: "Sai — e entra o precedente IDENTIFICADO, com a ementa e a ponte expressa com o caso concreto.",
                tom: "otimo",
                feedback: "“Agora sim: qual julgado, o que ele decidiu e por que este caso é igual. Três linhas a mais que blindam a sentença inteira.” A dupla anota a fórmula no quadro." },
              { rotulo: "Fica, mas com 'mutatis mutandis' antes — cobre qualquer diferença.",
                tom: "ruim",
                feedback: "Gargalhada geral: “mutatis mutandis é o tapete onde a fundamentação esconde a poeira!” Latim não substitui a demonstração que o art. 489, §1º, V, exige." }
            ]
          } },
        { texto: "PARTE 3 — o dispositivo: “Ante o exposto, julgo PARCIALMENTE PROCEDENTE o pedido, nos termos da fundamentação supra.”",
          decisao: {
            prompt: "O que está faltando aí?",
            opcoes: [
              { rotulo: "Nada — a fundamentação já explicou tudo; repetir seria redundante.",
                tom: "ruim",
                feedback: "“E o oficial de justiça cumpre O QUÊ? E a parte executa O QUÊ?” Dispositivo que manda procurar a resposta no meio da sentença gera embargos, dúvida na execução e mais trabalho para todo mundo." },
              { rotulo: "Tudo: o dispositivo deve dizer EXATAMENTE o que foi deferido — quem paga, quanto, a quem, com quais juros e prazos.",
                tom: "otimo",
                feedback: "“É o endereço de entrega da sentença!” Dispositivo líquido e certo: condeno R$ X, corrigido desde Y, juros desde Z. Quem lê só o final — e quase todo mundo lê só o final — sai sabendo o resultado." },
              { rotulo: "Falta o resumo dos fundamentos, parágrafo por parágrafo.",
                tom: "ruim",
                feedback: "Aí viraria uma segunda sentença dentro da primeira. O dispositivo não repete os PORQUÊS — entrega o QUÊ, completo e executável." }
            ]
          } },
        { texto: "A sentença lapidada cabe agora em quatro páginas que qualquer parte entende. O colega da oficina estende a mão: “volta sempre — sentença boa é igual cuscuz: o segredo está no que se tira, não no que se põe.”" }
      ]
    },

    mediacao: {
      titulo: "🤝 Sala de Mediação — técnica de consenso",
      gatilho: "mediacao",
      passos: [
        { texto: "Na mesa redonda, dois colegas simulam uma conciliação: um faz o consumidor exaltado (“paguei e não recebi!”), o outro, o lojista na defensiva (“o fornecedor me deixou na mão!”). A facilitadora aponta a cadeira vazia: “conduza a sessão, doutor. Regra de ouro: acordo não se impõe — se constrói.”" },
        { texto: "O 'consumidor' desabafa há dois minutos e não parece perto de terminar. O 'lojista' revira os olhos.",
          decisao: {
            prompt: "Primeira decisão de quem conduz: o que fazer com o desabafo?",
            opcoes: [
              { rotulo: "Interromper com firmeza: “vamos ao que interessa, o tempo de todos é curto.”",
                tom: "ruim",
                feedback: "O 'consumidor' cruza os braços — e a facilitadora congela a cena: “acabou de comprar dez minutos a mais de resistência. Quem não termina de falar, não começa a ouvir.”" },
              { rotulo: "Deixar concluir, sinalizando escuta — e então resumir: “deixe-me ver se entendi o que mais pesou para o senhor...”",
                tom: "otimo",
                feedback: "“ISSO é escuta ativa.” O desabafo termina sozinho, trinta segundos depois — e o resumo faz o 'consumidor' assentir pela primeira vez. Quem se sente ouvido baixa a guarda." },
              { rotulo: "Aproveitar o embalo e já propor: “que tal 50% de desconto e encerramos?”",
                tom: "ruim",
                feedback: "Proposta antes da escuta tem cheiro de linha de produção. Os dois recusam — por princípio. “O número podia até ser bom”, observa a facilitadora, “mas chegou antes da confiança.”" }
            ]
          } },
        { texto: "O 'lojista' dispara: “ele só quer dinheiro fácil!” — e o 'consumidor' se levanta da cadeira.",
          decisao: {
            prompt: "A sessão ameaça descarrilar. Sua intervenção:",
            opcoes: [
              { rotulo: "Advertir o 'lojista': a provocação foi dele, que se retrate.",
                tom: "ruim",
                feedback: "A facilitadora balança a cabeça: “virou juiz de novo! Na mediação, apontar culpado da ofensa só muda o réu da briga.” O 'lojista' agora também cruzou os braços." },
              { rotulo: "Reformular sem o veneno: “o senhor teme um pedido além do prejuízo; e o senhor quer apenas o que pagou. É isso?”",
                tom: "otimo",
                feedback: "“A reformulação tirou o ferrão e deixou o conteúdo.” Os dois assentem — descobrem que discordam de MENOS do que gritavam. A cadeira volta a ser ocupada." },
              { rotulo: "Suspender a sessão por dez minutos para os ânimos baixarem.",
                tom: "ruim",
                feedback: "Pausa tem hora — e essa não era. “O conflito estava finalmente NA MESA; você o mandou para o corredor”, lamenta a facilitadora. A energia da sessão se perde." }
            ]
          } },
        { texto: "Os ânimos serenos, os interesses claros: ele quer o produto ou o dinheiro; o lojista pode entregar em dez dias ou devolver em trinta.",
          decisao: {
            prompt: "Como se fecha?",
            opcoes: [
              { rotulo: "Decidir o meio-termo: entrega em vinte dias, e está homologado.",
                tom: "ruim",
                feedback: "“Vinte dias não atende NENHUM dos dois — é a média aritmética da insatisfação.” Acordo imposto descumpre-se na primeira esquina; voltariam ao fórum em um mês." },
              { rotulo: "Devolver a palavra: “dos caminhos na mesa, qual funciona para os dois?” — e deixar que escolham.",
                tom: "otimo",
                feedback: "Eles escolhem a entrega em dez dias — com multa diária sugerida POR ELES. A facilitadora sorri: “acordo de autor tem dono; acordo de juiz tem recurso. O senhor entendeu o ofício.”" },
              { rotulo: "Encerrar sem acordo e marcar instrução: já se avançou bastante por hoje.",
                tom: "ruim",
                feedback: "Desistir com o consenso a um passo da mesa! “A audiência de instrução custa meses — e a solução estava a uma pergunta de distância.”" }
            ]
          } },
        { texto: "Aplausos curtos da dupla de 'partes'. No quadro da sala, alguém escreveu há muito tempo, e ninguém apagou: “Sentença encerra o processo. Acordo encerra o conflito.”" }
      ]
    }
  };

  MISSOES.flagrante = {
    titulo: "🚔 Plantão do flagrante",
    gatilho: "plantao-flagrante",
    passos: [
      { texto: "A Dra. Socorro abre o auto de prisão em flagrante da madrugada sobre a mesa de provas: “furto qualificado, preso às 3h12. Quero o olhar do fórum em três pontos antes de fechar — o senhor topa o exercício? Aqui dentro a gente chama de ‘plantão do flagrante’.”" },
      { texto: "PONTO 1 — as comunicações. O carimbo do relógio marca 3h12. “Prendi. E agora, quem fica sabendo — e até quando?”",
        decisao: {
          prompt: "O que o CPP exige da prisão das 3h12?",
          opcoes: [
            { rotulo: "Comunicar o juiz no expediente seguinte — madrugada não corre prazo.",
              tom: "ruim",
              feedback: "“Se madrugada não corresse prazo, ninguém era preso de dia!”, ri a delegada. A comunicação ao juiz é IMEDIATA (CPP, art. 306, caput) — e o plantão judiciário existe exatamente para as 3h12." },
            { rotulo: "Imediatamente: juiz, Ministério Público e família ou pessoa indicada — e o auto ao juiz em até 24h, com a nota de culpa ao preso.",
              tom: "otimo",
              feedback: "“Fechou o circuito: ninguém preso em segredo neste país.” Juiz, MP e família sabem NA HORA (art. 306, caput); em 24h o auto sobe e o preso recebe a nota de culpa (§§ 1º e 2º). A liberdade de um lado, o controle do outro." },
            { rotulo: "Comunicar só a família — o juiz verá tudo na audiência de custódia mesmo.",
              tom: "ruim",
              feedback: "“E quem marca a custódia, o destino?” Sem a comunicação imediata ao juiz não há controle judicial da prisão — a audiência é a SEGUNDA proteção, não a primeira.” " }
          ]
        } },
      { texto: "PONTO 2 — a delegada ergue um saco lacrado: “o celular do investigado. A perícia precisa abrir AGORA, e o lacre original vai romper. Como se faz sem estragar a prova?”",
        decisao: {
          prompt: "O lacre vai romper. O que a cadeia de custódia manda?",
          opcoes: [
            { rotulo: "Qualquer policial rompe, fotografa e pronto — o que vale é a boa-fé.",
              tom: "ruim",
              feedback: "“Boa-fé não assina laudo.” O recipiente só pode ser aberto pelo PERITO ou por pessoa autorizada, com registro de tudo (CPP, art. 158-F, parágrafo único). Fora disso, a defesa derruba — com razão." },
            { rotulo: "O perito rompe, registra a abertura, examina e RELACRA com novo lacre — tudo documentado, elo por elo.",
              tom: "otimo",
              feedback: "“Elo por elo — é assim que a prova chega inteira na frente do senhor.” Do reconhecimento ao descarte, cada passo documentado (CPP, arts. 158-A a 158-F). O lacre novo entra no auto; a história do vestígio não tem buraco." },
            { rotulo: "Devolver ao fórum e deixar o juiz decidir quem abre.",
              tom: "ruim",
              feedback: "“O senhor ia adorar mais esse processo, né?” A lei já decidiu quem abre: o perito (art. 158-F). Judicializar o que a lei resolve é atrasar a investigação — e o juiz não é gestor de lacre." }
          ]
        } },
      { texto: "PONTO 3 — a delegada cruza os braços, meio sorrindo: “amanhã esse moço senta na frente de um juiz na audiência de custódia. Me diga, de lá de dentro: o que o senhor olha NAQUELES dez minutos?”",
        decisao: {
          prompt: "A pergunta da delegada: o que a audiência de custódia examina?",
          opcoes: [
            { rotulo: "Se o preso é culpado — aproveitando que está ali, já se adianta o mérito.",
              tom: "ruim",
              feedback: "“Cuidado, doutor — essa resposta reprova juiz!” Custódia NÃO julga o crime (Res. CNJ 213, art. 8º, §1º): mérito ali contamina o processo inteiro. O fato espera; a liberdade e o corpo do preso, não." },
            { rotulo: "Três coisas: a legalidade da prisão, a necessidade real de alguma cautelar — e, olhando nos olhos, se houve tortura ou maus-tratos.",
              tom: "otimo",
              feedback: "“É por isso que eu mando os meus autos REDONDOS.” Relaxar a ilegal, só manter prisão se nenhuma cautelar do art. 319 bastar, e perguntar — sempre — como o preso foi tratado (CPP, art. 310; Res. CNJ 213). Dez minutos que vigiam todo o resto." },
            { rotulo: "Se a papelada está completa — estando, homologa-se e a pauta anda.",
              tom: "ruim",
              feedback: "“Papelada minha SEMPRE está completa”, pisca a delegada, “e nem por isso o juiz deve assinar de olho fechado.” Custódia de carimbo é a que deixa passar a prisão ilegal e o hematoma sob a manga.” " }
          ]
        } },
      { texto: "A delegada fecha o auto, satisfeita: “três de três. Vou contar para o plantão que o fórum sabe o que faz com o que a gente manda.” No corredor, o policial da ronda finge que não estava ouvindo — e endireita o quepe.” " }
    ]
  };

  MISSOES.cidadania = {
    titulo: "🧒 Pergunta de criança, resposta de juiz",
    gatilho: "perguntas-criancas",
    passos: [
      { texto: "A tia Chica bate palmas duas vezes: “turma, o juiz topou o nosso ‘pergunta tudo’! Regra da sala: pode perguntar QUALQUER coisa.” Vinte e três mãos sobem ao mesmo tempo. Ela escolhe três." },
      { texto: "A primeira é da menina da trança, lá do fundo: “moço... POR QUE não pode tudo o que a gente quer?”",
        decisao: {
          prompt: "Vinte e três pares de olhos. Sua resposta:",
          opcoes: [
            { rotulo: "“Porque os adultos mandam e criança obedece — um dia vocês entendem.”",
              tom: "ruim",
              feedback: "A menina abaixa os olhos. A tia Chica disfarça o desgosto. Regra virou capricho de quem é maior — exatamente o que a Justiça NÃO é." },
            { rotulo: "“Porque se cada um pudesse tudo, valia a lei do mais forte — e o mais forte nunca é a gente. O combinado protege quem é menor: a regra é o jeito de TODO MUNDO poder um pouco.”",
              tom: "otimo",
              feedback: "“Tipo na fila do escorregador!”, grita alguém. EXATAMENTE como na fila do escorregador. A menina da trança sorri: entendeu — e quem entende a regra, defende a regra." },
            { rotulo: "“Pode sim — desde que ninguém veja.”",
              tom: "ruim",
              feedback: "A sala gargalha, a tia Chica não. A piada ensina o contrário de tudo: que a regra só vale com plateia. O juiz da comarca acabou de autorizar a arte escondida." }
          ]
        } },
      { texto: "A segunda vem do menino da pergunta famosa, claro: “e se a regra for INJUSTA? Tem que obedecer assim mesmo?”",
        decisao: {
          prompt: "A pergunta mais difícil do Direito — na versão do 4º ano:",
          opcoes: [
            { rotulo: "“Tem que obedecer calado. Regra é regra.”",
              tom: "ruim",
              feedback: "O menino cruza os braços, inconformado — e ele TEM razão. ‘Regra é regra’ já protegeu muita injustiça na história; obediência sem pergunta não é cidadania, é treino." },
            { rotulo: "“Regra injusta a gente luta para MUDAR — reclamando, votando, indo ao juiz. Mas muda pelos caminhos certos, porque se cada um rasgar a regra que não gosta, a primeira rasgada vai ser a que protege você.”",
              tom: "otimo",
              feedback: "Silêncio de processamento — e então o menino assente devagar, do jeito de quem vai pensar nisso por uma semana. A tia Chica escreve no quadro: MUDAR ≠ DESCUMPRIR." },
            { rotulo: "“Não — cada um decide a regra que vale para si.”",
              tom: "ruim",
              feedback: "“Então amanhã eu decido que dever de casa não vale!”, testa um esperto na segunda fileira. A sala vira assembleia. Foi exatamente assim que a resposta desmontou a própria sala de aula." }
          ]
        } },
      { texto: "A última pergunta vem baixinha, da criança que não tinha falado nada o dia inteiro: “senhor juiz... o senhor já ERROU?”",
        decisao: {
          prompt: "A sala inteira prende o fôlego — a tia Chica também.",
          opcoes: [
            { rotulo: "“Juiz não pode errar — por isso estuda tanto.”",
              tom: "ruim",
              feedback: "A criança encolhe: errar virou coisa de gente fraca. E o dia em que ela errar — porque vai — vai achar que não serve. A resposta heroica é a mais covarde." },
            { rotulo: "“Já errei, erro e vou errar — juiz é gente. A diferença é o que se faz depois: eu conserto no papel, peço desculpa quando é de pedir, e tento errar menos amanhã. Errar não é vergonha. Esconder é.”",
              tom: "otimo",
              feedback: "A criança baixinha sorri pela primeira vez. A tia Chica anota a frase inteira para o mural. Vinte e três crianças acabaram de aprender que errar tem conserto — do juiz da comarca, ao vivo." },
            { rotulo: "“Essa pergunta a gente pula — segredo de justiça.”",
              tom: "ruim",
              feedback: "Risos nervosos, pergunta no ar. A única criança que criou coragem de falar hoje aprendeu que pergunta difícil se desvia. Era a pergunta mais importante da visita." }
          ]
        } },
      { texto: "O sinal toca e ninguém levanta — “MAIS UMA, tia!”. A tia Chica encerra com a régua na mão: “a turma agradece a aula, e o mural de sexta vai se chamar ‘O dia em que a gente perguntou tudo’.” No corredor, a diretora cochicha: “volte no semestre que vem. Eles NÃO vão esquecer.”" }
    ]
  };

  function executarMissao(id, aoTerminar) {
    const m = MISSOES[id];
    if (!m || emVisita) return false;
    return rodarRoteiro(m, function (r) {
      carregar().missoes = carregar().missoes || {};
      carregar().missoes[id] = true;
      salvar();
      if (TOGA.conquistas) TOGA.conquistas.avaliar(m.gatilho, { gabaritou: r.exemplar });
      if (aoTerminar) aoTerminar(r);
    });
  }
  function missaoFeita(id) {
    const d = carregar();
    return !!(d.missoes && d.missoes[id]);
  }

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

  function executarPalestra(aoTerminar) {
    if (emVisita) return false;
    return rodarRoteiro(PALESTRA, function (r) {
      carregar().palestraFeita = true;
      salvar();
      if (TOGA.conquistas) {
        TOGA.conquistas.avaliar(PALESTRA.gatilho, { gabaritou: r.exemplar });
      }
      if (aoTerminar) aoTerminar(r);
    });
  }
  function palestraFeita() { return !!carregar().palestraFeita; }

  function executarVisita(id, aoTerminar) {
    const roteiro = ROTEIROS[id];
    if (!roteiro || emVisita) return false;
    return rodarRoteiro(roteiro, function (r) {
      concluirVisita(id, roteiro, r.exemplar);
      if (aoTerminar) aoTerminar(r);
    });
  }

  function concluirVisita(id, roteiro, exemplar) {
    marcarConcluida(id);
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
  }

  function rodarRoteiro(roteiro, aoConcluir) {
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
      if (aoConcluir) aoConcluir({ exemplar: tropecos === 0 });
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
        destravada: liberadas || n >= a.limiar,
        concluida: concluida(a.id),
        progresso: Math.min(n, a.limiar)
      };
    });
  }

  return {
    LISTA: ATIVIDADES,
    destravada: destravada,
    liberarTudo: liberarTudo,
    resetar: resetar,
    get liberadas() { return liberadas; },
    concluida: concluida,
    marcarConcluida: marcarConcluida,
    checarDesbloqueios: checarDesbloqueios,
    executarVisita: executarVisita,
    executarPalestra: executarPalestra,
    palestraFeita: palestraFeita,
    executarMissao: executarMissao,
    missaoFeita: missaoFeita,
    resumo: resumo,
    get emVisita() { return emVisita; }
  };
})();
