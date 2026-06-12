/* ============================================================
   CASO: TRIBUNAL DO JÚRI — PLENÁRIO — "O processo de Iracema"
   ------------------------------------------------------------
   Sessão plenária de feminicídio presidida pelo jogador. O réu,
   ex-companheiro da vítima, tem histórico de medidas protetivas
   descumpridas. A defesa — tecnicamente competente — tentará
   julgar a vida da vítima no lugar do fato. O alvo pedagógico é
   a PRESIDÊNCIA: conter o abuso sem cercear a defesa.

   Fundamentos centrais: CPP, arts. 400-A e 474-A (Lei 14.245/2021,
   "Lei Mariana Ferrer"), 483 e 484 (quesitação), 497 (atribuições
   do presidente); Protocolo para Julgamento com Perspectiva de
   Gênero (obrigatório por força da Res. CNJ 492/2023); CP, art.
   121, §2º, VI, e §7º, III (à época dos fatos; hoje o tipo
   autônomo é o art. 121-A, Lei 14.994/2024, irretroativa);
   CF, arts. 5º, XXXVIII e LX, e 93, IX.
   ============================================================ */

window.TOGA = window.TOGA || {};
TOGA.casos = TOGA.casos || [];

TOGA.casos.push({
  id: "feminicidio",
  titulo: "Plenário — O processo de Iracema",
  subtitulo: "Sete jurados, a imprensa, a memória de uma mulher. Você preside.",
  area: "Tribunal do Júri — Plenário",
  hora: "09:00",
  duracaoPrevistaMin: 300,
  tensao: 12,
  sala: "juri",

  personagens: [
    { id: "zuleide", nome: "Zuleide", papel: "Testemunha — vizinha", assento: "centro",
      avatar: { pele: "#c98e66", cabelo: "longo", corCabelo: "#241505", traje: "camisa", corTraje: "#6a5a3a" } },
    { id: "veridiana", nome: "Dra. Veridiana", papel: "Promotora", assento: "esq1",
      avatar: { pele: "#d8a87f", cabelo: "coque", corCabelo: "#241a10", traje: "blazer", corTraje: "#33424f", corBlusa: "#efe5c8" } },
    { id: "raimunda", nome: "D. Raimunda", papel: "Mãe da vítima — assistente de acusação", assento: "esq2",
      avatar: { pele: "#a86a48", cabelo: "coque", corCabelo: "#8a8378", traje: "vestido", corTraje: "#3a3a3e" } },
    { id: "nazario", nome: "Dr. Nazário", papel: "Advogado", assento: "dir1",
      avatar: { pele: "#e8c39a", cabelo: "curto", corCabelo: "#6a6258", traje: "terno", corTraje: "#2b2b30", corGravata: "#5a5a5a", oculos: true } },
    { id: "valter", nome: "Valter", papel: "Réu", assento: "dir2", preso: true,
      avatar: { pele: "#d8a87f", cabelo: "curto", corCabelo: "#241a10", traje: "camisa", corTraje: "#5a5a5a", barba: true } },
    { id: "tunico", nome: "Tunico", papel: "Repórter", assento: "dir3",
      avatar: { pele: "#c98e66", cabelo: "curto", corCabelo: "#3a2a1a", traje: "camisa", corTraje: "#3f4f5a", oculos: true, barba: true } }
  ],

  autos: {
    resumo: "Sessão plenária do Tribunal do Júri. VALTER, pronunciado por feminicídio contra IRACEMA — 34 anos, técnica de enfermagem, mãe de dois —, será julgado por sete jurados sob a sua presidência. Histórico de medidas protetivas descumpridas. Plenário lotado, imprensa requerendo captação, e a mãe da vítima, D. Raimunda, habilitada como assistente de acusação (CPP, art. 268). A defesa é tecnicamente competente — e o requerimento que fez na fase do art. 422 anuncia a estratégia. Quem garante que o julgamento seja sobre o FATO é o presidente: você.",
    pecas: [
      { id: "pronuncia", titulo: "Decisão de pronúncia (resumo)",
        texto: "VALTER é submetido a julgamento pelo Tribunal do Júri como incurso no art. 121, §2º, VI, do Código Penal — homicídio qualificado por razões da condição do sexo feminino —, com a causa de aumento do art. 121, §7º, III, porque, em março de 2024, na residência da vítima, teria causado a morte de IRACEMA, 34 anos, técnica de enfermagem, sua ex-companheira, na presença física dos dois filhos do casal, de 7 e 10 anos. A materialidade está comprovada pelo laudo necroscópico, cujas conclusões a pronúncia refere sem transcrever — a descrição é desnecessária ao juízo de admissibilidade. Nota de precisão temporal: os fatos são anteriores à Lei 14.994/2024, que transformou o feminicídio em tipo penal autônomo (CP, art. 121-A, pena de 20 a 40 anos); por se tratar de lei mais gravosa, não retroage (CF, art. 5º, XL; CP, art. 2º) — aplica-se a qualificadora do art. 121, §2º, VI, vigente à época." },
      { id: "protetivas", titulo: "Histórico de medidas protetivas",
        texto: "Certidão do Juizado de Violência Doméstica: três medidas protetivas de urgência deferidas em favor de IRACEMA contra VALTER (Lei 11.340/2006, art. 22, III — proibição de aproximação e de contato), em maio, agosto e novembro de 2023. Registros de descumprimento: sete. O carro estacionado na esquina por horas, as mensagens partindo de números sempre novos, a espera na porta do plantão do hospital. Em janeiro de 2024, VALTER foi preso em flagrante pelo crime do art. 24-A da Lei Maria da Penha (descumprimento de medida protetiva) e solto mediante cautelares diversas. O descumprimento não era evento isolado: era escalada — e os autos a documentam, mês a mês, até março." },
      { id: "provas", titulo: "Rol e resumo da prova admitida",
        texto: "Prova admitida para o plenário: (i) testemunha ZULEIDE, vizinha da vítima por onze anos, sobre o histórico de violência e os descumprimentos; (ii) laudo necroscópico e laudo de local, REFERIDOS — as conclusões técnicas confirmam materialidade e dinâmica, dispensada a exibição de imagens em plenário; (iii) boletins de ocorrência e autos das três protetivas; (iv) interrogatório do réu. Requerimento da defesa na fase do art. 422 do CPP, deferido em parte: inquirir a testemunha sobre a vida afetiva da vítima após a separação e sobre os locais que a vítima frequentava à noite — o juízo da preparação ressalvou, expressamente, que a pertinência seria controlada EM PLENÁRIO, pelo presidente, à luz do art. 400-A do CPP." },
      { id: "imprensa", titulo: "Requerimento da imprensa",
        texto: "Requerimento conjunto da TV Comarca e do portal Gazeta: autorização para captação de imagem e som de toda a sessão, inclusive dos jurados e da família, com transmissão em tempo real. Justificativa: “o caso mobiliza a cidade e a população tem o direito de acompanhar o julgamento”. Nota da secretaria: o plenário está lotado desde as 7h40; há fila na escadaria e duas equipes de reportagem no corredor. A decisão sobre a captação é do juiz presidente (CPP, art. 497, I)." }
    ]
  },

  focos: [
    { id: "f_400a", rotulo: "A linha que a defesa vai cruzar",
      dica: "O requerimento do art. 422 anuncia a estratégia. Lei 14.245/2021 (Lei Mariana Ferrer): CPP, arts. 400-A e 474-A — o que o presidente faz quando perguntarem da roupa, e não do fato.",
      grifos: [{ peca: "provas", trecho: "a vida afetiva da vítima após a separação" },
               { peca: "provas", trecho: "a pertinência seria controlada EM PLENÁRIO" }] },
    { id: "f_protocolo", rotulo: "Julgar com perspectiva de gênero",
      dica: "Resolução CNJ 492/2023: o Protocolo é de observância obrigatória. Estereótipo não é prova — e neutralizá-lo é dever do juiz, não favor à acusação.",
      grifos: [{ peca: "protetivas", trecho: "O descumprimento não era evento isolado: era escalada" },
               { peca: "protetivas", trecho: "a espera na porta do plantão do hospital" }] },
    { id: "f_quesitos", rotulo: "Os quesitos do art. 483",
      dica: "Materialidade, autoria, absolvição genérica, qualificadora, causa de aumento — nesta ordem, e EXPLICADOS (CPP, art. 484, parágrafo único). A Súmula 156 do STF não perdoa quesitação malfeita.",
      grifos: [{ peca: "pronuncia", trecho: "razões da condição do sexo feminino" },
               { peca: "pronuncia", trecho: "na presença física dos dois filhos do casal" }] },
    { id: "f_497", rotulo: "A polícia da sessão",
      dica: "Plenário lotado, imprensa, galeria exaltada. CPP, art. 497: quem preside responde pela ordem — com a medida certa, nem omissa nem extrema.",
      grifos: [{ peca: "imprensa", trecho: "inclusive dos jurados e da família" },
               { peca: "imprensa", trecho: "A decisão sobre a captação é do juiz presidente" }] }
  ],

  /* ---------- arco emocional ---------- */
  arco: {
    antes: { emocao: "triste", gesto: "angustia" },
    depois: [
      { se: function (f) { return f.feminicidioCondenado && !f.condenacaoComVicios; }, tom: "bom", gesto: "abraco",
        falas: [
          { quem: "raimunda", emocao: "choro", texto: "Doutor... eu enterrei minha filha duas vezes: no cemitério e no que falaram dela depois. Hoje o nome da minha filha saiu limpo daquela sala. Era a última coisa que eu ainda podia dar a ela." },
          { quem: "zuleide", emocao: "feliz", texto: "Ela me pediu: “Zu, se um dia eu sumir, conta o que tu ouvia”. Eu contei, doutor. E dessa vez deixaram a história dela inteira — do jeito que ela viveu, não do jeito que tentaram contar." }
        ] },
      { se: function (f) { return f.feminicidioCondenado && !!f.condenacaoComVicios; }, tom: "neutro",
        falas: [
          { quem: "raimunda", emocao: "triste", texto: "Condenaram, doutor. Eu devia estar aliviada. Mas o advogado saiu do salão dizendo que a ata trabalha para ele agora... Quanto tempo isso ainda vai durar?" }
        ] },
      { se: function (f) { return !!f.absolvicaoContaminada; }, tom: "grave",
        falas: [
          { quem: "raimunda", emocao: "choro", texto: "Eu ouvi o que perguntaram da roupa dela, doutor. E ouvi o silêncio de quem podia fazer parar. A minha filha foi julgada no lugar dele — e perdeu." }
        ] }
    ]
  },

  vidasTocadas: [
    { se: "feminicidioCondenado", tom: "bom",
      texto: "Os dois filhos de Iracema vão crescer com uma sentença dizendo, em nome do Estado, de quem foi a culpa — e de quem nunca foi." },
    { se: "imprensaDisciplinada", tom: "bom",
      texto: "A cobertura mostrou a sessão sem mostrar rostos: os sete jurados voltaram para casa a pé, sem escolta — e dormiram." },
    { se: "absolvicaoContaminada", tom: "grave",
      texto: "A foto da formatura de Iracema voltou para a bolsa da mãe. Não voltou, até hoje, para a parede da sala." },
    { se: "omissaoPlenario", tom: "grave",
      texto: "Zuleide saiu do plenário respondendo sobre as roupas da amiga morta. A vizinhança inteira aprendeu, com ela, o que custa testemunhar." }
  ],

  inicio: "p1",
  cenas: {

    /* ---------- INSTALAÇÃO DA SESSÃO ---------- */
    p1: {
      falas: [
        { quem: "narrador", texto: "09h00. O Salão do Júri não tem mais lugar em pé. Na primeira fila, D. Raimunda segura contra o peito uma foto pequena, de moldura de papelão — Iracema de uniforme branco, no dia da formatura do curso técnico. Sete jurados acabam de ser sorteados; o réu, trazido pela escolta, ocupa o seu lugar." },
        { quem: "narrador", texto: "Você se levanta e profere a exortação do art. 472 do CPP, e as palavras enchem o salão: “Em nome da lei, concito-vos a examinar esta causa com imparcialidade e a proferir a vossa decisão de acordo com a vossa consciência e os ditames da justiça.” Um a um, os sete respondem: “Assim o prometo.”" },
        { quem: "tunico", emocao: "firme", texto: "Excelência, antes do pregão: a TV Comarca e a Gazeta reiteram o requerimento — captação de imagem e som da sessão inteira. Jurados, partes, plateia. A cidade parou por este julgamento; a população tem o direito de ver." },
        { quem: "nazario", emocao: "firme", texto: "A defesa se opõe à exposição dos jurados, Excelência. Jurado filmado é jurado pressionado — e veredicto pressionado não vale o papel da ata." },
        { quem: "veridiana", emocao: "firme", texto: "O Ministério Público vai na direção oposta, Excelência: requer a transmissão INTEGRAL — e que a cidade veja o rosto de quem responde por feminicídio. Quem matou diante dos filhos não tem direito à penumbra." }
      ],
      decisao: {
        prompt: "O requerimento da imprensa está sobre a bancada. A sessão começa pela sua decisão.",
        opcoes: [
          { rotulo: "Deferir a captação irrestrita: a sessão é pública e a cidade tem o direito de ver cada rosto",
            fundamento: "CF, art. 93, IX — publicidade dos julgamentos",
            efeitos: { tec: -6, imp: -4, hum: -4, tempo: 6 },
            carimbo: "CAPTAÇÃO LIVRE",
            setFlags: { viciosRegistrados: true },
            reacoes: [
              { quem: "narrador", texto: "A câmera varre a bancada dos jurados em close. Um deles abaixa a cabeça; outro afrouxa o colarinho. D. Raimunda vira o rosto quando a lente a encontra." },
              { quem: "veridiana", emocao: "neutro", texto: "Era o que a sociedade pedia, Excelência. O Ministério Público nada opõe." },
              { quem: "nazario", emocao: "firme", texto: "Consigne-se: jurados identificáveis em transmissão pública, sob protesto da defesa. Cada close de hoje é uma página da apelação de amanhã, Excelência." }
            ],
            feedback: { acerto: "ruim", titulo: "Publicidade não é exposição",
              texto: "A publicidade dos julgamentos (CF, art. 93, IX) convive com a proteção da intimidade (CF, art. 5º, LX) — e, no júri, com algo mais delicado: a serenidade de quem vota sob sigilo (CF, art. 5º, XXXVIII, b), mas julga de rosto exposto se você permitir. Jurado que teme a câmera decide olhando para ela. O poder de polícia do art. 497, I, do CPP existia exatamente para conciliar: sessão visível, pessoas protegidas. A defesa acaba de ganhar, de graça, sua primeira tese — e repare: a parte que aplaudiu a decisão não é a que pagará a conta da nulidade." },
            proxima: "p2" },

          { rotulo: "Indeferir e excluir a imprensa do salão: caso desta gravidade se julga sem câmeras",
            fundamento: "Preservação da serenidade do julgamento",
            efeitos: { tec: -8, imp: -6, tempo: 8 },
            carimbo: "IMPRENSA EXCLUÍDA",
            setFlags: { viciosRegistrados: true },
            reacoes: [
              { quem: "tunico", emocao: "raiva", texto: "A emissora impetra mandado de segurança ainda hoje, Excelência. E a manchete da noite deixa de ser sobre o caso — passa a ser sobre o senhor." },
              { quem: "veridiana", emocao: "neutro", texto: "O Ministério Público consigna, com respeito: a restrição total à publicidade exige fundamento que esta decisão não declinou." }
            ],
            feedback: { acerto: "grave", titulo: "A regra é a porta aberta",
              texto: "A Constituição é expressa em dose dupla: todos os julgamentos são públicos (art. 93, IX) e a restrição é EXCEÇÃO, que só se admite fundamentadamente para defesa da intimidade ou do interesse social (art. 5º, LX) — nunca para o conforto do juízo. Banir a imprensa de um feminicídio de repercussão inverte o interesse público em segredo e desprotege justamente a memória da vítima, que a sociedade tem o direito de ver julgada com seriedade. O instrumento correto era disciplinar, não fechar: a diferença entre o art. 497, I, e a censura." },
            proxima: "p2" },

          { rotulo: "Disciplinar a captação: imagem e som institucionais, câmera em tripé fixo, VEDADOS os rostos dos jurados e da família — limites consignados em ata",
            fundamento: "CF, art. 93, IX, c/c art. 5º, LX; CPP, art. 497, I — poder de polícia do presidente",
            efeitos: { tec: 8, imp: 6, hum: 4, tempo: 9 },
            carimbo: "CAPTAÇÃO DISCIPLINADA",
            setFlags: { imprensaDisciplinada: true },
            reacoes: [
              { quem: "tunico", emocao: "neutro", texto: "Tripé fixo, sem rostos de jurado nem da família... Dá para trabalhar, Excelência. A Gazeta agradece a previsibilidade." },
              { quem: "veridiana", emocao: "neutro", texto: "Consigne-se que a transmissão integral requerida pelo Ministério Público restou indeferida. ...Nada mais." },
              { quem: "nazario", emocao: "neutro", texto: "Nesses termos, a defesa nada opõe." },
              { quem: "narrador", texto: "D. Raimunda solta o ar devagar e volta a olhar para a frente. Na bancada, os sete jurados se acomodam — a câmera deixou de ser assunto." }
            ],
            feedback: { acerto: "otimo", titulo: "Publicidade com moldura",
              texto: "É o desenho constitucional aplicado com régua: a publicidade é da SESSÃO, não das pessoas. O art. 93, IX, garante o julgamento visível; o art. 5º, LX, autoriza a modulação que proteja a intimidade de quem não está em julgamento — jurados e família —; e o art. 497, I, do CPP entrega ao presidente o instrumento: a polícia das sessões. Captação institucional com limites em ata atende a imprensa, blinda o Conselho e poupa a mãe da vítima de virar imagem de repetição. Jurado protegido julga o fato — não a câmera." },
            proxima: "p2" }
        ]
      }
    },

    /* ---------- OITIVA DA TESTEMUNHA — A PRIMEIRA INVESTIDA ---------- */
    p2: {
      falas: [
        { quem: "narrador", texto: "Instrução em plenário (CPP, art. 473). Zuleide presta o compromisso com a voz baixa e as mãos inquietas no colo. Vizinha de Iracema por onze anos, parede com parede." },
        { quem: "zuleide", emocao: "firme", texto: "Eu ouvia, doutor. E ouvia o que era. Chamei a polícia três vezes. A última medida protetiva, fui eu que levei ela no fórum pra pedir. Ela me dizia: “Zu, se um dia eu sumir, conta pra todo mundo o que tu ouvia.”" },
        { quem: "veridiana", emocao: "firme", texto: "A senhora chegou a presenciar descumprimentos das medidas?" },
        { quem: "zuleide", emocao: "triste", texto: "Ele voltava. A papelada dizia que não podia, mas ele voltava. Eu via o carro dele na esquina, parado, horas. Apaguei a luz da minha varanda muitas noites pra ele não saber que eu via." },
        { quem: "nazario", emocao: "neutro", texto: "Sem mais perguntas sobre isso, Excelência. Mas a defesa tem outras. Dona Zuleide... depois da separação, a Iracema passou a receber visitas? Que tipo de companhia? E quando ela saía à noite — a senhora reparava como ela se vestia?" },
        { quem: "narrador", texto: "A sala inteira ouviu. D. Raimunda fecha os olhos. A caneta de Tunico para sobre o caderno. Zuleide olha para você, sem saber se deve responder." },
        { quem: "veridiana", emocao: "raiva", texto: "Antes que se responda, Excelência: o Ministério Público requer o desentranhamento da pergunta, multa por litigância de má-fé e ofício à OAB contra o defensor. AGORA." },
        { quem: "nazario", emocao: "firme", texto: "A pergunta tem propósito de defesa e eu a mantenho. Má-fé é tese que se prova, não adjetivo de plenário — e esta tribuna não se intimida, Excelência." }
      ],
      decisao: {
        prompt: "A pergunta da defesa está no ar — e os sete jurados esperam a resposta. A presidência é sua.",
        opcoes: [
          { rotulo: "Deixar a testemunha responder: a defesa tem suas razões, e este juízo não cerceia pergunta de advogado",
            fundamento: "Amplitude da defesa no júri",
            efeitos: { tec: -10, hum: -10, imp: -6, tempo: 12 },
            carimbo: "PERGUNTA ADMITIDA",
            setFlags: { omissaoPlenario: true },
            reacoes: [
              { quem: "veridiana", emocao: "raiva", texto: "PROTESTO, Excelência — e requeiro que conste: a vida íntima da vítima não é objeto deste processo. O art. 400-A do CPP vale dentro deste plenário." },
              { quem: "zuleide", emocao: "vergonha", texto: "Ela... ela se vestia normal, doutor. Era enfermeira, vivia de branco... Eu não sei o que o senhor quer que eu diga." },
              { quem: "narrador", texto: "Dois jurados anotam alguma coisa. D. Raimunda aperta a foto contra o peito até o papelão ceder. A pergunta já produziu o que veio produzir." }
            ],
            feedback: { acerto: "grave", titulo: "O silêncio da presidência também julga",
              texto: "A Lei 14.245/2021 — nascida de uma vítima humilhada em audiência — escreveu no CPP o que a dignidade sempre exigiu: o art. 400-A veda às partes a manifestação sobre circunstâncias ALHEIAS ao fato e o uso de informação que ofenda a dignidade da vítima; e o art. 474-A manda aplicá-lo expressamente na instrução EM PLENÁRIO do júri. O Protocolo de Perspectiva de Gênero (obrigatório — Res. CNJ 492/2023) fecha o circuito: o juiz tem dever ATIVO de impedir que estereótipos substituam prova. Roupas e companhias de Iracema não provam nada sobre o disparo — mas, diante de sete leigos, deslocam o julgamento do réu para a morta. Era exatamente isso que a pergunta queria. E a presidência deixou." },
            proxima: "p3" },

          { rotulo: "Indeferir a linha de inquirição, com fundamento expresso e registro em ata: os fatos em julgamento não incluem a vida íntima da vítima",
            fundamento: "CPP, arts. 400-A e 474-A (Lei 14.245/2021); Protocolo de Perspectiva de Gênero — Res. CNJ 492/2023; CPP, art. 497, III",
            requerFoco: "f_400a",
            efeitos: { tec: 12, hum: 8, imp: 5, tempo: 10 },
            carimbo: "ART. 400-A APLICADO",
            setFlags: { vitimaProtegidaPlenario: true, protocoloAplicado: true },
            reacoes: [
              { quem: "narrador", texto: "Você indefere a pergunta — e, no mesmo fôlego, o pacote do Ministério Público: multa e ofício à OAB não se decidem no calor de um incidente; cada coisa pelo seu instrumento, no seu momento. As duas tribunas baixam juntas." },
              { quem: "nazario", emocao: "neutro", texto: "Consigne-se a inconformidade da defesa, Excelência. ...Reformulo. Dona Zuleide: a senhora presenciou o fato?" },
              { quem: "zuleide", emocao: "firme", texto: "O fato, não, doutor. Eu vi os onze anos que vieram antes dele." },
              { quem: "narrador", texto: "D. Raimunda abre os olhos. Na bancada, uma jurada desfaz a anotação que tinha começado. A sessão volta ao seu objeto." }
            ],
            feedback: { acerto: "otimo", titulo: "A pergunta que não entra",
              texto: "Aplicação cirúrgica: o art. 400-A do CPP (Lei 14.245/2021, a Lei Mariana Ferrer) veda manifestações sobre circunstâncias alheias aos fatos e o uso de informação que ofenda a dignidade da vítima — e o art. 474-A o torna expressamente aplicável à instrução em plenário do júri. O Protocolo de Perspectiva de Gênero (Res. CNJ 492/2023) manda o juiz fazer exatamente o que você fez: identificar o estereótipo (“como ela se vestia”) e barrá-lo ANTES que contamine quem julga. E repare no que a decisão NÃO fez: não calou a defesa — o Dr. Nazário reformulou e seguiu perguntando, sobre o fato. Indeferir pergunta ilegal com fundamento e ata não é cerceamento: é a presidência funcionando. E o fiel da balança valeu para o outro prato: o requerimento punitivo do MP, feito no calor do incidente, também não passou — proteger a vítima não é aderir à acusação." },
            proxima: "p3" },

          { rotulo: "Repreender o advogado em plenário: “o senhor devia ter vergonha de viver de enlamear mulher morta”",
            fundamento: "Reprimenda moral da bancada",
            efeitos: { tec: -6, imp: -6, hum: -2, tempo: 8 },
            carimbo: "REPREENSÃO PESSOAL",
            setFlags: { viciosRegistrados: true },
            reacoes: [
              { quem: "nazario", emocao: "firme", texto: "Que se consigne PALAVRA POR PALAVRA: ofensa pessoal ao defensor, proferida pela presidência diante do Conselho de Sentença. A defesa arguirá a quebra de imparcialidade no momento próprio." },
              { quem: "veridiana", emocao: "neutro", texto: "Excelência... o Ministério Público concordava com o destino da pergunta. Não com o caminho." }
            ],
            feedback: { acerto: "ruim", titulo: "O alvo certo, a arma errada",
              texto: "A linha de inquirição merecia morrer — mas pelo art. 400-A, não pela ofensa. O presidente que ataca a PESSOA do advogado diante dos jurados comete três erros de uma vez: desequilibra a balança que lhe cabia segurar, transforma a proteção da vítima em incidente sobre o juiz e entrega à defesa material real para arguir parcialidade — contaminando, por excesso, o mesmo julgamento que você queria proteger. A autoridade da toga está nos fundamentos; quando ela desce ao insulto, desce da bancada junto." },
            proxima: "p3" }
        ]
      }
    },

    /* ---------- INTERROGATÓRIO DO RÉU ---------- */
    p3: {
      falas: [
        { quem: "narrador", texto: "Encerrada a prova oral, o interrogatório fecha a instrução (CPP, art. 474). Valter caminha até a cadeira sem pressa. Antes de sentar, volta-se para a bancada dos jurados e inclina a cabeça — uma mesura pequena, ensaiada, milimétrica." },
        { quem: "valter", emocao: "neutro", texto: "Eu só queria dizer, antes de qualquer pergunta... que eu amava aquela mulher. O que aconteceu naquela casa foi uma tragédia para todos nós. Para TODOS." },
        { quem: "narrador", texto: "Da primeira fila, D. Raimunda o encara pela primeira vez no dia. Ele não sustenta o olhar." }
      ],
      decisao: {
        prompt: "O réu quer transformar o interrogatório em palco. Como você conduz o ato?",
        opcoes: [
          { rotulo: "Conduzir com neutralidade firme: advertir do direito ao silêncio (CPP, art. 186), assegurar as perguntas diretas das partes (art. 474, §1º) e intervir somente quando o discurso desbordar dos fatos",
            fundamento: "CPP, arts. 186, 474, §§ 1º e 2º, 400-A e 474-A — o interrogatório é meio de defesa, dentro dos fatos",
            efeitos: { tec: 10, imp: 5, hum: 4, tempo: 28 },
            carimbo: "INTERROGATÓRIO REGULAR",
            setFlags: { interrogatorioRegular: true },
            reacoes: [
              { quem: "valter", emocao: "neutro", texto: "Vou responder tudo, Excelência. Não tenho nada a esconder." },
              { quem: "veridiana", emocao: "firme", texto: "Que conste em ata, Excelência: o réu falta com a verdade ao Conselho de Sentença." },
              { quem: "narrador", texto: "Você indefere o registro, lembrando o que a promotora sabe: o interrogatório é meio de defesa, o réu não presta compromisso e o silêncio não o prejudica (CF, art. 5º, LXIII) — quem pesa a credibilidade da versão são os sete, nos debates. A Dra. Veridiana anota e recua." },
              { quem: "narrador", texto: "As partes perguntam diretamente; os jurados, por seu intermédio. Quando Valter ensaia “ela sabia me tirar do sério, os senhores precisavam conhecer as escolhas dela...”, você o detém, sereno: o interrogatório versa sobre os fatos. Ele recolhe a frase — e a teatralidade, sem plateia, murcha." },
              { quem: "nazario", emocao: "neutro", texto: "Sem reparos quanto à condução, Excelência." }
            ],
            feedback: { acerto: "otimo", titulo: "Neutralidade não é passividade",
              texto: "O interrogatório é, antes de tudo, meio de defesa: o silêncio é direito e não prejudica (CPP, art. 186, parágrafo único; CF, art. 5º, LXIII), as partes perguntam diretamente e os jurados por intermédio do presidente (art. 474, §§ 1º e 2º). Mas autodefesa tem a mesma fronteira de toda fala em plenário: os FATOS. Os arts. 400-A e 474-A não valem só contra advogados — valem contra qualquer um que use o microfone do júri para desqualificar a vítima. Você não promoveu nem sufocou a fala do réu: manteve-a dentro do processo. É a definição exata de presidir." },
            proxima: "p4" },

          { rotulo: "Deixar o réu falar à vontade, sem interrupções: o momento é dele, e contê-lo soaria parcial",
            fundamento: "Autodefesa irrestrita",
            efeitos: { tec: -8, hum: -8, imp: -5, tempo: 35 },
            carimbo: "PALAVRA LIVRE AO RÉU",
            setFlags: { plenarioContaminado: true },
            reacoes: [
              { quem: "valter", emocao: "firme", texto: "Eu fui provocado além do que um homem aguenta. As escolhas dela... as companhias que ela levava pra perto dos MEUS filhos... Quem conhece a história inteira entende o que aconteceu naquela casa." },
              { quem: "veridiana", emocao: "raiva", texto: "Excelência, há DEZ MINUTOS o interrogatório virou tribuna contra a vítima — e a presidência não disse uma palavra. Protesto, com registro em ata." },
              { quem: "narrador", texto: "D. Raimunda não chora. Aperta a foto até o papelão vincar, os olhos fixos num ponto da parede. Na bancada, um jurado balança a cabeça devagar — concordando com alguma coisa que ninguém provou." }
            ],
            feedback: { acerto: "grave", titulo: "Autodefesa não é tribuna contra a morta",
              texto: "O direito de autodefesa protege a versão do réu SOBRE OS FATOS — não um discurso de desqualificação da vítima diante de quem vai julgá-lo. O art. 474-A do CPP aplica ao plenário a vedação do art. 400-A exatamente para esta cena; e o Protocolo de Perspectiva de Gênero (Res. CNJ 492/2023) nomeia o que aconteceu: o plenário reproduzindo, em versão verbal, a mesma lógica de controle e menosprezo que o processo apura — com o Estado de toga assistindo. Cada minuto sem intervenção depositou no Conselho a ideia de que “a história inteira” justifica. O quesito da absolvição genérica dirá quanto isso custou." },
            proxima: "p4" },

          { rotulo: "Assumir o interrogatório e confrontar o réu você mesmo: encadear perguntas acusatórias até desmontar a versão",
            fundamento: "Busca da verdade real",
            efeitos: { tec: -7, imp: -6, tempo: 30 },
            carimbo: "JUÍZO NO ATAQUE",
            setFlags: { viciosRegistrados: true },
            reacoes: [
              { quem: "nazario", emocao: "firme", texto: "Consigne-se: a presidência ACUSA. Nesta sessão, Excelência, o réu tem menos a temer da Promotoria do que da toga — e os sete jurados estão vendo." },
              { quem: "veridiana", emocao: "neutro", texto: "..." }
            ],
            feedback: { acerto: "ruim", titulo: "A toga emprestada à acusação",
              texto: "O sistema acusatório (CPP, art. 3º-A) reservou a iniciativa às partes — e no plenário do júri isso é ainda mais sensível: as perguntas diretas são do MP e da defesa (art. 474, §1º), e diante de jurados leigos a palavra do juiz pesa mais que a de qualquer parte. O presidente que “aperta” o réu não busca a verdade: sinaliza ao Conselho qual veredicto espera, contaminando a equidistância que valida a votação. A versão teatral do réu se desmonta com a prova e com os debates da promotora — não com a sua voz." },
            proxima: "p4" }
        ]
      }
    },

    /* ---------- DEBATES — O ÁPICE ---------- */
    p4: {
      falas: [
        { quem: "narrador", texto: "Debates (CPP, art. 476). A acusação sustenta por uma hora e meia." },
        { quem: "veridiana", emocao: "firme", texto: "Três medidas protetivas. Sete descumprimentos registrados. Uma prisão em flagrante — e ele voltou. Este processo não pergunta se Iracema morreu, senhores jurados: pergunta se este homem a matou, e por quê. A resposta está escrita em cada boletim que ela teve a coragem de registrar enquanto o Estado ainda podia salvá-la. E ao votar, senhores... olhem para a primeira fila. Olhem para a mãe que restou." },
        { quem: "nazario", emocao: "neutro", texto: "Consigne-se, antes da tréplica que ainda virá: o apelo final da acusação convoca a comoção, não a prova. A defesa registra." },
        { quem: "narrador", texto: "O registro é tecnicamente correto — e você o defere. As duas tribunas desta sala sabem onde passa a linha; a diferença está em quando cada uma escolhe cruzá-la, e em quem segura o fiel quando isso acontece." },
        { quem: "narrador", texto: "A tribuna passa à defesa. O Dr. Nazário não levanta a voz. É pior: ele conversa." },
        { quem: "nazario", emocao: "firme", texto: "Os senhores são gente da vida real. Sabem que ninguém mata por nada. Eu vou lhes apresentar a outra metade desta história: as escolhas da Iracema. As companhias da Iracema. As noites da Iracema. E ao final os senhores vão se perguntar, comigo: nessa tragédia... quem deu causa?" },
        { quem: "narrador", texto: "Ele abre sobre a tribuna uma pasta de fotografias da vida pessoal da vítima. D. Raimunda se curva para a frente, como quem recebe um peso nas costas. Dois jurados anotam. Tunico escreve sem olhar para o papel." }
      ],
      decisao: {
        prompt: "“Quem deu causa?” A defesa vai julgar a vida de Iracema diante dos sete. O que faz o presidente?",
        opcoes: [
          { rotulo: "Não intervir: a tribuna da defesa é livre, e jurado é capaz de separar o joio do trigo",
            fundamento: "Liberdade de tribuna nos debates",
            efeitos: { tec: -12, hum: -12, imp: -8, tempo: 45 },
            carimbo: "TRIBUNA LIVRE",
            setFlags: { plenarioContaminado: true },
            reacoes: [
              { quem: "veridiana", emocao: "raiva", texto: "Protesto e CONSIGNO, Excelência: a defesa está julgando a vítima diante do Conselho de Sentença — e a presidência assiste." },
              { quem: "narrador", texto: "A hora seguinte pertence à vida de Iracema, não ao fato. As fotografias circulam de mão em mão pela bancada. D. Raimunda não levanta mais os olhos do chão." },
              { quem: "raimunda", emocao: "choro", texto: "..." }
            ],
            feedback: { acerto: "grave", titulo: "O que o Protocolo manda — e a presidência não fez",
              texto: "A Resolução CNJ 492/2023 tornou OBRIGATÓRIO o Protocolo para Julgamento com Perspectiva de Gênero, e ele é direto: cabe ao juiz identificar e neutralizar os estereótipos que deslocam o julgamento do fato para a vítima — “ela provocou”, “a roupa”, “as companhias”, a velha figura da “mulher honesta” que o Direito moderno sepultou. Estereótipo não é prova: é atalho que absolve sem provar. No plenário, o instrumento tem nome e número: art. 497, III, do CPP — dirigir os debates, INTERVINDO em caso de abuso e excesso de linguagem — somado aos arts. 400-A e 474-A. “Liberdade de tribuna” protege a argumentação sobre a PROVA; não protege a demolição da dignidade de quem não pode responder. O Conselho ouviu uma hora de “quem deu causa” sem que a presidência existisse. O quesito da absolvição genérica vai cobrar o preço." },
            proxima: "p5" },

          { rotulo: "Cassar a palavra da defesa: determinar que o advogado encerre a sustentação imediatamente",
            fundamento: "Contenção do abuso pela via máxima",
            efeitos: { tec: -9, imp: -5, tempo: 15 },
            carimbo: "PALAVRA CASSADA",
            reacoes: [
              { quem: "nazario", emocao: "raiva", texto: "Cassar a PALAVRA da defesa em plenário do júri?! Consigno a nulidade na forma do art. 571, VIII, do CPP — e requeiro que da ata conste a hora exata, Excelência." },
              { quem: "veridiana", emocao: "neutro", texto: "Excelência... há caminho entre tudo e nada." }
            ],
            feedback: { acerto: "grave", titulo: "Do excesso alheio ao cerceamento próprio",
              texto: "A estratégia merecia freio — mas silenciar a sustentação inteira fere o que o júri tem de mais protegido: a PLENITUDE de defesa (CF, art. 5º, XXXVIII, “a”), garantia mais larga que a ampla defesa comum. A nulidade foi arguida no momento exato que o art. 571, VIII, do CPP exige, e tem endereço certo no Tribunal. O art. 497, III, fala em INTERVIR — advertência fundamentada, limites, registro —, não em calar: a defesa continua falando, sobre a prova. Quem cala a defesa não protege a vítima; condena a família a um segundo julgamento, daqui a um ano, com tudo de novo." },
            proxima: "p4e" },

          { rotulo: "Intervir como presidente, sem tirar a palavra: advertência fundamentada em plenário, registro em ata, determinação de que a sustentação se atenha à PROVA — e a lembrança serena aos jurados de que julgam o FATO",
            fundamento: "CPP, art. 497, III, c/c arts. 400-A e 474-A; Protocolo de Perspectiva de Gênero — Res. CNJ 492/2023",
            requerFoco: "f_protocolo",
            efeitos: { tec: 12, hum: 10, imp: 6, tempo: 20 },
            carimbo: "PRESIDÊNCIA EXERCIDA",
            setFlags: { vitimaProtegidaPlenario: true, protocoloAplicado: true },
            reacoes: [
              { quem: "voce", emocao: "firme", texto: "Doutor Nazário, a tribuna é sua, e ninguém a tomará. Mas este Conselho julga um fato ocorrido em março de 2024 — não uma biografia. Advirto, com registro em ata e na forma dos arts. 497, III, 400-A e 474-A do CPP: a sustentação prossegue sobre a prova dos autos. E aos senhores jurados, recordo o juramento de hoje cedo: a causa se examina com imparcialidade. Quem está em julgamento nesta sala é o réu." },
              { quem: "nazario", emocao: "neutro", texto: "Consigne-se o protesto da defesa... e o registro de que a advertência veio fundamentada. Prossigo, Excelência. Pela prova." },
              { quem: "narrador", texto: "A pasta de fotografias se fecha sobre a tribuna. D. Raimunda levanta os olhos do chão. A sustentação continua — dura, técnica, sobre o álibi e sobre a dúvida. Como sempre deveria ter sido." }
            ],
            feedback: { acerto: "otimo", titulo: "Presidir: nem assistir, nem censurar",
              texto: "É o ponto de equilíbrio mais difícil do júri, alcançado por inteiro. O art. 497, III, do CPP manda o presidente dirigir os debates e intervir no abuso e no excesso de linguagem; os arts. 400-A e 474-A definem o abuso desta cena — explorar a vida da vítima alheia aos fatos —; e o Protocolo de Perspectiva de Gênero (Res. CNJ 492/2023) obriga o juiz a impedir que o estereótipo opere como argumento. Repare nos três cuidados que blindam a decisão: a palavra NÃO foi cassada (plenitude de defesa intacta), a advertência veio FUNDAMENTADA e em ata (sem nulidade, sem ofensa), e a fala aos jurados recentrou o OBJETO sem opinar sobre o mérito. A defesa saiu da vida da morta e voltou para a prova — que é o único terreno onde o veredicto pode nascer válido." },
            proxima: "p5" }
        ]
      }
    },

    /* ---------- RAMO DE ERRO: A PALAVRA CASSADA ---------- */
    p4e: {
      falas: [
        { quem: "narrador", texto: "O salão inteiro em suspenso. O Dr. Nazário permanece de pé, a mão espalmada sobre a pasta fechada, esperando a escrivã terminar de registrar a hora. Ninguém na bancada dos jurados se mexe." },
        { quem: "nazario", emocao: "firme", texto: "A defesa está proibida de sustentar, Excelência. Que conste. O Tribunal de Justiça lerá esta ata com muitíssimo interesse." },
        { quem: "veridiana", emocao: "firme", texto: "Excelência, falo por interesse próprio e o declaro: sem defesa que fale, nenhuma condenação fica de pé no Tribunal. O Ministério Público não quer ganhar hoje para perder na apelação. Devolva a palavra — com os limites do art. 497." }
      ],
      decisao: {
        prompt: "A ata ainda está aberta. Manter a cassação — ou reconduzir a sessão ao trilho?",
        opcoes: [
          { rotulo: "Manter a cassação: quem abusa da tribuna perde a tribuna",
            fundamento: "Autoridade da presidência",
            efeitos: { tec: -10, imp: -8, hum: -4, tempo: 12 },
            carimbo: "CASSAÇÃO MANTIDA",
            setFlags: { viciosRegistrados: true, palavraCassada: true, manchaGrave: true },
            reacoes: [
              { quem: "nazario", emocao: "neutro", texto: "Nulidade absoluta, consignada na hora própria. A memória da vítima merecia um julgamento que DURASSE, Excelência. Este não vai durar." },
              { quem: "narrador", texto: "A defesa cruza os braços e se cala — estrategicamente. Cada minuto de silêncio dela, daqui em diante, trabalha para a apelação." }
            ],
            feedback: { acerto: "grave", titulo: "Vencer o argumento, perder o processo",
              texto: "A plenitude de defesa (CF, art. 5º, XXXVIII, “a”) não é cortesia: é condição de validade do veredicto. Julgamento em que a defesa foi silenciada nasce com prazo de validade — a nulidade, arguida no ato como manda o art. 571, VIII, do CPP, derruba a sessão inteira no Tribunal (CPP, art. 593, III, “a”). E quem paga a repetição não é o advogado: é D. Raimunda, que reviverá cada hora deste dia num segundo plenário. O abuso da tribuna se contém com o art. 497, III — advertência, limites, ata —, nunca com a supressão da fala. Conter excesso com excesso não é autoridade: é simetria de erro." },
            proxima: "p5" },

          { rotulo: "Reconsiderar em ata: devolver a palavra COM advertência fundamentada (CPP, arts. 497, III, 400-A e 474-A; Protocolo CNJ 492) — a sustentação prossegue, atida à prova",
            fundamento: "Autotutela judicial; CF, art. 5º, XXXVIII, “a” — plenitude de defesa",
            efeitos: { tec: 7, hum: 6, tempo: 14 },
            carimbo: "PALAVRA DEVOLVIDA",
            setFlags: { vitimaProtegidaPlenario: true, protocoloAplicado: true },
            reacoes: [
              { quem: "nazario", emocao: "neutro", texto: "Registro a reconsideração... e registro os limites. Prossigo, Excelência. Pela prova." },
              { quem: "veridiana", emocao: "neutro", texto: "O Ministério Público nada mais requer quanto ao incidente." },
              { quem: "narrador", texto: "A pasta de fotografias permanece fechada. A sustentação recomeça — sobre o álibi, sobre a dúvida, sobre a prova. A ata guarda os minutos em que a defesa esteve calada; mas guarda, também, a correção." }
            ],
            feedback: { acerto: "bom", titulo: "Errar e corrigir no ato ainda é juízo funcionando",
              texto: "A reconsideração imediata desarma a nulidade maior antes que produza efeitos: a defesa volta a sustentar — dentro dos limites que os arts. 400-A, 474-A e 497, III, do CPP sempre autorizaram — e o prejuízo, requisito de toda nulidade (CPP, art. 563: pas de nullité sans grief), se esvazia. A cicatriz fica na ata, e a apelação a citará; mas entre o orgulho e o processo, a presidência escolheu o processo. Era a advertência fundamentada, desde o início, o desenho da lei." },
            proxima: "p5" }
        ]
      }
    },

    /* ---------- EXALTAÇÃO NO PLENÁRIO ---------- */
    p5: {
      falas: [
        { quem: "narrador", texto: "Réplica e tréplica se cruzam. É quando uma voz explode da galeria: “ASSASSINO! Devolve a Iracema!” — e meia dúzia de pessoas se levanta junto, batendo nos espaldares. A escolta dá um passo à frente. Na bancada, dois jurados se entreolham." },
        { quem: "nazario", emocao: "raiva", texto: "Excelência! O Conselho de Sentença está sendo intimidado DENTRO do salão! A defesa requer a dissolução do Conselho e o adiamento desta sessão!" },
        { quem: "valter", emocao: "medo", texto: "..." },
        { quem: "veridiana", emocao: "firme", texto: "A comoção é compreensível, Excelência — a cidade inteira conhecia Iracema. Contenha-se o excesso... mas que o Conselho não esqueça o que esta sala sente." }
      ],
      decisao: {
        prompt: "Galeria exaltada, defesa pedindo dissolução, sete jurados assistindo. A sala é sua.",
        opcoes: [
          { rotulo: "Exercer a polícia da sessão (CPP, art. 497, I): suspender por dez minutos, retirar do salão quem tumultuou, advertir a galeria e consignar — a sessão prossegue",
            fundamento: "CPP, art. 497, I e VII — polícia das sessões; medida proporcional ao incidente",
            efeitos: { tec: 10, imp: 8, tempo: 18 },
            carimbo: "ORDEM RESTABELECIDA",
            setFlags: { ordemRestabelecida: true },
            reacoes: [
              { quem: "narrador", texto: "A escolta acompanha três pessoas até a porta. Você adverte a galeria: a próxima manifestação esvazia as cadeiras — todas. E responde, da bancada, ao aparte da promotora: o que esta sala sente não entra na urna — nem quando grita contra o réu, nem no dia em que gritar por ele. O que se provou, sim." },
              { quem: "narrador", texto: "O salão volta a caber em si. Dez minutos depois, a tréplica recomeça do ponto exato." },
              { quem: "nazario", emocao: "neutro", texto: "Restabelecida a ordem e consignado o incidente, a defesa retira o requerimento de dissolução. Prossigo." }
            ],
            feedback: { acerto: "otimo", titulo: "A medida do tamanho do incidente",
              texto: "O art. 497, I, do CPP entrega ao presidente a polícia das sessões — e os incisos VII e VIII completam o arsenal: suspender e interromper quando necessário. A resposta proporcional (retirada pontual, advertência, consignação, retomada) protege ao mesmo tempo a serenidade do Conselho, a publicidade da sessão e o direito das partes. Já a dissolução que a defesa pediu é remédio de outra prateleira: o CPP a reserva a hipóteses estreitas, como o réu indefeso (art. 497, V) — não à plateia exaltada. Quem preside responde pela temperatura da sala; hoje, ela voltou ao normal em dez minutos, e o julgamento não custou à família um segundo começo." },
            proxima: "p6" },

          { rotulo: "Dissolver o Conselho de Sentença e designar nova data: não há serenidade possível hoje",
            fundamento: "Preservação da imparcialidade do julgamento",
            efeitos: { tec: -8, hum: -8, cel: -6, tempo: 22 },
            carimbo: "DISSOLUÇÃO COGITADA",
            setFlags: { viciosRegistrados: true },
            reacoes: [
              { quem: "veridiana", emocao: "raiva", texto: "Dissolver?! D. Raimunda esperou DOIS ANOS por esta sessão, Excelência. A galeria já está contida pela escolta — e a senhora ali da primeira fila vai reviver tudo isso de novo em quantos meses?" },
              { quem: "narrador", texto: "Diante da ponderação — e do salão já silencioso, a escolta postada nos corredores —, você reconsidera antes de lavrar o termo: a sessão prossegue, com o incidente e a reconsideração consignados em ata. O quase-fim do julgamento ficou registrado. A defesa anotou." }
            ],
            feedback: { acerto: "ruim", titulo: "O canhão para o pardal",
              texto: "A dissolução é a medida mais devastadora do repertório do presidente — desfaz o julgamento inteiro — e o CPP a reserva a hipóteses estreitas (como o réu indefeso, art. 497, V). Para o tumulto de galeria, a lei deu instrumentos menos custosos e plenamente eficazes: a polícia das sessões (497, I), a suspensão e a interrupção (497, VII e VIII). Dissolver puniria todos os inocentes da sala — jurados, testemunha, família — pelo excesso de meia dúzia de exaltados, e imporia a D. Raimunda um segundo plenário. Proporcionalidade também vale para o poder de polícia: a reconsideração salvou a sessão, mas a hesitação da presidência ficou na ata." },
            proxima: "p6" },

          { rotulo: "Ignorar e mandar seguir: plenário de júri é assim mesmo",
            fundamento: "Tolerância com a comoção natural do caso",
            efeitos: { tec: -7, imp: -6, hum: -4, tempo: 10 },
            carimbo: "TUMULTO IGNORADO",
            setFlags: { viciosRegistrados: true },
            reacoes: [
              { quem: "nazario", emocao: "firme", texto: "Consigne-se: os jurados decidirão sob a pressão de uma galeria que a presidência se recusou a conter. A apelação agradece, Excelência." },
              { quem: "narrador", texto: "A tréplica prossegue por cima do burburinho. Um jurado olha por sobre o ombro para a galeria — duas vezes." }
            ],
            feedback: { acerto: "ruim", titulo: "Jurado pressionado não é jurado livre",
              texto: "Todo o desenho do júri converge para blindar a consciência de quem vota: incomunicabilidade (CPP, art. 466, §1º), sigilo das votações (CF, art. 5º, XXXVIII, “b”), sala especial. De nada vale a blindagem formal se a presidência deixa a galeria gritar o veredicto que espera. O art. 497, I, existe para este minuto — e ignorá-lo entrega à defesa, de graça, a melhor tese de nulidade do dia: influência externa sobre o Conselho de Sentença. A comoção da cidade é legítima; dentro do salão, quem responde pela liberdade dos sete é você." },
            proxima: "p6" }
        ]
      }
    },

    /* ---------- QUESITAÇÃO ---------- */
    p6: {
      falas: [
        { quem: "narrador", texto: "Encerrados os debates, você indaga aos jurados se estão habilitados a julgar ou se precisam de esclarecimento (CPP, art. 480, §1º). Uma jurada levanta a mão, hesitante: “Doutor... eu queria entender direito a diferença entre as perguntas que a gente vai responder.” É, talvez, a pergunta mais importante da sessão." },
        { quem: "veridiana", emocao: "neutro", texto: "O Ministério Público aguarda a leitura dos quesitos, Excelência." },
        { quem: "nazario", emocao: "neutro", texto: "A defesa igualmente — e conferirá cada vírgula." }
      ],
      decisao: {
        prompt: "Sete leigos vão decidir respondendo a perguntas escritas por você (CPP, art. 483). Como formula e apresenta os quesitos?",
        opcoes: [
          { rotulo: "Ler os quesitos de uma vez, sem explicação: o dia já está longo, e os quesitos se explicam sozinhos",
            fundamento: "Celeridade do encerramento",
            efeitos: { tec: -8, cel: 2, tempo: 10 },
            carimbo: "QUESITOS LIDOS ÀS PRESSAS",
            setFlags: { quesitacaoViciada: true },
            reacoes: [
              { quem: "narrador", texto: "A jurada que pediu esclarecimento olha para os colegas; ninguém entendeu melhor do que ela. As cédulas esperam respostas de quem ainda tem perguntas." },
              { quem: "nazario", emocao: "neutro", texto: "A defesa consigna a ausência de explicação dos quesitos, na forma do art. 484, parágrafo único. Por ora, é tudo." }
            ],
            feedback: { acerto: "ruim", titulo: "Quesito que ninguém entende, resposta que ninguém controla",
              texto: "A quesitação é, historicamente, o berço das nulidades do júri — a Súmula 156 do STF trata como ABSOLUTA a nulidade por falta de quesito obrigatório, e a jurisprudência estende o rigor ao quesito obscuro, que gera perplexidade. O art. 484, parágrafo único, do CPP é expresso: o presidente EXPLICARÁ aos jurados o significado de cada quesito. Jurado que não entende a pergunta responde ao acaso — e o acaso de hoje, qualquer que seja o veredicto, é a apelação de amanhã. Cinco minutos de explicação custavam menos que um julgamento novo." },
            proxima: "p7" },

          { rotulo: "Formular, ler e EXPLICAR cada quesito em plenário: materialidade; autoria; “o jurado absolve o acusado?”; a qualificadora — razões da condição do sexo feminino, em menosprezo ou discriminação à condição de mulher; a causa de aumento — o crime na presença dos filhos",
            fundamento: "CPP, arts. 483 e 484, parágrafo único; Súmula 156/STF; CP, art. 121, §2º, VI, e §7º, III (redação da época)",
            requerFoco: "f_quesitos",
            efeitos: { tec: 12, imp: 5, tempo: 28 },
            carimbo: "QUESITOS EXPLICADOS",
            setFlags: { quesitosClaros: true },
            reacoes: [
              { quem: "narrador", texto: "Você lê e traduz, um a um: o primeiro pergunta se o fato existiu; o segundo, se foi o réu; o terceiro é a porta da absolvição, por qualquer razão de consciência; o quarto pergunta o PORQUÊ — se a morte se deu por razões da condição de mulher, em menosprezo ou discriminação; o quinto, se aconteceu diante dos filhos. A jurada que levantou a mão assente, devagar. As partes, indagadas na forma do art. 484, nada reclamam." },
              { quem: "nazario", emocao: "neutro", texto: "Sem requerimentos nem reclamações quanto aos quesitos, Excelência. Que conste." },
              { quem: "veridiana", emocao: "neutro", texto: "Igualmente, nada a reclamar." }
            ],
            feedback: { acerto: "otimo", titulo: "A tradução do processo para quem decide",
              texto: "Quesitação completa e na ordem do art. 483: materialidade, autoria, o quesito genérico de absolvição (§2º — a soberania do jurado em estado puro), depois qualificadora e causa de aumento (inciso V). Dois acertos finos merecem nota. <b>Primeiro:</b> a qualificadora do feminicídio se quesita pelos seus ELEMENTOS — menosprezo ou discriminação à condição de mulher (CP, art. 121, §2º, VI, vigente à época; o tipo autônomo do art. 121-A, criado pela Lei 14.994/2024, não retroage por ser mais gravoso — CF, art. 5º, XL). <b>Segundo:</b> a presença dos filhos é causa de aumento (§7º, III) e entra em quesito próprio, não em “pacote”. E o art. 484, parágrafo único, foi cumprido à letra: explicar a FORMA, sem tocar o mérito. As partes nada reclamaram — a ata está blindada." },
            proxima: "p7" },

          { rotulo: "Explicar os quesitos opinando: “a prova, como os senhores viram, recomenda respostas afirmativas”",
            fundamento: "Orientação do Conselho pela experiência da bancada",
            efeitos: { tec: -12, imp: -8, tempo: 14 },
            carimbo: "OPINIÃO DA PRESIDÊNCIA",
            setFlags: { viciosRegistrados: true },
            reacoes: [
              { quem: "nazario", emocao: "raiva", texto: "A presidência acaba de VOTAR, Excelência — antes dos sete. Requeiro que a frase conste da ata palavra por palavra." },
              { quem: "veridiana", emocao: "neutro", texto: "..." }
            ],
            feedback: { acerto: "grave", titulo: "O oitavo voto que a lei proíbe",
              texto: "O presidente explica a FORMA dos quesitos (CPP, art. 484, parágrafo único) — jamais sugere o MÉRITO das respostas. Diante de jurados leigos, a opinião do juiz togado é a mais pesada das influências indevidas: fulmina por dentro a soberania dos veredictos (CF, art. 5º, XXXVIII, “c”) e a íntima convicção que o sistema confiou aos sete, rendendo nulidade que nenhuma fundamentação salva. Até aqui a sessão foi protegida da estratégia abusiva e da galeria exaltada; não a entregue, no último ato, à sua própria convicção. O juiz do júri decide tudo — menos a causa." },
            proxima: "p7" }
        ]
      }
    },

    /* ---------- SALA ESPECIAL E VEREDICTO ---------- */
    p7: {
      falas: [
        { quem: "narrador", texto: "Sala especial (CPP, art. 485). Sete jurados, você, a promotora, o assistente, o defensor, a escrivã e o oficial de justiça. Nenhuma palavra fora dos quesitos. Sobre a mesa, as cédulas: SIM, NÃO." },
        { quem: "narrador", texto: "É o último ato que você preside — e o único em que não decide nada. Resta garantir que os sete decidam como a Constituição quis: em consciência e em segredo." }
      ],
      decisao: {
        prompt: "A votação está nas suas mãos — não o voto. Como você a conduz?",
        opcoes: [
          { rotulo: "Apurar os sete votos de cada quesito e proclamar os placares completos em plenário",
            fundamento: "Transparência do resultado",
            efeitos: { tec: -8, tempo: 25 },
            carimbo: "PLACAR PROCLAMADO",
            reacoes: [
              { quem: "nazario", emocao: "firme", texto: "Placar completo proclamado é voto identificável, Excelência — em votação unânime, o sigilo de CADA jurado acabou de ser dispensado. Consigne-se." }
            ],
            feedback: { acerto: "ruim", titulo: "A contagem que revela o segredo",
              texto: "O sigilo das votações (CF, art. 5º, XXXVIII, “b”) se protege na APURAÇÃO: os §§ 1º e 2º do art. 483 do CPP mandam encerrar a contagem assim que formada a maioria — o quarto voto convergente — precisamente para que a unanimidade (e, com ela, o voto de cada jurado) jamais se revele. Proclamar um 7 a 0 expõe os sete de uma vez: cada jurado sai do fórum com o próprio voto público, na cidade que lotou a escadaria. A jurisprudência reconhece a nulidade — e a comarca aprende que, naquele plenário, o segredo prometido pela Constituição tem hora para acabar." },
            proxima: function (f) { return (f.plenarioContaminado || f.omissaoPlenario) ? "fim_grave" : "fim_bom"; } },

          { rotulo: "Conduzir a votação com o sigilo íntegro: cédulas recolhidas a cada quesito, apuração ENCERRADA no quarto voto convergente, resultado consignado sem placar",
            fundamento: "CF, art. 5º, XXXVIII, “b”; CPP, arts. 483, §§ 1º e 2º, 486 e 487; art. 466, §1º",
            efeitos: { tec: 12, imp: 5, tempo: 35 },
            carimbo: "SIGILO PRESERVADO",
            reacoes: [
              { quem: "narrador", texto: "A urna passa de mão em mão. Cédulas dobradas, recolhidas e contadas até a quarta resposta convergente — nem um voto além. A escrivã lavra o termo: “por mais de três votos”. O segredo de cada jurado volta para casa com ele." }
            ],
            feedback: { acerto: "otimo", titulo: "O coração blindado do júri",
              texto: "Tudo no rito converge para que cada jurado vote livre — até dos próprios colegas: incomunicabilidade desde o sorteio (CPP, art. 466, §1º), cédulas que não têm dono (art. 486), e a regra de ouro da apuração: formada a maioria — o quarto voto —, a contagem PARA (art. 483, §§ 1º e 2º), para que nunca se saiba se houve unanimidade e o sigilo constitucional (CF, art. 5º, XXXVIII, “b”) sobreviva à curiosidade do plenário. O presidente que apura além disso viola exatamente o que jurou proteger. Agora os quesitos respondem — e dentro de cada resposta está a sessão inteira que você presidiu." },
            proxima: function (f) {
              if (f.plenarioContaminado || f.omissaoPlenario) return "fim_grave";
              if (f.quesitacaoViciada || f.viciosRegistrados) return "fim_bom";
              return "fim_otimo";
            } },

          { rotulo: "Permitir que os jurados conversem entre si antes de votar: sete cabeças decidem melhor debatendo",
            fundamento: "Deliberação colegiada esclarece",
            efeitos: { tec: -9, tempo: 30 },
            carimbo: "DELIBERAÇÃO ABERTA",
            reacoes: [
              { quem: "veridiana", emocao: "firme", texto: "Excelência, com todo respeito: isto não é um filme americano. A incomunicabilidade do art. 466 alcança a sala especial — o jurado brasileiro vota sozinho com a própria consciência." }
            ],
            feedback: { acerto: "ruim", titulo: "O nosso júri vota; não delibera",
              texto: "O modelo brasileiro rejeitou, por desenho, a deliberação coletiva do cinema: aqui o jurado decide por ÍNTIMA convicção, individual e sigilosa — a incomunicabilidade sobre o mérito (CPP, art. 466, §1º) vale do sorteio à última cédula, inclusive dentro da sala especial. Abrir o debate cria a figura que a lei quis evitar: o jurado-líder que arrasta os indecisos e dissolve sete consciências numa só voz. A votação assim colhida é nula — e o veredicto, qualquer que fosse, nasceria de um júri que a nossa Constituição não conhece." },
            proxima: function (f) { return (f.plenarioContaminado || f.omissaoPlenario) ? "fim_grave" : "fim_bom"; } }
        ]
      }
    },

    /* ---------- FINS ---------- */
    fim_otimo: {
      falas: [
        { quem: "narrador", texto: "Materialidade: SIM, por mais de três votos. Autoria: SIM, por mais de três votos. “O jurado absolve o acusado?”: NÃO, por mais de três votos. A qualificadora — morte por razões da condição do sexo feminino, em menosprezo à condição de mulher: SIM. O crime diante dos dois filhos: SIM. A escrivã lavra o termo. Ninguém respira alto." },
        { quem: "narrador", texto: "De volta ao plenário, você lê a sentença: pena-base acima do mínimo pelas circunstâncias do crime — três protetivas descumpridas, uma a uma, até o fim —; homicídio qualificado pelo feminicídio; pena aumentada de um terço pela presença dos filhos (CP, art. 121, §7º, III): dezoito anos e oito meses, regime fechado, prisão mantida e execução autorizada desde logo (CPP, art. 492, I, “e”; STF, Tema 1.068)." },
        { quem: "voce", emocao: "firme", texto: "Valter, esta pena é a medida exata do que o senhor fez — nem um dia a mais por vingança, nem um dia a menos por esquecimento. O Estado que hoje o condena é o mesmo que responde pela sua integridade no cumprimento. E que se registre, porque os filhos desta família um dia lerão esta ata: este Conselho julgou um homem. Em nenhum momento julgou Iracema." },
        { quem: "narrador", texto: "Você agradece aos sete jurados pelo dia inteiro entregue à Justiça e declara dissolvido o Conselho. Em seguida, dita à escrivã os ofícios: acompanhamento psicossocial dos dois filhos de Iracema pela rede de atendimento (Lei 11.340/2006, arts. 9º e 35), prioridade no CREAS e ciência à equipe multidisciplinar do juízo sobre a família." },
        { quem: "narrador", texto: "D. Raimunda não diz nada. Apenas vira a foto da formatura para a frente, devagar — como quem apresenta a filha, enfim, à sala inteira." }
      ],
      fim: {
        titulo: "O FATO, E SÓ O FATO",
        selo: "otimo",
        setFlags: { feminicidioCondenado: true },
        texto: "Cinco horas de sessão — e em nenhuma delas a vítima esteve em julgamento. A imprensa mostrou sem expor, a defesa sustentou até o fim, sobre a prova, e os sete votaram livres de tudo: da câmera, da galeria, do estereótipo e da opinião da bancada. O veredicto nasceu limpo e a sentença sai com endereço de recurso, como deve ser. Presidir o júri é isto: não escolher o resultado — garantir que ele possa valer."
      }
    },

    fim_bom: {
      falas: [
        { quem: "narrador", texto: "Os quesitos respondem, por mais de três votos: o fato existiu, o réu é o autor, o Conselho não o absolve. A qualificadora do feminicídio: reconhecida. Condenado." },
        { quem: "narrador", texto: "Você lê a sentença em plenário — dosimetria fundamentada, regime fechado, os ofícios à rede de proteção para os filhos de Iracema, o agradecimento aos jurados antes de dissolver o Conselho. O rito se cumpre inteiro. Mas há páginas da ata que você conhece de cor." },
        { quem: "nazario", emocao: "neutro", texto: "A defesa apela, Excelência — e a ata desta sessão sobe inteira com o recurso. Vossa Excelência sabe quais páginas eu vou sublinhar." },
        { quem: "narrador", texto: "D. Raimunda recebe a notícia da condenação segurando a foto com as duas mãos. Alguém precisa lhe explicar, no corredor, o que significa “o processo ainda não acabou”." }
      ],
      fim: {
        titulo: "CONDENADO — COM RESSALVAS NA ATA",
        selo: "bom",
        setFlags: { feminicidioCondenado: true, condenacaoComVicios: true },
        texto: "O veredicto veio, e veio justo: o Conselho julgou o fato e respondeu por ele. Mas a sessão deixou cicatrizes consignadas — os incidentes que a presidência criou ou não evitou são, agora, teses vivas de apelação nas mãos de um advogado que não desperdiça vírgula. Se o Tribunal anular, D. Raimunda fará tudo de novo: a foto, a primeira fila, as cinco horas. Presidir bem não é só chegar à condenação — é impedir que o erro de hoje vire a sessão de amanhã."
      }
    },

    fim_grave: {
      falas: [
        { quem: "narrador", texto: "Primeiro quesito, materialidade: SIM. Segundo, autoria: SIM. Terceiro quesito — “O jurado absolve o acusado?”. A quarta cédula convergente diz SIM. A apuração se encerra ali, como manda a lei. Absolvido." },
        { quem: "narrador", texto: "De volta ao plenário, você proclama o veredicto. A soberania é deles (CF, art. 5º, XXXVIII, “c”); a voz é sua. O salão não comemora nem protesta: mergulha num silêncio que pesa mais do que os dois anos de processo." },
        { quem: "veridiana", emocao: "firme", texto: "O Ministério Público APELA, com fundamento no art. 593, III, “d”, do CPP: decisão manifestamente contrária à prova dos autos. O Tribunal pode submeter o réu a novo júri uma única vez, Excelência. Uma. A acusação não vai desperdiçar a dela." },
        { quem: "narrador", texto: "Valter aperta a mão do advogado. O Dr. Nazário corresponde sem sorrir e guarda a pasta devagar, sem olhar para a primeira fila. Tunico já digita a manchete no corredor." },
        { quem: "narrador", texto: "D. Raimunda se levanta sem ajuda de ninguém. Olha a foto da filha por um longo segundo — o uniforme branco, a formatura — e a guarda de volta na bolsa, com o cuidado de quem agasalha. Sai do salão antes da imprensa. Não há mais nada ali para ela." }
      ],
      fim: {
        titulo: "A FOTO VOLTA PARA A BOLSA",
        selo: "grave",
        setFlags: { absolvicaoContaminada: true, manchaGrave: true },
        texto: "O Conselho respondeu ao que ouviu — e ouviu, sem freio, que a vítima “deu causa”. A soberania dos veredictos protege a resposta dos jurados; não protege a omissão de quem presidia. A apelação da promotora é real, mas cabe uma única vez (CPP, art. 593, §3º), e o novo júri — se vier — reabrirá para a família cada hora deste dia. O art. 497, a Lei 14.245 e o Protocolo da Resolução CNJ 492 existiam exatamente para a sessão de hoje. Não foram usados. E o nome de Iracema saiu daquela sala julgado — pela porta dos fundos, enquanto o réu saía pela da frente."
      }
    }
  }
});
