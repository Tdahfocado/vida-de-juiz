/* ============================================================
   CASO 3 — "Som, Sombra e Cerca-Viva"
   Juizado Especial Cível · pauta das 14:00
   ------------------------------------------------------------
   Temas: princípios do JEC (Lei 9.099/95, art. 2º), partes sem
   advogado (art. 9º), pedido contraposto (art. 31), poder de
   polícia em audiência (CPC, art. 360), prova informal e
   direito de vizinhança (CC, arts. 1.277 e 1.282 a 1.284 —
   com a famosa pegadinha dos frutos caídos).
   ============================================================ */

window.TOGA = window.TOGA || {};
TOGA.casos = TOGA.casos || [];

TOGA.casos.push({
  id: "vizinhos",
  titulo: "Som, Sombra e Cerca-Viva",
  subtitulo: "Oficina barulhenta de um lado, mangueira invasora do outro — e nenhum advogado na sala.",
  area: "Juizado Especial Cível",
  hora: "14:00",
  duracaoPrevistaMin: 60,
  tensao: 5,

  personagens: [
    { id: "anisio", nome: "Sr. Anísio", papel: "Autor", assento: "esq1",
      avatar: { pele: "#d8a87f", cabelo: "calvo", corCabelo: "#b9b3a6", traje: "camisa", corTraje: "#6a5a3a", oculos: true } },
    { id: "jorge", nome: "Jorge", papel: "Réu", assento: "dir1",
      avatar: { pele: "#c98e66", cabelo: "curto", corCabelo: "#241a10", traje: "camisa", corTraje: "#3a5a6a", barba: true } },
    { id: "dalva", nome: "D. Dalva", papel: "Informante", assento: "centro",
      avatar: { pele: "#e8c49c", cabelo: "coque", corCabelo: "#8a8378", traje: "vestido", corTraje: "#7a5a6a" } }
  ],

  autos: {
    resumo: "Anísio (aposentado) pede que cesse o barulho da oficina e dos churrascos de Jorge, com R$ 10 mil de danos morais. Jorge contra-ataca: a mangueira de Anísio invade seu telhado e entope a calha — pede poda e R$ 5 mil. Ambos sem advogado (valor dentro de 20 salários — Lei 9.099, art. 9º). Dona Dalva, vizinha dos dois, está na sala.",
    pecas: [
      { id: "inicial", titulo: "Reclamação inicial (atermação)",
        texto: "ANÍSIO, aposentado, 71 anos, reclama: a oficina de motos de JORGE funciona com lixadeira e teste de escapamento “de manhã até a noite” e, nos fins de semana, churrascos com caixa de som varam a madrugada. Pede: cessação do barulho e R$ 10.000,00 de danos morais. (Reduzido a termo na forma do art. 14, §3º, da Lei 9.099/95.)" },
      { id: "contraposto", titulo: "Pedido contraposto (art. 31)",
        texto: "JORGE, em audiência de conciliação anterior (infrutífera), formulou PEDIDO CONTRAPOSTO: a mangueira do autor avança sobre seu telhado; frutos caem e apodrecem na laje, e a calha entupiu duas vezes — junta fotos e recibo de R$ 380,00 do calheiro. Pede a poda e R$ 5.000,00." },
      { id: "medicoes", titulo: "Medições por aplicativo",
        texto: "Capturas de tela de aplicativo de celular (decibelímetro): 78 dB às 23h12 de um sábado; 81 dB às 00h40 de um domingo. Observação do app: “medição sem calibração profissional — valores aproximados”." },
      { id: "bo", titulo: "Boletim de ocorrência",
        texto: "Registro de discussão acalorada na calçada entre as partes, com ameaças MÚTUAS (“vou resolver isso do meu jeito” / “aparece aqui de novo pra você ver”). Sem lesões. PM orientou as partes a procurarem o Juizado." },
      { id: "abaixo", titulo: "Abaixo-assinado",
        texto: "Onze vizinhos assinam reclamando do barulho noturno da oficina e dos churrascos. Dois vizinhos assinaram coluna à parte, EM DEFESA de Jorge: “rapaz trabalhador, gente boa, só gosta de um churrasco”." }
    ]
  },

  focos: [
    { id: "f_db", rotulo: "As medições e seus limites", dica: "Número sem método vale o quê? Pense em como CORROBORAR a prova informal — talvez com quem está na sala." },
    { id: "f_arvore", rotulo: "A mangueira no Código Civil", dica: "Arts. 1.282 a 1.284 do CC: há uma surpresa sobre quem é o dono das mangas caídas." },
    { id: "f_bo", rotulo: "Ânimos à flor da pele", dica: "Houve ameaças mútuas fora daqui. Planeje a contenção ANTES de a sala ferver." },
    { id: "f_abaixo", rotulo: "O quarteirão inteiro", dica: "Onze contra, dois a favor: o conflito é coletivo — o acordo precisa caber na vizinhança." }
  ],

  arco: {
    antes: { emocao: "raiva" },
    depois: [
      { se: function (f) { return !!f.pazVizinhos; }, tom: "bom", gesto: "abraco",
        falas: [
          { quem: "anisio", emocao: "feliz", texto: "Doutor, trinta anos de muro e bastou uma tarde de conversa com juiz no meio. O Jorge vai me ensinar a mexer naquele aplicativo de música — baixinho, garantiu ele." },
          { quem: "jorge", emocao: "feliz", texto: "E as mangas da divisa esse ano são meio a meio, Excelência. Tem uma sacola separada para o senhor — sem processo, prometo." }
        ] },
      { se: function (f) { return !!f.acordoFrouxo; }, tom: "grave",
        falas: [
          { quem: "anisio", emocao: "raiva", texto: "'Acordo de palavra', doutor? Pois a palavra durou um sábado. O som voltou, o muro continua, e eu voltei pra fila da atermação. Perdemos todos a viagem." }
        ] }
    ]
  },

  vidasTocadas: [
    { se: "pazVizinhos", tom: "bom",
      texto: "Trinta anos de cerca viva deixaram de ser trincheira: as mangas da divisa agora são meio a meio." },
    { se: "acordoFrouxo", tom: "grave",
      texto: "O acordo de palavra não sobreviveu ao primeiro sábado — e a frustração voltou para a fila do Juizado." }
  ],

  inicio: "v1",
  cenas: {

    v1: {
      falas: [
        { quem: "narrador", texto: "14h00. Sem advogados, sem becas além da sua: só dois vizinhos que não se olham e D. Dalva, convocada como informante, abanando-se com o próprio chapéu." },
        { quem: "anisio", emocao: "raiva", texto: "Boa tarde, doutor. Trinta e um anos naquela casa. Trinta e um. Nunca precisei de Justiça até esse cidadão chegar." },
        { quem: "jorge", emocao: "raiva", texto: "O cidadão tem nome e trabalha, viu, doutor?" }
      ],
      decisao: {
        prompt: "Audiência de juizado, partes sem advogado. Como você abre?",
        opcoes: [
          { rotulo: "Abertura formalista: “limitem-se a responder ao que for perguntado, sob as penas da lei”",
            fundamento: "Disciplina preventiva",
            efeitos: { hum: -6, tempo: 3 },
            carimbo: "ADVERTÊNCIA PRÉVIA",
            reacoes: [
              { quem: "anisio", emocao: "medo", texto: "Penas...? Eu que vim reclamar, posso ser penalizado?" }
            ],
            feedback: { acerto: "ruim", titulo: "Formalismo onde a lei pediu simplicidade",
              texto: "Intimidar logo na abertura contraria a alma do JEC (art. 2º): pessoas sem advogado precisam entender o ato, não temê-lo. Ameaça difusa de “penas da lei” só fabrica silêncio — e silêncio não concilia." },
            proxima: "v2" },

          { rotulo: "Ler em voz alta a íntegra das peças antes de qualquer fala das partes",
            fundamento: "Garantir ciência integral",
            efeitos: { tec: -2, tempo: 12 },
            carimbo: "RELATÓRIO LIDO",
            feedback: { acerto: "ruim", titulo: "Doze minutos que a pauta não tinha",
              texto: "No rito da Lei 9.099 dispensa-se até o relatório na sentença (art. 38); ler a íntegra das peças em voz alta consome a tarde sem agregar nada — as partes escreveram as peças, lembra? Resumo de um minuto bastava." },
            proxima: "v2" },

          { rotulo: "Abertura simples e acolhedora: explicar como funciona o Juizado e prometer que a conversa de hoje busca SOLUÇÃO, não vencedor",
            fundamento: "Lei 9.099/95, art. 2º — oralidade, simplicidade, informalidade; juiz conduz diretamente (art. 9º)",
            efeitos: { hum: 8, tec: 4, tempo: 6 },
            carimbo: "SESSÃO ABERTA",
            reacoes: [
              { quem: "dalva", emocao: "feliz", texto: "Tá vendo? Eu disse que o doutor ia escutar nós." },
              { quem: "anisio", emocao: "neutro", texto: "..." }
            ],
            feedback: { acerto: "otimo", titulo: "O rito a serviço das pessoas",
              texto: "O Juizado foi desenhado para o cidadão sem advogado (art. 9º permite a postulação direta até 20 salários): oralidade, simplicidade, informalidade e busca da conciliação (art. 2º). Traduzir o rito em linguagem humana, logo na abertura, é aplicar a lei — e baixar dois tons da temperatura da sala." },
            proxima: "v2" }
        ]
      }
    },

    v2: {
      falas: [
        { quem: "jorge", emocao: "raiva", texto: "Doutor, vou resumir: esse velho caduco implica até com passarinho. Reclama do som, reclama da fumaça, reclama de gente feliz!" },
        { quem: "anisio", emocao: "raiva", texto: "Caduco é a tua oficina de fundo de quintal, seu playboy falido! Aquilo nem alvará deve ter!" },
        { quem: "narrador", texto: "D. Dalva se benze. Os dois estão de pé." }
      ],
      decisao: {
        prompt: "A sala ferveu. Poder de polícia da audiência — como você o exerce?",
        opcoes: [
          { rotulo: "Mandar retirar Jorge da sala imediatamente e ameaçar voz de prisão por desacato",
            fundamento: "Tolerância zero",
            efeitos: { tec: -8, imp: -6, tempo: 5 },
            carimbo: "PARTE RETIRADA",
            reacoes: [
              { quem: "jorge", emocao: "surpresa", texto: "Desacato?! Eu xinguei ELE, não o senhor!" }
            ],
            feedback: { acerto: "grave", titulo: "Resposta máxima ao primeiro estalo",
              texto: "Desacato pressupõe ofensa a funcionário no exercício da função — a ofensa aqui foi entre as partes. E retirar uma parte logo no primeiro excesso, sem advertência prévia, fere a gradação do poder de polícia (CPC, art. 360) e mutila a audiência: sem o réu na sala, concilia-se com quem?" },
            proxima: "v3" },

          { rotulo: "Advertência firme e serena a AMBOS, com a mão no martelo: respeito mútuo ou a audiência não continua",
            fundamento: "CPC, art. 360 — o juiz exerce o poder de polícia, mantendo a ordem e fazendo retirar quem a perturbe",
            efeitos: { tec: 6, imp: 4, hum: 4, tempo: 3 },
            carimbo: "ORDEM RESTABELECIDA",
            reacoes: [
              { quem: "jorge", emocao: "vergonha", texto: "Desculpa, doutor. Foi o calor da hora." },
              { quem: "anisio", emocao: "vergonha", texto: "Retiro o “playboy”. O “falido” eu sustento... retiro também, retiro." }
            ],
            feedback: { acerto: "otimo", titulo: "Autoridade sem autoritarismo",
              texto: "O art. 360 do CPC dá ao juiz o poder de polícia da audiência — que se exerce primeiro pela palavra firme e equânime, dirigida aos DOIS. A gradação importa: advertir antes de retirar, retirar antes de qualquer medida maior. Quem estudou o B.O. sabia que este momento viria." },
            proxima: "v3" },

          { rotulo: "Deixar que “desabafem” por alguns minutos antes de intervir",
            fundamento: "Catarse espontânea ajuda a conciliação",
            efeitos: { imp: -4, hum: -2, tempo: 10 },
            carimbo: "REGISTRADO",
            reacoes: [
              { quem: "narrador", texto: "O desabafo vira inventário de mágoas de uma década: a festa de 2019, o cachorro de 2021, o muro de 2023. Dez minutos se vão." }
            ],
            feedback: { acerto: "ruim", titulo: "Catarse sem direção é incêndio",
              texto: "Há técnica em deixar as partes falarem — com tempo delimitado, regras e mediação ativa. “Deixar rolar” é outra coisa: cada ofensa nova vira mais um item a superar no acordo. A condução é indelegável (CPC, art. 360; Lei 9.099, art. 5º)." },
            proxima: "v3" }
        ]
      }
    },

    v3: {
      falas: [
        { quem: "anisio", emocao: "firme", texto: "Doutor, tá tudo aqui no celular: 78 decibéis às onze da noite! 81 de madrugada! Medido pelo aplicativo!" },
        { quem: "jorge", emocao: "firme", texto: "Aplicativo de celular, doutor? Isso aí mede até fantasma. Cadê o perito?" }
      ],
      decisao: {
        prompt: "Prova técnica informal num rito que dispensa formalidades. O que fazer com as medições?",
        opcoes: [
          { rotulo: "Admitir as medições como simples indício, registrando suas limitações",
            fundamento: "Livre convencimento motivado",
            efeitos: { tec: 4, tempo: 4 },
            carimbo: "INDÍCIO ADMITIDO",
            feedback: { acerto: "bom", titulo: "Correto — e incompleto",
              texto: "Tratar a medição amadora como indício, explicitando os limites, é tecnicamente exato. Mas havia na sala uma testemunha equidistante pronta para corroborar (ou desmentir) — colhê-la na hora custava cinco minutos e blindava a decisão." },
            proxima: "v4" },

          { rotulo: "Exigir perícia formal de engenharia acústica antes de qualquer decisão",
            fundamento: "Rigor técnico pleno",
            efeitos: { tec: -4, cel: -8, tempo: 6 },
            carimbo: "PERÍCIA DETERMINADA",
            reacoes: [
              { quem: "anisio", emocao: "triste", texto: "Perícia? Isso demora quanto, doutor? Eu durmo quando, enquanto isso?" }
            ],
            feedback: { acerto: "ruim", titulo: "O rigor que expulsa a causa do Juizado",
              texto: "Cuidado conceitual: se a causa EXIGISSE perícia complexa, o caminho seria a extinção por incompatibilidade com o rito (Lei 9.099, art. 51, II) — não “determinar perícia formal” num procedimento que não a comporta. Mas ela não exige: ruído noturno residencial se demonstra por testemunhas, registros e regras de experiência. Exigir laudo de engenharia aqui é negar, na prática, o acesso que o JEC promete." },
            proxima: "v4" },

          { rotulo: "Valorar como indício E colher, agora, o depoimento de D. Dalva — vizinha equidistante presente na sala",
            fundamento: "Lei 9.099, arts. 5º e 32-33 (liberdade probatória e poderes instrutórios); livre convencimento motivado",
            requerFoco: "f_db",
            efeitos: { tec: 8, cel: 4, tempo: 8 },
            carimbo: "PROVA VALORADA",
            setFlags: { provaSolida: true },
            reacoes: [
              { quem: "dalva", emocao: "firme", texto: "Vou dizer a verdade dos dois lados, doutor: o barulho do Jorge de noite passa do ponto, passa. Agora, a mangueira do Anísio... aquilo é uma floresta em cima da laje do menino." },
              { quem: "jorge", emocao: "surpresa", texto: "Olha aí! Até a Dalva!" }
            ],
            feedback: { acerto: "otimo", titulo: "Prova informal + corroboração = convicção",
              texto: "No JEC vigora ampla liberdade probatória (Lei 9.099, arts. 32 e 33) e o juiz dirige a instrução com liberdade (art. 5º). O app, sozinho, é frágil (sem calibração); somado ao abaixo-assinado e ao depoimento equidistante de D. Dalva — que você teve a presença de espírito de aproveitar na sala — forma um conjunto robusto sob o livre convencimento motivado. E ela ainda iluminou o pedido contraposto." },
            proxima: "v4" },

          { rotulo: "Desconsiderar os prints: “papel de aplicativo não grita de madrugada”",
            fundamento: "Imprestabilidade técnica absoluta",
            efeitos: { tec: -6, tempo: 2 },
            carimbo: "PROVA DESCARTADA",
            feedback: { acerto: "ruim", titulo: "Nem tudo ou nada",
              texto: "Entre a fé cega no app e o descarte total existe o meio jurídico correto: indício, valorado em conjunto (abaixo-assinado, testemunha, regras de experiência — CPC, art. 375). Descartar de plano empobrece a instrução sem necessidade." },
            proxima: "v4" }
        ]
      }
    },

    v4: {
      falas: [
        { quem: "jorge", emocao: "firme", texto: "E a mangueira, doutor? Cai manga podre na minha laje o ano inteiro. Entupiu a calha duas vezes — tá aí o recibo. Eu podei um galho uma vez e ele chamou a POLÍCIA." },
        { quem: "anisio", emocao: "raiva", texto: "Porque as mangas são MINHAS! A árvore é minha, o que nasce nela é meu! Ele estava FURTANDO." }
      ],
      decisao: {
        prompt: "A questão da árvore limítrofe. Quem tem razão — e como você explica?",
        opcoes: [
          { rotulo: "Decidir que a árvore é do autor e, portanto, só ELE pode autorizar qualquer poda",
            fundamento: "Direito de propriedade sobre a árvore e seus frutos",
            efeitos: { tec: -6, tempo: 4 },
            carimbo: "PODA CONDICIONADA",
            feedback: { acerto: "ruim", titulo: "Exatamente o contrário da lei",
              texto: "O art. 1.283 do CC diz o oposto: ramos e raízes que ultrapassam a divisa PODEM ser cortados pelo dono do terreno invadido, até o plano divisório, sem pedir licença. E os frutos caídos no quintal de Jorge são de Jorge (art. 1.284). A decisão consagra o erro que alimentou a briga por anos." },
            proxima: "v5" },

          { rotulo: "Empurrar o tema: “a árvore vocês resolvem entre si depois; hoje é só o barulho”",
            fundamento: "Foco no pedido principal",
            efeitos: { tec: -4, hum: -4, tempo: 2 },
            carimbo: "TEMA ADIADO",
            feedback: { acerto: "ruim", titulo: "O pedido contraposto também é pedido",
              texto: "O pedido contraposto (Lei 9.099, art. 31) integra a lide e EXIGE julgamento — ignorá-lo é decisão citra petita. Pior: estrategicamente, a mangueira era a moeda de troca natural do acordo sobre o barulho. Você devolveu a chave junto com a fechadura." },
            proxima: "v5" },

          { rotulo: "Dar uma aula de 2 minutos: Jorge PODE cortar o que invade (art. 1.283) e as mangas caídas no quintal dele são DELE (art. 1.284) — e propor poda técnica rateada",
            fundamento: "CC, art. 1.283 (corte de ramos e raízes até o plano divisório) e art. 1.284 (frutos caídos em solo particular pertencem ao dono do solo)",
            requerFoco: "f_arvore",
            efeitos: { tec: 10, hum: 4, tempo: 6 },
            carimbo: "ARTS. 1.283 E 1.284, CC",
            setFlags: { arvoreResolvida: true },
            reacoes: [
              { quem: "anisio", emocao: "surpresa", texto: "Como assim as manga... são DELE?!" },
              { quem: "jorge", emocao: "feliz", texto: "Tá ouvindo, seu Anísio? Trinta anos me chamando de ladrão de manga!" },
              { quem: "dalva", emocao: "feliz", texto: "E eu fazendo doce escondida com peso na consciência..." }
            ],
            feedback: { acerto: "otimo", titulo: "A pegadinha clássica da vizinhança",
              texto: "Dois dispositivos que todo vizinho de mangueira deveria emoldurar: o art. 1.283 do CC autoriza o dono do terreno invadido a cortar, ele próprio, ramos e raízes até o plano vertical divisório; e o art. 1.284 manda que os frutos CAÍDOS em terreno particular pertencem ao dono do SOLO onde caíram — não ao dono da árvore. Anísio passou décadas juridicamente errado nos dois pontos. Explicado isso, a poda rateada deixa de ser concessão e vira evidência." },
            proxima: "v5" }
        ]
      }
    },

    v5: {
      falas: [
        { quem: "narrador", texto: "Com as regras na mesa, os dois se entreolham diferente — menos inimigos, mais vizinhos cansados." },
        { quem: "jorge", emocao: "neutro", texto: "Eu posso parar a lixadeira às seis. E churrasco... até as dez, com aviso. Mas a mangueira tem que ser podada direito." },
        { quem: "anisio", emocao: "neutro", texto: "Se ele cumprir... eu pago metade da poda. MAS QUERO MULTA se descumprir, doutor. Sem multa ele não respeita." }
      ],
      decisao: {
        prompt: "O acordo está a um martelo de distância. Como você o fecha?",
        opcoes: [
          { rotulo: "Acordo com multa PESADA: R$ 2.000 por episódio, “para nunca mais”",
            fundamento: "Efeito dissuasório máximo",
            efeitos: { tec: -4, tempo: 8 },
            carimbo: "ACORDO HOMOLOGADO",
            setFlags: { acordoDesproporcional: true },
            reacoes: [
              { quem: "jorge", emocao: "medo", texto: "Dois mil?! Um churrasco que passar dez minutos das dez e eu perco o mês, doutor?" }
            ],
            feedback: { acerto: "ruim", titulo: "A multa que volta como processo",
              texto: "Cláusula penal desproporcional gera dois efeitos previsíveis: a parte assina sem intenção de honrar (assimetria entre a falta e a pena) e, no primeiro episódio, vem a ação revisional invocando o art. 413 do CC (redução equitativa da penalidade). Acordo bom é o que será CUMPRIDO — não o que assusta na assinatura." },
            proxima: function (f) { return "fim_bom"; } },

          { rotulo: "Acordo completo com multa MODERADA: oficina 8h–18h em dias úteis; som conforme a lei do silêncio após 22h; churrasco com aviso; poda técnica semestral rateada; retratações mútuas; R$ 200 por episódio de descumprimento",
            fundamento: "Lei 9.099, art. 22, parágrafo único — acordo homologado vale como título executivo; multa proporcional estimula cumprimento",
            efeitos: { tec: 10, hum: 8, tempo: 10 },
            carimbo: "ACORDO HOMOLOGADO",
            setFlags: { pazVizinhos: true },
            reacoes: [
              { quem: "jorge", emocao: "feliz", texto: "Fechado. E aparece lá no churrasco de sábado, seu Anísio. Antes das dez." },
              { quem: "anisio", emocao: "feliz", texto: "Se tiver farofa... eu penso." },
              { quem: "dalva", emocao: "feliz", texto: "Milagre no fórum, gente." }
            ],
            feedback: { acerto: "otimo", titulo: "Multa que educa, não que estrangula",
              texto: "Acordo homologado é sentença com força de título executivo (Lei 9.099, art. 22, parágrafo único; art. 57). A cláusula penal em R$ 200/episódio é alta o bastante para doer e baixa o bastante para ser efetivamente executada — multas desproporcionais convidam a novo litígio sobre a própria multa. As retratações mútuas registradas em ata fecham, de quebra, o capítulo das ofensas." },
            proxima: function (f) { return "fim_otimo"; } },

          { rotulo: "Acordo sem multa nenhuma: “a palavra de vocês basta”",
            fundamento: "Confiança restaurada dispensa sanção",
            efeitos: { tec: -3, tempo: 6 },
            carimbo: "ACORDO HOMOLOGADO",
            setFlags: { acordoFrouxo: true },
            feedback: { acerto: "ruim", titulo: "Romantismo executivo",
              texto: "Depois de B.O. com ameaças mútuas e anos de atrito, acordo sem cláusula de descumprimento é carta de intenções: no primeiro sábado de recaída, Anísio volta ao balcão do Juizado — agora com a frustração extra do acordo furado. A multa moderada não é desconfiança: é arquitetura de incentivo." },
            proxima: function (f) { return "fim_bom"; } },

          { rotulo: "Sem acordo: encerrar a conciliação e SENTENCIAR agora, na própria audiência",
            fundamento: "Lei 9.099, arts. 28-29 — audiência una: instruído o feito, julga-se",
            efeitos: { tec: 2, tempo: 6 },
            carimbo: "CONCLUSO PARA SENTENÇA",
            feedback: { acerto: "bom", titulo: "O rito permite — e às vezes convém",
              texto: "No JEC, a audiência é una: colhida a prova, a sentença pode (e deve) sair na hora (arts. 28 e 29). Quando o acordo não amadurece, sentenciar de imediato honra a celeridade. Agora é acertar o conteúdo." },
            proxima: "v6" }
        ]
      }
    },

    v6: {
      falas: [
        { quem: "narrador", texto: "Silêncio na sala. As partes esperam. Você puxa o teclado para perto: sentença oral, registrada no termo." }
      ],
      decisao: {
        prompt: "O dispositivo da sua sentença:",
        opcoes: [
          { rotulo: "Procedência total do autor: R$ 10 mil de danos morais e fechamento da oficina aos fins de semana; improcedência do contraposto",
            fundamento: "Tutela enérgica do sossego",
            efeitos: { tec: -8, tempo: 6 },
            carimbo: "PROCEDENTE",
            reacoes: [
              { quem: "jorge", emocao: "raiva", texto: "Dez mil e minha oficina pela metade? Vou recorrer nem que venda a moto." }
            ],
            feedback: { acerto: "ruim", titulo: "Desequilíbrio anunciado",
              texto: "A sentença ignora o pedido contraposto comprovado (fotos, recibo do calheiro, confissão do próprio autor sobre a árvore) — julgamento citra petita — e fixa dano moral em patamar destoante para perturbação de sossego sem repercussões graves demonstradas. A Turma Recursal agradece o serviço." },
            proxima: function (f) { return "fim_ruim"; } },

          { rotulo: "Procedência PARCIAL recíproca: limites de horário e ruído conforme a postura municipal + poda às expensas divididas + multa diária moderada + danos morais de parte a parte AFASTADOS (dissabores recíprocos)",
            fundamento: "CC, arts. 1.277, 1.283 e 1.284; Lei 9.099, arts. 31 e 38; proporcionalidade",
            efeitos: { tec: 8, tempo: 8 },
            carimbo: "PROCEDENTE EM PARTE",
            setFlags: { sentencaEquilibrada: true },
            reacoes: [
              { quem: "anisio", emocao: "neutro", texto: "Quer dizer que ninguém ganhou tudo." },
              { quem: "jorge", emocao: "neutro", texto: "E ninguém perdeu tudo. Dava pra ter combinado isso sem juiz..." }
            ],
            feedback: { acerto: "otimo", titulo: "Sentença que desenha a convivência",
              texto: "Julgamento simultâneo de pedido e contraposto (art. 31), obrigações de fazer específicas e fiscalizáveis, astreintes calibradas e a recusa de transformar dissabores recíprocos de vizinhança em indenização (ofensas mútuas se compensam no plano moral — quem xinga e é xingado não lucra com isso). Fundamentação sucinta, como o art. 38 permite. É a sentença que um acordo bom teria sido." },
            proxima: function (f) { return "fim_sentenca"; } },

          { rotulo: "Improcedência total de ambos: “briga de vizinho não é caso de Justiça”",
            fundamento: "Bagatela e autocomposição social",
            efeitos: { tec: -10, hum: -8, tempo: 4 },
            carimbo: "IMPROCEDENTE",
            reacoes: [
              { quem: "anisio", emocao: "triste", texto: "Então eu durmo com tampão até morrer, é isso, doutor?" }
            ],
            feedback: { acerto: "ruim", titulo: "A porta fechada na cara de quem o JEC convidou",
              texto: "O Juizado existe PARA isto: o conflito miúdo e cotidiano que corrói a vida das pessoas comuns (Lei 9.099, arts. 2º e 3º). Havia prova de uso anormal da propriedade (CC, art. 1.277) e de invasão arbórea (arts. 1.283-1.284). Chamar de “briga de vizinho” o que a lei chama de lide é denegação de jurisdição com outro nome." },
            proxima: function (f) { return "fim_ruim"; } }
        ]
      }
    },

    fim_otimo: {
      fim: { selo: "otimo", titulo: "Paz no quarteirão",
        texto: "Os dois saem CONVERSANDO — sobre poda, farofa e a Copa do bairro. D. Dalva para na porta, vira-se para a bancada e faz um pequeno aceno solene, como quem condecora. Há acordos que valem mais que jurisprudência." }
    },
    fim_bom: {
      fim: { selo: "bom", titulo: "Acordo com arestas",
        texto: "Houve aperto de mãos — protocolar, sem calor. O termo está assinado e tem força de título executivo; se ele vai segurar a paz do quarteirão, o próximo sábado de churrasco dirá. Você anota mentalmente conferir o sistema na semana que vem." }
    },
    fim_sentenca: {
      fim: { selo: "bom", titulo: "Sentença na hora",
        texto: "Sentença oral, registro no termo, vias entregues: o Juizado funcionando como prometido em 1995. Não houve abraço — mas houve regra clara, exequível e imediata. Às vezes, é exatamente disso que a vizinhança precisa." }
    },
    fim_ruim: {
      fim: { selo: "ruim", titulo: "Saíram piores do que entraram",
        texto: "Anísio sai resmungando sobre recurso; Jorge, fotografando o termo para “o advogado que vou arrumar agora”. O conflito não morreu — só mudou de instância. E D. Dalva, na saída, devolve o aceno que não fez." }
    }
  }
});
