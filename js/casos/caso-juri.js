/* ============================================================
   CASO 6 — "Todos Sabem, Ninguém Viu"
   Tribunal do Júri · 1ª fase · pauta das 18:00
   ------------------------------------------------------------
   Temas: estrutura acusatória (CPP, art. 3º-A) e a tentação de
   o juiz fazer o trabalho da acusação; falso testemunho (CP,
   art. 342) — quem prende, quando, e a janela de retratação do
   §2º; CPP, arts. 211, 212, 217 e 301; Súmula Vinculante 11
   (algemas); proteção a testemunhas (Lei 9.807/99); o standard
   probatório da pronúncia (CPP, arts. 413/414; CPP, art. 155;
   REsp 1.373.356/STJ sobre "ouvir dizer"; ARE 1.067.392/STF) —
   e a tensão entre tutela efetiva da vida e devido processo
   quando a investigação confiou no que "todo mundo sabe".
   ============================================================ */

window.TOGA = window.TOGA || {};
TOGA.casos = TOGA.casos || [];

TOGA.casos.push({
  id: "juri",
  titulo: "Todos Sabem, Ninguém Viu",
  subtitulo: "Um homicídio diante de uma única testemunha — que jura não ter visto nada. E um inquérito que confiou no que 'todo mundo sabe'.",
  area: "Tribunal do Júri · 1ª fase",
  hora: "18:00",
  duracaoPrevistaMin: 90,
  tensao: 8,

  personagens: [
    { id: "fonseca", nome: "Dr. Fonseca", papel: "Promotor", assento: "esq1",
      avatar: { pele: "#d8a87f", cabelo: "curto", corCabelo: "#4a4a48", traje: "terno", corTraje: "#33424f", corGravata: "#7a2e2e", oculos: true } },
    { id: "vera", nome: "Dra. Vera", papel: "Defensora Pública", assento: "dir1",
      avatar: { pele: "#c98e66", cabelo: "coque", corCabelo: "#241505", traje: "blazer", corTraje: "#2f4a3a", corBlusa: "#efe5c8" } },
    { id: "valdir", nome: "Valdir", papel: "Réu", assento: "dir2",
      avatar: { pele: "#d8a87f", cabelo: "curto", corCabelo: "#241a10", traje: "camisa", corTraje: "#5a5a5a" } },
    { id: "osmar", nome: "Osmar", papel: "Testemunha", assento: "centro",
      avatar: { pele: "#c98e66", cabelo: "calvo", corCabelo: "#6a6258", traje: "camisa", corTraje: "#6a5a3a", barba: true } }
  ],

  autos: {
    resumo: "Valdir, 23, é acusado de matar a tiro de espingarda a madrasta, Eunice, após ela proibi-lo de usar o carro do pai. Única pessoa presente: Osmar, primo da vítima — que jura não ter visto quem atirou. O réu fugiu e foi preso 4 meses depois. O inquérito, confiante de que 'todos sabem' quem foi, não produziu prova técnica: local lavado, arma não encontrada, depoimentos de ouvir dizer. Hoje: instrução preliminar do júri (CPP, art. 411).",
    pecas: [
      { id: "denuncia", titulo: "Denúncia",
        texto: "O MP denuncia VALDIR (23 anos) por homicídio qualificado por motivo fútil (CP, art. 121, §2º, II) contra EUNICE (51), esposa de seu pai, Geraldo. Narra: Eunice 'dominava as decisões da casa' e proibira Valdir de usar o carro do pai; após discussão ao fim da tarde, Valdir teria apanhado a espingarda de caça do genitor e efetuado UM disparo contra Eunice, na sala, à presença de OSMAR, primo da vítima, fugindo em seguida. Preso preventivamente 4 meses depois, na casa de tios, em comarca vizinha." },
      { id: "inquerito", titulo: "Inquérito policial (o problema)",
        texto: "Relatório do delegado, transcrição literal: 'a autoria é de conhecimento geral na comunidade'. O local NÃO foi preservado — a casa foi lavada pela família antes da perícia. A espingarda nunca foi localizada. Sem residuograma (o réu foi preso meses depois). Laudo necroscópico: morte por disparo único de arma de carga múltipla, distância aproximada de 3 metros. Cinco depoimentos colhidos: QUATRO declarantes 'ouviram dizer' que foi Valdir; uma vizinha ouviu o estampido e viu 'um vulto correndo no quintal' — não soube dizer quem. O pai, Geraldo, recusou-se a depor (CPP, art. 206 — ascendente do acusado, não obrigado)." },
      { id: "preventiva", titulo: "Decreto de prisão preventiva",
        texto: "Preventiva decretada com fundamento na FUGA (garantia de aplicação da lei penal — CPP, art. 312): o acusado deixou a comarca na noite do fato e foi localizado 4 meses depois. Defesa não impugnou a prisão até aqui. Anotação da escrivania na contracapa: 'réu será apresentado pela escolta ALGEMADO — praxe com acusados de homicídio'." },
      { id: "osmar_ip", titulo: "Depoimento de Osmar no inquérito",
        texto: "OSMAR, 54, primo da vítima, ÚNICA pessoa presente: 'Eu estava sentado no sofá ao lado da Eunice, tomando café. Ouvi o estouro vindo da direção da porta da cozinha, atrás de mim. Me joguei no chão e fiquei. Quando criei coragem de olhar, não tinha mais ninguém em pé além de mim.' Perguntado se viu o atirador: 'NÃO VI quem atirou.' Observação do escrivão nos autos: 'o depoente reside na mesma rua que os tios do indiciado.' A sala do fato mede 12 m²." },
      { id: "contexto", titulo: "Contexto familiar e antecedentes",
        texto: "Valdir é primário, sem antecedentes; trabalhava como ajudante de carga. Declarações de vizinhos (todas POR OUVIR DIZER quanto ao fato): Eunice 'mandava na casa e no marido'; impusera a Valdir proibições de horário e do uso do carro; as discussões entre os dois eram frequentes e audíveis da calçada. Pauta de hoje (CPP, art. 411 — audiência una): oitiva de Osmar (única testemunha ocular arrolada) e interrogatório. O MP protesta, desde já, 'pela pronúncia, eis que a autoria é notória'." }
    ]
  },

  focos: [
    { id: "f_sv11", rotulo: "Algemas: regra ou exceção?", dica: "A escrivania anotou 'praxe'. A Súmula Vinculante 11 tem opinião forte sobre essa palavra." },
    { id: "f_falso", rotulo: "Falso testemunho: quem prende, quando", dica: "Antes que alguém peça prisão em audiência, monte o mapa: CP, art. 342, §2º (retratação), CPP, art. 211 (o momento) e CPP, art. 301 (quem PODE prender em flagrante)." },
    { id: "f_medo", rotulo: "O que cala uma testemunha", dica: "Osmar mora na rua dos tios do réu — o escrivão anotou isso à toa? CPP, art. 217, e Lei 9.807/99: medo se trata, não se pune." },
    { id: "f_standard", rotulo: "A régua da pronúncia", dica: "'Todos sabem' sustenta uma pronúncia? CPP, arts. 413, 414 e 155; REsp 1.373.356/STJ (ouvir dizer) e ARE 1.067.392/STF." }
  ],

  arco: {
    antes: { emocao: "medo", gesto: "angustia" },
    depois: [
      { se: function (f) { return !!f.testemunhaProtegida; }, tom: "bom",
        falas: [
          { quem: "osmar", emocao: "feliz", texto: "Doutor... eu e a patroa já estamos no endereço novo. Dormi a noite inteira pela primeira vez em meses. Dessa vez a Justiça chegou antes do medo." },
          { quem: "vera", emocao: "firme", texto: "E o processo ganhou a única testemunha ocular FALANDO, Excelência. Proteger funcionou melhor que prender — como a lei sempre disse." }
        ] },
      { se: function (f) { return f.testemunhaPresa && !f.reconsiderou; }, tom: "grave",
        falas: [
          { quem: "vera", emocao: "raiva", texto: "Osmar foi solto pelo plantão à noite, Excelência. Saiu do fórum algemado por ter vindo DE BOA VONTADE depor. Quem mais desta comarca vai aceitar uma intimação depois dessa?" }
        ] }
    ]
  },

  vidasTocadas: [
    { se: "testemunhaProtegida", tom: "bom",
      texto: "Osmar e a esposa dormem em endereço protegido — e mandaram recado: 'dessa vez a Justiça chegou antes do medo'." },
    { se: "pronunciaSolida", tom: "bom",
      texto: "O caso da espingarda vai a júri com prova de verdade — a vítima Eunice terá o julgamento que merecia." },
    { se: function (f) { return f.testemunhaPresa && !f.reconsiderou; }, tom: "grave",
      texto: "A testemunha que veio de boa vontade saiu algemada. A próxima intimação da comarca será lida com medo." }
  ],

  inicio: "j1",
  cenas: {

    j1: {
      falas: [
        { quem: "narrador", texto: "18h. A sala cheira a café requentado e fim de expediente. A escolta entra primeiro; atrás, de cabeça baixa, Valdir — pulsos algemados à frente do corpo. No banco do corredor, Osmar gira o chapéu nas mãos como quem torce roupa." },
        { quem: "vera", emocao: "firme", texto: "Excelência, antes de tudo: requeiro a retirada das algemas. Réu primário, escoltado, sem um único incidente em quatro meses de custódia. Súmula Vinculante 11." },
        { quem: "fonseca", emocao: "firme", texto: "O Ministério Público lembra que se trata de acusado de HOMICÍDIO que permaneceu foragido por quatro meses. A cautela recomenda a manutenção." }
      ],
      decisao: {
        prompt: "Algemas na audiência: a anotação da escrivania fala em 'praxe'. Sua decisão:",
        opcoes: [
          { rotulo: "Manter as algemas: 'praxe de segurança com réus de homicídio — a escolta que decida o contrário'",
            fundamento: "Cautela geral da audiência",
            efeitos: { tec: -6, hum: -4, tempo: 2 },
            carimbo: "ALGEMAS MANTIDAS",
            setFlags: { algemasMantidas: true },
            reacoes: [
              { quem: "vera", emocao: "raiva", texto: "Que conste da ata: mantidas as algemas SEM a justificativa escrita e concreta que a Súmula Vinculante 11 exige. A nulidade está semeada, Excelência." }
            ],
            feedback: { acerto: "ruim", titulo: "Dupla falha em uma frase",
              texto: "Primeira: 'praxe' é o oposto da excepcionalidade fundamentada que a SV 11 exige — a gravidade do crime, sozinha, não justifica algemas (o enunciado nasceu justamente de caso de júri). Segunda: delegar à escolta a decisão é abdicar de ato jurisdicional. Reclamação ao STF por descumprimento de súmula vinculante é cabível e a defesa acaba de anotar o caminho." },
            proxima: "j2" },

          { rotulo: "Colher informação objetiva da escolta sobre o comportamento do custodiado e decidir à luz da resposta",
            fundamento: "Decisão fundada em fato concreto, não em rótulo",
            efeitos: { tec: 4, tempo: 4 },
            carimbo: "INFORMAÇÃO COLHIDA",
            reacoes: [
              { quem: "narrador", texto: "O agente de escolta informa: quatro meses de custódia sem qualquer incidente; o preso colaborou no traslado. Você manda retirar as algemas." }
            ],
            feedback: { acerto: "bom", titulo: "Chegou ao lugar certo — com uma escala a mais",
              texto: "Buscar o dado concreto é o espírito da SV 11, e a decisão final foi sua (não da escolta — a ordem importa). O reparo é fino: os elementos já constavam dos autos (primariedade, custódia sem incidentes), de modo que a consulta era dispensável. Mas entre presumir o risco e verificá-lo, você verificou — é o lado certo da dúvida." },
            proxima: "j2" },

          { rotulo: "Retirar as algemas, consignando em ata a ausência de risco concreto: réu sem histórico de violência em atos processuais, escolta presente, sala controlada",
            fundamento: "Súmula Vinculante 11 — algemas só em caso de resistência, fundado receio de fuga ou perigo, justificado por ESCRITO; a exceção não se presume",
            requerFoco: "f_sv11",
            efeitos: { tec: 8, imp: 4, hum: 4, tempo: 4 },
            carimbo: "ALGEMAS RETIRADAS",
            setFlags: { algemasRetiradas: true },
            reacoes: [
              { quem: "valdir", emocao: "surpresa", texto: "Obrigado... senhor." },
              { quem: "fonseca", emocao: "neutro", texto: "Consigne-se o protesto do Ministério Público. Prossigamos." },
              { quem: "narrador", texto: "No banco do corredor, Osmar viu o gesto pela porta entreaberta. O chapéu parou de girar por um instante." }
            ],
            feedback: { acerto: "otimo", titulo: "A praxe que a Súmula proibiu de ser praxe",
              texto: "A SV 11 inverteu o costume forense: o uso de algemas é EXCEPCIONAL, condicionado a resistência, fundado receio de fuga ou perigo à integridade — tudo justificado por escrito, sob pena de responsabilidade do magistrado e nulidade. 'Praxe com acusados de homicídio' é exatamente a fundamentação genérica que a Súmula veda: a gravidade abstrata do crime não é risco concreto do ato. E há o efeito invisível: a testemunha amedrontada no corredor acaba de ver que, nesta sala, a lei vale para todos — inclusive para o réu." },
            proxima: "j2" }
        ]
      }
    },

    j2: {
      falas: [
        { quem: "narrador", texto: "Osmar entra, presta o compromisso de dizer a verdade (CPP, art. 203) com a voz num fio. Senta na ponta da cadeira, como quem pretende ir embora no meio." },
        { quem: "fonseca", emocao: "firme", texto: "Excelência, dada a DELICADEZA do depoimento, requeiro que Vossa Excelência conduza diretamente a inquirição, como sempre se fez nesta comarca. O juízo tem mais... autoridade sobre a testemunha." },
        { quem: "vera", emocao: "firme", texto: "Data venia, 'como sempre se fez' acabou em 2008. Artigo 212 do CPP: as partes perguntam diretamente. Quem arrolou, começa. O juízo COMPLEMENTA." }
      ],
      decisao: {
        prompt: "O MP quer o juiz no comando da inquirição. A defesa quer a lei. Como você organiza a colheita?",
        opcoes: [
          { rotulo: "Assumir a inquirição: 'a busca da verdade real autoriza o juízo a conduzir diretamente'",
            fundamento: "Verdade real e poderes instrutórios do juiz",
            efeitos: { tec: -8, imp: -6, tempo: 4 },
            carimbo: "JUÍZO NO COMANDO",
            setFlags: { juizInquisidor: true },
            reacoes: [
              { quem: "vera", emocao: "raiva", texto: "Consigne-se: inquirição conduzida pelo juízo em inversão do art. 212, com protesto da defesa para fins de nulidade — a jurisprudência do STJ agradece a economia de trabalho." }
            ],
            feedback: { acerto: "ruim", titulo: "A 'verdade real' como atalho inquisitório",
              texto: "A fórmula 'verdade real' justificou, por décadas, o juiz-protagonista que o sistema acusatório aposentou. O art. 212 tem ordem clara (partes primeiro, juiz complementa) e o STJ reconhece nulidade — ao menos relativa, com protesto consignado, como a defesa acaba de fazer — na inversão. Pior: um juiz que 'aperta' a testemunha do MP faz o trabalho do MP; o art. 3º-A chama isso pelo nome." },
            proxima: "j3" },

          { rotulo: "Aplicar o art. 212: as partes perguntam diretamente — acusação primeiro, por ter arrolado —, cabendo ao juízo indeferir abusos e complementar ao final",
            fundamento: "CPP, art. 212 (redação da Lei 11.690/2008); CPP, art. 3º-A — estrutura acusatória: quem prova é a parte",
            efeitos: { tec: 8, imp: 4, tempo: 4 },
            carimbo: "ART. 212 APLICADO",
            setFlags: { ritoAcusatorio: true },
            reacoes: [
              { quem: "fonseca", emocao: "neutro", texto: "Pois que seja pela letra da lei. Senhor Osmar... vamos conversar." },
              { quem: "osmar", emocao: "medo", texto: "Pois não, doutor..." }
            ],
            feedback: { acerto: "otimo", titulo: "O lugar do juiz na prova",
              texto: "Desde a Lei 11.690/2008, o art. 212 do CPP pôs as PARTES no comando da inquirição — perguntas diretas, começando por quem arrolou — e reservou ao juiz o papel de complementar e policiar. O art. 3º-A (Pacote Anticrime) elevou isso a princípio: estrutura acusatória, vedada a substituição da atuação probatória do órgão de acusação. 'O juízo tem mais autoridade sobre a testemunha' era exatamente o argumento do modelo inquisitório — autoridade para quê, senão para extrair a resposta que a acusação deseja?" },
            proxima: "j3" },

          { rotulo: "Liberar o promotor 'à vontade, sem intervenções do juízo, para não tolher a acusação'",
            fundamento: "Deferência à parte que arrolou",
            efeitos: { imp: -5, hum: -4, tempo: 3 },
            carimbo: "INQUIRIÇÃO LIVRE",
            setFlags: { semFiltro: true },
            reacoes: [
              { quem: "osmar", emocao: "medo", texto: "..." },
              { quem: "vera", emocao: "firme", texto: "E quem defende a testemunha dos excessos, Excelência? Ela não tem advogado." }
            ],
            feedback: { acerto: "ruim", titulo: "Direção do ato não é opcional",
              texto: "O art. 212 permite perguntas diretas — não perguntas QUAISQUER: ao juiz cabe indeferir as que induzem, humilham ou não têm relação com a causa (a regra do art. 212, caput, parte final, e o poder de polícia da audiência). Anunciar de antemão que não intervirá é renunciar à função no exato momento em que a pessoa mais frágil da sala — uma testemunha assustada, sem advogado — depende dela." },
            proxima: "j3" }
        ]
      }
    },

    j3: {
      falas: [
        { quem: "osmar", emocao: "medo", texto: "Eu tava sentado do lado dela, doutor. Do lado. O tiro veio de trás de mim, da banda da cozinha. Eu me joguei no chão e fiquei, rezando. Quando eu olhei... não tinha mais ninguém. EU NÃO VI quem atirou." },
        { quem: "fonseca", emocao: "raiva", texto: "O senhor estava a UM METRO da vítima numa sala de DOZE metros quadrados! O atirador passou pela única porta às suas costas! O senhor quer que este juízo acredite que não viu NADA?!" },
        { quem: "osmar", emocao: "medo", texto: "Não vi, doutor. Deus é testemunha... eu não vi." },
        { quem: "fonseca", emocao: "firme", texto: "Excelência, está CONFIGURADO, em flagrante, o crime de falso testemunho, artigo 342 do Código Penal. REQUEIRO que Vossa Excelência DÊ VOZ DE PRISÃO à testemunha, na forma da lei." },
        { quem: "narrador", texto: "Silêncio absoluto. O oficial de justiça olha para você. A defensora olha para você. Osmar olha para o chão. Todos esperam a bancada." }
      ],
      decisao: {
        prompt: "O Ministério Público pede que VOCÊ prenda a testemunha dele. A sala inteira espera. Sua decisão:",
        opcoes: [
          { rotulo: "Deferir: dar voz de prisão em flagrante a Osmar por falso testemunho, determinando a lavratura do auto",
            fundamento: "CP, art. 342; poder geral de polícia da audiência",
            efeitos: { tec: -12, imp: -10, hum: -8, tempo: 8 },
            carimbo: "VOZ DE PRISÃO",
            setFlags: { testemunhaPresa: true },
            evento: "prisao:osmar",
            reacoes: [
              { quem: "narrador", texto: "O oficial de justiça hesita meio segundo antes de pousar a mão no ombro de Osmar — meio segundo que a sala inteira percebeu." },
              { quem: "osmar", emocao: "choro", texto: "Eu tenho mulher doente em casa, doutor! Eu vim porque fui intimado! Eu vim de boa vontade!" },
              { quem: "vera", emocao: "raiva", texto: "Impetrarei habeas corpus ao plantão AINDA HOJE — e arguirei a suspeição de Vossa Excelência: o juízo acaba de declarar qual versão dos fatos considera verdadeira ANTES de julgar." }
            ],
            feedback: { acerto: "grave", titulo: "A prisão que decide o mérito sem julgá-lo",
              texto: "Tudo errado, em ordem: o §2º do art. 342 do CP mantém aberta a retratação até a sentença — o 'crime' que você prendeu ainda pode deixar de existir por ato lícito do próprio preso; o art. 211 do CPP reserva a providência para o momento da sentença, por cópias à autoridade policial; e ao prender a testemunha por 'mentir', o juízo afirmou publicamente que a verdade é a versão da acusação — prejulgamento que contamina a imparcialidade e rende suspeição. O MP, que podia prender pelo art. 301 e não quis, conseguiu o que queria: a responsabilidade é toda sua agora." },
            proxima: "j4p" },

          { rotulo: "Indeferir E tratar a causa do silêncio: suspender o ato, RETIRAR O RÉU da sala ante o visível temor (CPP, art. 217), informar a testemunha sobre proteção oficial (Lei 9.807/99) e reinquirir",
            fundamento: "CPP, art. 217 — se a presença do réu causar temor que prejudique a verdade do depoimento, retira-se o réu; Lei 9.807/99 — programa de proteção",
            requerFoco: "f_medo",
            efeitos: { tec: 10, hum: 8, imp: 4, tempo: 10 },
            carimbo: "ART. 217 APLICADO",
            setFlags: { temorAcolhido: true },
            reacoes: [
              { quem: "vera", emocao: "neutro", texto: "A defesa nada opõe à retirada, Excelência — desde que assegurada a ciência integral do depoimento ao réu, como manda a lei. Estarei presente." },
              { quem: "osmar", emocao: "surpresa", texto: "Proteção...? Existe isso... pra gente como eu?" },
              { quem: "narrador", texto: "Valdir é conduzido à antessala sem protesto. A porta fecha. Os ombros de Osmar descem dois centímetros." }
            ],
            feedback: { acerto: "otimo", titulo: "O juiz que leu a testemunha, não só o depoimento",
              texto: "Os autos davam todas as pistas: Osmar mora NA RUA DOS TIOS do réu (o escrivão anotou), depõe sozinho, sem advogado, e nega o que a geometria da sala torna quase impossível não ter visto. Isso não é perfil de mentiroso — é perfil de pessoa com medo. O art. 217 do CPP existe exatamente para isso: constatado que a presença do réu inibe a verdade, retira-se o réu (preservados defesa técnica e ciência integral do ato). E a Lei 9.807/99 oferece o que a ameaça de prisão jamais ofereceria: uma saída segura para dizer a verdade. Punir o medo produz silêncio; tratá-lo, às vezes, produz prova." },
            proxima: "j4a" },

          { rotulo: "Apertar você mesmo: 'senhor Osmar, ou o senhor diz JÁ o que viu, ou sai desta sala preso. Escolha.'",
            fundamento: "Advertência enérgica como instrumento de busca da verdade",
            efeitos: { tec: -6, hum: -8, imp: -6, tempo: 4 },
            carimbo: "TESTEMUNHA ADVERTIDA",
            setFlags: { testemunhaCoagida: true },
            reacoes: [
              { quem: "osmar", emocao: "choro", texto: "Pode me prender então, doutor... Preso eu fico vivo. Eu NÃO VI nada." },
              { quem: "vera", emocao: "firme", texto: "Consigne-se que a testemunha depôs sob ameaça expressa de prisão formulada pela bancada — a defesa usará cada palavra desta ata." }
            ],
            feedback: { acerto: "grave", titulo: "A resposta de Osmar disse tudo",
              texto: "'Preso eu fico vivo.' A ameaça da bancada não quebrou o silêncio — revelou o motivo dele, e da pior forma: agora consta da ata que a testemunha teme por sua vida E que o juízo respondeu a esse medo com coação. Depoimento obtido sob ameaça nasce imprestável, a advertência do compromisso (CPP, art. 203) já fora feita no início do ato, e o caminho que funcionaria — art. 217 e Lei 9.807 — continuava ali, disponível, a um despacho de distância." },
            proxima: "j5s" },

          { rotulo: "Indeferir com o mapa legal completo: a retratação é possível até a sentença (CP, 342, §2º) — logo não há crime consumado a prender; o momento próprio é o do art. 211 do CPP; e, se o MP enxerga flagrante, o art. 301 lhe permite agir por conta própria — este juízo não fará as vezes da acusação",
            fundamento: "CP, art. 342, §2º (retratação extingue a punibilidade); CPP, art. 211 (remessa ao sentenciar); CPP, art. 301 (qualquer do povo PODE prender); CPP, art. 3º-A",
            requerFoco: "f_falso",
            efeitos: { tec: 12, imp: 6, tempo: 6 },
            carimbo: "REQUERIMENTO INDEFERIDO",
            setFlags: { recusouFlagrante: true },
            reacoes: [
              { quem: "fonseca", emocao: "raiva", texto: "Consigne-se. O Ministério Público... avaliará as providências que lhe competem." },
              { quem: "vera", emocao: "feliz", texto: "A estrutura acusatória agradece, Excelência. Cada um no seu ofício." },
              { quem: "narrador", texto: "O Dr. Fonseca não dá voz de prisão a ninguém. Pedir que outro prenda era mais confortável do que prender." }
            ],
            feedback: { acerto: "otimo", titulo: "Devolver a responsabilidade ao seu dono",
              texto: "Três camadas, todas certas. <b>Uma:</b> o §2º do art. 342 extingue a punibilidade se a testemunha se retratar ANTES da sentença do processo em que depôs — prender agora é prender quem ainda pode, licitamente, desdizer-se; por isso o art. 211 do CPP manda o juiz, AO SENTENCIAR, remeter cópias à autoridade policial, e não algemar no meio da instrução. <b>Duas:</b> o juiz que prende 'sua' testemunha por mentir declara, na prática, qual versão já escolheu como verdadeira — adeus imparcialidade. <b>Três, a mais fina:</b> o art. 301 permite a QUALQUER pessoa — promotor incluído — dar voz de prisão em flagrante. Se o MP não o fez, é porque queria o resultado sem a responsabilidade. O art. 3º-A existe para esta cena." },
            proxima: "j5s" }
        ]
      }
    },

    /* ---- Ramo da prisão: a chance de reconsiderar ---- */
    j4p: {
      falas: [
        { quem: "narrador", texto: "Osmar está de pé, trêmulo, entre o oficial e a porta. A Dra. Vera já redige o habeas corpus no balcão, à mão. O Dr. Fonseca examina as próprias unhas com extremo interesse — conseguiu o que pediu sem assinar nada." },
        { quem: "vera", emocao: "firme", texto: "Última ponderação antes de o auto ser lavrado, Excelência: a retratação do artigo 342, parágrafo segundo, continua aberta até a sentença. Vossa Excelência está prendendo um crime que ainda pode deixar de existir." }
      ],
      decisao: {
        prompt: "O auto ainda não foi lavrado. Há uma janela estreita para reconsiderar — ou para insistir.",
        opcoes: [
          { rotulo: "Manter a prisão: 'a autoridade da Justiça não recua diante de protesto de balcão. Lavre-se o auto.'",
            fundamento: "Preservação da autoridade do juízo",
            efeitos: { tec: -8, imp: -8, hum: -6, tempo: 6 },
            carimbo: "PRISÃO MANTIDA",
            setFlags: { orgulhoTogado: true, manchaGrave: true },
            reacoes: [
              { quem: "narrador", texto: "Osmar sai escoltado pelo mesmo corredor por onde entrou de boa vontade, intimado, três horas antes. A audiência prossegue sem a única testemunha ocular do processo." },
              { quem: "vera", emocao: "raiva", texto: "Habeas corpus, suspeição e representação à Corregedoria, Excelência. Nesta ordem. Ainda hoje." }
            ],
            feedback: { acerto: "grave", titulo: "Autoridade que não recua, decisão que não fica de pé",
              texto: "Confundir autoridade com inflexibilidade custa caro: o plantão concederá o HC com a tese servida de bandeja (retratação aberta — CP, art. 342, §2º; momento errado — CPP, art. 211), a suspeição ganhou corpo, e o processo de homicídio perdeu, possivelmente para sempre, a colaboração da única pessoa que estava na sala do crime. A vítima Eunice merecia uma instrução melhor que isto." },
            proxima: "j5s" },

          { rotulo: "Reconsiderar IMEDIATAMENTE em ata: revogar a voz de prisão, reconhecer o excesso, retirar o réu da sala (CPP, art. 217) e reabrir a oitiva com a oferta de proteção da Lei 9.807",
            fundamento: "Autotutela da decisão judicial; CP, art. 342, §2º; CPP, art. 217; Lei 9.807/99",
            efeitos: { tec: 6, hum: 8, tempo: 8 },
            carimbo: "DECISÃO RECONSIDERADA",
            setFlags: { reconsiderou: true },
            evento: "soltura:osmar",
            reacoes: [
              { quem: "osmar", emocao: "choro", texto: "Eu posso... sentar de novo?" },
              { quem: "vera", emocao: "neutro", texto: "A defesa registra que reconsiderar no ato é o que distingue erro de erro consumado, Excelência. O habeas corpus volta para o bolso." }
            ],
            feedback: { acerto: "bom", titulo: "Errar e corrigir no ato ainda é juízo funcionando",
              texto: "A reconsideração imediata desarma a nulidade maior, recoloca o ato nos trilhos do art. 217 e da Lei 9.807, e — não é pouco — mostra à sala que a bancada se submete à lei que aplica. A cicatriz fica: Osmar precisará de coragem extra para confiar na mesma autoridade que mandou prendê-lo minutos atrás. Mas entre o orgulho e o processo, você escolheu o processo." },
            proxima: "j4a" }
        ]
      }
    },

    /* ---- Ramo do art. 217: a reinquirição sem o réu ---- */
    j4a: {
      falas: [
        { quem: "narrador", texto: "Sem o réu na sala, o ar muda de peso. A defensora permanece, atenta. Osmar bebe a água inteira do copo antes de falar." },
        { quem: "osmar", emocao: "medo", texto: "Doutor... ele mora na rua dos tios dele agora, sabia? Quer dizer, morava. Minha mulher passa naquela rua TODO DIA pra ir na farmácia. Todo santo dia." },
        { quem: "osmar", emocao: "choro", texto: "Eu vi, doutor. Deus me perdoe. O tiro veio, eu me joguei no chão, mas eu olhei — claro que eu olhei. Era o Valdir, saindo da cozinha com a espingarda do Geraldo na mão. Eu vi o rosto dele. Eu CONHEÇO o rosto dele desde menino." },
        { quem: "narrador", texto: "A caneta do Dr. Fonseca para no ar. A Dra. Vera fecha os olhos por um segundo — o trabalho dela acaba de dobrar de tamanho." }
      ],
      decisao: {
        prompt: "A revelação veio. Agora ela precisa virar PROVA que sobreviva ao processo. Como você a consolida?",
        opcoes: [
          { rotulo: "Encerrar a oitiva IMEDIATAMENTE, 'antes que ele volte atrás', e indeferir reperguntas da defesa por 'desnecessárias'",
            fundamento: "Preservação do resultado útil do depoimento",
            efeitos: { tec: -8, imp: -6, tempo: 4 },
            carimbo: "OITIVA ENCERRADA",
            setFlags: { provaJudicial: true, contraditorioFerido: true },
            reacoes: [
              { quem: "vera", emocao: "raiva", texto: "Indeferir REPERGUNTAS ao único depoimento incriminador do processo?! Consigne-se. É a primeira tese da apelação, Excelência — e Vossa Excelência acabou de escrevê-la para mim." }
            ],
            feedback: { acerto: "grave", titulo: "A pressa que devora a própria prova",
              texto: "Um depoimento que incrimina o réu e NÃO passou pelo crivo da defesa é prova nascida morta: cerceamento de defesa puro (CF, art. 5º, LV), nulidade quase certeira. A ironia é total — você tinha, enfim, o relato que faltava, e o inutilizou para 'protegê-lo'. Verdade que não atravessa o contraditório não serve ao processo penal; era a lição de todo o dia de hoje." },
            proxima: "j5r" },

          { rotulo: "Receber a virada com desconfiança formal: 'há minutos o senhor jurava o contrário — registro a contradição e o juízo dará a ela o peso que merece'",
            fundamento: "Cautela na valoração de testemunho volátil",
            efeitos: { tec: 2, hum: -4, tempo: 4 },
            carimbo: "CONTRADIÇÃO REGISTRADA",
            setFlags: { provaJudicial: true },
            reacoes: [
              { quem: "osmar", emocao: "vergonha", texto: "Eu menti com medo, doutor... agora eu tô falando com medo TAMBÉM, só que falando. Isso não conta?" }
            ],
            feedback: { acerto: "bom", titulo: "Cautela certa, frieza desnecessária",
              texto: "Registrar a contradição é dever — credibilidade se afere no conjunto, e a defesa explorará a virada de qualquer forma. Mas a pergunta de Osmar merece resposta técnica: conta, sim. Retratação com explicação verossímil (medo documentado nos autos: a anotação do escrivão sobre a vizinhança) e razão de ciência concreta vale MAIS, não menos, que uma negativa monocórdica. O registro frio, sem acolher o custo humano do gesto, quase devolveu a testemunha à concha." },
            proxima: "j5r" },

          { rotulo: "Consolidar com contraditório completo: registrar integralmente, dar ciência do inteiro teor ao réu quando retornar, facultar reperguntas à defesa E encaminhar Osmar, desde logo, à avaliação do programa de proteção",
            fundamento: "CPP, art. 217, parte final (ciência ao réu) c/c art. 226 e garantias da ampla defesa; Lei 9.807/99, arts. 1º e 5º",
            efeitos: { tec: 10, imp: 6, hum: 6, tempo: 10 },
            carimbo: "DEPOIMENTO CONSOLIDADO",
            setFlags: { provaJudicial: true, testemunhaProtegida: true },
            reacoes: [
              { quem: "vera", emocao: "firme", texto: "A defesa repergunta, Excelência — longamente. E desde já requer a degravação integral. Mas reconheço: o ato está sendo conduzido como manda o figurino." },
              { quem: "osmar", emocao: "neutro", texto: "Falar a verdade com proteção, doutor... isso eu aguento. O que eu não aguentava era falar sozinho." }
            ],
            feedback: { acerto: "otimo", titulo: "Prova que nasce pronta para ser atacada — e resistir",
              texto: "A retirada do réu (art. 217) é válida exatamente porque NÃO suprime a defesa: o advogado permanece, o réu recebe ciência integral, as reperguntas são asseguradas. Um relato ocular com razão de ciência detalhada ('conheço o rosto dele desde menino'), explicação verossímil para a reticência anterior (o medo, agora documentado) e contraditório pleno é o tipo de indício que sustenta pronúncia sem corar. E a proteção da Lei 9.807 garante que essa prova chegue VIVA ao plenário — em todos os sentidos." },
            proxima: "j5r" }
        ]
      }
    },

    /* ---- Encerramento SEM a revelação ---- */
    j5s: {
      falas: [
        { quem: "narrador", texto: "Interrogatório. Orientado pela defesa, Valdir exerce o direito ao silêncio — que não pode prejudicá-lo (CF, art. 5º, LXIII; CPP, art. 186, parágrafo único). Alegações orais." },
        { quem: "fonseca", emocao: "firme", texto: "A autoria é NOTÓRIA, Excelência. A comunidade inteira sabe. A fuga fala. Quatro depoimentos apontam o réu. In dubio pro societate: PRONUNCIE-SE, e que o júri — juiz natural desta causa — decida." },
        { quem: "vera", emocao: "firme", texto: "Quatro depoimentos de OUVIR DIZER, Excelência, repetindo o mesmo boato de calçada. Local lavado, arma inexistente, perícia nenhuma. O que o MP chama de notoriedade, o CPP chama de ausência de prova. Impronúncia, na forma do art. 414." }
      ],
      decisao: {
        prompt: "Fim da primeira fase. Sobre a mesa: fuga, boatos uníssonos e um inquérito que não fez o dever de casa. Sua decisão (CPP, arts. 413 a 419):",
        opcoes: [
          { rotulo: "PRONUNCIAR: 'havendo QUALQUER dúvida, in dubio pro societate — quem julga homicídio nesta comarca é o júri, não este juízo'",
            fundamento: "CF, art. 5º, XXXVIII — soberania do júri; dúvida resolve-se a favor da sociedade na pronúncia",
            efeitos: { tec: -10, tempo: 6 },
            carimbo: "PRONUNCIADO",
            setFlags: { pronunciaFragil: true },
            reacoes: [
              { quem: "vera", emocao: "firme", texto: "Pronúncia fundada em boato e inquérito vazio, Excelência. O recurso em sentido estrito segue amanhã cedo — com o ARE 1.067.392 na primeira página." }
            ],
            feedback: { acerto: "ruim", titulo: "O brocardo que o standard aposentou",
              texto: "A competência do júri pressupõe acusação ADMISSÍVEL — e é o juiz da pronúncia quem faz esse filtro (CPP, art. 413: 'indícios suficientes', não 'qualquer coisa'). Mandar a plenário um processo lastreado em ouvir-dizer e elementos exclusivos do inquérito contraria o art. 155 do CPP, o REsp 1.373.356 e a leitura do STF no ARE 1.067.392: 'in dubio pro societate' não é standard probatório, é renúncia a ter um. O TJ cassará — e o tempo perdido correrá contra a memória das provas que ainda poderiam ser feitas." },
            proxima: function (f) { return "fim_ruim"; } },

          { rotulo: "Determinar DE OFÍCIO as diligências que a polícia não fez: busca da arma na casa dos tios, perícia complementar, quebra de sigilo telefônico do réu",
            fundamento: "CPP, art. 156 — poderes instrutórios residuais do juiz",
            efeitos: { tec: -6, imp: -8, tempo: 8 },
            carimbo: "DILIGÊNCIAS DE OFÍCIO",
            setFlags: { juizInvestigador: true },
            reacoes: [
              { quem: "vera", emocao: "raiva", texto: "O juízo acaba de assumir a investigação que a acusação abandonou. Artigo 3º-A do CPP, Excelência: consigne-se, é matéria de suspeição." },
              { quem: "fonseca", emocao: "feliz", texto: "O Ministério Público nada opõe, evidentemente." }
            ],
            feedback: { acerto: "ruim", titulo: "O juiz que veste a gravata do promotor",
              texto: "O sorriso do Dr. Fonseca diz tudo: quem deveria ter requerido essas diligências era ELE (CPP, art. 402) — e não o fez nem na fase própria. O art. 3º-A veda expressamente 'a substituição da atuação probatória do órgão de acusação': um juiz que sai à caça da prova que falta à denúncia já escolheu lado, ainda que de boa-fé. O caminho institucional era outro: impronunciar e remeter cópias — o Estado-investigação que se mova, não o Estado-juiz." },
            proxima: function (f) { return "fim_ruim"; } },

          { rotulo: "IMPRONUNCIAR (CPP, art. 414): não há indícios VÁLIDOS de autoria — ouvir dizer não é indício e o que resta é exclusivo do inquérito; consignar que nova denúncia é possível com prova nova (§ único) e remeter cópias ao MP pelas falhas da investigação",
            fundamento: "CPP, arts. 414 e 155; REsp 1.373.356/STJ — testemunho de ouvir dizer não autoriza pronúncia; ARE 1.067.392/STF — pronúncia exige standard probatório real",
            requerFoco: "f_standard",
            efeitos: { tec: 12, tempo: 10 },
            carimbo: "IMPRONUNCIADO",
            setFlags: { impronunciado: true, oficioInvestigacao: true },
            reacoes: [
              { quem: "fonseca", emocao: "raiva", texto: "Recurso em sentido estrito, Excelência. E que a comarca julgue a mensagem que sai desta sala hoje." },
              { quem: "vera", emocao: "neutro", texto: "A mensagem, Doutor Fonseca, é que prova se PRODUZ. Está tudo no ofício que Sua Excelência mandou anexar." },
              { quem: "narrador", texto: "Valdir não comemora. Talvez saiba, melhor que todos, o que a decisão diz — e o que ela não diz." }
            ],
            feedback: { acerto: "otimo", titulo: "A decisão mais difícil é a que mantém a régua",
              texto: "Pronúncia exige <b>indícios suficientes de autoria</b> (CPP, art. 413) — e o processo oferece: quatro 'ouvir dizer' (que o STJ, no REsp 1.373.356, recusa como lastro de pronúncia), um vulto sem rosto e uma fuga. O 'in dubio pro societate' não é alvará para terceirizar ao júri a ausência de prova (ARE 1.067.392/STF), e o art. 155 veda decidir com base exclusiva no inquérito — que aqui, ainda por cima, não produziu nada. A impronúncia não absolve nem proclama inocência: devolve o caso ao Estado com o recado de que investigar é dever, não formalidade (art. 414, § único — prova nova reabre tudo). A tutela da vida de Eunice se honra com prova, não com atalho." },
            proxima: function (f) { return f.testemunhaPresa ? "fim_grave" : "fim_bom_s"; } },

          { rotulo: "Antes de decidir, abrir vista ao MP: requer diligências complementares (CPP, art. 402)?",
            fundamento: "CPP, art. 402 — requerimentos ao fim da instrução; a iniciativa é das partes",
            efeitos: { tec: 4, tempo: 6 },
            carimbo: "VISTA AO MP",
            reacoes: [
              { quem: "fonseca", emocao: "firme", texto: "O Ministério Público nada mais requer, Excelência. A prova dos autos é SUFICIENTE — a autoria é de conhecimento geral." },
              { quem: "narrador", texto: "A porta que você abriu, a acusação fechou por dentro. Agora não há mais para onde adiar: decida." }
            ],
            feedback: { acerto: "bom", titulo: "A pergunta certa, a resposta reveladora",
              texto: "Abrir vista respeita a estrutura acusatória na perfeição: a iniciativa probatória é da parte (CPP, arts. 402 e 3º-A), e o juiz que PERGUNTA não se confunde com o juiz que PROVIDENCIA. A recusa do MP, registrada em ata, ainda rende um subproduto valioso: ninguém poderá dizer, no recurso, que o juízo atropelou a acusação. O custo foi só o relógio — e a constatação de que a convicção do Dr. Fonseca dispensa fatos." },
            proxima: "j5s2" }
        ]
      }
    },

    j5s2: {
      falas: [
        { quem: "narrador", texto: "O MP nada requereu. A defesa reitera a impronúncia. Os autos esperam a sua caneta — e a comarca, lá fora, espera outra coisa." }
      ],
      decisao: {
        prompt: "Sem diligências novas, a decisão volta inteira para você:",
        opcoes: [
          { rotulo: "IMPRONUNCIAR (CPP, art. 414), com remessa de cópias ao MP pelas falhas do inquérito e registro expresso da cláusula de prova nova",
            fundamento: "CPP, arts. 414 e 155; REsp 1.373.356/STJ; ARE 1.067.392/STF",
            requerFoco: "f_standard",
            efeitos: { tec: 10, tempo: 8 },
            carimbo: "IMPRONUNCIADO",
            setFlags: { impronunciado: true, oficioInvestigacao: true },
            reacoes: [
              { quem: "fonseca", emocao: "raiva", texto: "Recurso em sentido estrito. E registro: a comunidade não entenderá." },
              { quem: "vera", emocao: "neutro", texto: "Compreender é trabalho de quem explica, Doutor. A decisão explica-se sozinha." }
            ],
            feedback: { acerto: "otimo", titulo: "Standard mantido até o fim",
              texto: "Com a recusa do MP registrada, a impronúncia fica blindada: você ofereceu a via legítima de completar a prova (art. 402), a acusação declinou, e o que sobra nos autos — ouvir-dizer e inquérito vazio — não alcança o piso do art. 413 (REsp 1.373.356; ARE 1.067.392; CPP, art. 155). O § único do art. 414 mantém a porta aberta: surgida prova nova (uma arma encontrada, um residuograma, um relato direto), nova denúncia cabe. Rigor hoje é a condição da condenação válida amanhã." },
            proxima: function (f) { return f.testemunhaPresa ? "fim_grave" : "fim_bom_s"; } },

          { rotulo: "PRONUNCIAR assim mesmo: a fuga + a unanimidade dos boatos formam 'indício suficiente' para o júri decidir",
            fundamento: "Fuga como indício de autoria; juiz natural do homicídio é o júri",
            efeitos: { tec: -8, tempo: 5 },
            carimbo: "PRONUNCIADO",
            setFlags: { pronunciaFragil: true },
            feedback: { acerto: "ruim", titulo: "Fuga corrobora — não constitui",
              texto: "A fuga é indício acessório: REFORÇA um lastro probatório que exista, mas não o substitui (pessoas inocentes fogem de comunidades que já as condenaram — é exatamente o cenário que 'todos sabem' fabrica). Boato repetido por quatro bocas continua sendo UM boato. Sem nenhum elemento direto produzido em juízo, a pronúncia viola o art. 413 c/c o art. 155 do CPP e será cassada no RESE que a defesa já anunciou." },
            proxima: function (f) { return "fim_ruim"; } }
        ]
      }
    },

    /* ---- Encerramento COM a revelação ---- */
    j5r: {
      falas: [
        { quem: "narrador", texto: "O réu retorna e recebe ciência integral do depoimento. Fica imóvel um longo segundo — depois baixa os olhos. Interrogatório: orientado pela defesa, exerce o direito ao silêncio (CF, art. 5º, LXIII), que não o prejudica (CPP, art. 186, parágrafo único). Alegações orais." },
        { quem: "fonseca", emocao: "firme", texto: "Agora há relato OCULAR, colhido em juízo, sob contraditório, com razão de ciência. Somem-se o laudo, a dinâmica, a fuga. Pronúncia, Excelência — sem hesitação." },
        { quem: "vera", emocao: "firme", texto: "Relato de quem jurou o CONTRÁRIO minutos antes, Excelência. A defesa sustenta a fragilidade da virada e, subsidiariamente, requer que toda valoração aprofundada de credibilidade seja reservada ao plenário — como deve ser." }
      ],
      decisao: {
        prompt: "Agora existe prova judicial. Resta calibrar a decisão de pronúncia — e os seus limites:",
        opcoes: [
          { rotulo: "IMPRONUNCIAR mesmo assim: 'testemunha que muda de versão na mesma tarde não merece fé — e sem ela, nada resta'",
            fundamento: "Livre convencimento; fragilidade do testemunho volátil",
            efeitos: { tec: -8, tempo: 6 },
            carimbo: "IMPRONUNCIADO",
            setFlags: { impronunciaCega: true },
            reacoes: [
              { quem: "fonseca", emocao: "raiva", texto: "O juízo aplicou o artigo 217, colheu a verdade que o medo escondia — e agora a DESCARTA porque ela demorou a sair?! Recurso em sentido estrito, com URGÊNCIA." }
            ],
            feedback: { acerto: "ruim", titulo: "Usurpar o júri pelo caminho inverso",
              texto: "Há simetria no erro: pronunciar sem prova rouba do réu o filtro do art. 413; impronunciar DESPREZANDO prova judicial idônea rouba do júri a valoração que a Constituição lhe reservou (art. 5º, XXXVIII, 'd'). Na pronúncia, o juiz não escolhe em quem acredita 'em profundidade' — verifica se o indício é sério, e este é: ocular, contraditado, com razão de ciência e explicação documentada para a reticência (o medo que VOCÊ mesmo tratou pelo art. 217). Recusá-lo é punir o sistema por ter funcionado." },
            proxima: function (f) { return "fim_ruim"; } },

          { rotulo: "PRONUNCIAR nos exatos termos da denúncia: indício ocular judicializado + corroboração (laudo, dinâmica, fuga); manter a preventiva pela fuga (CPP, art. 312) e reforçar a proteção de Osmar até o plenário",
            fundamento: "CPP, art. 413 — materialidade certa + indícios suficientes de autoria; valoração profunda de credibilidade pertence ao júri (CF, art. 5º, XXXVIII)",
            requerFoco: "f_standard",
            efeitos: { tec: 12, imp: 4, tempo: 10 },
            carimbo: "PRONUNCIADO",
            setFlags: { pronunciaSolida: true },
            reacoes: [
              { quem: "vera", emocao: "neutro", texto: "Recorrerei, Excelência — é meu ofício. Mas registro: a decisão limitou-se ao juízo de admissibilidade, como manda a doutrina. O plenário será o nosso campo." },
              { quem: "fonseca", emocao: "neutro", texto: "O Ministério Público, desta vez, nada tem a consignar." },
              { quem: "narrador", texto: "É a primeira frase do Dr. Fonseca sem a palavra 'notório' em toda a audiência." }
            ],
            feedback: { acerto: "otimo", titulo: "Pronúncia que conhece o próprio tamanho",
              texto: "A decisão acerta nos dois sentidos. <b>No que faz:</b> reconhece que relato ocular colhido em juízo, sob contraditório, com razão de ciência e medo documentado explica a reticência inicial — somado ao laudo e à fuga, é exatamente o 'indício suficiente' do art. 413; a credibilidade FINA da virada será esmiuçada onde a Constituição quer: diante dos jurados. <b>No que NÃO faz:</b> não condena, não adjetiva, não excede a denúncia — pronúncia é juízo de admissibilidade e o excesso de linguagem é causa clássica de cassação. A preventiva mantém-se no seu fundamento original (fuga) e a proteção de Osmar garante que a prova chegue inteira ao plenário." },
            proxima: function (f) { return f.contraditorioFerido ? "fim_ruim" : "fim_otimo_r"; } },

          { rotulo: "Pronunciar E ampliar: reconhecer de ofício a qualificadora da surpresa (recurso que dificultou a defesa da vítima), 'evidente na dinâmica do tiro pelas costas'",
            fundamento: "CP, art. 121, §2º, IV; a prova da audiência revelou a dinâmica",
            efeitos: { tec: -8, tempo: 6 },
            carimbo: "PRONÚNCIA AMPLIADA",
            setFlags: { excessoPronuncia: true },
            reacoes: [
              { quem: "vera", emocao: "raiva", texto: "Qualificadora que NÃO consta da denúncia, Excelência! Sem aditamento do Ministério Público?! O juízo acaba de acusar — consigne-se, é a segunda toga que o magistrado veste hoje." }
            ],
            feedback: { acerto: "grave", titulo: "A pronúncia não acusa — admite a acusação",
              texto: "Qualificadora é matéria de ACUSAÇÃO: se a instrução revelou circunstância nova, o caminho é o aditamento da denúncia PELO MP (CPP, art. 384 — mutatio libelli), com reabertura de defesa; jamais a inclusão de ofício pelo juiz na pronúncia, que deve guardar correlação com a peça acusatória. Ao 'completar' o trabalho do Dr. Fonseca, o juízo violou o art. 3º-A na decisão mais importante do dia — e entregou à defesa uma nulidade de mão beijada, que pode derrubar inclusive a parte boa da pronúncia." },
            proxima: function (f) { return "fim_ruim"; } }
        ]
      }
    },

    /* ---------------- DESFECHOS ---------------- */
    fim_otimo_r: {
      fim: { selo: "otimo", titulo: "O júri decidirá — com prova de verdade",
        texto: "São quase nove da noite quando o martelo desce pela última vez. Valdir volta à custódia em silêncio; Osmar sai por uma porta lateral, acompanhado pela equipe de proteção, levando no bolso o papel com o telefone do programa. A Dra. Vera guarda os autos já desenhando o plenário; o Dr. Fonseca, pela primeira vez no dia, leva trabalho de verdade para casa. No corredor escuro, você pensa em Eunice — e na diferença entre vingá-la e julgá-la com justiça. A pronúncia que você assinou sabe essa diferença de cor." }
    },
    fim_bom_s: {
      fim: { selo: "bom", titulo: "A decisão que a comarca não vai entender hoje",
        texto: "A impronúncia sai com a fundamentação mais cuidadosa do seu dia — e você sabe que não bastará: na padaria, amanhã, ela terá virado 'soltaram o assassino'. Mas dentro dos autos ficou o ofício cobrando a investigação que não houve, e a porta do art. 414, parágrafo único, aberta de par em par: apareça a arma, apareça um relato direto, e o caso volta. O Estado falhou com Eunice duas vezes — na proteção e na investigação. Você se recusou a falhar na terceira: a do julgamento honesto. Há noites em que a toga pesa exatamente o que deve pesar." }
    },
    fim_ruim: {
      fim: { selo: "ruim", titulo: "Decisão com prazo de validade",
        texto: "A audiência termina tarde e mal. Cada um sai carregando a sua versão da injustiça — e o recurso da parte vencida, todos sabem, tem mais chão que a sua decisão. No gabinete escuro, relendo a ata, você consegue apontar o minuto exato em que o caso escapou. Os autos voltarão; os erros, espera-se, não." }
    },
    fim_grave: {
      fim: { selo: "grave", titulo: "A noite em que a testemunha saiu presa",
        texto: "A imagem que a comarca guardará do dia não é a do réu, nem a da vítima: é a de Osmar, intimado de boa vontade, atravessando o corredor do fórum entre dois policiais. O habeas corpus já está no plantão; a suspeição, protocolada; e a pergunta que ficou suspensa na sala vazia é a que nenhum recurso responde: quem, naquela comunidade, vai aceitar testemunhar de novo?" }
    }
  }
});
