/* ============================================================
   CASO 4 — "A Guarda de Thor"
   Cível · pauta das 15:30
   ------------------------------------------------------------
   Temas: natureza jurídica do animal de estimação (bem
   semovente — CC, art. 82 — mas com tutela diferenciada),
   o precedente do STJ que admite regulamentar a convivência
   (REsp 1.713.167/SP), família multiespécie, e o limite entre
   prova e espetáculo dentro da sala de audiências.
   ============================================================ */

window.TOGA = window.TOGA || {};
TOGA.casos = TOGA.casos || [];

TOGA.casos.push({
  id: "thor",
  titulo: "A Guarda de Thor",
  subtitulo: "Fim da união estável. A nota fiscal está com ele; a carteira de vacinação, com ela. E Thor ama os dois.",
  area: "Cível",
  hora: "15:30",
  duracaoPrevistaMin: 60,
  tensao: 3,

  personagens: [
    { id: "camila", nome: "Camila", papel: "Autora", assento: "esq2",
      avatar: { pele: "#e8c49c", cabelo: "longo", corCabelo: "#241505", traje: "camisa", corTraje: "#7a5a8a" } },
    { id: "tales", nome: "Dr. Tales", papel: "Advogado", assento: "esq1",
      avatar: { pele: "#c98e66", cabelo: "curto", corCabelo: "#1d1209", traje: "terno", corTraje: "#2f3a4a", corGravata: "#c9a35c", oculos: true } },
    { id: "rodrigo", nome: "Rodrigo", papel: "Réu", assento: "dir2",
      avatar: { pele: "#d8a87f", cabelo: "curto", corCabelo: "#3a2a1a", traje: "camisa", corTraje: "#4a6a5a", barba: true } },
    { id: "bia", nome: "Dra. Bia", papel: "Advogada", assento: "dir1",
      avatar: { pele: "#e0b48c", cabelo: "coque", corCabelo: "#4a2a10", traje: "blazer", corTraje: "#6a3a3a", corBlusa: "#efe5c8" } }
  ],

  autos: {
    resumo: "Dissolvida a união estável de 6 anos, Rodrigo permaneceu no apartamento — e com Thor, border collie de 4 anos. Camila pede a posse do animal e, subsidiariamente, regime de convivência. Rodrigo invoca a nota fiscal: bem semovente, comprado por ele. Conciliação e instrução designadas para hoje.",
    pecas: [
      { id: "inicial", titulo: "Petição inicial (Camila)",
        texto: "CAMILA narra: Thor foi adquirido na constância da união e sempre esteve sob seus cuidados diretos — veterinário, vacinas, adestramento, creche pet. Com o fim do relacionamento, o réu reteve o animal no antigo lar comum e passou a condicionar encontros “à sua agenda”. Pede: (a) a posse de Thor; (b) subsidiariamente, regime de convivência, invocando o REsp 1.713.167/SP do STJ." },
      { id: "contestacao", titulo: "Contestação (Rodrigo)",
        texto: "RODRIGO sustenta: Thor é BEM SEMOVENTE (CC, art. 82), adquirido por ele, conforme NOTA FISCAL do canil em seu exclusivo nome, antes mesmo da formalização da união. Animal não é filho: não há “guarda”, há propriedade e partilha. Acrescenta que a autora viaja com frequência a trabalho, inclusive 15 dias a Lisboa em janeiro. Pede a improcedência." },
      { id: "cuidados", titulo: "Comprovantes de cuidados",
        texto: "Carteira de vacinação integralmente assinada por CAMILA como responsável (12 registros em 4 anos). Faturas: 70% das despesas veterinárias no cartão dela. Matrícula e mensalidades da “creche pet” em seu nome. Declaração da veterinária: “a tutora de referência do paciente Thor sempre foi a Sra. Camila”." },
      { id: "rotina", titulo: "Conversas e rotina",
        texto: "Prints do casal (período da convivência): RODRIGO viaja a trabalho de 8 a 10 dias por mês (“semana que vem tô fora de novo, cuida do menino peludo”). Fotos: Thor na cama de ambos; Thor correndo com Rodrigo no parque às 6h; Thor deitado sobre os pés de Camila no home office." },
      { id: "resp", titulo: "Jurisprudência juntada",
        texto: "REsp 1.713.167/SP (STJ, 4ª Turma): dissolvida a sociedade conjugal/união estável, é possível ao Judiciário REGULAMENTAR A CONVIVÊNCIA com o animal de estimação, reconhecendo sua condição diferenciada — ser senciente, objeto de afeição — sem equipará-lo, contudo, à pessoa humana. Doutrina anexa sobre “família multiespécie”." }
    ]
  },

  focos: [
    { id: "f_nf", rotulo: "A nota fiscal", dica: "Propriedade formal é o começo da conversa — verifique a DATA da compra e o que ela realmente prova." },
    { id: "f_cuidados", rotulo: "Histórico de cuidados", dica: "Quem leva ao veterinário às 7h da manhã? O cuidador de fato costuma decidir o caso." },
    { id: "f_resp", rotulo: "REsp 1.713.167/STJ", dica: "O precedente que muda o enquadramento: nem coisa, nem filho — convivência regulamentável." },
    { id: "f_rotina", rotulo: "As rotinas de cada um", dica: "Viagens de 8-10 dias por mês de um lado, home office do outro: o bem-estar de Thor mora nos detalhes." }
  ],

  arco: {
    antes: { emocao: "triste" },
    depois: [
      { se: function (f) { return !!f.thorFeliz; }, tom: "bom",
        falas: [
          { quem: "camila", emocao: "feliz", texto: "Doutor, o Thor estreou o calendário hoje: buscou a guia sozinho na hora da troca. Cachorro entende de convivência mais que muita gente." },
          { quem: "rodrigo", emocao: "feliz", texto: "E ninguém 'perdeu' o cachorro, Excelência. A gente só parou de disputar quem ama mais — empatou." }
        ] },
      { se: function (f) { return !!f.circo; }, tom: "grave",
        falas: [
          { quem: "camila", emocao: "vergonha", texto: "O vídeo do 'teste do apego' já está em três grupos da cidade, doutor. O Thor correndo atrás do biscoito do oficial... a audiência virou piada — e a gente junto." }
        ] }
    ]
  },

  vidasTocadas: [
    { se: "thorFeliz", tom: "bom",
      texto: "Thor ganhou duas casas e uma foto no parque com as duas guias — 'primeira semana do acordo, funcionando'." },
    { se: "circo", tom: "grave",
      texto: "O 'teste do apego' virou vídeo nos grupos da cidade. Thor virou meme; o juízo, junto." }
  ],

  inicio: "t1",
  cenas: {

    t1: {
      falas: [
        { quem: "narrador", texto: "15h30. Último caso da pauta. Sobre a mesa da defesa, uma pasta com a nota fiscal em destaque, como um troféu." },
        { quem: "bia", emocao: "firme", texto: "Excelência, vou poupar o tempo do juízo: isto é partilha de bem SEMOVENTE. Nota fiscal em nome do meu cliente. Código Civil, artigo 82. Simples assim." },
        { quem: "tales", emocao: "neutro", texto: "Simples era antes do Superior Tribunal de Justiça, doutora." }
      ],
      decisao: {
        prompt: "A defesa quer reduzir o caso à nota fiscal. Como você fixa as premissas da audiência?",
        opcoes: [
          { rotulo: "Acolher a tese da defesa: “é um bem; quem comprou, leva — resolvo isso em dez minutos”",
            fundamento: "CC, art. 82; segurança jurídica da propriedade",
            efeitos: { tec: -8, hum: -10, tempo: 3 },
            carimbo: "BEM SEMOVENTE",
            setFlags: { friezaThor: true },
            reacoes: [
              { quem: "camila", emocao: "choro", texto: "Dez minutos? Seis anos da minha vida e do meu cachorro em dez minutos?" },
              { quem: "tales", emocao: "firme", texto: "Excelência, há precedente expresso do STJ juntado aos autos. Requeiro que conste da ata que o juízo o desconsiderou de plano." }
            ],
            feedback: { acerto: "grave", titulo: "Ignorar precedente juntado tem preço",
              texto: "Não se trata de gosto: há jurisprudência qualificada do STJ, expressamente invocada e juntada, admitindo a regulamentação da convivência (REsp 1.713.167/SP). O juízo pode até afastá-la — mas com fundamentação específica (CPC, art. 489, §1º, VI), jamais com “simples assim”. A decisão nasce com fragilidade recursal e com uma frieza que a sala inteira sentiu." },
            proxima: "t2" },

          { rotulo: "Enquadrar com o precedente: animal não é coisa como as demais — sem equiparar a filho, admite-se disciplinar a convivência",
            fundamento: "REsp 1.713.167/SP (STJ): ser senciente, objeto de afeição; convivência regulamentável após a dissolução",
            requerFoco: "f_resp",
            efeitos: { tec: 10, tempo: 6 },
            carimbo: "PREMISSAS FIXADAS",
            setFlags: { enquadrou: true },
            reacoes: [
              { quem: "bia", emocao: "surpresa", texto: "Vossa Excelência pretende aplicar o precedente... aqui?" },
              { quem: "tales", emocao: "feliz", texto: "É exatamente a tese da inicial, Excelência." },
              { quem: "camila", emocao: "neutro", texto: "Então o Thor não é... um móvel?" }
            ],
            feedback: { acerto: "otimo", titulo: "Nem coisa, nem filho: tertium genus na prática",
              texto: "O REsp 1.713.167/SP enfrentou exatamente este dilema: o animal de estimação é formalmente bem semovente (CC, art. 82), mas sua condição de ser senciente e de objeto de afeto autoriza o Judiciário a REGULAMENTAR A CONVIVÊNCIA após a ruptura — sem antropomorfizá-lo nem aplicar, por automatismo, o regime da guarda de filhos. Fixar essa premissa no início organiza toda a instrução: a pergunta deixa de ser “de quem é a nota?” e passa a ser “como se organiza a vida de Thor?”." },
            proxima: "t2" },

          { rotulo: "Não fixar premissas ainda: ouvir as partes primeiro e enquadrar ao final",
            fundamento: "Prudência instrutória",
            efeitos: { tec: 4, hum: 4, tempo: 4 },
            carimbo: "INSTRUÇÃO ABERTA",
            feedback: { acerto: "bom", titulo: "Prudente — mas a mesa fica sem mapa",
              texto: "Ouvir antes de enquadrar é postura legítima. O custo: sem a premissa do precedente fixada, a defesa seguirá batendo na tecla da nota fiscal e a autora, na do afeto — duas audiências paralelas. Quem estudou o REsp ganharia tempo enquadrando já." },
            proxima: "t2" }
        ]
      }
    },

    t2: {
      falas: [
        { quem: "camila", emocao: "choro", texto: "Doutor, o Thor dorme do meu lado da cama desde filhote... quer dizer, dormia. Ele é a minha família. Eu não tive filhos — eu tive o Thor." },
        { quem: "rodrigo", emocao: "triste", texto: "Ele também é a minha, Camila. Quem corre com ele todo dia às seis da manhã sou eu. Quem ficou na casa que ele conhece sou eu." }
      ],
      decisao: {
        prompt: "A emoção tomou a sala. Sua resposta da bancada:",
        opcoes: [
          { rotulo: "Cortar: “choro não é prova. Vamos aos fatos ou encerro a instrução”",
            fundamento: "Objetividade processual",
            efeitos: { hum: -10, tempo: 2 },
            carimbo: "EMOÇÃO INDEFERIDA",
            reacoes: [
              { quem: "tales", emocao: "firme", texto: "Que se consigne o tratamento dispensado à autora, Excelência." },
              { quem: "camila", emocao: "vergonha", texto: "..." }
            ],
            feedback: { acerto: "ruim", titulo: "Tecnicamente vazio, humanamente caro",
              texto: "“Choro não é prova” é verdade banal — e irrelevante: ninguém ofereceu o choro como prova. Cortar a emoção a frio não acelera nada (a parte constrangida trava, e travada não concilia) e ainda rende consignação em ata. Firmeza não precisava custar a temperatura da sala." },
            proxima: "t3" },

          { rotulo: "Consolar prometendo: “fique tranquila que o Thor não sai de perto da senhora”",
            fundamento: "Acalmar a parte fragilizada",
            efeitos: { imp: -12, tec: -4, tempo: 3 },
            carimbo: "PROMESSA INDEVIDA",
            reacoes: [
              { quem: "bia", emocao: "raiva", texto: "Vossa Excelência acabou de ANTECIPAR o julgamento antes da instrução. Requeiro consignação em ata, para todos os fins, inclusive de suspeição." },
              { quem: "rodrigo", emocao: "raiva", texto: "Então já tá decidido? Pra que eu vim?" }
            ],
            feedback: { acerto: "grave", titulo: "Empatia não é antecipação de mérito",
              texto: "Há um oceano entre acolher (“seu vínculo importa e será considerado”) e prometer resultado (“ele fica com a senhora”). A segunda frase, dita da bancada antes da instrução, é prejulgamento — combustível direto para arguição de impedimento/suspeição (CPC, arts. 144-145) e para a sensação, do outro lado, de que a audiência virou teatro." },
            proxima: "t3" },

          { rotulo: "Acolher e devolver objetividade: “este juízo leva esse vínculo a sério — e é exatamente por isso que vamos organizá-lo com critério, não com disputa”",
            fundamento: "Escuta ativa sem perda da direção do ato (CPC, art. 139)",
            efeitos: { hum: 8, imp: 2, tempo: 4 },
            carimbo: "AUDIÊNCIA HUMANIZADA",
            reacoes: [
              { quem: "camila", emocao: "neutro", texto: "Obrigada, doutor. Eu consigo falar com calma agora." },
              { quem: "rodrigo", emocao: "neutro", texto: "Eu também, Excelência." }
            ],
            feedback: { acerto: "otimo", titulo: "Validar o afeto, manter o leme",
              texto: "A frase faz dois movimentos ao mesmo tempo: reconhece a legitimidade do vínculo (ninguém ali está “fazendo drama por um cachorro”) e reconduz a audiência ao trilho dos critérios objetivos. É a direção formal e material do processo (CPC, art. 139) exercida com humanidade — e partes que se sentem ouvidas negociam melhor daqui a pouco." },
            proxima: "t3" }
        ]
      }
    },

    t3: {
      falas: [
        { quem: "bia", emocao: "firme", texto: "À autora: a senhora confirma que passou QUINZE dias em Lisboa em janeiro, deixando o animal — segundo suas próprias palavras — “aos cuidados de uma amiga”? Quem ama, abandona, dona Camila?" },
        { quem: "tales", emocao: "raiva", texto: "Objeção, Excelência! Pergunta capciosa e argumentativa — a doutora está testemunhando, não perguntando." }
      ],
      decisao: {
        prompt: "Objeção na mesa. Sua decisão sobre a pergunta:",
        opcoes: [
          { rotulo: "Indeferir a pergunta por inteiro: viagens da autora não interessam ao caso",
            fundamento: "Impertinência temática",
            efeitos: { tec: -3, tempo: 2 },
            carimbo: "INDEFERIDA",
            feedback: { acerto: "ruim", titulo: "Jogou fora o fato com a capciosidade",
              texto: "O vício estava na FORMA, não no tema: as rotinas e ausências de cada parte são justamente o material com que se desenha um regime de convivência viável (quem fica com Thor nos 8-10 dias mensais de viagem de Rodrigo, aliás?). Indeferir tudo empobreceu a instrução que você mesmo precisará daqui a pouco." },
            proxima: "t4" },

          { rotulo: "Mandar reformular para FATOS objetivos: datas, frequência das viagens e arranjos de cuidado em cada ausência",
            fundamento: "CPC, art. 459 — indeferem-se as perguntas que puderem induzir a resposta; o núcleo fático é pertinente",
            efeitos: { tec: 6, imp: 2, tempo: 4 },
            carimbo: "REFORMULE",
            reacoes: [
              { quem: "bia", emocao: "neutro", texto: "Reformulo. Com que frequência a senhora viaja e quem cuida de Thor nessas ocasiões?" },
              { quem: "camila", emocao: "firme", texto: "Viajo a trabalho duas vezes por ano, no máximo. E quem cuidava era eu MESMA por vídeo, três vezes ao dia, com a minha irmã na casa — está nos prints." }
            ],
            feedback: { acerto: "otimo", titulo: "Separar o veneno do alimento",
              texto: "A pergunta misturava um fato relevantíssimo (as rotinas de viagem de cada parte — central para definir convivência) com uma conclusão capciosa embutida (“quem ama, abandona”). O art. 459 do CPC dá o bisturi: corta-se a indução, preserva-se o fato. Repare que a resposta reformulada produziu prova ÚTIL — e favorável à própria autora." },
            proxima: "t4" },

          { rotulo: "Deferir a pergunta como formulada: a defesa tem estilo, não vício",
            fundamento: "Combatividade é inerente à advocacia",
            efeitos: { imp: -5, tempo: 3 },
            carimbo: "DEFERIDA",
            reacoes: [
              { quem: "camila", emocao: "choro", texto: "Eu não abandonei ninguém! Como ele deixa ela falar isso?" }
            ],
            feedback: { acerto: "ruim", titulo: "Estilo termina onde a indução começa",
              texto: "“Quem ama, abandona?” não busca informação: planta conclusão. É exatamente a pergunta que o art. 459 do CPC manda indeferir por induzir a resposta — além de argumentativa. Deferi-la transforma inquirição em sustentação oral disfarçada." },
            proxima: "t4" }
        ]
      }
    },

    t4: {
      falas: [
        { quem: "narrador", texto: "Um auxiliar entreabre a porta e cochicha com a Dra. Bia. Do corredor, inconfundível: um latido baixo e um rabo batendo na parede. A defesa trouxe Thor." },
        { quem: "bia", emocao: "firme", texto: "Excelência, requeiro uma DEMONSTRAÇÃO: que o animal seja solto a igual distância das partes. Para onde ele correr, lá está a verdade afetiva. É prova viva." },
        { quem: "tales", emocao: "raiva", texto: "Isto é um tribunal, não um programa de auditório!" }
      ],
      decisao: {
        prompt: "O “teste do apego”. Sua decisão:",
        opcoes: [
          { rotulo: "Deferir a demonstração: “solte o animal — a sala observará em silêncio”",
            fundamento: "Liberdade probatória e imediação",
            efeitos: { tec: -10, imp: -6, tempo: 8 },
            carimbo: "DEMONSTRAÇÃO DEFERIDA",
            setFlags: { circo: true },
            reacoes: [
              { quem: "narrador", texto: "Thor entra, fareja o ar solenemente... e dispara — direto para o oficial de justiça, que guardava metade de um biscoito no bolso do colete. Gargalhada geral. O oficial ergue as mãos, constrangido." },
              { quem: "bia", emocao: "vergonha", texto: "O animal está... emocionalmente confuso, Excelência." },
              { quem: "tales", emocao: "feliz", texto: "Requeiro que conste da ata que a “verdade afetiva” pesa vinte gramas e tem sabor de bacon." }
            ],
            feedback: { acerto: "grave", titulo: "A prova que provou apenas o biscoito",
              texto: "Era previsível: sem método, o “teste” mede fome, curiosidade e cheiros — não vínculo. O ato rebaixou a solenidade da audiência, estressou o animal e ainda gerou uma cena que nenhuma das partes esquecerá (nem o oficial de justiça). Prova atípica é admissível quando idônea; espetáculo, nunca." },
            proxima: "t5" },

          { rotulo: "Indeferir o teste, mas AUTORIZAR a presença de Thor, quieto, junto ao oficial — para baixar a temperatura da sala",
            fundamento: "Gestão emocional do ato sem transformá-lo em prova",
            efeitos: { hum: 6, tempo: 5 },
            carimbo: "PRESENÇA AUTORIZADA",
            reacoes: [
              { quem: "narrador", texto: "Thor deita entre as duas mesas, equidistante por conta própria, e suspira como quem já viu muitos processos. A sala inteira amolece um grau." },
              { quem: "camila", emocao: "feliz", texto: "..." },
              { quem: "rodrigo", emocao: "feliz", texto: "..." }
            ],
            feedback: { acerto: "bom", titulo: "Solução criativa e defensável",
              texto: "Negar o teatro e admitir a presença é um meio-termo legítimo: nenhum valor probatório foi atribuído à cena, e o efeito sobre o clima da conciliação é real. Cuidado apenas com o precedente prático — nem toda audiência comporta um border collie, por mais diplomático que ele seja." },
            proxima: "t5" },

          { rotulo: "Indeferir o teste, com elegância e fundamento: decisão judicial não se apoia em encenação sem método — os critérios serão objetivos",
            fundamento: "Prova sem metodologia não é prova (CPC, arts. 369 e 464, §1º); bem-estar do animal; cuidador de referência, rotinas e despesas decidem",
            efeitos: { tec: 10, hum: 4, tempo: 4 },
            carimbo: "DEMONSTRAÇÃO INDEFERIDA",
            reacoes: [
              { quem: "bia", emocao: "vergonha", texto: "Era... uma tentativa, Excelência." },
              { quem: "rodrigo", emocao: "neutro", texto: "Eu falei pra senhora que isso não ia colar, doutora." }
            ],
            feedback: { acerto: "otimo", titulo: "O tribunal não é palco",
              texto: "Um cão solto numa sala estranha corre para estímulos — cheiros, sons, comida — não para “a verdade afetiva”. A “demonstração” não tem controle, método nem valor epistêmico (a prova atípica do art. 369 do CPC ainda precisa ser idônea), e submete o animal a estresse para produzir teatro. Os critérios que decidem são verificáveis: cuidador de referência, histórico de despesas, rotinas compatíveis, ambiente. Indeferir protegeu o processo E o Thor." },
            proxima: "t5" }
        ]
      }
    },

    t5: {
      falas: [
        { quem: "narrador", texto: "Hora da ponte. As duas mesas estão cansadas de brigar por quem ama mais." },
        { quem: "rodrigo", emocao: "triste", texto: "Eu não quero tirar o Thor dela, Excelência. Eu só não quero virar visita na vida do meu cachorro." },
        { quem: "camila", emocao: "triste", texto: "E eu não aguento mais marcar “horário” pra ver quem dormia nos meus pés." }
      ],
      decisao: {
        prompt: "A janela do acordo abriu. O que você constrói?",
        opcoes: [
          { rotulo: "Acordo simples: alternância semanal seca, despesas meio a meio, ponto final",
            fundamento: "Simetria perfeita encerra a disputa",
            efeitos: { tec: 4, hum: 4, tempo: 8 },
            carimbo: "ACORDO HOMOLOGADO",
            setFlags: { acordoSimples: true },
            reacoes: [
              { quem: "rodrigo", emocao: "neutro", texto: "E nas semanas que eu viajar 10 dias...?" },
              { quem: "camila", emocao: "neutro", texto: "A gente... dá um jeito por mensagem, eu acho." }
            ],
            feedback: { acerto: "bom", titulo: "Funciona — até a primeira viagem",
              texto: "Alternância simétrica é solução honesta e homologável. Mas ignora o dado mais duro dos autos: Rodrigo passa 8-10 dias por mês fora. Sem cláusula para as ausências, o “a gente dá um jeito” vira a primeira controvérsia em três semanas. Acordo que não conversa com a rotina real nasce com data de retorno ao fórum." },
            proxima: function (f) { return "fim_bom"; } },

          { rotulo: "Acordo completo ancorado no HISTÓRICO DE CUIDADOS: lar de referência com Camila (cuidadora de fato), fins de semana alternados e duas noites semanais com Rodrigo, Thor com Camila nas viagens dele, despesas 50/50 com veterinária única, aviso prévio de mudança e cláusula de bem-estar",
            fundamento: "Cuidador de referência comprovado (vacinas, 70% das despesas, declaração da veterinária) + rotinas reais de ambos",
            requerFoco: "f_cuidados",
            efeitos: { tec: 10, hum: 10, tempo: 12 },
            carimbo: "ACORDO HOMOLOGADO",
            setFlags: { thorFeliz: true },
            reacoes: [
              { quem: "rodrigo", emocao: "feliz", texto: "Duas noites E os fins de semana alternados? Eu assino. E nas minhas viagens ele fica com ela — melhor pra ele." },
              { quem: "camila", emocao: "feliz", texto: "Veterinária única é a Dra. Sônia, ele já conhece... Fechado, doutor. Fechado." },
              { quem: "narrador", texto: "Lá fora, como se intuísse, um latido curto e satisfeito." }
            ],
            feedback: { acerto: "otimo", titulo: "O acordo que os autos já tinham escrito",
              texto: "Quem estudou os comprovantes sabia onde o acordo moraria: a carteira de vacinação, as faturas e a declaração da veterinária apontam a cuidadora de referência; os prints apontam as viagens mensais de Rodrigo (resolvidas com Thor ficando com Camila — virtude feita da necessidade). O regime espelha o REsp 1.713.167: convivência regulamentada em função do bem-estar do animal, sem ficções. A cláusula de bem-estar e a veterinária única evitam os litígios-satélite clássicos." },
            proxima: function (f) { return "fim_otimo"; } },

          { rotulo: "Sem acordo: encerrar a conciliação e SENTENCIAR",
            fundamento: "A instrução está madura; decide-se",
            efeitos: { tempo: 4 },
            carimbo: "CONCLUSO PARA SENTENÇA",
            feedback: { acerto: "bom", titulo: "Decidir também é função",
              texto: "Nem todo caso fecha em acordo — e a instrução de hoje produziu material suficiente para sentença segura. Que ela seja, então, tão boa quanto o acordo teria sido." },
            proxima: "t6" }
        ]
      }
    },

    t6: {
      falas: [
        { quem: "narrador", texto: "Sentença em audiência. As partes se ajeitam nas cadeiras. Até o corredor parece ter silenciado o latido." }
      ],
      decisao: {
        prompt: "O dispositivo da sua sentença sobre Thor:",
        opcoes: [
          { rotulo: "Impor, de ofício, “guarda compartilhada” com alternância semanal obrigatória, sem consenso",
            fundamento: "Analogia plena com o regime da guarda de filhos (CC, art. 1.584)",
            efeitos: { tec: -5, hum: 2, tempo: 6 },
            carimbo: "ALTERNÂNCIA IMPOSTA",
            reacoes: [
              { quem: "bia", emocao: "firme", texto: "Excelência, alternância FORÇADA entre ex-companheiros que mal se falam? Quem vai operacionalizar isso — o Thor?" }
            ],
            feedback: { acerto: "ruim", titulo: "O precedente não vai tão longe",
              texto: "O REsp 1.713.167 fala em REGULAMENTAR CONVIVÊNCIA — não em transplantar, de ofício, o instituto da guarda compartilhada dos filhos (CC, art. 1.584) para animais, contra a vontade de ambas as partes. Alternância semanal imposta entre adultos em conflito, sem nenhuma estrutura consensual, é sentença bonita no papel e inexequível na calçada: o primeiro domingo de atraso vira cumprimento de sentença." },
            proxima: function (f) { return "fim_ruim"; } },

          { rotulo: "Julgar pela nota fiscal: Thor é de Rodrigo; sem direito de visitas — “propriedade não se compartilha por afeto”",
            fundamento: "CC, arts. 82 e 1.228 — propriedade plena do adquirente",
            efeitos: { tec: -6, hum: -10, tempo: 5 },
            carimbo: "IMPROCEDENTE",
            setFlags: { friezaThor: true },
            reacoes: [
              { quem: "camila", emocao: "choro", texto: "Seis anos... e eu nunca mais vejo o Thor por causa de um PAPEL de canil?" },
              { quem: "tales", emocao: "raiva", texto: "Apelaremos, Excelência, com o precedente do STJ logo na primeira lauda." }
            ],
            feedback: { acerto: "grave", titulo: "A sentença que o STJ já reformou — em tese",
              texto: "Decidir pela nota fiscal, ignorando o precedente expressamente invocado (sem a distinção fundamentada que o art. 489, §1º, VI, do CPC exige) e o histórico probatório de cuidados, é assinar a reforma em segundo grau. E há o resto: a decisão trata um vínculo de seis anos como se fosse a compra de um eletrodoméstico — a sala sentiu, e o tribunal lerá." },
            proxima: function (f) { return "fim_ruim"; } },

          { rotulo: "Atribuir a posse à cuidadora de referência (Camila) e ASSEGURAR a Rodrigo regime de convivência definido — fins de semana alternados e períodos nas férias",
            fundamento: "REsp 1.713.167/SP por analogia; histórico de cuidados comprovado; bem-estar do animal como vetor",
            efeitos: { tec: 8, hum: 6, tempo: 8 },
            carimbo: "PROCEDENTE EM PARTE",
            setFlags: { sentencaThor: true },
            reacoes: [
              { quem: "camila", emocao: "feliz", texto: "Ele volta pra casa..." },
              { quem: "rodrigo", emocao: "triste", texto: "Fins de semana alternados... é menos do que eu queria. Mas é mais do que eu temia." },
              { quem: "bia", emocao: "neutro", texto: "A defesa estudará o cabimento de recurso. Mas reconheço a fundamentação, Excelência." }
            ],
            feedback: { acerto: "otimo", titulo: "Sentença alinhada ao precedente e à prova",
              texto: "A decisão percorre o caminho que o STJ abriu: reconhece a singularidade do animal de estimação, atribui a posse a quem a prova aponta como cuidadora de referência (vacinas, despesas, declaração da veterinária) e — eis o ponto — NÃO transforma o outro em estranho: a convivência regulamentada é exatamente o que o REsp 1.713.167 admite. Fundamentação analítica (CPC, art. 489) à prova de Turma Recursal." },
            proxima: function (f) { return "fim_bom_sentenca"; } }
        ]
      }
    },

    fim_otimo: {
      fim: { selo: "otimo", titulo: "Duas casas, um Thor",
        texto: "Na saída, Rodrigo segura a porta para Camila — primeiro gesto civil em meses. Thor sai entre os dois, a guia frouxa, olhando para cima ora para um, ora para outro, como quem confere se a matilha inteira vem junto. O oficial de justiça, discretamente, joga fora o resto do biscoito. Fim de pauta." }
    },
    fim_bom: {
      fim: { selo: "bom", titulo: "Resolvido, com saudade",
        texto: "O caso se encerra com regras claras e duas pessoas aprendendo a dividir o que não se divide. Não foi a solução perfeita — foi a possível. Thor, que não lê termos de audiência, abana o rabo do mesmo jeito para os dois na saída." }
    },
    fim_bom_sentenca: {
      fim: { selo: "bom", titulo: "Sentença com fundamento e coração no lugar",
        texto: "Sem acordo, mas com critério: a sentença saiu da prova, dialogou com o precedente e deixou todo mundo com um pedaço de Thor — que é, afinal, o que Thor sempre quis. A defesa fala em recurso sem muita convicção. Você encerra a pauta do dia." }
    },
    fim_ruim: {
      fim: { selo: "ruim", titulo: "Alguém saiu sem o rabo abanando",
        texto: "A sentença resolveu os autos e desorganizou as vidas. No corredor, Thor olha para trás duas vezes. Há decisões tecnicamente assinadas que a gente continua revisando mentalmente no caminho de casa — esta vai junto com você." }
    }
  }
});
