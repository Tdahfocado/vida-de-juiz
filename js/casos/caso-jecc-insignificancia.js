/* ============================================================
   CASO JECC: CRIMINAL — "O xampu de R$ 18"
   ------------------------------------------------------------
   Audiência de instrução no Juizado Especial Criminal. Furto
   tentado de bem de ínfimo valor, restituído na hora, réu
   primário. O caso é sobre o PRINCÍPIO DA INSIGNIFICÂNCIA e
   seus quatro vetores (STF, HC 84.412): mínima ofensividade,
   nenhuma periculosidade social, reduzido grau de reprovabilidade
   e inexpressividade da lesão jurídica.
   ============================================================ */

window.TOGA = window.TOGA || {};
TOGA.casos.push({
  id: "jecc-insignificancia",
  titulo: "JECrim — O xampu de R$ 18",
  subtitulo: "Um frasco no bolso, restituído na hora, réu primário. O Estado vai mesmo mover toda a sua máquina por isto?",
  area: "Juizado Especial Criminal",
  hora: "09:00",
  duracaoPrevistaMin: 30,
  tensao: 5,

  personagens: [
    { id: "edson", nome: "Edson", papel: "Réu", assento: "centro",
      avatar: { pele: "#a86a48", cabelo: "curto", corCabelo: "#241a10", traje: "camisa", corTraje: "#54453a" } },
    { id: "promotor", nome: "Dr. Heitor", papel: "Promotor", assento: "esq1",
      avatar: { pele: "#d8a87f", cabelo: "curto", corCabelo: "#3a2a1a", traje: "terno", corTraje: "#33424f", corGravata: "#5e2424", oculos: true } },
    { id: "defensora", nome: "Dra. Iara", papel: "Defensora pública", assento: "dir1",
      avatar: { pele: "#c98e66", cabelo: "coque", corCabelo: "#241a10", traje: "blazer", corTraje: "#2f4a3e", corBlusa: "#efe5c8" } }
  ],

  autos: {
    resumo: "Termo circunstanciado (JECrim). Edson, 41 anos, primário, tentou sair de um mercado com um frasco de xampu (R$ 18,90) no bolso do casaco. O fiscal o abordou ainda na loja; o produto foi restituído intacto à prateleira. Sem violência, sem grave ameaça. O MP ofereceu denúncia por furto tentado (CP, art. 155 c/c art. 14, II).",
    pecas: [
      { id: "to", titulo: "Termo circunstanciado",
        texto: "Bem subtraído: 1 frasco de xampu, R$ 18,90, restituído íntegro ao estabelecimento na própria abordagem. Réu primário, sem antecedentes. Não houve violência nem ameaça. O gerente declarou em juízo que 'não tem interesse em representar' e que 'o produto voltou para a gôndola'." },
      { id: "vetores", titulo: "Nota da Defensoria — princípio da insignificância",
        texto: "A defesa sustenta atipicidade material: presentes os quatro vetores do STF (HC 84.412/SP) — (i) mínima ofensividade da conduta, (ii) ausência de periculosidade social da ação, (iii) reduzido grau de reprovabilidade do comportamento e (iv) inexpressividade da lesão jurídica. Bem de R$ 18,90, restituído, réu primário, sem violência." },
      { id: "mp", titulo: "Manifestação do MP",
        texto: "O Ministério Público pondera que o valor é baixo, mas pede atenção: 'a bagatela não pode virar salvo-conduto'. Reconhece, contudo, que o réu é primário, que não houve violência e que o bem foi restituído de imediato." }
    ]
  },

  focos: [
    { id: "f_vetores", rotulo: "Os quatro vetores do STF", dica: "HC 84.412: mínima ofensividade + ausência de periculosidade + reduzida reprovabilidade + inexpressividade da lesão. Aqui, os quatro batem.",
      grifos: [{ peca: "vetores", trecho: "mínima ofensividade da conduta" }] },
    { id: "f_atipicidade", rotulo: "Atipicidade material", dica: "Insignificância exclui a TIPICIDADE material — é absolvição (CPP, 386, III), não perdão. O fato não é crime, não 'crime perdoado'.",
      grifos: [{ peca: "to", trecho: "restituído íntegro ao estabelecimento" }] }
  ],

  arco: {
    antes: { emocao: "medo", gesto: "angustia" },
    depois: [
      { se: function (f) { return !!f.insigReconhecida; }, tom: "bom",
        falas: [
          { quem: "edson", emocao: "choro", texto: "Doutor... eu passei a semana sem dormir achando que ia ser preso por um xampu. Obrigado por me OUVIR antes de me carimbar." }
        ] },
      { se: function (f) { return !!f.condenadoBagatela; }, tom: "grave",
        falas: [
          { quem: "defensora", emocao: "raiva", texto: "Uma ficha criminal por R$ 18,90 restituídos, Excelência. A Turma Recursal vai reformar — e vai citar o STF inteiro." }
        ] }
    ]
  },

  vidasTocadas: [
    { se: "insigReconhecida", tom: "bom",
      texto: "Edson saiu sem ficha criminal por um frasco que voltou à prateleira. O direito penal foi guardado para o que ele existe — não para humilhar a pobreza." },
    { se: "condenadoBagatela", tom: "grave",
      texto: "Edson carrega, agora, antecedente por furto de xampu. O emprego que ele procurava vai pedir certidão — e encontrar isto." }
  ],

  inicio: "c1",
  cenas: {

    c1: {
      falas: [
        { quem: "narrador", texto: "09h00 no Juizado Especial Criminal. Edson, 41 anos, mãos no colo, encolhido. A defensora arruma os autos finos; o promotor relê o termo." },
        { quem: "promotor", emocao: "firme", texto: "Excelência, o fato é típico: subtração de coisa alheia, ainda que tentada. O valor é baixo, reconheço, mas o tipo penal não exige valor mínimo." },
        { quem: "defensora", emocao: "firme", texto: "Bem de dezoito reais, Excelência, restituído na hora, réu primário, sem violência. Se isto não é insignificância, nada é. Os quatro vetores do Supremo estão TODOS presentes." }
      ],
      decisao: {
        prompt: "A instrução está encerrada. O fato é incontroverso. Como você decide?",
        opcoes: [
          { rotulo: "Condenar por furto tentado: 'o tipo penal não exige valor mínimo; bagatela é tese de defesa, não lei'",
            fundamento: "CP, art. 155 c/c 14, II",
            efeitos: { tec: -8, hum: -10, imp: -3, tempo: 6 },
            carimbo: "CONDENADO",
            setFlags: { condenadoBagatela: true, manchaGrave: true },
            reacoes: [
              { quem: "defensora", emocao: "raiva", texto: "Uma condenação por dezoito reais restituídos? Apelo à Turma Recursal HOJE, Excelência." },
              { quem: "edson", emocao: "choro", texto: "Eu vou ter ficha... por causa de um xampu?" }
            ],
            feedback: { acerto: "grave", titulo: "O tipo formal sem a tipicidade material",
              texto: "O furto é formalmente típico — mas a tipicidade penal exige também a dimensão MATERIAL: a lesão relevante ao bem jurídico. É a lição do STF no HC 84.412: ausentes ofensividade, periculosidade, reprovabilidade significativa e expressividade da lesão, o fato é materialmente atípico. Condenar aqui move toda a máquina penal contra dezoito reais que voltaram à prateleira — e produz, de quebra, um antecedente que pesará mais que o 'crime'." },
            proxima: "fim_grave" },

          { rotulo: "Suspender o processo e propor transação penal (cesta básica) 'para não deixar o fato impune'",
            fundamento: "Lei 9.099/95, art. 76",
            efeitos: { tec: -2, hum: -2, tempo: 5 },
            reacoes: [
              { quem: "defensora", emocao: "firme", texto: "Transação pressupõe FATO PUNÍVEL, Excelência. Se o fato é atípico, não há o que transacionar — seria impor uma pena a quem não cometeu crime." }
            ],
            feedback: { acerto: "ruim", titulo: "Transacionar o que sequer é crime",
              texto: "A transação penal é alternativa à persecução de um fato TÍPICO. Reconhecida a insignificância, não há tipicidade material — logo, não há fato punível para transacionar. Oferecer cesta básica 'para não ficar impune' é impor sanção a uma conduta atípica: contorna-se a absolvição que era devida e onera-se o réu por algo que não é crime." },
            proxima: "fim_ruim" },

          { rotulo: "Absolver por atipicidade material (princípio da insignificância): presentes os quatro vetores do STF — bem ínfimo, restituído, réu primário, sem violência",
            fundamento: "STF, HC 84.412; CP, art. 155; CPP, art. 386, III",
            requerFoco: "f_vetores",
            efeitos: { tec: 10, hum: 9, imp: 3, tempo: 7 },
            carimbo: "ABSOLVIDO — ATIPICIDADE",
            setFlags: { insigReconhecida: true },
            reacoes: [
              { quem: "promotor", emocao: "neutro", texto: "O Ministério Público registra a posição, Excelência. Com o bem restituído e o réu primário, não há interesse recursal." },
              { quem: "edson", emocao: "choro", texto: "Então... posso ir pra casa? De verdade?" },
              { quem: "defensora", emocao: "firme", texto: "É a aplicação exata do que o Supremo decidiu, Excelência. Justiça não é peneira de pobre." }
            ],
            feedback: { acerto: "otimo", titulo: "O direito penal no seu devido lugar",
              texto: "Decisão tecnicamente impecável: os quatro vetores do HC 84.412 estão presentes de forma cumulativa — mínima ofensividade, nenhuma periculosidade social, reduzidíssima reprovabilidade e lesão jurídica inexpressiva (R$ 18,90 restituídos). A insignificância exclui a tipicidade MATERIAL, levando à absolvição (CPP, art. 386, III) — não é perdão nem favor, é reconhecer que o fato não chegou a ser crime. O direito penal, ultima ratio, fica reservado para o que de fato lesa a sociedade." },
            proxima: "fim_otimo" }
        ]
      }
    },

    fim_otimo: {
      falas: [
        { quem: "narrador", texto: "Edson assina o termo, ainda incrédulo, e atravessa o corredor do Juizado de cabeça erguida. A defensora recolhe os autos — finos, e agora encerrados do jeito certo." }
      ],
      fim: {
        titulo: "A BAGATELA NO LUGAR CERTO",
        selo: "otimo",
        texto: "Reconhecer a insignificância não foi leniência: foi técnica. O direito penal é a última razão do Estado, não a primeira reação contra a miséria. Um frasco de xampu de dezoito reais, restituído, não move legitimamente a máquina que prende, processa e estigmatiza. A Turma Recursal não terá o que reformar — porque o STF já disse, e você aplicou."
      }
    },

    fim_ruim: {
      falas: [
        { quem: "narrador", texto: "Edson aceita a cesta básica para 'se livrar logo' — e sai pensando que pagou por algo que, no fim, não era crime." }
      ],
      fim: {
        titulo: "TRANSAÇÃO SEM CRIME",
        selo: "ruim",
        texto: "O resultado parece brando, mas a lógica está invertida: impôs-se um ônus a quem deveria ter sido absolvido. Transação penal supõe fato punível; reconhecida a insignificância, não havia o que transacionar. O atalho do 'pelo menos não fica impune' cobrou de Edson o preço de um crime que não existiu."
      }
    },

    fim_grave: {
      falas: [
        { quem: "narrador", texto: "A sentença condenatória é juntada. Edson sai com a certidão que o seguirá em cada ficha de emprego — por dezoito reais que voltaram à prateleira." }
      ],
      fim: {
        titulo: "A FICHA DE R$ 18",
        selo: "grave",
        texto: "Formalmente típico, materialmente insignificante: a condenação ignorou a metade da tipicidade que importa. A apelação tem o STF inteiro a favor, mas o estigma já foi gravado. O direito penal, que deveria ser a última razão, virou a primeira — e mais pesada — resposta contra a pobreza."
      }
    }
  }
});
