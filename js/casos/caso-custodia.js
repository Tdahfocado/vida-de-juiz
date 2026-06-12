/* ============================================================
   CASO: AUDIÊNCIA DE CUSTÓDIA — "O pão de Jonas"
   ------------------------------------------------------------
   Pessoa em situação de rua presa em flagrante por furtar pães
   e leite (R$ 32) com os dois filhos pequenos ao lado. A
   audiência de custódia decide em minutos o destino de três
   vidas: soltar reconhecendo o furto famélico — e, DE OFÍCIO,
   acionar a rede para acolher as crianças — ou transformar
   fome em cadeia.

   Fundamentos centrais: CPP, art. 310 e Res. CNJ 213/2015;
   estado de necessidade (CP, art. 24) e insignificância
   (STF, HC 84.412); ECA, arts. 98 e 101; Res. 213, art. 9º.
   ============================================================ */

window.TOGA = window.TOGA || {};
TOGA.casos.push({
  id: "custodia",
  titulo: "Custódia — O pão de Jonas",
  subtitulo: "R$ 32 em pães e leite. Dois filhos esperando lá fora. O que a Justiça devolve?",
  area: "Audiência de Custódia",
  hora: "09:00",
  duracaoPrevistaMin: 40,
  tensao: 10,

  personagens: [
    { id: "jonas", nome: "Jonas", papel: "Custodiado", assento: "centro", preso: true,
      avatar: { pele: "#8a5436", cabelo: "curto", corCabelo: "#574737", traje: "camisa", corTraje: "#5a5148", barba: true } },
    { id: "alda", nome: "Dra. Alda", papel: "Promotora", assento: "esq1",
      avatar: { pele: "#e8c39a", cabelo: "coque", corCabelo: "#3a2a1a", traje: "blazer", corTraje: "#33424f", corBlusa: "#efe5c8" } },
    { id: "marta", nome: "Sra. Marta", papel: "Conselheira Tutelar", assento: "esq2",
      avatar: { pele: "#c98e66", cabelo: "longo", corCabelo: "#241505", traje: "camisa", corTraje: "#2f4a3e" } },
    { id: "estevao", nome: "Dr. Estêvão", papel: "Defensor Público", assento: "dir1",
      avatar: { pele: "#d8a87f", cabelo: "curto", corCabelo: "#241a10", traje: "terno", corTraje: "#2f4a3e", corGravata: "#33424f" } },
    { id: "selma", nome: "Selma", papel: "Assistente Social", assento: "dir2",
      avatar: { pele: "#a86a48", cabelo: "coque", corCabelo: "#241505", traje: "blazer", corTraje: "#54453a", corBlusa: "#e8e2d2", oculos: true } }
  ],

  autos: {
    resumo: "Prisão em flagrante por furto (CP, art. 155): pães, leite e achocolatado, avaliados em R$ 32,40, subtraídos de mercado às 23h50. O autuado está em situação de rua com dois filhos (6 e 9 anos), que presenciaram a prisão. Audiência de custódia na forma do art. 310 do CPP — realizada por ESTE juízo em cooperação, a pedido da Juíza Adriana da Cruz Dantas, coordenadora do Núcleo de Custódia e do Juízo das Garantias, em razão do mutirão do Núcleo.",
    pecas: [
      { id: "auto", titulo: "Auto de Prisão em Flagrante",
        texto: "Consta que JONAS subtraiu da prateleira do Mercado Bom Preço dois pacotes de pão de forma, duas caixas de leite e um achocolatado, total de R$ 32,40, deixando o local sem pagar. Detido pelo segurança na calçada, sem resistência. Conduzido algemado. As duas crianças que o acompanhavam choravam no momento da detenção. O autuado declarou: “era a janta dos meninos, doutor”. Nada de ilícito foi encontrado além dos gêneros alimentícios, que foram restituídos intactos ao estabelecimento." },
      { id: "defesa", titulo: "Manifestação da Defensoria",
        texto: "A Defensoria requer o relaxamento da prisão ou a concessão de liberdade plena: (i) o valor é ínfimo (R$ 32,40) e a res foi RESTITUÍDA intacta — incidem os vetores da insignificância fixados pelo STF no HC 84.412 (mínima ofensividade, ausência de periculosidade, reduzido grau de reprovabilidade, inexpressividade da lesão); (ii) tratava-se de alimento para os filhos menores, em contexto de fome atual e inevitável — estado de necessidade, CP, art. 24; (iii) fiança, ainda que mínima, equivaleria a manter preso quem não tem o que comer." },
      { id: "conselho", titulo: "Certidão do Conselho Tutelar",
        texto: "Certifico que as crianças L. (9 anos) e T. (6 anos), filhas do autuado, encontram-se sob cuidado provisório deste Conselho desde a prisão do genitor, ocorrida na presença de ambas. Não há outro familiar localizado. As crianças estão fora da escola há cerca de quatro meses, desde que a família perdeu a moradia. Aguardam definição deste Juízo no corredor do fórum." },
      { id: "nota", titulo: "Nota do Serviço Social do Fórum",
        texto: "Nos termos do art. 9º, §1º, da Resolução CNJ 213/2015, informa-se que há vagas disponíveis: acolhimento familiar conjunto no abrigo municipal (família completa, vaga imediata), inclusão no Centro POP e CadÚnico em 48 horas, e retorno escolar pelo programa Busca Ativa. A rede aguarda apenas determinação judicial para receber a família HOJE." }
    ]
  },

  focos: [
    { id: "f_flagrante", rotulo: "O auto de prisão", dica: "Como foi a detenção? O que exatamente foi subtraído — e devolvido?",
      grifos: [{ peca: "auto", trecho: "total de R$ 32,40" },
               { peca: "auto", trecho: "restituídos intactos ao estabelecimento" }] },
    { id: "f_fameelico", rotulo: "Furto famélico", dica: "Insignificância (STF, HC 84.412) e estado de necessidade (CP, art. 24): a fome como excludente.",
      grifos: [{ peca: "defesa", trecho: "mínima ofensividade, ausência de periculosidade, reduzido grau de reprovabilidade, inexpressividade da lesão" },
               { peca: "defesa", trecho: "estado de necessidade, CP, art. 24" }] },
    { id: "f_criancas", rotulo: "As crianças no corredor", dica: "Ninguém pediu nada sobre os filhos. O ECA permite — e exige — que o juiz aja de ofício (arts. 98 e 101).",
      grifos: [{ peca: "conselho", trecho: "Aguardam definição deste Juízo no corredor do fórum" },
               { peca: "conselho", trecho: "fora da escola há cerca de quatro meses" }] },
    { id: "f_rede", rotulo: "A rede de apoio", dica: "Res. CNJ 213, art. 9º: a custódia também serve para encaminhar. Há vaga para a família inteira — hoje.",
      grifos: [{ peca: "nota", trecho: "acolhimento familiar conjunto no abrigo municipal (família completa, vaga imediata)" }] }
  ],

  /* ---------- arco emocional ---------- */
  arco: {
    antes: { emocao: "vergonha", gesto: "angustia" },
    depois: [
      { se: function (f) { return f.jonasLivre && f.criancasAcolhidas; }, tom: "bom", gesto: "abraco",
        falas: [
          { quem: "jonas", emocao: "choro", texto: "Doutor... eu achei que ia perder os meninos. A moça da assistência já levou nós três pro abrigo. Tem janta. Tem cama." },
          { quem: "selma", emocao: "feliz", texto: "Vaga conjunta, Excelência. Pai e filhos juntos. Amanhã os meninos voltam para a escola. Foi a sua decisão que abriu a porta." }
        ] },
      { se: function (f) { return f.jonasLivre && !f.criancasAcolhidas; }, tom: "neutro",
        falas: [
          { quem: "jonas", emocao: "triste", texto: "Obrigado por me soltar, doutor. Agora... agora é achar onde os meninos dormem hoje. A rua de novo, né." }
        ] },
      { se: function (f) { return !!f.jonasPreso; }, tom: "grave",
        falas: [
          { quem: "marta", emocao: "choro", texto: "Excelência, as crianças viram o pai voltar algemado para a cela. O menor perguntou se o pai ia voltar antes da janta. Eu não soube responder." }
        ] }
    ]
  },

  vidasTocadas: [
    { se: function (f) { return f.jonasLivre && f.criancasAcolhidas; }, tom: "bom",
      texto: "Jonas e os meninos dormiram no abrigo — com café da manhã garantido e matrícula escolar encaminhada." },
    { se: function (f) { return f.jonasLivre && !f.criancasAcolhidas; }, tom: "grave",
      texto: "Jonas saiu livre, mas a família voltou para a mesma calçada. A fome de amanhã ninguém julgou." },
    { se: "jonasPreso", tom: "grave",
      texto: "Trinta e dois reais custaram a Jonas a única coisa que ele ainda tinha: os filhos por perto." }
  ],

  inicio: "k0",
  cenas: {

    /* ---------- AS ALGEMAS (antes de qualquer palavra) ---------- */
    k0: {
      falas: [
        { quem: "narrador", texto: "09h00. Jonas entra escoltado, algemado, os olhos no chão. Pela porta entreaberta, dá para ver duas crianças no banco do corredor, ao lado da conselheira tutelar. A menor balança os pés, que não alcançam o chão." },
        { quem: "narrador", texto: "A escolta o posiciona à sua frente e dá um passo para trás. As algemas continuam. O defensor olha para os pulsos do custodiado — e depois para você. Ninguém disse uma palavra ainda." }
      ],
      decisao: {
        prompt: "O custodiado está algemado diante de você. A audiência ainda nem começou.",
        opcoes: [
          { rotulo: "Manter as algemas durante o ato — é a praxe de segurança do plantão",
            fundamento: "Rotina das apresentações de custódia",
            efeitos: { hum: -5, tec: -4, tempo: 1 },
            reacoes: [
              { quem: "estevao", emocao: "firme", texto: "A Defensoria consigna em ata, Excelência: a Súmula Vinculante 11 exige justificativa ESCRITA e concreta. Praxe não é fundamento." },
              { quem: "jonas", emocao: "vergonha", texto: "..." }
            ],
            feedback: { acerto: "ruim", titulo: "Praxe não fundamenta algema",
              texto: "A Súmula Vinculante 11 é expressa: algema é EXCEÇÃO, e só se justifica por escrito diante de resistência, risco de fuga ou perigo concreto — nada disso consta do auto (detenção sem resistência, res restituída). A Res. CNJ 213, art. 8º, reforça a regra na custódia. Manter por inércia é constrangimento ilegal com assinatura sua." },
            proxima: "k1" },

          { rotulo: "Determinar a retirada imediata, consignando em ata: nenhuma justificativa concreta de risco foi apresentada",
            fundamento: "Súmula Vinculante 11; Res. CNJ 213/2015, art. 8º",
            efeitos: { tec: 5, hum: 6, tempo: 2 },
            carimbo: "ALGEMAS RETIRADAS",
            setFlags: { jonasSemAlgemas: true },
            reacoes: [
              { quem: "narrador", texto: "O policial retira as algemas sem hesitar. Jonas esfrega os pulsos devagar, como quem não sabe o que fazer com as próprias mãos — e, pela primeira vez, levanta os olhos." },
              { quem: "estevao", emocao: "feliz", texto: "Registro a observância da Súmula Vinculante 11, Excelência." },
              { quem: "alda", emocao: "neutro", texto: "Sem objeção. O auto não relata resistência." }
            ],
            feedback: { acerto: "otimo", titulo: "A regra é a mão livre",
              texto: "Exatamente o desenho constitucional: a Súmula Vinculante 11 só admite algemas em caso de resistência ou fundado receio de fuga ou perigo, JUSTIFICADO POR ESCRITO — e o auto registra detenção sem resistência. A Res. CNJ 213, art. 8º, faz da apresentação digna a regra da audiência de custódia. Há decisões que mudam o interrogatório inteiro: um homem fala diferente quando deixam que ele tenha mãos." },
            proxima: "k1" },

          { rotulo: "Perguntar à escolta se há registro de periculosidade e condicionar a retirada ao aval do policial",
            fundamento: "Prudência: quem conhece o preso é a escolta",
            efeitos: { tec: -2, imp: -2, tempo: 3 },
            reacoes: [
              { quem: "narrador", texto: "O policial dá de ombros: “por nós, pode tirar, doutor”. As algemas saem — mas a sala inteira notou quem decidiu." }
            ],
            feedback: { acerto: "ruim", titulo: "A avaliação é sua, não da escolta",
              texto: "O resultado até foi o mesmo — algemas retiradas —, mas pelo caminho errado: a Súmula Vinculante 11 entrega ao JUIZ o juízo de excepcionalidade, fundamentado nos autos. Condicionar ao aval do policial inverte a regra: transforma a exceção em cortesia da escolta e a jurisdição em balcão. Decida você; consigne você." },
            proxima: "k1" }
        ]
      }
    },

    /* ---------- ABERTURA ---------- */
    k1: {
      falas: [
        { quem: "estevao", emocao: "firme", texto: "Excelência, antes de tudo: o auto registra que a detenção se deu sem resistência e que os alimentos foram devolvidos intactos. Trinta e dois reais e quarenta centavos." },
        { quem: "jonas", emocao: "vergonha", texto: "Eu sei que errei, doutor. Mas os meninos não comiam desde ontem de manhã. Eu olhei pro pão... e não pensei mais." }
      ],
      decisao: {
        prompt: "A audiência de custódia começa por onde?",
        opcoes: [
          { rotulo: "Homologar o flagrante de imediato e passar a palavra ao Ministério Público",
            fundamento: "CPP, art. 310, I — regularidade formal",
            efeitos: { tec: 1, cel: 2, tempo: 4 },
            reacoes: [
              { quem: "alda", emocao: "neutro", texto: "O Ministério Público se manifestará, Excelência." }
            ],
            feedback: { acerto: "ruim", titulo: "A custódia não é cartório",
              texto: "A audiência de custódia existe para o juiz VER a pessoa presa — não só os papéis. A Res. CNJ 213 (art. 8º) manda o juiz perguntar, antes de qualquer mérito, sobre o tratamento recebido na prisão, agressões, estado de saúde e circunstâncias pessoais. Pular essa etapa transforma a garantia em carimbo." },
            proxima: "k2" },

          { rotulo: "Perguntar a Jonas, antes de tudo: como foi tratado na prisão? Quando ele e as crianças comeram pela última vez?",
            fundamento: "Res. CNJ 213/2015, art. 8º — entrevista do custodiado; CPP, art. 310",
            efeitos: { tec: 5, hum: 7, tempo: 7 },
            carimbo: "CUSTODIADO OUVIDO",
            setFlags: { ouviuJonas: true },
            reacoes: [
              { quem: "jonas", emocao: "surpresa", texto: "Ninguém me bateu não, doutor. O segurança até me deu água. Comer... eu não como desde anteontem. Os meninos comeram ontem de manhã, bolacha que uma moça deu." },
              { quem: "estevao", emocao: "neutro", texto: "A Defensoria registra a resposta, Excelência. Ela é o próprio mérito desta audiência." }
            ],
            feedback: { acerto: "otimo", titulo: "Ver a pessoa antes do processo",
              texto: "É exatamente o roteiro da Res. CNJ 213, art. 8º: o juiz da custódia verifica a legalidade da prisão E a condição humana de quem está algemado à sua frente. A resposta de Jonas — dois dias sem comer — não é detalhe emocional: é o elemento central do estado de necessidade (CP, art. 24) que a defesa arguiu." },
            proxima: "k2" },

          { rotulo: "Advertir Jonas: “furto é crime, e quem reincide vai preso” — para depois ouvir as partes",
            fundamento: "Caráter pedagógico da audiência",
            efeitos: { hum: -6, imp: -4, tempo: 5 },
            reacoes: [
              { quem: "jonas", emocao: "medo", texto: "..." },
              { quem: "estevao", emocao: "raiva", texto: "Excelência, com respeito: o custodiado ainda não foi sequer ouvido e já saiu advertido. A Defensoria consigna o protesto." }
            ],
            feedback: { acerto: "grave", titulo: "Sermão não é jurisdição",
              texto: "A audiência de custódia não tem 'caráter pedagógico' contra o preso — tem caráter de GARANTIA. Advertir antes de ouvir inverte o ônus, antecipa juízo de culpa e intimida quem já chegou com fome e vergonha. A Res. 213 manda perguntar; você pregou." },
            proxima: "k2" }
        ]
      }
    },

    /* ---------- O DESTINO DA PRISÃO ---------- */
    k2: {
      falas: [
        { quem: "alda", emocao: "neutro", texto: "Excelência, o flagrante é formalmente regular. Quanto à prisão: o Ministério Público reconhece o contexto, mas pondera que a reiteração de pequenos furtos na região preocupa o comércio local. Uma fiança módica sinalizaria responsabilidade." },
        { quem: "estevao", emocao: "firme", texto: "Fiança 'módica' para quem não tem teto é prisão com outro nome, Excelência. A Defensoria insiste: insignificância, estado de necessidade, restituição integral. E lembro que há duas crianças no corredor esperando para saber se o pai volta." }
      ],
      decisao: {
        prompt: "O flagrante está na sua mão (CPP, art. 310). O que fazer com a liberdade de Jonas?",
        opcoes: [
          { rotulo: "Arbitrar fiança de R$ 500,00 — 'valor simbólico que assegura o compromisso com o processo'",
            fundamento: "CPP, arts. 322 e 325",
            efeitos: { tec: -6, hum: -10, tempo: 6 },
            carimbo: "FIANÇA ARBITRADA",
            setFlags: { jonasPreso: true, fiancaInutil: true },
            evento: "prisao:jonas",
            reacoes: [
              { quem: "jonas", emocao: "choro", texto: "Quinhentos reais, doutor?! Eu furtei pão porque não tinha NADA..." },
              { quem: "estevao", emocao: "raiva", texto: "A fiança que não pode ser paga é prisão preventiva sem fundamentação, Excelência. Impetraremos habeas corpus hoje." }
            ],
            feedback: { acerto: "grave", titulo: "A fiança que prende",
              texto: "Para quem furtou R$ 32 em comida por fome, qualquer fiança é inalcançável — e o CPP tem resposta expressa: ao hipossuficiente a fiança se dispensa (art. 350). Arbitrá-la sabendo que não será paga é manter preso sem dizer que está mantendo preso. O resultado real: Jonas volta para a cela e as crianças ficam com o Conselho." },
            proxima: "k3p" },

          { rotulo: "Conceder liberdade provisória sem fiança, por ausência dos requisitos da preventiva — sem entrar no mérito do furto",
            fundamento: "CPP, arts. 310, III, 312 e 321",
            efeitos: { tec: 4, hum: 2, tempo: 6 },
            carimbo: "LIBERDADE PROVISÓRIA",
            setFlags: { jonasLivre: true, decisaoTecnica: true },
            evento: "soltura:jonas",
            reacoes: [
              { quem: "jonas", emocao: "surpresa", texto: "Eu... posso ir, doutor?" },
              { quem: "alda", emocao: "neutro", texto: "Sem objeção, Excelência." }
            ],
            feedback: { acerto: "bom", titulo: "Correto — mas o caso pedia mais",
              texto: "Decisão tecnicamente irretocável: não há cautelar a justificar prisão por R$ 32 restituídos (CPP, arts. 312 e 321). Mas a custódia oferecia a chance de NOMEAR o que aconteceu — furto famélico, fome atual e inevitável — e de acionar a rede. A liberdade resolveu a noite de Jonas; não resolveu a de amanhã." },
            proxima: "k3" },

          { rotulo: "Converter em preventiva: 'a reiteração de furtos exige resposta firme em defesa do patrimônio e da ordem pública'",
            fundamento: "CPP, art. 312 — ordem pública",
            efeitos: { tec: -10, hum: -12, imp: -6, tempo: 8 },
            carimbo: "PREVENTIVA DECRETADA",
            setFlags: { jonasPreso: true },
            evento: "prisao:jonas",
            reacoes: [
              { quem: "jonas", emocao: "choro", texto: "E os meus meninos, doutor?! QUEM FICA COM OS MEUS MENINOS?!" },
              { quem: "marta", emocao: "medo", texto: "Excelência... as crianças estão ouvindo daqui." },
              { quem: "estevao", emocao: "raiva", texto: "Preventiva por R$ 32 restituídos é a definição de desproporcionalidade. Habeas corpus em uma hora, Excelência." }
            ],
            feedback: { acerto: "grave", titulo: "O direito penal da fome",
              texto: "A preventiva exige proporcionalidade: jamais se admite cautelar mais grave que a pena provável do caso concreto (CPP, art. 313, e princípio da homogeneidade). Furto de R$ 32 restituídos, com forte tese de atipicidade (insignificância) e excludente (art. 24), não sustenta um dia de cárcere. O plantão do Tribunal dirá isso ainda hoje — mas as crianças já terão visto o pai voltar para a cela." },
            proxima: "k3p" },

          { rotulo: "Reconhecer expressamente o FURTO FAMÉLICO: relaxar a prisão por atipicidade material, com fundamentação no HC 84.412 e no art. 24 do CP",
            fundamento: "STF, HC 84.412 (insignificância); CP, art. 24; CPP, art. 310, I",
            requerFoco: "f_fameelico",
            efeitos: { tec: 9, hum: 8, tempo: 9 },
            carimbo: "PRISÃO RELAXADA",
            setFlags: { jonasLivre: true, fameElicoReconhecido: true },
            evento: "soltura:jonas",
            reacoes: [
              { quem: "jonas", emocao: "choro", texto: "Obrigado, doutor. Obrigado. Eu nunca... eu nunca tinha entrado numa sala dessas. Achei que ninguém ia entender." },
              { quem: "alda", emocao: "neutro", texto: "Registro que a fundamentação enfrentou os quatro vetores do Supremo, Excelência. Nada a opor." },
              { quem: "estevao", emocao: "feliz", texto: "É para isso que a custódia existe, Excelência." }
            ],
            feedback: { acerto: "otimo", titulo: "Chamar a fome pelo nome",
              texto: "Decisão completa: os quatro vetores do HC 84.412 (mínima ofensividade, ausência de periculosidade, reduzida reprovabilidade, lesão inexpressiva) estão TODOS presentes — R$ 32, restituição integral, contexto de fome. E o art. 24 do CP fecha o quadro: perigo atual (dois dias sem comer), inevitável por outro modo, sacrifício de bem menor (R$ 32) para salvar bem maior (a alimentação de duas crianças). Nomear o furto famélico na decisão não é sentimentalismo: é tipicidade material aplicada." },
            proxima: "k3" }
        ]
      }
    },

    /* ---------- DE OFÍCIO: AS CRIANÇAS (ramo da liberdade) ---------- */
    k3: {
      falas: [
        { quem: "narrador", texto: "O policial retira as algemas. Jonas esfrega os pulsos, ainda sem acreditar. Ninguém pediu nada sobre as crianças — formalmente, a audiência acabou. Mas elas continuam no corredor." },
        { quem: "marta", emocao: "neutro", texto: "Excelência, se me permite uma palavra fora do protocolo: o Conselho não tem onde manter as crianças além de hoje. E separá-las do pai, agora que ele está livre..." }
      ],
      decisao: {
        prompt: "Nada foi requerido sobre os filhos de Jonas. E agora?",
        opcoes: [
          { rotulo: "Recomendar verbalmente a Jonas que procure o CRAS amanhã cedo, levando a certidão desta audiência",
            fundamento: "Orientação ao jurisdicionado",
            efeitos: { hum: 1, tempo: 4 },
            reacoes: [
              { quem: "jonas", emocao: "neutro", texto: "Eu vou sim, doutor. Eu vou." }
            ],
            feedback: { acerto: "ruim", titulo: "Recomendação não tem telefone",
              texto: "Recomendar é terceirizar para o mais fraco a tarefa de furar a fila do próprio Estado. A nota do serviço social dizia: a vaga conjunta existe HOJE e aguarda 'apenas determinação judicial'. Sem ofício, amanhã a vaga pode não existir — e a família dorme na rua com a sua recomendação no bolso." },
            proxima: function (f) { return "fim_bomtec"; } },

          { rotulo: "Determinar DE OFÍCIO: acolhimento institucional conjunto da família (vaga imediata), ofícios ao CRAS, ao Centro POP e ao Conselho Tutelar, retorno escolar pelo Busca Ativa e audiência de reavaliação em 30 dias — chamando a assistente social à sala AGORA",
            fundamento: "ECA, arts. 98, II, e 101, §§ 1º e 2º; Res. CNJ 213, art. 9º, §1º",
            requerFoco: "f_criancas",
            efeitos: { tec: 7, hum: 10, cel: -2, tempo: 12 },
            carimbo: "REDE ACIONADA",
            setFlags: { criancasAcolhidas: true, redeAcionada: true },
            reacoes: [
              { quem: "selma", emocao: "feliz", texto: "Recebido em mãos, Excelência. A van do abrigo busca os três na porta do fórum em quarenta minutos. Jantar é às sete." },
              { quem: "jonas", emocao: "choro", texto: "Nós três juntos?... Doutor, eu entrei aqui achando que ia perder eles." },
              { quem: "marta", emocao: "feliz", texto: "Vou avisar as crianças. O mais novo vai querer saber do jantar primeiro, garanto." }
            ],
            feedback: { acerto: "otimo", titulo: "O juiz que enxerga o processo inteiro — e as pessoas fora dele",
              texto: "O ECA não espera provocação: constatada a situação de risco (art. 98, II — falta de moradia, evasão escolar), o juiz da infância APLICA medidas de proteção de ofício (art. 101), priorizando o convívio familiar (§1º). E a Res. CNJ 213, art. 9º, manda exatamente isto: a custódia como porta de entrada da rede. Você usou a mesma audiência que poderia ter encarcerado um pai para garantir teto, escola e jantar a três pessoas. Isso é jurisdição em sentido pleno." },
            proxima: "fim_otimo" },

          { rotulo: "Nada a prover de ofício: o objeto da custódia é a prisão, e ele está esgotado — eventual medida protetiva corre na vara da infância, mediante provocação",
            fundamento: "Princípio da inércia da jurisdição (CPC, art. 2º)",
            efeitos: { tec: -2, hum: -6, cel: 2, tempo: 3 },
            reacoes: [
              { quem: "marta", emocao: "triste", texto: "Então... eu devolvo as crianças para onde, Excelência?" }
            ],
            feedback: { acerto: "grave", titulo: "A inércia certa no lugar errado",
              texto: "A inércia da jurisdição vale para o PROCESSO CIVIL entre partes capazes — não para crianças em situação de risco diante do juiz. O ECA é expresso: arts. 98 e 101 autorizam (e ordenam) a atuação de ofício, e a Res. 213 integra a custódia à rede de proteção. Você tinha a caneta, a vaga e as crianças a vinte metros. Faltou só a decisão." },
            proxima: function (f) { return "fim_bomtec"; } }
        ]
      }
    },

    /* ---------- RAMO DO ERRO: JONAS PRESO ---------- */
    k3p: {
      falas: [
        { quem: "narrador", texto: "O policial recoloca as algemas. Pela porta, ouve-se a voz fina de uma criança perguntando alguma coisa à conselheira. Ninguém na sala se atreve a traduzir." },
        { quem: "estevao", emocao: "firme", texto: "Última ponderação, Excelência, antes de o alvará negativo ser lavrado: a decisão pode ser reconsiderada AGORA, nesta audiência. O senhor tem nos autos a restituição integral, a certidão das crianças e dois dias de fome documentados. Peço reconsideração." }
      ],
      decisao: {
        prompt: "O Defensor pede reconsideração imediata. A caneta ainda está na sua mão.",
        opcoes: [
          { rotulo: "Manter a decisão: 'a porta da revisão é o habeas corpus; a desta sala já se fechou'",
            fundamento: "Preclusão pro judicato",
            efeitos: { tec: -6, hum: -8, tempo: 4 },
            carimbo: "DECISÃO MANTIDA",
            setFlags: { manchaGrave: true },
            reacoes: [
              { quem: "estevao", emocao: "raiva", texto: "O plantão do Tribunal decidirá ainda hoje, Excelência. Mas as crianças não têm plantão." }
            ],
            feedback: { acerto: "grave", titulo: "O orgulho custa caro — para os outros",
              texto: "Não há preclusão para o juiz rever prisão ilegal: o art. 316 do CPP e a própria lógica da custódia permitem a reconsideração imediata. Manter o erro por inércia transfere o custo para quem não pode pagá-lo: Jonas, na cela; as crianças, no Conselho; e a sua decisão, no plantão do TJ — onde cairá com fundamentação de prateleira." },
            proxima: "fim_grave" },

          { rotulo: "Reconsiderar EM ATA: revogar a medida, reconhecer o contexto famélico e conceder liberdade plena",
            fundamento: "CPP, art. 316; autotutela judicial; CP, art. 24",
            efeitos: { tec: 5, hum: 7, tempo: 7 },
            carimbo: "RECONSIDERADO",
            setFlags: { jonasLivre: true, jonasPreso: false, reconsiderouCustodia: true },
            evento: "soltura:jonas",
            reacoes: [
              { quem: "jonas", emocao: "choro", texto: "Obrigado, doutor. Obrigado." },
              { quem: "estevao", emocao: "feliz", texto: "Reconsiderar no ato é o que distingue o erro do erro consumado, Excelência." }
            ],
            feedback: { acerto: "bom", titulo: "Errar e corrigir ainda é juízo funcionando",
              texto: "A reconsideração imediata evitou o pior: Jonas não dorme na cadeia por R$ 32. O art. 316 do CPP autoriza a revogação a qualquer tempo — e a melhor hora é antes de o erro produzir efeitos. A cicatriz fica (as crianças viram as algemas duas vezes), mas a noite termina em liberdade." },
            proxima: "k3" }
        ]
      }
    },

    /* ---------- FINS ---------- */
    fim_otimo: {
      falas: [
        { quem: "narrador", texto: "Selma sai da sala já ao telefone com o abrigo. No corredor, ouve-se — nítida — uma criança perguntando: “pai, lá tem janta MESMO?”. E a resposta de Jonas, rindo e chorando ao mesmo tempo: “tem, filho. O doutor garantiu.”" }
      ],
      fim: {
        titulo: "A JUSTIÇA QUE ALIMENTA",
        selo: "otimo",
        texto: "Em quarenta minutos de audiência, três vidas mudaram de rumo: prisão relaxada com fundamentação que honra a jurisprudência, família mantida unida, teto e escola garantidos pela rede que a sua caneta acionou. Nenhuma lei foi flexibilizada — todas foram CUMPRIDAS, inclusive as que ninguém tinha pedido."
      }
    },

    fim_bomtec: {
      falas: [
        { quem: "narrador", texto: "Jonas sai livre, de mãos vazias, e recolhe os filhos no corredor. A conselheira anota um endereço num papel. Pela janela, dá para vê-los descendo a rua — para onde, ninguém na sala saberia dizer." }
      ],
      fim: {
        titulo: "LIVRE — E SÓ",
        selo: "bom",
        texto: "A prisão terminou corretamente: não havia cautelar que sustentasse um dia de cárcere por R$ 32. Mas a audiência tinha mais a oferecer — uma vaga de abrigo com jantar às sete — e a porta se fechou sem que o ofício fosse assinado. A liberdade de hoje está garantida; a fome de amanhã segue sem juiz."
      }
    },

    fim_grave: {
      falas: [
        { quem: "narrador", texto: "O corredor fica em silêncio quando a escolta passa. A conselheira abraça as duas crianças. O processo seguirá seus prazos; a infância delas, também." }
      ],
      fim: {
        titulo: "TRINTA E DOIS REAIS",
        selo: "grave",
        setFlags: { manchaGrave: true },
        texto: "A custódia existia para impedir exatamente isto: a fome tratada como caso de polícia. O plantão do Tribunal provavelmente soltará Jonas ainda hoje — com fundamentação que estava, desde o início, nos seus autos. Ficam na conta desta audiência: uma noite de cela por dois pães, e duas crianças que aprenderam, cedo demais, o que a palavra 'algema' significa."
      }
    }
  }
});
