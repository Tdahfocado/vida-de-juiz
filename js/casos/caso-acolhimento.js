/* ============================================================
   CASO: MEDIDA DE PROTEÇÃO — "Caio, 6 anos"
   ------------------------------------------------------------
   Criança em situação de risco (negligência grave da mãe em
   tratamento de dependência química). O Ministério Público
   pede acolhimento institucional. A avó materna quer o neto.
   Entre o abrigo e a família, o ECA tem lado: a família
   extensa é prioridade (arts. 19, 25, 101) — quando protege.

   Fundamentos: ECA, arts. 19, 25, par. único, 98, 100, 101;
   Lei 13.431/2017 (escuta especializada).
   ============================================================ */

window.TOGA = window.TOGA || {};
TOGA.casos.push({
  id: "acolhimento",
  titulo: "Infância — Caio, 6 anos",
  subtitulo: "O MP pede abrigo. A avó pede o neto. Caio só pede para não dormir 'na casa dos estranhos'.",
  area: "Infância e Juventude",
  hora: "11:30",
  duracaoPrevistaMin: 60,
  tensao: 6,

  personagens: [
    { id: "zila", nome: "Dona Zilá", papel: "Avó materna", assento: "centro",
      avatar: { pele: "#c98e66", cabelo: "coque", corCabelo: "#777268", traje: "vestido", corTraje: "#4a4438" } },
    { id: "helena", nome: "Dra. Helena", papel: "Promotora da Infância", assento: "esq1",
      avatar: { pele: "#e8c39a", cabelo: "longo", corCabelo: "#3a2a1a", traje: "blazer", corTraje: "#33424f", corBlusa: "#efe5c8" } },
    { id: "marta", nome: "Sra. Marta", papel: "Conselheira Tutelar", assento: "esq2",
      avatar: { pele: "#c98e66", cabelo: "longo", corCabelo: "#241505", traje: "camisa", corTraje: "#2f4a3e" } },
    { id: "ines", nome: "Dra. Inês", papel: "Psicóloga do Juízo", assento: "dir1",
      avatar: { pele: "#d8a87f", cabelo: "coque", corCabelo: "#241a10", traje: "blazer", corTraje: "#54453a", corBlusa: "#e8e2d2", oculos: true } }
  ],

  autos: {
    resumo: "Procedimento de medida protetiva (ECA, art. 101): Caio, 6 anos, encontrado sozinho em casa pela segunda vez, mãe em surto por dependência química, hoje internada voluntariamente para tratamento. O MP requer acolhimento institucional. A avó materna, Dona Zilá, habilita-se para a guarda provisória.",
    pecas: [
      { id: "relatorio", titulo: "Relatório psicossocial",
        texto: "Estudo realizado em 48 horas: a avó materna, Zilá, 61 anos, merendeira aposentada, reside a três quadras da escola de Caio, em casa própria de dois quartos, organizada e segura. Vínculo afetivo FORTE e recíproco: a criança passa fins de semana com a avó desde bebê e a chama de 'vó-mãe'. A equipe técnica opina pela GUARDA PROVISÓRIA à avó, com acompanhamento, como alternativa preferencial ao acolhimento institucional." },
      { id: "mp", titulo: "Promoção do Ministério Público",
        texto: "O MP requer acolhimento institucional por 90 dias: a situação de risco é grave (criança de 6 anos sozinha, duas ocorrências), e a avó, embora bem-intencionada, tem 61 anos e renda modesta — convém avaliar com calma sua capacidade protetiva antes de qualquer guarda. O abrigo municipal dispõe de vaga e equipe." },
      { id: "conselho", titulo: "Relatório do Conselho Tutelar",
        texto: "Caio está provisoriamente na casa da avó desde a internação da mãe, anteontem. A criança está calma, alimentada, frequentou a escola normalmente ontem. Ao ser perguntado onde queria ficar, respondeu: 'na casa da vó-mãe, até a mamãe sarar'. Demonstra medo de 'dormir na casa dos estranhos' — referindo-se ao abrigo, que conhece por um coleguinha." },
      { id: "medica", titulo: "Informação da clínica",
        texto: "A genitora encontra-se internada VOLUNTARIAMENTE para desintoxicação, com previsão de 90 a 120 dias de programa. A equipe médica registra que a adesão voluntária é fator de bom prognóstico e recomenda a manutenção de vínculos familiares durante o tratamento, inclusive visitas monitoradas da criança em fase oportuna." }
    ]
  },

  focos: [
    { id: "f_extensa", rotulo: "Família extensa primeiro", dica: "ECA, arts. 19, 25, par. único, e 101, §1º: o abrigo é exceção; avó é família.",
      grifos: [{ peca: "relatorio", trecho: "GUARDA PROVISÓRIA à avó, com acompanhamento, como alternativa preferencial ao acolhimento institucional" }] },
    { id: "f_relatorio", rotulo: "O estudo psicossocial", dica: "Vínculo, casa, escola a três quadras. A equipe técnica já respondeu a pergunta do MP.",
      grifos: [{ peca: "relatorio", trecho: "Vínculo afetivo FORTE e recíproco" }] },
    { id: "f_escuta", rotulo: "Como ouvir Caio", dica: "Lei 13.431/2017: criança se ouve por ESCUTA ESPECIALIZADA, não em sala de audiência.",
      grifos: [{ peca: "conselho", trecho: "medo de 'dormir na casa dos estranhos'" }] },
    { id: "f_mae", rotulo: "O tratamento da mãe", dica: "Internação voluntária, bom prognóstico, 90-120 dias. O plano precisa incluir o RETORNO dela.",
      grifos: [{ peca: "medica", trecho: "recomenda a manutenção de vínculos familiares durante o tratamento" }] }
  ],

  arco: {
    antes: { emocao: "medo", gesto: "angustia" },
    depois: [
      { se: function (f) { return !!f.familiaAcolheu; }, tom: "bom", gesto: "abraco",
        falas: [
          { quem: "zila", emocao: "choro", texto: "Doutor... ele vai dormir no quarto que sempre foi dele lá em casa. Eu fiz sessenta e um anos esperando ser útil assim." },
          { quem: "marta", emocao: "feliz", texto: "E a escola já confirmou: amanhã ele está na aula, Excelência. Três quadras a pé, com a avó na porta." }
        ] },
      { se: function (f) { return !!f.caioAbrigado; }, tom: "grave",
        falas: [
          { quem: "zila", emocao: "choro", texto: "A casa dos estranhos, doutor. Era disso que ele tinha medo. Eu estava ALI, de braço aberto, e o senhor mandou ele pra casa dos estranhos." }
        ] }
    ]
  },

  vidasTocadas: [
    { se: "familiaAcolheu", tom: "bom",
      texto: "Caio não passou uma noite sequer num abrigo — e a mãe, na clínica, soube que o filho dormia no quarto de sempre." },
    { se: function (f) { return f.familiaAcolheu && f.planoRetorno; }, tom: "bom",
      texto: "Em 90 dias, a audiência de reavaliação já tem data — e a reaproximação com a mãe, um plano por escrito." },
    { se: "caioAbrigado", tom: "grave",
      texto: "Caio aprendeu a dormir 'na casa dos estranhos'. A vó-mãe visita aos sábados, por uma hora, com crachá." },
    { se: "revitimizacaoCaio", tom: "grave",
      texto: "Caio contou seus medos numa sala de adultos em silêncio — e o juízo virou mais uma memória difícil." }
  ],

  inicio: "a1",
  cenas: {

    a1: {
      falas: [
        { quem: "narrador", texto: "11h30. Dona Zilá senta-se na beirada da cadeira, bolsa no colo, como quem não quer ocupar espaço demais. A promotora organiza os relatórios. Caio ficou na brinquedoteca do fórum com uma estagiária." },
        { quem: "helena", emocao: "firme", texto: "Excelência, ninguém aqui duvida do amor da avó. A questão é capacidade protetiva: a criança foi encontrada sozinha DUAS vezes. O acolhimento por 90 dias permite avaliar com segurança." },
        { quem: "zila", emocao: "medo", texto: "Doutor, as duas vezes foram na casa da minha filha, não na minha. Na minha casa ele nunca passou um susto. Eu crio, eu levo na escola, eu sei o remédio da bronquite dele." }
      ],
      decisao: {
        prompt: "Antes de decidir o destino de Caio: ele tem 6 anos e está no prédio. Você o ouve? Como?",
        opcoes: [
          { rotulo: "Trazer Caio à sala de audiências para uma conversa rápida com todos presentes — 'transparência processual'",
            fundamento: "Oitiva direta pelo juízo",
            efeitos: { tec: -8, hum: -10, tempo: 8 },
            setFlags: { revitimizacaoCaio: true },
            reacoes: [
              { quem: "ines", emocao: "firme", texto: "Excelência, com o protesto técnico desta psicóloga: sala de audiência, toga e seis adultos é exatamente o cenário que a Lei 13.431 proíbe para uma criança de seis anos." }
            ],
            feedback: { acerto: "grave", titulo: "A sala de audiências não é lugar de criança",
              texto: "A Lei 13.431/2017 estruturou a ESCUTA ESPECIALIZADA justamente para retirar a criança do ambiente formal: sala própria, profissional capacitado, sem a plateia de adultos. Ouvir Caio 'com todos presentes' o expõe ao constrangimento e contamina o relato — revitimização institucional com selo do juízo." },
            proxima: "a2" },

          { rotulo: "Não ouvir a criança: 6 anos é pouco, e os relatórios bastam",
            fundamento: "Economia processual",
            efeitos: { tec: -2, hum: -4, cel: 2, tempo: 4 },
            reacoes: [
              { quem: "ines", emocao: "neutro", texto: "Registro, Excelência, que a opinião da criança, colhida adequadamente, é direito dela — não prova facultativa (ECA, art. 100, par. único, XII)." }
            ],
            feedback: { acerto: "ruim", titulo: "Caio é sujeito do processo, não objeto dele",
              texto: "O ECA garante à criança o direito de ser OUVIDA e ter sua opinião considerada (art. 100, par. único, XII), na forma adequada à idade. Aos 6 anos, isso não significa interrogatório — significa escuta especializada. Dispensá-la empobrece a decisão e desrespeita quem mais será afetado por ela." },
            proxima: "a2" },

          { rotulo: "Determinar ESCUTA ESPECIALIZADA: a Dra. Inês conversa com Caio na sala apropriada, agora, e traz o relato ao juízo",
            fundamento: "Lei 13.431/2017, arts. 7º e 8º; ECA, art. 100, par. único, XII",
            requerFoco: "f_escuta",
            efeitos: { tec: 8, hum: 8, tempo: 10 },
            carimbo: "ESCUTA ESPECIALIZADA",
            setFlags: { escutaFeita: true },
            reacoes: [
              { quem: "narrador", texto: "Vinte minutos depois, a psicóloga retorna. Na sala lúdica, desenhando, Caio falou da 'vó-mãe', do quarto com adesivo de foguete, e perguntou duas vezes se 'a mamãe vai sarar'. Sobre o abrigo: 'lá não, por favor'." },
              { quem: "ines", emocao: "neutro", texto: "O relato é consistente e espontâneo, Excelência. Vínculo seguro com a avó; medo concreto da institucionalização; preocupação genuína com a mãe." }
            ],
            feedback: { acerto: "otimo", titulo: "Ouvir do tamanho de quem fala",
              texto: "Escuta especializada é isto: ambiente lúdico, profissional capacitado, relato espontâneo — e a voz da criança entra no processo SEM machucá-la (Lei 13.431, art. 7º). O que Caio disse não decide sozinho o caso, mas pesa: a lei manda considerar a opinião da criança (ECA, art. 100), e agora você a tem, limpa e tecnicamente colhida." },
            proxima: "a2" }
        ]
      }
    },

    a2: {
      falas: [
        { quem: "helena", emocao: "neutro", texto: "Mantenho o pedido de acolhimento, Excelência, mas registro: o estudo psicossocial de 48 horas foi mais completo do que eu esperava. O Ministério Público não fecha os olhos a relatório técnico." },
        { quem: "zila", emocao: "medo", texto: "Eu só preciso que o senhor acredite no que a moça do estudo viu na minha casa, doutor." }
      ],
      decisao: {
        prompt: "O destino de Caio enquanto a mãe se trata: abrigo, avó, ou devolução?",
        opcoes: [
          { rotulo: "Acolhimento institucional por 90 dias, 'por segurança', avaliando-se a avó com calma nesse período",
            fundamento: "ECA, art. 101, VII — prudência",
            efeitos: { tec: -8, hum: -10, tempo: 8 },
            carimbo: "ACOLHIMENTO DETERMINADO",
            setFlags: { caioAbrigado: true },
            reacoes: [
              { quem: "zila", emocao: "choro", texto: "Abrigo?... Mas eu estou AQUI, doutor. Eu vim. Eu sou a avó dele." },
              { quem: "ines", emocao: "triste", texto: "Consigno que a criança verbalizou medo específico da institucionalização, Excelência." }
            ],
            feedback: { acerto: "grave", titulo: "A excepcionalidade invertida",
              texto: "O ECA é literal: o acolhimento institucional é medida PROVISÓRIA E EXCEPCIONAL, cabível apenas quando esgotadas as alternativas familiares (art. 101, §1º), e a família extensa tem prioridade expressa (arts. 19 e 25, par. único). Com estudo técnico FAVORÁVEL à avó nos autos, abrigar 'por segurança' inverte a regra legal: institucionaliza primeiro e pergunta depois — cobrando a conta de quem tem 6 anos." },
            proxima: "a3" },

          { rotulo: "GUARDA PROVISÓRIA à avó, com acompanhamento psicossocial mensal e termo de compromisso",
            fundamento: "ECA, arts. 19, 25, par. único, 33, §1º, e 101, §1º; estudo técnico favorável",
            requerFoco: "f_extensa",
            efeitos: { tec: 9, hum: 9, tempo: 8 },
            carimbo: "GUARDA À FAMÍLIA",
            setFlags: { familiaAcolheu: true },
            reacoes: [
              { quem: "zila", emocao: "choro", texto: "Obrigada, doutor. Obrigada. O quarto dele está pronto desde anteontem — eu sabia não, mas arrumei mesmo assim." },
              { quem: "helena", emocao: "neutro", texto: "Com o acompanhamento mensal determinado, o Ministério Público nada opõe, Excelência. A prioridade legal é essa mesma." }
            ],
            feedback: { acerto: "otimo", titulo: "A regra do ECA, aplicada na ordem certa",
              texto: "Decisão alinhada milimetricamente à lei: criança em risco (art. 98), medida protetiva de colocação na FAMÍLIA EXTENSA (arts. 19 e 25, par. único) com guarda provisória (art. 33, §1º), preservando o abrigo para o que ele é — última alternativa (art. 101, §1º). O acompanhamento mensal responde à preocupação legítima do MP sem cobrar de Caio o preço da 'prudência'." },
            proxima: "a3" },

          { rotulo: "Devolver a criança à genitora assim que receber alta, com advertência formal — família é com a mãe",
            fundamento: "ECA, art. 129, VII — advertência aos pais",
            efeitos: { tec: -6, hum: -4, tempo: 5 },
            reacoes: [
              { quem: "helena", emocao: "raiva", texto: "Excelência, a genitora está INTERNADA. Devolver 'na alta', sem plano nem avaliação, é reentregar a criança ao mesmo risco de onde ela saiu — duas vezes." }
            ],
            feedback: { acerto: "grave", titulo: "O retorno sem plano é o risco com hora marcada",
              texto: "O objetivo final é, sim, a reintegração à mãe (ECA, art. 19) — mas MEDIADA por avaliação e plano (art. 101, §§ 4º a 6º). Devolver automaticamente 'na alta', sem estudo do momento, ignora que dependência química se trata em ciclos. Entre a pressa e o abandono do vínculo, a lei escolheu o caminho do meio: guarda na família extensa AGORA, reaproximação planejada DEPOIS." },
            proxima: "a3" }
        ]
      }
    },

    a3: {
      falas: [
        { quem: "ines", emocao: "neutro", texto: "Último ponto, Excelência: a clínica informa que a mãe tem bom prognóstico e recomenda manter os vínculos durante o tratamento. O que o juízo determina sobre o DEPOIS?" }
      ],
      decisao: {
        prompt: "O processo não termina hoje. Como você desenha os próximos 90 dias?",
        opcoes: [
          { rotulo: "Arquivar com a medida de hoje: 'se houver problema, as partes provocam o juízo'",
            fundamento: "Inércia da jurisdição",
            efeitos: { tec: -4, cel: 3, tempo: 4 },
            reacoes: [
              { quem: "helena", emocao: "neutro", texto: "O MP recorrerá da ausência de reavaliação obrigatória, Excelência. O ECA não permite arquivar criança." }
            ],
            feedback: { acerto: "ruim", titulo: "Medida protetiva não se arquiva — se acompanha",
              texto: "O ECA impõe reavaliação periódica OBRIGATÓRIA das medidas (art. 19, §1º: no máximo a cada 3 meses, em audiência concentrada quando acolhida). Esperar 'provocação' devolve à criança o ônus de fiscalizar os adultos — exatamente o que o estatuto veio impedir." },
            proxima: function (f) { return f.familiaAcolheu ? "fim_bom_sem_plano" : "fim_grave"; } },

          { rotulo: "Plano completo: audiência concentrada de reavaliação em 90 dias, visitas monitoradas de Caio à mãe na fase que a clínica indicar, apoio do CREAS à avó e relatórios mensais",
            fundamento: "ECA, arts. 19, §1º, e 101, §§4º-6º; recomendação clínica nos autos",
            requerFoco: "f_mae",
            efeitos: { tec: 8, hum: 7, cel: -2, tempo: 9 },
            carimbo: "PLANO DE 90 DIAS",
            setFlags: { planoRetorno: true },
            reacoes: [
              { quem: "ines", emocao: "feliz", texto: "Com o plano por escrito, a clínica consegue preparar a reaproximação na hora certa, Excelência. É o melhor desenho possível." },
              { quem: "zila", emocao: "feliz", texto: "E quando minha filha sarar, ela encontra o menino inteiro — e a mãe dela também ajudou nisso. É assim que eu quero." }
            ],
            feedback: { acerto: "otimo", titulo: "Decidir o hoje com o amanhã escrito",
              texto: "É a diferença entre despachar e JULGAR infância: a medida de hoje (guarda/acolhimento) ganha rumo — reavaliação em audiência concentrada (art. 19, §1º), reaproximação materna em fases clínicas, rede de apoio à cuidadora. O caso sai da sua mesa com calendário, responsáveis e critérios. Nenhuma criança fica 'esquecida no sistema' quando a sentença já marcou o retorno." },
            proxima: function (f) { return f.familiaAcolheu ? "fim_otimo" : "fim_grave_plano"; } },

          { rotulo: "Reavaliação em 6 meses, prazo confortável para o tratamento maturar",
            fundamento: "Razoabilidade dos prazos",
            efeitos: { tec: -3, tempo: 4 },
            reacoes: [
              { quem: "helena", emocao: "firme", texto: "Seis meses excede o teto legal, Excelência: o ECA fala em três." }
            ],
            feedback: { acerto: "ruim", titulo: "O prazo que a lei já fixou",
              texto: "Não há margem: a reavaliação é trimestral no máximo (ECA, art. 19, §1º). Seis meses na vida de uma criança de 6 anos é uma era geológica — e um descumprimento literal do estatuto que o MP anotará no recurso." },
            proxima: function (f) { return f.familiaAcolheu ? "fim_bom_sem_plano" : "fim_grave"; } }
        ]
      }
    },

    fim_otimo: {
      falas: [
        { quem: "narrador", texto: "Na saída, a estagiária da brinquedoteca entrega Caio à avó. O menino mostra um desenho de foguete. 'É o seu quarto?', pergunta Dona Zilá. 'É a gente indo embora pra casa', responde ele." }
      ],
      fim: {
        titulo: "A FAMÍLIA QUE A LEI PREFERE",
        selo: "otimo",
        texto: "Caio dorme hoje no quarto com adesivo de foguete. A mãe trata-se sabendo o filho seguro e amado; a avó cuida com a rede ao lado; e o processo tem data marcada para verificar tudo isso. O ECA foi aplicado na sua ordem exata: família primeiro, Estado junto, abrigo nunca foi preciso."
      }
    },

    fim_bom_sem_plano: {
      falas: [
        { quem: "narrador", texto: "Dona Zilá sai de mão dada com o neto. O processo fica na pilha — sem data certa de volta." }
      ],
      fim: {
        titulo: "BEM ENCAMINHADO, MAL AMARRADO",
        selo: "bom",
        texto: "A decisão principal foi a certa: Caio está com a família. Mas o caso saiu da pauta sem plano de reaproximação nem reavaliação no prazo legal — e medidas protetivas sem calendário envelhecem mal. O que hoje é acerto pode virar pendência esquecida."
      }
    },

    fim_grave: {
      falas: [
        { quem: "narrador", texto: "O carro do abrigo deixa o fórum no meio da tarde. Dona Zilá fica no estacionamento até o carro sumir da esquina." }
      ],
      fim: {
        titulo: "A CASA DOS ESTRANHOS",
        selo: "grave",
        setFlags: { manchaGrave: true },
        texto: "Com avó habilitada, estudo técnico favorável e vaga de amor a três quadras da escola, Caio foi para o abrigo. O recurso do MP — ou da Defensoria — devolverá o caso em semanas, com a jurisprudência inteira do lado da família extensa. Mas algumas noites na 'casa dos estranhos' não se devolvem."
      }
    },

    fim_grave_plano: {
      falas: [
        { quem: "narrador", texto: "O plano de 90 dias ficou bem desenhado no papel. Caio o cumprirá a partir de um dormitório coletivo." }
      ],
      fim: {
        titulo: "O PLANO CERTO NO LUGAR ERRADO",
        selo: "ruim",
        texto: "O calendário de reavaliação e reaproximação é tecnicamente correto — mas orbita uma decisão-base equivocada: havia família extensa apta e o abrigo era evitável. O recurso provavelmente corrigirá o endereço de Caio antes da primeira reavaliação."
      }
    }
  }
});
