/* ============================================================
   CASO: PLANTÃO JUDICIÁRIO — "O sangue de Davi"
   ------------------------------------------------------------
   22h20. O hospital municipal aciona o plantão: Davi, 4 anos,
   sofre hemorragia interna e precisa de transfusão em horas.
   Os pais — amorosos, aterrorizados — recusam por convicção
   religiosa e pedem tratamento alternativo que o médico afirma
   ser insuficiente. O dilema: suprir o consentimento protegendo
   a VIDA da criança sem julgar a fé dos pais e sem medidas
   desproporcionais. A criança não professa credo por si.

   Fundamentos centrais: CF, arts. 5º, caput, e 227; ECA,
   arts. 98, I, e 101 (e art. 100, par. único — intervenção
   mínima); CC, art. 1.634; distinção com o adulto capaz:
   STF, RE 979.742/AM — Tema 1069 (autonomia do paciente
   Testemunha de Jeová); Resolução CFM 2.232/2019.
   ============================================================ */

window.TOGA = window.TOGA || {};
TOGA.casos.push({
  id: "transfusao",
  titulo: "Plantão — O sangue de Davi",
  subtitulo: "Quatro anos, hemorragia, horas de vida. A fé dos pais é deles. A vida em risco é do filho.",
  area: "Plantão Judiciário — Urgência Médica",
  hora: "22:20",
  duracaoPrevistaMin: 35,
  tensao: 10,

  personagens: [
    { id: "hugo", nome: "Dr. Hugo", papel: "Médico Plantonista", assento: "centro",
      avatar: { pele: "#d8a87f", cabelo: "curto", corCabelo: "#3a2a1a", traje: "camisa", corTraje: "#e8e8e2", oculos: true } },
    { id: "elder", nome: "Élder", papel: "Pai", assento: "dir1",
      avatar: { pele: "#a86a48", cabelo: "curto", corCabelo: "#241505", traje: "camisa", corTraje: "#4a5568", barba: true } },
    { id: "talita", nome: "Talita", papel: "Mãe", assento: "dir2",
      avatar: { pele: "#c98e66", cabelo: "longo", corCabelo: "#241505", traje: "vestido", corTraje: "#5a4a62" } },
    { id: "cintia", nome: "Dra. Cíntia", papel: "Promotora", assento: "esq1",
      avatar: { pele: "#e8c39a", cabelo: "coque", corCabelo: "#241a10", traje: "blazer", corTraje: "#33424f", corBlusa: "#efe5c8" } },
    { id: "nara", nome: "Dra. Nara", papel: "Advogada da família", assento: "esq2",
      avatar: { pele: "#8a5436", cabelo: "longo", corCabelo: "#1d1208", traje: "blazer", corTraje: "#54453a", corBlusa: "#e8e2d2", oculos: true } }
  ],

  autos: {
    resumo: "Plantão judiciário noturno. O Hospital Municipal comunica que Davi, 4 anos, internado após queda doméstica, apresenta hemorragia interna com risco de morte em horas e necessita de transfusão de concentrado de hemácias. Os genitores, Élder e Talita, recusam o procedimento por convicção religiosa e requerem tratamento alternativo (expansores de volume), que o médico plantonista reputa insuficiente no caso concreto. Pede-se o suprimento judicial do consentimento.",
    pecas: [
      { id: "laudo", titulo: "Laudo Médico Circunstanciado",
        texto: "Hospital Municipal, 22h41. Paciente D.S.M., 4 anos, vítima de queda de escada no domicílio, com trauma abdominal fechado e laceração esplênica. Hemoperitônio volumoso em expansão. Hemoglobina às 20h: 7,2 g/dL; às 22h30: 5,8 g/dL, em queda sustentada, com instabilidade hemodinâmica progressiva. Foram empregados cristaloides, ácido tranexâmico e expansores de volume, com resposta apenas transitória: expansores de volume não substituem a reposição de hemácias — repõem pressão, não repõem o transporte de oxigênio. Não há, neste caso concreto, alternativa terapêutica eficaz à transfusão de concentrado de hemácias, que deve preceder a cirurgia. Sem ela, há risco concreto de óbito nas próximas horas. Dr. Hugo, médico plantonista." },
      { id: "termo", titulo: "Termo de Recusa dos Pais",
        texto: "Nós, Élder e Talita, pais de Davi, declaramos que recusamos, por convicção religiosa, a transfusão de sangue indicada pela equipe médica. Não se trata de abandono: pedimos, e custearemos se for preciso, todo e qualquer tratamento alternativo disponível — expansores de volume, medicamentos, transferência para centro com programa de cirurgia sem sangue. Amamos nosso filho acima de tudo nesta vida. Pedimos que respeitem o que somos.\n\n(Anotação da enfermeira no verso: termo assinado às 21h10, no posto de enfermagem. A mãe precisou apoiar a mão na bancada para conseguir assinar.)" },
      { id: "mp", titulo: "Manifestação do MP (certificada por telefone)",
        texto: "CERTIDÃO. Certifico que, contatada às 22h35, a Promotora de plantão, Dra. Cíntia, manifestou-se nos termos seguintes, que li de volta e ela confirmou: 'O Ministério Público requer o suprimento judicial do consentimento, limitado ao ato transfusional indispensável. A liberdade de crença dos genitores é inviolável (CF, art. 5º, VI), mas a criança não professa credo por si — a recusa de terceiros, ainda que amorosa, não pode alcançar a vida dela. Incidem a prioridade absoluta do art. 227 da CF, as medidas de proteção dos arts. 98, I, e 101 do ECA e o limite do art. 1.634 do CC: o poder familiar é múnus exercido no interesse do filho, não direito sobre o filho.'" },
      { id: "defesa", titulo: "Petição da Advogada da Família",
        texto: "A Dra. Nara, pela família, sustenta: (i) a recusa é manifestação da liberdade de consciência e de crença (CF, art. 5º, VI) e da autoridade parental na criação dos filhos (CF, art. 229; CC, art. 1.634); (ii) o STF, no RE 979.742/AM (Tema 1069), reconheceu o direito do paciente Testemunha de Jeová de recusar transfusão de sangue por convicção religiosa; (iii) há protocolos de manejo de hemorragia sem hemoderivados, cuja aplicação se requer, com transferência a centro especializado se necessário; (iv) subsidiariamente, requer que eventual decisão preserve a presença dos pais ao lado da criança, qualquer que seja o desfecho." }
    ]
  },

  focos: [
    { id: "f_laudo", rotulo: "O laudo do Dr. Hugo", dica: "Quanto tempo Davi tem? O tratamento alternativo que os pais pedem funciona NESTE caso?",
      grifos: [{ peca: "laudo", trecho: "expansores de volume não substituem a reposição de hemácias" },
               { peca: "laudo", trecho: "risco concreto de óbito nas próximas horas" }] },
    { id: "f_recusa", rotulo: "O termo de recusa", dica: "Leia o que os pais escreveram. Isso é abandono ou é amor em conflito com a indicação médica?",
      grifos: [{ peca: "termo", trecho: "Não se trata de abandono" },
               { peca: "termo", trecho: "Amamos nosso filho acima de tudo nesta vida" }] },
    { id: "f_crianca", rotulo: "De quem é o direito em risco", dica: "A fé é dos pais. A vida é de Davi. O poder familiar (CC, art. 1.634) alcança a vida do filho?",
      grifos: [{ peca: "mp", trecho: "a criança não professa credo por si" },
               { peca: "mp", trecho: "múnus exercido no interesse do filho, não direito sobre o filho" }] },
    { id: "f_adulto", rotulo: "Adulto seria outra conversa", dica: "O Tema 1069 do STF protege a recusa de quem? Do paciente ADULTO e capaz — e isso muda tudo aqui.",
      grifos: [{ peca: "defesa", trecho: "no RE 979.742/AM (Tema 1069), reconheceu o direito do paciente Testemunha de Jeová de recusar transfusão" },
               { peca: "defesa", trecho: "preserve a presença dos pais ao lado da criança" }] }
  ],

  /* ---------- arco emocional ---------- */
  arco: {
    antes: { emocao: "medo", gesto: "angustia" },
    depois: [
      { se: function (f) { return f.vidaSalva && f.familiaRespeitada; }, tom: "bom", gesto: "abraco",
        falas: [
          { quem: "elder", emocao: "choro", texto: "Doutor... o Davi acordou pedindo o dinossauro dele. Eu queria que o senhor soubesse de uma coisa: o senhor não pediu que eu abrisse mão da minha fé — pediu licença pra salvar meu filho. Eu vou lembrar disso a vida inteira." },
          { quem: "talita", emocao: "feliz", texto: "A gente passou a noite do lado dele, segurando a mão dele. Ninguém nos tirou de lá. Obrigada por isso, doutor." },
          { quem: "hugo", emocao: "feliz", texto: "Pressão estável, hemoglobina subindo, cirurgia sem intercorrências. E os pais no quarto, Excelência — o que, clinicamente falando, também é remédio." }
        ] },
      { se: function (f) { return !!f.poderFamiliarSuspenso; }, tom: "grave",
        falas: [
          { quem: "talita", emocao: "choro", texto: "Meu filho acordou da cirurgia me chamando, doutor. E eu do lado de fora, porque um papel disse que eu não podia entrar. Eu não bati nele. Eu não larguei ele. Eu só rezei diferente do senhor." },
          { quem: "nara", emocao: "raiva", texto: "Agravo protocolado, Excelência. A criança sobreviveu à hemorragia — agora precisa sobreviver à decisão." }
        ] },
      { se: function (f) { return !!f.transfusaoNegada; }, tom: "grave",
        falas: [
          { quem: "hugo", emocao: "triste", texto: "O plantão do Tribunal reformou às quatro da manhã, Excelência. Começamos a transfusão às 4h40. O boletim de hoje diz 'prognóstico reservado'. Eu fico pensando no que as seis horas de espera custaram." }
        ] },
      { se: function (f) { return f.vidaSalva && !f.familiaRespeitada; }, tom: "neutro",
        falas: [
          { quem: "elder", emocao: "triste", texto: "O Davi vai viver, doutor. Eu agradeço a Deus por isso — todo dia. Mas a gente saiu daquela sala se sentindo criminoso. E a gente só estava com medo, igual a todo mundo." }
        ] }
    ]
  },

  vidasTocadas: [
    { se: function (f) { return f.vidaSalva && f.familiaRespeitada; }, tom: "bom",
      texto: "Davi recebeu alta nove dias depois. No gabinete, ficou um desenho de dinossauro com três figuras de mãos dadas — 'pro doutor que deixou a gente junto', escreveu a mãe no canto." },
    { se: function (f) { return f.vidaSalva && !f.familiaRespeitada && !f.poderFamiliarSuspenso; }, tom: "grave",
      texto: "Davi vive. Élder e Talita nunca mais pisaram num fórum por vontade própria — nem quando precisaram." },
    { se: "poderFamiliarSuspenso", tom: "grave",
      texto: "Davi acordou da cirurgia chamando pela mãe. A técnica de enfermagem não soube explicar por que ela não podia entrar no quarto." },
    { se: "transfusaoNegada", tom: "grave",
      texto: "O boletim médico da manhã usa a palavra 'reservado'. A ordem que faltou de madrugada não usa palavra nenhuma." }
  ],

  inicio: "t1",
  cenas: {

    /* ---------- O TELEFONE DO PLANTÃO ---------- */
    t1: {
      falas: [
        { quem: "narrador", texto: "22h20. O fórum está apagado, exceto a sala do plantão. O telefone toca duas vezes antes de você atender. Do outro lado, ruído de hospital: monitores, passos, uma porta batendo." },
        { quem: "hugo", emocao: "medo", texto: "[ao telefone] Excelência, Dr. Hugo, plantonista do Hospital Municipal. Tenho um menino de quatro anos com hemorragia interna, hemoglobina despencando. Ele precisa de transfusão antes da cirurgia — e os pais recusam, por religião. Pedem expansores de volume. Excelência... expansor não carrega oxigênio. Eu tenho horas. Eu não tenho a noite." },
        { quem: "narrador", texto: "Pela janela, dá para ver dois faróis entrando no estacionamento do fórum: os pais do menino chegaram, com a advogada. A Promotora de plantão já foi contatada por telefone. Nada está escrito ainda. O relógio, esse, segue escrevendo." }
      ],
      decisao: {
        prompt: "São 22h27. Um pedido de vida ou morte, por telefone, sem um papel nos autos. O que o plantão responde?",
        opcoes: [
          { rotulo: "Autorizar a transfusão agora mesmo, por telefone — 'pode agir, doutor, depois a gente documenta'",
            fundamento: "Poder geral de cautela; urgência extrema",
            efeitos: { tec: -5, cel: 4, tempo: 3 },
            setFlags: { decisaoSemLaudo: true },
            reacoes: [
              { quem: "hugo", emocao: "surpresa", texto: "[ao telefone] Por telefone, Excelência? A diretoria clínica não autoriza procedimento contra a vontade expressa dos pais sem uma ordem documentada. Se amanhã alguém negar essa ligação, quem segurou a bolsa de sangue fui eu." }
            ],
            feedback: { acerto: "ruim", titulo: "Ordem que não se prova não protege ninguém",
              texto: "A urgência justifica rito mínimo — não rito nenhum. Sem laudo, a decisão não tem suporte fático (CPC, art. 300: probabilidade do direito se demonstra, não se presume), e sem documento o hospital não tem como agir contra a recusa expressa dos pais. O 'sim' por telefone não salva Davi: paralisa o médico, que fica entre uma palavra ao vento e um termo de recusa assinado. A instrução possível levaria minutos — laudo escrito, médico no plantão, pais ouvidos." },
            proxima: "t2" },

          { rotulo: "Devolver a questão ao hospital: 'isso se resolve entre a equipe, o comitê de ética e a família — médico não precisa de juiz para tratar paciente'",
            fundamento: "Autonomia técnica da medicina",
            efeitos: { tec: -9, hum: -8, imp: -5, tempo: 4 },
            setFlags: { omissaoInicial: true },
            reacoes: [
              { quem: "hugo", emocao: "medo", texto: "[ao telefone] Comitê de ética se reúne na segunda-feira, Excelência. O Davi não tem segunda-feira." },
              { quem: "cintia", emocao: "raiva", texto: "[ao telefone, minutos depois] Excelência, é a Promotora de plantão. O Ministério Público está formalizando o pedido de suprimento NESTE momento e requer audiência imediata. Há jurisdição a prestar esta noite — com ou sem vontade de prestá-la." }
            ],
            feedback: { acerto: "grave", titulo: "A porta que a Constituição manda ficar aberta",
              texto: "A lei não excluirá da apreciação do Poder Judiciário lesão ou AMEAÇA a direito (CF, art. 5º, XXXV) — e não há ameaça mais literal que um risco de óbito em horas. Comitê de ética orienta; não supre consentimento nem autoriza ato médico contra a vontade dos pais. Devolver o caso ao hospital é omissão jurisdicional travestida de deferência técnica: se Davi morrer aguardando, a assinatura que faltou era a sua." },
            proxima: "t2" },

          { rotulo: "Exigir laudo médico circunstanciado POR ESCRITO, agora, e determinar a vinda do Dr. Hugo ao plantão com o prontuário — ouvindo também os pais, que acabam de chegar",
            fundamento: "CPC, art. 300 — tutela de urgência com instrução mínima; CF, art. 5º, XXXV",
            efeitos: { tec: 8, hum: 4, tempo: 7 },
            carimbo: "INSTRUÇÃO DE PLANTÃO",
            setFlags: { laudoNosAutos: true },
            reacoes: [
              { quem: "hugo", emocao: "firme", texto: "[ao telefone] O laudo sai da impressora em dez minutos, Excelência. Deixo o paciente com a pediatra de apoio e levo o prontuário em mãos. Vinte minutos e estou aí." },
              { quem: "cintia", emocao: "neutro", texto: "[ao telefone] O Ministério Público encaminha manifestação por telefone para certificação nos autos, Excelência. Às 23h, isto estará instruído como muito processo de ano inteiro não está." }
            ],
            feedback: { acerto: "otimo", titulo: "Urgência não dispensa prova — comprime o tempo dela",
              texto: "É o desenho correto da jurisdição de plantão: o art. 300 do CPC exige <b>probabilidade do direito</b> (o laudo) e <b>perigo de dano</b> (as horas contadas) — e ambos cabem em minutos quando o juízo organiza a instrução em vez de dispensá-la. Ouvir os pais que estão na porta não atrasa nada e muda tudo: legitima a decisão, previne nulidade (CPC, art. 9º) e prepara o cumprimento pacífico de uma ordem que vai doer neles de qualquer forma." },
            proxima: "t2" }
        ]
      }
    },

    /* ---------- OS PAIS NA SALA ---------- */
    t2: {
      falas: [
        { quem: "narrador", texto: "22h48. O Dr. Hugo atravessa a porta do plantão com o laudo ainda quente da impressora. Atrás dele, Élder e Talita — ela carrega o casaco do filho dobrado nos braços, como quem segura o próprio menino. A Dra. Nara os acompanha; a manifestação da Promotora já está certificada nos autos." },
        { quem: "hugo", emocao: "firme", texto: "Está tudo no laudo, Excelência. Hemoglobina 5,8 e caindo. Já usamos expansor, já usamos antifibrinolítico. Resposta transitória. O que falta repor, só sangue repõe. E a cirurgia não pode esperar o dia." },
        { quem: "elder", emocao: "medo", texto: "Doutor, eu não vim aqui pedir pra meu filho morrer. Eu vim pedir pra ele viver sem que a gente atravesse aquilo que, pra nós, é a fronteira com Deus. Tem tratamento sem sangue. Eu li. A doutora trouxe os papéis." },
        { quem: "talita", emocao: "choro", texto: "Ele tem quatro anos. Gosta de dinossauro. Me pediu pra não chorar quando eu saí do quarto... Eu estou tentando obedecer a ele e a Deus ao mesmo tempo, doutor. Me diga como se faz isso." }
      ],
      decisao: {
        prompt: "Élder e Talita estão diante de você — aflitos, firmes, exaustos. Como o juízo trata esses pais?",
        opcoes: [
          { rotulo: "Adverti-los com dureza: a recusa pode configurar maus-tratos e custar o poder familiar — 'os senhores querem enterrar o filho por causa de doutrina?'",
            fundamento: "CP, art. 136; ECA, art. 249 — caráter admonitório",
            efeitos: { tec: -6, hum: -10, imp: -4, tempo: 5 },
            setFlags: { paisHumilhados: true },
            reacoes: [
              { quem: "talita", emocao: "choro", texto: "Enterrar?... O senhor acha que eu quero ENTERRAR o meu filho?" },
              { quem: "nara", emocao: "raiva", texto: "Consigno em ata o termo utilizado, Excelência. Meus clientes vieram ao fórum às onze da noite por livre vontade, trazendo a advogada e pedindo alternativas. Isso não é crime. Isso é desespero educado." }
            ],
            feedback: { acerto: "grave", titulo: "Crueldade não é fundamento",
              texto: "Maus-tratos (CP, art. 136) exige expor a perigo POR abuso, com desígnio que aqui não existe: estes pais buscaram o hospital, assinaram termo, pediram tratamento alternativo e vieram ao fórum. Divergir da indicação médica por convicção não é tortura nem abandono. A ameaça não acrescenta um grama de fundamento à decisão que você ainda vai proferir — só garante que ela será cumprida sobre uma família humilhada, num quarto de hospital onde Davi vai precisar dos dois inteiros." },
            proxima: "t3" },

          { rotulo: "Ouvi-los com respeito e dizer com todas as letras: a fé de vocês não está em julgamento nesta sala — o que está em exame é a urgência médica de Davi",
            fundamento: "CF, art. 5º, VI — liberdade de crença; CPC, art. 9º — contraditório",
            efeitos: { tec: 4, hum: 9, tempo: 6 },
            carimbo: "PAIS OUVIDOS",
            setFlags: { paisRespeitados: true },
            reacoes: [
              { quem: "elder", emocao: "surpresa", texto: "...Ninguém tinha falado assim com a gente hoje, doutor. No hospital, a gente virou 'o caso da recusa'. O senhor foi o primeiro que falou o nome do Davi antes de falar da religião." },
              { quem: "talita", emocao: "triste", texto: "Eu sei o que o laudo diz, doutor. Eu sei ler. É por isso que dói tanto. Decida o que tiver que decidir — mas não decida achando que a gente não ama esse menino." },
              { quem: "nara", emocao: "neutro", texto: "A família registra que foi ouvida, Excelência. É mais do que pediram a ela até agora." }
            ],
            feedback: { acerto: "otimo", titulo: "Separar o objeto do processo da alma das pessoas",
              texto: "A liberdade de crença é inviolável (CF, art. 5º, VI) e NÃO é o que se julga aqui — dizê-lo expressamente não é gentileza, é delimitação técnica do objeto: o exame recai sobre o conflito entre o exercício do poder familiar (CC, art. 1.634) e o direito à vida de um incapaz (CF, arts. 5º, caput, e 227). Ouvir quem está na sala realiza o contraditório (CPC, art. 9º) sem custar os minutos que Davi não tem — e constrói a única coisa que tornará a ordem executável sem violência: pais que se sentiram respeitados por quem decidiu contra o seu pedido." },
            proxima: "t3" },

          { rotulo: "Dispensar manifestações orais: 'o juízo decide nos autos' — que os pais aguardem do lado de fora",
            fundamento: "Celeridade; suficiência da prova documental",
            efeitos: { tec: -2, hum: -6, cel: 2, tempo: 3 },
            reacoes: [
              { quem: "talita", emocao: "choro", texto: "A gente veio até aqui... e nem vai poder falar do nosso filho?" },
              { quem: "nara", emocao: "firme", texto: "As partes estão PRESENTES, Excelência, às onze da noite, espontaneamente. Consigno que a oitiva levaria menos tempo que esta discussão sobre não ouvi-las." }
            ],
            feedback: { acerto: "ruim", titulo: "O contraditório que cabia nos minutos",
              texto: "Decidir sem ouvir parte presente só se justifica quando ouvir frustraria a urgência (CPC, art. 9º, parágrafo único) — não é o caso: eles estão a três metros, e a oitiva consome menos tempo que o despacho que a nega. O custo não é só processual. A mesma ordem de transfusão será cumprida num quarto de hospital onde esses pais estarão presentes: tê-los ouvido é a diferença entre uma ordem acatada e uma ordem sofrida como violência." },
            proxima: "t3" }
        ]
      }
    },

    /* ---------- O MÉRITO ---------- */
    t3: {
      falas: [
        { quem: "cintia", emocao: "firme", texto: "[por telefone, em viva-voz, certificado em ata] O Ministério Público ratifica: suprimento do consentimento, LIMITADO ao ato transfusional indispensável. A criança não professa credo por si, Excelência. A fé dos pais merece todo respeito — e nenhum poder sobre a vida do filho." },
        { quem: "nara", emocao: "firme", texto: "A defesa pondera, Excelência: o Supremo, no Tema 1069, garantiu ao paciente Testemunha de Jeová o direito de recusar transfusão. Pedimos coerência: que se esgotem as alternativas sem sangue, com transferência a centro especializado se preciso." },
        { quem: "hugo", emocao: "medo", texto: "Com respeito à doutora: 'esgotar alternativas' é o que fazemos desde as oito da noite. Transferência são duas horas de estrada que ele não tem. Cada hora desta conversa é hemoglobina que não volta sozinha." }
      ],
      decisao: {
        prompt: "O laudo, o termo de recusa, o MP e a defesa estão nos autos. O mérito está maduro — e o relógio, contra. O que decide o plantão?",
        opcoes: [
          { rotulo: "NEGAR o suprimento, em respeito à autonomia da família: 'o Estado não invade a consciência religiosa do lar'",
            fundamento: "CF, art. 5º, VI; CF, art. 226 — proteção da família",
            efeitos: { tec: -10, hum: -12, imp: -6, tempo: 6 },
            carimbo: "SUPRIMENTO NEGADO",
            reacoes: [
              { quem: "hugo", emocao: "medo", texto: "Eu volto para o hospital e digo o quê para a equipe, Excelência? Que assistimos?" },
              { quem: "cintia", emocao: "raiva", texto: "[em viva-voz] O Ministério Público interpõe recurso IMEDIATO ao plantão do Tribunal e requer certidão desta decisão na íntegra. Que fique registrado o horário: 23h12." }
            ],
            feedback: { acerto: "grave", titulo: "A autonomia era dele — e ele tem quatro anos",
              texto: "O Tema 1069 (STF, RE 979.742/AM) protege a recusa do paciente ADULTO E CAPAZ, que decide sobre o próprio corpo por convicção própria, livre e informada. Davi não decidiu nada: ele não professa credo por si, e a recusa de terceiros — ainda que movida por amor — não pode alcançar a vida dele. O poder familiar é múnus no interesse do filho (CC, art. 1.634), a criança tem prioridade absoluta (CF, art. 227) e o Estado-juiz tem o dever de protegê-la do risco (ECA, arts. 98, I, e 101). Negar o suprimento entrega a vida de um incapaz à fé que ele ainda nem pode escolher." },
            proxima: "fim_grave" },

          { rotulo: "Suprir o consentimento de forma AMPLA: 'fica autorizado todo e qualquer procedimento, a critério da equipe médica, enquanto durar a internação'",
            fundamento: "ECA, art. 101; eficiência — evitar novos acionamentos do plantão",
            efeitos: { tec: -4, hum: 0, cel: 3, tempo: 5 },
            carimbo: "AUTORIZAÇÃO AMPLA",
            setFlags: { suprimentoAmplo: true },
            reacoes: [
              { quem: "nara", emocao: "raiva", texto: "'Todo e qualquer procedimento', Excelência? Os pais ficam suprimidos de TODA decisão sobre o filho, por prazo indeterminado? Agravo de instrumento ainda esta noite." },
              { quem: "elder", emocao: "triste", texto: "Então a partir de agora... a gente não decide mais nada? Nem o que não tem a ver com sangue?" }
            ],
            feedback: { acerto: "ruim", titulo: "O excesso enfraquece a própria ordem",
              texto: "A tutela de urgência se mede pela NECESSIDADE: o que o laudo demonstra é a imprescindibilidade da transfusão — não a incapacidade dos pais para toda e qualquer decisão futura. A autorização em branco esvazia o poder familiar além do necessário, contraria a intervenção mínima do ECA (art. 100, parágrafo único, VII) e oferece o flanco exato que a defesa precisava: no agravo, o excesso da ordem ofuscará o acerto do seu núcleo. Suprir era preciso; suprir TUDO era desnecessário — e o desnecessário, em medida restritiva, é ilegal." },
            proxima: "t4" },

          { rotulo: "Suspender liminarmente o PODER FAMILIAR de Élder e Talita e decretar o acolhimento institucional de Davi, com os pais afastados do hospital até a alta",
            fundamento: "ECA, arts. 129, X, e 157 — suspensão liminar",
            efeitos: { tec: -8, hum: -12, imp: -5, tempo: 8 },
            carimbo: "PODER FAMILIAR SUSPENSO",
            setFlags: { poderFamiliarSuspenso: true },
            reacoes: [
              { quem: "talita", emocao: "choro", texto: "AFASTADOS?... Doutor, ele tem QUATRO ANOS. Ele vai acordar da cirurgia sozinho?!" },
              { quem: "elder", emocao: "raiva", texto: "Eu trouxe meu filho pro hospital no colo. Eu vim pra cá de livre vontade. E o senhor me trata como se eu tivesse batido nele." },
              { quem: "nara", emocao: "raiva", texto: "A medida mais grave do estatuto inteiro, para pais que compareceram, assistiram e suplicaram alternativas. Agravo com pedido de efeito suspensivo em uma hora, Excelência." }
            ],
            feedback: { acerto: "grave", titulo: "A marreta onde bastava a chave",
              texto: "A suspensão do poder familiar (ECA, art. 157) é remédio para o pai que falta, abusa ou põe o filho em risco por desídia — não para o que diverge da indicação médica por convicção, presente e suplicante. O ECA impõe intervenção MÍNIMA e proporcional (art. 100, parágrafo único, VII e VIII): se o suprimento pontual do consentimento resolve o risco, tudo que exceder isso é violência institucional. Davi sobreviverá à hemorragia — e acordará num quarto sem os pais, por ordem sua, no dia em que mais precisava deles. A decisão será reformada; a madrugada da família, não." },
            proxima: "fim_bom" },

          { rotulo: "SUPRIR O CONSENTIMENTO LIMITADO ao ato transfusional indispensável apontado no laudo, mantendo Élder e Talita no pleno exercício do poder familiar e AO LADO do filho — ofício imediato ao hospital",
            fundamento: "CF, arts. 5º, caput, e 227; ECA, arts. 98, I, e 101; CC, art. 1.634",
            requerFoco: "f_laudo",
            efeitos: { tec: 10, hum: 8, tempo: 8 },
            carimbo: "CONSENTIMENTO SUPRIDO",
            setFlags: { suprimentoLimitado: true },
            reacoes: [
              { quem: "hugo", emocao: "feliz", texto: "Limitado ao ato e com os pais no quarto — é exatamente o que a equipe precisava ler, Excelência. Clinicamente e humanamente." },
              { quem: "elder", emocao: "choro", texto: "...O senhor não tirou o Davi da gente. O senhor só... assinou no lugar onde a nossa mão não conseguia ir. Eu não concordo, doutor. Mas eu entendo." },
              { quem: "cintia", emocao: "neutro", texto: "[em viva-voz] O Ministério Público nada tem a opor: a decisão dá ao laudo exatamente o peso que ele tem — nem um grama a mais." }
            ],
            feedback: { acerto: "otimo", titulo: "O bisturi jurídico: cortar só o necessário",
              texto: "Decisão completa em três camadas. <b>O quê:</b> a vida do incapaz prevalece (CF, arts. 5º, caput, e 227; ECA, arts. 98, I, e 101) porque a criança não professa credo por si — e a distinção com o Tema 1069 do STF (RE 979.742/AM, recusa do adulto capaz) é o coração da fundamentação, não um detalhe. <b>Quanto:</b> o suprimento limitado ao ato indispensável respeita a intervenção mínima (ECA, art. 100, parágrafo único) e preserva o poder familiar (CC, art. 1.634) em tudo o mais — porque estes pais não falharam como pais; divergiram como fiéis. <b>Como:</b> mantê-los ao lado do filho transforma os vencidos em aliados do cumprimento. É a ordem que a Resolução CFM 2.232/2019 esperava do outro lado do balcão." },
            proxima: "t4" }
        ]
      }
    },

    /* ---------- A EFETIVIDADE ---------- */
    t4: {
      falas: [
        { quem: "narrador", texto: "23h20. A decisão está assinada. Mas ordem que não chega não decide nada: entre a sua caneta e a bolsa de sangue existem um ofício, um protocolo e um setor jurídico de hospital às onze e meia da noite." },
        { quem: "hugo", emocao: "firme", texto: "Eu volto agora para o hospital, Excelência. Se a ordem chegar comigo, a transfusão começa em quarenta minutos. Se chegar amanhã... o senhor leu o laudo." }
      ],
      decisao: {
        prompt: "A ordem existe. Como ela chega ao hospital — e a tempo?",
        opcoes: [
          { rotulo: "Ligar para a diretoria do hospital, ler a decisão por telefone e considerar comunicada — o papel segue depois",
            fundamento: "Instrumentalidade das formas",
            efeitos: { tec: -3, cel: 2, tempo: 3 },
            reacoes: [
              { quem: "hugo", emocao: "medo", texto: "Excelência, com respeito: o jurídico do hospital travou com um termo de recusa ASSINADO na mesa. Não vai destravar com uma ligação que ninguém pode juntar ao prontuário." }
            ],
            feedback: { acerto: "ruim", titulo: "O telefonema prepara; não cumpre",
              texto: "Ato judicial urgente se comunica por meio idôneo e DOCUMENTÁVEL — e o processo eletrônico tornou isso questão de minutos, não de formalismo (CPC, art. 193 e seguintes). Contra um termo de recusa escrito e assinado, o hospital precisa de ordem escrita que o setor jurídico possa juntar ao prontuário; a ligação sem lastro apenas empurra a hesitação de um andar para outro, enquanto a hemoglobina de Davi segue caindo. A urgência tolera menos forma — nunca forma nenhuma." },
            proxima: "fim_bom" },

          { rotulo: "Cumprimento IMEDIATO: oficial de justiça de plantão leva o mandado em mãos, cópia segue agora por meio eletrônico ao hospital, e o gabinete mantém linha aberta com o Dr. Hugo até a confirmação do início da transfusão",
            fundamento: "CF, art. 5º, LXXVIII; CPC, art. 297 — poder geral de efetivação",
            efeitos: { tec: 8, hum: 5, cel: 4, tempo: 6 },
            carimbo: "CUMPRA-SE DE IMEDIATO",
            setFlags: { cumprimentoImediato: true },
            reacoes: [
              { quem: "hugo", emocao: "feliz", texto: "Saio com o oficial agora, Excelência. Confirmo na linha assim que a primeira bolsa estiver correndo." },
              { quem: "nara", emocao: "neutro", texto: "A família acompanha o doutor ao hospital, Excelência. Para estar com o Davi — como a decisão garantiu." }
            ],
            feedback: { acerto: "otimo", titulo: "A jurisdição termina quando a ordem acontece",
              texto: "Tutela de urgência sem efetivação imediata é contradição em termos: o art. 297 do CPC dá ao juiz o poder de determinar TODAS as medidas adequadas para a efetivação, e a razoável duração do processo (CF, art. 5º, LXXVIII) se mede, aqui, em hemoglobina. Mandado em mãos + via eletrônica + linha aberta até a confirmação: três redundâncias baratas contra um único risco caríssimo. O plantão não acaba quando o juiz assina — acaba quando o sangue corre." },
            proxima: function (f) { return (f.paisRespeitados && f.suprimentoLimitado) ? "fim_otimo" : "fim_bom"; } },

          { rotulo: "'Expeça-se ofício, com urgência, no primeiro expediente' — a serventia cumpre amanhã, a partir das 9h",
            fundamento: "Rotina cartorária; ausência de servidor no plantão noturno",
            efeitos: { tec: -10, hum: -10, imp: -6, tempo: 2 },
            carimbo: "NO EXPEDIENTE",
            reacoes: [
              { quem: "hugo", emocao: "medo", texto: "Às NOVE da manhã, Excelência?... O laudo fala em horas. Eu escrevi 'horas' às 22h41. Faça a conta comigo." },
              { quem: "cintia", emocao: "raiva", texto: "[em viva-voz] Uma decisão correta com cumprimento marcado para depois do risco é uma decisão denegada, Excelência. O Ministério Público requer reconsideração imediata da forma de cumprimento — e certifica o horário." }
            ],
            feedback: { acerto: "grave", titulo: "Davi não tem expediente",
              texto: "O plantão judiciário existe precisamente porque certos direitos não dormem: deferir a tutela e remeter o cumprimento ao expediente seguinte equivale a indeferi-la com palavras gentis. A efetividade integra a jurisdição (CF, art. 5º, XXXV e LXXVIII; CPC, art. 297) — e no plantão o juiz dispõe de oficial de justiça de sobreaviso e meio eletrônico instantâneo. Entre a assinatura às 23h20 e o ofício às 9h, existem dez horas que o laudo disse, por escrito, que Davi não tinha." },
            proxima: "fim_grave" }
        ]
      }
    },

    /* ---------- FINS ---------- */
    fim_otimo: {
      falas: [
        { quem: "narrador", texto: "00h12. A linha aberta com o hospital chia e, então, a voz do Dr. Hugo: 'Primeira bolsa correndo, Excelência. Pressão respondendo.' Ao fundo, baixinho, uma voz de mulher — Talita — cantando alguma coisa para o filho. Ninguém precisou tirá-la do quarto para salvar o menino." }
      ],
      fim: {
        titulo: "A FÉ E A VIDA, INTEIRAS",
        selo: "otimo",
        setFlags: { vidaSalva: true, familiaRespeitada: true },
        texto: "Em menos de duas horas, o plantão instruiu, ouviu, decidiu e cumpriu: laudo nos autos, pais respeitados, consentimento suprido na exata medida do indispensável e ordem confirmada com o sangue já correndo. Nenhuma crença foi julgada; nenhuma criança foi entregue à sorte. Davi viverá — e os pais que perderam a causa saíram do fórum de cabeça erguida, ao lado do filho. É disso que o plantão existe à prova: do que não pode esperar a manhã."
      }
    },

    fim_bom: {
      falas: [
        { quem: "narrador", texto: "Madrugada adentro, a confirmação chega: a transfusão foi realizada e Davi respondeu bem. No corredor do fórum, porém, ninguém se despede de ninguém. Élder e Talita saem em silêncio, apoiados um no outro — gratos a Deus pela vida do filho e feridos pelo caminho que ela precisou atravessar." }
      ],
      fim: {
        titulo: "DAVI VIVE — E ALGO FICOU PELO CAMINHO",
        selo: "bom",
        setFlags: { vidaSalva: true },
        texto: "O essencial foi salvo: o suprimento do consentimento protegeu a vida de quem não podia decidir por si. Mas a madrugada deixou marcas que não estavam no laudo — uma família tratada com mais dureza, ou uma ordem mais larga ou mais lenta do que o necessário. A decisão certa também tem maneira certa: a que salva a criança sem quebrar, de passagem, a confiança dos pais na Justiça que os venceu."
      }
    },

    fim_grave: {
      falas: [
        { quem: "narrador", texto: "03h40. O telefone do plantão toca de novo. É o plantão do Tribunal, pedindo informações com urgência. Às 4h10, a decisão é reformada; às 4h40, a primeira bolsa de sangue finalmente corre. O boletim da manhã, redigido pelo Dr. Hugo com a letra de quem não dormiu, termina em duas palavras: 'prognóstico reservado'." }
      ],
      fim: {
        titulo: "AS HORAS QUE O LAUDO TINHA AVISADO",
        selo: "grave",
        setFlags: { transfusaoNegada: true, manchaGrave: true },
        texto: "O laudo dizia 'horas' — e foram horas que a jurisdição consumiu sem proteger quem não podia se proteger. A instância superior corrigiu a rota ainda de madrugada, mas hemoglobina não espera acórdão: a transfusão tardia deixou Davi em estado gravíssimo. Para o adulto capaz, a recusa é direito (STF, Tema 1069); para a criança, a omissão do Estado-juiz não tem tema, não tem tese — tem nome, e o nome dela é Davi."
      }
    }
  }
});
