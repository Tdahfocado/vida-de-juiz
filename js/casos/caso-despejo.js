/* ============================================================
   CASO: DESPEJO — "A casa da família de Cleide"
   ------------------------------------------------------------
   Ação de despejo por falta de pagamento: a locatária está
   desempregada com três filhos; o locador é um aposentado que
   vive DO aluguel. As duas pontas são vulneráveis — e é
   exatamente aí que a conciliação judicial mostra para que
   serve um juiz.

   Fundamentos: Lei 8.245/91 (arts. 9º, 59, 62); CPC, art. 334;
   rede municipal de aluguel social.
   ============================================================ */

window.TOGA = window.TOGA || {};
TOGA.casos.push({
  id: "despejo",
  titulo: "Cível — A casa da família de Cleide",
  subtitulo: "Ela não tem como pagar. Ele não tem como esperar. A lei daria o despejo; a Justiça pode dar mais.",
  area: "Cível / Locações",
  hora: "13:30",
  duracaoPrevistaMin: 60,
  tensao: 4,

  personagens: [
    { id: "cleide", nome: "Dona Cleide", papel: "Locatária (ré)", assento: "centro",
      avatar: { pele: "#8a5436", cabelo: "coque", corCabelo: "#241505", traje: "camisa", corTraje: "#5a4a52" } },
    { id: "estevao", nome: "Dr. Estêvão", papel: "Defensor Público", assento: "esq1",
      avatar: { pele: "#d8a87f", cabelo: "curto", corCabelo: "#241a10", traje: "terno", corTraje: "#2f4a3e", corGravata: "#33424f" } },
    { id: "aurelio", nome: "Sr. Aurélio", papel: "Locador (autor)", assento: "dir2",
      avatar: { pele: "#e8c39a", cabelo: "calvo", corCabelo: "#777268", traje: "camisa", corTraje: "#54453a", oculos: true } },
    { id: "flavio", nome: "Dr. Flávio", papel: "Advogado do autor", assento: "dir1",
      avatar: { pele: "#c98e66", cabelo: "curto", corCabelo: "#3a2a1a", traje: "terno", corTraje: "#33424f", corGravata: "#7a2e2e" } }
  ],

  autos: {
    resumo: "Ação de despejo por falta de pagamento c/c cobrança (Lei 8.245/91, art. 9º, III): cinco meses de aluguéis em atraso (R$ 4.250,00). A ré, desempregada desde o fechamento da confecção onde trabalhava, mora no imóvel com três filhos em idade escolar. O autor, 72 anos, tem no aluguel sua complementação de renda.",
    pecas: [
      { id: "inicial", titulo: "Petição inicial",
        texto: "O autor, aposentado com um salário mínimo, alugou seu único outro imóvel para complementar a renda — o aluguel paga seus remédios de uso contínuo. Está há CINCO meses sem receber (R$ 4.250,00). Requer a rescisão, o despejo — inclusive liminar (art. 59, §1º, IX) — e a condenação ao pagamento." },
      { id: "contestacao", titulo: "Contestação da Defensoria",
        texto: "A ré jamais atrasou um aluguel em 4 anos de contrato, até o fechamento da confecção, fato documentado (rescisão anexa). Está inscrita em processo seletivo de emprego com promessa de vaga em 60 dias e em cadastro do ALUGUEL SOCIAL municipal. Três filhos (8, 11 e 14) estudam na escola do bairro. Requer prazo digno e manifesta INTENÇÃO DE PURGAR A MORA de forma parcelada (art. 62, II), tão logo empregada." },
      { id: "social", titulo: "Ofício — Programa Aluguel Social",
        texto: "O Município informa: a ré está HABILITADA no programa de aluguel social (subsídio de até R$ 700,00 mensais por 12 meses), aguardando apenas: (i) comprovação de risco habitacional — que ordem judicial de desocupação caracteriza; e (ii) conta ativa de locação. O benefício pode ser direcionado ao CONTRATO ATUAL, mediante anuência do locador, regularizando os pagamentos futuros." },
      { id: "planilha", titulo: "Planilha do débito",
        texto: "Débito: 5 × R$ 850,00 = R$ 4.250,00 + encargos = R$ 4.612,00. Observação do contador do juízo: com o subsídio do aluguel social (R$ 700,00) somado a R$ 150,00 da ré, o aluguel corrente fica COBERTO; o débito acumulado comportaria parcelamento em 12 × R$ 384,00, dentro da margem declarada pela ré após reemprego." }
    ]
  },

  focos: [
    { id: "f_purga", rotulo: "A purga da mora", dica: "Art. 62, II, da Lei do Inquilinato: pagar o débito salva o contrato. A ré QUER pagar — falta desenhar como.",
      grifos: [{ peca: "contestacao", trecho: "INTENÇÃO DE PURGAR A MORA de forma parcelada" }] },
    { id: "f_locador", rotulo: "A dor do outro lado", dica: "O autor não é um banco: tem 72 anos e o aluguel paga remédio. Acordo bom protege os DOIS.",
      grifos: [{ peca: "inicial", trecho: "o aluguel paga seus remédios de uso contínuo" }] },
    { id: "f_social", rotulo: "O aluguel social", dica: "O subsídio municipal pode pagar o aluguel DESTE contrato — se o juiz costurar a ponte.",
      grifos: [{ peca: "social", trecho: "O benefício pode ser direcionado ao CONTRATO ATUAL, mediante anuência do locador" }] },
    { id: "f_planilha", rotulo: "As contas fecham", dica: "O contador já fez a conta: R$ 700 + R$ 150 cobre o aluguel; 12 × R$ 384 paga o atraso.",
      grifos: [{ peca: "planilha", trecho: "o aluguel corrente fica COBERTO" }] }
  ],

  arco: {
    antes: { emocao: "triste", gesto: "angustia" },
    depois: [
      { se: function (f) { return !!f.acordoMoradia; }, tom: "bom", gesto: "abraco",
        falas: [
          { quem: "cleide", emocao: "choro", texto: "Doutor, meus meninos nem vão saber que quase perderam a casa. E eu vou pagar cada centavo do seu Aurélio — agora eu TENHO COMO." },
          { quem: "aurelio", emocao: "feliz", texto: "Setenta e dois anos, e foi a primeira vez que eu saí de um fórum melhor do que entrei. A senhora paga o que puder, dona Cleide. O juiz fez as contas direito." }
        ] },
      { se: function (f) { return !!f.despejoSeco; }, tom: "grave",
        falas: [
          { quem: "cleide", emocao: "choro", texto: "Quinze dias, doutor. Eu vou tirar meus filhos da escola deles em quinze dias. O senhor fez a conta de quanto custa recomeçar do zero?" }
        ] }
    ]
  },

  vidasTocadas: [
    { se: "acordoMoradia", tom: "bom",
      texto: "Três crianças não mudaram de escola — e um aposentado de 72 anos voltou a comprar os remédios sem atraso." },
    { se: "acordoFrouxoDespejo", tom: "grave",
      texto: "O acordo 'de palavra' durou três semanas. O caso voltou inteiro — agora com mais juros e menos confiança." },
    { se: "despejoSeco", tom: "grave",
      texto: "A lei foi cumprida em quinze dias. A família de Cleide dorme de favor; o Sr. Aurélio segue sem receber um real do débito." }
  ],

  inicio: "d1",
  cenas: {

    d1: {
      falas: [
        { quem: "narrador", texto: "13h30. Dona Cleide e Sr. Aurélio sentam-se em lados opostos sem se olhar — vizinhos de contrato há quatro anos, hoje adversários de processo. Os dois seguram pastas finas com a mesma força." },
        { quem: "flavio", emocao: "firme", texto: "Excelência, o caso é objetivo: cinco meses sem pagar, art. 9º, III. Requeremos o despejo, se possível liminar. Meu cliente não tem como financiar a moradia alheia." },
        { quem: "estevao", emocao: "firme", texto: "Ninguém pede financiamento, Excelência: pede-se TEMPO e ponte. A ré pagou quatro anos em dia, perdeu o emprego documentadamente e tem aluguel social habilitado. Há caminho para os dois lados." }
      ],
      decisao: {
        prompt: "O processo permite julgar de plano. Mas as duas partes estão na sua frente. Por onde começar?",
        opcoes: [
          { rotulo: "Julgar no estado: a mora é incontroversa, o resto é jurisprudência — sentença em 48 horas",
            fundamento: "CPC, art. 355, I — julgamento antecipado",
            efeitos: { tec: 2, cel: 5, hum: -6, tempo: 4 },
            reacoes: [
              { quem: "aurelio", emocao: "surpresa", texto: "E... é só isso? Quatro anos de contrato e ninguém conversa?" }
            ],
            feedback: { acerto: "ruim", titulo: "Rápido não é sinônimo de resolvido",
              texto: "Tecnicamente possível — a mora é incontroversa. Mas o CPC ergueu a audiência de conciliação a ato central do processo (art. 334, §§), e este caso é o retrato do litígio conciliável: as DUAS partes perdem com a sentença seca (ela, a casa; ele, o crédito — despejo não paga débito de quem nada tem). Julgar sem tentar é eficiência de estatística, não de jurisdição." },
            proxima: "d2" },

          { rotulo: "Ouvir os DOIS antes de qualquer técnica: o que aconteceu com o emprego dela — e para que serve o aluguel dele",
            fundamento: "CPC, arts. 139, V, e 334 — conciliação como prioridade",
            requerFoco: "f_locador",
            efeitos: { tec: 4, hum: 9, tempo: 9 },
            carimbo: "AUDIÊNCIA DE CONCILIAÇÃO",
            setFlags: { ouviuAsDuasDores: true },
            reacoes: [
              { quem: "cleide", emocao: "triste", texto: "A confecção fechou de um dia pro outro, doutor. Quatro anos sem atrasar UM aluguel — o senhor pode conferir. Eu tenho vergonha desse processo." },
              { quem: "aurelio", emocao: "triste", texto: "E eu tenho setenta e dois anos e dois remédios que não esperam, doutor. Não tenho raiva da dona Cleide. Tenho boleto." }
            ],
            feedback: { acerto: "otimo", titulo: "O conflito por inteiro",
              texto: "Em cinco minutos de escuta, o caso mudou de natureza: não há vilão — há duas vulnerabilidades em rota de colisão. É exatamente o cenário onde o juiz conciliador (CPC, art. 139, V) vale mais que o juiz sentenciador: a solução que protege os dois NÃO está em nenhuma das petições; está na combinação delas com o ofício do aluguel social." },
            proxima: "d2" },

          { rotulo: "Deferir a liminar de desocupação em 15 dias (caução dispensada) e designar conciliação para DEPOIS",
            fundamento: "Lei 8.245, art. 59, §1º, IX",
            efeitos: { tec: -3, hum: -8, tempo: 5 },
            carimbo: "DESOCUPAÇÃO — 15 DIAS",
            setFlags: { despejoSeco: true },
            reacoes: [
              { quem: "estevao", emocao: "raiva", texto: "Conciliar com a família já na rua, Excelência? A liminar mata a mesa de negociação antes de ela abrir." },
              { quem: "cleide", emocao: "choro", texto: "Quinze dias... doutor, em quinze dias eu não acho nem caixa de mudança." }
            ],
            feedback: { acerto: "grave", titulo: "A liminar que queima a ponte",
              texto: "A ordem de despejo ANTES da tentativa de acordo inverte a lógica: retirado o teto, a ré nada mais tem a negociar — e o autor segue sem receber (despejo não quita débito). A liminar do art. 59 existe para o locatário que abandona ou deteriora, não para inviabilizar a conciliação de boa-fé que o próprio processo já oferecia." },
            proxima: "fim_seco" }
        ]
      }
    },

    d2: {
      falas: [
        { quem: "narrador", texto: "Sobre a mesa, a planilha do contador do juízo e o ofício do aluguel social. Os números, pela primeira vez no processo, estão todos no mesmo papel." },
        { quem: "flavio", emocao: "neutro", texto: "Meu cliente ouviria uma proposta concreta, Excelência. CONCRETA — com data e valor. Promessa, ele já tem cinco meses delas." }
      ],
      decisao: {
        prompt: "A mesa está armada. Que acordo você constrói?",
        opcoes: [
          { rotulo: "Acordo simples e rápido: a ré promete pagar quando empregar, o autor suspende o despejo — homologa-se a boa vontade",
            fundamento: "Autocomposição (CPC, art. 487, III, b)",
            efeitos: { tec: -5, hum: 2, cel: 3, tempo: 6 },
            carimbo: "ACORDO HOMOLOGADO",
            setFlags: { acordoFrouxoDespejo: true },
            reacoes: [
              { quem: "flavio", emocao: "raiva", texto: "'Quando empregar', Excelência? Sem valor, sem data, sem garantia? Meu cliente assina sob protesto — e nos vemos aqui em sessenta dias." }
            ],
            feedback: { acerto: "ruim", titulo: "Boa vontade não é cláusula",
              texto: "Acordo sem valor, data e consequência de descumprimento é o 'acordo de palavra' que você já viu fracassar no Juizado: inexequível (CPC, art. 515, II, exige obrigação certa). O aluguel social estava HABILITADO nos autos e ficou de fora; o débito ficou sem desenho. Em semanas, o processo volta — com a confiança das partes gasta." },
            proxima: "fim_frouxo" },

          { rotulo: "Despejo consensual com prazo de 90 dias para desocupação voluntária — digno para ela, definitivo para ele",
            fundamento: "Lei 8.245, art. 61 (prazo de desocupação)",
            efeitos: { tec: 3, hum: 1, tempo: 6 },
            reacoes: [
              { quem: "cleide", emocao: "triste", texto: "Noventa dias para achar o quê, doutor, com que dinheiro? Mas... é melhor que quinze. Eu assino." },
              { quem: "aurelio", emocao: "neutro", texto: "E o que me devem, fica como?" }
            ],
            feedback: { acerto: "bom", titulo: "Civilizado — mas deixou dinheiro e teto na mesa",
              texto: "O prazo digno evita o trauma dos 15 dias e dá previsibilidade ao autor. Mas repare no que o acordo NÃO resolve: o débito segue sem desenho (Aurélio continua sem receber) e a família ainda perde a casa — quando o ofício do aluguel social, parado nos autos, podia pagar o aluguel DESTE contrato. Era ponte; virou rampa de saída." },
            proxima: "fim_bom" },

          { rotulo: "O acordo-ponte: aluguel social direcionado a ESTE contrato (R$ 700 + R$ 150 da ré = aluguel em dia), débito parcelado em 12 × R$ 384 após o reemprego, ofício ao Município COM PRAZO, e cláusula expressa: descumpriu, despeja-se nos próprios autos",
            fundamento: "Lei 8.245, art. 62, II (purga); CPC, arts. 139, V, e 515, II; ofício municipal nos autos",
            requerFoco: "f_social",
            efeitos: { tec: 9, hum: 10, cel: -2, tempo: 12 },
            carimbo: "ACORDO-PONTE HOMOLOGADO",
            setFlags: { acordoMoradia: true, redeAcionada: true },
            reacoes: [
              { quem: "aurelio", emocao: "surpresa", texto: "Espera... eu volto a receber JÁ no mês que vem? E o atrasado entra parcelado com data? Doutor, por que ninguém me explicou isso antes do processo?" },
              { quem: "cleide", emocao: "choro", texto: "Eu fico na casa... os meninos ficam na escola... e eu pago tudo. TUDO. Assino agora, Excelência." },
              { quem: "flavio", emocao: "feliz", texto: "Com cláusula de descumprimento executável nos próprios autos, meu cliente está protegido. A melhor peça deste processo foi a homologação, Excelência." }
            ],
            feedback: { acerto: "otimo", titulo: "A sentença que nenhuma das petições pedia",
              texto: "Conciliação de verdade é engenharia: você somou a purga da mora (art. 62, II), o subsídio municipal que já estava habilitado, a margem real da planilha e a cláusula executável — e produziu o único resultado em que TODOS ganham: a família fica, o aposentado recebe (presente E passado), e o descumprimento tem consequência imediata, sem processo novo. Isso não está em nenhum manual de sentença; está no ofício de julgar gente." },
            proxima: "fim_otimo" }
        ]
      }
    },

    fim_otimo: {
      falas: [
        { quem: "narrador", texto: "Na saída, Sr. Aurélio estende a mão; Dona Cleide aperta com as duas. 'A senhora cuida da casa', diz ele. 'O senhor cuida da saúde', responde ela. O processo, tecnicamente, acabou de morrer de êxito." }
      ],
      fim: {
        titulo: "AS DUAS PONTAS DE PÉ",
        selo: "otimo",
        texto: "O aluguel do mês que vem está pago; o débito tem calendário; a escola das crianças não muda; os remédios do autor, tampouco. E se algo falhar, a cláusula executável devolve o caso a esta mesa em dias, não em anos. O despejo era a saída fácil — o acordo-ponte era a saída JUSTA, e exigia exatamente o que o juiz fez: ler todos os papéis e juntar as pontas."
      }
    },

    fim_bom: {
      falas: [
        { quem: "narrador", texto: "As partes saem em silêncio educado. Noventa dias de prazo: o suficiente para uma mudança organizada — e para se perguntar, caixa por caixa, se havia outro final." }
      ],
      fim: {
        titulo: "SAÍDA HONROSA",
        selo: "bom",
        texto: "O acordo evitou o pior: ninguém sai algemado à própria pressa. Mas a régua do caso era mais alta — o subsídio municipal podia manter o contrato VIVO, pagando o autor e preservando o teto. Quando a conciliação mira só o fim do processo, e não o fim do PROBLEMA, todos assinam... e ninguém comemora."
      }
    },

    fim_seco: {
      falas: [
        { quem: "narrador", texto: "O mandado sai no mesmo dia. Sr. Aurélio assina o recibo da liminar sem comemorar: ganhou a posse de um imóvel e perdeu a chance de receber o que lhe deviam." }
      ],
      fim: {
        titulo: "QUINZE DIAS",
        selo: "grave",
        texto: "A liminar era legalmente possível — e estrategicamente cega. A família perde a casa e a escola; o autor segue sem um real do débito (despejo não cobra dívida de quem nada tem); e o ofício do aluguel social, que pagaria o aluguel deste exato contrato, morreu anexado aos autos. Todos perderam, no prazo recorde de quinze dias."
      }
    },

    fim_frouxo: {
      falas: [
        { quem: "narrador", texto: "Assinaturas colhidas, autos baixados. O cartório, mais experiente que o otimismo da ata, deixa o processo por cima da pilha — 'esse volta', murmura o escrivão." }
      ],
      fim: {
        titulo: "ACORDO DE PALAVRA, DE NOVO",
        selo: "ruim",
        setFlags: {},
        texto: "Sem valor, sem data, sem cláusula: o acordo nasceu inexequível. Quando falhar — e a primeira parcela invisível já tem tudo para falhar —, o autor voltará mais pobre e mais descrente, e a ré, mais encurralada. A lição do Juizado se repete: acordo que não se executa é adiamento com firma reconhecida."
      }
    }
  }
});
