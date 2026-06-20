/* ============================================================
   CASO JECC: CRIMINAL — "O mesmo valor, outra história"
   ------------------------------------------------------------
   Furto de valor igual ao do caso anterior — mas o réu é
   reincidente ESPECÍFICO e contumaz. O caso ensina o LIMITE do
   princípio da insignificância: a jurisprudência do STF/STJ
   afasta a bagatela diante de reincidência/habitualidade
   delitiva, pelo alto grau de reprovabilidade. O desafio é
   afastar a insignificância SEM cair na desproporção.
   ============================================================ */

window.TOGA = window.TOGA || {};
TOGA.casos.push({
  id: "jecc-reincidente",
  titulo: "JECrim — O mesmo valor, outra história",
  subtitulo: "Bem de valor ínfimo, de novo. Mas é a sétima vez do mesmo réu, pelo mesmo crime. A bagatela vale aqui?",
  area: "Juizado Especial Criminal",
  hora: "09:40",
  duracaoPrevistaMin: 35,
  tensao: 7,

  personagens: [
    { id: "rui", nome: "Rui", papel: "Réu", assento: "centro",
      avatar: { pele: "#c98e66", cabelo: "curto", corCabelo: "#241a10", traje: "camisa", corTraje: "#3a3a40", barba: true } },
    { id: "promotor2", nome: "Dr. Heitor", papel: "Promotor", assento: "esq1",
      avatar: { pele: "#d8a87f", cabelo: "curto", corCabelo: "#3a2a1a", traje: "terno", corTraje: "#33424f", corGravata: "#5e2424", oculos: true } },
    { id: "defensor2", nome: "Dr. Aldo", papel: "Defensor público", assento: "dir1",
      avatar: { pele: "#a86a48", cabelo: "calvo", corCabelo: "#9a9388", traje: "blazer", corTraje: "#4a4438", corBlusa: "#e8e2d2" } }
  ],

  autos: {
    resumo: "Furto consumado (CP, art. 155): Rui subtraiu duas barras de chocolate e um desodorante (R$ 41,70) de um mercado. O bem foi recuperado. À primeira vista, valor baixo — MAS a folha de antecedentes registra SEIS condenações anteriores por furto, todas pelo mesmo modo, a última há quatro meses. Há ação penal em curso por fato idêntico.",
    pecas: [
      { id: "folha", titulo: "Folha de antecedentes",
        texto: "Seis condenações transitadas em julgado por furto (CP, art. 155), todas por subtração em mercados, a mais recente há 4 meses. Uma ação penal em andamento pelo mesmo tipo. O réu é tecnicamente REINCIDENTE ESPECÍFICO e revela HABITUALIDADE/contumácia na prática." },
      { id: "limite", titulo: "Nota da assessoria — limite da insignificância",
        texto: "STF e STJ: o reduzido valor do bem NÃO basta para a insignificância quando presente reincidência específica/habitualidade delitiva — o vetor 'reduzido grau de reprovabilidade' fica comprometido. (STF, HC 123.108; STJ, Súmula 511 e jurisprudência das Turmas). A bagatela não é salvo-conduto para a contumácia." },
      { id: "defesa", titulo: "Tese da Defensoria",
        texto: "A defesa pede insignificância pelo valor (R$ 41,70, recuperado) e, subsidiariamente, pena no mínimo, substituída por restritiva de direitos: 'fome reincide, doutor; cadeia por chocolate não recupera ninguém'. Aponta a desproporção de regime fechado para o caso." }
    ]
  },

  focos: [
    { id: "f_limite", rotulo: "O limite da bagatela", dica: "Valor baixo + reincidência específica/habitualidade = insignificância AFASTADA (STF HC 123.108; STJ). O 3º vetor (reprovabilidade) não se sustenta.",
      grifos: [{ peca: "limite", trecho: "NÃO basta para a insignificância" }] },
    { id: "f_proporcao", rotulo: "Condenar sem exagerar", dica: "Afastar a bagatela não autoriza desproporção: pena-base no mínimo, e substituição por restritiva de direitos (CP, art. 44) onde cabível.",
      grifos: [{ peca: "defesa", trecho: "substituída por restritiva de direitos" }] }
  ],

  arco: {
    antes: { emocao: "neutro" },
    depois: [
      { se: function (f) { return !!f.condenadoProporcional; }, tom: "bom",
        falas: [
          { quem: "defensor2", emocao: "firme", texto: "Condenação eu esperava, Excelência — é reincidente. Mas o senhor não jogou ele num regime fechado por chocolate. Isso é proporção. Aceito sem recorrer." }
        ] },
      { se: function (f) { return !!f.soltoContumaz; }, tom: "grave",
        falas: [
          { quem: "promotor2", emocao: "raiva", texto: "Sétima vez, Excelência, e absolvido 'por bagatela'? Amanhã ele está no mesmo mercado. A Turma Recursal vai reformar com a súmula na mão." }
        ] }
    ]
  },

  vidasTocadas: [
    { se: "condenadoProporcional", tom: "bom",
      texto: "Rui foi condenado — porque a contumácia importa — mas a pena olhou para a vida real: restritiva de direitos, não jaula por chocolate. Proporção é justiça também." },
    { se: "soltoContumaz", tom: "grave",
      texto: "A 'bagatela' aplicada à sétima reincidência virou aviso de que ali nada acontece. O comerciante da esquina aprendeu a lição errada sobre a Justiça." },
    { se: "regimeFechadoChocolate", tom: "grave",
      texto: "Rui foi para o regime fechado por R$ 41,70 recuperados. A cadeia que o recebeu não combate fome — multiplica reincidência." }
  ],

  inicio: "c1",
  cenas: {

    c1: {
      falas: [
        { quem: "narrador", texto: "09h40. O valor do furto é parecido com o do caso anterior — mas a folha de antecedentes de Rui tem seis páginas. O promotor a segura no ar." },
        { quem: "defensor2", emocao: "firme", texto: "Quarenta e um reais, Excelência, recuperados. Insignificância, como o senhor reconheceu agora há pouco. O valor é o mesmo." },
        { quem: "promotor2", emocao: "firme", texto: "O VALOR é o mesmo, a HISTÓRIA não. Seis condenações por furto, a última há quatro meses, e uma ação em curso. Insignificância não é licença para a contumácia, Excelência." }
      ],
      decisao: {
        prompt: "O valor é ínfimo, mas a folha é extensa. A insignificância se aplica aqui?",
        opcoes: [
          { rotulo: "Aplicar a insignificância como no caso anterior: 'o valor é idêntico; tratar diferente fere a isonomia'",
            fundamento: "STF, HC 84.412 (por analogia)",
            efeitos: { tec: -10, hum: -4, imp: -4, tempo: 6 },
            carimbo: "ABSOLVIDO",
            setFlags: { soltoContumaz: true, manchaGrave: true },
            reacoes: [
              { quem: "promotor2", emocao: "raiva", texto: "Sétimo furto e absolvição por bagatela?! A reincidência específica AFASTA o princípio, Excelência — STF e STJ, súmula 511. Apelação imediata." }
            ],
            feedback: { acerto: "grave", titulo: "Isonomia mal compreendida",
              texto: "Tratar igualmente os iguais — e DESIGUALMENTE os desiguais. Os dois casos têm valor parecido, mas situações distintas: lá, réu primário; aqui, reincidente específico e contumaz. O STF (HC 123.108) e o STJ afastam a insignificância nessa hipótese, porque o terceiro vetor — reduzido grau de reprovabilidade — não se sustenta diante da habitualidade. Aplicar a bagatela à sétima reincidência não é isonomia: é transformar o princípio em salvo-conduto para a contumácia." },
            proxima: "fim_grave_solto" },

          { rotulo: "Afastar a insignificância e condenar no rigor máximo: pena acima do mínimo e regime inicial FECHADO, 'para conter a reincidência'",
            fundamento: "CP, art. 155; reincidência",
            efeitos: { tec: -4, hum: -8, tempo: 7 },
            carimbo: "CONDENADO — FECHADO",
            setFlags: { regimeFechadoChocolate: true },
            reacoes: [
              { quem: "defensor2", emocao: "raiva", texto: "Regime FECHADO por chocolate recuperado, Excelência? Afastar a bagatela não autoriza a desproporção. Isso a Turma reforma na dosimetria." }
            ],
            feedback: { acerto: "ruim", titulo: "Certo no afastamento, errado na dose",
              texto: "Afastar a insignificância estava correto — mas a resposta penal precisa ser PROPORCIONAL. Furto simples de R$ 41,70 recuperado não comporta regime inicial fechado: a pena-base deve partir do mínimo, a reincidência opera como agravante (não como pretexto para rigor ilimitado), e cabe avaliar a substituição/regime mais brando (CP, arts. 33 e 44). Punir a contumácia é legítimo; jogá-lo no fechado por chocolate é a desproporção que o segundo grau corrige." },
            proxima: "fim_ruim" },

          { rotulo: "Afastar a insignificância (reincidência específica e habitualidade) e condenar com pena PROPORCIONAL: base no mínimo, regime aberto, substituída por restritiva de direitos",
            fundamento: "STF, HC 123.108; STJ, Súmula 511; CP, arts. 33, §2º, e 44",
            requerFoco: "f_limite",
            efeitos: { tec: 10, hum: 7, imp: 3, tempo: 9 },
            carimbo: "CONDENADO — RESTRITIVA",
            setFlags: { condenadoProporcional: true },
            reacoes: [
              { quem: "promotor2", emocao: "neutro", texto: "O Ministério Público concorda, Excelência: a reincidência impede a bagatela, mas a pena ficou no tamanho do fato. Sem recurso." },
              { quem: "defensor2", emocao: "firme", texto: "Justa, Excelência. Reincidente, sim — mas o senhor não fingiu que chocolate é assalto a banco." }
            ],
            feedback: { acerto: "otimo", titulo: "O limite da bagatela, com proporção",
              texto: "Decisão tecnicamente exata nos dois eixos. Primeiro: a insignificância NÃO se aplica — a reincidência específica e a habitualidade comprometem o vetor da reprovabilidade (STF, HC 123.108; STJ, Súmula 511). Segundo: afastar a bagatela não autoriza desproporção — pena-base no mínimo, reincidência como agravante, regime aberto e substituição por restritiva de direitos (CP, art. 44), porque furto recuperado de R$ 41,70 não comporta fechado. Pune-se a contumácia sem fingir que é grave o que não é." },
            proxima: "fim_otimo" }
        ]
      }
    },

    fim_otimo: {
      falas: [
        { quem: "narrador", texto: "Rui ouve a sentença sem surpresa — e sem revolta. Restritiva de direitos: prestação de serviços à comunidade. O defensor anui; o promotor guarda a folha de seis páginas." }
      ],
      fim: {
        titulo: "O LIMITE, COM PROPORÇÃO",
        selo: "otimo",
        texto: "Aqui a bagatela não se aplicava — e você soube por quê: reincidência específica e habitualidade afastam o princípio, na linha do STF e do STJ. Mas afastar a insignificância não é abrir caixa de rigor ilimitado: a pena coube no tamanho do fato, com substituição por restritiva de direitos. Punir a contumácia sem desumanizar o réu — é assim que o direito penal funciona quando funciona."
      }
    },

    fim_ruim: {
      falas: [
        { quem: "narrador", texto: "Rui é levado para iniciar o cumprimento em regime fechado. No corredor, o defensor já redige a apelação — só sobre a dosimetria." }
      ],
      fim: {
        titulo: "A DOSE ERRADA",
        selo: "ruim",
        texto: "O afastamento da insignificância estava correto: a reincidência o impunha. Mas a resposta foi desproporcional — regime fechado por R$ 41,70 recuperados. A Turma Recursal ajustará a dosimetria, e o sistema terá gasto uma vaga de presídio com quem cabia na prestação de serviços. Proporção também é técnica."
      }
    },

    fim_grave_solto: {
      falas: [
        { quem: "narrador", texto: "Rui deixa o Juizado absolvido pela sétima vez. No mercado da esquina, o gerente assiste à cena pela porta — e tira suas próprias conclusões sobre o que adianta acionar a polícia." }
      ],
      fim: {
        titulo: "BAGATELA VIROU SALVO-CONDUTO",
        selo: "grave",
        texto: "O valor era ínfimo, mas a insignificância tem limite — e a reincidência específica o ultrapassa, como dizem o STF e a Súmula 511 do STJ. Aplicada à contumácia, a bagatela deixa de proteger o réu pobre e passa a blindar a habitualidade: a apelação do MP vem com a jurisprudência inteira, e o recado errado já circulou pelo bairro."
      }
    }
  }
});
