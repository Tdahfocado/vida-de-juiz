/* ============================================================
   CASO: PLANTÃO — "A porta trancada"
   ------------------------------------------------------------
   23h de um plantão noturno. D. Zenaide, 67 anos, pede "uma
   ordem para internar à força" o filho Ramiro, 34, em surto
   psicótico há três dias — trancado no quarto, sem laudo, com
   uma clínica particular já paga adiantado. Decidir sobre quem
   não está na sala: a internação como último recurso, nunca
   como depósito.

   Fundamentos centrais: Lei 10.216/2001, arts. 2º (direitos da
   pessoa com transtorno mental), 4º (último recurso; vedação a
   instituições asilares), 6º (laudo médico circunstanciado),
   8º, §1º (involuntária: MP em 72h) e 9º (compulsória judicial);
   RAPS — Portaria 3.088/2011. Interdição civil NÃO é via de
   crise aguda.
   ============================================================ */

window.TOGA = window.TOGA || {};
TOGA.casos.push({
  id: "internacao",
  titulo: "Plantão — A porta trancada",
  subtitulo: "Um filho em surto trancado no quarto. Uma clínica paga adiantado. Nenhum laudo. O que a sua assinatura abre?",
  area: "Plantão Judiciário — Saúde Mental",
  hora: "23:00",
  duracaoPrevistaMin: 35,
  tensao: 8,

  personagens: [
    { id: "zenaide", nome: "D. Zenaide", papel: "Mãe", assento: "centro",
      avatar: { pele: "#c98e66", cabelo: "coque", corCabelo: "#b8b2a8", traje: "vestido", corTraje: "#5a4a52" } },
    { id: "breno", nome: "Dr. Breno", papel: "Promotor", assento: "esq1",
      avatar: { pele: "#d8a87f", cabelo: "curto", corCabelo: "#2a2018", traje: "terno", corTraje: "#33424f", corGravata: "#7a2e2e" } },
    { id: "caique", nome: "Caíque", papel: "Irmão", assento: "esq2",
      avatar: { pele: "#b87a52", cabelo: "curto", corCabelo: "#1a120a", traje: "camisa", corTraje: "#46525e", barba: true } },
    { id: "ofelia", nome: "Dra. Ofélia", papel: "Defensora Pública", assento: "dir1",
      avatar: { pele: "#8a5436", cabelo: "longo", corCabelo: "#241505", traje: "blazer", corTraje: "#3a3a4a", corBlusa: "#e8e2d2", oculos: true } },
    { id: "iris", nome: "Dra. Íris", papel: "Médica do CAPS", assento: "dir2",
      avatar: { pele: "#e8c39a", cabelo: "coque", corCabelo: "#6a4a2a", traje: "camisa", corTraje: "#e6e6e0", oculos: true } }
  ],

  autos: {
    resumo: "Plantão judiciário noturno. D. Zenaide, 67 anos, acompanhada do filho Caíque, pede ordem judicial para internação imediata do outro filho, Ramiro, 34 anos, em surto psicótico há três dias — hoje quebrou móveis e ameaçou a família. Não há laudo médico. A família já contratou e pagou adiantado uma clínica particular. Ramiro está em casa, trancado no quarto. A médica plantonista de referência da RAPS foi chamada ao fórum.",
    pecas: [
      { id: "termo", titulo: "Termo de Atendimento do Plantão",
        texto: "Comparece DONA ZENAIDE, 67 anos, aposentada, acompanhada do filho CAÍQUE, 29 anos. Relata que o filho RAMIRO, 34 anos, está há três dias trancado no quarto, sem se alimentar direito, sem dormir, falando sozinho. Na tarde de hoje, quebrou os móveis da sala e gritou que ia “sumir com todo mundo”. A requerente declara: “tranquei a porta do quarto por fora, doutor. Tenho medo dele e tenho medo por ele”. A família pede “uma ordem do juiz para internar à força”, informando já ter contratado clínica particular com pagamento adiantado. Não acompanha o pedido qualquer documento médico: não há laudo, receituário, prontuário nem registro de atendimento anterior em saúde mental. Ramiro não tem curador, não responde a processo e nunca foi interditado." },
      { id: "contrato", titulo: "Contrato e recibo — Clínica Recanto Sereno",
        texto: "CONTRATO DE PRESTAÇÃO DE SERVIÇOS — CLÍNICA RECANTO SERENO LTDA.\n\nCláusula 2ª: A internação dar-se-á por tempo indeterminado, conforme avaliação exclusiva da direção do estabelecimento.\n\nCláusula 5ª: Visitas no primeiro domingo de cada mês, a critério da direção clínica, podendo ser suspensas “por razões de método terapêutico”.\n\nCláusula 7ª: O desligamento do interno do convívio externo, inclusive telefônico, integra a metodologia de tratamento.\n\nRECIBO: recebemos de Zenaide F. a quantia de R$ 9.600,00 (entrada referente a 60 dias), nesta data. O contrato não identifica corpo clínico responsável nem diretor técnico médico." },
      { id: "nota", titulo: "Nota Técnica — RAPS / CAPS III",
        texto: "O CAPS III deste município mantém médica plantonista de referência para o plantão judiciário, nos termos do fluxo da Rede de Atenção Psicossocial (Portaria 3.088/2011). Informa-se: (i) é possível avaliação domiciliar em conjunto com o SAMU, com emissão de laudo médico circunstanciado no local, em até uma hora; (ii) há, nesta data, leito de saúde mental disponível no Hospital Geral São Vicente, vinculado ao SUS, com retaguarda do CAPS para o acompanhamento pós-alta; (iii) o protocolo de abordagem de crise dispensa aparato policial ostensivo — a presença de farda e arma tende a agravar o quadro psicótico. A clínica Recanto Sereno não integra a RAPS e não possui registro de fiscalização sanitária atualizado." },
      { id: "roteiro", titulo: "Roteiro do Plantão — internação psiquiátrica",
        texto: "Lei 10.216/2001 (Reforma Psiquiátrica) — pontos de verificação obrigatória:\n\n1. A internação, em qualquer de suas modalidades, só é indicada quando os recursos extra-hospitalares se mostrarem insuficientes (art. 4º). É vedada a internação em instituições com características asilares (art. 4º, §3º).\n\n2. QUALQUER internação somente se realiza mediante laudo médico circunstanciado que caracterize os seus motivos (art. 6º). Modalidades: voluntária, involuntária e compulsória (art. 6º, parágrafo único).\n\n3. A internação involuntária é ato médico, comunicado ao Ministério Público em 72 horas (art. 8º, §1º).\n\n4. A compulsória é determinada pelo juiz, que deve considerar as condições de segurança do estabelecimento, para salvaguarda do paciente, dos demais internados e dos funcionários (art. 9º).\n\nATENÇÃO: interdição civil (CC, art. 1.767; CPC, arts. 747 e ss.) discute capacidade civil em processo de meses — não é instrumento para crise aguda de saúde mental." }
    ]
  },

  focos: [
    { id: "f_laudo", rotulo: "Onde está o laudo?", dica: "Ninguém com formação médica viu Ramiro. O art. 6º da Lei 10.216 exige laudo para QUALQUER internação — inclusive a que o juiz decreta.",
      grifos: [{ peca: "termo", trecho: "Não acompanha o pedido qualquer documento médico" },
               { peca: "roteiro", trecho: "laudo médico circunstanciado que caracterize os seus motivos" }] },
    { id: "f_clinica", rotulo: "A clínica paga adiantado", dica: "Leia o contrato como quem procura o art. 4º, §3º: tempo indeterminado, visita mensal, isolamento como método, nenhum médico identificado.",
      grifos: [{ peca: "contrato", trecho: "por tempo indeterminado" },
               { peca: "contrato", trecho: "a critério da direção clínica" },
               { peca: "roteiro", trecho: "características asilares" }] },
    { id: "f_rede", rotulo: "A rede que existe agora", dica: "A RAPS oferece o que o plantão precisa esta noite: avaliação em casa, laudo em uma hora e leito SUS em hospital geral.",
      grifos: [{ peca: "nota", trecho: "avaliação domiciliar em conjunto com o SAMU" },
               { peca: "nota", trecho: "leito de saúde mental disponível no Hospital Geral São Vicente" }] },
    { id: "f_risco", rotulo: "O risco é real e atual", dica: "A família não está inventando: três dias de surto, móveis quebrados, ameaça. Indeferir e mandar voltar no expediente também é decidir — mal.",
      grifos: [{ peca: "termo", trecho: "há três dias trancado no quarto" },
               { peca: "termo", trecho: "quebrou os móveis da sala" }] }
  ],

  /* ---------- arco emocional ---------- */
  arco: {
    antes: { emocao: "medo", gesto: "angustia" },
    depois: [
      { se: function (f) { return !!f.cumprimentoCuidadoso; }, tom: "bom", gesto: "abraco",
        falas: [
          { quem: "iris", emocao: "feliz", texto: "Ligação do São Vicente, Excelência: Ramiro jantou, aceitou a medicação e dormiu. Primeira noite de sono em três dias — dele e da mãe." },
          { quem: "zenaide", emocao: "choro", texto: "O senhor devolveu meu filho pro lugar de gente doente que se trata, doutor. Não pro lugar de bicho que se tranca. Deus lhe pague." }
        ] },
      { se: function (f) { return !!f.internacaoAsilar; }, tom: "grave",
        falas: [
          { quem: "ofelia", emocao: "raiva", texto: "Estive na Recanto Sereno hoje, Excelência. Ramiro está em contenção desde que chegou. Não há psiquiatra diário, não há prontuário acessível. A Defensoria vai requerer a interdição do estabelecimento — e a revisão da decisão deste plantão." },
          { quem: "zenaide", emocao: "vergonha", texto: "Eu pago em dia, doutor. Mas não me deixam ver meu filho. Eu pago... pra não ver." }
        ] },
      { se: function (f) { return !!f.leitoSUS; }, tom: "neutro",
        falas: [
          { quem: "ofelia", emocao: "neutro", texto: "Ramiro está internado no São Vicente, Excelência. A Defensoria acompanhará as reavaliações — e o modo como ele chegou lá constará do relatório." }
        ] },
      { se: function (f) { return true; }, tom: "grave",
        falas: [
          { quem: "breno", emocao: "triste", texto: "Excelência, o Ministério Público recebeu hoje a notícia: a família internou Ramiro por conta própria, na clínica paga. Sem laudo do plantão, sem fiscalização. A porta que o Judiciário não abriu, o desespero abriu." }
        ] }
    ]
  },

  vidasTocadas: [
    { se: function (f) { return f.cumprimentoCuidadoso && f.avaliacaoInLoco; }, tom: "bom",
      texto: "Ramiro acordou num quarto de hospital geral, com nome na porta e horário de visita. Na segunda semana, perguntou pela mãe. Na terceira, ela levou bolo." },
    { se: function (f) { return !!f.acolheuFamilia; }, tom: "bom",
      texto: "D. Zenaide saiu do plantão com mais do que uma decisão: um telefone que atende — o do CAPS — e a primeira noite inteira de sono em três dias." },
    { se: function (f) { return !!f.internacaoAsilar; }, tom: "grave",
      texto: "Na clínica, as visitas são no primeiro domingo do mês. D. Zenaide paga em dia. Sobre como Ramiro passa os outros vinte e nove dias, ninguém informa." },
    { se: function (f) { return !!f.policiaOstensiva; }, tom: "grave",
      texto: "A internação deu certo no papel. Mas a primeira lembrança que Ramiro guarda da noite em que foi socorrido é o som da própria porta sendo arrombada." }
  ],

  inicio: "n1",
  cenas: {

    /* ---------- ABERTURA: O PEDIDO SEM LAUDO ---------- */
    n1: {
      falas: [
        { quem: "narrador", texto: "23h00. O fórum está vazio e mal iluminado; só a sala do plantão acesa. D. Zenaide entra amparada pelo filho mais novo, o casaco abotoado errado, as mãos vermelhas de torcer uma na outra. Há uma cadeira vazia no centro de tudo: a de Ramiro, que está a seis quilômetros dali, trancado num quarto." },
        { quem: "zenaide", emocao: "choro", texto: "Doutor, eu tranquei meu filho por fora. Três dias que ele não come direito, fala sozinho, não dorme. Hoje ele quebrou a sala inteira e gritou que ia sumir com todo mundo. Eu tenho medo dele, doutor... e tenho medo POR ele. Me dá a ordem. Me dá a ordem pra internar." },
        { quem: "caique", emocao: "firme", texto: "A gente já resolveu a parte difícil, Excelência: clínica contratada, paga, com vaga pra hoje. Só falta o papel do senhor. É uma assinatura e a minha mãe dorme em paz." },
        { quem: "ofelia", emocao: "firme", texto: "Excelência, a Defensoria intervém pelo ausente: Ramiro não está nesta sala, ninguém com formação médica o examinou, e o que se pede é privar um cidadão da liberdade com base no relato — sincero, mas leigo — de quem está exausto há três dias." }
      ],
      decisao: {
        prompt: "O pedido chega sem nenhum documento médico. Por onde começa o plantão?",
        opcoes: [
          { rotulo: "Decretar de imediato a internação compulsória de Ramiro, com requisição de força policial — “pela segurança da família, resolve-se agora”",
            fundamento: "Lei 10.216/2001, art. 9º — internação compulsória",
            efeitos: { tec: -10, hum: -6, imp: -4, tempo: 6 },
            carimbo: "COMPULSÓRIA DECRETADA",
            setFlags: { ordemSemLaudo: true },
            reacoes: [
              { quem: "ofelia", emocao: "raiva", texto: "Compulsória sem laudo, Excelência?! O art. 6º da Lei 10.216 diz SOMENTE mediante laudo médico circunstanciado — qualquer internação, inclusive a judicial. A Defensoria consigna e recorrerá ainda esta noite." },
              { quem: "iris", emocao: "firme", texto: "E há um problema prático, Excelência: nenhum hospital sério recebe paciente sem laudo — a ordem não tem onde ser cumprida. Permita-me ir até lá com o SAMU. Em uma hora o senhor decide sobre um quadro clínico, não sobre um boato." },
              { quem: "breno", emocao: "neutro", texto: "O Ministério Público sugere converter a ordem em avaliação médica urgente, Excelência. É o único caminho que se sustenta." }
            ],
            feedback: { acerto: "grave", titulo: "A caneta não é estetoscópio",
              texto: "A Lei 10.216/2001 é expressa: a internação psiquiátrica — em QUALQUER modalidade, inclusive a compulsória — <b>somente</b> se realiza mediante laudo médico circunstanciado (art. 6º). E o art. 9º exige que o juiz considere as condições de segurança do estabelecimento — impossível sem saber qual é o quadro e qual é o leito. Decretar no escuro não protege a família: produz uma ordem inexequível e um precedente de privação de liberdade por relato leigo. O juiz que interna sem médico erra duas vezes: contra Ramiro e contra a lei." },
            proxima: "n2" },

          { rotulo: "Indeferir de plano: “internar à força é matéria de interdição — procurem a vara cível no expediente, com advogado”",
            fundamento: "CC, art. 1.767; plantão restrito a urgências",
            efeitos: { tec: -8, hum: -10, imp: -3, tempo: 4 },
            setFlags: { surtoIgnorado: true },
            reacoes: [
              { quem: "zenaide", emocao: "medo", texto: "Voltar segunda-feira, doutor?! E hoje à noite? E se ele derrubar a porta? E se ele se machucar lá dentro, sozinho?!" },
              { quem: "breno", emocao: "firme", texto: "Excelência, o Ministério Público REQUER, como fiscal da ordem jurídica: risco atual a si e a terceiros é a definição exata de urgência de plantão. E interdição não trata surto — o MP insiste na avaliação médica imediata, por equipe da RAPS." },
              { quem: "ofelia", emocao: "neutro", texto: "Neste ponto a Defensoria acompanha o Ministério Público, Excelência. Indeferir tudo também desprotege Ramiro." }
            ],
            feedback: { acerto: "grave", titulo: "A urgência não tem expediente",
              texto: "Dois erros num só despacho. <b>Primeiro</b>: interdição civil (CC, art. 1.767; CPC, arts. 747 e ss.) discute capacidade civil em processo que dura meses — não é, nunca foi, o instrumento para crise aguda de saúde mental. <b>Segundo</b>: o risco descrito é atual (três dias de surto, móveis quebrados, ameaça) — exatamente o que o plantão existe para enfrentar. Mandar a família 'voltar no expediente' é escolher a omissão num caso em que a Lei 10.216 oferecia caminho legal imediato: avaliação médica urgente pela rede (arts. 4º e 6º). Só a intervenção do MP impediu que a noite terminasse na porta do fórum." },
            proxima: "n2" },

          { rotulo: "Acionar AGORA a avaliação médica in loco: requisitar o SAMU e a Dra. Íris, médica de referência do CAPS, para examinar Ramiro em casa — com laudo e retorno a este plantão ainda esta noite",
            fundamento: "Lei 10.216/2001, arts. 4º e 6º; Portaria 3.088/2011 (RAPS)",
            efeitos: { tec: 8, hum: 7, tempo: 8 },
            carimbo: "AVALIAÇÃO URGENTE",
            setFlags: { avaliacaoInLoco: true },
            reacoes: [
              { quem: "iris", emocao: "firme", texto: "Saio em dez minutos com a equipe do SAMU, Excelência. Avaliação no local, laudo circunstanciado em uma hora — e o senhor decide sobre fatos clínicos, não sobre medo." },
              { quem: "zenaide", emocao: "surpresa", texto: "Vão... vão até lá? Hoje? Doutor, eu achei que o senhor ia mandar a gente embora ou mandar a polícia. Não sabia que existia esse meio do caminho." },
              { quem: "ofelia", emocao: "neutro", texto: "A Defensoria registra: é a primeira providência da noite que trata Ramiro como paciente, e não como problema." }
            ],
            feedback: { acerto: "otimo", titulo: "Primeiro o médico, depois o juiz",
              texto: "É a ordem que a Lei 10.216/2001 impõe: o laudo médico circunstanciado é requisito de QUALQUER internação (art. 6º), e a internação só se indica quando os recursos extra-hospitalares forem insuficientes (art. 4º) — o que só um médico pode atestar. Acionar a RAPS para avaliação domiciliar imediata não adia a proteção da família: <b>antecipa</b> a única proteção que é legal e exequível. Em uma hora, o plantão terá o que agora não tem — um diagnóstico — e Ramiro terá o que nunca teve — um atendimento." },
            proxima: "n2" }
        ]
      }
    },

    /* ---------- A ESPERA DO LAUDO: A FAMÍLIA NA SALA ---------- */
    n2: {
      falas: [
        { quem: "narrador", texto: "23h25. A ambulância do SAMU parte com a Dra. Íris. Na sala do plantão, o relógio de parede parece mais alto do que de dia. D. Zenaide olha para as próprias mãos. Caíque olha para o juiz." },
        { quem: "zenaide", emocao: "vergonha", texto: "Doutor... fui eu que tranquei a porta. Mãe trancando o filho, o senhor já viu isso? Ele era um menino tão bom. Eu devia ter percebido antes, devia ter levado no posto, devia... A culpa é minha, não é?" },
        { quem: "caique", emocao: "firme", texto: "Ninguém aqui dorme há três dias, Excelência. Eu só preciso saber uma coisa, com todo o respeito: isso vai resolver HOJE ou a gente vai sair daqui do mesmo jeito que entrou?" }
      ],
      decisao: {
        prompt: "O laudo está a caminho. A família, diante de você, espera alguma coisa — o quê, exatamente?",
        opcoes: [
          { rotulo: "Tranquilizar com garantia: “podem ficar sossegados — a internação sai esta noite, é só o laudo chegar”",
            fundamento: "Gestão de expectativas das partes",
            efeitos: { tec: -5, hum: 1, imp: -4, tempo: 3 },
            setFlags: { prometeuInternacao: true },
            reacoes: [
              { quem: "caique", emocao: "feliz", texto: "Era só isso que a gente precisava ouvir, Excelência." },
              { quem: "ofelia", emocao: "firme", texto: "A Defensoria consigna em ata, Excelência: o juízo acaba de anunciar o resultado antes da prova. Se o laudo indicar manejo ambulatorial, o senhor decidirá contra a própria promessa — ou contra o paciente?" }
            ],
            feedback: { acerto: "ruim", titulo: "A promessa que prejulga",
              texto: "O laudo ainda não existe — e pode indicar manejo ambulatorial, medicação assistida, qualquer coisa diversa da internação. Prometer o resultado antes da prova compromete a imparcialidade (a decisão fica refém da expectativa criada) e arma uma bomba: se o médico disser 'não interna', a família sairá traída por quem deveria tê-la orientado. O juiz de plantão acolhe a angústia <b>sem hipotecar a sentença</b>: explica o caminho, não garante o destino." },
            proxima: "n3" },

          { rotulo: "Acolher e orientar: explicar que a lei protege Ramiro E a família, desfazer a culpa de D. Zenaide e determinar que o CAPS ofereça acompanhamento também aos familiares",
            fundamento: "Lei 10.216/2001, arts. 2º, parágrafo único, e 3º; RAPS — cuidado à família",
            efeitos: { tec: 4, hum: 9, tempo: 6 },
            carimbo: "FAMÍLIA ACOLHIDA",
            setFlags: { acolheuFamilia: true },
            reacoes: [
              { quem: "zenaide", emocao: "choro", texto: "A culpa não é minha?... Doutor, três dias que eu só ouço dentro da cabeça que eu falhei. O senhor é a primeira pessoa que fala comigo como gente, e não como problema." },
              { quem: "caique", emocao: "surpresa", texto: "Acompanhamento pra gente também? Eu... eu achei que isso aqui era só sobre prender ou soltar, Excelência. Não sabia que dava pra cuidar." },
              { quem: "breno", emocao: "neutro", texto: "O Ministério Público registra com apreço, Excelência. Família orientada hoje é processo que não volta amanhã." }
            ],
            feedback: { acerto: "otimo", titulo: "A lei que abraça os dois lados da porta",
              texto: "A Lei 10.216 não escolheu entre Ramiro e a família: o art. 3º insere a família na própria política de saúde mental, e a RAPS (Portaria 3.088/2011) oferece suporte aos familiares — que aqui também são vítimas da crise: três noites sem dormir, medo real, culpa corrosiva. Explicar que a lei condiciona a internação para <b>proteger</b> (e não para abandonar), e acionar o cuidado para quem cuida, transforma a espera do laudo em começo de tratamento. A jurisdição de plantão também se exerce com cadeira, água e verdade." },
            proxima: "n3" },

          { rotulo: "Repreender a família: “a senhora quer internar o próprio filho como quem descarta — doença mental não é caso de cadeado, deviam ter cuidado dele antes”",
            fundamento: "Advertência contra a criminalização do transtorno mental",
            efeitos: { tec: -4, hum: -10, imp: -5, tempo: 4 },
            setFlags: { humilhouFamilia: true },
            reacoes: [
              { quem: "zenaide", emocao: "vergonha", texto: "..." },
              { quem: "caique", emocao: "raiva", texto: "Descartar?! A senhora aqui do lado não dorme há TRÊS DIAS vigiando a porta do filho, Excelência! A gente veio pedir socorro no único lugar aceso da cidade e sai daqui como réu?!" },
              { quem: "ofelia", emocao: "triste", texto: "Excelência, com respeito: a Defensoria defende Ramiro — e nem por isso acusa esta mãe. O antimanicomial luta contra o abandono, não contra famílias exaustas." }
            ],
            feedback: { acerto: "grave", titulo: "A culpa não trata ninguém",
              texto: "Injusto e cruel. A família não 'criminaliza a doença': pediu o único socorro que conhecia, do único jeito que soube, depois de três dias sem dormir. A bandeira antimanicomial é contra o <b>abandono institucional</b> — clínicas-depósito, contenção, esquecimento —, não contra mães com medo. Humilhar quem pede ajuda errada ensina a não pedir ajuda nenhuma: a próxima crise será resolvida sem juiz, sem médico e sem testemunhas. O plantão corrige o pedido; não esmaga quem o fez." },
            proxima: "n3" }
        ]
      }
    },

    /* ---------- O LAUDO CHEGA ---------- */
    n3: {
      falas: [
        { quem: "narrador", texto: "23h50. A Dra. Íris volta com o colete do SAMU ainda vestido e uma folha preenchida à mão. No canto da folha, um carimbo de CRM." },
        { quem: "iris", emocao: "firme", texto: "Laudo circunstanciado, Excelência: episódio psicótico agudo, três dias de evolução, recusa total de contato e de medicação, desidratação leve, risco concreto a si e a terceiros. Tentei o manejo no local — não foi possível. Indicação: internação para estabilização. E confirmo: o leito do Hospital Geral São Vicente, pelo SUS, segue disponível, com retaguarda do CAPS na alta." },
        { quem: "caique", emocao: "firme", texto: "Então está decidido, Excelência: interna na Recanto Sereno, que a gente já pagou. Particular, doutor — é melhor que fila de SUS. Sessenta dias adiantados." },
        { quem: "ofelia", emocao: "firme", texto: "Excelência, a Defensoria pede que se leia o contrato dessa clínica antes de qualquer assinatura: tempo indeterminado, visita uma vez por mês, isolamento como “método”, nenhum médico identificado. Isso tem nome na Lei 10.216 — e o nome é asilo." }
      ],
      decisao: {
        prompt: "O laudo indica internação. Agora a pergunta é outra: qual internação — e com que garantias?",
        opcoes: [
          { rotulo: "Autorizar a internação na clínica particular já contratada, por tempo indeterminado — “a família pagou, conhece e confia; não cabe ao Estado escolher por ela”",
            fundamento: "Autonomia da família; contrato já firmado",
            efeitos: { tec: -10, hum: -8, imp: -6, tempo: 5 },
            carimbo: "CLÍNICA AUTORIZADA",
            setFlags: { internacaoAsilar: true, manchaGrave: true },
            reacoes: [
              { quem: "ofelia", emocao: "raiva", texto: "Tempo indeterminado, visita mensal a critério da direção, isolamento como método e nenhum médico responsável — o art. 4º, §3º, VEDA instituições com características asilares, Excelência! A Defensoria impetrará habeas corpus em favor de Ramiro ainda esta madrugada." },
              { quem: "iris", emocao: "triste", texto: "Excelência, eu acabei de examinar esse rapaz. Ele precisa de hospital, equipe e prazo — não de um portão alto. Aquela clínica não integra a RAPS e não tem sequer fiscalização sanitária em dia." },
              { quem: "caique", emocao: "feliz", texto: "Obrigado, Excelência. A van deles busca ainda hoje." }
            ],
            feedback: { acerto: "grave", titulo: "O asilo de portas novas",
              texto: "O contrato reúne, cláusula por cláusula, as características asilares que o art. 4º, §3º, da Lei 10.216 <b>veda</b>: prazo indeterminado a critério da direção, isolamento do convívio externo 'como método', visita mensal discricionária, nenhum corpo clínico identificado. E o art. 9º exige que o juiz considere as condições de segurança do estabelecimento — aqui, impossíveis de aferir: a clínica nem fiscalização sanitária tem. Internação não é produto que se compra adiantado: é tratamento com começo, equipe e fim. Você assinou a entrada de um depósito — e o dinheiro da família comprou exatamente o silêncio que a lei quis proibir." },
            proxima: "fim_grave" },

          { rotulo: "Negar a internação: “a lei antimanicomial não permite internar ninguém contra a vontade — tratamento, só em liberdade”",
            fundamento: "Lei 10.216/2001 (leitura equivocada)",
            efeitos: { tec: -7, hum: -6, tempo: 4 },
            setFlags: { negouComLaudo: true },
            reacoes: [
              { quem: "iris", emocao: "surpresa", texto: "Excelência, com respeito: a lei CONDICIONA a internação, não a proíbe. O laudo atesta risco atual a si e a terceiros e o esgotamento do manejo extra-hospitalar — é exatamente a hipótese em que a própria Lei 10.216 a admite." },
              { quem: "zenaide", emocao: "medo", texto: "Então não tem mais nada, doutor? Nem o hospital do governo, com a doutora dizendo que precisa?!" },
              { quem: "caique", emocao: "raiva", texto: "Ótimo. Então a gente resolve sozinho: a clínica busca sem papel nenhum. Era pra isso que servia a Justiça?" }
            ],
            feedback: { acerto: "ruim", titulo: "A lei que condiciona, não proíbe",
              texto: "Erro de leitura com consequência grave. A Lei 10.216 não aboliu a internação: <b>condicionou-a</b> — laudo circunstanciado (art. 6º), último recurso após esgotados os meios extra-hospitalares (art. 4º), controle do MP e do juízo (arts. 8º e 9º). Esta noite, todos os requisitos estão presentes e atestados por médica da rede pública. Negar agora não é antimanicomial: é desproteção — e empurra a família, desamparada, para a única porta que ficou aberta: a clínica asilar paga adiantado, sem laudo, sem prazo e sem fiscalização." },
            proxima: "fim_grave" },

          { rotulo: "Determinar a internação com PRAZO e controle: leito SUS no Hospital Geral São Vicente, vedada instituição de características asilares, reavaliação médica em 72 horas, relatório quinzenal ao juízo e ciência imediata ao Ministério Público",
            fundamento: "Lei 10.216/2001, arts. 4º, 6º e 9º",
            requerFoco: "f_rede",
            efeitos: { tec: 9, hum: 8, tempo: 9 },
            carimbo: "INTERNAÇÃO COM PRAZO",
            setFlags: { compulsoriaComPrazo: true, leitoSUS: true },
            reacoes: [
              { quem: "ofelia", emocao: "feliz", texto: "Hospital geral, prazo, reavaliação e relatório: a Defensoria nada tem a opor — é a internação como a lei desenhou, Excelência. Acompanharemos cada reavaliação." },
              { quem: "iris", emocao: "feliz", texto: "O São Vicente confirma o leito, Excelência. E registro: internação com data de revisão muda o comportamento de todo mundo — da equipe, da família e do próprio paciente." },
              { quem: "caique", emocao: "surpresa", texto: "Espera... no SUS ele tem médico todo dia, visita liberada e data pra reavaliar? E na que a gente pagou... não tinha nada disso no papel. Eu li o contrato errado a vida inteira, Excelência." }
            ],
            feedback: { acerto: "otimo", titulo: "Internar protegendo",
              texto: "É a internação compulsória do art. 9º como a lei a desenhou: fundada em laudo médico circunstanciado (art. 6º), decretada apenas quando os recursos extra-hospitalares se esgotaram (art. 4º) — o que a médica atestou após tentar o manejo no local —, em hospital geral do SUS, com vedação expressa a estabelecimento asilar (art. 4º, §3º) e com aquilo que distingue tratamento de depósito: <b>prazo</b>, reavaliação em 72 horas, relatórios quinzenais e o MP ciente. O juiz que considera 'as condições de segurança do estabelecimento' (art. 9º) escolhe o leito fiscalizável — não o portão alto." },
            proxima: "n4" },

          { rotulo: "Reconhecer o caso como internação INVOLUNTÁRIA — ato médico: homologar o encaminhamento da Dra. Íris ao leito do São Vicente, com comunicação ao MP em 72 horas e os autos do plantão remetidos à vara para acompanhamento",
            fundamento: "Lei 10.216/2001, arts. 6º, parágrafo único, II, e 8º, §1º",
            efeitos: { tec: 6, hum: 6, tempo: 7 },
            carimbo: "FLUXO MÉDICO",
            setFlags: { fluxoMedico: true, leitoSUS: true },
            reacoes: [
              { quem: "iris", emocao: "neutro", texto: "Assumo a indicação como ato médico, Excelência, e o hospital fará a comunicação ao Ministério Público no prazo legal." },
              { quem: "breno", emocao: "neutro", texto: "O Ministério Público aguardará a comunicação do estabelecimento, Excelência — e registra que o juízo bem distinguiu as modalidades da lei." }
            ],
            feedback: { acerto: "bom", titulo: "O caminho médico também é legal — faltou o cinto de segurança",
              texto: "Tecnicamente correto: havendo indicação médica e pedido familiar, a internação é <b>involuntária</b> — ato médico, não judicial —, com comunicação ao MP em 72 horas pelo responsável técnico (art. 8º, §1º). Distinguir as modalidades do art. 6º, parágrafo único, é mais do que muito juiz faz. Mas o caso já estava sob jurisdição, e a via puramente administrativa dispensa o que custava uma linha: prazo expresso de reavaliação e relatórios ao juízo — garantias que, para Ramiro e para a família, fazem a diferença entre confiar e torcer." },
            proxima: "n4" }
        ]
      }
    },

    /* ---------- EFETIVIDADE ÀS 23H: COMO SE CUMPRE ---------- */
    n4: {
      falas: [
        { quem: "narrador", texto: "00h05. A decisão está assinada. Falta o mais difícil: do outro lado da cidade, Ramiro continua trancado num quarto — e a chave, do lado de fora, na bolsa da mãe. Como uma ordem judicial atravessa uma porta?" },
        { quem: "caique", emocao: "firme", texto: "Chama a polícia logo, Excelência. Arromba e acabou — em dez minutos ele está na ambulância. Do jeito que ele está, conversa não vai resolver." },
        { quem: "iris", emocao: "firme", texto: "Excelência, com a chave da mãe ninguém precisa arrombar nada. A equipe do SAMU tem protocolo de abordagem de crise: voz conhecida, tempo, medicação se preciso. Farda e arma, para quem está ouvindo vozes, não é socorro — é a confirmação do pesadelo." }
      ],
      decisao: {
        prompt: "Meia-noite. A ordem existe; falta cumpri-la. Quem bate na porta de Ramiro?",
        opcoes: [
          { rotulo: "Expedir mandado à Polícia Militar: arrombamento da porta e condução imediata de Ramiro ao hospital",
            fundamento: "Poder geral de cautela; cumprimento forçado de ordem judicial",
            efeitos: { tec: -5, hum: -8, imp: -4, tempo: 5 },
            carimbo: "FORÇA POLICIAL",
            setFlags: { policiaOstensiva: true },
            reacoes: [
              { quem: "iris", emocao: "medo", texto: "Excelência, eu acabei de estar com ele. Se a primeira coisa que entrar naquele quarto for um fuzil, o que era crise vira tragédia — e a literatura está cheia de ocorrências que terminaram assim." },
              { quem: "zenaide", emocao: "medo", texto: "Polícia, doutor? Pro meu filho doente? Eu pedi socorro... eu não dei queixa." },
              { quem: "ofelia", emocao: "firme", texto: "A Defensoria consigna: havia equipe de saúde disponível e protocolo de crise. A escolha pela tropa constará do pedido de providências." }
            ],
            feedback: { acerto: "ruim", titulo: "A saúde tratada como ocorrência",
              texto: "A ordem é legal; o modo a trai. O art. 2º, parágrafo único, II, da Lei 10.216 assegura ao paciente ser tratado 'com humanidade e respeito e no interesse exclusivo de beneficiar sua saúde' — e a abordagem ostensiva faz o contrário: confirma o delírio persecutório, eleva o risco de reação e de uso de força, e grava na memória de Ramiro (e da vizinhança) que ele foi <b>capturado</b>, não socorrido. O protocolo correto existia e estava na sala: equipe de saúde conduz; a polícia, se necessária, fica de retaguarda, acionável pela própria equipe." },
            proxima: "fim_bom" },

          { rotulo: "Cumprimento imediato pela equipe de SAÚDE: SAMU e Dra. Íris conduzem a abordagem com a chave e a presença da mãe, oficial de justiça do plantão acompanha e documenta, apoio policial apenas de retaguarda — e só se a equipe solicitar",
            fundamento: "Lei 10.216/2001, arts. 2º, parágrafo único, II, e 9º; protocolo RAPS de abordagem de crise",
            efeitos: { tec: 8, hum: 9, tempo: 8 },
            carimbo: "CUMPRIMENTO HUMANIZADO",
            setFlags: { cumprimentoCuidadoso: true },
            reacoes: [
              { quem: "iris", emocao: "feliz", texto: "É o desenho certo, Excelência: a primeira voz que ele vai ouvir é a da mãe, a segunda é a minha. A viatura espera na esquina — espero que sem trabalho." },
              { quem: "zenaide", emocao: "choro", texto: "Eu vou junto?... Doutor, eu tranquei aquela porta achando que era o fim. O senhor está me deixando ser eu a abrir." },
              { quem: "breno", emocao: "neutro", texto: "O Ministério Público registra a forma de cumprimento, Excelência — servirá de modelo para os próximos plantões." }
            ],
            feedback: { acerto: "otimo", titulo: "A porta se abre por dentro",
              texto: "Cada um no seu papel: a equipe de saúde aborda (é crise sanitária, não ocorrência policial), a mãe destranca e fala primeiro, o oficial de justiça documenta a regularidade, e a polícia — retaguarda silenciosa — só age se a própria equipe pedir (art. 9º: segurança de todos, inclusive do paciente). É o art. 2º, parágrafo único, II, em ato: humanidade e respeito, no interesse exclusivo da saúde. A internação bem cumprida começa a tratar antes da ambulância: no tom de voz do corredor de casa." },
            proxima: function (f) { return f.avaliacaoInLoco ? "fim_otimo" : "fim_bom"; } },

          { rotulo: "Suspender o cumprimento até as 8h: “de madrugada ninguém interna ninguém — amanhã, à luz do dia, com mais estrutura”",
            fundamento: "Prudência; cumprimento em horário adequado",
            efeitos: { tec: -4, hum: -6, tempo: 3 },
            setFlags: { adiouCumprimento: true },
            reacoes: [
              { quem: "caique", emocao: "raiva", texto: "Mais oito horas?! Excelência, a gente veio aqui porque NÃO DÁ pra passar mais uma noite. A ordem existe e ele continua trancado — o que mudou pra nós?" },
              { quem: "iris", emocao: "triste", texto: "Clinicamente, Excelência, cada hora sem medicação o quadro avança. A estrutura que o senhor espera para amanhã — equipe, ambulância, leito — está disponível agora." }
            ],
            feedback: { acerto: "ruim", titulo: "A urgência não dorme",
              texto: "O laudo atesta risco <b>atual</b> — a si e a terceiros — e o próprio juízo o reconheceu ao deferir a internação. Adiar oito horas o cumprimento é devolver a família exatamente à situação que a trouxe ao plantão: trancada em casa com o risco que a Justiça já declarou existir, agora com uma ordem assinada na bolsa servindo de promessa. A 'estrutura' invocada já existia à meia-noite: SAMU de prontidão, médica presente, leito confirmado. Prudência que ignora a clínica não é prudência: é adiamento do dever." },
            proxima: "fim_bom" }
        ]
      }
    },

    /* ---------- FINS ---------- */
    fim_otimo: {
      falas: [
        { quem: "narrador", texto: "00h55. O telefone do plantão toca: é a equipe do SAMU. D. Zenaide destrancou a porta e disse só “filho, a mãe está aqui”. Vinte minutos de conversa depois, Ramiro entrou na ambulância sozinho, enrolado numa coberta, segurando a mão da mãe. No São Vicente, há um leito com o nome dele e uma reavaliação marcada no quadro." },
        { quem: "zenaide", emocao: "choro", texto: "Doutor... três dias que eu não sabia se pedia a Deus ou pedia à polícia. Era ao senhor que eu tinha que pedir. Hoje eu durmo — e amanhã eu visito meu filho num hospital de verdade." }
      ],
      fim: {
        titulo: "A PRIMEIRA NOITE EM TRÊS DIAS",
        selo: "otimo",
        setFlags: { internacaoComCuidado: true, redeAcionada3: true },
        texto: "Nenhum atalho foi tomado e nenhuma proteção faltou: o médico foi antes da caneta (art. 6º), a internação veio com prazo, leito SUS em hospital geral e fiscalização (arts. 4º e 9º), e a porta de Ramiro se abriu pela voz da mãe — não pelo pé de ninguém. A clínica paga adiantado perdeu um interno; o sistema de saúde ganhou um paciente; e uma família que entrou no fórum pedindo força saiu levando cuidado. A Lei 10.216 foi cumprida por inteiro — inclusive na parte que não está escrita: a do tom de voz."
      }
    },

    fim_bom: {
      falas: [
        { quem: "narrador", texto: "01h30. Ramiro deu entrada no Hospital Geral São Vicente. O plantão se encerra com a papelada em ordem e um silêncio que ninguém comemora: a internação terminou no lugar certo, mas o caminho até ela deixou arranhões que não saem no relatório." }
      ],
      fim: {
        titulo: "INTERNADO — COM ARRANHÕES",
        selo: "bom",
        texto: "O essencial foi salvo: laudo médico antes da decisão, leito SUS em hospital geral, controle do MP — Ramiro está onde a lei manda, e não atrás do portão alto da clínica paga. Mas a noite cobrou pedágio: decisões tomadas no susto, uma espera a mais, ou uma porta que se abriu com mais força do que precisava. A Lei 10.216 foi atendida na letra; a sua melhor parte — a que trata o paciente como dono da própria história — ficou pelo caminho. Ramiro vai melhorar. A lembrança desta noite, talvez não."
      }
    },

    fim_grave: {
      falas: [
        { quem: "narrador", texto: "01h10. Na calçada do fórum, Caíque liga para a clínica. A van chega rápida: dois enfermeiros grandes, uma prancheta, nenhuma pergunta sobre Ramiro além do número do cartão. D. Zenaide assina onde mandam e guarda o recibo na bolsa, junto com a chave do quarto que não vai mais precisar trancar — agora há quem tranque por ela." }
      ],
      fim: {
        titulo: "O SILÊNCIO PAGO ADIANTADO",
        selo: "grave",
        setFlags: { internacaoAsilar: true, manchaGrave: true },
        texto: "Ramiro foi internado esta noite — mas não tratado. Atrás do portão da Recanto Sereno há tempo indeterminado, visita mensal a critério da direção, isolamento 'como método' e nenhum médico que assine o próprio nome: o retrato falado do que o art. 4º, §3º, da Lei 10.216 quis extinguir. A Defensoria impetrará habeas corpus; o MP pedirá a interdição do estabelecimento; e a decisão do plantão cairá com a fundamentação que estava, desde as 23h, nos autos. Fica na conta desta noite uma mãe que paga em dia para não ver o filho — e um paciente que aprendeu que pedir socorro à família termina em contenção."
      }
    }
  }
});
