/* ============================================================
   TOGA — main.js : o PONTO DE PARTIDA
   ------------------------------------------------------------
   É o último script carregado pelo index.html. Três papéis:

   1. Definir os INTERLÚDIOS — consequências que chegam ENTRE
      audiências (um ofício, uma notícia, um relatório), de
      acordo com as "flags" que suas decisões acenderam.
   2. Definir as MANCHETES do epílogo — como a imprensa local
      noticia o seu dia de trabalho.
   3. Ligar os botões do menu e dar a partida no jogo.
   ============================================================ */

window.TOGA = window.TOGA || {};
TOGA.config = {
  modoEstudo: true,
  // Quando o jogo estiver publicado (GitHub Pages etc.), informe o
  // endereço aqui: ele entra nos cartões compartilháveis.
  urlJogo: ""
};

/* ---------------------------------------------------------
   INTERLÚDIOS
   Formato: { id, aposCaso (índice do caso na pauta: 0 a 3),
              condicao(flags) -> true/false, titulo, texto,
              tom: "bom" | "grave" | "neutro",
              efeitos?, setFlags? }
   Repare: o do item "int_mpu" só chega DEPOIS do caso
   seguinte — como na vida, certas consequências demoram
   algumas horas para bater à porta do gabinete.
   --------------------------------------------------------- */
