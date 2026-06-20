/* ============================================================
   CASO JECC: CRIMINAL — "A moto sem carteira"
   ------------------------------------------------------------
   Audiência no Juizado Especial Criminal. Conduzir motocicleta
   sem habilitação (CTB, art. 309) — mas o tipo penal exige
   "GERANDO PERIGO DE DANO" (crime de perigo CONCRETO; Súmula 720
   do STF). No caso, a condução foi tranquila, em via vazia, sem
   manobra arriscada: NÃO há perigo concreto, logo NÃO há crime —
   só infração administrativa (CTB, art. 162). O MP insiste na
   condenação. A decisão certa é reconhecer a atipicidade.
   ============================================================ */

window.TOGA = window.TOGA || {};
TOGA.casos.push({
  id: "jecc-cnh",
  titulo: "JECrim — A moto sem carteira",
  subtitulo: "Pilotava sem CNH, mas devagar, em rua vazia, sem risco a ninguém. O art. 309 exige perigo de dano — e não houve.",
  area: "Juizado Especial Criminal",
  hora: "09:40",
  duracaoPrevistaMin: 30,
  tensao: 5,
  sala: "jecc",

  personagens: [
    { id: "denis", nome: "Dênis", papel: "Autor do fato (réu)", assento: "centro",
      avatar: { pele: "#c98e66", cabelo: "curto", corCabelo: "#241a10", traje: "camisa", corTraje: "#4a5a6e" } },
    { id: "mpCnh", nome: "Dr. Heitor", papel: "Promotor", assento: "esq1",
      avatar: { pele: "#d8a87f", cabelo: "curto", corCabelo: "#3a2a1a", traje: "terno", corTraje: "#33424f", corGravata: "#5e2424", oculos: true } },
    { id: "defCnh", nome: "Dr. Aldo", papel: "Defensor público", assento: "dir1",
      avatar: { pele: "#a86a48", cabelo: "calvo", corCabelo: "#9a9388", traje: "blazer", corTraje: "#4a4438", corBlusa: "#e8e2d2" } }
  ],

  autos: {
    resumo: "Termo circunstanciado (JECrim): Dênis foi flagrado conduzindo motocicleta sem habilitação, numa rua residencial vazia, em baixa velocidade, sem qualquer manobra perigosa, capacete na cabeça. A própria guarnição registrou que 'não havia trânsito nem risco aparente'. O MP ofereceu denúncia por CTB, art. 309, e pede a condenação.",
    pecas: [
      { id: "to", titulo: "Termo circunstanciado",
        texto: "Condução de motocicleta sem CNH, rua residencial, fluxo inexistente, velocidade baixa, sem zigue-zague, sem quase-colisão, sem terceiros em risco. A guarnição consignou expressamente: 'sem perigo aparente'. Não há vítima, dano, nem manobra arriscada descrita. Réu primário." },
      { id: "art309", titulo: "Nota da Defensoria — CTB, art. 309, e Súmula 720/STF",
        texto: "O art. 309 do CTB pune conduzir sem habilitação SOMENTE quando a conduta gera PERIGO DE DANO — é crime de perigo CONCRETO, não presumido. A Súmula 720 do STF é expressa nesse sentido. Ausente o perigo concreto (como aqui), o fato é ATÍPICO penalmente, configurando MERA infração administrativa (CTB, art. 162, I). A defesa pede a rejeição da denúncia / absolvição." },
      { id: "mp", titulo: "Manifestação do MP",
        texto: "O Ministério Público sustenta que 'dirigir sem habilitação é grave e deve ser punido' e pede a condenação no art. 309, argumentando que o simples ato de pilotar sem CNH já bastaria. Não aponta, contudo, nenhum fato concreto de perigo no termo." }
    ]
  },

  focos: [
    { id: "f_perigo", rotulo: "O perigo de dano (elementar)", dica: "Art. 309 é crime de perigo CONCRETO: sem perigo de dano demonstrado, falta elementar do tipo — o fato é atípico.",
      grifos: [{ peca: "to", trecho: "sem perigo aparente" }] },
    { id: "f_sumula720", rotulo: "Súmula 720/STF", dica: "A Súmula 720 do STF firma que o art. 309 exige perigo concreto. Sem ele, resta apenas a infração administrativa (CTB, art. 162).",
      grifos: [{ peca: "art309", trecho: "crime de perigo CONCRETO, não presumido" }] }
  ],

  arco: {
    antes: { emocao: "medo" },
    depois: [
      { se: function (f) { return !!f.cnhAtipicidade; }, tom: "bom",
        falas: [
          { quem: "denis", emocao: "feliz", texto: "Doutor, eu errei sim em pilotar sem carteira — vou tirar a minha, juro. Mas eu não pus ninguém em risco. Obrigado por ver a diferença entre errar e ser criminoso." }
        ] },
      { se: function (f) { return !!f.cnhCondenado; }, tom: "grave",
        falas: [
          { quem: "defCnh", emocao: "raiva", texto: "Condenação sem o perigo de dano, Excelência? A Súmula 720 do STF está no caminho. A Turma Recursal absolve." }
        ] }
    ]
  },

  vidasTocadas: [
    { se: "cnhAtipicidade", tom: "bom",
      texto: "Dênis responde pela infração administrativa que cometeu — não por um crime que não existiu. A multa educa; a ficha criminal só destruiria." },
    { se: "cnhCondenado", tom: "grave",
      texto: "Dênis saiu com antecedente criminal por pilotar devagar numa rua vazia. O emprego que ele buscava pedirá certidão — e encontrará isto." },
    { se: "cnhProcessado", tom: "grave",
      texto: "Virou réu para 'apurar' um perigo que o próprio termo disse não existir. Meses de processo por uma multa de trânsito." }
  ],

  inicio: "c1",
  cenas: {

    c1: {
      falas: [
        { quem: "narrador", texto: "09h40. Dênis, 24 anos, encolhido. O termo é claro: rua vazia, baixa velocidade, sem risco. O promotor, ainda assim, quer condenação." },
        { quem: "mpCnh", emocao: "firme", texto: "Excelência, dirigir sem habilitação é grave. O Ministério Público pede a condenação no art. 309 do CTB. Punir é dar exemplo." },
        { quem: "defCnh", emocao: "firme", texto: "Excelência, o art. 309 exige PERIGO DE DANO — é crime de perigo concreto, Súmula 720 do STF. O termo diz, com todas as letras: 'sem perigo aparente'. Sem o perigo, não há crime, há infração administrativa." },
        { quem: "denis", emocao: "medo", texto: "Eu sei que errei pilotando sem carteira, doutor. Mas eu tava devagar, rua vazia... não fiz mal a ninguém." }
      ],
      decisao: {
        prompt: "O MP quer condenação; o termo afasta o perigo concreto. O que você decide?",
        opcoes: [
          { rotulo: "Condenar pelo art. 309: 'pilotar sem habilitação já é crime, independe de perigo'",
            fundamento: "CTB, art. 309",
            efeitos: { tec: -10, hum: -8, imp: -3, tempo: 7 },
            carimbo: "CONDENADO",
            setFlags: { cnhCondenado: true, manchaGrave: true },
            reacoes: [
              { quem: "defCnh", emocao: "raiva", texto: "Sem perigo de dano, Excelência?! Súmula 720 do STF. Apelo à Turma Recursal hoje." },
              { quem: "denis", emocao: "choro", texto: "Vou ter ficha criminal... por isso?" }
            ],
            feedback: { acerto: "grave", titulo: "A elementar que faltou",
              texto: "O art. 309 do CTB não pune o mero conduzir sem habilitação: pune fazê-lo GERANDO PERIGO DE DANO — é crime de perigo concreto, como firma a Súmula 720 do STF. O termo afasta expressamente o perigo ('sem perigo aparente'). Ausente a elementar, o fato é penalmente atípico, restando a infração administrativa (CTB, art. 162, I). Condenar aqui ignora o próprio tipo penal e produz um antecedente que a Turma Recursal vai cassar." },
            proxima: "fim_grave" },

          { rotulo: "Receber a denúncia e designar instrução 'para apurar se houve perigo'",
            fundamento: "CTB, art. 309; recebimento",
            efeitos: { tec: -5, hum: -4, tempo: 6 },
            carimbo: "DENÚNCIA RECEBIDA",
            setFlags: { cnhProcessado: true },
            reacoes: [
              { quem: "defCnh", emocao: "firme", texto: "Apurar o quê, Excelência? O próprio termo da autoridade afasta o perigo. Falta justa causa." }
            ],
            feedback: { acerto: "ruim", titulo: "Instruir o que o termo já respondeu",
              texto: "Não há o que 'apurar': a peça que embasaria a denúncia já consigna a ausência de perigo de dano — não há lastro mínimo da elementar do tipo. Sem justa causa, a denúncia deve ser rejeitada (CPP, art. 395), e não recebida para uma instrução que nasce vazia. Designar audiência aqui é submeter o autor a meses de ação penal por um fato que, no melhor cenário do MP, continua sendo mera infração administrativa." },
            proxima: "fim_ruim" },

          { rotulo: "Rejeitar a denúncia / absolver por atipicidade: sem perigo de dano concreto, o art. 309 não se configura (Súmula 720/STF) — é infração administrativa, não crime",
            fundamento: "CTB, art. 309, e art. 162, I; STF, Súmula 720; CPP, art. 395, III",
            requerFoco: "f_perigo",
            efeitos: { tec: 10, hum: 8, imp: 3, tempo: 6 },
            carimbo: "ATÍPICO — REJEITADA",
            setFlags: { cnhAtipicidade: true },
            reacoes: [
              { quem: "mpCnh", emocao: "raiva", texto: "O Ministério Público recorre, Excelência." },
              { quem: "defCnh", emocao: "firme", texto: "Decisão correta. Trânsito sem CNH tem resposta — administrativa, na via própria." },
              { quem: "denis", emocao: "feliz", texto: "Então não é crime... mas eu vou tirar a carteira, doutor. De verdade." }
            ],
            feedback: { acerto: "otimo", titulo: "Crime de perigo concreto, sem o perigo",
              texto: "Decisão tecnicamente impecável. O art. 309 do CTB é crime de perigo CONCRETO: exige a elementar 'gerando perigo de dano', como cristalizou a Súmula 720 do STF. O termo afasta o perigo ('sem perigo aparente'), de modo que o fato é penalmente atípico — reconhece-se a inexistência de justa causa (CPP, art. 395, III) e remete-se a conduta à esfera ADMINISTRATIVA (CTB, art. 162, I), onde ela de fato cabe. Punir o trânsito é legítimo; transformar infração administrativa em crime, não. Cabe recurso do MP — e a lei está com você." },
            proxima: "fim_otimo" }
        ]
      }
    },

    fim_otimo: {
      falas: [
        { quem: "narrador", texto: "Dênis respira fundo, agradece ao defensor e sai decidido a tirar a habilitação. O promotor anota a intenção de recorrer; a decisão, porém, se ampara no STF." }
      ],
      fim: {
        titulo: "INFRAÇÃO NÃO É CRIME",
        selo: "otimo",
        texto: "Reconhecer a atipicidade foi aplicar a lei, não relevá-la. O art. 309 do CTB pune o perigo concreto — e ele não existiu. Pilotar sem CNH numa rua vazia, devagar, é infração administrativa, com multa e medidas próprias; não é caso de ficha criminal. O Juizado distinguiu o que a lei distingue: errar no trânsito e ser criminoso são coisas diferentes."
      }
    },

    fim_ruim: {
      falas: [
        { quem: "narrador", texto: "Recebida a denúncia, Dênis vira réu para que se 'apure' um perigo que o termo já havia negado. A instrução começa vazia — e custosa." }
      ],
      fim: {
        titulo: "INSTRUÇÃO SEM LASTRO",
        selo: "ruim",
        texto: "Não havia o que apurar: a própria peça policial afastava o perigo de dano, elementar do art. 309. Sem justa causa, cabia rejeitar a denúncia — não recebê-la para uma instrução que nasce sem objeto. Resultado: meses de ação penal por uma conduta que, no limite, é apenas infração administrativa."
      }
    },

    fim_grave: {
      falas: [
        { quem: "narrador", texto: "A condenação é lavrada. Dênis sai com a certidão que pesará em cada entrevista de emprego — por ter pilotado devagar numa rua deserta." }
      ],
      fim: {
        titulo: "FICHA POR UMA INFRAÇÃO DE TRÂNSITO",
        selo: "grave",
        texto: "Condenar pelo art. 309 sem o perigo de dano ignora a elementar do tipo e a Súmula 720 do STF. O que havia era infração administrativa (CTB, art. 162), não crime. A apelação tem o Supremo a favor, mas o antecedente já foi gravado — o direito penal usado onde bastava uma multa."
      }
    }
  }
});
