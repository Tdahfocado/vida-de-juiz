/* ============================================================
   CASO JECC: CRIMINAL — "O aniversário de oito anos"
   ------------------------------------------------------------
   Audiência no Juizado Especial Criminal. Termo circunstanciado
   por som alto (LCP, art. 42) em UMA festa de aniversário
   infantil, em horário razoável, sem reiteração. O réu recusa a
   transação penal — não cometeu contravenção alguma. O Ministério
   Público insiste, se irrita e oferece DENÚNCIA ORAL. Ao juiz cabe
   ver a desproporção: aqui não há justa causa nem para a ação
   penal. A decisão certa é REJEITAR a denúncia.
   ============================================================ */

window.TOGA = window.TOGA || {};
TOGA.casos.push({
  id: "jecc-somalto",
  titulo: "JECrim — O aniversário de oito anos",
  subtitulo: "Uma festa infantil, música até as 22h, uma única reclamação. O Estado vai mesmo abrir ação penal por isso?",
  area: "Juizado Especial Criminal",
  hora: "09:00",
  duracaoPrevistaMin: 30,
  tensao: 6,
  sala: "jecc",

  personagens: [
    { id: "seubene", nome: "Seu Benedito", papel: "Autor do fato (réu)", assento: "centro",
      avatar: { pele: "#a86a48", cabelo: "curto", corCabelo: "#3a2a1a", traje: "camisa", corTraje: "#556a55", barba: true } },
    { id: "mpSom", nome: "Dr. Heitor", papel: "Promotor", assento: "esq1",
      avatar: { pele: "#d8a87f", cabelo: "curto", corCabelo: "#3a2a1a", traje: "terno", corTraje: "#33424f", corGravata: "#5e2424", oculos: true } },
    { id: "defSom", nome: "Dra. Iara", papel: "Defensora pública", assento: "dir1",
      avatar: { pele: "#c98e66", cabelo: "coque", corCabelo: "#241a10", traje: "blazer", corTraje: "#2f4a3e", corBlusa: "#efe5c8" } }
  ],

  autos: {
    resumo: "Termo circunstanciado (JECrim) por perturbação do sossego (LCP, art. 42). Seu Benedito fez a festa de 8 anos da filha em casa; a música tocou até por volta das 22h em um sábado. Houve UMA reclamação, de um vizinho. A guarnição compareceu, o som foi baixado de imediato. Réu primário, sem qualquer registro anterior. O MP propôs transação penal (cesta básica); o réu recusou.",
    pecas: [
      { id: "to", titulo: "Termo circunstanciado",
        texto: "Fato: música em festa de aniversário infantil, sábado, encerrada por volta das 22h. Uma reclamação (um vizinho). Ao chegar a guarnição, o som foi reduzido na hora; não houve recusa, resistência ou reiteração. Réu primário. Não há laudo de medição sonora nem registro de reclamações anteriores no endereço." },
      { id: "art42", titulo: "Nota da Defensoria — LCP, art. 42",
        texto: "A contravenção do art. 42 da LCP tutela o SOSSEGO COLETIVO e pressupõe perturbação relevante e, em regra, reiterada — não uma celebração pontual, em horário socialmente tolerável, prontamente cessada. Falta tipicidade material e justa causa. A defesa sustenta a REJEIÇÃO da denúncia (CPP, art. 395, II e III) e que a recusa da transação é direito do autor do fato." },
      { id: "transacao", titulo: "Proposta de transação penal (recusada)",
        texto: "O MP ofereceu transação penal (Lei 9.099/95, art. 76) — uma cesta básica. Seu Benedito recusou, afirmando que não cometeu crime nenhum e que aceitar seria 'assinar embaixo de uma culpa que não existe'. A transação é faculdade do autor do fato; a recusa não autoriza coação nem antecipa condenação." }
    ]
  },

  focos: [
    { id: "f_justacausa", rotulo: "Justa causa para a ação", dica: "Sem perturbação relevante/reiterada, falta tipicidade material e justa causa — caso de REJEIÇÃO da denúncia (CPP, art. 395).",
      grifos: [{ peca: "art42", trecho: "perturbação relevante e, em regra, reiterada" }] },
    { id: "f_transacao", rotulo: "Transação é direito, não imposição", dica: "Recusar a transação é faculdade do autor do fato (Lei 9.099/95, art. 76). Pressionar a aceitar pune quem talvez nem crime cometeu.",
      grifos: [{ peca: "transacao", trecho: "A transação é faculdade do autor do fato" }] }
  ],

  arco: {
    antes: { emocao: "raiva" },
    depois: [
      { se: function (f) { return !!f.somDenunciaRejeitada; }, tom: "bom",
        falas: [
          { quem: "seubene", emocao: "choro", texto: "Doutor, eu ia ter ANTECEDENTE por causa do aniversário da minha filha. Obrigado por ENXERGAR isso. A senhora promotora me olhava como se eu fosse bandido." }
        ] },
      { se: function (f) { return !!f.somProcessado; }, tom: "grave",
        falas: [
          { quem: "defSom", emocao: "raiva", texto: "Uma ação penal por uma festa de aniversário, Excelência. Vamos discutir isso por meses — e o recado para a vizinhança é que a Justiça serve para vingança de muro." }
        ] }
    ]
  },

  vidasTocadas: [
    { se: "somDenunciaRejeitada", tom: "bom",
      texto: "Seu Benedito saiu sem ação penal e sem ficha. O Juizado serviu para o que existe: medir a proporção, não criminalizar a vida em comum." },
    { se: "somTransacaoCoagida", tom: "grave",
      texto: "Pressionado, Seu Benedito 'aceitou' a transação para se livrar — e levou para casa o peso de uma punição por algo que não foi crime." },
    { se: "somProcessado", tom: "grave",
      texto: "Virou réu em ação penal pelo aniversário da filha. Meses de audiências à frente, por um fato que jamais deveria ter saído do termo." }
  ],

  inicio: "c1",
  cenas: {

    c1: {
      falas: [
        { quem: "narrador", texto: "09h00. Seu Benedito, de camisa passada e mãos inquietas. A defensora ao lado. O promotor, com o termo na mão, retoma a proposta." },
        { quem: "mpSom", emocao: "firme", texto: "Excelência, ofereço novamente a transação: uma cesta básica e o feito se encerra. É generoso." },
        { quem: "seubene", emocao: "raiva", texto: "Generoso? Foi o aniversário de OITO ANOS da minha filha, doutor! Música até as dez da noite, num sábado. Abaixei na hora que a viatura chegou. Eu não vou aceitar punição por isso — eu RECUSO." },
        { quem: "mpSom", emocao: "raiva", texto: "Pois muito bem. Se recusa a transação, o Ministério Público oferece DENÚNCIA, aqui, oralmente: incurso no art. 42 da Lei das Contravenções Penais. Que se instaure a ação." },
        { quem: "defSom", emocao: "firme", texto: "Excelência, uma festa de aniversário pontual não é contravenção. Falta justa causa. A recusa da transação é direito dele — e não pode virar pretexto para processá-lo." }
      ],
      decisao: {
        prompt: "A denúncia oral está posta. O réu recusou a transação. O que você decide?",
        opcoes: [
          { rotulo: "Pressionar o réu: 'aceite a transação, Seu Benedito — é uma cesta básica, melhor que virar réu'",
            fundamento: "Conveniência / celeridade",
            efeitos: { tec: -8, hum: -10, tempo: 5 },
            setFlags: { somTransacaoCoagida: true, manchaGrave: true },
            reacoes: [
              { quem: "defSom", emocao: "raiva", texto: "Excelência, o senhor está coagindo a aceitação! Transação recusada é direito — e ele só aceitaria por medo de virar réu." },
              { quem: "seubene", emocao: "triste", texto: "Então é assim... ou eu 'aceito' uma culpa que não tenho, ou viro réu? Que escolha é essa, doutor?" }
            ],
            feedback: { acerto: "grave", titulo: "Coagir a transação é punir sem crime",
              texto: "A transação penal é faculdade do autor do fato (Lei 9.099/95, art. 76) — recusá-la é direito, e o juiz não pode pressionar a aceitação. Empurrar a cesta básica 'para evitar o processo' impõe uma sanção a quem talvez sequer cometeu contravenção: troca-se a análise da justa causa por uma punição negociada sob medo. O papel do juiz aqui era outro — filtrar a ação, não vendê-la." },
            proxima: "fim_grave_coacao" },

          { rotulo: "Receber a denúncia oral e designar audiência de instrução para apurar a perturbação",
            fundamento: "LCP, art. 42; recebimento da denúncia",
            efeitos: { tec: -7, hum: -6, tempo: 7 },
            carimbo: "DENÚNCIA RECEBIDA",
            setFlags: { somProcessado: true, manchaGrave: true },
            reacoes: [
              { quem: "mpSom", emocao: "firme", texto: "Assim se faz justiça, Excelência." },
              { quem: "seubene", emocao: "medo", texto: "Eu vou ser PROCESSADO... pela festa da minha filha. Meu Deus." }
            ],
            feedback: { acerto: "grave", titulo: "Processar o que não tem justa causa",
              texto: "Receber a denúncia exige justa causa — lastro mínimo de tipicidade e materialidade. Uma festa de aniversário pontual, em horário tolerável, com uma só reclamação e cessação imediata, não configura a perturbação relevante e reiterada que o art. 42 da LCP tutela. Sem justa causa, a denúncia deve ser REJEITADA (CPP, art. 395). Recebê-la inaugura meses de ação penal por um não-fato — desproporção que desgasta a parte e desmoraliza a Justiça." },
            proxima: "fim_grave_processo" },

          { rotulo: "Rejeitar a denúncia por falta de justa causa (atipicidade): festa de aniversário pontual, em horário razoável, prontamente cessada, não é a contravenção do art. 42 da LCP",
            fundamento: "CPP, art. 395, II e III; LCP, art. 42; princípio da proporcionalidade",
            requerFoco: "f_justacausa",
            efeitos: { tec: 10, hum: 9, imp: 3, tempo: 6 },
            carimbo: "DENÚNCIA REJEITADA",
            setFlags: { somDenunciaRejeitada: true },
            reacoes: [
              { quem: "mpSom", emocao: "raiva", texto: "O Ministério Público RECORRE, Excelência. Registre-se." },
              { quem: "defSom", emocao: "firme", texto: "É a decisão correta, Excelência. O direito penal não é síndico de condomínio." },
              { quem: "seubene", emocao: "choro", texto: "Posso ir, doutor? De verdade? ...Obrigado. A senhora não imagina o nó que era isso." }
            ],
            feedback: { acerto: "otimo", titulo: "O filtro da ação penal funcionando",
              texto: "Decisão certeira: ausente a justa causa — tipicidade material e materialidade —, a denúncia deve ser rejeitada (CPP, art. 395, II e III). O art. 42 da LCP protege o sossego coletivo contra perturbação relevante e, de regra, reiterada; uma festa de aniversário pontual, em horário socialmente tolerável e prontamente encerrada, não chega lá. E a recusa da transação, sendo direito, jamais poderia virar pretexto para processar. O juiz é o filtro que impede o direito penal de descer ao tamanho de uma briga de muro. Cabe recurso ao MP — e a proporção está do seu lado." },
            proxima: "fim_otimo" }
        ]
      }
    },

    fim_otimo: {
      falas: [
        { quem: "narrador", texto: "Seu Benedito aperta a mão da defensora, ainda com os olhos marejados, e sai pelo corredor do Juizado. O promotor recolhe os papéis, contrariado — mas a ata registra uma decisão que se sustenta sozinha." }
      ],
      fim: {
        titulo: "O DIREITO PENAL NO SEU TAMANHO",
        selo: "otimo",
        texto: "Rejeitar a denúncia não foi leniência — foi proporção e técnica. O direito penal é a última razão do Estado, não a primeira resposta a um desentendimento de vizinhança. Uma festa de aniversário infantil, pontual e em horário tolerável, não move legitimamente a máquina que processa e estigmatiza. O Juizado fez exatamente o que dele se espera: filtrar."
      }
    },

    fim_grave_coacao: {
      falas: [
        { quem: "narrador", texto: "Seu Benedito assina a transação de cabeça baixa, para 'não virar réu'. Sai com a sensação de ter pago por algo que não fez — e a defensora consigna o protesto em ata." }
      ],
      fim: {
        titulo: "A CULPA QUE NÃO EXISTIA, ASSINADA",
        selo: "grave",
        texto: "A transação é direito do autor do fato — e recusá-la também é. Pressioná-lo a aceitar inverteu o papel do juiz: em vez de aferir a justa causa, vendeu-se uma punição sob o medo do processo. Seu Benedito levou para casa o peso de uma culpa que não tinha, e a Justiça, o registro de uma coação."
      }
    },

    fim_grave_processo: {
      falas: [
        { quem: "narrador", texto: "Designada a instrução, Seu Benedito vira réu em ação penal. Lá fora, a vizinhança comenta: deu cadeia o aniversário da menina? O nó no estômago dele agora tem número de processo." }
      ],
      fim: {
        titulo: "RÉU PELO ANIVERSÁRIO DA FILHA",
        selo: "grave",
        texto: "Receber a denúncia sem justa causa transformou um não-fato em ação penal. O art. 42 da LCP não alcança uma festa pontual em horário tolerável; faltava o lastro mínimo de tipicidade. Em vez de filtrar, o juízo abriu meses de processo — desgaste para a parte, descrédito para a Justiça e um recado torto para a comunidade."
      }
    }
  }
});