TOGA.interludios = [

  { id: "int_protegida", aposCaso: 0, tom: "bom",
    condicao: function (f) { return f.protegida && f.pacoteCompleto; },
    titulo: "Relatório do CREAS",
    texto: "Entre uma audiência e outra, a assessoria entrega um relatório: Marlene foi inserida no programa de acompanhamento, a monitoração eletrônica está ativa e os alimentos provisórios serão descontados em folha. Sem incidentes. A rede que você acionou está de pé.",
    efeitos: { hum: 4 } },

  { id: "int_hc_ok", aposCaso: 0, tom: "bom",
    condicao: function (f) { return !!f.presoFundamentado; },
    titulo: "Plantão do TJ mantém sua decisão",
    texto: "O habeas corpus prometido pela defesa foi distribuído — e DENEGADO em decisão liminar: “a prisão preventiva encontra-se concretamente fundamentada no risco atual à ofendida, na forma dos arts. 312, §2º, e 313, III, do CPP”. Fundamentação que se sustenta sozinha no andar de cima.",
    efeitos: { tec: 4 } },

  { id: "int_hc_ruim", aposCaso: 0, tom: "grave",
    condicao: function (f) { return f.presoPreventivo && !f.presoFundamentado; },
    titulo: "HC concedido contra a sua decisão",
    texto: "O Tribunal concedeu a liminar no habeas corpus: “fundamentação genérica, calcada na gravidade abstrata, em desacordo com o art. 315, §2º, do CPP”. Ivan foi posto em liberdade duas horas depois de preso. O risco existia nos autos — faltou colocá-lo na decisão.",
    efeitos: { tec: -6 } },

  { id: "int_mpu", aposCaso: 1, tom: "grave",
    condicao: function (f) { return !!f.mpuRevogada; },
    titulo: "Ofício urgente da Delegacia",
    texto: "A assessoria interrompe seu café com um ofício: nova ocorrência registrada ontem à noite envolvendo Ivan e Marlene — vias de fato e cárcere privado tentado, na frente das crianças. O delegado representa pela preventiva ao plantão. E há um segundo papel na pasta: a Corregedoria solicita, em 48 horas, informações sobre os fundamentos da revogação das medidas protetivas.",
    setFlags: { manchaGrave: true } },

  { id: "int_sofia", aposCaso: 1, tom: "bom",
    condicao: function (f) { return !!f.acordoSofia; },
    titulo: "Ofício da escola de Sofia",
    texto: "A diretora da escola, intimada do acordo para fins de comunicação, responde com um ofício curto: frequência regularizada, e a professora anotou que Sofia contou, na rodinha, que “agora tem calendário na geladeira das duas casas”. Há sentenças que cabem numa geladeira.",
    efeitos: { hum: 4 } },

  { id: "int_cnj", aposCaso: 1, tom: "grave",
    condicao: function (f) { return !!f.revitimizacao; },
    titulo: "O protesto virou providência",
    texto: "O Ministério Público cumpriu o que consignou em ata: encaminhou notícia ao CNJ e à Corregedoria sobre a oitiva da criança em sala de audiência, na presença dos pais, contra a recomendação técnica e a forma da Lei 13.431/2017. O expediente chegará por ofício. Dias assim ficam no assento funcional — e na memória de Sofia.",
    setFlags: { manchaGrave: true },
    efeitos: { tec: -4 } },

  { id: "int_mangas", aposCaso: 2, tom: "bom",
    condicao: function (f) { return !!f.pazVizinhos; },
    titulo: "Uma sacola no balcão da secretaria",
    texto: "O servidor entra rindo: deixaram uma sacola “para o doutor juiz”, com mangas maduras e um bilhete a quatro mãos — letra trêmula e letra firme: “Da árvore da divisa. Metade de cada um. Sem processo.” Você manda agradecer e divide com o cartório. Jurisprudência não dá fruto; acordo, sim.",
    efeitos: { hum: 3 } },

  { id: "int_frouxo", aposCaso: 2, tom: "grave",
    condicao: function (f) { return !!f.acordoFrouxo; },
    titulo: "Atermação recém-protocolada",
    texto: "A secretaria informa: o Sr. Anísio acaba de protocolar nova reclamação — o acordo “de palavra” não sobreviveu ao primeiro sábado. Sem cláusula de descumprimento, não há o que executar: o caso volta inteiro para a fila, agora com uma frustração a mais dentro dele.",
    efeitos: { cel: -4 } },

  { id: "int_thor", aposCaso: 3, tom: "bom",
    condicao: function (f) { return !!f.thorFeliz; },
    titulo: "Uma foto no gabinete",
    texto: "No fim da audiência, a assessora entra com um envelope que não tem capa, nem numeração, nem prazo.",
    entrega: {
      quem: { id: "assessora", nome: "Laís", papel: "sua assessora",
              avatar: { pele: "#d8a87f", cabelo: "coque", corCabelo: "#3a2a1a", traje: "blazer", corTraje: "#54453a", corBlusa: "#efe5c8", oculos: true } },
      falas: [
        { emocao: "feliz", texto: "Isso não é petição, doutor. Veio no balcão, “para o juiz do Thor”. Eu conferi: é só uma foto — e um recado atrás, a caneta." }
      ],
      objeto: "fotoThor",
      rotuloReceber: "🤲 Pegar a foto"
    },
    efeitos: { hum: 3 } },

  { id: "int_gatos_pacto", aposCaso: 4, tom: "bom", anexo: "plaquinhaFrajola",
    condicao: function (f) { return !!f.pactoGatos; },
    titulo: "Sardinha no balcão da secretaria",
    texto: "O servidor da secretaria aparece na porta segurando uma marmita ainda morna — e o celular na outra mão.",
    entrega: {
      quem: { id: "servidor", nome: "Servidor da secretaria", papel: "balcão",
              avatar: { pele: "#c98e66", cabelo: "curto", corCabelo: "#241a10", traje: "camisa", corTraje: "#3f4a5a" } },
      falas: [
        { emocao: "feliz", texto: "Da dona Iolanda, doutor: sardinha. Metade pro senhor, metade pro Sansão — “sem processo”, ela mandou dizer." },
        { emocao: "surpresa", texto: "E o Edson mandou um print pro cartório. Olha o que fixaram no muro hoje de manhã." }
      ],
      objeto: "plaquinhaFrajola",
      rotuloReceber: "🤲 Ver o print"
    },
    efeitos: { hum: 3 } },

  { id: "int_gatos_grave", aposCaso: 4, tom: "grave",
    condicao: function (f) { return !!f.confinamentoTotal; },
    titulo: "Ofício da Sociedade Protetora dos Animais",
    texto: "A entidade protocola representação: o cão confinado por decisão judicial uiva dia e noite, e os MESMOS vizinhos do abaixo-assinado do barulho agora reclamam do uivo. O recurso inominado de Edson foi distribuído com parecer técnico veterinário sobre sofrimento animal — e os gatos, observa a peça com alguma ironia, continuam soltos na via pública. A Turma Recursal lerá tudo isso junto.",
    efeitos: { tec: -4 } },

  { id: "int_juri_hc", aposCaso: 5, tom: "grave",
    condicao: function (f) { return !!f.testemunhaPresa && !f.reconsiderou; },
    titulo: "Plantão concede HC à testemunha",
    texto: "Antes mesmo de você deixar o fórum, a liminar chega: “constrangimento ilegal manifesto — a retratação permanecia juridicamente possível até a sentença (CP, art. 342, §2º), e o momento próprio da providência é o do art. 211 do CPP”. Osmar foi posto em liberdade no fim da noite. O segundo papel é da Corregedoria: informações sobre a prisão da testemunha, em 48 horas.",
    efeitos: { tec: -6 } },

  { id: "int_juri_protecao", aposCaso: 5, tom: "bom",
    condicao: function (f) { return !!f.testemunhaProtegida; },
    titulo: "Ofício do programa de proteção",
    texto: "Resposta da Lei 9.807 em tempo recorde: Osmar e a esposa foram provisoriamente acolhidos e transferidos de endereço até o plenário. No campo “observações” do formulário, o agente transcreveu um recado do protegido: “diga ao doutor juiz que dessa vez a Justiça chegou antes do medo.”",
    efeitos: { hum: 4 } },

  { id: "int_juri_arma", aposCaso: 5, tom: "bom",
    condicao: function (f) { return !!f.oficioInvestigacao; },
    titulo: "A espingarda apareceu",
    texto: "O ofício que você mandou com a impronúncia surtiu efeito antes do esperado: cobrada, a polícia refez a busca na casa dos tios — e localizou a espingarda no forro, com perícia compatível com o laudo necroscópico. O Ministério Público já prepara nova denúncia com base na prova nova (CPP, art. 414, parágrafo único). A régua que você manteve não soltou ninguém: obrigou o Estado a trabalhar.",
    efeitos: { tec: 4 } },

  /* ============ A COBRANÇA INSTITUCIONAL (os dois dias) ============
     Sem decisão a tomar: a assessoria comunica e responde. O que
     sobra para o juiz é o que sobra na vida real — o peso.      */

  { id: "int_metas", pauta: "*", aposCaso: 1, tom: "neutro",
    condicao: function (f, estado) { return !estado || estado.pauta !== "dia3"; },
    titulo: "Circular da Corregedoria — Metas Nacionais",
    texto: "A assessora entra com um ofício-circular e a expressão de quem já leu: “Corregedoria, lembrando o cronograma das Metas 1 e 2 do CNJ. O painel aponta processos antigos pendentes na unidade e pede plano de ação em dez dias. Eu já preparei a minuta de resposta com a proposta de mutirão — só falta a sua assinatura.” Você assina entre uma audiência e outra, no canto da mesa. A meta não julga nenhum processo; mas cobra todos, inclusive os que você está julgando agora.",
    efeitos: { estresse: 8 } },

  /* ============ A VIDA FORA DA TOGA ============
     O juiz também é gente: vinhetas curtas, dirigidas pelo
     ESTRESSE (a condição recebe o estado como 2º argumento).
     No máximo uma por faixa — empatia, não melodrama.       */

  /* ============ RECONHECIMENTO INSTITUCIONAL ============
     Eventos que se SOMAM com o desempenho ao longo dos dias:
     condicionados à carreira (selos ótimos acumulados) e às
     conquistas — cada um acontece UMA vez na carreira.      */

  { id: "int_elogio", pauta: "*", aposCaso: 2, tom: "bom",
    condicao: function (f, estado) {
      if (!TOGA.conquistas || TOGA.conquistas.tem("elogiado")) return false;
      if (f.manchaGrave) return false;
      if (estado && estado.pauta === "dia3") return false;   // a Corregedoria dorme
      return TOGA.conquistas.nivelCarreira().otimos >= 4;
    },
    titulo: "Ofício da Corregedoria — desta vez, bom",
    texto: "A assessora entra segurando um ofício com uma solenidade incomum — e um sorriso que ela não está conseguindo disfarçar.",
    entrega: {
      quem: { id: "assessora", nome: "Laís", papel: "sua assessora",
              avatar: { pele: "#d8a87f", cabelo: "coque", corCabelo: "#3a2a1a", traje: "blazer", corTraje: "#54453a", corBlusa: "#efe5c8", oculos: true } },
      falas: [
        { emocao: "firme", texto: "Corregedoria, doutor. Eu sei — todo papel deles vem com o coração na mão. Esse pode abrir sem medo." },
        { emocao: "feliz", texto: "É um ELOGIO FUNCIONAL. Pelo conjunto. Vai para os seus assentamentos — e, se o senhor não emoldurar, eu emolduro." }
      ],
      objeto: "elogioFuncional",
      rotuloReceber: "🤲 Receber o elogio"
    },
    efeitos: { estresse: -8 } },

  { id: "int_estudantes", pauta: "*", aposCaso: 1, tom: "bom",
    condicao: function (f, estado) {
      if (!TOGA.conquistas || TOGA.conquistas.tem("salaDeAula")) return false;
      if (estado && estado.pauta === "dia3") return false;   // de madrugada não há excursão
      return TOGA.conquistas.nivelCarreira().estrelas >= 2;
    },
    titulo: "Uma visita da faculdade",
    texto: "A assessora avisa: “tem uma professora de Direito na porta, com uma fila de estudantes no corredor. Dizem que vieram pela fama da comarca.”",
    entrega: {
      visita3d: true,
      quem: { id: "professora", nome: "Profa. Hélia", papel: "Faculdade de Direito",
              avatar: { pele: "#a86a48", cabelo: "coque", corCabelo: "#574737", traje: "blazer", corTraje: "#4a3a55", corBlusa: "#efe5c8", oculos: true } },
      falas: [
        { emocao: "firme", texto: "Excelência, eu ensino processo há vinte anos. Os meus alunos sabem recitar o CPC — mas nunca viram uma audiência conduzida de verdade." },
        { emocao: "feliz", texto: "A turma escolheu ESTA comarca para assistir. Eles querem ver por que os senhores estudam tanto para decidir sobre gente. Posso sentá-los no fundo da sala?" }
      ]
    },
    setFlags: { plateiaEstudantes: true },
    efeitos: { hum: 4 } },

  { id: "int_comunidade", pauta: "dia2", aposCaso: 3, tom: "bom",
    condicao: function (f) {
      if (!TOGA.conquistas || TOGA.conquistas.tem("comunidade")) return false;
      const boas = ["d1_protegida", "d1_acordoSofia", "d1_pazVizinhos", "d1_thorFeliz", "d1_pactoGatos", "d1_testemunhaProtegida"];
      return boas.filter(function (k) { return !!f[k]; }).length >= 3;
    },
    titulo: "Uma entrega que não tem número de processo",
    texto: "O servidor da secretaria sobe do balcão com um rolo de papel pardo amarrado com barbante — e a expressão de quem carrega algo maior do que parece.",
    entrega: {
      quem: { id: "servidor", nome: "Servidor da secretaria", papel: "balcão",
              avatar: { pele: "#c98e66", cabelo: "curto", corCabelo: "#241a10", traje: "camisa", corTraje: "#3f4a5a" } },
      falas: [
        { emocao: "surpresa", texto: "O pessoal do bairro deixou no balcão, doutor. Vieram em grupo — a dona do salão, o seu Anísio das mangas, o povo da feira." },
        { emocao: "feliz", texto: "É um abaixo-assinado. Mas não é pedindo nada. É AGRADECENDO. Eu trabalho aqui há dezoito anos e nunca vi isso." }
      ],
      objeto: "placaComunidade",
      rotuloReceber: "🤲 Receber o abaixo-assinado"
    },
    efeitos: { hum: 5, estresse: -6 } },

  { id: "int_vida_jantar", pauta: "*", aposCaso: 2, tom: "neutro",
    condicao: function (f, estado) { return !!estado && estado.pauta !== "dia3" && (estado.estresse || 0) >= 55 && !f._vida_dia; },
    setFlags: { _vida_dia: true },
    titulo: "Um áudio de 9 segundos",
    texto: "No intervalo, o celular vibra. Áudio da sua filha: “Pai, a mãe perguntou se hoje você janta com a gente ou janta com o fórum.” Risada no fundo. Você olha a pauta da tarde, faz a conta que todo juiz do interior sabe fazer de cabeça — e responde com um “vou tentar” que vocês dois conhecem bem. A toga não tira férias; mas quem a veste tem casa, e a casa pergunta.",
    efeitos: { estresse: -4 } },

  { id: "int_vida_medico", pauta: "*", aposCaso: 4, tom: "neutro",
    condicao: function (f, estado) { return !!estado && (estado.estresse || 0) >= 70 && !f._vida_dia; },
    setFlags: { _vida_dia: true },
    titulo: "Lembrete: consulta remarcada (3ª vez)",
    texto: "A notificação aparece no canto da tela do computador: “Consulta — Dr. Anselmo — REMARCADA a pedido do paciente.” Terceira vez. A assessora, que viu por cima do ombro, não diz nada — mas no fim do expediente deixa, sem alarde, o telefone do setor de saúde do fórum anotado num pedaço de papel sobre a sua mesa. Cuidar de todo mundo não pode ser desculpa para não caber na própria agenda.",
    efeitos: { estresse: 3 } },

  { id: "int_vida_cafe", pauta: "*", aposCaso: 5, tom: "bom",
    condicao: function (f, estado) { return !!estado && (estado.estresse || 0) <= 40; },
    titulo: "O café do fim da pauta",
    texto: "A assessora aparece com duas xícaras: “última audiência, doutor. E hoje o senhor decidiu tudo sem apertar a caneta até ela ranger — a secretaria nota essas coisas.” O café está na temperatura certa. Servir a Justiça inteira exige chegar inteiro ao fim do dia; hoje, deu.",
    efeitos: { estresse: -4 } },

  { id: "int_decoro", pauta: "*", aposCaso: 3, tom: "neutro",
    condicao: function (f, estado) { return !estado || estado.pauta !== "dia3"; },
    titulo: "Ofício-circular do CNJ — deveres do cargo",
    texto: "“Mais um de ciência, doutor”, diz a assessora, sem cerimônia. “CNJ, relembrando as restrições do cargo: conduta irrepreensível na vida pública e privada, postura comedida em redes sociais, vedação de manifestação sobre processos — Resolução 305 e LOMAN. Já certifiquei a ciência nos assentamentos.” Ela sai. Você fica meio minuto repassando mentalmente as últimas postagens, as últimas conversas de balcão, a última fila de supermercado em que alguém te reconheceu. A toga não tira férias — nem do feed, nem da feira.",
    efeitos: { estresse: 6 } },

  /* ============ DIA 2 — Dia Decisivo ============ */

  { id: "int_custodia_bom", pauta: "dia2", aposCaso: 0, tom: "bom", anexo: "cartaJonas",
    condicao: function (f) { return f.jonasLivre && f.criancasAcolhidas; },
    titulo: "Ofício do abrigo — e uma visita",
    texto: "O ofício confirma: Jonas e os filhos acolhidos JUNTOS, jantar às sete, matrícula encaminhada. E atrás do ofício vem o autor de um pedido que a coordenadora do abrigo não soube negar — de papel dobrado em quatro na mão.",
    entrega: {
      visita3d: true,
      quem: { id: "luan", nome: "Luan", papel: "9 anos, filho de Jonas", escala: 0.78,
              avatar: { pele: "#8a5436", cabelo: "curto", corCabelo: "#241505", traje: "camisa", corTraje: "#5a6a7a" } },
      falas: [
        { emocao: "vergonha", texto: "A tia falou que eu podia entregar, se fosse rapidinho." },
        { emocao: "feliz", texto: "Fui eu que escrevi. Ela só ajudou nas letras difíceis. O pai falou que foi o senhor que mandou a gente ter janta." }
      ],
      objeto: "cartaJonas",
      rotuloReceber: "🤲 Receber a carta"
    },
    efeitos: { hum: 4 } },

  { id: "int_custodia_grave", pauta: "dia2", aposCaso: 0, tom: "grave",
    condicao: function (f) { return !!f.jonasPreso; },
    titulo: "HC concedido no plantão",
    texto: "O plantão do Tribunal concedeu habeas corpus a Jonas em quarenta minutos: “prisão manifestamente desproporcional — furto famélico de R$ 32 com restituição integral”. A liminar cita os mesmos autos que você leu. O Conselho Tutelar informa que as crianças passaram o dia na sede, esperando.",
    setFlags: { jonasPreso: false, manchaGrave: true },
    efeitos: { tec: -6 } },

  { id: "int_desenho", pauta: "dia2", aposCaso: 1, tom: "bom", anexo: "desenhoSuperJuiz",
    condicao: function (f) { return !!f.liminarSaude; },
    titulo: "Uma visita no gabinete",
    texto: "A assessora interrompe com um meio sorriso: “tem uma visita que eu não consegui barrar, doutor.” Roseane fica na porta. Alice atravessa o gabinete decidida, com uma folha dobrada em quatro.",
    entrega: {
      visita3d: true,
      quem: { id: "alice", nome: "Alice", papel: "7 anos", escala: 0.75,
              avatar: { pele: "#d8a87f", cabelo: "longo", corCabelo: "#2c1c10", traje: "vestido", corTraje: "#c94f6a" } },
      falas: [
        { emocao: "firme", texto: "Não é presente. É documento." },
        { emocao: "feliz", texto: "É o senhor salvando o meu pai. A capa eu inventei — mas o martelo é igualzinho." }
      ],
      objeto: "desenhoSuperJuiz",
      rotuloReceber: "🤲 Receber o documento"
    },
    efeitos: { hum: 5 } },

  { id: "int_saude_grave", pauta: "dia2", aposCaso: 1, tom: "grave",
    condicao: function (f) { return !!f.saudeNegada; },
    titulo: "Liminar concedida — pelo plantão do Tribunal",
    texto: "O agravo da Defensoria foi provido em decisão monocrática de madrugada: “presentes, à exaustão, os requisitos do Tema 106/STJ, comprovados desde a origem”. O medicamento foi liberado 14 horas após a sua negativa. O hospital informou que o paciente segue internado, estável — e que cada hora contou.",
    efeitos: { tec: -6 } },

  { id: "int_acolhimento_bom", pauta: "dia2", aposCaso: 2, tom: "bom", anexo: "desenhoFoguete",
    condicao: function (f) { return !!f.familiaAcolheu; },
    titulo: "Ofício da escola de Caio",
    texto: "A diretora confirma: Caio voltou às aulas na manhã seguinte, levado pela avó. A professora anotou no diário de classe que ele apresentou aos colegas “o desenho do foguete indo para a casa da vó-mãe” — e a escola anexou uma cópia, “por entender que o juízo é parte interessada”. O CREAS iniciou o acompanhamento mensal determinado pelo juízo.",
    efeitos: { hum: 4 } },

  { id: "int_acolhimento_grave", pauta: "dia2", aposCaso: 2, tom: "grave",
    condicao: function (f) { return !!f.caioAbrigado; },
    titulo: "Relatório do abrigo — 1ª noite",
    texto: "O educador de plantão registrou: a criança chorou até as 23h, perguntou três vezes pela avó e dormiu segurando a mochila. A Defensoria protocolou agravo de instrumento com pedido de efeito ativo, instruído com o estudo psicossocial favorável que já constava dos SEUS autos.",
    efeitos: { hum: -4 } },

  { id: "int_despejo_bom", pauta: "dia2", aposCaso: 3, tom: "bom", anexo: "comprovanteAluguel",
    condicao: function (f) { return !!f.acordoMoradia; },
    titulo: "O primeiro pagamento caiu",
    texto: "O Município confirma o direcionamento do aluguel social ao contrato homologado: o primeiro repasse de R$ 700 já está na conta do Sr. Aurélio, somado aos R$ 150 depositados por Dona Cleide — em dia, pela primeira vez em meio ano. O cartório anexou o comprovante com um clipe e, fora dos autos, um bilhete do escrivão: “esse acordo eu emolduro”.",
    efeitos: { hum: 3 } },

  { id: "int_despejo_grave", pauta: "dia2", aposCaso: 3, tom: "grave",
    condicao: function (f) { return !!f.acordoFrouxoDespejo; },
    titulo: "Petição: acordo descumprido",
    texto: "Como previsto por todos menos pela ata: o advogado do locador peticiona informando o descumprimento do acordo 'de palavra' — sem valor nem data, não havia o que cumprir. Requer o prosseguimento do despejo e junta nova planilha, agora maior. O processo volta inteiro, com a confiança das partes pela metade.",
    efeitos: { cel: -4 } },

  { id: "int_beneficio_bom", pauta: "dia2", aposCaso: 4, tom: "bom", anexo: "fotoFisioterapia",
    condicao: function (f) { return !!f.tutelaAlimentar; },
    titulo: "O INSS cumpriu — em 18 dias",
    texto: "Ofício da agência: benefício implantado 12 dias ANTES do prazo, “em atenção à multa diária cominada”. E a advogada do Sr. Edivaldo pediu dois minutos no balcão.",
    entrega: {
      visita3d: true,
      quem: { id: "mira", nome: "Dra. Mira", papel: "advogada do Sr. Edivaldo",
              avatar: { pele: "#a86a48", cabelo: "longo", corCabelo: "#1d1209", traje: "blazer", corTraje: "#33424f", corBlusa: "#efe5c8" } },
      falas: [
        { emocao: "firme", texto: "Eu junto a petição depois, Excelência. Antes, o meu cliente autorizou — fez questão de autorizar — que o senhor visse isto." },
        { emocao: "feliz", texto: "Primeira sessão de fisioterapia. O polegar erguido é o da mão boa. Por enquanto, ele disse." }
      ],
      objeto: "fotoFisioterapia",
      rotuloReceber: "🤲 Ver a foto"
    },
    efeitos: { tec: 3 } },

  { id: "int_beneficio_grave", pauta: "dia2", aposCaso: 4, tom: "grave",
    condicao: function (f) { return !!f.beneficioNegado; },
    titulo: "Nota da subseção da OAB",
    texto: "A subseção local encaminha, 'para conhecimento', nota pública sobre a sentença que declarou capaz um pedreiro com elevação do braço limitada a 70 graus: “a comarca que detém a delegação federal precisa exercê-la com a régua da Justiça Federal”. A apelação subiu hoje.",
    efeitos: { tec: -3 } },

  { id: "int_instrucao_bom", pauta: "dia2", aposCaso: 5, tom: "bom", anexo: "bilheteJandira",
    condicao: function (f) { return !!f.vitimaSegura; },
    titulo: "Ofício da rede de proteção",
    texto: "A equipe do CREAS confirma o acompanhamento de Jandira e registra o recado que ela pediu para transcrever: “diga ao doutor que eu voltei ao trabalho a pé, pela rua de sempre. Parece pouco. Não é.”",
    efeitos: { hum: 4 } },

  { id: "int_instrucao_grave", pauta: "dia2", aposCaso: 5, tom: "grave",
    condicao: function (f) { return !!f.revitimizadaInstrucao; },
    titulo: "A ata viajou",
    texto: "O Ministério Público encaminhou cópia da ata à Corregedoria e ao CNJ, destacando a inquirição vedada pelo art. 400-A do CPP. O ofício de informações chegará em 48 horas. A Lei 14.245 foi escrita com o nome de uma vítima; a sua audiência quase escreveu outro.",
    setFlags: { manchaGrave: true } },

  /* ============ A COMARCA LEMBRA ============
     As pessoas do Dia 1 voltam no Dia 2 — pelas flags herdadas
     com prefixo "d1_" (motor.js). Quem ainda não jogou o Dia 1
     simplesmente não recebe estas visitas: nada quebra.       */

  { id: "int_adriana", pauta: "dia2", aposCaso: 0, tom: "bom",
    condicao: function (f) { return !!f.jonasLivre; },
    titulo: "Recado do Núcleo de Custódia",
    texto: "A Juíza Adriana da Cruz Dantas, coordenadora do Núcleo de Custódia e do Juízo das Garantias, manda o recado pela assessoria: \u201cagradeço a cooperação no mutirão — e registro que a decisão do caso do furto famélico já circula aqui no Núcleo como modelo. É para isso que a custódia existe; é assim que ela deve ser feita. Conte comigo quando a sua pauta apertar.\u201d Entre juízes, não há elogio maior do que virar referência de quem coordena a matéria.",
    efeitos: { tec: 2, hum: 2 } },

  { id: "int_d1_marlene", pauta: "dia2", aposCaso: 0, tom: "bom", anexo: "cartaMarlene",
    condicao: function (f) { return !!f.d1_protegida; },
    titulo: "Uma carta sem petição dentro",
    texto: "A assessora avisa pelo telefone interno: “tem uma senhora no balcão que não quer protocolar nada, doutor — quer entregar em mãos.” Você desce. É Marlene, das medidas protetivas de oito meses atrás.",
    entrega: {
      visita3d: true,
      quem: { id: "marlene", nome: "Marlene", papel: "oito meses depois",
              avatar: { pele: "#c98e66", cabelo: "longo", corCabelo: "#2c1c10", traje: "camisa", corTraje: "#7a6a8a" } },
      falas: [
        { emocao: "neutro", texto: "Eu não vim pedir nada, doutor. Pela primeira vez, eu não vim pedir nada." },
        { emocao: "feliz", texto: "Vim só deixar isso. O senhor lê depois — é coisa de quem voltou a dormir." }
      ],
      objeto: "cartaMarlene",
      rotuloReceber: "🤲 Receber a carta"
    },
    efeitos: { hum: 4, estresse: -6 } },

  { id: "int_d1_mpu_eco", pauta: "dia2", aposCaso: 0, tom: "grave",
    condicao: function (f) { return !!f.d1_mpuRevogada; },
    titulo: "O processo que voltou",
    texto: "Entre os expedientes do dia, um ofício da vara criminal: a ação penal contra Ivan — aquele das protetivas revogadas, meses atrás — prossegue, agora por lesão corporal e cárcere privado. Marlene e os filhos estão em abrigo sigiloso, fora da comarca. A assessora deixa o ofício sobre a mesa sem comentário. Não precisa: a comarca inteira lembra de quem assinou a revogação." },

  { id: "int_d1_sofia", pauta: "dia2", aposCaso: 1, tom: "bom",
    condicao: function (f) { return !!f.d1_acordoSofia; },
    titulo: "O calendário da geladeira, oito meses depois",
    texto: "A psicóloga do CEJUSC, em visita de rotina ao fórum, pede dois minutos: “lembra da Sofia, do acordo de guarda? A escola mandou o relatório semestral. Frequência integral, e os pais agora se revezam nas reuniões SEM precisar de intimação.” Ela sorri: “o senhor sabe que isso é raríssimo, né?” Você sabe. Por isso mesmo anota no canto da pauta: há acordos que valem uma prateleira de jurisprudência.",
    efeitos: { hum: 3 } },

  { id: "int_d1_sofia_eco", pauta: "dia2", aposCaso: 1, tom: "grave",
    condicao: function (f) { return !!f.d1_revitimizacao; },
    titulo: "Relatório de acompanhamento — Sofia",
    texto: "O setor psicossocial encaminha, por dever de ofício, o relatório semestral do caso de Sofia: a criança segue em atendimento e, na última sessão, descreveu a audiência de meses atrás como “o dia em que tive que falar na frente de todo mundo”. A psicóloga registra avanços — e recomenda que o juízo conheça o relato. Recomenda, na verdade, que nunca o esqueça." },

  { id: "int_d1_mangas", pauta: "dia2", aposCaso: 2, tom: "bom",
    condicao: function (f) { return !!f.d1_pazVizinhos; },
    titulo: "Convite no balcão da secretaria",
    texto: "O servidor aparece com um papel de presente improvisado: “dos vizinhos das mangas, doutor — o senhor lembra?”. Dentro, um convite escrito a quatro mãos: churrasco de aniversário do acordo, “na divisa das casas, que agora é só uma sombra boa”. Você não poderá ir — magistrado não vai, e eles sabem. Mas mandaram mesmo assim. Era isso que queriam dizer.",
    efeitos: { hum: 3, estresse: -4 } },

  { id: "int_d1_osmar", pauta: "dia2", aposCaso: 4, tom: "bom",
    condicao: function (f) { return !!f.d1_testemunhaProtegida; },
    titulo: "Notícia do plenário do júri",
    texto: "A assessora entra com a notícia: o “caso da espingarda” foi a plenário na comarca vizinha. Osmar — a testemunha que você protegeu — depôs em segurança, de cabeça erguida, e o júri condenou. O promotor mandou um recado informal: “a régua que o senhor segurou na pronúncia chegou inteira ao plenário.” Proteger testemunha não é favor; é o que faz a prova sobreviver.",
    efeitos: { tec: 3 } },

  { id: "int_d1_osmar_eco", pauta: "dia2", aposCaso: 4, tom: "grave",
    condicao: function (f) { return !!f.d1_testemunhaPresa && !f.d1_reconsiderou; },
    titulo: "Pedido de desagravo",
    texto: "A subseção da OAB comunica, “para ciência do juízo”, que acompanha o pedido de desagravo relacionado à prisão da testemunha Osmar, meses atrás — solto em habeas corpus horas depois. O caso virou exemplo em curso de prática penal da subseção. Não do jeito que um juiz gostaria de ser lembrado." },

  /* ============ DIA 3 — Plantão Noturno ============ */

  { id: "int_vida_plantao", pauta: "dia3", aposCaso: 0, tom: "neutro",
    condicao: function () { return true; },
    titulo: "O café das onze da noite",
    texto: "O oficial de plantão deixa um café requentado na beirada da sua mesa, sem cerimônia. Pela janela, a cidade está apagada — a sua casa também, a essa hora. Você é, possivelmente, a única pessoa acordada da comarca trabalhando. Junto, claro, com todas as que precisam de você esta noite. É por isso que a luz do fórum não apaga.",
    efeitos: { estresse: -3 } },

  { id: "int_entrega_bom", pauta: "dia3", aposCaso: 0, tom: "bom",
    condicao: function (f) { return !!f.entregaLegal; },
    titulo: "Certidão da equipe técnica",
    texto: "Antes da próxima urgência, a psicóloga do juízo certifica nos autos: o recém-nascido foi recebido pela família habilitada do Cadastro Nacional — primeira da fila, habilitada há três anos. Rosa foi conduzida à rede de saúde com acompanhamento garantido e o sigilo que a lei promete. No campo final, a anotação técnica: “a entrega protegida de hoje é o abandono inseguro que não vai acontecer amanhã”.",
    efeitos: { hum: 4 } },

  { id: "int_entrega_grave", pauta: "dia3", aposCaso: 0, tom: "grave",
    condicao: function (f) { return !!f.adocaoDireta; },
    titulo: "O Ministério Público recorreu",
    texto: "O promotor protocola, ainda de madrugada, recurso contra a entrega direta homologada fora das hipóteses do art. 50, §13, do ECA — com pedido de busca e apreensão do recém-nascido para acolhimento regular. Cita precedentes sobre burla ao cadastro e o risco documentado de devolução. A criança trocará de colo duas vezes em uma semana. Era exatamente isso que o procedimento legal evitava." },

  { id: "int_transfusao_bom", pauta: "dia3", aposCaso: 1, tom: "bom",
    condicao: function (f) { return !!f.vidaSalva && !!f.familiaRespeitada; },
    titulo: "Boletim do hospital — 00h15",
    texto: "O médico plantonista liga para o cartório do plantão: transfusão concluída, Davi estável, fora de risco. “Diga ao doutor que os pais estão ao lado do leito, de mãos dadas com o menino. Ninguém precisou tirar ninguém de lugar nenhum.” A decisão que supriu o consentimento coube numa página — e na vida inteira de uma família.",
    efeitos: { hum: 4 } },

  { id: "int_transfusao_grave", pauta: "dia3", aposCaso: 1, tom: "grave",
    condicao: function (f) { return !!f.transfusaoNegada; },
    titulo: "Liminar do plantão do Tribunal — 04h00",
    texto: "O desembargador de plantão reformou a decisão às quatro da manhã: “o direito à vida de criança não se submete à convicção religiosa de terceiros, ainda que de seus amorosos pais — jurisprudência mansa”. A transfusão começou às 4h40. O boletim da manhã usa a expressão que nenhum juiz quer ler sabendo das horas que correram: prognóstico reservado." },

  { id: "int_internacao_bom", pauta: "dia3", aposCaso: 2, tom: "bom",
    condicao: function (f) { return !!f.internacaoComCuidado; },
    titulo: "Nota da equipe do CAPS",
    texto: "A médica do CAPS informa ao plantão: Ramiro foi acolhido no leito de saúde mental do hospital geral, medicado, dormindo — sem contenção, sem ocorrência policial. D. Zenaide foi orientada e tem retorno marcado para o grupo de familiares. “Diga ao juiz”, anotou a médica, “que a mãe perguntou se podia dormir tranquila. Eu disse que sim. Faz três dias que ela não dormia.”",
    efeitos: { hum: 4 } },

  { id: "int_internacao_grave", pauta: "dia3", aposCaso: 2, tom: "grave",
    condicao: function (f) { return !!f.internacaoAsilar; },
    titulo: "Relatório de fiscalização — clínica particular",
    texto: "A Defensoria junta ao plantão relatório de fiscalização da clínica indicada pela família: quartos com grades, “contenção preventiva” de rotina, último alvará sanitário vencido. Requer a imediata transferência de Ramiro para a rede pública e remete cópia ao Ministério Público — e à Corregedoria, destacando que a internação por prazo indeterminado contrariou o art. 4º da Lei 10.216." },

  { id: "int_madrugada_bom", pauta: "dia3", aposCaso: 3, tom: "bom",
    condicao: function (f) { return !!f.protegidaMadrugada; },
    titulo: "O oficial de plantão volta — 01h10",
    texto: "A porta do plantão abre uma última vez nesta noite: é o oficial de justiça, de volta da diligência, com a certidão ainda quente da impressora.",
    entrega: {
      visita3d: true,
      quem: { id: "oficial", nome: "Oficial de plantão", papel: "Central de Mandados",
              avatar: { pele: "#8a5436", cabelo: "calvo", corCabelo: "#3a2a1a", traje: "camisa", corTraje: "#2f3a4a", barba: true } },
      falas: [
        { emocao: "firme", texto: "Cumprido, Excelência. Uma e dez da manhã: o requerido cientificado do afastamento e do artigo 24-A, a requerente reconduzida para casa com escolta." },
        { emocao: "feliz", texto: "Eu anotei uma coisa no verso, fora do protocolo. O senhor releve — mas eu achei que o juiz que assinou tinha o direito de saber." }
      ],
      objeto: "certidaoMadrugada",
      rotuloReceber: "🤲 Receber a certidão"
    },
    efeitos: { hum: 4 } },

  /* ============ DIA 4 — Dia de Júri ============ */

  { id: "int_juri_cafe", pauta: "dia4", aposCaso: 0, tom: "neutro",
    condicao: function () { return true; },
    titulo: "O plenário se esvazia",
    texto: "Os jurados descem do estrado esticando as costas — cinco horas de sessão. No corredor, Dona Lourdes já montou a mesa de café sem que ninguém pedisse: “júri é dia de trabalho dobrado, doutor, até para quem só escuta”. O oficial recolhe as cédulas usadas para incineração, como manda o rito. A sala maior do fórum vai ficando outra vez do tamanho normal.",
    efeitos: { estresse: -3 } },

  { id: "int_juri_foto", pauta: "dia4", aposCaso: 0, tom: "bom",
    condicao: function (f) { return !!f.feminicidioCondenado && !!f.vitimaProtegidaPlenario; },
    titulo: "A primeira fila vem até o gabinete",
    texto: "Antes de deixar o fórum, D. Raimunda pede licença na porta do gabinete. Traz a foto da formatura — o uniforme branco, o sorriso de quem não sabia de nada.",
    entrega: {
      visita3d: true,
      quem: { id: "raimunda", nome: "D. Raimunda", papel: "Mãe de Iracema",
              avatar: { pele: "#a86a48", cabelo: "coque", corCabelo: "#9a9388", traje: "vestido", corTraje: "#3a3a40" } },
      falas: [
        { emocao: "choro", texto: "Eu carreguei essa foto dois anos para todo canto, doutor — delegacia, fórum, jornal. Para ninguém esquecer que ela era gente antes de ser processo." },
        { emocao: "firme", texto: "Hoje eu não preciso mais carregar. O nome dela saiu limpo daquela sala. Eu queria que a foto ficasse com o senhor — para o senhor lembrar, nos dias difíceis, do dia em que deu certo." }
      ],
      objeto: "fotoIracema",
      rotuloReceber: "🤲 Receber a fotografia"
    },
    efeitos: { hum: 4 } },

  { id: "int_juri_rede", pauta: "dia4", aposCaso: 0, tom: "grave",
    condicao: function (f) { return !!f.absolvicaoContaminada; },
    titulo: "Nota da rede de proteção — fim do dia",
    texto: "A assistente social certifica nos autos da execução das medidas: os dois filhos de Iracema seguem com a avó, agora com acompanhamento psicológico reforçado — o mais novo perguntou, na escola, “se o juiz deixou”. O botão do pânico de D. Raimunda foi mantido por cautela. No protocolo do fórum, dois registros novos: a apelação do Ministério Público e um pedido de cópia da ata — papel timbrado da OAB." },

  { id: "int_madrugada_grave", pauta: "dia3", aposCaso: 3, tom: "grave",
    condicao: function (f) { return !!f.riscoMadrugada || !!f.protetivaNegadaPlantao; },
    titulo: "O telefone do plantão — 04h12",
    texto: "A delegacia liga: nova ocorrência no mesmo endereço. Vias de fato. Eunice está no pronto-socorro — sem gravidade física, diz o plantonista, como se isso medisse alguma coisa. O filho de 9 anos viu tudo de novo. O expediente que voltou sem medida eficaz volta agora com pedido de prisão preventiva. A noite cobrou o que a decisão não deu." }
];

