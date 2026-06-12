/* ============================================================
   CASO: PLANTÃO — "A entrega"
   ------------------------------------------------------------
   Plantão noturno da infância. Rosa, 19 anos, chega ao fórum
   com um recém-nascido de 5 dias no colo: quer entregá-lo para
   adoção. Um casal conhecido da família já lavrou "declaração
   de entrega" em cartório e espera no corredor. O caminho que
   parece humano (entregar direto ao casal) é a armadilha; o
   caminho legal (escuta, sigilo, cadastro) é o que protege a
   criança, a mãe — e a próxima mãe que pensar em procurar
   o fórum em vez do abandono.

   Fundamentos centrais: ECA, art. 19-A e §§ (Lei 13.509/2017);
   ECA, art. 50, §13 (hipóteses taxativas de adoção fora do
   cadastro); ECA, art. 101; sigilo da entrega (art. 19-A, §9º);
   ECA, art. 8º, §§ 4º e 5º (assistência psicológica à mãe).
   ============================================================ */

window.TOGA = window.TOGA || {};
TOGA.casos.push({
  id: "entrega",
  titulo: "Plantão — A entrega",
  subtitulo: "Cinco dias de vida, uma declaração de cartório e uma mãe que pede para fazer certo. O que a lei entrega a cada um?",
  area: "Plantão Judiciário — Infância e Juventude",
  hora: "21:40",
  duracaoPrevistaMin: 35,
  tensao: 9,

  personagens: [
    { id: "rosa", nome: "Rosa", papel: "Mãe", assento: "centro",
      avatar: { pele: "#c98e66", cabelo: "longo", corCabelo: "#241505", traje: "camisa", corTraje: "#7a6a58" } },
    { id: "jacira", nome: "Sra. Jacira", papel: "Conselheira Tutelar", assento: "esq1",
      avatar: { pele: "#8a5436", cabelo: "coque", corCabelo: "#1d1208", traje: "camisa", corTraje: "#2f4a3e" } },
    { id: "tomas", nome: "Dr. Tomás", papel: "Promotor", assento: "esq2",
      avatar: { pele: "#d8a87f", cabelo: "curto", corCabelo: "#241a10", traje: "terno", corTraje: "#33424f", corGravata: "#5a2e2e" } },
    { id: "leda", nome: "Dra. Leda", papel: "Psicóloga do Juízo", assento: "dir1",
      avatar: { pele: "#e8c39a", cabelo: "coque", corCabelo: "#574737", traje: "blazer", corTraje: "#54453a", corBlusa: "#e8e2d2", oculos: true } },
    { id: "otto", nome: "Sr. Otto", papel: "Interessado", assento: "dir2",
      avatar: { pele: "#d8a87f", cabelo: "calvo", corCabelo: "#9a8f80", traje: "camisa", corTraje: "#4a4438", barba: true, oculos: true } }
  ],

  autos: {
    resumo: "Plantão judiciário, 21h40. Rosa, 19 anos, é trazida pelo Conselho Tutelar com o filho recém-nascido (5 dias de vida) no colo: manifesta a intenção de entregá-lo para adoção. O genitor não foi declarado. Um casal conhecido de sua antiga patroa — Sr. Otto e Sra. Neide, presentes no fórum — ofereceu-se para ficar com a criança e lavrou 'declaração de entrega' em cartório de notas. A equipe técnica do plantão está de sobreaviso. Procedimento do art. 19-A do ECA (Lei 13.509/2017).",
    pecas: [
      { id: "termo", titulo: "Termo de Atendimento do Conselho Tutelar",
        texto: "Termo nº 114/2026 — Plantão. Atendida ROSA, 19 anos, acompanhada do filho recém-nascido (5 dias de vida). Relata não ter condições de criar a criança; afirma que o genitor é desconhecido e que não deseja indicar familiares. Informa que o casal Otto e Neide, conhecidos de sua antiga patroa, ofereceu-se para ficar com o bebê e lavrou declaração em cartório. A jovem chorou durante todo o atendimento e repetiu três vezes a mesma frase: “eu só quero que ele tenha o que eu não tive”. Diante da manifestação de entrega, este Conselho a encaminha ao plantão judiciário, na forma do art. 19-A do ECA. A criança apresenta bom estado geral, alimentada e agasalhada." },
      { id: "declaracao", titulo: "“Declaração de Entrega” (cartório)",
        texto: "DECLARAÇÃO — Eu, ROSA M. S., brasileira, solteira, 19 anos, declaro, de livre e espontânea vontade, que entrego meu filho recém-nascido, nascido em 06/06/2026, aos cuidados definitivos do casal OTTO W. e NEIDE W., pessoas de bem e de minha confiança, para que o criem e eduquem como filho, renunciando eu a qualquer direito sobre a criança. As partes se comprometem a regularizar a situação oportunamente, perante quem de direito.\n\n[Cartório do 2º Ofício de Notas — reconhecimento de firmas por autenticidade. Selo digital nº 0042.7781. Emolumentos recolhidos.]" },
      { id: "saude", titulo: "Relatório de Alta da Maternidade",
        texto: "Maternidade Santa Clara — Relatório de Alta. RN de R.M.S., sexo masculino, nascido a termo, 3.110 g, Apgar 9/10, alta em boas condições clínicas no 3º dia. A puérpera, 19 anos, evoluiu sem intercorrências físicas, porém apresentou choro persistente e verbalizou, desde o primeiro dia, a intenção de entregar o filho. Não recebeu atendimento psicológico durante a internação, por indisponibilidade de profissional no período. Permaneceu sem acompanhante durante toda a internação; não há rede de apoio familiar identificada. Recomenda-se acionamento da rede de proteção e da Justiça da Infância." },
      { id: "nota", titulo: "Nota da Equipe Técnica do Plantão",
        texto: "Nota Técnica — Plantão Judiciário da Infância e Juventude. A equipe interprofissional está disponível para realizar, ainda nesta noite, a escuta da genitora prevista no art. 19-A, §1º, do ECA, com relatório imediato a este Juízo, considerando inclusive os efeitos do estado puerperal. Registra-se desde logo: (i) a entrega voluntária de filho para adoção é DIREITO da mãe, com sigilo garantido sobre o nascimento (art. 19-A, §9º); (ii) o casal interessado não é habilitado no Sistema Nacional de Adoção e Acolhimento e não se enquadra em nenhuma das hipóteses do art. 50, §13, do ECA — não é parente da criança nem detém sua tutela ou guarda legal; (iii) há candidatos habilitados aptos ao perfil de recém-nascido na comarca, com possibilidade de guarda provisória imediata, ainda nesta noite; (iv) nos termos do art. 8º, §§ 4º e 5º, do ECA, a mãe que manifesta interesse em entregar o filho tem direito a assistência psicológica pela rede pública — antes e depois da decisão." }
    ]
  },

  focos: [
    { id: "f_escuta", rotulo: "A escuta que a lei garante", dica: "Antes de qualquer destino, alguém precisa ouvir Rosa — quem, como e com que garantia? (ECA, art. 19-A, §§ 1º e 9º)",
      grifos: [{ peca: "nota", trecho: "escuta da genitora prevista no art. 19-A, §1º, do ECA" },
               { peca: "nota", trecho: "sigilo garantido sobre o nascimento (art. 19-A, §9º)" }] },
    { id: "f_cartorio", rotulo: "A declaração de cartório", dica: "Firma reconhecida prova que alguém assinou — não torna lícito o que foi assinado. O que esse papel promete que ele não pode cumprir?",
      grifos: [{ peca: "declaracao", trecho: "aos cuidados definitivos do casal OTTO W. e NEIDE W." },
               { peca: "declaracao", trecho: "regularizar a situação oportunamente" }] },
    { id: "f_cadastro", rotulo: "O cadastro e as exceções", dica: "Adoção fora do cadastro só nas hipóteses taxativas do art. 50, §13, do ECA. O casal se encaixa em alguma?",
      grifos: [{ peca: "nota", trecho: "não se enquadra em nenhuma das hipóteses do art. 50, §13, do ECA" },
               { peca: "nota", trecho: "há candidatos habilitados aptos ao perfil de recém-nascido na comarca" }] },
    { id: "f_rosa", rotulo: "O estado de Rosa", dica: "Cinco dias após o parto, sem acompanhante e sem psicólogo. O ECA também protege a mãe que entrega (art. 8º, §§ 4º e 5º).",
      grifos: [{ peca: "saude", trecho: "Não recebeu atendimento psicológico durante a internação" },
               { peca: "saude", trecho: "não há rede de apoio familiar identificada" }] }
  ],

  /* ---------- arco emocional ---------- */
  arco: {
    antes: { emocao: "vergonha", gesto: "angustia" },
    depois: [
      { se: function (f) { return f.entregaLegal && f.maeAcompanhada; }, tom: "bom", gesto: "abraco",
        falas: [
          { quem: "rosa", emocao: "choro", texto: "Eu entrei aqui achando que ia sair me sentindo um lixo, doutor. Eu saí me sentindo mãe. Uma mãe que escolheu proteger." },
          { quem: "leda", emocao: "feliz", texto: "A família habilitada chegou em quarenta minutos, Excelência. Choraram os três — eles dois e o bebê. E quinta-feira a Rosa tem consulta marcada no CAPS. Já está agendado." }
        ] },
      { se: function (f) { return !f.entregaLegal && !f.adocaoDireta; }, tom: "neutro",
        falas: [
          { quem: "jacira", emocao: "triste", texto: "Arranjei um colchão na sede do Conselho para a Rosa e o bebê até segunda, Excelência. Não é solução. É só sábado e domingo." }
        ] },
      { se: function (f) { return !!f.adocaoDireta; }, tom: "grave",
        falas: [
          { quem: "tomas", emocao: "firme", texto: "O recurso do Ministério Público sobe amanhã às nove, Excelência. E o pedido de busca e apreensão da criança, junto. Era a única coisa que esta noite não precisava produzir." },
          { quem: "jacira", emocao: "triste", texto: "Eu vi a Rosa na saída. Ela não chorava mais. É esse silêncio que me assusta." }
        ] }
    ]
  },

  vidasTocadas: [
    { se: function (f) { return f.entregaLegal && f.maeAcompanhada; }, tom: "bom",
      texto: "O menino dormiu a primeira noite num berço esperado havia quatro anos por uma família do cadastro. Rosa dormiu a primeira noite em cinco dias — com consulta marcada e o sigilo que a lei lhe deve." },
    { se: "casalOrientado", tom: "bom",
      texto: "Otto e Neide protocolaram o pedido de habilitação na segunda-feira seguinte. O enxoval ficou guardado no armário — esperando a vez certa de servir." },
    { se: "maeHumilhada", tom: "grave",
      texto: "A frase dita do alto da mesa — “mãe não desiste de filho” — Rosa vai repetir de cabeça baixa por anos. E a próxima mãe da comarca, sabendo como o fórum recebe, talvez escolha a porta de uma igreja, de madrugada." },
    { se: "adocaoDireta", tom: "grave",
      texto: "Um recém-nascido virou objeto de disputa: busca e apreensão, recurso, laços feitos para serem desfeitos. A fila que existia para protegê-lo foi a única coisa que ninguém respeitou." },
    { se: function (f) { return !f.entregaLegal && !f.adocaoDireta; }, tom: "grave",
      texto: "Cinco dias de vida e nenhuma definição: um fim de semana inteiro num colchão emprestado do Conselho, à espera de uma vara que só abre segunda-feira." }
  ],

  inicio: "e1",
  cenas: {

    /* ---------- ABERTURA: O PLANTÃO ---------- */
    e1: {
      falas: [
        { quem: "narrador", texto: "21h40. O fórum está apagado, exceto a sala do plantão. Rosa entra com um embrulho de manta no colo — o bebê dorme. Atrás dela, a conselheira tutelar. No corredor, sob a luz fria, um casal de meia-idade espera de mãos dadas: Sr. Otto e a esposa, que segura uma bolsa de enxoval nova." },
        { quem: "jacira", emocao: "firme", texto: "Excelência, desculpe a hora. Eu podia ter deixado para segunda — mas conselheira que deixa recém-nascido para segunda não dorme. A Rosa quer entregar o filho para adoção. E tem um casal aí fora com um papel de cartório dizendo que a criança já é deles." },
        { quem: "rosa", emocao: "vergonha", texto: "Eu não vim abandonar ele, doutor. Eu vim fazer certo. Mas se o senhor for falar que eu sou um monstro... pode falar. Todo mundo já falou." }
      ],
      decisao: {
        prompt: "Rosa está de pé à sua frente, com o bebê no colo. Por onde começa o plantão?",
        opcoes: [
          { rotulo: "Ponderar com Rosa, antes de tudo, que 'mãe não desiste de filho' — e que ela precisa medir o peso do que está prestes a fazer",
            fundamento: "Apelo à reflexão e à maternidade responsável",
            efeitos: { hum: -8, imp: -4, tempo: 5 },
            setFlags: { maeHumilhada: true },
            reacoes: [
              { quem: "rosa", emocao: "medo", texto: "..." },
              { quem: "leda", emocao: "firme", texto: "Excelência, com todo o respeito: é exatamente essa frase que faz mães deixarem bebês em portas de igreja, de madrugada, em vez de trazê-los a esta sala. Rosa veio. Isso já é o contrário de desistir." }
            ],
            feedback: { acerto: "grave", titulo: "O sermão que esvazia o fórum",
              texto: "A entrega voluntária para adoção é um <b>direito</b> da mãe — o art. 19-A do ECA (Lei 13.509/2017) existe precisamente porque, antes dele, mães sem saída resolviam sozinhas: abandono inseguro, entrega clandestina, recém-nascidos em terrenos baldios. Julgar moralmente quem procura a Justiça é revitimização — e tem efeito sistêmico: cada Rosa humilhada no plantão é uma futura mãe que não virá. O juiz da infância não é guardião da maternidade alheia; é garantidor de um procedimento que protege a criança E a mãe." },
            proxima: "e2" },

          { rotulo: "Chamar o casal e a declaração à mesa: se há quem queira a criança e a mãe concorda, o caminho mais curto é o melhor para o bebê",
            fundamento: "Celeridade e concretude do lar disponível",
            efeitos: { tec: -4, cel: 2, tempo: 4 },
            reacoes: [
              { quem: "otto", emocao: "feliz", texto: "Está tudo assinado, doutor. A Neide fez até o enxoval. É só o senhor mandar." },
              { quem: "tomas", emocao: "firme", texto: "Antes do casal, Excelência, o Ministério Público lembra: a lei manda ouvir primeiro a mãe — pela equipe técnica, não pela mesa de audiência. A ordem dos passos não é detalhe." }
            ],
            feedback: { acerto: "ruim", titulo: "A ordem dos passos é a própria proteção",
              texto: "O procedimento do art. 19-A do ECA tem uma sequência deliberada: primeiro a mãe é <b>ouvida pela equipe interprofissional</b> (§1º), que avalia inclusive os efeitos do estado puerperal; só depois o juiz decide o destino da criança. Começar pelo casal e pelo papel inverte tudo: transforma a mãe em coadjuvante da própria entrega e dá ao documento de cartório um protagonismo que a lei nega. O atalho aqui não é celeridade — é supressão de garantia." },
            proxima: "e2" },

          { rotulo: "Suspender a sala: determinar que a Dra. Leda ouça Rosa em particular, agora, com registro sigiloso — e garantir a ela, em voz alta, que nesta sala ninguém a julgará",
            fundamento: "ECA, art. 19-A, §§ 1º e 9º — escuta pela equipe interprofissional e sigilo",
            efeitos: { tec: 6, hum: 7, tempo: 8 },
            carimbo: "ESCUTA DETERMINADA",
            setFlags: { escutaFeita: true },
            reacoes: [
              { quem: "leda", emocao: "feliz", texto: "Há uma sala reservada ao lado, Excelência. Vinte minutos e o senhor tem meu relatório." },
              { quem: "rosa", emocao: "surpresa", texto: "Ninguém... ninguém tinha perguntado ainda o que eu sinto. Só o que eu ia fazer." },
              { quem: "jacira", emocao: "feliz", texto: "Vai lá, menina. Eu seguro ele." }
            ],
            feedback: { acerto: "otimo", titulo: "Primeiro a escuta, depois a caneta",
              texto: "É o desenho exato do art. 19-A, §1º, do ECA: a mãe que manifesta interesse em entregar o filho será <b>ouvida pela equipe interprofissional</b>, que apresenta relatório ao juiz considerando inclusive os efeitos do estado puerperal. E o §9º garante o <b>sigilo sobre o nascimento</b> — dito em voz alta, vira segurança real para quem chegou com vergonha. A escuta não é etapa burocrática: é o que distingue uma decisão livre de um gesto de desespero, e é o que permite ao juiz decidir sabendo, e não supondo." },
            proxima: "e2" }
        ]
      }
    },

    /* ---------- O PAPEL DO CARTÓRIO ---------- */
    e2: {
      falas: [
        { quem: "narrador", texto: "Sr. Otto pede a palavra e se aproxima da mesa, desdobrando o papel do cartório com cuidado de quem carrega um documento sagrado. O selo digital brilha sob a luz do plantão." },
        { quem: "otto", emocao: "neutro", texto: "Doutor, nós não somos gente de comprar criança, Deus me livre. A Neide não pôde ter filho. A Rosa confia na gente. Está tudo aqui, com firma reconhecida, pago o emolumento. Por que complicar o que o coração já resolveu?" },
        { quem: "tomas", emocao: "firme", texto: "O Ministério Público não duvida da boa-fé do casal, Excelência. Mas consigna: declaração de cartório não é processo de adoção. Não há habilitação, não há estudo psicossocial, não há cadastro. Há um papel — e um recém-nascido." }
      ],
      decisao: {
        prompt: "A 'declaração de entrega' está sobre a mesa, com firma reconhecida. Que valor ela tem?",
        opcoes: [
          { rotulo: "Deferir guarda provisória 'de fato' ao casal, ad referendum da vara da infância, determinando que regularizem a adoção oportunamente",
            fundamento: "ECA, art. 33 — guarda como regularização da posse de fato",
            efeitos: { tec: -5, hum: 1, cel: 2, tempo: 5 },
            carimbo: "GUARDA DE FATO",
            reacoes: [
              { quem: "otto", emocao: "feliz", texto: "Deus abençoe, doutor!" },
              { quem: "tomas", emocao: "raiva", texto: "O Ministério Público impugna e recorrerá, Excelência. Guarda 'provisória de fato' é a porta de sempre do fato consumado: daqui a um ano, o argumento será o vínculo que esta decisão mesma criou." }
            ],
            feedback: { acerto: "ruim", titulo: "A guarda como atalho é desvio de finalidade",
              texto: "A guarda do art. 33 do ECA regulariza situações de fato consolidadas — não serve para <b>criar</b> uma situação de fato e driblar o cadastro de adoção. A jurisprudência do STJ repele com constância a guarda deferida como antecâmara de adoção dirigida: gera vínculo sem nenhuma avaliação prévia do casal e arma o 'fato consumado' que depois constrange o próprio Judiciário. Com 5 dias de vida, não há laço a preservar — há fila a respeitar e criança a proteger." },
            proxima: "e3" },

          { rotulo: "Explicar ao casal, com respeito, por que a lei veda a entrega direta — as hipóteses do art. 50, §13, são taxativas e não os alcançam — e orientá-los a buscar habilitação no Sistema Nacional de Adoção",
            fundamento: "ECA, art. 50, §13; art. 197-A — habilitação de pretendentes",
            requerFoco: "f_cadastro",
            efeitos: { tec: 8, hum: 6, tempo: 7 },
            carimbo: "DECLARAÇÃO SEM EFEITO",
            setFlags: { casalOrientado: true },
            reacoes: [
              { quem: "otto", emocao: "triste", texto: "Então o papel... não vale nada. A Neide vai chorar a semana inteira, doutor." },
              { quem: "otto", emocao: "neutro", texto: "Mas o senhor diz que existe um jeito certo. Se a fila é de gente igual a nós... a gente entra na fila." },
              { quem: "leda", emocao: "feliz", texto: "A equipe pode entregar ao casal, hoje mesmo, o roteiro da habilitação, Excelência. Curso de preparação, estudo psicossocial. Quem quer bem de verdade, costuma ir até o fim." }
            ],
            feedback: { acerto: "otimo", titulo: "Dizer não sem fabricar vilões",
              texto: "O art. 50, §13, do ECA admite adoção por quem <b>não</b> está no cadastro em hipóteses <b>taxativas</b>: adoção unilateral, pedido de parente com vínculo de afinidade e afetividade, ou de quem já detém tutela ou guarda legal de criança maior de 3 anos. Otto e Neide — conhecidos da antiga patroa, sem parentesco, sem guarda — não se enquadram em nenhuma. A firma reconhecida prova a assinatura, não a licitude do conteúdo: ninguém dispõe do estado de filiação por escritura. Explicar isso com respeito preserva a boa-fé do casal e a converte no caminho certo: a habilitação do art. 197-A, com avaliação e preparação. O cadastro não é burocracia — é a única triagem que o recém-nascido terá." },
            proxima: "e3" },

          { rotulo: "Homologar a declaração e entregar a criança ao casal ainda hoje: vontade da mãe somada a um lar concreto vale mais que uma fila abstrata",
            fundamento: "Autonomia da vontade e melhor interesse 'in concreto'",
            efeitos: { tec: -10, hum: -4, imp: -6, tempo: 6 },
            carimbo: "ENTREGA HOMOLOGADA",
            setFlags: { adocaoDireta: true },
            reacoes: [
              { quem: "tomas", emocao: "raiva", texto: "O Ministério Público impugna NA ATA, Excelência: entrega direta fora das hipóteses do art. 50, §13, é nula. Amanhã cedo peço a busca e apreensão da criança — e o senhor sabe que vou obtê-la." },
              { quem: "rosa", emocao: "medo", texto: "Busca e apreensão?... Vão arrancar ele de lá depois que ele já estiver lá?" }
            ],
            feedback: { acerto: "grave", titulo: "A adoção à brasileira de toga",
              texto: "Entrega direta <b>intuitu personae</b> fora das hipóteses do art. 50, §13, do ECA é nula — e homologá-la não a convalida: judicializa a ilegalidade. O casal não passou por nenhuma avaliação; a criança não terá estudo psicossocial; a fila de habilitados — pessoas avaliadas e preparadas, esperando anos — é burlada por quem chegou primeiro à mãe certa na hora frágil. A Lei 13.509/2017 criou o procedimento do art. 19-A exatamente para fechar essa porta, porque é por ela que passam também a devolução de crianças e o tráfico. A boa intenção do casal não muda o destino da decisão: reforma certa, criança disputada, vínculos feitos para serem rompidos." },
            proxima: "e3p" }
        ]
      }
    },

    /* ---------- RAMO DO ERRO: A HOMOLOGAÇÃO ---------- */
    e3p: {
      falas: [
        { quem: "narrador", texto: "O carimbo ainda nem secou. A Sra. Neide, no corredor, já chora abraçada à bolsa de enxoval. Dentro da sala, ninguém se levanta para cumprimentar ninguém." },
        { quem: "leda", emocao: "firme", texto: "Excelência, um registro antes de a ata fechar: Rosa não foi ouvida pela equipe — e a lei diz que essa escuta vem antes de qualquer destino. O relatório leva vinte minutos. A reconsideração, um." },
        { quem: "tomas", emocao: "firme", texto: "O Ministério Público formaliza, em ata, pedido de reconsideração imediata. Ainda dá para esta noite terminar dentro da lei, Excelência." }
      ],
      decisao: {
        prompt: "O Ministério Público e a equipe técnica pedem reconsideração. A ata ainda está aberta.",
        opcoes: [
          { rotulo: "Manter a homologação: 'a criança já tem colo, e a Justiça não vai arrancá-la dele por formalismo'",
            fundamento: "Estabilidade das decisões judiciais",
            efeitos: { tec: -8, hum: -6, imp: -5, tempo: 4 },
            carimbo: "DECISÃO MANTIDA",
            setFlags: { manchaGrave: true },
            reacoes: [
              { quem: "tomas", emocao: "raiva", texto: "Não é formalismo, Excelência. O cadastro é a única porta que separa a adoção do comércio de crianças. O recurso sobe amanhã às nove." },
              { quem: "jacira", emocao: "triste", texto: "E quem explica à Sra. Neide, daqui a um mês, que o bebê que ela embalou vai sair de casa num mandado?" }
            ],
            feedback: { acerto: "grave", titulo: "O erro mantido é escolha, não acidente",
              texto: "Nenhuma preclusão impede o juiz de plantão de reconsiderar, na mesma ata, decisão manifestamente contrária à lei. Manter a entrega direta multiplica os danos com juros: a criança cria vínculo com quem provavelmente a perderá na busca e apreensão; o casal de boa-fé é exposto ao pior luto que existe; Rosa fica sem escuta, sem sigilo e sem acompanhamento. O 'colo concreto' era o argumento — mas colo sem avaliação é exatamente o risco que o art. 50, §13, do ECA existe para filtrar." },
            proxima: "fim_grave" },

          { rotulo: "Reconsiderar em ata: tornar sem efeito a homologação e instaurar, agora, o procedimento do art. 19-A — começando pela escuta de Rosa",
            fundamento: "ECA, art. 19-A, §1º; autotutela judicial",
            efeitos: { tec: 5, hum: 5, tempo: 7 },
            carimbo: "RECONSIDERADO",
            setFlags: { adocaoDireta: false, escutaFeita: true, reconsiderouEntrega: true },
            reacoes: [
              { quem: "leda", emocao: "feliz", texto: "Levo a Rosa à sala reservada agora, Excelência. Vinte minutos." },
              { quem: "otto", emocao: "triste", texto: "Então a gente espera. Do jeito certo. Só peço que alguém explique à Neide com calma, doutor. Ela já tinha dado nome." }
            ],
            feedback: { acerto: "bom", titulo: "Voltar atrás a tempo ainda é jurisdição",
              texto: "A reconsideração imediata desfez o ato antes de ele produzir o pior dos efeitos: o vínculo de fato que depois ninguém consegue desatar sem dor. O procedimento do art. 19-A retoma seu curso — escuta da mãe pela equipe (§1º), relatório, decisão informada. Fica a cicatriz: um casal de boa-fé teve a esperança carimbada e retirada na mesma noite. O custo de errar e corrigir é sempre menor que o de errar e insistir — mas não é zero." },
            proxima: "e3" }
        ]
      }
    },

    /* ---------- O DESTINO ---------- */
    e3: {
      falas: [
        { quem: "narrador", texto: "22h10. A Dra. Leda volta da sala reservada com duas folhas manuscritas. Rosa entra atrás, os olhos inchados mas o passo firme. O bebê dorme no colo da conselheira." },
        { quem: "leda", emocao: "firme", texto: "Excelência, a conclusão da equipe: a decisão de Rosa é livre, firme e refletida — e não nasce de desamor, nasce de cuidado. Ela não indica o genitor nem família extensa. E pede uma única coisa: sigilo." },
        { quem: "rosa", emocao: "firme", texto: "Eu segurei ele cinco noites pra ter certeza, doutor. Eu tenho. Quero que ele tenha família de verdade — e quero poder, um dia, andar nessa cidade sem todo mundo me apontando." }
      ],
      decisao: {
        prompt: "Cinco dias de vida, uma decisão firme, uma noite de plantão. O que a Justiça entrega a cada um?",
        opcoes: [
          { rotulo: "Ponderar com Rosa que leve o bebê para casa por uma semana: 'pense melhor — entrega não tem volta, arrependimento de mãe não tem remédio'",
            fundamento: "Prudência judicial e irreversibilidade da entrega",
            efeitos: { tec: -6, hum: -7, tempo: 5 },
            setFlags: { maePressionada: true },
            reacoes: [
              { quem: "rosa", emocao: "choro", texto: "Pra casa? Doutor... eu não TENHO casa. Eu tenho um quarto cedido até sexta-feira." },
              { quem: "leda", emocao: "firme", texto: "Excelência, é exatamente essa pressão que o art. 19-A quis tirar de cima dela. Mãe pressionada não desiste da entrega — desiste da Justiça. E aí entrega do jeito que ninguém vê." }
            ],
            feedback: { acerto: "grave", titulo: "A 'segunda chance' que empurra para o abandono",
              texto: "A premissa é falsa: a entrega legal <b>tem</b> volta. O consentimento é colhido em audiência e é retratável (ECA, art. 166, §5º), e o art. 19-A, §8º, prevê expressamente a hipótese de desistência — a criança fica com a mãe, com acompanhamento pela rede. A lei já protege o arrependimento; a pressão do juiz não acrescenta proteção nenhuma, só risco: devolver à rua uma puérpera sem casa, sem rede e sem escuta é a receita documentada do abandono inseguro — o exato cenário que a Lei 13.509/2017 veio impedir. Respeitar a decisão dela não é frieza; é o que mantém aberta a porta do fórum para a próxima Rosa." },
            proxima: "fim_grave" },

          { rotulo: "Lavrar termo de comparecimento e remeter tudo à vara da infância na segunda-feira: plantão não é sede para decisão dessa magnitude",
            fundamento: "Juiz natural e cognição exauriente da vara especializada",
            efeitos: { tec: -3, hum: -5, cel: -2, tempo: 3 },
            carimbo: "REMETIDO À VARA",
            reacoes: [
              { quem: "jacira", emocao: "triste", texto: "E até segunda, Excelência, o bebê fica onde? Com quem? O Conselho não tem berço. Eu tenho um colchão e boa vontade." },
              { quem: "rosa", emocao: "medo", texto: "Mais dois dias todo mundo me olhando com ele no colo... Eu não sei se eu aguento, doutor." }
            ],
            feedback: { acerto: "ruim", titulo: "O plantão existe para o que não pode esperar",
              texto: "A vara da infância fará o que lhe cabe — mas recém-nascido de 5 dias sem destino definido é a definição de urgência, e urgência é a razão de ser do plantão. As medidas protetivas do art. 101 do ECA e os atos do art. 19-A (escuta, consentimento, guarda provisória) cabem no plantão precisamente porque adiá-los gera risco: uma puérpera sem rede, exposta por 60 horas à pressão de todos os lados — inclusive do casal interessado. Invocar o juiz natural para não decidir o urgente é usar uma garantia como escudo da omissão." },
            proxima: "fim_medio" },

          { rotulo: "Realizar agora a audiência: colher o consentimento formal de Rosa perante a equipe e o MP; decretar SIGILO sobre o nascimento; deferir guarda provisória à família habilitada do Cadastro Nacional; e determinar o acompanhamento psicológico de Rosa pela rede pública",
            fundamento: "ECA, arts. 19-A, §§ 4º, 5º e 9º; 166; 101; e 8º, §§ 4º e 5º",
            efeitos: { tec: 9, hum: 9, tempo: 10 },
            carimbo: "ENTREGA LEGAL",
            setFlags: { entregaLegal: true, maeAcompanhada: true },
            reacoes: [
              { quem: "tomas", emocao: "feliz", texto: "O Ministério Público nada opõe — registro o contrário, Excelência: é a primeira vez que vejo, num plantão, o art. 19-A aplicado por inteiro." },
              { quem: "rosa", emocao: "choro", texto: "Ele vai ter família de verdade... e eu vou poder existir de novo. Era só isso que eu vim pedir." },
              { quem: "leda", emocao: "feliz", texto: "A técnica já está ligando para a família habilitada, Excelência. E a consulta da Rosa no CAPS fica agendada para quinta." }
            ],
            feedback: { acerto: "otimo", titulo: "A entrega que a lei desenhou — peça por peça",
              texto: "Cada determinação tem endereço: o consentimento é manifestado <b>em audiência, após o nascimento</b> (ECA, art. 19-A, §5º, c/c art. 166), permanecendo retratável (art. 166, §5º) — direito, não ameaça. Não havendo indicação do genitor nem de família extensa apta, a criança vai à <b>guarda provisória de quem está habilitado</b> no cadastro (art. 19-A, §4º), com a ação de adoção em 15 dias (§7º). O <b>sigilo sobre o nascimento</b> é garantia expressa (§9º). E a mãe não sai da equação ao assinar o termo: o art. 8º, §§ 4º e 5º, assegura assistência psicológica justamente à gestante ou mãe que entrega o filho. Resultado: criança avaliada e protegida, fila respeitada, mãe acompanhada — e a notícia, na comarca, de que procurar o fórum funciona." },
            proxima: "fim_otimo" }
        ]
      }
    },

    /* ---------- FINS ---------- */
    fim_otimo: {
      falas: [
        { quem: "narrador", texto: "23h05. A família habilitada atende ao segundo toque do telefone — esperavam havia quatro anos. Rosa beija a testa do filho, demora três segundos a mais que o necessário, e o entrega à Dra. Leda sem que ninguém precise dizer nada." },
        { quem: "otto", emocao: "triste", texto: "A senhora foi corajosa, moça. A gente vai entrar na fila. Do jeito certo." },
        { quem: "rosa", emocao: "triste", texto: "Cuida dele, doutor. O senhor não... mas a Justiça. A Justiça agora cuida." }
      ],
      fim: {
        titulo: "A ENTREGA QUE A LEI PROTEGE",
        selo: "otimo",
        setFlags: { entregaLegal: true, maeAcompanhada: true },
        texto: "Em uma noite de plantão, o procedimento que a Lei 13.509/2017 desenhou aconteceu inteiro: escuta sem julgamento, consentimento em audiência, sigilo decretado, criança encaminhada a uma família avaliada e preparada, mãe com consulta marcada. Ninguém saiu desta sala como entrou — nem Rosa, que veio esperando um sermão e levou um direito; nem o casal, que veio com um papel nulo e saiu com um caminho. A fila do cadastro andou uma posição. E a próxima mãe da comarca que não tiver saída ficará sabendo que existe uma porta com luz acesa — é exatamente para isso que o art. 19-A existe."
      }
    },

    fim_medio: {
      falas: [
        { quem: "narrador", texto: "O termo de comparecimento é lavrado em três vias. No corredor, a conselheira liga para a sede do Conselho pedindo que separem um colchão. Rosa ajeita a manta do bebê e olha para a porta da sala — que já se fechou." }
      ],
      fim: {
        titulo: "ATÉ SEGUNDA-FEIRA",
        selo: "bom",
        texto: "Nada de ilegal foi assinado esta noite — e quase nada foi decidido. A vara da infância receberá o caso na segunda-feira e provavelmente fará tudo certo: escuta, audiência, cadastro. Mas entre esta noite e a segunda-feira existem sessenta horas, um colchão emprestado, uma puérpera sem rede de apoio e um casal bem-intencionado a um telefonema de distância. O plantão tinha equipe de sobreaviso, promotor presente e a lei inteira à disposição. A urgência que justificava acordar o fórum era real; a resposta ficou para o horário comercial."
      }
    },

    fim_grave: {
      falas: [
        { quem: "narrador", texto: "O plantão se apaga. Em algum lugar da comarca, um recém-nascido de cinco dias dorme esta noite numa casa que a Justiça não avaliou — ou num quarto cedido até sexta-feira. As duas coisas têm o mesmo nome técnico: risco." },
        { quem: "jacira", emocao: "triste", texto: "Eu trouxe a Rosa aqui pra ela não precisar resolver isso sozinha, Excelência. Ela vai resolver sozinha do mesmo jeito. Só que agora sabendo que o fórum não era o lugar." }
      ],
      fim: {
        titulo: "A FILA QUE NINGUÉM VIU",
        selo: "grave",
        setFlags: { adocaoDireta: true, manchaGrave: true },
        texto: "A Lei 13.509/2017 criou a entrega legal com uma finalidade única: impedir que mães sem saída e casais apressados resolvam no escuro o destino de um recém-nascido. Esta noite, o fórum estava aberto, a equipe de sobreaviso, o cadastro com famílias prontas — e o desfecho foi o que a lei existe para evitar: uma criança fora do caminho desenhado para protegê-la, um casal de boa-fé exposto à busca e apreensão, uma mãe sem escuta e sem sigilo. O Ministério Público recorrerá, e ganhará. Mas recurso nenhum devolve a esta comarca o que se perdeu primeiro: a confiança de que vale a pena bater na porta da Justiça antes de bater em qualquer outra."
      }
    }
  }
});
