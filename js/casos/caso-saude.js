/* ============================================================
   CASO: PLANTÃO DA SAÚDE — "O remédio do pai de Alice"
   ------------------------------------------------------------
   Joaquim, 34 anos, precisa de um medicamento com registro na
   ANVISA mas fora da lista do SUS. O laudo fala em 72 horas.
   A esposa, Roseane, chega ao plantão com a filha Alice (7)
   pela mão. A decisão liminar é uma corrida contra o relógio:
   Tema 106/STJ, Tema 793/STF, e-NatJus e a coragem de mandar
   cumprir EM HORAS.

   Se o juiz decidir bem, Alice volta dias depois com um
   desenho — e o gabinete nunca mais é o mesmo.
   ============================================================ */

window.TOGA = window.TOGA || {};
TOGA.casos.push({
  id: "saude",
  titulo: "Plantão — O remédio do pai de Alice",
  subtitulo: "Um laudo que fala em 72 horas. Uma lista que diz 'não'. Quem desempata é você.",
  area: "Saúde Pública",
  hora: "10:00",
  duracaoPrevistaMin: 50,
  tensao: 8,

  personagens: [
    { id: "roseane", nome: "Roseane", papel: "Autora (esposa)", assento: "centro",
      avatar: { pele: "#a86a48", cabelo: "longo", corCabelo: "#1d1209", traje: "vestido", corTraje: "#5a4a52" } },
    { id: "estevao", nome: "Dr. Estêvão", papel: "Defensor Público", assento: "esq1",
      avatar: { pele: "#d8a87f", cabelo: "curto", corCabelo: "#241a10", traje: "terno", corTraje: "#2f4a3e", corGravata: "#33424f" } },
    { id: "renata", nome: "Dra. Renata", papel: "Procuradora do Município", assento: "dir1",
      avatar: { pele: "#e8c39a", cabelo: "coque", corCabelo: "#3a2a1a", traje: "blazer", corTraje: "#33424f", corBlusa: "#efe5c8", oculos: true } },
    { id: "dalva", nome: "Sra. Dalva", papel: "Secretária de Saúde", assento: "dir2",
      avatar: { pele: "#c98e66", cabelo: "coque", corCabelo: "#777268", traje: "blazer", corTraje: "#54453a", corBlusa: "#e8e2d2" } }
  ],

  autos: {
    resumo: "Ação de obrigação de fazer com pedido de tutela de urgência: fornecimento do medicamento Lurazol® (registro ANVISA ativo, fora dos protocolos do SUS) para Joaquim, 34 anos, diagnóstico de doença autoimune rara em agudização. Laudo médico aponta risco de falência hepática em 72 horas sem o fármaco. O Município nega: 'medicamento não incorporado'.",
    pecas: [
      { id: "laudo", titulo: "Laudo do médico assistente",
        texto: "Paciente em agudização grave. O tratamento padronizado pelo SUS foi utilizado por 8 meses SEM resposta, com piora progressiva documentada em exames seriados. O Lurazol® é, neste estágio, a única alternativa terapêutica com evidência de eficácia para o quadro, sendo IMPRESCINDÍVEL seu início em até 72 horas, sob risco concreto de falência hepática e óbito. Registro ANVISA nº 1.0234.0567. Custo mensal estimado: R$ 4.800,00." },
      { id: "negativa", titulo: "Negativa administrativa",
        texto: "A Secretaria Municipal de Saúde indefere o requerimento: o fármaco não consta da RENAME nem dos protocolos clínicos do SUS (PCDT). A incorporação de tecnologias compete à CONITEC. Orienta-se o requerente a aguardar a via administrativa federal, com prazo médio de resposta de 8 a 14 meses." },
      { id: "hipo", titulo: "Declaração de hipossuficiência",
        texto: "Joaquim é auxiliar de serviços gerais, atualmente afastado sem remuneração. Renda familiar: R$ 1.900,00 (salário de Roseane, merendeira escolar). Custo do tratamento: R$ 4.800,00 mensais. A família reside em imóvel cedido e tem uma filha de 7 anos, Alice. Juntou-se CadÚnico ativo." },
      { id: "natjus", titulo: "Certidão — e-NatJus disponível",
        texto: "Certifico que o sistema e-NatJus (CNJ) dispõe de NOTA TÉCNICA para o fármaco Lurazol® na indicação descrita nos autos, com resposta em até 2 horas para casos de urgência mediante solicitação do juízo. A nota avalia eficácia, segurança e existência de alternativa terapêutica no SUS — exatamente os três requisitos do Tema 106 do STJ." }
    ]
  },

  focos: [
    { id: "f_laudo", rotulo: "O laudo e o relógio", dica: "Urgência objetiva: 72 horas. E a comprovação de que o tratamento do SUS FALHOU.",
      grifos: [{ peca: "laudo", trecho: "IMPRESCINDÍVEL seu início em até 72 horas" },
               { peca: "laudo", trecho: "tratamento padronizado pelo SUS foi utilizado por 8 meses SEM resposta" }] },
    { id: "f_tema106", rotulo: "Tema 106 do STJ", dica: "Os 3 requisitos: laudo de imprescindibilidade + incapacidade financeira + registro na ANVISA.",
      grifos: [{ peca: "laudo", trecho: "Registro ANVISA nº 1.0234.0567" },
               { peca: "hipo", trecho: "Renda familiar: R$ 1.900,00" }] },
    { id: "f_natjus", rotulo: "A nota técnica em 2 horas", dica: "O e-NatJus responde HOJE o que a perícia comum responderia em semanas.",
      grifos: [{ peca: "natjus", trecho: "resposta em até 2 horas para casos de urgência mediante solicitação do juízo" }] },
    { id: "f_alternativa", rotulo: "A alternativa que não existe", dica: "A defesa do Município dirá que 'há substituto na rede'. O laudo já respondeu — você leu?",
      grifos: [{ peca: "laudo", trecho: "única alternativa terapêutica com evidência de eficácia" }] }
  ],

  arco: {
    antes: { emocao: "choro", gesto: "angustia" },
    depois: [
      { se: function (f) { return !!f.liminarSaude; }, tom: "bom", gesto: "abraco",
        falas: [
          { quem: "roseane", emocao: "choro", texto: "O hospital ligou, doutor: a primeira dose entra ainda hoje à noite. HOJE. Eu não sei agradecer uma coisa dessas." },
          { quem: "estevao", emocao: "feliz", texto: "A Alice quer fazer um desenho para o senhor, Excelência. Eu avisei que juiz não pode receber presente... ela disse que desenho não é presente, é documento." }
        ] },
      { se: function (f) { return !!f.saudeNegada; }, tom: "grave",
        falas: [
          { quem: "roseane", emocao: "choro", texto: "O Defensor disse que vai recorrer ao plantão do Tribunal... mas o senhor leu o laudo, não leu? Setenta e duas horas, doutor. Eu contei cada uma no corredor." }
        ] }
    ]
  },

  vidasTocadas: [
    { se: "liminarSaude", tom: "bom",
      texto: "Joaquim recebeu a primeira dose na mesma noite da decisão. Dias depois, Alice entregou um desenho no gabinete." },
    { se: "liminarFragil", tom: "bom",
      texto: "O remédio chegou — mas a decisão frágil deixou o agravo do Município com chance real de derrubá-la no meio do tratamento." },
    { se: "saudeNegada", tom: "grave",
      texto: "A liminar veio do plantão do Tribunal, 14 horas depois — 14 horas que o fígado de Joaquim pagou." }
  ],

  inicio: "s1",
  cenas: {

    s1: {
      falas: [
        { quem: "narrador", texto: "10h00. Roseane entra segurando uma pasta de exames com as duas mãos, como quem carrega o próprio marido. Pela porta, uma menina de tranças espia — Alice ficou no corredor com a merendeira da escola, que veio junto." },
        { quem: "roseane", emocao: "medo", texto: "Doutor, eu... o médico disse que é questão de dias. A gente fez tudo certo: oito meses do remédio da rede, todo exame, toda fila. Não funcionou. E o que funciona, custa quase cinco mil por mês. Eu ganho mil e novecentos." },
        { quem: "renata", emocao: "neutro", texto: "Excelência, o Município se solidariza, mas a lista do SUS não é sugestão: o fármaco não foi incorporado pela CONITEC. Deferir é furar a fila de quem espera pela via correta." }
      ],
      decisao: {
        prompt: "A autora está diante de você, com o relógio do laudo correndo. Como conduzir a primeira hora do plantão?",
        opcoes: [
          { rotulo: "Determinar a intimação do Município para manifestação formal em 72 horas, vindo os autos conclusos em seguida",
            fundamento: "Contraditório prévio (CPC, art. 9º)",
            efeitos: { tec: -6, hum: -8, cel: 2, tempo: 5 },
            reacoes: [
              { quem: "estevao", emocao: "raiva", texto: "Excelência, o laudo fala em setenta e duas horas DE VIDA, não de prazo processual. O contraditório pode ser diferido — a morte, não." }
            ],
            feedback: { acerto: "grave", titulo: "O tempo do processo não é o tempo de Joaquim",
              texto: "O CPC excepciona expressamente o contraditório prévio quando a urgência o inviabiliza (art. 9º, parágrafo único, I). Mandar 'manifestar em 72 horas' quando o laudo dá 72 horas de margem clínica é decidir pela morte por decurso de prazo — a forma encobrindo a denegação." },
            proxima: "s2" },

          { rotulo: "Ouvir Roseane em linguagem simples — o que mudou no quadro do marido, o que o médico explicou — antes de qualquer ato processual",
            fundamento: "CF, art. 196; CNJ — Linguagem Simples; escuta qualificada",
            efeitos: { tec: 3, hum: 8, tempo: 7 },
            carimbo: "PALAVRA À AUTORA",
            setFlags: { ouviuRoseane: true },
            reacoes: [
              { quem: "roseane", emocao: "choro", texto: "Ele não consegue mais subir a escada de casa, doutor. O médico falou que o fígado está 'no limite da reserva'. Eu decorei essas palavras para não errar aqui." },
              { quem: "estevao", emocao: "neutro", texto: "Está tudo documentado no laudo, Excelência — exames seriados, oito meses de protocolo esgotado." }
            ],
            feedback: { acerto: "otimo", titulo: "A urgência tem rosto",
              texto: "Ouvir a parte vulnerável em linguagem simples não atrasa o plantão — orienta-o. Em saúde, a jurisprudência exige urgência CONCRETA, e nada a demonstra melhor do que o relato colhido diretamente, confrontado com o laudo. Você agora sabe exatamente o que precisa verificar: eficácia, alternativa e prazo." },
            proxima: "s2" },

          { rotulo: "Conceder a liminar de plano, agora: 'a saúde está acima de qualquer lista'",
            fundamento: "CF, art. 196 — direito universal à saúde",
            efeitos: { tec: -4, hum: 4, cel: 4, tempo: 4 },
            carimbo: "LIMINAR DE PLANO",
            setFlags: { liminarPrecipitada: true },
            reacoes: [
              { quem: "renata", emocao: "firme", texto: "O Município agravará ainda hoje, Excelência: a decisão não examinou NENHUM dos requisitos do Tema 106. Será cassada em uma semana — e o tratamento, interrompido no meio." }
            ],
            feedback: { acerto: "ruim", titulo: "Generosidade sem lastro é liminar com prazo de validade",
              texto: "'A saúde acima de tudo' comove e cai: o STJ fixou requisitos objetivos (Tema 106) exatamente para separar o pedido legítimo do insustentável. A liminar sem exame de eficácia, alternativa e hipossuficiência nasce com agravo marcado — e cassação no meio do tratamento é pior que demora no início." },
            proxima: "s2" }
        ]
      }
    },

    s2: {
      falas: [
        { quem: "dalva", emocao: "firme", texto: "Excelência, se me permite o aparte técnico: a rede TEM alternativa — o protocolo padrão. O autor simplesmente quer pular para o remédio caro." },
        { quem: "estevao", emocao: "raiva", texto: "Oito meses de protocolo padrão documentados nos autos, com piora progressiva, Excelência. A 'alternativa' da Secretaria já foi tentada — e falhou." }
      ],
      decisao: {
        prompt: "Eficácia e alternativa terapêutica viraram o centro do caso. Como instruir ISSO num plantão?",
        opcoes: [
          { rotulo: "Nomear perito judicial para avaliar o caso, com laudo em 10 dias úteis",
            fundamento: "CPC, art. 156 — prova técnica",
            efeitos: { tec: -4, hum: -6, tempo: 6 },
            reacoes: [
              { quem: "roseane", emocao: "medo", texto: "Dez dias?... Doutor, o laudo fala em três." }
            ],
            feedback: { acerto: "ruim", titulo: "A perícia que chega ao velório",
              texto: "Perícia comum é o instrumento certo no tempo errado: 10 dias contra 72 horas. Para isso o CNJ criou o e-NatJus — nota técnica de urgência em horas, feita por médicos, exatamente sobre eficácia e alternativa. Estava certificado nos autos." },
            proxima: "s3" },

          { rotulo: "Decidir com o que há nos autos, sem instrução adicional: o laudo do assistente basta",
            fundamento: "Livre convencimento motivado",
            efeitos: { tec: 0, cel: 3, tempo: 4 },
            reacoes: [
              { quem: "renata", emocao: "neutro", texto: "Consigno que o laudo é do médico ASSISTENTE, Excelência — parte interessada, dirá o agravo." }
            ],
            feedback: { acerto: "bom", titulo: "Defensável — mas havia melhor",
              texto: "O laudo do assistente tem peso (Súmula vinculada ao Tema 106: cabe ao médico que acompanha indicar a imprescindibilidade), e decidir com ele é defensável. Mas a nota do e-NatJus blindaria a decisão contra o argumento de parcialidade — em 2 horas, sem custo. Convicção que pode ser reforçada de graça deve ser." },
            proxima: "s3" },

          { rotulo: "Solicitar AGORA a nota técnica de urgência ao e-NatJus, suspendendo a audiência por 2 horas",
            fundamento: "e-NatJus/CNJ; Tema 106/STJ — instrução qualificada de urgência",
            requerFoco: "f_natjus",
            efeitos: { tec: 8, cel: 2, tempo: 10 },
            carimbo: "NOTA TÉCNICA REQUISITADA",
            setFlags: { usouNatjus: true },
            reacoes: [
              { quem: "narrador", texto: "Duas horas depois, a nota técnica chega: eficácia comprovada para o estágio descrito, AUSÊNCIA de alternativa terapêutica no SUS após falha do protocolo padrão, urgência confirmada." },
              { quem: "renata", emocao: "surpresa", texto: "...o Município recebeu a mesma nota, Excelência. Sem impugnação técnica a apresentar." }
            ],
            feedback: { acerto: "otimo", titulo: "A perícia na velocidade da urgência",
              texto: "É o estado da arte em judicialização da saúde: o e-NatJus responde em horas, com isenção técnica, os três pontos do Tema 106. A nota desarma a tese da 'alternativa na rede' COM CIÊNCIA, não com retórica — e qualquer instância revisora pensará duas vezes antes de cassar uma liminar lastreada em nota do próprio CNJ." },
            proxima: "s3" }
        ]
      }
    },

    s3: {
      falas: [
        { quem: "narrador", texto: "Fim da tarde do plantão. Sobre a mesa: laudo, negativa, hipossuficiência — e o que você mandou juntar. No corredor, Alice dorme no colo da mãe de tranças desfeitas." },
        { quem: "estevao", emocao: "firme", texto: "Pronto para decisão, Excelência. Cada hora conta." }
      ],
      decisao: {
        prompt: "A liminar. Como você a escreve?",
        opcoes: [
          { rotulo: "Indeferir: 'a reserva do possível e o equilíbrio orçamentário impedem o Judiciário de criar despesa não prevista'",
            fundamento: "Reserva do possível; separação de poderes",
            efeitos: { tec: -8, hum: -12, tempo: 6 },
            carimbo: "LIMINAR INDEFERIDA",
            setFlags: { saudeNegada: true, manchaGrave: true },
            reacoes: [
              { quem: "roseane", emocao: "choro", texto: "Indeferido?... Doutor, ele tem TRÊS DIAS. O que eu falo pra Alice?" },
              { quem: "estevao", emocao: "raiva", texto: "Agravo com pedido de efeito ativo ao plantão do Tribunal AINDA NESTA HORA, Excelência." }
            ],
            feedback: { acerto: "grave", titulo: "A reserva do possível não cobre o mínimo existencial",
              texto: "O STF é constante: a reserva do possível não pode ser oposta ao núcleo do mínimo existencial — e nada é mais nuclear que a vida em risco iminente (RE 566.471; Tema 793). Com os três requisitos do Tema 106 PROVADOS nos autos, o indeferimento não protege o orçamento: transfere a decisão (e as 14 horas de atraso) ao plantão do TJ." },
            proxima: "fim_grave" },

          { rotulo: "Deferir em decisão concisa: 'presentes os requisitos da tutela de urgência, defiro como pedido'",
            fundamento: "CPC, art. 300",
            efeitos: { tec: 2, hum: 6, tempo: 5 },
            carimbo: "LIMINAR DEFERIDA",
            setFlags: { liminarFragil: true, liminarSaude: true },
            reacoes: [
              { quem: "roseane", emocao: "feliz", texto: "Deferiu?! Ai meu Deus... obrigada, doutor, obrigada!" },
              { quem: "renata", emocao: "neutro", texto: "O Município agrava, Excelência. A decisão não enfrentou o Tema 106 — o relator vai notar." }
            ],
            feedback: { acerto: "bom", titulo: "O remédio sai — a decisão fica devendo",
              texto: "O resultado imediato é o certo: o fármaco será fornecido. Mas decisão concisa demais em matéria de saúde é convite ao agravo: sem enfrentar expressamente os 3 requisitos do Tema 106 e a solidariedade (Tema 793), a liminar fica vulnerável à cassação — e tratamento interrompido no meio é dano clínico real." },
            proxima: "fim_bom" },

          { rotulo: "Deferir FUNDAMENTANDO ponto a ponto: Tema 106 (laudo + hipossuficiência + ANVISA), Tema 793 (solidariedade), nota e-NatJus, cumprimento em 24h sob pena de bloqueio de verba (REsp 1.069.810)",
            fundamento: "Temas 106/STJ e 793/STF; REsp 1.069.810 (bloqueio); CPC, art. 297",
            requerFoco: "f_tema106",
            efeitos: { tec: 10, hum: 8, cel: 2, tempo: 9 },
            carimbo: "LIMINAR — 24 HORAS",
            setFlags: { liminarSaude: true, liminarBlindada: true },
            reacoes: [
              { quem: "roseane", emocao: "choro", texto: "Vinte e quatro horas... Doutor, eu vou poder contar pro Joaquim HOJE. Hoje!" },
              { quem: "renata", emocao: "neutro", texto: "Com a nota do NatJus e os Temas enfrentados um a um... o Município cumprirá, Excelência. Agravo seria queimar dinheiro público em causa perdida." },
              { quem: "estevao", emocao: "feliz", texto: "É a decisão mais sólida que este Defensor já levou para a farmácia judicial, Excelência." }
            ],
            feedback: { acerto: "otimo", titulo: "A liminar que ninguém derruba",
              texto: "Decisão de manual: (1) Tema 106 enfrentado requisito a requisito, com prova de cada um; (2) Tema 793 fundamentando a escolha do réu (qualquer ente responde, solidariamente); (3) nota e-NatJus neutralizando a tese da alternativa; (4) prazo de 24h com bloqueio em caso de descumprimento — técnica admitida pelo STJ (REsp 1.069.810) que transforma a ordem em remédio NA VEIA, não no papel. O agravo morreu antes de nascer." },
            proxima: "fim_otimo" }
        ]
      }
    },

    fim_otimo: {
      falas: [
        { quem: "narrador", texto: "A intimação sai por mandado eletrônico antes de a sala esvaziar. No corredor, Roseane acorda Alice com a notícia. A menina, ainda meio dormindo, pergunta se agora pode fazer 'o desenho do juiz que ela prometeu'." }
      ],
      fim: {
        titulo: "O REMÉDIO CHEGOU A TEMPO",
        selo: "otimo",
        texto: "Vinte e quatro horas depois, a primeira dose corria na veia de Joaquim. A decisão — Temas enfrentados, nota técnica anexada, bloqueio armado — não deixou ao Município nada a fazer senão cumprir. O plantão terminou como deve terminar um plantão de saúde: com o relógio do processo correndo mais rápido que o da doença."
      }
    },

    fim_bom: {
      falas: [
        { quem: "narrador", texto: "A ordem sai. Roseane agradece três vezes na porta. O agravo do Município será distribuído amanhã — com chances reais, dirá qualquer procurador honesto." }
      ],
      fim: {
        titulo: "DEFERIDA — POR ENQUANTO",
        selo: "bom",
        texto: "Joaquim receberá o medicamento, e isso é o que importava hoje. Mas a liminar concisa entregou ao agravo a tese pronta: 'não enfrentou o Tema 106'. Se cair, o tratamento interrompe no meio. A diferença entre o bom e o ótimo, em saúde, mede-se em fundamentação por escrito."
      }
    },

    fim_grave: {
      falas: [
        { quem: "narrador", texto: "Roseane sai da sala apoiada no Defensor. Pela janela do plantão, dá para ver as duas atravessando a rua em direção ao ponto de ônibus: a mãe, a filha, e a pasta de exames que não convenceu ninguém." }
      ],
      fim: {
        titulo: "CATORZE HORAS DEPOIS",
        selo: "grave",
        texto: "O plantão do Tribunal deferiu a liminar de madrugada, com a fundamentação que estava à sua disposição desde as 10h da manhã: Tema 106 provado nos autos. O remédio chegou — 14 horas mais tarde do que podia. Em hepatologia, dirá o perito do futuro processo administrativo, 14 horas têm nome técnico: progressão de dano."
      }
    }
  }
});