/* ---------------------------------------------------------
   MANCHETES DO EPÍLOGO
   condicao recebe (flags, reputacao) e diz se o recorte
   de jornal aparece no mural final.
   --------------------------------------------------------- */
TOGA.manchetes = [
  { condicao: function (f) { return !!f.mpuRevogada; }, tom: "grave",
    fonte: "Diário do Sertão",
    titulo: "Mulher volta a ser agredida dias após Justiça revogar medida protetiva" },

  { condicao: function (f) { return !!f.revitimizacao; }, tom: "grave",
    fonte: "Portal Jurídico Regional",
    titulo: "CNJ vai apurar oitiva de criança de 8 anos em sala de audiência" },

  { condicao: function (f) { return !!f.protegida; },
    fonte: "Gazeta da Comarca",
    titulo: "Rede de proteção à mulher funciona: monitoração e amparo evitam tragédia anunciada" },

  { condicao: function (f) { return !!f.presoFundamentado; },
    fonte: "Diário do Sertão",
    titulo: "Justiça decreta prisão de agressor; Tribunal mantém decisão em habeas corpus" },

  { condicao: function (f) { return !!f.acordoSofia; },
    fonte: "Gazeta da Comarca",
    titulo: "Pais firmam acordo exemplar em disputa de guarda — e a escola comemora" },

  { condicao: function (f) { return !!f.pazVizinhos; },
    fonte: "Folha do Bairro",
    titulo: "Vizinhos em pé de guerra selam paz no Juizado — com churrasco e mangas" },

  { condicao: function (f) { return !!f.thorFeliz; },
    fonte: "Folha do Bairro",
    titulo: "Quem fica com o cachorro? Justiça inova e Thor “ganha” duas casas" },

  { condicao: function (f) { return !!f.circo; }, tom: "grave",
    fonte: "Portal Jurídico Regional",
    titulo: "“Teste do apego” em audiência termina com cão correndo atrás de biscoito do oficial" },

  { condicao: function (f) { return !!f.pactoGatos; },
    fonte: "Folha do Bairro",
    titulo: "Cão na guia, gatos com hora de recolher: vizinhos selam “tratado de paz” no Juizado após morte de Frajola" },

  { condicao: function (f) { return !!f.confinamentoTotal; }, tom: "grave",
    fonte: "Portal Jurídico Regional",
    titulo: "Justiça decreta “prisão perpétua domiciliar” de cachorro; protetores de animais anunciam protesto no fórum" },

  { condicao: function (f) { return !!f.pronunciaSolida; },
    fonte: "Diário do Sertão",
    titulo: "Caso da espingarda: réu vai a júri depois que testemunha rompe o silêncio em audiência — e ganha proteção oficial" },

  { condicao: function (f) { return !!f.impronunciado; },
    fonte: "Gazeta da Comarca",
    titulo: "Juiz devolve “caso da espingarda” à estaca zero e cobra investigação: “todos sabem” não é prova" },

  { condicao: function (f) { return !!f.testemunhaPresa && !f.reconsiderou; }, tom: "grave",
    fonte: "Diário do Sertão",
    titulo: "Testemunha sai algemada de audiência e é solta horas depois por habeas corpus; OAB pede providências" },

  { condicao: function (f, r) { return r.cel >= 70; }, pauta: "*",
    fonte: "Boletim da Associação de Magistrados",
    titulo: "Pauta em dia: comarca vira referência em celeridade nas audiências" },

  { condicao: function () { return true; },
    fonte: "Gazeta da Comarca",
    titulo: "Fórum realiza dia cheio de audiências; seis casos tiveram desfecho na mesma data" },

  /* ============ DIA 2 — Dia Decisivo ============ */

  { condicao: function (f) { return f.jonasLivre && f.criancasAcolhidas; }, pauta: "dia2",
    fonte: "Gazeta da Comarca",
    titulo: "Justiça reconhece furto famélico, liberta pai e abriga família no mesmo dia" },

  { condicao: function (f) { return !!f.jonasPreso || !!f.fiancaInutil; }, pauta: "dia2", tom: "grave",
    fonte: "Portal Jurídico Regional",
    titulo: "Homem é preso por furtar R$ 32 em comida; Defensoria e OAB pedem providências" },

  { condicao: function (f) { return !!f.liminarSaude; }, pauta: "dia2",
    fonte: "Diário do Sertão",
    titulo: "Liminar em plantão garante remédio em 24 horas; nota técnica do CNJ embasou decisão" },

  { condicao: function (f) { return !!f.saudeNegada; }, pauta: "dia2", tom: "grave",
    fonte: "Diário do Sertão",
    titulo: "Paciente grave espera 14 horas até plantão do TJ derrubar negativa de primeira instância" },

  { condicao: function (f) { return !!f.familiaAcolheu; }, pauta: "dia2",
    fonte: "Folha do Bairro",
    titulo: "“Vó-mãe” ganha a guarda do neto: Justiça aplica prioridade da família e evita abrigo" },

  { condicao: function (f) { return !!f.caioAbrigado; }, pauta: "dia2", tom: "grave",
    fonte: "Portal Jurídico Regional",
    titulo: "Criança de 6 anos vai para abrigo apesar de avó habilitada e estudo técnico favorável" },

  { condicao: function (f) { return !!f.acordoMoradia; }, pauta: "dia2",
    fonte: "Gazeta da Comarca",
    titulo: "Acordo inédito une aluguel social e inquilinato: família fica, aposentado volta a receber" },

  { condicao: function (f) { return !!f.despejoSeco; }, pauta: "dia2", tom: "grave",
    fonte: "Folha do Bairro",
    titulo: "Família com três crianças recebe ordem de despejo em 15 dias; mutirão de vizinhos organiza mudança" },

  { condicao: function (f) { return !!f.tutelaAlimentar; }, pauta: "dia2",
    fonte: "Diário do Sertão",
    titulo: "Pedreiro acidentado recebe benefício em menos de um mês por ordem judicial da comarca" },

  { condicao: function (f) { return !!f.beneficioNegado; }, pauta: "dia2", tom: "grave",
    fonte: "Boletim da Associação de Magistrados",
    titulo: "Sentença que declarou “capaz” pedreiro com braço imobilizado vira estudo de caso em curso de formação" },

  { condicao: function (f) { return !!f.vitimaSegura; }, pauta: "dia2",
    fonte: "Gazeta da Comarca",
    titulo: "Condenação com prisão em audiência protege vítima; rede de apoio acionada na mesma tarde" },

  { condicao: function (f) { return !!f.revitimizadaInstrucao; }, pauta: "dia2", tom: "grave",
    fonte: "Portal Jurídico Regional",
    titulo: "Pergunta vedada pela Lei Mariana Ferrer é admitida em audiência; caso chega ao CNJ" },

  { condicao: function () { return true; }, pauta: "dia2",
    fonte: "Gazeta da Comarca",
    titulo: "Plantão e vara única: comarca decide seis casos urgentes num único dia" },

  { condicao: function (f) { return !!f._capacitacaoFeita; }, pauta: "dia2",
    fonte: "Boletim da Associação de Magistrados",
    titulo: "A pedido do TJCE, juiz transforma Salão do Júri em sala de aula e capacita a própria equipe" },

  /* ===== Ecos do Dia 1 (flags herdadas d1_*) ===== */

  { condicao: function (f) { return !!f.d1_protegida; }, pauta: "dia2",
    fonte: "Gazeta da Comarca",
    titulo: "Oito meses depois, rede de proteção mantém agressor afastado — e a família, em casa" },

  { condicao: function (f) { return !!f.d1_mpuRevogada; }, pauta: "dia2", tom: "grave",
    fonte: "Diário do Sertão",
    titulo: "Caso Marlene: processo retorna à Justiça — agora por cárcere privado, após revogação de protetiva" },

  /* ============ DIA 3 — Plantão Noturno ============ */

  { condicao: function (f) { return !!f.entregaLegal; }, pauta: "dia3",
    fonte: "Gazeta da Comarca",
    titulo: "Entrega protegida: recém-nascido vai a família do cadastro e mãe recebe acompanhamento — tudo em uma noite" },

  { condicao: function (f) { return !!f.adocaoDireta; }, pauta: "dia3", tom: "grave",
    fonte: "Portal Jurídico Regional",
    titulo: "MP recorre de “adoção de balcão” homologada no plantão; bebê pode trocar de família duas vezes em uma semana" },

  { condicao: function (f) { return !!f.vidaSalva && !!f.familiaRespeitada; }, pauta: "dia3",
    fonte: "Diário do Sertão",
    titulo: "Justiça autoriza transfusão e salva menino de 4 anos — com os pais ao lado do leito a noite inteira" },

  { condicao: function (f) { return !!f.transfusaoNegada; }, pauta: "dia3", tom: "grave",
    fonte: "Diário do Sertão",
    titulo: "Criança espera 6 horas por transfusão até Tribunal derrubar decisão do plantão; hospital fala em “prognóstico reservado”" },

  { condicao: function (f) { return !!f.poderFamiliarSuspenso; }, pauta: "dia3", tom: "grave",
    fonte: "Portal Jurídico Regional",
    titulo: "Pais perdem o poder familiar por divergência sobre tratamento; especialistas apontam desproporcionalidade" },

  { condicao: function (f) { return !!f.internacaoComCuidado; }, pauta: "dia3",
    fonte: "Gazeta da Comarca",
    titulo: "Crise psiquiátrica termina em leito do SUS, sem viatura e sem algema: “foi atendimento de saúde, como manda a lei”" },

  { condicao: function (f) { return !!f.internacaoAsilar; }, pauta: "dia3", tom: "grave",
    fonte: "Portal Jurídico Regional",
    titulo: "Internação por prazo indeterminado em clínica com alvará vencido vai parar no Ministério Público" },

  { condicao: function (f) { return !!f.protegidaMadrugada; }, pauta: "dia3",
    fonte: "Folha do Bairro",
    titulo: "Medida protetiva sai à meia-noite e é cumprida em uma hora: “a Justiça chegou antes do medo”, diz vizinha" },

  { condicao: function (f) { return !!f.riscoMadrugada || !!f.protetivaNegadaPlantao; }, pauta: "dia3", tom: "grave",
    fonte: "Diário do Sertão",
    titulo: "Mulher que pediu proteção à Justiça volta agredida ao pronto-socorro horas depois; plantão havia negado medida eficaz" },

  { condicao: function () { return true; }, pauta: "dia3",
    fonte: "Gazeta da Comarca",
    titulo: "Enquanto a cidade dormia: plantão judiciário decide quatro urgências entre 21h40 e meia-noite" },

  /* ============ DIA 4 — Dia de Júri ============ */

  { condicao: function (f) { return !!f.feminicidioCondenado && !!f.vitimaProtegidaPlenario; }, pauta: "dia4",
    fonte: "Gazeta da Comarca",
    titulo: "Plenário condena feminicídio em julgamento que protegeu a memória da vítima; sessão vira referência do Protocolo do CNJ" },

  { condicao: function (f) { return !!f.imprensaDisciplinada; }, pauta: "dia4",
    fonte: "Portal Jurídico Regional",
    titulo: "Júri de Iracema: imprensa transmite sessão histórica sem expor jurados nem família — “publicidade com moldura”, elogia a OAB" },

  { condicao: function (f) { return !!f.feminicidioCondenado && !!f.condenacaoComVicios; }, pauta: "dia4",
    fonte: "Portal Jurídico Regional",
    titulo: "Condenação no júri de Iracema; defesa anuncia apelação apontando incidentes consignados em ata" },

  { condicao: function (f) { return !!f.absolvicaoContaminada; }, pauta: "dia4", tom: "grave",
    fonte: "Diário do Sertão",
    titulo: "Absolvição em plenário marcado por ataques à memória da vítima; MP apela e entidades questionam a condução da sessão" },

  { condicao: function (f) { return !!f._coletivaFeita && !!f.feminicidioCondenado; }, pauta: "dia4",
    fonte: "Folha do Bairro",
    titulo: "Em coletiva, juiz explica o veredicto em linguagem simples: “quem decidiu foi a prova — e jurados livres para ouvi-la”" },

  /* ===== Despachos de gabinete (valem nos dois dias) ===== */

  { condicao: function (f) { return !!f.bensRecuperados; }, pauta: "*",
    fonte: "Diário do Sertão",
    titulo: "Busca e apreensão recupera joias de aposentada e desarticula receptação na comarca" },

  { condicao: function (f) { return !!f.cidadaVisivel; }, pauta: "*",
    fonte: "Gazeta da Comarca",
    titulo: "Aos 66 anos, lavradora recebe a primeira certidão de nascimento — e dá entrada na aposentadoria" },

  { condicao: function (f) { return !!f.pensaoPaga; }, pauta: "*",
    fonte: "Folha do Bairro",
    titulo: "Prisão civil faz devedor quitar pensão alimentícia em 36 horas" },

  { condicao: function (f) { return !!f.explodiuBalcao; }, pauta: "*", tom: "grave",
    fonte: "Portal Jurídico Regional",
    titulo: "Vídeo de magistrado exaltado no balcão da secretaria circula em grupos da OAB" },

  /* ===== A comarca além do fórum (atividades externas) ===== */

  { condicao: function (f) { return !!f.visitaDelegaciaExemplar; }, pauta: "*",
    fonte: "Gazeta da Comarca",
    titulo: "Juiz visita a Delegacia e alinha fluxo de flagrantes: “prova bem documentada protege todo mundo”, diz delegada" },

  { condicao: function (f) { return !!f.visitaEscolaExemplar; }, pauta: "*",
    fonte: "Folha do Bairro",
    titulo: "“Juiz é mais quebra-galho que carcereiro”: visita à escola municipal vira a redação da semana do 4º ano" },

  { condicao: function (f) { return !!f.aulaEsmecExemplar; }, pauta: "*",
    fonte: "Portal Jurídico Regional",
    titulo: "Na ESMEC, magistrado abre a própria pauta para ensinar juízes novos: “errar faz parte; esconder é que não”" },

  { condicao: function (f) { return !!f.dirigiuExemplar; }, pauta: "*",
    fonte: "Folha do Bairro",
    titulo: "Flagrado pelo bem: juiz dirige o próprio carro, para na faixa e espera o sinal — sem assessor, sem pressa, sem placa fria" },

  { condicao: function (f) { return !!f.infracaoTransito; }, pauta: "*", tom: "grave",
    fonte: "Diário do Sertão",
    titulo: "A caminho de palestra, magistrado comete infração de trânsito; leitores perguntam: a toga para no vermelho?" }
];

