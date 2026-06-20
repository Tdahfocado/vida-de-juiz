/* ============================================================
   CASO JECC: CÍVEL — "Nome sujo por dívida que não existe"
   ------------------------------------------------------------
   Audiência una do Juizado Especial Cível. Negativação por
   débito que o banco não comprova. Dois eixos: (1) a Lei
   9.099/95 manda TENTAR a conciliação primeiro; (2) no mérito,
   a inexistência do débito deve ser declarada — mas o dano
   moral esbarra na Súmula 385 do STJ quando já há inscrição
   legítima preexistente.
   ============================================================ */

window.TOGA = window.TOGA || {};
TOGA.casos.push({
  id: "jecc-negativacao",
  titulo: "JECível — Nome sujo por dívida que não existe",
  subtitulo: "O banco negativou um débito que não comprova. Mas o autor já tinha outra inscrição — e isso muda o dano moral.",
  area: "Juizado Especial Cível",
  hora: "10:30",
  duracaoPrevistaMin: 35,
  tensao: 4,

  personagens: [
    { id: "marta", nome: "Marta", papel: "Autora (sem advogado)", assento: "centro",
      avatar: { pele: "#a86a48", cabelo: "longo", corCabelo: "#241a10", traje: "camisa", corTraje: "#556a55" } },
    { id: "preposto", nome: "Sr. Daniel", papel: "Preposto do banco", assento: "esq1",
      avatar: { pele: "#d8a87f", cabelo: "curto", corCabelo: "#3a2a1a", traje: "terno", corTraje: "#2a2a30", corGravata: "#33424f" } },
    { id: "advBanco", nome: "Dra. Sílvia", papel: "Advogada do banco", assento: "esq2",
      avatar: { pele: "#e8c39a", cabelo: "coque", corCabelo: "#3a2a1a", traje: "blazer", corTraje: "#33424f", corBlusa: "#efe5c8", oculos: true } },
    { id: "rochelleC", nome: "Rochelle", papel: "Conciliadora", assento: "dir2",
      avatar: { pele: "#d8a87f", cabelo: "longo", corCabelo: "#3a2a1a", traje: "vestido", corTraje: "#7a2e4a", corBlusa: "#efe5c8" } }
  ],

  autos: {
    resumo: "Ação declaratória c/c indenização (JECível, jus postulandi). Marta pede a baixa de uma negativação de R$ 1.240 lançada por um banco com quem afirma nunca ter contratado, mais dano moral. O banco não junta contrato nem prova da origem da dívida. PORÉM: extrato dos órgãos de proteção mostra que Marta já tinha, à época, OUTRA negativação legítima e não discutida (de uma loja, por compra inadimplida).",
    pecas: [
      { id: "inscricao", titulo: "Extrato de negativação",
        texto: "Inscrição do banco: R$ 1.240, sem contrato anexado, sem comprovação de origem. O banco, intimado, não apresentou o instrumento contratual nem prova da relação jurídica. À mesma época, consta inscrição ANTERIOR de uma loja (R$ 320), legítima e não impugnada por Marta." },
      { id: "sumula", titulo: "Nota da assessoria — Súmula 385/STJ",
        texto: "Súmula 385 do STJ: 'Da anotação irregular em cadastro de proteção ao crédito, NÃO cabe indenização por dano moral, quando PREEXISTENTE legítima inscrição, ressalvado o direito ao cancelamento.' A inexistência do débito do banco deve ser declarada de todo modo; o dano moral é que fica afastado pela inscrição legítima anterior." },
      { id: "conciliacao", titulo: "Lei 9.099/95 — fase conciliatória",
        texto: "No rito dos Juizados, a audiência começa pela tentativa de conciliação (arts. 21 e 22). Só frustrado o acordo passa-se à instrução e julgamento. A conciliadora Rochelle está à disposição para conduzir a composição." }
    ]
  },

  focos: [
    { id: "f_concilia", rotulo: "Conciliação primeiro", dica: "Lei 9.099/95, arts. 21-22: o rito começa pela tentativa de acordo, conduzida com isenção — sem pressionar a parte vulnerável a aceitar qualquer coisa.",
      grifos: [{ peca: "conciliacao", trecho: "começa pela tentativa de conciliação" }] },
    { id: "f_sumula", rotulo: "A Súmula 385/STJ", dica: "Débito inexistente: declara-se a inexistência e a baixa SEMPRE. O dano moral é que NÃO cabe quando havia inscrição legítima preexistente.",
      grifos: [{ peca: "sumula", trecho: "PREEXISTENTE legítima inscrição" }] }
  ],

  arco: {
    antes: { emocao: "triste" },
    depois: [
      { se: function (f) { return !!f.negSolucaoCorreta; }, tom: "bom",
        falas: [
          { quem: "marta", emocao: "neutro", texto: "Entendi, doutor. O dano moral eu não ganhei por causa da outra dívida — mas o nome sai dessa cobrança que não era minha. Justo." }
        ] }
    ]
  },

  vidasTocadas: [
    { se: "negSolucaoCorreta", tom: "bom",
      texto: "A cobrança indevida saiu do nome de Marta. O dano moral não veio — mas não por descaso, e sim porque a lei o reservava a quem não tinha mancha legítima anterior." },
    { se: "negDanoIndevido", tom: "grave",
      texto: "A condenação por dano moral, contra a Súmula 385, será reformada na Turma Recursal — e o banco aprenderá que negativar sem contrato 'compensa', desde que o juiz erre a súmula." }
  ],

  inicio: "c1",
  cenas: {

    c1: {
      falas: [
        { quem: "narrador", texto: "10h30, Juizado Especial Cível. Marta veio sem advogado — atermou a própria petição na semana passada. A conciliadora Rochelle puxa a cadeira ao lado das partes." },
        { quem: "advBanco", emocao: "neutro", texto: "Excelência, o banco propõe acordo: baixa da inscrição e R$ 300 'de mera liberalidade', sem reconhecer culpa. Encerra hoje." },
        { quem: "marta", emocao: "triste", texto: "Eu só quero meu nome limpo dessa dívida que nunca foi minha, doutor. Mas trezentos reais... eu não entendo se é bom ou se estou sendo passada pra trás." }
      ],
      decisao: {
        prompt: "Abertura da audiência. Como você conduz a fase inicial?",
        opcoes: [
          { rotulo: "Pressionar Marta a aceitar os R$ 300 'porque é melhor que nada e zera a pauta de hoje'",
            fundamento: "Celeridade",
            efeitos: { tec: -8, hum: -8, tempo: 4 },
            setFlags: { negPressionada: true },
            reacoes: [
              { quem: "rochelleC", emocao: "firme", texto: "Excelência, conciliar não é coagir. Se ela aceitar sem entender o que abre mão, o acordo nasce torto — e eu não conduzo assim." }
            ],
            feedback: { acerto: "ruim", titulo: "Acordo não é pressão",
              texto: "A conciliação é um direito da parte, não uma meta de produtividade do juízo. Pressionar a autora vulnerável (sem advogado) a aceitar valor que ela sequer compreende inverte o papel do conciliador e do juiz: a composição deve ser informada e livre. Zerar pauta às custas do esclarecimento da parte é o oposto do que a Lei 9.099/95 pretende com a oralidade e a informalidade." },
            proxima: "c2" },

          { rotulo: "Dispensar a conciliação e já sentenciar: 'o banco não juntou contrato, é perda de tempo conversar'",
            fundamento: "Eficiência",
            efeitos: { tec: -5, hum: -2, tempo: 3 },
            reacoes: [
              { quem: "advBanco", emocao: "neutro", texto: "Excelência, a fase conciliatória é etapa do rito (arts. 21 e 22). Suprimi-la pode gerar nulidade." }
            ],
            feedback: { acerto: "ruim", titulo: "O rito tem uma porta de entrada",
              texto: "Mesmo quando o mérito parece claro, o rito dos Juizados começa pela tentativa de conciliação (Lei 9.099/95, arts. 21 e 22). Suprimi-la é atalho que arrisca nulidade e desperdiça a chance real de a parte sair com solução hoje. Conduzir a conciliação custa minutos; ignorá-la custa o procedimento." },
            proxima: "c2" },

          { rotulo: "Conduzir a conciliação com isenção: esclarecer a Marta seus direitos e os riscos, deixá-la decidir livre; sem acordo, prosseguir para julgamento",
            fundamento: "Lei 9.099/95, arts. 2º, 21 e 22",
            requerFoco: "f_concilia",
            efeitos: { tec: 8, hum: 9, tempo: 6 },
            carimbo: "CONCILIAÇÃO TENTADA",
            setFlags: { negConciliouBem: true },
            reacoes: [
              { quem: "rochelleC", emocao: "feliz", texto: "Assim sim, Excelência. Expliquei tudo a ela: o que ganha, o que abre mão. Ela preferiu o julgamento — e é direito dela." },
              { quem: "marta", emocao: "firme", texto: "Agora entendi. Prefiro que o senhor decida, doutor." }
            ],
            feedback: { acerto: "otimo", titulo: "Conciliação como deve ser",
              texto: "A condução exemplar do art. 2º e dos arts. 21-22 da Lei 9.099/95: a conciliação foi tentada de verdade, com a parte vulnerável devidamente esclarecida sobre direitos e riscos, e a decisão de não acordar foi DELA, livre e informada. Frustrada a composição, passa-se legitimamente à instrução e ao julgamento. Celeridade com respeito ao contraditório, não no lugar dele." },
            proxima: "c2" }
        ]
      }
    },

    c2: {
      falas: [
        { quem: "narrador", texto: "Sem acordo, passa-se ao mérito. O banco não trouxe contrato nem prova da dívida de R$ 1.240. Mas o extrato revela: Marta já tinha, antes, uma inscrição legítima de uma loja, que ela não discute." },
        { quem: "advBanco", emocao: "neutro", texto: "Excelência, se for o caso de baixa, que se reconheça ao menos que NÃO há dano moral: havia inscrição preexistente legítima. Súmula 385 do STJ." },
        { quem: "marta", emocao: "triste", texto: "Mas o nome sai dessa cobrança que não é minha, né, doutor? A da loja eu sei que devo. Essa do banco, não." }
      ],
      decisao: {
        prompt: "Mérito. Débito do banco não comprovado, mas há inscrição legítima anterior. O que você decide?",
        opcoes: [
          { rotulo: "Condenar o banco a dano moral integral (R$ 15.000): 'negativação indevida é dano in re ipsa, independe de prova'",
            fundamento: "Dano moral in re ipsa",
            efeitos: { tec: -9, hum: -2, imp: -3, tempo: 7 },
            carimbo: "DANO MORAL — R$ 15.000",
            setFlags: { negDanoIndevido: true, manchaGrave: true },
            reacoes: [
              { quem: "advBanco", emocao: "raiva", texto: "Súmula 385, Excelência! Já havia inscrição legítima! Recurso garantido à Turma Recursal." }
            ],
            feedback: { acerto: "ruim", titulo: "O dano in re ipsa tem uma exceção sumulada",
              texto: "É verdade que a negativação indevida costuma gerar dano moral presumido — MAS há a exceção da Súmula 385 do STJ: se já existia inscrição legítima preexistente (a da loja, não discutida), o abalo de crédito já estava configurado por causa lícita, e não cabe indenização por dano moral, ressalvada a baixa. Condenar em R$ 15.000 ignora a súmula e será reformado; a baixa da cobrança indevida é que era devida." },
            proxima: "fim_ruim" },

          { rotulo: "Julgar tudo improcedente: 'se já tinha outra negativação, não há dano algum e a cobrança do banco que permaneça'",
            fundamento: "Súmula 385/STJ (mal aplicada)",
            efeitos: { tec: -10, hum: -8, tempo: 6 },
            carimbo: "IMPROCEDENTE",
            setFlags: { negCobrancaMantida: true, manchaGrave: true },
            reacoes: [
              { quem: "marta", emocao: "raiva", texto: "Então eu continuo devendo uma dívida que não é minha?? O senhor não disse que o banco não provou nada?" }
            ],
            feedback: { acerto: "grave", titulo: "A súmula afasta o dano, não a declaração",
              texto: "Confusão grave: a Súmula 385 do STJ afasta apenas o DANO MORAL — não legitima a cobrança indevida. O débito do banco, sem contrato e sem prova de origem, é inexistente e DEVE ser declarado, com a baixa da inscrição. Julgar tudo improcedente mantém no nome de Marta uma dívida que o próprio banco não comprovou: nega-se o pedido principal (a inexistência) com base numa súmula que só tratava do acessório (o dano)." },
            proxima: "fim_grave" },

          { rotulo: "Declarar a inexistência do débito e determinar a BAIXA da inscrição do banco — mas NEGAR o dano moral, por força da Súmula 385/STJ (inscrição legítima preexistente)",
            fundamento: "STJ, Súmula 385; CDC; CPC, art. 373, II (ônus da ré)",
            requerFoco: "f_sumula",
            efeitos: { tec: 10, hum: 7, imp: 3, tempo: 8 },
            carimbo: "INEXISTÊNCIA + BAIXA",
            setFlags: { negSolucaoCorreta: true },
            reacoes: [
              { quem: "advBanco", emocao: "neutro", texto: "Sem dano moral, o banco não recorre, Excelência. Cumpriremos a baixa." },
              { quem: "marta", emocao: "firme", texto: "Tá certo, doutor. A cobrança errada sai; a certa eu resolvo com a loja. Agora ficou claro." }
            ],
            feedback: { acerto: "otimo", titulo: "Cada pedido na sua medida",
              texto: "Decisão precisa: o banco não se desincumbiu do ônus de provar a relação jurídica (CPC, art. 373, II), então o débito é inexistente e a inscrição deve ser cancelada — pedido principal procedente. Já o dano moral é afastado pela Súmula 385 do STJ, porque havia inscrição legítima preexistente: o abalo já decorria de causa lícita. Separar o que a súmula afasta (o dano) do que ela preserva (a baixa) é exatamente o que se esperava — solução tecnicamente correta e justa com a parte." },
            proxima: "fim_otimo" }
        ]
      }
    },

    fim_otimo: {
      falas: [
        { quem: "narrador", texto: "Marta sai com a certeza do que é seu e do que não é: a cobrança indevida cai, a dívida real ela negocia com a loja. Rochelle anota mais um caso resolvido na manhã." }
      ],
      fim: {
        titulo: "CADA PEDIDO NA SUA MEDIDA",
        selo: "otimo",
        texto: "A inexistência do débito não comprovado foi declarada e a inscrição, baixada — o banco que negativa sem contrato responde por isso. O dano moral, porém, ficou afastado pela Súmula 385: havia mancha legítima anterior. Decidir é separar o joio do trigo pedido a pedido — e foi o que esta sentença fez, com técnica e sem populismo."
      }
    },

    fim_ruim: {
      falas: [
        { quem: "narrador", texto: "A condenação milionária em dano moral sai — e, com ela, a apelação do banco, com a Súmula 385 grifada na primeira linha." }
      ],
      fim: {
        titulo: "DANO MORAL CONTRA A SÚMULA",
        selo: "ruim",
        texto: "A baixa era devida, e isso a sentença acertou. Mas o dano moral de R$ 15.000, diante de inscrição legítima preexistente, contraria a Súmula 385 do STJ e será reformado na Turma Recursal. O bom resultado (limpar o nome) ficou contaminado pelo excesso — e a reforma fará parecer que o banco 'ganhou'."
      }
    },

    fim_grave: {
      falas: [
        { quem: "narrador", texto: "Marta deixa o Juizado ainda devendo, no nome, uma quantia que o banco jamais comprovou. Ela não entende — e tem razão de não entender." }
      ],
      fim: {
        titulo: "A DÍVIDA QUE FICOU SEM DONO",
        selo: "grave",
        texto: "A Súmula 385 afasta o dano moral — não a cobrança indevida. Julgar tudo improcedente manteve no nome de Marta um débito que o próprio banco não provou existir, negando o pedido principal com base numa súmula que só tratava do acessório. O recurso da autora terá razão fácil; o desgaste, ela já levou."
      }
    }
  }
});
