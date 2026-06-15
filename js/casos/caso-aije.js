/* ============================================================
   CASO ELEITORAL: AIJE — "A prova clara e a prova nula"
   ------------------------------------------------------------
   Como JUIZ ELEITORAL da zona, o jogador julga uma Ação de
   Investigação Judicial Eleitoral (AIJE) por captação ilícita
   de sufrágio (compra de votos — Lei 9.504/97, art. 41-A). A
   prova é CLARÍSSIMA de que houve compra de votos: um cabo
   eleitoral gravou, em reunião FECHADA na casa do candidato,
   o réu oferecendo dinheiro por voto. Mas a prova é IGUALMENTE
   nula: gravação ambiental clandestina, sem autorização
   judicial, em ambiente privado — exatamente a hipótese de
   ILICITUDE do TEMA 979 do STF (RE 1.040.515, Rel. Min. Dias
   Toffoli). Não há nenhuma outra fonte independente.

   Gabarito: JULGAR IMPROCEDENTE a AIJE. A prova ilícita é
   inadmissível (CF, art. 5º, LVI), contamina o que dela deriva
   (frutos da árvore envenenada — CPP, art. 157, §1º, por
   analogia) e, sem fonte independente, não sobra prova. Condenar
   com a prova nula seria condenar para anular depois — e abrir a
   porta para que a delação clandestina vire regra na política.

   Consequência do acerto: a decisão é tecnicamente impecável,
   mas a turba não lê acórdão. Um veículo posta nas redes que "o
   juiz foi comprado"; forma-se protesto no Parque da Cidade. O
   juiz precisa escolher as medidas — sem usar a própria toga em
   causa própria (CPC, art. 144, I).

   Exceção do Tema 979 (local público sem controle de acesso):
   NÃO se aplica — a gravação foi numa reunião fechada, com
   expectativa de privacidade.
   ============================================================ */

window.TOGA = window.TOGA || {};
TOGA.casos = TOGA.casos || [];

