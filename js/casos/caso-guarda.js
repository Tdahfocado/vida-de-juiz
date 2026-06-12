/* ============================================================
   CASO 2 — "A Guarda de Sofia"
   Família · pauta das 11:00
   ------------------------------------------------------------
   Temas jurídicos centrais: guarda compartilhada como regra
   (CC, arts. 1.583/1.584), escuta especializada da criança
   (Lei 13.431/2017; CPC, art. 699), gradação das medidas na
   alienação parental (Lei 12.318, art. 6º) e conciliação em
   ações de família (CPC, art. 694).
   ============================================================ */

window.TOGA = window.TOGA || {};
TOGA.casos = TOGA.casos || [];

TOGA.casos.push({
  id: "guarda",
  titulo: "A Guarda de Sofia",
  subtitulo: "Pai pede guarda unilateral e acusa alienação. Mãe rebate. Sofia, 8 anos, espera lá fora.",
  area: "Família",
  hora: "11:00",
  duracaoPrevistaMin: 85,
  tensao: 6,

  personagens: [
    { id: "eduardo", nome: "Eduardo", papel: "Pai (autor)", assento: "esq2",
      avatar: { pele: "#d8a87f", cabelo: "curto", corCabelo: "#2a1c10", traje: "camisa", corTraje: "#4a5a6a" } },
    { id: "hugo", nome: "Dr. Hugo", papel: "Advogado", assento: "esq1",
      avatar: { pele: "#e0b48c", cabelo: "curto", corCabelo: "#555048", traje: "terno", corTraje: "#33424f", corGravata: "#2f4a3e", oculos: true } },
    { id: "beatriz", nome: "Dra. Beatriz", papel: "Promotora", assento: "esq3",
      avatar: { pele: "#8a5a3a", cabelo: "coque", corCabelo: "#150f08", traje: "terno", corTraje: "#2b3340", corGravata: "#7a2e2e" } },
    { id: "renata", nome: "Renata", papel: "Mãe (ré)", assento: "dir2",
      avatar: { pele: "#e8c49c", cabelo: "longo", corCabelo: "#3a2210", traje: "camisa", corTraje: "#8a4a5a" } },
    { id: "vanessa", nome: "Dra. Vanessa", papel: "Advogada", assento: "dir1",
      avatar: { pele: "#c98e66", cabelo: "coque", corCabelo: "#241505", traje: "blazer", corTraje: "#553a4a", corBlusa: "#efe5c8", oculos: true } },
    { id: "ana", nome: "Ana", papel: "Psicóloga do Juízo", assento: "dir3",
      avatar: { pele: "#d8a87f", cabelo: "longo", corCabelo: "#4a3318", traje: "blazer", corTraje: "#3f5a50", corBlusa: "#e8e2d2" } }
  ],

  autos: {
    resumo: "Ação de modificação de guarda. O pai pede guarda unilateral alegando que a mãe dificulta a convivência e pratica alienação parental (junta prints). A mãe sustenta que o pai viaja 10 dias por mês e descumpre o que promete. Estudo psicossocial concluído. Sofia tem 8 anos.",
    pecas: [
      { id: "inicial", titulo: "Petição inicial (pai)",
        texto: "EDUARDO requer a GUARDA UNILATERAL de Sofia (8 anos): a genitora descumpre visitas combinadas, desautoriza o pai diante da filha e pratica alienação parental, como provam mensagens anexas. Pede, liminarmente, multa e inversão da guarda." },
      { id: "contestacao", titulo: "Contestação (mãe)",
        texto: "RENATA impugna: o autor viaja a trabalho de 8 a 10 dias por mês, promete passeios e falta, e a “alienação” é, na verdade, frustração da própria criança. A guarda fática sempre foi materna. Pede a improcedência e a fixação de convivência compatível com a agenda real do pai." },
      { id: "estudo", titulo: "Estudo psicossocial",
        texto: "A equipe técnica constatou: vínculo afetivo forte de Sofia com AMBOS os genitores; sinais de conflito de lealdade (a criança evita falar de um genitor na frente do outro); queda recente de rendimento escolar. RECOMENDA: guarda compartilhada com lar de referência materno e ampliação GRADUAL da convivência paterna. DESACONSELHA a inquirição direta da criança em audiência." },
      { id: "boletim", titulo: "Boletim escolar + bilhete",
        texto: "Boletim do último bimestre: queda de rendimento em três disciplinas e 6 faltas. Bilhete manuscrito da professora: “Sofia anda muito quieta. Quando perguntei, disse que não queria escolher.”" },
      { id: "prints", titulo: "Prints de mensagens",
        texto: "RENATA (para Sofia, em grupo da família): “fala pro seu pai que promessa dele eu não acredito mais.”\nEDUARDO (para Renata): “ela tá te envenenando contra mim, isso vai parar no juiz.”\nRENATA: “quem promete Disney e some por 10 dias é você.”" }
    ]
  },

  focos: [
    { id: "f_estudo", rotulo: "Estudo psicossocial", dica: "A equipe técnica já apontou o caminho — e avisou o que NÃO fazer com Sofia." },
    { id: "f_boletim", rotulo: "Boletim escolar", dica: "A queda de rendimento é o termômetro silencioso do conflito." },
    { id: "f_prints", rotulo: "Prints no contexto", dica: "Lidos por inteiro, são bem menos conclusivos do que o autor sustenta." },
    { id: "f_viagens", rotulo: "Rotina do pai", dica: "8 a 10 dias por mês fora: qualquer plano de convivência precisa caber nessa agenda." }
  ],

  arco: {
    antes: { emocao: "triste", gesto: "angustia" },
    depois: [
      { se: function (f) { return !!f.acordoSofia; }, tom: "bom", gesto: "abraco",
        falas: [
          { quem: "renata", emocao: "feliz", texto: "A Sofia colou o calendário na geladeira antes mesmo de eu desfazer a bolsa, doutor. Disse que agora 'tem casa de semana e casa de fim de semana' — e riu. Faz tempo que ela não ria falando disso." },
          { quem: "eduardo", emocao: "feliz", texto: "Nós dois saímos perdendo um pouco e ganhando a Sofia inteira, Excelência. A conta fecha." }
        ] },
      { se: function (f) { return !!f.revitimizacao; }, tom: "grave",
        falas: [
          { quem: "ana", emocao: "triste", texto: "Excelência, a Sofia me perguntou no corredor se 'falou alguma coisa errada' na sala. Uma criança de oito anos saiu de uma audiência se sentindo culpada. É isso que a Lei 13.431 tenta impedir." }
        ] }
    ]
  },

  vidasTocadas: [
    { se: "acordoSofia", tom: "bom",
      texto: "Sofia tem calendário na geladeira das duas casas — e a frequência escolar voltou ao normal na mesma semana." },
    { se: "revitimizacao", tom: "grave",
      texto: "Sofia contou seus medos numa sala de adultos em silêncio. A audiência acabou; a memória dela, não." }
  ],

  inicio: "g1",
  cenas: {

    g1: {
      falas: [
        { quem: "narrador", texto: "11h00. Os pais de Sofia não se cumprimentaram ao entrar. A psicóloga do juízo acomoda-se discretamente ao lado da bancada." },
        { quem: "hugo", emocao: "firme", texto: "Excelência, requeremos o início imediato da instrução — e a oitiva da menor, que está na sala de espera com a avó." },
        { quem: "beatriz", emocao: "neutro", texto: "O Ministério Público, como fiscal da ordem jurídica em causa de interesse de incapaz, opina pela tentativa prévia de conciliação." }
      ],
      decisao: {
        prompt: "Como você conduz a abertura?",
        opcoes: [
          { rotulo: "Indeferir a conciliação e abrir diretamente a instrução",
            fundamento: "O conflito está judicializado há meses; conciliar seria perda de tempo",
            efeitos: { tec: -6, hum: -4, tempo: 4 },
            carimbo: "INSTRUÇÃO ABERTA",
            setFlags: { pulouConciliacao: true },
            reacoes: [
              { quem: "beatriz", emocao: "firme", texto: "Consigne-se que o Ministério Público opinou pela tentativa de composição, na forma do art. 694 do CPC." }
            ],
            feedback: { acerto: "ruim", titulo: "Pular a etapa que a lei mandou tentar",
              texto: "“Todos os esforços” (CPC, art. 694) não é faculdade estilística: é comando legal específico das ações de família. Litígios de guarda decididos sem nenhuma tentativa de composição tendem a voltar — em cumprimento de sentença, em novas ações, no boletim escolar de Sofia." },
            proxima: "g3" },

          { rotulo: "Ouvir primeiro o parecer do Ministério Público sobre o roteiro da audiência",
            fundamento: "MP atua como fiscal da ordem jurídica (CPC, art. 178, II)",
            efeitos: { tec: 3, tempo: 5 },
            carimbo: "VISTA AO MP",
            reacoes: [
              { quem: "beatriz", emocao: "neutro", texto: "Pela tentativa de conciliação, Excelência, com apoio da equipe técnica presente." }
            ],
            feedback: { acerto: "bom", titulo: "Caminho seguro",
              texto: "Ouvir o MP em causa de interesse de incapaz é sempre correto (CPC, art. 178, II). O parecer apontou para onde o art. 694 já apontava: conciliação primeiro." },
            proxima: "g2" },

          { rotulo: "Empregar todos os esforços para a solução consensual antes de qualquer instrução",
            fundamento: "CPC, art. 694 — nas ações de família, todos os esforços para a composição",
            efeitos: { tec: 8, hum: 6, tempo: 8 },
            carimbo: "CONCILIAÇÃO",
            reacoes: [
              { quem: "ana", emocao: "feliz", texto: "..." },
              { quem: "beatriz", emocao: "feliz", texto: "É a posição do Ministério Público, Excelência." }
            ],
            feedback: { acerto: "otimo", titulo: "A regra de ouro das ações de família",
              texto: "O art. 694 do CPC determina que, nas ações de família, “todos os esforços serão empreendidos para a solução consensual” — inclusive com apoio de mediação e da equipe multidisciplinar. Em disputa de guarda, sentença raramente pacifica: acordo bem construído, sim. Começar pela ponte, não pela trincheira." },
            proxima: "g2" }
        ]
      }
    },

    g2: {
      falas: [
        { quem: "eduardo", emocao: "raiva", texto: "Eu quero meus direitos de pai, Excelência. Guarda unilateral. Ela usa a menina contra mim!" },
        { quem: "renata", emocao: "raiva", texto: "Unilateral?! Você não sabe nem o nome da pediatra, Eduardo. Quem leva, quem busca, quem cuida da febre sou EU." },
        { quem: "narrador", texto: "As vozes sobem. Sofia está a uma porta de distância dali." }
      ],
      decisao: {
        prompt: "A conciliação ameaça virar ringue. Como você intervém?",
        opcoes: [
          { rotulo: "Sugerir que a mãe ceda desde já dois pernoites semanais, “para mostrar boa vontade”",
            fundamento: "Destravar a negociação com gesto unilateral",
            efeitos: { imp: -8, tempo: 6 },
            carimbo: "SUGESTÃO À MÃE",
            reacoes: [
              { quem: "vanessa", emocao: "raiva", texto: "Excelência, consigne-se: o juízo abriu a negociação cobrando concessão de UMA das partes — justamente a que detém a guarda fática com respaldo do estudo técnico." }
            ],
            feedback: { acerto: "ruim", titulo: "Mediador não escolhe lado",
              texto: "Quem conduz conciliação propõe estruturas, não concessões unilaterais. Cobrar “boa vontade” de apenas uma parte — contrariando, de quebra, a recomendação do estudo psicossocial de ampliação GRADUAL — contamina a percepção de imparcialidade e endurece a outra cadeira." },
            proxima: "g3" },

          { rotulo: "Explicar que compartilhada é a REGRA legal — e que não significa dividir o tempo ao meio — e propor a construção de um plano",
            fundamento: "CC, art. 1.584, §2º (regra da compartilhada); art. 1.583, §2º (convívio equilibrado ≠ idêntico)",
            efeitos: { tec: 10, hum: 6, tempo: 12 },
            carimbo: "PROPOSTA LANÇADA",
            setFlags: { pontePlano: true },
            reacoes: [
              { quem: "eduardo", emocao: "surpresa", texto: "Então compartilhada não é a menina morar metade do mês em cada casa?" },
              { quem: "renata", emocao: "neutro", texto: "Se for assim... dá pra conversar." }
            ],
            feedback: { acerto: "otimo", titulo: "Desfazer o mito que trava o acordo",
              texto: "Metade dos litígios de guarda briga contra um fantasma: a ideia de que compartilhada = tempo idêntico. O art. 1.584, §2º, do CC faz da compartilhada a regra quando ambos os genitores estão aptos; e o art. 1.583, §2º, fala em convívio “de forma equilibrada” — o que se compartilha é a RESPONSABILIDADE pelas decisões, com lar de referência definido. Explicado isso, a mesa muda de figura." },
            proxima: "g3" },

          { rotulo: "Encerrar a conciliação em dois minutos: “está claro que não há acordo possível”",
            fundamento: "Economia processual",
            efeitos: { tec: -4, hum: -6, tempo: 2 },
            carimbo: "SEM ACORDO",
            feedback: { acerto: "ruim", titulo: "Desistir antes de tentar",
              texto: "Dois adultos exaltados não significam acordo impossível — significam condução necessária. O art. 694 pede esforços reais; ferramentas como reenquadrar o conflito (da disputa pela criança para o cuidado com a criança) existem exatamente para este momento." },
            proxima: "g3" }
        ]
      }
    },

    g3: {
      falas: [
        { quem: "hugo", emocao: "firme", texto: "Excelência, reitero: requeiro que Sofia seja trazida e ouvida AGORA por Vossa Excelência, aqui na sala. A verdade sai da boca das crianças." },
        { quem: "ana", emocao: "firme", texto: "Como psicóloga do juízo, peço vênia para ponderar os riscos dessa exposição, Excelência. O estudo técnico tratou do ponto." }
      ],
      decisao: {
        prompt: "Ouvir Sofia — agora, aqui, na frente dos pais?",
        opcoes: [
          { rotulo: "Deferir: mandar trazer Sofia e ouvi-la na sala, diante dos pais",
            fundamento: "Imediação do juízo com a prova",
            efeitos: { hum: -15, tec: -10, tempo: 10 },
            carimbo: "CRIANÇA OUVIDA EM SALA",
            setFlags: { revitimizacao: true },
            reacoes: [
              { quem: "narrador", texto: "Sofia entra olhando para o chão. Olha para a mãe, depois para o pai, depois para os próprios sapatos. “Eu... eu gosto dos dois”, diz, e as lágrimas vêm." },
              { quem: "renata", emocao: "choro", texto: "Chega, pelo amor de Deus..." },
              { quem: "beatriz", emocao: "raiva", texto: "O Ministério Público consigna veemente protesto e adotará as providências cabíveis quanto à forma desta oitiva." }
            ],
            feedback: { acerto: "grave", titulo: "A prova que machuca quem deveria proteger",
              texto: "Colocar uma criança de 8 anos para “escolher” entre os pais, em sala de audiência e na presença de ambos, contraria a Lei 13.431/2017, o art. 699 do CPC e a recomendação expressa do estudo psicossocial juntado aos autos. Além de revitimizar Sofia, a “prova” colhida assim nada vale: nenhuma criança fala livremente sob esse olhar cruzado." },
            proxima: "g4" },

          { rotulo: "Indeferir qualquer escuta da criança, agora ou depois: “criança não é prova”",
            fundamento: "Blindagem total da menor",
            efeitos: { tec: -5, hum: -3, tempo: 3 },
            carimbo: "ESCUTA INDEFERIDA",
            feedback: { acerto: "ruim", titulo: "Proteger não é silenciar",
              texto: "A criança tem direito de ser ouvida nos assuntos que lhe dizem respeito (ECA, art. 100, parágrafo único, XII; Convenção sobre os Direitos da Criança, art. 12) — na FORMA adequada. Vedar toda escuta confunde proteção com exclusão: o caminho era a escuta especializada, não o silêncio." },
            proxima: "g4" },

          { rotulo: "Indeferir a oitiva informal e determinar escuta especializada com a equipe técnica, em ambiente adequado",
            fundamento: "Lei 13.431/2017 (escuta especializada e depoimento especial); CPC, art. 699",
            efeitos: { tec: 12, hum: 8, tempo: 6 },
            carimbo: "ESCUTA ESPECIALIZADA",
            setFlags: { escutaCorreta: true },
            reacoes: [
              { quem: "ana", emocao: "feliz", texto: "A equipe agenda para esta semana, Excelência, em sala apropriada." },
              { quem: "hugo", emocao: "neutro", texto: "Consigno o requerimento e me curvo à forma legal." }
            ],
            feedback: { acerto: "otimo", titulo: "Ouvir a criança SEM expô-la",
              texto: "A participação de Sofia importa — mas tem forma própria: a Lei 13.431/2017 estruturou a escuta especializada e o depoimento especial precisamente para evitar a revitimização; o CPC, art. 699, exige acompanhamento de especialista no depoimento de incapaz quando há discussão de abuso ou alienação. Criança não depõe em ringue: fala em ambiente protegido, a profissional habilitado, uma única vez." },
            proxima: "g4" }
        ]
      }
    },

    g4: {
      falas: [
        { quem: "vanessa", emocao: "firme", texto: "Ao autor: o senhor pretende apresentar sua nova namorada de 22 anos à menina já no primeiro pernoite? É esse o ambiente?" },
        { quem: "hugo", emocao: "raiva", texto: "Objeção, Excelência! Devassa da vida privada, sem pertinência." }
      ],
      decisao: {
        prompt: "A objeção está lançada. Você:",
        opcoes: [
          { rotulo: "Mandar reformular: a pergunta interessa na exata medida do impacto na ROTINA da criança",
            fundamento: "CPC, art. 459 — indeferem-se perguntas sem relação com a causa; pertinência parcial",
            efeitos: { tec: 6, imp: 2, tempo: 4 },
            carimbo: "REFORMULE",
            reacoes: [
              { quem: "vanessa", emocao: "neutro", texto: "Reformulo: como o autor pretende organizar a rotina de Sofia nos pernoites, considerando as pessoas que frequentam sua casa?" }
            ],
            feedback: { acerto: "otimo", titulo: "O recorte exato da pertinência",
              texto: "A vida amorosa do genitor, em si, não é objeto do processo; o ambiente e a rotina oferecidos à criança, sim. O art. 459 do CPC autoriza indeferir o impertinente — e a reformulação preserva o que importa: como será o cotidiano de Sofia naquela casa." },
            proxima: "g5" },

          { rotulo: "Deferir a pergunta como formulada",
            fundamento: "Ampla instrução",
            efeitos: { imp: -5, hum: -3, tempo: 3 },
            carimbo: "DEFERIDA",
            reacoes: [
              { quem: "eduardo", emocao: "raiva", texto: "Minha vida pessoal agora é crime? É isso?" }
            ],
            feedback: { acerto: "ruim", titulo: "Instrução não é exposição",
              texto: "Como posta, a pergunta mira constranger (“namorada de 22 anos”), não esclarecer. Deferi-la transforma a audiência em tribunal moral da vida privada — e azeda uma mesa que você precisa inteira para o acordo." },
            proxima: "g5" },

          { rotulo: "Indeferir integralmente a pergunta",
            fundamento: "Vida privada é impenetrável",
            efeitos: { tec: -2, imp: 1, tempo: 2 },
            carimbo: "INDEFERIDA",
            feedback: { acerto: "bom", titulo: "Defensável — mas jogou fora o que prestava",
              texto: "Indeferir é melhor que deferir o constrangimento. Mas havia um núcleo pertinente na pergunta: o ambiente e a rotina dos pernoites interessam diretamente à causa. A reformulação teria aproveitado essa parte." },
            proxima: "g5" }
        ]
      }
    },

    g5: {
      falas: [
        { quem: "hugo", emocao: "firme", texto: "Excelência, os prints provam a alienação parental: a genitora desqualifica o pai PARA a própria criança. Requeiro multa e INVERSÃO LIMINAR da guarda, na forma da Lei 12.318." },
        { quem: "renata", emocao: "medo", texto: "Inverter a guarda? Tirar a Sofia de mim por causa de uma mensagem?" }
      ],
      decisao: {
        prompt: "Há indícios de alienação parental. Qual a resposta judicial adequada?",
        opcoes: [
          { rotulo: "Advertir a genitora e determinar acompanhamento psicológico, mantendo a avaliação",
            fundamento: "Lei 12.318, art. 6º, I e IV — primeiro degrau da gradação",
            efeitos: { tec: 5, tempo: 6 },
            carimbo: "ADVERTÊNCIA",
            feedback: { acerto: "bom", titulo: "Gradação correta — mira incompleta",
              texto: "A resposta está no degrau certo da Lei 12.318 (advertência + acompanhamento, sem o salto à inversão). Mas a leitura integral dos prints revelaria desqualificação recíproca: advertir só a mãe deixa metade do problema — e do recado — sem destinatário." },
            proxima: "g6" },

          { rotulo: "Ignorar o tema: “alienação parental é moda forense”",
            fundamento: "Ceticismo quanto ao instituto",
            efeitos: { tec: -8, tempo: 2 },
            carimbo: "TEMA AFASTADO",
            feedback: { acerto: "ruim", titulo: "A lei não se ignora por opinião",
              texto: "Pode-se criticar academicamente a Lei 12.318 — mas ela está em vigor, foi expressamente invocada e há indícios nos autos. O juízo decide fundamentadamente (acolhendo ou rejeitando), nunca finge que o pedido não existe: isso é negativa de prestação jurisdicional." },
            proxima: "g6" },

          { rotulo: "Ler os prints NO CONTEXTO e aplicar a gradação: advertência a AMBOS + acompanhamento, mantendo a avaliação técnica",
            fundamento: "Lei 12.318, art. 6º — medidas em gradação, conforme a gravidade; prints ambíguos e recíprocos",
            requerFoco: "f_prints",
            efeitos: { tec: 10, hum: 4, tempo: 8 },
            carimbo: "ADVERTÊNCIA BILATERAL",
            setFlags: { gradacaoCorreta: true },
            reacoes: [
              { quem: "hugo", emocao: "surpresa", texto: "Bilateral, Excelência?" },
              { quem: "narrador", texto: "Você lê em voz alta a sequência completa: a desqualificação da mãe — e, logo abaixo, a do pai (“ela tá te envenenando”), enviada com a filha no grupo." },
              { quem: "eduardo", emocao: "vergonha", texto: "..." }
            ],
            feedback: { acerto: "otimo", titulo: "Quem leu os autos inteiros decide diferente",
              texto: "Os prints, lidos por inteiro, mostram desqualificação RECÍPROCA — ambos atiram, e Sofia está no meio. A Lei 12.318, art. 6º, estrutura as medidas em gradação (advertência → ampliação de convivência → multa → acompanhamento → alteração da guarda...), proporcional à gravidade. Saltar para a inversão, com prova ambígua e estudo técnico recomendando o contrário, seria punir a criança para disciplinar os adultos." },
            proxima: "g6" },

          { rotulo: "Deferir a inversão liminar da guarda em favor do pai",
            fundamento: "Resposta enérgica à alienação",
            efeitos: { tec: -12, hum: -8, tempo: 8 },
            carimbo: "GUARDA INVERTIDA",
            setFlags: { inversaoPrecipitada: true },
            reacoes: [
              { quem: "renata", emocao: "choro", texto: "Não... a senhora não pode... ela tem 8 anos, a vida dela inteira é comigo..." },
              { quem: "ana", emocao: "firme", texto: "Excelência, consigno que a medida contraria frontalmente a recomendação do estudo psicossocial, com risco à criança." },
              { quem: "beatriz", emocao: "firme", texto: "O Ministério Público recorrerá." }
            ],
            feedback: { acerto: "grave", titulo: "O último degrau usado primeiro",
              texto: "A inversão de guarda é a medida MAIS drástica do art. 6º da Lei 12.318 — reservada a quadros graves e comprovados. Aqui: prova ambígua e recíproca, estudo técnico recomendando lar de referência materno, criança em sofrimento. Inverter liminarmente é arrancar Sofia de sua rotina para vencer uma discussão entre adultos." },
            proxima: "g6" }
        ]
      }
    },

    g6: {
      falas: [
        { quem: "narrador", texto: "Fim da tarde de discussões. Os ânimos, gastos, baixaram um tom. Ana troca um olhar com você: a janela para o acordo está entreaberta." },
        { quem: "eduardo", emocao: "triste", texto: "Eu só quero estar presente, Excelência. Do jeito certo." },
        { quem: "renata", emocao: "triste", texto: "E eu só quero que ele cumpra o que promete. A Sofia espera na janela." }
      ],
      decisao: {
        prompt: "O momento de fechar. O que você propõe homologar?",
        opcoes: [
          { rotulo: "Encerrar sem acordo: designar continuação, com estudo complementar e convivência provisória escalonada",
            fundamento: "Instrução responsável quando a composição não amadureceu",
            efeitos: { tec: 6, cel: -4, tempo: 6 },
            carimbo: "INSTRUÇÃO CONTINUA",
            setFlags: { instrucaoContinua: true },
            feedback: { acerto: "bom", titulo: "Prudência também é decisão",
              texto: "Nem toda audiência fecha acordo — e forçar composição imatura gera descumprimento certo. Fixar convivência provisória escalonada e completar a prova é caminho tecnicamente sólido; custa tempo (a pauta sente), mas custa menos que um acordo natimorto." },
            proxima: function (f) {
              if (f.revitimizacao || f.inversaoPrecipitada) return "fim_ruim";
              return "fim_bom";
            } },

          { rotulo: "Plano de parentalidade completo: compartilhada, lar de referência materno, convivência escalonada cabendo na agenda real do pai, férias divididas, app de comunicação, acompanhamento de Sofia, cláusula de não desqualificação e revisão em 6 meses",
            fundamento: "CC, arts. 1.583/1.584; recomendações do estudo psicossocial; convivência compatível com a rotina provada",
            efeitos: { tec: 12, hum: 12, tempo: 14 },
            carimbo: "ACORDO HOMOLOGADO",
            setFlags: { acordoSofia: true },
            reacoes: [
              { quem: "eduardo", emocao: "feliz", texto: "Nos fins de semana que eu estiver na cidade, ela é minha. E eu assino o que prometer." },
              { quem: "renata", emocao: "feliz", texto: "Se está no papel, com data e hora... eu confio no papel." },
              { quem: "beatriz", emocao: "feliz", texto: "Parecer favorável do Ministério Público, Excelência." }
            ],
            feedback: { acerto: "otimo", titulo: "Sentença pacifica autos; acordo pacifica vidas",
              texto: "O plano traduz tudo o que os autos ensinaram: compartilhada como regra (art. 1.584, §2º), lar de referência materno e ampliação gradual (estudo técnico), calendário que cabe nas viagens do pai (a causa real dos descumprimentos), canal de comunicação que tira Sofia do papel de mensageira e revisão marcada — porque plano de parentalidade é organismo vivo." },
            proxima: function (f) {
              if (f.revitimizacao) return "fim_ruim";
              return "fim_otimo";
            } },

          { rotulo: "Sentenciar de plano: guarda unilateral materna, visitas quinzenais padrão, próximo caso",
            fundamento: "A guarda fática já é materna; resolve-se logo",
            efeitos: { tec: -8, hum: -4, tempo: 4 },
            carimbo: "SENTENCIADO",
            reacoes: [
              { quem: "hugo", emocao: "firme", texto: "Apelaremos, Excelência. E consigno: a regra legal da guarda compartilhada foi afastada sem fundamentação." }
            ],
            feedback: { acerto: "ruim", titulo: "O atalho que volta pelo segundo grau",
              texto: "Afastar a guarda compartilhada — que é a regra do art. 1.584, §2º — exige fundamentação específica (inaptidão de um genitor ou manifestação de não a desejar), inexistente aqui. E o “visitas quinzenais padrão” ignora a agenda real provada nos autos. Decisão rápida, vida útil curta." },
            proxima: function (f) {
              if (f.revitimizacao) return "fim_ruim";
              return "fim_bom";
            } }
        ]
      }
    },

    fim_otimo: {
      fim: { selo: "otimo", titulo: "Duas casas em paz",
        texto: "No corredor, Sofia corre primeiro para a mãe — e depois mostra ao pai um desenho dobrado em quatro, guardado o dia inteiro no bolso. Eduardo agacha para receber. Ana observa de longe e anota algo no relatório: “prognóstico favorável”. Você respira. A pauta segue." }
    },
    fim_bom: {
      fim: { selo: "bom", titulo: "Processo encaminhado",
        texto: "Sem fecho de novela: o caso segue seu curso, com regras provisórias claras e prova por completar. As partes saem em silêncio — mas saem por portas separadas sem novos estilhaços. Em ações de família, isso já é meio caminho." }
    },
    fim_ruim: {
      fim: { selo: "ruim", titulo: "A audiência que Sofia não vai esquecer",
        texto: "Os adultos saem com seus advogados, suas razões e seus recursos. Sofia sai de mãos dadas com a avó, mais quieta do que entrou. O processo continuará — e algumas marcas deste dia, também." }
    }
  }
});
