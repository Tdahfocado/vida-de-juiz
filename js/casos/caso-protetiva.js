/* ============================================================
   CASO 1 — "Medidas Protetivas: Marlene & Ivan"
   Violência doméstica · pauta das 09:00
   ------------------------------------------------------------
   Este arquivo é SÓ DADOS: textos, opções, efeitos e ramos.
   O motor (js/motor.js) lê este formato e conduz o jogo.
   Para criar um caso novo, copie esta estrutura
   (tutorial completo em docs/CRIANDO-CASOS.md).
   ============================================================ */

window.TOGA = window.TOGA || {};
TOGA.casos = TOGA.casos || [];

TOGA.casos.push({
  id: "protetiva",
  titulo: "Medidas Protetivas — Marlene & Ivan",
  subtitulo: "A vítima quer “retirar tudo”. A lei permite? E o risco, cessou?",
  area: "Violência Doméstica",
  hora: "09:00",
  duracaoPrevistaMin: 75,
  tensao: 8,

  personagens: [
    { id: "marlene", nome: "Marlene", papel: "Vítima", assento: "centro",
      avatar: { pele: "#c98e66", cabelo: "longo", corCabelo: "#2c1c10", traje: "camisa", corTraje: "#7a6a8a" } },
    { id: "lucia", nome: "Dra. Lúcia", papel: "Defensora Pública", assento: "esq2",
      avatar: { pele: "#8a5a3a", cabelo: "coque", corCabelo: "#1d1209", traje: "blazer", corTraje: "#2f4a3e", corBlusa: "#e8e2d2", oculos: true } },
    { id: "caio", nome: "Dr. Caio", papel: "Promotor", assento: "esq1",
      avatar: { pele: "#e0b48c", cabelo: "curto", corCabelo: "#3a2a1a", traje: "terno", corTraje: "#2b3340", corGravata: "#7a2e2e", barba: true } },
    { id: "ivan", nome: "Ivan", papel: "Autor do fato", assento: "dir2",
      avatar: { pele: "#d8a87f", cabelo: "curto", corCabelo: "#241a10", traje: "camisa", corTraje: "#5a4a3a" } },
    { id: "patricia", nome: "Dra. Patrícia", papel: "Advogada", assento: "dir1",
      avatar: { pele: "#e8c49c", cabelo: "longo", corCabelo: "#5a3318", traje: "blazer", corTraje: "#4a3a55", corBlusa: "#efe5c8", oculos: true } }
  ],

  autos: {
    resumo: "Pedido da defesa para revogar as medidas protetivas deferidas há 40 dias. Fatos: lesão corporal leve e ameaça contra a companheira. A ofendida assinou declaração dizendo que se reconciliou e quer “retirar tudo”.",
    pecas: [
      { id: "bo", titulo: "Boletim de Ocorrência",
        texto: "Em 12/abril, durante discussão na residência do casal, IVAN empurrou MARLENE contra a parede, causando lesões no braço esquerdo, e disse: “se você me denunciar, te encontro lá fora”. Os dois filhos do casal (5 e 8 anos) presenciaram. Acionada a PM, o autor já havia deixado o local." },
      { id: "laudo", titulo: "Laudo Pericial (ECD)",
        texto: "Exame de corpo de delito: equimoses arroxeadas em antebraço esquerdo e escoriação em cotovelo, compatíveis com preensão e impacto contra superfície rígida. Incompatível, em princípio, com queda acidental da própria altura. A periciada nega autolesão." },
      { id: "defesa", titulo: "Pedido da Defesa",
        texto: "A defesa de IVAN requer a REVOGAÇÃO das medidas protetivas: (i) o casal se reconciliou; (ii) o requerido é mecânico, está dormindo na oficina e precisa retornar ao lar; (iii) junta-se declaração assinada pela ofendida manifestando desejo de “retirar a queixa e encerrar tudo”." },
      { id: "mp", titulo: "Cota do Ministério Público",
        texto: "O MP opina pelo INDEFERIMENTO. Há risco concreto e atual. A vontade manifestada pela ofendida deve ser colhida em audiência, com acompanhamento da Defensoria, observada a natureza das ações penais: a lesão corporal não admite retratação; a ameaça, sim, na forma do art. 16 da Lei 11.340/2006." },
      { id: "diligencias", titulo: "Diligências (certidão + vizinha)",
        texto: "CERTIDÃO: ocorrência anterior de ameaça entre as mesmas partes há 2 anos, arquivada após retratação.\n\nTERMO DE DECLARAÇÕES (vizinha, no inquérito): relata gritos frequentes vindos da casa e afirma ter visto IVAN rondando a residência da ofendida, à noite, em duas ocasiões na última semana — mesmo proibido de se aproximar." }
    ]
  },

  /* `grifos` (opcional): trechos das peças que ACENDEM nos autos
     quando o foco é marcado — o jogo ensina ONDE olhar. */
  focos: [
    { id: "f_laudo", rotulo: "Laudo pericial", dica: "As lesões objetivas falam quando a vítima silencia. Saiba o laudo de cor.",
      grifos: [
        { peca: "laudo", trecho: "equimoses arroxeadas em antebraço esquerdo e escoriação em cotovelo" },
        { peca: "laudo", trecho: "Incompatível, em princípio, com queda acidental da própria altura" }
      ] },
    { id: "f_hist", rotulo: "Histórico do casal", dica: "Ocorrência anterior arquivada após retratação: um padrão que se repete?",
      grifos: [
        { peca: "diligencias", trecho: "ocorrência anterior de ameaça entre as mesmas partes há 2 anos, arquivada após retratação" }
      ] },
    { id: "f_vizinha", rotulo: "Declarações da vizinha", dica: "Rondas noturnas RECENTES podem demonstrar risco atual — requisito decisivo.",
      grifos: [
        { peca: "diligencias", trecho: "visto IVAN rondando a residência da ofendida, à noite, em duas ocasiões na última semana" }
      ] },
    { id: "f_filhos", rotulo: "Filhos e dependência", dica: "Dois filhos pequenos e dependência financeira: lembre-se do art. 22, V, da Lei Maria da Penha.",
      grifos: [
        { peca: "bo", trecho: "Os dois filhos do casal (5 e 8 anos) presenciaram" }
      ] }
  ],

  arco: {
    antes: { emocao: "medo", gesto: "angustia" },
    depois: [
      { se: function (f) { return f.protegida && f.pacoteCompleto; }, tom: "bom", gesto: "abraco",
        falas: [
          { quem: "marlene", emocao: "choro", texto: "Doutor... a tornozeleira dele já está ativa, a Dra. Lúcia me explicou tudo. Hoje eu durmo com a porta destrancada por dentro. Faz oito meses que eu não sabia o que era isso." },
          { quem: "lucia", emocao: "feliz", texto: "A rede inteira foi acionada na mesma tarde, Excelência. É assim que a Maria da Penha funciona quando funciona." }
        ] },
      { se: function (f) { return !!f.mpuRevogada; }, tom: "grave",
        falas: [
          { quem: "lucia", emocao: "raiva", texto: "Excelência, Marlene me perguntou na saída o que faz agora quando ele aparecer no portão. Eu não tinha resposta jurídica para dar — a medida que a protegia foi revogada nesta sala." }
        ] }
    ]
  },

  vidasTocadas: [
    { se: function (f) { return f.protegida && f.pacoteCompleto; }, tom: "bom",
      texto: "Marlene e os dois filhos dormiram em casa, com a rede de proteção de pé — e a porta destrancada por dentro." },
    { se: "presoFundamentado", tom: "bom",
      texto: "A preventiva fundamentada resistiu ao habeas corpus: Ivan aguarda o processo longe do portão dela." },
    { se: "mpuRevogada", tom: "grave",
      texto: "Marlene voltou a trancar o quarto por dentro. A nova ocorrência chegou antes do fim do expediente." }
  ],

  inicio: "c1",
  cenas: {

    /* ---------------- ABERTURA ---------------- */
    c1: {
      falas: [
        { quem: "narrador", texto: "09h00. Sala composta. Marlene senta-se à frente, olhos baixos. Ivan, do outro lado, observa cada movimento dela." },
        { quem: "patricia", emocao: "firme", texto: "Excelência, a defesa requereu esta audiência. As partes se reconciliaram e a própria ofendida deseja encerrar o caso. Há declaração assinada nos autos." },
        { quem: "caio", emocao: "neutro", texto: "O Ministério Público tem posição firmada, Excelência, e a exporá no momento próprio." }
      ],
      decisao: {
        prompt: "Como você abre os trabalhos?",
        opcoes: [
          { rotulo: "Perguntar diretamente: “A senhora deseja retirar a queixa?”",
            fundamento: "Vai direto ao ponto que motivou a audiência",
            efeitos: { tec: -8, tempo: 4 },
            carimbo: "PERGUNTA DIRETA",
            reacoes: [
              { quem: "caio", emocao: "firme", texto: "Protesto, Excelência. “Retirar a queixa” não descreve tecnicamente o que está em jogo nestes autos." },
              { quem: "marlene", emocao: "medo", texto: "Eu... é... eu acho que sim?" }
            ],
            feedback: { acerto: "ruim", titulo: "A pergunta que induz",
              texto: "“Retirar a queixa” não existe tecnicamente aqui: a lesão corporal é de ação pública incondicionada (ADI 4424; Súmula 542/STJ) e não depende da vítima; apenas a ameaça comporta retratação (art. 16). Abrir com essa pergunta pressiona a ofendida e desinforma a sala." },
            proxima: "c2" },

          { rotulo: "Conceder a palavra primeiro à advogada do requerente — quem pediu a audiência fala primeiro",
            fundamento: "Ordem de quem provocou o ato",
            efeitos: { imp: -7, tempo: 6 },
            carimbo: "PALAVRA À DEFESA",
            reacoes: [
              { quem: "patricia", emocao: "feliz", texto: "Agradeço, Excelência. Como se vê, trata-se de casal reconciliado, e a manutenção das medidas só desestrutura a família..." },
              { quem: "lucia", emocao: "firme", texto: "Consigno, Excelência, que a ofendida ainda não foi sequer acolhida pelo juízo." },
              { quem: "marlene", emocao: "triste", texto: "..." }
            ],
            feedback: { acerto: "ruim", titulo: "A centralidade é da vítima",
              texto: "Em audiência protetiva, a pessoa em situação de violência é o centro do ato — não coadjuvante. Abrir pela tese da defesa, antes de acolher e informar a ofendida, inverte essa lógica e transmite à sala um sinal de parcialidade." },
            proxima: "c2" },

          { rotulo: "Explicar a Marlene, em linguagem simples, seus direitos e a natureza de cada crime — antes de qualquer manifestação",
            fundamento: "Protocolo de Julgamento com Perspectiva de Gênero (Res. CNJ 492/2023); Lei 11.340, art. 27",
            efeitos: { tec: 6, hum: 6, tempo: 8 },
            carimbo: "PALAVRA À OFENDIDA",
            reacoes: [
              { quem: "lucia", emocao: "feliz", texto: "A Defensoria agradece e acompanha, Excelência." },
              { quem: "marlene", emocao: "neutro", texto: "Obrigada, doutor... ninguém nunca me explicou essas coisas direito." }
            ],
            feedback: { acerto: "otimo", titulo: "Informar antes de colher",
              texto: "Decisão exemplar. Antes de qualquer manifestação da vítima, o juízo explica o que está em jogo: a lesão corporal em contexto doméstico é de ação pública <b>incondicionada</b> (ADI 4424/STF; Súmula 542/STJ) e prossegue independentemente da vontade dela; só a ameaça admite retratação (art. 16 da Lei 11.340/2006). Colher vontade sem informação é colher vontade viciada — e o Protocolo da Res. CNJ 492/2023 orienta exatamente essa escuta qualificada." },
            proxima: "c2" }
        ]
      }
    },

    /* ---------------- A RETRATAÇÃO ---------------- */
    c2: {
      falas: [
        { quem: "marlene", emocao: "choro", texto: "Doutor... eu quero retirar tudo. A gente voltou. Ele tá pagando as contas, os menino gostam dele... Eu tenho dois filho pequeno. Sem ele, eu não dou conta sozinha." },
        { quem: "lucia", emocao: "neutro", texto: "Excelência, a Defensoria acompanha a ofendida e apenas pede atenção à natureza das ações penais envolvidas." }
      ],
      decisao: {
        prompt: "Marlene pede para “retirar tudo”. O que você decide sobre a retratação?",
        opcoes: [
          { rotulo: "Homologar a retratação quanto a TODOS os fatos e julgar extinta a punibilidade",
            fundamento: "Prevalência da vontade da vítima reconciliada",
            efeitos: { tec: -15, imp: -5, tempo: 6 },
            carimbo: "EXTINTA A PUNIBILIDADE",
            setFlags: { erroRetratacao: true },
            reacoes: [
              { quem: "caio", emocao: "raiva", texto: "Protesto! Lesão corporal em violência doméstica é ação pública INCONDICIONADA, Excelência. O Ministério Público recorrerá desta decisão ainda hoje." },
              { quem: "patricia", emocao: "feliz", texto: "A defesa registra seus cumprimentos ao juízo." }
            ],
            feedback: { acerto: "grave", titulo: "Retratação que a lei não admite",
              texto: "A decisão contraria frontalmente a ADI 4424/STF e a Súmula 542/STJ: quanto à lesão corporal, a vontade da vítima não extingue a ação penal. O recurso do MP tende a cassá-la — e, no intervalo, a mensagem enviada à sala (e a Ivan) é a pior possível. Atenção: as medidas protetivas têm caráter autônomo e ainda serão decididas adiante — você terá a chance de não agravar o erro." },
            proxima: "c3" },

          { rotulo: "Distinguir os crimes: colher a retratação SÓ quanto à ameaça e manter a persecução pela lesão corporal",
            fundamento: "Art. 16 da Lei 11.340/2006; ADI 4424/STF; Súmula 542/STJ",
            efeitos: { tec: 12, hum: 4, tempo: 10 },
            carimbo: "HOMOLOGADA EM PARTE",
            setFlags: { retratacaoParcial: true },
            reacoes: [
              { quem: "caio", emocao: "feliz", texto: "É exatamente a posição do Ministério Público, Excelência." },
              { quem: "marlene", emocao: "surpresa", texto: "Então... mesmo eu desistindo, o processo da agressão continua?" },
              { quem: "lucia", emocao: "neutro", texto: "Continua, Marlene. Esse não depende da senhora — é o Estado quem responde por ele." }
            ],
            feedback: { acerto: "otimo", titulo: "A distinção que define o caso",
              texto: "Aqui mora o coração técnico da audiência. Lesão corporal, ainda que leve, em contexto de violência doméstica: ação pública <b>incondicionada</b> — a retratação é juridicamente irrelevante (ADI 4424/STF; Súmula 542/STJ). Ameaça: ação condicionada à representação — a retratação é admissível até o recebimento da denúncia, em audiência designada a pedido da ofendida, ouvido o MP (art. 16). Homologar em parte protege sem atropelar a autonomia que a lei reservou a ela." },
            proxima: "c3" },

          { rotulo: "Indeferir qualquer retratação: “aqui não se retira queixa”",
            fundamento: "Proteção máxima da vítima",
            efeitos: { tec: -6, hum: -6, tempo: 4 },
            carimbo: "INDEFERIDO",
            reacoes: [
              { quem: "lucia", emocao: "triste", texto: "Excelência, com todo respeito: quanto à ameaça, a lei assegura a ela exatamente esse direito." },
              { quem: "marlene", emocao: "choro", texto: "Nem isso eu posso decidir...?" }
            ],
            feedback: { acerto: "ruim", titulo: "Proteção não é tutela total",
              texto: "O art. 16 da Lei 11.340/2006 existe precisamente para os crimes de ação condicionada: a ofendida pode se retratar da representação, perante o juiz, antes do recebimento da denúncia, ouvido o MP. Negar em bloco desinforma e desconsidera a autonomia que a própria lei protetiva preservou." },
            proxima: "c3" }
        ]
      }
    },

    /* ---------------- A PERGUNTA VEXATÓRIA ---------------- */
    c3: {
      falas: [
        { quem: "narrador", texto: "Passa-se às perguntas das partes." },
        { quem: "patricia", emocao: "firme", texto: "Dona Marlene: a senhora já registrou ocorrência contra meu cliente antes e depois voltou atrás, não foi? A senhora costuma exagerar nas histórias quando briga em casa?" },
        { quem: "lucia", emocao: "raiva", texto: "Objeção, Excelência! Pergunta vexatória, que desqualifica a ofendida e nada acrescenta aos fatos." }
      ],
      decisao: {
        prompt: "A Defensoria objeta. Você:",
        opcoes: [
          { rotulo: "Deferir: a defesa tem o direito de testar a credibilidade da ofendida",
            fundamento: "Ampla defesa",
            efeitos: { hum: -8, imp: -4, tempo: 3 },
            carimbo: "DEFERIDA",
            reacoes: [
              { quem: "marlene", emocao: "choro", texto: "Eu não tô exagerando... eu nunca exagerei..." },
              { quem: "lucia", emocao: "raiva", texto: "Que se consigne em ata o protesto da Defensoria contra a revitimização da ofendida." }
            ],
            feedback: { acerto: "grave", titulo: "Ampla defesa não é salvo-conduto",
              texto: "A ampla defesa convive com limites legais expressos: o art. 400-A do CPP (Lei 14.245/2021) veda justamente o ataque à dignidade da vítima sob o pretexto de testar credibilidade. Deferir a pergunta como posta revitimiza e ainda gera nulidade potencial do ato." },
            proxima: "c4" },

          { rotulo: "Determinar que a pergunta seja reformulada, limitada a fatos objetivos",
            fundamento: "Aproveita a parte pertinente, descarta a desqualificação",
            efeitos: { tec: 5, imp: 3, tempo: 4 },
            carimbo: "REFORMULE",
            reacoes: [
              { quem: "patricia", emocao: "neutro", texto: "Pois não. Dona Marlene, houve uma ocorrência anterior entre a senhora e meu cliente? O que aconteceu com ela?" }
            ],
            feedback: { acerto: "bom", titulo: "Solução cirúrgica",
              texto: "Caminho correto e elegante: a ocorrência anterior é fato pertinente e pode ser explorada; o juízo sobre “exagero” da vítima, não. Reformular preserva o contraditório sem permitir a desqualificação vedada pelo art. 400-A do CPP." },
            proxima: "c4" },

          { rotulo: "Indeferir a pergunta como formulada",
            fundamento: "CPP, art. 212 c/c art. 400-A (Lei 14.245/2021 — vedação à revitimização)",
            efeitos: { tec: 8, imp: 2, tempo: 3 },
            carimbo: "INDEFERIDA",
            reacoes: [
              { quem: "patricia", emocao: "vergonha", texto: "Reformulo, Excelência." },
              { quem: "marlene", emocao: "neutro", texto: "..." }
            ],
            feedback: { acerto: "otimo", titulo: "O filtro do art. 212 — e o escudo do 400-A",
              texto: "O juiz não admite perguntas que possam induzir a resposta, não tenham relação com a causa ou importem repetição (CPP, art. 212). E a Lei 14.245/2021 (caso Mariana Ferrer) acrescentou o art. 400-A: são vedadas manifestações sobre circunstâncias alheias aos fatos e contra a dignidade da vítima. “A senhora costuma exagerar?” é desqualificação pura — a parte objetiva (a ocorrência anterior) pode ser perguntada de forma limpa." },
            proxima: "c4" }
        ]
      }
    },

    /* ---------------- O DEPOIMENTO DE IVAN ---------------- */
    c4: {
      falas: [
        { quem: "ivan", emocao: "firme", texto: "Excelência, posso falar? Eu nunca encostei nela pra machucar. Ela caiu da escada do quintal. Isso tudo é coisa da cabeça dela, doutor." },
        { quem: "patricia", emocao: "neutro", texto: "É a palavra dele, Excelência. Não há testemunha presencial da suposta agressão." }
      ],
      decisao: {
        prompt: "A versão de Ivan contradiz frontalmente os autos. Você:",
        opcoes: [
          { rotulo: "Fazer perguntas abertas sobre a dinâmica do dia dos fatos",
            fundamento: "Colheita imparcial — contradições aparecem sozinhas",
            efeitos: { tec: 4, tempo: 8 },
            carimbo: "INQUIRIDO",
            reacoes: [
              { quem: "ivan", emocao: "neutro", texto: "A gente discutiu, ela subiu nervosa, eu fiquei embaixo... aí ouvi o barulho." }
            ],
            feedback: { acerto: "bom", titulo: "Postura correta",
              texto: "Perguntas abertas e neutras são a técnica adequada de inquirição. Com o laudo estudado em mãos, porém, o confronto direto com a prova pericial tornaria a contradição incontornável — preparação rende opções." },
            proxima: "c5" },

          { rotulo: "Confrontá-lo, com serenidade, com o laudo pericial",
            fundamento: "Equimoses por preensão e impacto, “incompatíveis com queda da própria altura” — perícia oficial",
            requerFoco: "f_laudo",
            efeitos: { tec: 10, tempo: 6 },
            carimbo: "CONFRONTADO COM O LAUDO",
            setFlags: { ivanVacilou: true },
            reacoes: [
              { quem: "ivan", emocao: "medo", texto: "A escada... é... pode ser que no meio da discussão ela tenha batido o braço, eu não sei..." },
              { quem: "caio", emocao: "firme", texto: "Consigne-se a alteração da versão do depoente, Excelência." }
            ],
            feedback: { acerto: "otimo", titulo: "A prova técnica fala por você",
              texto: "Quem estudou o laudo não precisa elevar a voz: a perícia oficial (CPP, arts. 158 e seguintes) descreve lesões por preensão e impacto, incompatíveis com a queda narrada. O confronto objetivo registra a contradição em ata — sem acusação, sem prejulgamento. É o uso legítimo da preparação." },
            proxima: "c5" },

          { rotulo: "“O senhor está mentindo descaradamente para este juízo.”",
            fundamento: "Firmeza contra versões inverossímeis",
            efeitos: { imp: -8, tec: -4, tempo: 4 },
            carimbo: "REPREENDIDO",
            reacoes: [
              { quem: "patricia", emocao: "raiva", texto: "Excelência! Isso é prejulgamento explícito. Requeiro consignação em ata para todos os fins." },
              { quem: "ivan", emocao: "raiva", texto: "Tá vendo? Já tão todos contra mim aqui." }
            ],
            feedback: { acerto: "grave", titulo: "O juiz não é acusador",
              texto: "No sistema acusatório (CPP, art. 3º-A), externar convicção antecipada sobre a mentira do depoente compromete a imparcialidade, contamina o ato e abre flanco para arguição de suspeição. A contradição se demonstra com prova — não com adjetivo." },
            proxima: "c5" }
        ]
      }
    },

    /* ---------------- O MOMENTO CENTRAL: MPU ---------------- */
    c5: {
      falas: [
        { quem: "lucia", emocao: "firme", texto: "Excelência, a ofendida me autorizou a informar: na semana passada, à noite, o requerido esteve rondando a casa dela em duas ocasiões. Há declarações de vizinha no inquérito no mesmo sentido." },
        { quem: "ivan", emocao: "raiva", texto: "Eu não tava rondando nada! Eu passei na rua, a rua é pública!" },
        { quem: "caio", emocao: "firme", texto: "Diante do risco atual, o Ministério Público requer a PRISÃO PREVENTIVA, com fundamento no art. 313, III, do Código de Processo Penal — ou, subsidiariamente, a manutenção integral das medidas, com monitoração eletrônica." },
        { quem: "patricia", emocao: "firme", texto: "Desproporcional, Excelência. Ele trabalha, tem residência e não há descumprimento formalizado." }
      ],
      decisao: {
        prompt: "O momento central da audiência: o que você decide sobre as medidas protetivas?",
        opcoes: [
          { rotulo: "Decretar a preventiva “por cautela e pela gravidade da situação”",
            fundamento: "Gravidade do contexto doméstico",
            efeitos: { tec: -4, tempo: 8 },
            carimbo: "PREVENTIVA DECRETADA",
            setFlags: { presoPreventivo: true },
            evento: "prisao:ivan",
            reacoes: [
              { quem: "patricia", emocao: "raiva", texto: "Fundamentação genérica, Excelência! O habeas corpus será distribuído em uma hora." }
            ],
            feedback: { acerto: "ruim", titulo: "Gravidade abstrata não prende ninguém",
              texto: "“Cautela geral” e “gravidade da situação” são exatamente as fórmulas que os tribunais cassam: a preventiva exige fato concreto e contemporâneo (CPP, arts. 312, §2º, e 315, §2º). O risco até existia nos autos — rondas, escalada — mas você não o articulou na decisão. Quem não fundamenta com o que estudou, perde no segundo grau." },
            proxima: "c6" },

          { rotulo: "Manter as medidas integralmente + monitoração eletrônica + advertência expressa do art. 24-A",
            fundamento: "Lei 11.340, art. 22; CPP, art. 319, IX; descumprir MPU é crime (art. 24-A)",
            efeitos: { tec: 10, hum: 6, tempo: 10 },
            carimbo: "MEDIDAS MANTIDAS",
            setFlags: { protegida: true },
            reacoes: [
              { quem: "ivan", emocao: "raiva", texto: "Tornozeleira?! Eu não sou bandido, doutor!" },
              { quem: "marlene", emocao: "triste", texto: "Eu só queria paz, doutor. Só isso." },
              { quem: "lucia", emocao: "feliz", texto: "A Defensoria registra que é a decisão que protege sem prender." }
            ],
            feedback: { acerto: "otimo", titulo: "Proteção com proporcionalidade",
              texto: "A monitoração eletrônica (CPP, art. 319, IX) dá efetividade à proibição de aproximação — fiscaliza a distância em tempo real — sem o custo da prisão. A advertência formal documenta a ciência do art. 24-A (descumprir MPU é crime autônomo). E lembre: as medidas protetivas têm caráter autônomo, subsistindo independentemente do destino da ação penal (orientação consolidada no STJ)." },
            proxima: "c6" },

          { rotulo: "Revogar as medidas protetivas: o casal se reconciliou",
            fundamento: "Autonomia da vontade da ofendida",
            efeitos: { tec: -18, hum: -12, tempo: 6 },
            carimbo: "MEDIDAS REVOGADAS",
            setFlags: { mpuRevogada: true },
            reacoes: [
              { quem: "patricia", emocao: "feliz", texto: "É a decisão justa, Excelência. A família agradece." },
              { quem: "caio", emocao: "raiva", texto: "O Ministério Público consigna veemente protesto e pedirá reconsideração imediata." },
              { quem: "lucia", emocao: "triste", texto: "..." },
              { quem: "marlene", emocao: "vergonha", texto: "Obrigada, doutor... eu acho." }
            ],
            feedback: { acerto: "grave", titulo: "Revoga-se quando cessa o RISCO — não a vontade de punir",
              texto: "A reconciliação não é critério de revogação: o parâmetro é a cessação do risco. E os autos gritam o contrário — rondas noturnas na última semana, escalada documentada, dependência financeira que silencia a vítima (o ciclo da violência). A decisão ignora a prova produzida há minutos nesta mesma sala." },
            proxima: "c6" },

          { rotulo: "Decretar a preventiva fundamentando no risco ATUAL: rondas recentes + escalada documentada",
            fundamento: "CPP, arts. 312, §2º (contemporaneidade), 313, III e 315 — risco concreto demonstrado",
            requerFoco: "f_vizinha",
            efeitos: { tec: 8, hum: 4, tempo: 10 },
            carimbo: "PREVENTIVA DECRETADA",
            setFlags: { presoPreventivo: true, presoFundamentado: true },
            evento: "prisao:ivan",
            reacoes: [
              { quem: "ivan", emocao: "medo", texto: "Preso?! Eu vou ser preso?!" },
              { quem: "patricia", emocao: "raiva", texto: "Impetraremos habeas corpus ainda hoje, Excelência." },
              { quem: "caio", emocao: "firme", texto: "O Ministério Público confia na higidez da fundamentação." }
            ],
            feedback: { acerto: "otimo", titulo: "Preventiva que se sustenta",
              texto: "A prisão preventiva para garantir a execução das medidas protetivas (CPP, art. 313, III) exige risco contemporâneo e fundamentação concreta (arts. 312, §2º, e 315). As rondas noturnas recentes — corroboradas pela vizinha — somadas à escalada histórica suprem exatamente esses requisitos. Sem esse lastro, a mesma decisão cairia em HC." },
            proxima: "c6" }
        ]
      }
    },

    /* ---------------- ENCAMINHAMENTOS ---------------- */
    c6: {
      falas: [
        { quem: "caio", emocao: "neutro", texto: "Por fim, Excelência, o Ministério Público requer os encaminhamentos protetivos de praxe." },
        { quem: "lucia", emocao: "firme", texto: "A Defensoria reforça: há dois filhos pequenos e dependência financeira documentada." }
      ],
      decisao: {
        prompt: "Encaminhamentos finais da audiência:",
        opcoes: [
          { rotulo: "Encaminhamentos essenciais: CREAS e grupo reflexivo",
            fundamento: "Lei 11.340, art. 22, VI e VII",
            efeitos: { hum: 6, tec: 4, tempo: 8 },
            carimbo: "DEFERIDO EM PARTE",
            feedback: { acerto: "bom", titulo: "Rede acionada — quase inteira",
              texto: "Encaminhamentos corretos. Faltou, porém, o que a vítima verbalizou desde o início: a dependência financeira. O art. 22, V, autorizava fixar alimentos provisórios para os filhos aqui mesmo, sem nova ação — quem leu os autos com atenção aos filhos teria visto a porta aberta." },
            proxima: function (f) {
              if (f.mpuRevogada) return "fim_grave";
              if (f.retratacaoParcial && (f.protegida || f.presoFundamentado)) return "fim_otimo";
              return "fim_bom";
            } },

          { rotulo: "Nenhum: “assistência social não é papel do juízo criminal”",
            fundamento: "Contenção da atividade jurisdicional",
            efeitos: { hum: -10, tec: -4, tempo: 2 },
            carimbo: "INDEFERIDO",
            reacoes: [
              { quem: "lucia", emocao: "triste", texto: "Consigne-se, Excelência, que a rede de proteção prevista em lei deixou de ser acionada." }
            ],
            feedback: { acerto: "ruim", titulo: "Uma visão que a lei superou",
              texto: "A Lei Maria da Penha desenhou expressamente uma rede multidisciplinar articulada também pelo Judiciário (arts. 8º, 9º e 22). Tratar os encaminhamentos como “assistencialismo alheio à jurisdição” é ignorar o texto legal — e devolver Marlene, sozinha, ao exato cenário que a trouxe aqui." },
            proxima: function (f) {
              if (f.mpuRevogada) return "fim_grave";
              return "fim_bom";
            } },

          { rotulo: "Pacote completo: CREAS, grupo reflexivo para o autor, acompanhamento psicossocial E alimentos provisórios para os filhos",
            fundamento: "Lei 11.340, art. 22, V (alimentos), VI e VII (programas de reeducação e acompanhamento — Lei 13.984/2020)",
            requerFoco: "f_filhos",
            efeitos: { hum: 10, tec: 6, tempo: 10 },
            carimbo: "ENCAMINHAMENTOS DEFERIDOS",
            setFlags: { pacoteCompleto: true },
            reacoes: [
              { quem: "marlene", emocao: "surpresa", texto: "Pensão pros meninos... já? Eu nem sabia que podia pedir aqui." },
              { quem: "lucia", emocao: "feliz", texto: "Pode — e acaba de ser deferido, Marlene." }
            ],
            feedback: { acerto: "otimo", titulo: "Atacar o que prende a vítima ao ciclo",
              texto: "A dependência financeira era o nó declarado por Marlene desde a primeira fala — e o art. 22, V, da Lei Maria da Penha permite fixar alimentos provisórios na própria decisão protetiva. Os incisos VI e VII (acrescidos pela Lei 13.984/2020) completam a rede: reeducação do autor e acompanhamento psicossocial. Proteção que não cuida da subsistência é proteção pela metade." },
            proxima: function (f) {
              if (f.mpuRevogada) return "fim_grave";
              if (f.retratacaoParcial && (f.protegida || f.presoFundamentado)) return "fim_otimo";
              return "fim_bom";
            } }
        ]
      }
    },

    /* ---------------- DESFECHOS ---------------- */
    fim_otimo: {
      fim: { selo: "otimo", titulo: "Proteção com técnica",
        texto: "A audiência se encerra com Marlene sabendo, pela primeira vez, exatamente quais são seus direitos — e com um aparato real entre ela e o risco. A Dra. Lúcia guarda os autos e diz baixo, ao passar: “Hoje a rede funcionou, Excelência.” Você olha o relógio: a pauta continua." }
    },
    fim_bom: {
      fim: { selo: "bom", titulo: "Caso encaminhado",
        texto: "A audiência termina de pé: decisões sustentáveis no conjunto, com pontos que o segundo grau — e a sua consciência — ainda vão lapidar. Marlene sai acompanhada da Defensoria. Ivan sai calado. O processo segue." }
    },
    fim_grave: {
      fim: { selo: "grave", titulo: "A defesa comemora",
        texto: "A Dra. Patrícia cumprimenta Ivan com um aperto de mãos demorado. Marlene evita o seu olhar ao sair, os dois filhos esperando no corredor. A Dra. Lúcia recolhe os autos em silêncio. Alguma coisa incomoda você — e o expediente mal começou." }
    }
  }
});