/* ---------------------------------------------------------
   PARTIDA: liga os botões assim que a página carrega.
   "DOMContentLoaded" = o evento que o navegador dispara
   quando terminou de montar o HTML.
   --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  var $ = function (s) { return document.querySelector(s); };
  TOGA.ui.ligarEventos();

  /* ----- MODO DEMONSTRAÇÃO (?demo=1) ----------------------------
     Para estandes, feiras e escolas: UM caso curto e forte (a
     custódia de Jonas), sem tutorial, sem mexer nos saves dos
     dias normais. Dois minutos de inatividade devolvem o jogo à
     tela de atração — pronto para a próxima pessoa da fila.    */
  var ehDemo = /[?&]demo=1/.test(window.location.search || "");
  TOGA.config.demo = ehDemo;
  if (ehDemo) {
    TOGA.pautas.push({
      id: "demo", demo: true,
      titulo: "Demonstração",
      subtitulo: "Sente-se na cadeira do juiz.",
      casos: ["custodia"]
    });
  }

  // Interruptores do menu (Modo Estudo, Som e Modo 3D)
  var chaveEstudo = $("#chave-estudo");
  var chaveSom = $("#chave-som");
  var chave3d = $("#chave-3d");

  /* ----- Modo 3D: preferência fora do save (o MESMO save
     abre nos dois modos) e chave desligada sem WebGL.
     O 3D é o PADRÃO: o modo clássico (2D) só assume se o
     jogador desligar a chave explicitamente. ----- */
  var suporta3d = TOGA.nucleo3d && TOGA.nucleo3d.suporta && TOGA.nucleo3d.suporta();
  try { TOGA.config.modo3d = suporta3d && localStorage.getItem("toga.modo3d") !== "0"; }
  catch (e) { TOGA.config.modo3d = !!suporta3d; }
  chave3d.classList.toggle("ligada", TOGA.config.modo3d);
  if (!suporta3d) {
    chave3d.disabled = true;
    $("#rotulo-3d").textContent = "Modo 3D indisponível neste navegador — modo clássico ativo";
  }
  chave3d.addEventListener("click", function () {
    TOGA.config.modo3d = !TOGA.config.modo3d;
    chave3d.classList.toggle("ligada", TOGA.config.modo3d);
    try { localStorage.setItem("toga.modo3d", TOGA.config.modo3d ? "1" : "0"); } catch (e) {}
  });

  /* ----- Qualidade 3D: sombras e resolução. Padrão: alta no
     desktop; baixa em telas de toque (GPU de celular). ----- */
  var chaveQualidade = $("#chave-qualidade");
  var qualidadePadrao = (window.matchMedia && window.matchMedia("(pointer: coarse)").matches)
    ? "baixa" : "alta";
  try { TOGA.config.qualidade3d = localStorage.getItem("toga.qualidade3d") || qualidadePadrao; }
  catch (e) { TOGA.config.qualidade3d = qualidadePadrao; }
  chaveQualidade.classList.toggle("ligada", TOGA.config.qualidade3d === "alta");
  if (!suporta3d) chaveQualidade.disabled = true;
  chaveQualidade.addEventListener("click", function () {
    TOGA.config.qualidade3d = (TOGA.config.qualidade3d === "alta") ? "baixa" : "alta";
    chaveQualidade.classList.toggle("ligada", TOGA.config.qualidade3d === "alta");
    try { localStorage.setItem("toga.qualidade3d", TOGA.config.qualidade3d); } catch (e) {}
    if (TOGA.nucleo3d && TOGA.nucleo3d.aplicarQualidade) TOGA.nucleo3d.aplicarQualidade();
  });

  /* Decide o palco do dia: o fórum 3D ou as telas clássicas. */
  function comecarDia() {
    if (TOGA.config.modo3d && suporta3d) {
      document.body.classList.add("modo-3d");
      TOGA.cena = TOGA.cena3d;
      TOGA.cena3d.entrarMundo("gabinete");
    } else {
      document.body.classList.remove("modo-3d");
      TOGA.cena = TOGA.cena2d;
      TOGA.ui.renderPauta();
      TOGA.ui.mostrarTela("tela-pauta");
    }
    TOGA.ui.mostrarTutorial();   // só na primeira partida (flag local)
  }

  /* O DIA DE FESTA do Juizado: destrava ao concluir o Dia 6.
     Entra no fórum 3D e troca para o Juizado em modo festa. */
  function comecarFesta() {
    if (TOGA.config.modo3d && suporta3d && TOGA.cena3d && TOGA.cena3d.entrarJuizadoFesta) {
      if (!TOGA.motor.carregar("dia6")) TOGA.motor.novoJogo("dia6");
      document.body.classList.add("modo-3d");
      TOGA.cena = TOGA.cena3d;
      TOGA.cena3d.entrarMundo("gabinete");
      TOGA.cena3d.entrarJuizadoFesta();
    } else if (TOGA.muralJecc) {
      // sem 3D: ao menos a galeria de fotos da equipe
      TOGA.muralJecc.abrir();
    }
  }

  chaveEstudo.addEventListener("click", function () {
    TOGA.config.modoEstudo = !TOGA.config.modoEstudo;
    chaveEstudo.classList.toggle("ligada", TOGA.config.modoEstudo);
    if (TOGA.motor.estado) { TOGA.motor.estado.modoEstudo = TOGA.config.modoEstudo; TOGA.motor.salvar(); }
  });

  /* ----- Modo Prova: sem dicas em jogo; boletim + gabarito ao final ----- */
  var chaveProva = $("#chave-prova");
  try { TOGA.config.modoProva = localStorage.getItem("toga.modoProva") === "1"; } catch (e) { TOGA.config.modoProva = false; }
  chaveProva.classList.toggle("ligada", TOGA.config.modoProva);
  chaveProva.addEventListener("click", function () {
    TOGA.config.modoProva = !TOGA.config.modoProva;
    chaveProva.classList.toggle("ligada", TOGA.config.modoProva);
    try { localStorage.setItem("toga.modoProva", TOGA.config.modoProva ? "1" : "0"); } catch (e) {}
    if (TOGA.motor.estado) { TOGA.motor.estado.modoProva = TOGA.config.modoProva; TOGA.motor.salvar(); }
  });

  chaveSom.addEventListener("click", function () {
    TOGA.som.ligado = !TOGA.som.ligado;
    chaveSom.classList.toggle("ligada", TOGA.som.ligado);
    if (TOGA.audio) TOGA.audio.aoMudarSom();
  });

  /* ----- Narração por voz (Web Speech, offline) ----- */
  var chaveNarracao = $("#chave-narracao");
  var rotuloNarracao = $("#rotulo-narracao");
  if (!TOGA.narrador || !TOGA.narrador.suportado) {
    chaveNarracao.disabled = true;
    rotuloNarracao.textContent = "Narração por voz indisponível neste navegador";
  } else {
    try { TOGA.narrador.ligado = localStorage.getItem("toga.narracao") === "1"; } catch (e) {}
    chaveNarracao.classList.toggle("ligada", TOGA.narrador.ligado);
    chaveNarracao.addEventListener("click", function () {
      TOGA.narrador.ligado = !TOGA.narrador.ligado;
      chaveNarracao.classList.toggle("ligada", TOGA.narrador.ligado);
      try { localStorage.setItem("toga.narracao", TOGA.narrador.ligado ? "1" : "0"); } catch (e) {}
      if (TOGA.narrador.ligado && !TOGA.narrador.temVozPt) {
        rotuloNarracao.textContent = "Narração ligada — voz em português não encontrada; usando a voz padrão do sistema";
      } else if (TOGA.narrador.ligado) {
        rotuloNarracao.textContent = "Narração por voz ligada";
        TOGA.narrador.falar("Narração ligada.");
      } else {
        rotuloNarracao.textContent = "Narração por voz das falas (experimental)";
      }
    });
  }

  /* ----- Alto contraste ----- */
  var chaveContraste = $("#chave-contraste");
  var contrasteLigado = false;
  try { contrasteLigado = localStorage.getItem("toga.contraste") === "1"; } catch (e) {}
  document.body.classList.toggle("alto-contraste", contrasteLigado);
  chaveContraste.classList.toggle("ligada", contrasteLigado);
  chaveContraste.addEventListener("click", function () {
    contrasteLigado = !contrasteLigado;
    document.body.classList.toggle("alto-contraste", contrasteLigado);
    chaveContraste.classList.toggle("ligada", contrasteLigado);
    try { localStorage.setItem("toga.contraste", contrasteLigado ? "1" : "0"); } catch (e) {}
  });

  /* ----- OS DIAS DE TRABALHO: um cartão por pauta, com estado.
     Cada dia tem o SEU save: jogar um não apaga o outro. ----- */
  var listaDias = $("#lista-dias");

  // desbloqueio persistente da festa para TESTE (sobrevive ao menu)
  function festaDestravadaTeste() {
    try { return localStorage.getItem("toga.festaLiberada") === "1"; } catch (e) { return false; }
  }
  // comandos de console: TOGA.liberarFesta() destrava o cartão; TOGA.festa() entra direto
  TOGA.liberarFesta = function () {
    try { localStorage.setItem("toga.festaLiberada", "1"); } catch (e) {}
    atualizarCartoesDia();
    return "🏆 Festa do Juizado destravada no menu (persiste entre telas). Clique no cartão dourado — ou rode TOGA.festa().";
  };
  TOGA.festa = function () { comecarFesta(); return "🎉 Entrando na festa do Juizado..."; };

  function novoDia(pautaId) {
    TOGA.motor.novoJogo(pautaId);
    TOGA.motor.estado.modoEstudo = TOGA.config.modoEstudo;
    TOGA.motor.estado.modoProva = TOGA.config.modoProva;
    TOGA.motor.salvar();
    comecarDia();
  }

  function continuarDia(pautaId) {
    if (!TOGA.motor.carregar(pautaId)) { novoDia(pautaId); return; }
    TOGA.config.modoEstudo = TOGA.motor.estado.modoEstudo !== false;
    chaveEstudo.classList.toggle("ligada", TOGA.config.modoEstudo);
    if (TOGA.motor.fimDaPauta() && !TOGA.motor.interludiosPendentes().length) {
      TOGA.ui.mostrarEpilogo();           // o dia já tinha acabado
      return;
    }
    comecarDia();
  }

  function atualizarCartoesDia() {
    listaDias.innerHTML = "";
    (TOGA.pautas || []).forEach(function (p) {
      if (p.demo) return;   // a pauta da demonstração não vira cartão do menu
      var wrap = document.createElement("div");
      wrap.className = "dia-wrap";

      var peek = TOGA.motor.peekSave(p.id);
      var b = document.createElement("button");
      b.className = "btn btn-dia";
      b.dataset.pauta = p.id;

      var status = "";
      if (peek && peek.concluido) {
        var melhor = (TOGA.motor.carreira().pautas || {})[p.id];
        status = '<span class="sub-dia status-dia">✓ Concluído' +
          (melhor ? " — melhor resultado: " + melhor.titulo : "") +
          (peek.modoProva ? " · 📝 prova" : "") + "</span>";
        b.innerHTML = "📜 &nbsp;" + p.titulo + status;
        b.addEventListener("click", function () { continuarDia(p.id); });
      } else if (peek) {
        status = '<span class="sub-dia status-dia">▶ Em andamento — caso ' +
          Math.min(peek.casoAtual + 1, peek.total) + "/" + peek.total + "</span>";
        b.innerHTML = "⚖ &nbsp;" + p.titulo + status;
        b.addEventListener("click", function () { continuarDia(p.id); });
      } else {
        b.innerHTML = "⚖ &nbsp;" + p.titulo +
          (p.subtitulo ? '<span class="sub-dia">' + p.subtitulo + "</span>" : "");
        b.addEventListener("click", function () { novoDia(p.id); });
      }
      wrap.appendChild(b);

      // mini-ações quando há save
      if (peek) {
        var acoes = document.createElement("div");
        acoes.className = "acoes-dia";
        var rejogar = document.createElement("button");
        rejogar.className = "mini-acao";
        rejogar.textContent = "↺ recomeçar";
        rejogar.addEventListener("click", function () {
          TOGA.motor.apagarSave(p.id);
          novoDia(p.id);
        });
        acoes.appendChild(rejogar);
        if (peek.concluido) {
          var gab = document.createElement("button");
          gab.className = "mini-acao";
          gab.textContent = "📖 gabarito";
          gab.addEventListener("click", function () {
            if (!TOGA.motor.carregar(p.id)) return;
            TOGA.gabarito.render();
            TOGA.ui.mostrarTela("tela-gabarito");
          });
          acoes.appendChild(gab);
        }
        wrap.appendChild(acoes);
      }
      listaDias.appendChild(wrap);
    });

    // ----- CARTÃO DO DIA DE FESTA (4º título) — destrava com o Dia 6
    // (ou, para teste, com TOGA.liberarFesta() no console — persiste) -----
    var peekFesta = TOGA.motor.peekSave("dia6");
    var festaLiberada = !!((peekFesta && peekFesta.concluido) || festaDestravadaTeste());
    var wrapF = document.createElement("div");
    wrapF.className = "dia-wrap";
    var bf = document.createElement("button");
    bf.className = "btn btn-dia cartao-festa" + (festaLiberada ? "" : " bloqueado");
    if (festaLiberada) {
      bf.innerHTML = "🏆 &nbsp;Dia de Festa — 4º Título Consecutivo" +
        '<span class="sub-dia">Prêmio + Gestão TJCE · Certificação Excelência · a equipe do Juizado te espera</span>';
      bf.addEventListener("click", comecarFesta);
    } else {
      bf.innerHTML = "🔒 &nbsp;Dia de Festa (bloqueado)" +
        '<span class="sub-dia">Conclua o “Dia 6 — Dia no Juizado Especial” para destravar a comemoração do 4º título</span>';
      bf.disabled = true;
    }
    wrapF.appendChild(bf);
    listaDias.appendChild(wrapF);

    // o quadro de carreira: nível, estrelas e progresso
    var c = TOGA.motor.carreira();
    var totalCasos = (TOGA.pautas || []).reduce(function (n, p) { return n + (p.demo ? 0 : p.casos.length); }, 0);
    var linha = $("#linha-carreira");
    if (Object.keys(c.casos || {}).length && TOGA.conquistas) {
      var nv = TOGA.conquistas.nivelCarreira();
      linha.hidden = false;
      linha.innerHTML = '<span class="estrelas">' +
        "★".repeat(nv.estrelas) + "☆".repeat(5 - nv.estrelas) + "</span> " + nv.titulo +
        ' <span class="sub-carreira">· ' + nv.otimos + "/" + totalCasos + " selos ótimos" +
        (nv.proximoTitulo ? " · faltam " + nv.faltam + ' para “' + nv.proximoTitulo + "”" : "") +
        " · 🏅 " + TOGA.conquistas.quantasGanhas() + "/" + TOGA.conquistas.total() + " conquistas</span>";
    } else linha.hidden = true;
  }
  atualizarCartoesDia();

  /* ----- Personalizar juiz(a): modal com preview ao vivo ----- */
  var btnJuiz = $("#btn-juiz");
  if (btnJuiz) btnJuiz.addEventListener("click", abrirPersonalizacao);

  /* ----- Vitrine de conquistas ----- */
  var btnConquistas = $("#btn-conquistas");
  if (btnConquistas) btnConquistas.addEventListener("click", function () {
    if (TOGA.conquistas) TOGA.conquistas.abrirVitrine();
  });

  /* ----- "Como jogar — roteiro do dia": reabre o tutorial a qualquer hora.
     O mesmo botão atende o menu, a pauta e o HUD do mundo 3D. ----- */
  ["#btn-como-jogar", "#btn-ajuda-pauta", "#btn-ajuda-mundo"].forEach(function (sel) {
    var b = $(sel);
    if (b) b.addEventListener("click", function () {
      if (TOGA.ui && TOGA.ui.mostrarTutorial) TOGA.ui.mostrarTutorial(true);
    });
  });

  function abrirPersonalizacao() {
    var modal = document.getElementById("modal-juiz");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "modal-juiz";
      modal.innerHTML =
        '<div class="cartao-tutorial">' +
        '<div class="eyebrow">quem veste a toga</div>' +
        '<h2>Personalizar juiz(a)</h2>' +
        '<div class="corpo-juiz">' +
        '  <div class="preview-juiz" id="preview-juiz"></div>' +
        '  <div class="opcoes-juiz">' +
        '    <div class="grupo-juiz"><span>Tratamento</span><div id="op-genero"></div></div>' +
        '    <div class="grupo-juiz"><span>Tom de pele</span><div id="op-pele"></div></div>' +
        '    <div class="grupo-juiz"><span>Cabelo</span><div id="op-cabelo"></div></div>' +
        '    <div class="grupo-juiz"><span>Cor do cabelo</span><div id="op-cor"></div></div>' +
        '  </div>' +
        '</div>' +
        '<div class="acoes-desfecho"><button class="btn" id="btn-juiz-fechar">✓ Pronto, Excelência</button></div>' +
        '</div>';
      document.body.appendChild(modal);
      modal.querySelector("#btn-juiz-fechar").addEventListener("click", function () { modal.hidden = true; });
      modal.addEventListener("click", function (ev) { if (ev.target === modal) modal.hidden = true; });
    }
    modal.hidden = false;
    renderPersonalizacao(modal);
  }

  function renderPersonalizacao(modal) {
    var J = TOGA.juiz, cfg = J.get();

    var preview = modal.querySelector("#preview-juiz");
    preview.innerHTML = "";
    preview.appendChild(TOGA.cena2d.avatarSolo({ id: "preview", avatar: J.avatar() }, "firme"));

    function grupoBotoes(sel, itens, atual, aoEscolher) {
      var box = modal.querySelector(sel);
      box.innerHTML = "";
      itens.forEach(function (it) {
        var b = document.createElement("button");
        b.className = "op-juiz" + (it.valor === atual ? " ativa" : "");
        if (it.cor) { b.classList.add("amostra"); b.style.background = it.cor; b.title = it.rotulo || ""; }
        else b.textContent = it.rotulo;
        b.addEventListener("click", function () {
          aoEscolher(it.valor);
          renderPersonalizacao(modal);   // preview e seleção ao vivo
        });
        box.appendChild(b);
      });
    }

    grupoBotoes("#op-genero",
      [{ valor: "m", rotulo: "Juiz — “doutor”" }, { valor: "f", rotulo: "Juíza — “doutora”" }],
      cfg.genero, function (v) { J.salvar({ genero: v }); });
    grupoBotoes("#op-pele",
      J.PELES.map(function (c) { return { valor: c, cor: c }; }),
      cfg.pele, function (v) { J.salvar({ pele: v }); });
    grupoBotoes("#op-cabelo",
      J.CABELOS.map(function (c) { return { valor: c, rotulo: c }; }),
      cfg.cabelo, function (v) { J.salvar({ cabelo: v }); });
    grupoBotoes("#op-cor",
      J.CORES_CABELO.map(function (c) { return { valor: c, cor: c }; }),
      cfg.corCabelo, function (v) { J.salvar({ corCabelo: v }); });
  }

  // Sobre o jogo
  $("#btn-sobre").addEventListener("click", function () { TOGA.ui.mostrarTela("tela-sobre"); });
  $("#btn-sobre-voltar").addEventListener("click", function () {
    atualizarCartoesDia();
    TOGA.ui.mostrarTela("tela-menu");
  });

  // Navegação auxiliar
  $("#btn-menu-pauta").addEventListener("click", function () {
    // No 3D, a pauta é o monitor do computador: "voltar" = voltar ao gabinete.
    if (document.body.classList.contains("modo-3d")) { TOGA.cena3d.entrarMundo(); return; }
    atualizarCartoesDia();
    TOGA.ui.mostrarTela("tela-menu");
  });

  $("#btn-nova-carreira").addEventListener("click", function () {
    // recomeçar = voltar ao menu e escolher o dia
    TOGA.motor.apagarSave();
    atualizarCartoesDia();
    TOGA.ui.mostrarTela("tela-menu");
  });

  $("#btn-epilogo-menu").addEventListener("click", function () {
    atualizarCartoesDia();
    TOGA.ui.mostrarTela("tela-menu");
  });

  /* ----- a partida da demonstração ----- */
  if (ehDemo) {
    function iniciarDemo() {
      TOGA.motor.apagarSave("demo");      // cada visitante começa do zero
      TOGA.motor.novoJogo("demo");
      TOGA.motor.estado.modoEstudo = true;
      TOGA.motor.salvar();
      comecarDia();
    }

    // tela de atração: cobre o menu até alguém aceitar a toga
    var atracao = document.createElement("div");
    atracao.id = "atracao-demo";
    atracao.innerHTML =
      '<div class="cartao-tutorial">' +
      '<div class="eyebrow">demonstração · ~10 minutos</div>' +
      '<h2>Sente-se na cadeira do juiz</h2>' +
      '<p>Um homem foi preso por furtar <strong>R$ 32 em comida</strong>. Os dois filhos dele ' +
      'esperam no corredor do fórum. Em poucos minutos, <strong>você</strong> decide o que ' +
      'acontece com essa família — com a lei de verdade nas mãos.</p>' +
      '<p class="suave">Obra de ficção com finalidade educativa. Nada é coletado: o jogo roda inteiro neste aparelho.</p>' +
      '<div class="acoes-desfecho"><button class="btn" id="btn-comecar-demo">⚖ &nbsp;Assumir a audiência</button></div>' +
      '</div>';
    document.body.appendChild(atracao);
    atracao.querySelector("#btn-comecar-demo").addEventListener("click", function () {
      atracao.remove();
      iniciarDemo();
    });

    // vigia de inatividade: 2 minutos parado → limpa e volta à atração
    var ultimoToque = Date.now();
    ["pointerdown", "keydown", "touchstart"].forEach(function (ev) {
      document.addEventListener(ev, function () { ultimoToque = Date.now(); }, true);
    });
    setInterval(function () {
      if (Date.now() - ultimoToque > 120000) {
        TOGA.motor.apagarSave("demo");
        window.location.reload();
      }
    }, 5000);
  }
});
