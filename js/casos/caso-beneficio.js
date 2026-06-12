/* ============================================================
   CASO: PREVIDENCIÁRIO — "O braço do Sr. Edivaldo"
   ------------------------------------------------------------
   Pedreiro de 52 anos, queda de andaime documentada em CAT,
   benefício por incapacidade NEGADO pelo INSS. A ação corre
   na Justiça ESTADUAL por competência federal delegada (CF,
   art. 109, §3º — comarca sem vara federal): o juiz de
   interior que veste, por algumas horas, a toga federal.

   Fundamentos: CF, art. 109, §3º; Lei 8.213/91 (arts. 26, II,
   59, 60); tutela de urgência alimentar (CPC, art. 300).
   ============================================================ */

window.TOGA = window.TOGA || {};
TOGA.casos.push({
  id: "beneficio",
  titulo: "Previdenciário — O braço do Sr. Edivaldo",
  subtitulo: "O INSS disse 'não'. A vara federal fica a 300 km. Sobrou você — e é exatamente para isso que a Constituição te pôs aqui.",
  area: "Previdenciário (competência delegada)",
  hora: "15:00",
  duracaoPrevistaMin: 60,
  tensao: 4,

  personagens: [
    { id: "edivaldo", nome: "Sr. Edivaldo", papel: "Autor (segurado)", assento: "centro",
      avatar: { pele: "#8a5436", cabelo: "curto", corCabelo: "#574737", traje: "camisa", corTraje: "#5a4a3a", barba: true } },
    { id: "mira", nome: "Dra. Mira", papel: "Advogada do autor", assento: "esq1",
      avatar: { pele: "#a86a48", cabelo: "longo", corCabelo: "#1d1209", traje: "blazer", corTraje: "#33424f", corBlusa: "#efe5c8" } },
    { id: "sales", nome: "Dr. Sales", papel: "Procurador Federal (INSS)", assento: "dir1",
      avatar: { pele: "#e8c39a", cabelo: "curto", corCabelo: "#3a2a1a", traje: "terno", corTraje: "#33424f", corGravata: "#33424f", oculos: true } },
    { id: "tales", nome: "Dr. Tales", papel: "Perito do Juízo", assento: "dir2",
      avatar: { pele: "#d8a87f", cabelo: "calvo", corCabelo: "#777268", traje: "camisa", corTraje: "#e8e2d2", oculos: true } }
  ],

  autos: {
    resumo: "Ação contra o INSS: restabelecimento de auxílio por incapacidade temporária ACIDENTÁRIO (B91), negado sob fundamento de 'capacidade laboral preservada'. Autor: pedreiro, 52 anos, queda de andaime com fratura de úmero direito, CAT emitida pelo empregador. Comarca SEM vara federal: competência delegada à Justiça Estadual.",
    pecas: [
      { id: "preliminar", titulo: "Contestação do INSS — preliminar",
        texto: "PRELIMINARMENTE: o INSS é autarquia FEDERAL (CF, art. 109, I), pelo que se requer a extinção do feito ou sua remessa à Justiça Federal, absolutamente competente. NO MÉRITO: a perícia administrativa concluiu pela capacidade laboral do requerente, devendo prevalecer a presunção de legitimidade do ato administrativo." },
      { id: "cat", titulo: "CAT e documentos do acidente",
        texto: "Comunicação de Acidente de Trabalho emitida pela construtora em 12/março: queda de andaime de 2,5 m durante expediente, fratura de úmero direito, atendimento de emergência no Hospital Municipal documentado. Vínculo de emprego ativo há 7 anos (CTPS anexa). Qualidade de segurado INCONTROVERSA." },
      { id: "pericia", titulo: "Laudo do perito judicial",
        texto: "Exame físico: consolidação óssea com desvio, limitação de elevação do membro superior direito a 70 graus (normal: 180), força de preensão reduzida em 60%, dor crônica à movimentação. CONCLUSÃO: incapacidade TEMPORÁRIA para a atividade habitual de pedreiro, estimada em 8 a 12 meses adicionais de tratamento e fisioterapia, com possibilidade de reabilitação. Nexo causal com o acidente: PRESENTE (consistência clínica e documental)." },
      { id: "social2", titulo: "Estudo socioeconômico",
        texto: "O autor está sem renda desde o indeferimento, há 4 meses. Esposa faz faxinas eventuais (R$ 600/mês em média). Dois filhos, um deles cursando técnico noturno, ameaçado de trancamento por falta da passagem. A família passou a receber cesta básica de igreja do bairro. O autor declarou à assistente: 'eu nunca precisei de juiz, doutora. Trabaio desde os quatorze'." }
    ]
  },

  focos: [
    { id: "f_competencia", rotulo: "A competência delegada", dica: "CF, art. 109, §3º: causa previdenciária de comarca sem vara federal corre na Justiça ESTADUAL. A preliminar do INSS tem resposta de um parágrafo — se você a souber.",
      grifos: [{ peca: "preliminar", trecho: "requer a extinção do feito ou sua remessa à Justiça Federal" }] },
    { id: "f_cat", rotulo: "CAT e nexo causal", dica: "Acidente documentado no dia, no hospital e na CAT. O nexo não é palpite: é papel.",
      grifos: [{ peca: "cat", trecho: "queda de andaime de 2,5 m durante expediente, fratura de úmero direito" }] },
    { id: "f_pericia", rotulo: "O laudo e a PROFISSÃO", dica: "Incapacidade se mede contra a atividade HABITUAL: braço a 70 graus não levanta parede.",
      grifos: [{ peca: "pericia", trecho: "incapacidade TEMPORÁRIA para a atividade habitual de pedreiro" }] },
    { id: "f_alimentar", rotulo: "A natureza alimentar", dica: "Quatro meses sem renda, cesta de igreja. Benefício previdenciário é comida: tutela de urgência cabe.",
      grifos: [{ peca: "social2", trecho: "A família passou a receber cesta básica de igreja do bairro" }] }
  ],

  arco: {
    antes: { emocao: "vergonha", gesto: "angustia" },
    depois: [
      { se: function (f) { return f.beneficioConcedido && f.tutelaAlimentar; }, tom: "bom",
        falas: [
          { quem: "edivaldo", emocao: "feliz", texto: "Doutor... a moça do banco disse que cai este mês ainda. Este mês. Meu menino não tranca o curso. Aperta aqui — é a mão boa, pode apertar firme." },
          { quem: "mira", emocao: "feliz", texto: "E a fisioterapia começa segunda, Excelência. Em um ano, ele volta pro andaime — pelo caminho certo." }
        ] },
      { se: function (f) { return !!f.beneficioNegado; }, tom: "grave",
        falas: [
          { quem: "edivaldo", emocao: "triste", texto: "Quer saber, doutor? Dói menos o braço que ouvir que eu 'posso trabalhar'. Eu QUERIA poder. Trabaio desde os quatorze." }
        ] }
    ]
  },

  vidasTocadas: [
    { se: function (f) { return f.beneficioConcedido && f.tutelaAlimentar; }, tom: "bom",
      texto: "Edivaldo recebeu no mesmo mês — e a fisioterapia começou na segunda-feira seguinte. O filho não trancou o curso técnico." },
    { se: function (f) { return f.beneficioConcedido && !f.tutelaAlimentar; }, tom: "grave",
      texto: "O benefício foi concedido — para daqui a meses, quando o recurso do INSS transitar. Até lá, a cesta básica continua vindo da igreja." },
    { se: "beneficioNegado", tom: "grave",
      texto: "Um pedreiro com o braço a 70 graus foi declarado 'capaz'. A família vive de faxinas e doação — e o processo, de recurso." },
    { se: "declinouCompetencia", tom: "grave",
      texto: "O processo viajou 300 km para a vara federal — e voltará em meses, com a competência reafirmada. Quem não tem renda pagou a passagem do erro." }
  ],

  inicio: "b1",
  cenas: {

    b1: {
      falas: [
        { quem: "narrador", texto: "15h00. Sr. Edivaldo entra de camisa passada e braço direito junto ao corpo, como quem protege o que restou dele. Senta-se ereto, constrangido — um homem que claramente preferia estar em qualquer andaime a estar num fórum." },
        { quem: "sales", emocao: "firme", texto: "Excelência, antes do mérito, a preliminar: o INSS é autarquia federal. Este juízo ESTADUAL é absolutamente incompetente — requeiro a remessa dos autos à Justiça Federal da capital." },
        { quem: "mira", emocao: "firme", texto: "A capital fica a trezentos quilômetros, Excelência. E a Constituição já resolveu essa preliminar há décadas — no parágrafo terceiro do artigo 109." }
      ],
      decisao: {
        prompt: "A preliminar de incompetência absoluta está lançada. Ela derruba o processo?",
        opcoes: [
          { rotulo: "Acolher a preliminar: autarquia federal se processa na Justiça Federal — remetam-se os autos à capital",
            fundamento: "CF, art. 109, I",
            efeitos: { tec: -10, hum: -8, tempo: 5 },
            carimbo: "AUTOS REMETIDOS",
            setFlags: { declinouCompetencia: true, beneficioNegado: true },
            reacoes: [
              { quem: "edivaldo", emocao: "surpresa", texto: "Trezentos quilômetros, doutor?... Eu vim de bicicleta hoje." },
              { quem: "mira", emocao: "raiva", texto: "O conflito de competência voltará em meses com a resposta óbvia, Excelência: parágrafo TERCEIRO do mesmo artigo 109 que o INSS citou pela metade." }
            ],
            feedback: { acerto: "grave", titulo: "O parágrafo que faltou ler",
              texto: "O art. 109, I, da CF tem a regra — e o §3º tem a exceção EXPRESSA: causas previdenciárias de segurado residente em comarca sem vara federal correm na Justiça Estadual (delegação reafirmada pela Lei 13.876/2019 e pelo STJ, Súmula 689/STF para acidentárias). Declinar é mandar um homem sem renda litigar a 300 km — para receber de volta, meses depois, o processo com a competência que sempre foi sua." },
            proxima: "fim_declinio" },

          { rotulo: "Rejeitar a preliminar SEM fundamentar longamente: 'rejeito; prossiga-se'",
            fundamento: "Poder de direção do processo",
            efeitos: { tec: 1, cel: 3, tempo: 3 },
            reacoes: [
              { quem: "sales", emocao: "neutro", texto: "Consigno a ausência de fundamentação para fins recursais, Excelência." }
            ],
            feedback: { acerto: "bom", titulo: "Resultado certo, decisão desprotegida",
              texto: "Rejeitar era o destino correto — mas 'rejeito' seco entrega ao recurso do INSS um flanco bobo: a alegada falta de fundamentação (CF, art. 93, IX). A preliminar morria com UMA frase: 'comarca sem vara federal, segurado aqui residente, competência delegada — CF, art. 109, §3º'. Fundamentar o óbvio custa uma linha e blinda o processo." },
            proxima: "b2" },

          { rotulo: "Rejeitar FUNDAMENTANDO a delegação: comarca sem vara federal + segurado residente = competência estadual (CF, art. 109, §3º; Lei 13.876/2019) — e consignar que a tese contrária beira a litigância protelatória",
            fundamento: "CF, art. 109, §3º; Lei 13.876/2019; Súmula 689/STF",
            requerFoco: "f_competencia",
            efeitos: { tec: 9, cel: 2, tempo: 6 },
            carimbo: "COMPETÊNCIA AFIRMADA",
            setFlags: { competenciaAfirmada: true },
            reacoes: [
              { quem: "sales", emocao: "vergonha", texto: "...a autarquia não insistirá no ponto, Excelência." },
              { quem: "mira", emocao: "feliz", texto: "É para isso que existe a delegação, Excelência: para a Justiça caber na cidade onde o segurado mora." }
            ],
            feedback: { acerto: "otimo", titulo: "A toga federal do juiz de comarca",
              texto: "Resposta de manual: a delegação do art. 109, §3º, da CF existe precisamente para que o segurado do interior não atravesse o estado para discutir o próprio sustento. Fundamentar ponto a ponto (parágrafo constitucional + Lei 13.876/2019 + súmula) não só resolve a preliminar — desarma o recurso e recoloca a audiência no que importa: o braço do autor." },
            proxima: "b2" }
        ]
      }
    },

    b2: {
      falas: [
        { quem: "tales", emocao: "neutro", texto: "Excelência, o laudo está nos autos: limitação a 70 graus, força reduzida em 60%, incapacidade temporária para a função de pedreiro, nexo presente. À disposição para esclarecimentos." },
        { quem: "sales", emocao: "firme", texto: "O INSS impugna, Excelência: a perícia ADMINISTRATIVA concluiu pela capacidade. E o laudo judicial admite 'possibilidade de reabilitação' — logo, o autor pode exercer OUTRA atividade." }
      ],
      decisao: {
        prompt: "Dois laudos, duas conclusões. Como você instrui o ponto decisivo?",
        opcoes: [
          { rotulo: "Tomar esclarecimentos do perito EM AUDIÊNCIA, com a pergunta-chave: incapaz para QUÊ — para qualquer trabalho, ou para levantar parede?",
            fundamento: "CPC, art. 477, §3º; Lei 8.213, art. 59 (incapacidade p/ atividade habitual)",
            requerFoco: "f_pericia",
            efeitos: { tec: 8, hum: 4, tempo: 9 },
            carimbo: "PERITO ESCLARECE",
            setFlags: { periciaEsclarecida: true },
            reacoes: [
              { quem: "tales", emocao: "firme", texto: "Para a atividade HABITUAL de pedreiro, Excelência, a incapacidade é total e atual: elevação a 70 graus não sustenta carga acima do ombro, e força de preensão a 40% não segura colher nem tijolo com segurança — para ele e para quem estiver embaixo. A 'reabilitação' do laudo é hipótese FUTURA, após tratamento." },
              { quem: "sales", emocao: "neutro", texto: "...sem mais perguntas ao perito, Excelência." }
            ],
            feedback: { acerto: "otimo", titulo: "A pergunta que decide o processo",
              texto: "O auxílio por incapacidade TEMPORÁRIA (Lei 8.213, art. 59) se mede contra a atividade HABITUAL — não contra um emprego hipotético de portaria. O esclarecimento oral converteu o laudo escrito em prova viva e enterrou a tese da 'capacidade genérica': pedreiro que não eleva o braço não é 'capaz com ressalvas'; é incapaz para o SEU trabalho, agora." },
            proxima: "b3" },

          { rotulo: "Prevalece a perícia administrativa: presunção de legitimidade do ato do INSS — improcedência encaminhada",
            fundamento: "Presunção de legitimidade dos atos administrativos",
            efeitos: { tec: -8, hum: -6, tempo: 5 },
            reacoes: [
              { quem: "mira", emocao: "raiva", texto: "A presunção de legitimidade cede à prova judicial, Excelência — é exatamente PARA destruí-la que existe a perícia do juízo!" }
            ],
            feedback: { acerto: "grave", titulo: "A presunção que engole a jurisdição",
              texto: "Se o ato administrativo prevalecesse sobre a perícia judicial, o processo seria inútil por definição. A presunção de legitimidade é RELATIVA: cede diante de prova técnica produzida sob contraditório — e o laudo do SEU perito, com nexo e limitação objetiva medida em graus, é precisamente essa prova. Ignorá-lo é abdicar de julgar." },
            proxima: "b3" },

          { rotulo: "Homologar o laudo escrito como está e encerrar a instrução — o papel já diz tudo",
            fundamento: "CPC, art. 371 — livre apreciação",
            efeitos: { tec: 2, cel: 3, tempo: 4 },
            reacoes: [
              { quem: "sales", emocao: "neutro", texto: "O INSS explorará a 'possibilidade de reabilitação' em apelação, então, Excelência." }
            ],
            feedback: { acerto: "bom", titulo: "Suficiente — com uma fresta",
              texto: "O laudo sustenta a procedência. Mas ele continha uma ambiguidade explorável ('possibilidade de reabilitação'), e o perito estava SENTADO na sala: três perguntas a custo zero teriam selado o ponto. Instrução boa não é a mais curta — é a que não deixa fresta para o recurso." },
            proxima: "b3" }
        ]
      }
    },

    b3: {
      falas: [
        { quem: "narrador", texto: "Alegações finais colhidas. Sr. Edivaldo espera de cabeça baixa, girando o boné na mão boa. A audiência inteira coube em uma tarde — a espera dele já vai em quatro meses." },
        { quem: "mira", emocao: "firme", texto: "Requeiro a procedência com TUTELA DE URGÊNCIA, Excelência: o benefício é alimentar e a família vive de doação. Cada mês de espera recursal é um mês de fome com carimbo." }
      ],
      decisao: {
        prompt: "A sentença. E — tão importante quanto — o QUANDO dela.",
        opcoes: [
          { rotulo: "Procedente: B91 restabelecido com DIB na data do requerimento — eficácia após o trânsito em julgado, como de praxe",
            fundamento: "Lei 8.213, arts. 59-60; prudência fiscal",
            efeitos: { tec: 4, hum: -2, tempo: 6 },
            carimbo: "PROCEDENTE",
            setFlags: { beneficioConcedido: true },
            reacoes: [
              { quem: "edivaldo", emocao: "surpresa", texto: "Ganhei... mas recebo QUANDO, doutora?" },
              { quem: "mira", emocao: "triste", texto: "Depois do recurso do INSS, seu Edivaldo. Um ano, talvez dois." }
            ],
            feedback: { acerto: "bom", titulo: "A vitória que chega de ônibus",
              texto: "O mérito está correto e bem lastreado. Mas 'eficácia após o trânsito' ignora o que os autos gritavam: 4 meses sem renda, cesta de igreja, filho a ponto de trancar o curso. Benefício por incapacidade é verba ALIMENTAR — o caso clássico de tutela de urgência (CPC, art. 300), que você tinha nas mãos e guardou na gaveta." },
            proxima: "fim_bom" },

          { rotulo: "Improcedente: a 'possibilidade de reabilitação' do laudo mostra que a incapacidade não é definitiva — que o autor se requalifique",
            fundamento: "Livre convencimento; laudo (trecho final)",
            efeitos: { tec: -9, hum: -10, tempo: 6 },
            carimbo: "IMPROCEDENTE",
            setFlags: { beneficioNegado: true, manchaGrave: true },
            reacoes: [
              { quem: "edivaldo", emocao: "triste", texto: "Requalificar com que braço, doutor? Com que dinheiro? Com que idade?" },
              { quem: "mira", emocao: "raiva", texto: "O benefício pedido é TEMPORÁRIO, Excelência — existe exatamente PARA o período de tratamento que o laudo descreve! Apelação ainda esta semana." }
            ],
            feedback: { acerto: "grave", titulo: "Confundir o temporário com o definitivo",
              texto: "O erro é conceitual: o auxílio do art. 59 é para incapacidade TEMPORÁRIA — a 'possibilidade de reabilitação futura' não nega o direito; CONFIRMA que o benefício é a ponte até lá. Negar a ponte porque existe a outra margem deixa o segurado no meio do rio. O TRF reformará com facilidade — cobrando do tempo de Edivaldo o preço da espera." },
            proxima: "fim_grave" },

          { rotulo: "Procedente COM TUTELA DE URGÊNCIA: implantação em 30 dias sob multa diária, DIB na data do requerimento administrativo, atrasados corrigidos — a natureza alimentar não espera recurso",
            fundamento: "Lei 8.213, arts. 26, II, 59-60; CPC, arts. 300 e 537; natureza alimentar",
            requerFoco: "f_alimentar",
            efeitos: { tec: 9, hum: 10, tempo: 8 },
            carimbo: "TUTELA DEFERIDA — 30 DIAS",
            setFlags: { beneficioConcedido: true, tutelaAlimentar: true },
            reacoes: [
              { quem: "edivaldo", emocao: "choro", texto: "Trinta dias?... Doutor, eu... desculpa. É que faz quatro meses que eu durmo fazendo conta." },
              { quem: "sales", emocao: "neutro", texto: "Com a probabilidade do direito posta nesses termos e a multa cominada, a autarquia avaliará a conveniência do recurso, Excelência." },
              { quem: "mira", emocao: "feliz", texto: "É a diferença entre ganhar e RECEBER, Excelência. O senhor entregou as duas coisas." }
            ],
            feedback: { acerto: "otimo", titulo: "Sentença com data de pagamento",
              texto: "Quadro completo: qualidade de segurado e nexo provados (CAT), carência DISPENSADA por se tratar de acidente (Lei 8.213, art. 26, II), incapacidade para a atividade habitual periciada e esclarecida — probabilidade do direito em grau máximo. Some o perigo da demora documentado pelo estudo social, e a tutela de urgência não é ousadia: é o art. 300 do CPC aplicado ao que ele mais serve. A multa diária (art. 537) transforma a ordem em depósito em conta." },
            proxima: "fim_otimo" }
        ]
      }
    },

    fim_otimo: {
      falas: [
        { quem: "narrador", texto: "Na porta, Sr. Edivaldo veste o boné com a mão esquerda e olha o fórum de baixo a cima, como quem mede uma obra: 'até que essa casa trabaia direito', diz à advogada. Vindo de um pedreiro com 38 anos de andaime, não há elogio maior." }
      ],
      fim: {
        titulo: "JUSTIÇA NO CONTRACHEQUE",
        selo: "otimo",
        texto: "Competência afirmada em uma linha, perícia esclarecida na pergunta certa, sentença com tutela de urgência e multa: em 30 dias o benefício está na conta, com atrasados a caminho. A delegação constitucional cumpriu sua promessa — a Justiça Federal coube na comarca, e o sustento de uma família não precisou viajar 300 km."
      }
    },

    fim_bom: {
      falas: [
        { quem: "narrador", texto: "Sentença publicada. O INSS apela no 14º dia, como sempre. O processo sobe; a vida de Edivaldo fica esperando no térreo." }
      ],
      fim: {
        titulo: "PROCEDENTE — NO PAPEL",
        selo: "bom",
        texto: "O direito foi reconhecido com solidez, e o TRF dificilmente tocará no mérito. Mas sem tutela de urgência, a vitória virou promessa de longo prazo para quem vive de doação no curto. A régua das ações alimentares é outra: ganhar importa; RECEBER, decide."
      }
    },

    fim_grave: {
      falas: [
        { quem: "narrador", texto: "Sr. Edivaldo dobra a sentença ao meio com uma mão só e a guarda no bolso da camisa, junto com a caneta que trouxe e não precisou usar." }
      ],
      fim: {
        titulo: "CAPAZ, SEGUNDO OS AUTOS",
        selo: "grave",
        texto: "Contra CAT, laudo judicial e estudo social, prevaleceu uma leitura enviesada de meia frase do perito. A apelação tem tudo para reformar — em um ano, talvez dois. Até lá, a 'capacidade laboral' de Edivaldo seguirá sustentando a família com faxinas da esposa e cestas da igreja."
      }
    },

    fim_declinio: {
      falas: [
        { quem: "narrador", texto: "Os autos são remetidos. Trezentos quilômetros dali, um juiz federal os devolverá com uma citação ao §3º do art. 109 — e a conta do tempo perdido chegará a quem menos podia pagá-la." }
      ],
      fim: {
        titulo: "TREZENTOS QUILÔMETROS DE ERRO",
        selo: "grave",
        texto: "A preliminar do INSS citou o artigo certo pela metade — e o juízo completou o erro. A competência delegada existe há décadas exatamente para este caso: segurado do interior, comarca sem vara federal. O processo voltará; os meses, não."
      }
    }
  }
});