TOGA.casos.push({
  id: "aije",
  titulo: "AIJE — A prova clara e a prova nula",
  subtitulo: "A compra de votos é evidente. A prova que a mostra é nula. E não há outra.",
  area: "Justiça Eleitoral — AIJE (captação ilícita de sufrágio)",
  hora: "14:00",
  duracaoPrevistaMin: 120,
  tensao: 10,

  personagens: [
    { id: "donato", nome: "Donato", papel: "Cabo eleitoral — autor da gravação", assento: "centro",
      avatar: { pele: "#a86a48", cabelo: "curto", corCabelo: "#241a10", traje: "camisa", corTraje: "#6a5a3a", barba: true } },
    { id: "heitor", nome: "Dr. Heitor", papel: "Promotor Eleitoral", assento: "esq1",
      avatar: { pele: "#d8a87f", cabelo: "curto", corCabelo: "#3a2a1a", traje: "terno", corTraje: "#33424f", corGravata: "#7a2e2e" } },
    { id: "aurelio", nome: "Dr. Aurélio", papel: "Advogado do autor (coligação adversária)", assento: "esq2",
      avatar: { pele: "#e8c39a", cabelo: "calvo", corCabelo: "#6a6258", traje: "terno", corTraje: "#2b2b30", corGravata: "#2a3d7c", oculos: true } },
    { id: "silvio", nome: "Sílvio Brandão", papel: "Autor — candidato derrotado", assento: "esq3",
      avatar: { pele: "#c98e66", cabelo: "curto", corCabelo: "#241a10", traje: "terno", corTraje: "#3f4f5a" } },
    { id: "beatriz", nome: "Dra. Beatriz", papel: "Advogada do réu", assento: "dir1",
      avatar: { pele: "#a86a48", cabelo: "coque", corCabelo: "#241a10", traje: "blazer", corTraje: "#4a3a52", corBlusa: "#efe5c8" } },
    { id: "genesio", nome: "Genésio Tavares", papel: "Réu — prefeito eleito", assento: "dir2",
      avatar: { pele: "#d8a87f", cabelo: "curto", corCabelo: "#9a9388", traje: "terno", corTraje: "#2b2b30", corGravata: "#5a5a5a" } },
    { id: "solange", nome: "Solange", papel: "Repórter — Portal Cidade Alerta", assento: "dir3",
      avatar: { pele: "#c98e66", cabelo: "longo", corCabelo: "#3a2a1a", traje: "blazer", corTraje: "#5a4a52" } }
  ],

  autos: {
    resumo: "Você é o JUIZ ELEITORAL da 31ª Zona. A coligação derrotada, por seu candidato SÍLVIO BRANDÃO, ajuizou AIJE contra GENÉSIO TAVARES, prefeito eleito, por captação ilícita de sufrágio (Lei 9.504/97, art. 41-A): compra de votos a R$ 200 cada, nas vésperas da eleição. A prova é UMA só — e é devastadora: um vídeo em que Genésio, em pessoa, conta as cédulas e diz “é duzentos por cabeça, e no domingo vocês me trazem a foto do voto”. O vídeo foi gravado por DONATO, cabo eleitoral presente à reunião, sem o conhecimento dos demais, dentro da casa de campo do candidato, a portas fechadas. Não há autorização judicial, não há outra testemunha, não há extrato bancário, não há nada além da gravação. A defesa argui a ilicitude da prova com base no Tema 979 do STF.",
    pecas: [
      { id: "inicial", titulo: "Petição inicial da AIJE",
        texto: "A coligação “Cidade para Todos” narra que GENÉSIO TAVARES, então candidato, em reunião realizada em 28/09, na sua casa de campo, distribuiu R$ 200,00 a eleitores em troca do voto, condicionando o pagamento ao envio de fotografia da cédula — captação ilícita de sufrágio (Lei 9.504/97, art. 41-A) e abuso do poder econômico. Requer a cassação do registro/diploma e a inelegibilidade. Como prova ÚNICA, junta a “mídia audiovisual” da reunião e seu print, e arrola como testemunha o autor da gravação, DONATO. Pede a exibição do vídeo em audiência, no telão." },
      { id: "midia", titulo: "A mídia — transcrição do vídeo",
        texto: "Filmagem de celular, ambiente interno, cerca de 14 pessoas sentadas. GENÉSIO aparece com um maço de notas: “Ó, é simples: é duzentos por cabeça. No domingo vocês fotografam o voto e me mandam no zap — sem foto, sem pagamento.” Há risos, alguém pergunta “e se a urna não deixar fotografar?”, e ele responde “então traz testemunha”. A imagem é nítida, o áudio é límpido, os rostos são reconhecíveis. Materialmente, a compra de votos está ali, inteira. A gravação foi feita por DONATO, presente à reunião, com o próprio celular, sem que ninguém soubesse." },
      { id: "local", titulo: "Certidão sobre o local e a captação",
        texto: "Certidão do oficial: a reunião ocorreu no interior da residência de campo de GENÉSIO, propriedade particular, com portão, muro e controle de quem entrava (lista na mão de um segurança). O acesso era restrito a convidados do candidato. Não havia transmissão pública, nem se tratava de comício ou ato aberto. DONATO confirma, em declaração, que “entrou na lista como cabo de confiança” e gravou “escondido, no bolso, porque achei errado o que tava vendo”. Não houve autorização judicial para a captação ambiental." },
      { id: "contestacao", titulo: "Contestação — arguição de ilicitude (Tema 979)",
        texto: "A defesa de GENÉSIO não nega o conteúdo do vídeo: argui que ele é PROVA ILÍCITA e imprestável. Invoca o TEMA 979 da repercussão geral (STF, RE 1.040.515, Rel. Min. Dias Toffoli): “No processo eleitoral, é ilícita a prova colhida por meio de gravação ambiental clandestina, sem autorização judicial e com violação à privacidade e à intimidade dos interlocutores, ainda que realizada por um dos participantes, sem o conhecimento dos demais.” Sustenta que a exceção da tese — registro de fato em local público desprovido de controle de acesso — NÃO incide: a reunião foi em ambiente privado, fechado e com controle de entrada. Requer o desentranhamento (CF, art. 5º, LVI; CPP, art. 157) e a improcedência." },
      { id: "mp", titulo: "Parecer do Ministério Público Eleitoral",
        texto: "O Promotor Eleitoral, Dr. Heitor, opina com honestidade incômoda: “O fato narrado é gravíssimo e o vídeo é convincente. Mas convicção não supre licitude. A gravação ambiental clandestina, sem ordem judicial e em ambiente privado com expectativa de intimidade, é exatamente a hipótese de ILICITUDE fixada no Tema 979. Examinados os autos, não há fonte independente: nenhum eleitor confirmou o pagamento, não há rastro financeiro, não há outra testemunha. Excluída a gravação, e o que dela deriva, a instrução fica vazia. O Parquet, ainda que indignado, não pode pedir condenação sobre prova nula.”" },
      { id: "independente", titulo: "Certidão de inexistência de outra prova",
        texto: "Resultado das diligências: (i) os eleitores citados, intimados, negaram ter recebido valores ou exerceram o direito ao silêncio; (ii) não há ocorrência bancária, saque atípico ou transferência rastreada; (iii) não há outra testemunha presencial além de Donato (o próprio autor da gravação); (iv) nenhuma prova foi produzida a partir de fonte autônoma, anterior ou independente da gravação. Em suma: retirado o vídeo, não resta NENHUM elemento de prova nos autos. Tudo o que existe nasceu da gravação ou a partir dela." }
    ]
  },

  focos: [
    { id: "f_tema979", rotulo: "O Tema 979 e a regra da ilicitude",
      dica: "STF, RE 1.040.515 (Rel. Min. Dias Toffoli), Tema 979: gravação ambiental clandestina, sem autorização judicial, em violação à intimidade, é ILÍCITA na seara eleitoral — ainda que feita por um dos interlocutores. A clareza do conteúdo não conserta a ilicitude da origem.",
      grifos: [{ peca: "contestacao", trecho: "ainda que realizada por um dos participantes" },
               { peca: "midia", trecho: "sem que ninguém soubesse" }] },
    { id: "f_excecao", rotulo: "A exceção — e por que não se aplica",
      dica: "A própria tese ressalva: é lícito o registro de fato em LOCAL PÚBLICO desprovido de controle de acesso, onde não há expectativa de privacidade. Aqui foi o oposto: casa particular, muro, portão, lista de convidados. A exceção não socorre o autor.",
      grifos: [{ peca: "local", trecho: "propriedade particular, com portão, muro e controle de quem entrava" },
               { peca: "local", trecho: "O acesso era restrito a convidados" }] },
    { id: "f_arvore", rotulo: "Frutos da árvore envenenada",
      dica: "CF, art. 5º, LVI: provas ilícitas são inadmissíveis. CPP, art. 157, §1º (por analogia no processo eleitoral): contaminam-se as provas DERIVADAS da ilícita, salvo fonte independente. Sem fonte autônoma, cai a gravação e cai tudo que dela nasceu.",
      grifos: [{ peca: "independente", trecho: "Tudo o que existe nasceu da gravação ou a partir dela" },
               { peca: "mp", trecho: "não há fonte independente" }] },
    { id: "f_consequencia", rotulo: "O que sobra sem a prova",
      dica: "Retirado o vídeo, a instrução fica vazia: nenhum eleitor confirma, nenhum extrato, nenhuma testemunha autônoma. Sem prova lícita, a AIJE é improcedente. Condenar com prova nula é condenar para o Tribunal anular — e fragilizar a própria luta contra a compra de votos.",
      grifos: [{ peca: "independente", trecho: "não resta NENHUM elemento de prova" },
               { peca: "mp", trecho: "não pode pedir condenação sobre prova nula" }] }
  ],

  /* ---------- arco emocional (depois do veredicto) ---------- */
  arco: {
    antes: { emocao: "firme", gesto: "neutro" },
    depois: [
      { se: function (f) { return f.aijeImprocedenteCorreta && f.medidasSerenas; }, tom: "bom", gesto: "neutro",
        falas: [
          { quem: "heitor", emocao: "firme", texto: "Excelência, registro em ata o meu respeito. O senhor decidiu contra a própria popularidade. Lá fora gritam que o senhor foi comprado; aqui dentro, quem leu os autos sabe que o senhor foi o único que não se vendeu — nem à prova fácil, nem à pressão da rua." },
          { quem: "beatriz", emocao: "neutro", texto: "Meu cliente não saiu inocente, doutor. Saiu não condenável com prova nula. O senhor sabe a diferença, e fez questão de escrevê-la. Por isso esta sentença vai sobreviver ao recurso — e ao barulho." }
        ] },
      { se: function (f) { return f.aijeImprocedenteCorreta && !f.medidasSerenas; }, tom: "neutro",
        falas: [
          { quem: "heitor", emocao: "triste", texto: "A decisão de mérito foi correta, Excelência. Mas o senhor desceu da toga para revidar — e agora a sua razão e a sua mágoa vão recorrer juntas. Era melhor que só a razão subisse." }
        ] },
      { se: function (f) { return f.aijeProcedenteIlicita; }, tom: "grave",
        falas: [
          { quem: "beatriz", emocao: "firme", texto: "Vossa Excelência condenou sobre prova que o próprio STF declarou ilícita. Eu apelo hoje, e o Tribunal anula amanhã — e o senhor terá dado ao réu o maior presente: virar vítima de injustiça. A compra de votos vai sair impune E com discurso de perseguição. Obrigada por isso." }
        ] }
    ]
  },

  vidasTocadas: [
    { se: "aijeImprocedenteCorreta", tom: "bom",
      texto: "A compra de votos não foi premiada — mas também não foi lavada por uma prova nula que abriria a porta para a gravação clandestina virar arma de campanha. A regra que protegeu Genésio hoje protege qualquer eleitor amanhã." },
    { se: "medidasSerenas", tom: "bom",
      texto: "O juiz não respondeu à acusação com a própria caneta: encaminhou aos órgãos competentes e deixou que outro juízo cuidasse da sua honra. A toga saiu mais pesada de respeito do que entrou." },
    { se: "aijeProcedenteIlicita", tom: "grave",
      texto: "A condenação sobre prova ilícita subiu ao Tribunal carregando a própria anulação. Genésio virou bandeira de “perseguição” — e a próxima compra de votos será mais difícil de provar, porque a primeira foi anulada por vício do juiz." },
    { se: "togaEmCausaPropria", tom: "grave",
      texto: "O juiz usou a jurisdição para defender o próprio nome. Tecnicamente impedido, deu ao veículo o troféu que ele queria: a manchete “o juiz que mandou prender quem o criticou”." }
  ],

  inicio: "e1",
  cenas: {

    /* ---------- e1: a exibição do vídeo no telão ---------- */
    e1: {
      falas: [
        { quem: "narrador", texto: "14h00. Sala de audiências da 31ª Zona Eleitoral. Do teto desce, motorizado, o painel de projeção. O Dr. Aurélio já posicionou o cabo do notebook; na primeira fila, Sílvio Brandão, o candidato derrotado, aguarda com a postura de quem veio buscar a vitória que a urna negou. Atrás, a repórter Solange filma tudo com o celular." },
        { quem: "aurelio", emocao: "firme", texto: "Excelência, requeiro a exibição da mídia agora, no telão, para que conste em ata e a sala inteira veja: não é boato, é o candidato CONTANDO o dinheiro. Duzentos reais por voto, com foto da cédula. Mais clara que isto, só confissão por escrito." },
        { quem: "beatriz", emocao: "firme", texto: "A defesa se opõe à exibição, Excelência — ou, ao menos, requer que o ato seja precedido do debate sobre a LICITUDE da gravação. Exibir prova nula como espetáculo é contaminar a audiência e a opinião pública antes do juízo de admissibilidade." }
      ],
      decisao: {
        prompt: "O autor quer projetar o vídeo já. Como você conduz a exibição?",
        opcoes: [
          { rotulo: "Exibir o vídeo desde logo e tratá-lo como prova válida — “a verdade real prevalece; isto é compra de votos escancarada”",
            fundamento: "Busca da verdade real, sem filtro de admissibilidade",
            efeitos: { tec: -10, imp: -6, estresse: 4, tempo: 6 },
            carimbo: "PROVA ACOLHIDA",
            evento: "video",
            setFlags: { prejulgouMidia: true },
            reacoes: [
              { quem: "beatriz", emocao: "raiva", texto: "Vossa Excelência acabou de antecipar o mérito e de validar prova cuja licitude nem foi enfrentada. Isso é nulidade, e está em ata." }
            ],
            feedback: { acerto: "ruim", titulo: "Verdade real não é atalho",
              texto: "Nenhuma busca da verdade autoriza ingressar prova ilícita (CF, art. 5º, LVI). Tratar o vídeo como válido ANTES de decidir a admissibilidade é prejulgar — e dar munição de nulidade à defesa. A verdade que entra pela porta errada não fica." },
            proxima: "e2" },
          { rotulo: "Permitir a exibição apenas para registro e contraditório, consignando que a ADMISSIBILIDADE será decidida em seguida, ouvidas as partes",
            fundamento: "Contraditório (CF, art. 5º, LV) sem prejulgar a admissibilidade",
            efeitos: { tec: 8, imp: 6, tempo: 8 },
            carimbo: "EXIBIÇÃO PARA CONTRADITÓRIO",
            evento: "video",
            setFlags: { conduziuContraditorio: true },
            reacoes: [
              { quem: "heitor", emocao: "firme", texto: "De acordo, Excelência. Que se veja e se ouça — e que a decisão sobre se PODE ser usada venha depois, fundamentada. É o caminho que sobrevive ao Tribunal." }
            ],
            feedback: { acerto: "otimo", titulo: "Ver não é admitir",
              texto: "Garantir o contraditório sobre a prova é dever; tratá-la como válida sem decidir é vício. Ao separar a exibição (para debate) do juízo de admissibilidade, o juiz protege o ato e não antecipa o mérito. A sequência correta blinda a decisão." },
            proxima: "e2" },
          { rotulo: "Indeferir liminarmente a exibição e mandar desentranhar a mídia, sem ouvir as partes — “prova ilícita não se projeta”",
            fundamento: "Inadmissibilidade da prova ilícita (CF, art. 5º, LVI)",
            efeitos: { tec: -4, imp: -2, hum: -2, tempo: 4 },
            carimbo: "DESENTRANHAMENTO SUMÁRIO",
            setFlags: { atropelouContraditorio: true },
            reacoes: [
              { quem: "aurelio", emocao: "raiva", texto: "Sem nem me ouvir, Excelência? A licitude é controvertida e o senhor decide de chofre? Cerceou o autor — e isso também sobe no recurso." }
            ],
            feedback: { acerto: "ruim", titulo: "O resultado certo pelo caminho errado",
              texto: "A conclusão (a prova é ilícita) até será a correta — mas decidir SEM contraditório, antes de ouvir as partes sobre a admissibilidade, cerceia o autor (CF, art. 5º, LV) e cria nulidade processual a favor de quem está com a razão. Acertar o destino não dispensa o rito." },
            proxima: "e2" }
        ]
      }
    },

    /* ---------- e2: a questão da licitude — Tema 979 ---------- */
    e2: {
      falas: [
        { quem: "narrador", texto: "O painel se apaga. O conteúdo é inegável — e por isso mesmo o ar da sala fica mais pesado. A questão deixou de ser “houve compra de votos?” e passou a ser “esta prova pode dizer que houve?”." },
        { quem: "beatriz", emocao: "firme", texto: "Excelência, a tese é vinculante: Tema 979, RE 1.040.515, Relator Ministro Dias Toffoli. Gravação ambiental clandestina, sem autorização judicial, violando a intimidade dos interlocutores, é ILÍCITA na seara eleitoral — AINDA QUE feita por um dos participantes. Foi exatamente o que ocorreu: Donato gravou escondido, sem ordem judicial, dentro de casa fechada." },
        { quem: "aurelio", emocao: "firme", texto: "Mas, Excelência, há a EXCEÇÃO da própria tese: fato em local público sem controle de acesso não viola privacidade. E o interesse público numa eleição é máximo! Aplique a exceção e salve a prova." }
      ],
      decisao: {
        prompt: "O cerne do caso: a gravação é lícita ou ilícita?",
        opcoes: [
          { rotulo: "Acolher a exceção do autor: o interesse público eleitoral afasta a privacidade — a prova é lícita",
            fundamento: "Exceção do Tema 979 (local público) + supremacia do interesse público",
            efeitos: { tec: -12, imp: -6, estresse: 5, tempo: 6 },
            carimbo: "EXCEÇÃO (INDEVIDA)",
            setFlags: { distorcuExcecao: true },
            reacoes: [
              { quem: "beatriz", emocao: "raiva", texto: "Local público?! Foi a SALA DE JANTAR do candidato, com muro, portão e segurança na lista! A exceção é para praça, para rua — não para casa fechada. O senhor está reescrevendo a tese do STF." }
            ],
            feedback: { acerto: "grave", titulo: "A exceção que engole a regra",
              texto: "A exceção do Tema 979 vale para LOCAL PÚBLICO desprovido de controle de acesso, onde não há expectativa de privacidade. Reunião em casa particular, com muro, portão e lista de convidados, é o oposto. Esticar a exceção para “interesse público” é revogar a regra na prática — e contrariar tese vinculante." },
            proxima: "e3" },
          { rotulo: "Reconhecer a ILICITUDE: ambiente privado, com controle de acesso e expectativa de intimidade, sem autorização judicial — incide a regra do Tema 979, não a exceção",
            fundamento: "STF, Tema 979 (RE 1.040.515, Rel. Min. Dias Toffoli); CF, art. 5º, X e LVI",
            efeitos: { tec: 12, imp: 8, tempo: 8 },
            carimbo: "PROVA ILÍCITA — TEMA 979",
            setFlags: { reconheceuIlicitude: true },
            reacoes: [
              { quem: "heitor", emocao: "firme", texto: "É a leitura correta, Excelência, por mais que doa. Casa fechada, lista na porta, gravação no bolso: privacidade plena, sem ordem judicial. A regra incide; a exceção, não." },
              { quem: "aurelio", emocao: "raiva", texto: "O senhor vai soltar um comprador de votos por causa de uma formalidade?! A cidade inteira viu o vídeo!" }
            ],
            feedback: { acerto: "otimo", titulo: "A regra do Tema 979, sem reescrita",
              texto: "Reunião em propriedade particular, com muro, portão e controle de acesso, é ambiente de intimidade protegida (CF, art. 5º, X). Gravação ambiental clandestina ali, sem autorização judicial, é ilícita (Tema 979) — e a exceção (local público sem controle) não incide. A ilicitude não é “formalidade”: é a garantia que impede que a vida privada de qualquer um vire prova de emboscada." },
            proxima: "e3" },
          { rotulo: "Adiar e converter em diligência para “buscar a verdade” — determinar quebra de sigilo e busca na casa do réu a partir do vídeo",
            fundamento: "Diligência para confirmar o conteúdo da gravação",
            efeitos: { tec: -10, imp: -4, estresse: 4, tempo: 14 },
            carimbo: "DILIGÊNCIA DERIVADA",
            setFlags: { contaminouDerivada: true },
            reacoes: [
              { quem: "beatriz", emocao: "firme", texto: "Toda diligência que o senhor tirar do vídeo nasce envenenada, Excelência — é fruto da árvore proibida (CPP, art. 157, §1º). O senhor não está confirmando a prova: está multiplicando a nulidade." }
            ],
            feedback: { acerto: "ruim", titulo: "Não se lava prova ilícita com mais prova dela",
              texto: "Quebra de sigilo e busca DERIVADAS da gravação ilícita são frutos da árvore envenenada (CPP, art. 157, §1º) — salvo fonte independente, que aqui não existe. “Buscar a verdade” a partir da prova nula não a conserta: estende o vício. A diligência correta seria a partir de fonte autônoma — e não há nenhuma." },
            proxima: "e3" }
        ]
      }
    },

    /* ---------- e3: a fonte independente (frutos da árvore envenenada) ---------- */
    e3: {
      falas: [
        { quem: "narrador", texto: "Donato, o cabo que gravou, é chamado a depor. Conta, com a voz embargada, que se enojou do que viu e gravou “para fazer o certo”. Mas, perguntado, admite: ninguém mais filmou, ninguém recebeu o dinheiro na frente de outra testemunha, e não há recibo, conta ou foto de cédula nos autos. Tudo o que se sabe, sabe-se pelo vídeo." },
        { quem: "heitor", emocao: "firme", texto: "Excelência, o Ministério Público foi atrás: eleitores intimados negaram ou silenciaram, não há rastro financeiro, não há outra testemunha presencial. Retirado o vídeo, e o que dele deriva, não sobra NADA. Não localizei fonte independente — e procurei." },
        { quem: "aurelio", emocao: "triste", texto: "Mas, Excelência, o crime é evidente! Tem que ter um jeito... a gravidade do fato não vale nada?" }
      ],
      decisao: {
        prompt: "Excluída a gravação, há prova autônoma que sustente a AIJE?",
        opcoes: [
          { rotulo: "Sustentar a ação na gravidade do fato: “a compra de votos é certa, e a certeza basta” — manter a prova pela relevância",
            fundamento: "Gravidade do fato como suprimento da licitude",
            efeitos: { tec: -10, imp: -6, estresse: 4, tempo: 5 },
            carimbo: "GRAVIDADE > LICITUDE",
            setFlags: { gravidadeAcimaDaLei: true },
            reacoes: [
              { quem: "beatriz", emocao: "firme", texto: "Certeza não é prova lícita, Excelência. Se a gravidade do fato bastasse, nenhuma garantia resistiria — bastaria o crime ser feio para a prova ilícita virar boa." }
            ],
            feedback: { acerto: "grave", titulo: "Quanto pior o crime, mais a garantia importa",
              texto: "A inadmissibilidade da prova ilícita (CF, art. 5º, LVI) não cede à gravidade — é JUSTAMENTE nos casos graves que a tentação de violar a regra é maior, e por isso a garantia existe. “Certeza moral” não é prova. Aceitar a gravação pela relevância é abolir o limite para todos." },
            proxima: "e4" },
          { rotulo: "Reconhecer a contaminação e a ausência de fonte independente: sem o vídeo e seus derivados, não há prova nos autos (frutos da árvore envenenada)",
            fundamento: "CPP, art. 157, §1º (por analogia); CF, art. 5º, LVI — ausência de fonte independente",
            efeitos: { tec: 12, imp: 8, tempo: 7 },
            carimbo: "SEM FONTE INDEPENDENTE",
            setFlags: { semFonteIndependente: true },
            reacoes: [
              { quem: "heitor", emocao: "neutro", texto: "É a constatação honesta dos autos, Excelência. Doeu no Ministério Público escrever, mas é a verdade processual: não há prova lícita que sobreviva à exclusão da gravação." }
            ],
            feedback: { acerto: "otimo", titulo: "Cortada a raiz, caem os frutos",
              texto: "Excluída a prova ilícita, contaminam-se as provas dela derivadas, salvo fonte independente (CPP, art. 157, §1º, por analogia). Aqui não há nenhuma: nem eleitor, nem extrato, nem testemunha autônoma. Sem prova lícita, não há lastro para a AIJE — e o juiz não inventa o que os autos não têm." },
            proxima: "e4" },
          { rotulo: "Inverter o ônus: como o fato é grave, caberia ao RÉU provar que NÃO comprou votos",
            fundamento: "Inversão do ônus da prova pela gravidade",
            efeitos: { tec: -12, imp: -6, tempo: 6 },
            carimbo: "ÔNUS INVERTIDO",
            setFlags: { inverteuOnus: true },
            reacoes: [
              { quem: "beatriz", emocao: "raiva", texto: "Provar que NÃO fiz? Prova de fato negativo, Excelência, sobre acusação que se sustenta em prova ilícita? O senhor está pedindo ao réu que desminta o que a lei sequer permite afirmar." }
            ],
            feedback: { acerto: "grave", titulo: "O ônus não muda de lado pela indignação",
              texto: "Na AIJE, o ônus de provar a captação ilícita é de quem acusa, com prova LÍCITA e robusta. Inverter o ônus por gravidade é exigir prova diabólica (de fato negativo) e punir o réu pela fragilidade da acusação. A presunção de inocência e as regras do ônus não se suspendem porque o caso é grave." },
            proxima: "e4" }
        ]
      }
    },

    /* ---------- e4: o julgamento ---------- */
    e4: {
      falas: [
        { quem: "narrador", texto: "Encerrada a instrução, os autos vêm conclusos para sentença. Você relê tudo. A compra de votos está provada no plano dos fatos — e impossível de afirmar no plano do Direito, porque a única prova é nula e nada dela se salva por fonte autônoma. Lá fora, já se ouve o burburinho de quem espera a cassação." },
        { quem: "voce", emocao: "firme", texto: "Há momentos em que decidir bem é decidir contra a própria vontade. Eu vi o vídeo. Eu sei o que ele mostra. E é exatamente por saber que não posso fingir que a prova é lícita só porque o resultado me agradaria." }
      ],
      decisao: {
        prompt: "Sentença na AIJE:",
        opcoes: [
          { rotulo: "Julgar PROCEDENTE: cassar o diploma de Genésio com base no vídeo — “a urna não pode premiar a compra de votos”",
            fundamento: "Condenação fundada na gravação (prova ilícita)",
            efeitos: { tec: -16, imp: -10, estresse: 8, tempo: 8 },
            carimbo: "PROCEDENTE (SOBRE PROVA NULA)",
            setFlags: { aijeProcedenteIlicita: true, manchaGrave: true },
            feedback: { acerto: "grave", titulo: "Condenar para anular",
              texto: "Condenação fundada exclusivamente em prova declarada ilícita pelo próprio STF (Tema 979) não sobrevive ao recurso: o Tribunal anula, e o réu — culpado de fato — vira vítima de injustiça processual, com discurso de perseguição. Pior: enfraquece o combate à compra de votos, porque a primeira grande condenação caiu por vício do juiz. O resultado “justo” pelo caminho ilícito é o maior presente à impunidade." },
            proxima: "fim_grave" },
          { rotulo: "Julgar IMPROCEDENTE: excluída a prova ilícita (Tema 979) e ausente fonte independente, não há prova lícita da captação — improcedência, com a verdade dos autos consignada",
            fundamento: "STF, Tema 979; CF, art. 5º, LVI; CPP, art. 157, §1º — ausência de prova lícita",
            efeitos: { tec: 16, imp: 12, hum: 4, estresse: 6, tempo: 10 },
            carimbo: "IMPROCEDENTE — TEMA 979",
            setFlags: { aijeImprocedenteCorreta: true, _protestoEleitoral: true },
            reacoes: [
              { quem: "heitor", emocao: "firme", texto: "Sentença correta e corajosa, Excelência. O Ministério Público, ainda que inconformado com o fato, não tem como sustentar condenação sobre prova nula. Subscrevo a fundamentação." },
              { quem: "solange", emocao: "raiva", texto: "Então o senhor SOLTA quem comprou voto?! A população vai saber disso AGORA. (e ela ergue o celular, já gravando para a transmissão)" }
            ],
            feedback: { acerto: "otimo", titulo: "A decisão que protege até quem a ataca",
              texto: "Excluída a gravação ilícita (Tema 979) e inexistente fonte independente (CPP, art. 157, §1º), não há prova lícita da captação — a AIJE é improcedente. A sentença consigna que os fatos são graves, mas que a garantia da prova lícita vale para todos: a mesma regra que hoje absolve Genésio impede amanhã que a gravação clandestina vire arma contra qualquer eleitor. Decisão impopular, tecnicamente impecável — e à prova de recurso." },
            proxima: "e5" },
          { rotulo: "Extinguir o processo sem resolução de mérito por “falta de provas”, sem enfrentar a ilicitude nem o Tema 979",
            fundamento: "Extinção por insuficiência probatória",
            efeitos: { tec: -8, imp: -2, tempo: 6 },
            carimbo: "EXTINÇÃO SEM MÉRITO",
            setFlags: { fugiuDoMerito: true },
            reacoes: [
              { quem: "beatriz", emocao: "neutro", texto: "Sem mérito, Excelência? O senhor deixou a nuvem pairando sobre o meu cliente sem absolvê-lo e sem enfrentar a tese. É decisão que não decide — e que convida ao recurso de todo mundo." }
            ],
            feedback: { acerto: "ruim", titulo: "A não-decisão também decide mal",
              texto: "A AIJE comporta juízo de mérito: havendo ou não prova lícita, o juiz deve dizê-lo e fundamentar (improcedência por ausência de prova lícita). Extinguir “sem mérito” foge do enfrentamento do Tema 979, deixa a reputação do réu em suspenso e não pacifica nada — gera recurso de ambos os lados. Decidir é dizer, com fundamento, o que os autos permitem afirmar." },
            proxima: "e5" }
        ]
      }
    },

    /* ---------- e5: a manchete e o protesto — medida quanto ao VEÍCULO ---------- */
    e5: {
      falas: [
        { quem: "narrador", texto: "Duas horas depois, o Portal Cidade Alerta publica nas redes: “JUIZ SOLTA COMPRADOR DE VOTOS. QUANTO VALEU, EXCELÊNCIA?” — com a sua foto e a chamada “a sentença que tem preço”. O post viraliza. Pelo seu gabinete, a assessora avisa: está se formando um protesto no Parque da Cidade, faixas com o seu nome e a palavra “COMPRADO”." },
        { quem: "solange", emocao: "firme", texto: "É a opinião do portal, Excelência. Liberdade de imprensa. Se o senhor não tem o que esconder, não vai se importar." },
        { quem: "narrador", texto: "A acusação é direta, pública e mente sobre a sua sentença — que aplicou um precedente do STF. A tentação de revidar da própria cadeira é enorme. Mas a cadeira é a da Justiça, não a sua." }
      ],
      decisao: {
        prompt: "Que medida você toma quanto ao veículo que o acusou de ser comprado?",
        opcoes: [
          { rotulo: "Determinar de ofício a remoção do post e busca e apreensão na redação, e intimar a repórter a se explicar sob pena de prisão por desacato",
            fundamento: "Resposta imediata à ofensa, da própria jurisdição",
            efeitos: { tec: -14, imp: -12, estresse: 6, tempo: 6 },
            carimbo: "RETALIAÇÃO DA TOGA",
            setFlags: { togaEmCausaPropria: true, manchaGrave: true },
            reacoes: [
              { quem: "beatriz", emocao: "firme", texto: "Excelência, o senhor é a VÍTIMA da ofensa — está impedido de atuar na própria causa (CPC, art. 144, I). Mandar prender quem o critica é exatamente a manchete que eles querem: “o juiz comprado que cala a imprensa”. O senhor está roteirizando o inimigo." }
            ],
            feedback: { acerto: "grave", titulo: "Censura e causa própria",
              texto: "O juiz ofendido é PARTE: não pode usar a jurisdição em causa própria (CPC, art. 144, I) nem transformar crítica em desacato para censurar (CF, art. 5º, IV e IX; liberdade de imprensa). A remoção e a busca de ofício, além de ilegais, entregam ao veículo o papel de mártir e confirmam a narrativa. A toga não serve para defender o nome de quem a veste." },
            proxima: "e6" },
          { rotulo: "Não responder e rebater pessoalmente nas redes sociais, publicando a sua versão e chamando o portal de mentiroso",
            fundamento: "Direito de o juiz se defender publicamente",
            efeitos: { tec: -8, imp: -8, estresse: 5, tempo: 4 },
            carimbo: "JUIZ NA ARENA",
            setFlags: { juizNaArena: true },
            reacoes: [
              { quem: "heitor", emocao: "triste", texto: "Excelência, no instante em que o senhor entra na briga de rede social, deixa de ser juiz e vira contendor. A sentença fala pela sua honra melhor do que qualquer post seu." }
            ],
            feedback: { acerto: "ruim", titulo: "Juiz não desce ao ringue",
              texto: "Responder pessoalmente, na mesma arena, rebaixa a função à do contendor e fragiliza a imparcialidade institucional (LOMAN; Código de Ética da Magistratura — independência e decoro). A defesa do juiz é a fundamentação pública da sentença e os canais próprios — não o revide nas redes, que alimenta o engajamento do ataque." },
            proxima: "e6" },
          { rotulo: "Não usar a toga em causa própria: manter a sentença e a fundamentação públicas; encaminhar notícia-crime (calúnia eleitoral) ao juízo COMPETENTE e pleitear direito de resposta pela via própria (Lei 13.188/2015), sem decidir nada sobre a sua honra",
            fundamento: "CPC, art. 144, I (impedimento em causa própria); Lei 13.188/2015; Cód. Eleitoral, arts. 324-326",
            efeitos: { tec: 12, imp: 12, hum: 4, tempo: 9 },
            carimbo: "CANAIS PRÓPRIOS, SEM RETALIAR",
            setFlags: { encaminhouVeiculoCorreto: true },
            reacoes: [
              { quem: "heitor", emocao: "firme", texto: "É o caminho do magistrado, Excelência: a sentença defende a tese; outro juízo cuida da sua honra. O senhor sai da causa e deixa a Justiça funcionar — inclusive contra quem o caluniou." }
            ],
            feedback: { acerto: "otimo", titulo: "A honra do juiz, por outro juízo",
              texto: "Sendo vítima, o juiz está impedido em causa própria (CPC, art. 144, I). O correto é não retaliar: manter a sentença e sua fundamentação públicas (que respondem pela lisura), buscar o direito de resposta pela via própria (Lei 13.188/2015) e oferecer notícia-crime por calúnia (Cód. Eleitoral, arts. 324-326) a JUÍZO COMPETENTE. Defende-se a função sem confundi-la com a pessoa — e sem dar ao agressor o troféu da censura." },
            proxima: "e6" }
        ]
      }
    },

    /* ---------- e6: a medida quanto ao CANDIDATO autor da AIJE ---------- */
    e6: {
      falas: [
        { quem: "narrador", texto: "Resta o autor. Sílvio Brandão, derrotado nas urnas e agora na sentença, concedeu entrevista na porta do fórum: “esse juiz foi comprado, é óbvio”, e convocou os apoiadores para o ato no Parque da Cidade. A AIJE que ele moveu se apoiava, do início ao fim, numa prova que o próprio STF declara ilícita." },
        { quem: "aurelio", emocao: "neutro", texto: "Excelência, o meu cliente exerceu o direito de ação. Pode ter perdido, pode ter falado demais no calor da derrota — mas ajuizar AIJE não é crime." }
      ],
      decisao: {
        prompt: "Que medida você toma quanto ao candidato autor da AIJE?",
        opcoes: [
          { rotulo: "Condenar Sílvio por litigância de má-fé e determinar a prisão dele por desacato e incitação, na própria sentença",
            fundamento: "Punição imediata do autor pela acusação e pelo ato",
            efeitos: { tec: -12, imp: -12, estresse: 6, tempo: 6 },
            carimbo: "MÃO PESADA NO AUTOR",
            setFlags: { puniuAutorComExcesso: true, manchaGrave: true },
            reacoes: [
              { quem: "beatriz", emocao: "neutro", texto: "Mais prisões, Excelência? O senhor é o ofendido outra vez — e de novo em causa própria. Ajuizar ação perdida não é má-fé automática (CF, art. 5º, XXXV). O senhor vai transformar dois adversários em duas vítimas." }
            ],
            feedback: { acerto: "grave", titulo: "Direito de ação não é desacato",
              texto: "Ajuizar AIJE, ainda que improcedente, é exercício regular do direito de ação (CF, art. 5º, XXXV) — não é, por si, litigância de má-fé (CPC, art. 80) nem crime. Decretar prisão por desacato/incitação em causa em que o juiz é o ofendido viola o impedimento (CPC, art. 144, I) e o uso proporcional da força. Excesso contra o autor confirma a narrativa de perseguição." },
            proxima: "fim_otimo" },
          { rotulo: "Reconhecer o direito de ação e nada fazer além disso — silêncio total, deixando a desinformação seguir",
            fundamento: "Autocontenção absoluta",
            efeitos: { tec: 2, imp: 2, hum: -2, tempo: 3 },
            carimbo: "SILÊNCIO",
            setFlags: { silencioTotal: true },
            reacoes: [
              { quem: "heitor", emocao: "triste", texto: "Direito de ação, sim, Excelência — mas a calúnia pública não é ação, é ataque. Ficar 100% calado deixa a mentira virar verdade pela repetição. Há um meio-termo entre retaliar e abandonar a própria honra." }
            ],
            feedback: { acerto: "ruim", titulo: "Conter-se não é desaparecer",
              texto: "Respeitar o direito de ação do autor é correto; mas o ataque pessoal (“o juiz foi comprado”) extrapola o exercício da ação e pode configurar crime contra a honra. Silêncio absoluto deixa a desinformação se consolidar. O equilíbrio é não retaliar da toga E acionar os canais próprios (notícia-crime a juízo competente, comunicação à Corregedoria/TRE) — defender a instituição sem perseguir o adversário." },
            proxima: "fim_bom" },
          { rotulo: "Separar a ação da ofensa: respeitar o direito de ação (sem má-fé presumida); quanto à acusação pessoal e à eventual captação, encaminhar os fatos ao MP Eleitoral e a juízo COMPETENTE, e comunicar a Corregedoria/TRE — sem julgar a própria causa",
            fundamento: "CF, art. 5º, XXXV; CPC, arts. 80 e 144, I; comunicação aos órgãos competentes",
            efeitos: { tec: 12, imp: 12, hum: 4, tempo: 9 },
            carimbo: "AÇÃO RESPEITADA, OFENSA AOS ÓRGÃOS",
            setFlags: { encaminhouAutorCorreto: true },
            reacoes: [
              { quem: "heitor", emocao: "firme", texto: "Esse é o fio da navalha bem caminhado, Excelência: nada de prender o adversário, nada de fingir que a calúnia não houve. A ação seguiu seu curso; a ofensa vai para quem é competente para apurá-la. A toga não revidou — e não se omitiu." }
            ],
            feedback: { acerto: "otimo", titulo: "Adversário não é réu do juiz",
              texto: "O direito de ação é garantido e não se pune perda com prisão (CF, art. 5º, XXXV; CPC, art. 80, exige dolo). A acusação pessoal de “juiz comprado”, porém, é apurável como crime contra a honra — por OUTRO juízo (impedimento em causa própria, CPC, art. 144, I) — e a conduta eleitoral, pelo MP Eleitoral. Comunicar Corregedoria/TRE preserva a transparência. Firmeza sem vingança: a marca do juiz que decide contra a multidão e não vira a multidão pelo avesso." },
            proxima: "fim_otimo" }
        ]
      }
    },

    /* ---------- DESFECHOS ---------- */
    fim_otimo: {
      falas: [
        { quem: "narrador", texto: "Você assina a sentença de improcedência — fundamentada no Tema 979, na inadmissibilidade da prova ilícita e na ausência de fonte independente — e a publica na íntegra, sem nota de rodapé defensiva, porque ela se defende sozinha. Os ofícios saem em seguida: notícia-crime ao juízo competente sobre a acusação de “juiz comprado”, ciência ao Ministério Público Eleitoral, comunicação à Corregedoria e ao TRE." },
        { quem: "voce", emocao: "firme", texto: "Que conste: este juízo não absolveu a compra de votos — reconheceu que a única prova dela é nula, e que nem a indignação autoriza condenar com prova que o Supremo proíbe. A mesma garantia que hoje impede a condenação de um candidato impede, amanhã, que graváveis emboscadas decidam eleições. Quem me acusa de preço que diga a OUTRO juiz; eu sigo neste, julgando pelos autos." },
        { quem: "narrador", texto: "No Parque da Cidade, o protesto acontece — faixas, gritos, o seu nome em letras grandes. Você não manda dispersar ninguém: manda apenas garantir a segurança do ato, porque protestar também é direito. A sentença, essa, segue de pé, esperando o Tribunal — onde costuma ganhar quem decidiu pelos autos." }
      ],
      fim: {
        titulo: "IMPOPULAR, IMPECÁVEL, DE PÉ",
        selo: "otimo",
        setFlags: { aijeImprocedenteCorreta: true, medidasSerenas: true, _protestoEleitoral: true },
        texto: "Você fez a coisa mais difícil da magistratura: decidir certo quando o certo é impopular. Aplicou o Tema 979 contra a própria conveniência, recusou a prova ilícita por mais clara que fosse o crime, e respondeu ao ataque pessoal sem usar a toga em causa própria — pelos canais que existem para isso. A rua grita hoje; o acórdão fala amanhã. E o juiz que não se vendeu nem à prova fácil nem à pressão da multidão é, exatamente, o que aquela faixa nega que ele seja."
      }
    },

    fim_bom: {
      falas: [
        { quem: "narrador", texto: "A sentença de improcedência sai correta e bem fundamentada — Tema 979, prova ilícita, ausência de fonte independente. Mas, quanto aos ataques, você opta por não fazer nada além de respeitar o direito de ação: nenhum ofício, nenhuma notícia-crime, nenhuma comunicação. A mentira segue solta na rede, e o protesto cresce sem contraponto institucional." },
        { quem: "narrador", texto: "No Parque da Cidade, a faixa “JUIZ COMPRADO” aparece em todos os jornais do dia seguinte. A sua decisão técnica era impecável; o silêncio total, porém, deixou a narrativa do veículo ocupar o vazio que você não preencheu pelos meios próprios." }
      ],
      fim: {
        titulo: "A DECISÃO CERTA, O SILÊNCIO CARO",
        selo: "bom",
        setFlags: { aijeImprocedenteCorreta: true, _protestoEleitoral: true },
        texto: "No mérito, impecável: você aplicou o Tema 979 e recusou a prova ilícita mesmo diante de um crime evidente. Mas defender a função não é só decidir bem — é também não deixar a calúnia institucional sem resposta pelos canais próprios (notícia-crime a juízo competente, direito de resposta, ciência à Corregedoria/TRE). O silêncio total não é neutralidade: é deixar o vazio para quem mente. A sentença sobrevive ao recurso; a sua imagem pública sangra um pouco mais do que precisava."
      }
    },

    fim_grave: {
      falas: [
        { quem: "narrador", texto: "Você cassa o diploma de Genésio com base no vídeo. A cidade comemora; a manchete da noite é de aplauso. Por algumas semanas, você é o juiz que “teve coragem”." },
        { quem: "beatriz", emocao: "firme", texto: "Apelo hoje, Excelência. E o senhor sabe o que vem: o Tribunal Regional, citando o próprio STF, anula a sentença por prova ilícita (Tema 979). Genésio volta ao cargo — agora como o homem que “a Justiça perseguiu”. O senhor não condenou a compra de votos: condenou a sua própria sentença à anulação, e deu ao réu o título de mártir." },
        { quem: "narrador", texto: "Meses depois, é exatamente o que ocorre. A cassação cai. Genésio retorna. E a próxima denúncia de compra de votos na comarca nascerá com uma sombra a mais: “lembra do juiz que cassou com prova ilícita e o caso virou pó?”." }
      ],
      fim: {
        titulo: "O APLAUSO DE HOJE, A ANULAÇÃO DE AMANHÃ",
        selo: "grave",
        setFlags: { aijeProcedenteIlicita: true, manchaGrave: true },
        texto: "O resultado parecia justo e a torcida era unânime — e foi por isso que enganou. Condenar com a única prova que o STF declara ilícita (Tema 979) é construir uma sentença sobre areia: o Tribunal anula, o culpado de fato vira vítima de Direito, e o combate à compra de votos sai mais fraco do que entrou. A garantia da prova lícita não existe para soltar criminoso; existe para que a condenação, quando vier, fique de pé. Você escolheu o aplauso. O processo escolheu a nulidade."
      }
    }
  }
});
