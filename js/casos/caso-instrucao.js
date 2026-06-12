/* ============================================================
   CASO: AÇÃO PENAL — "O depoimento de Jandira"
   ------------------------------------------------------------
   Instrução de processo por estupro (CP, art. 213). Vítima
   adulta, 20 anos. O caso — escrito por peças processuais,
   sem qualquer descrição do fato — é sobre PROCEDIMENTO:
   como a sala de audiências trata quem teve a coragem de
   denunciar, e o que a decisão correta devolve a ela.

   Fundamentos: CPP, arts. 217, 400-A (Lei 14.245/2021 — Caso
   Mariana Ferrer), 312, §2º, 313, I; Res. CNJ 492/2023;
   jurisprudência do STJ sobre a palavra da vítima.
   ============================================================ */

window.TOGA = window.TOGA || {};
TOGA.casos.push({
  id: "instrucao",
  titulo: "Criminal — O depoimento de Jandira",
  subtitulo: "Ela denunciou. Ele ameaça. A sala de audiências decide quem sai protegido — e quem sai algemado.",
  area: "Criminal — Instrução",
  hora: "16:30",
  duracaoPrevistaMin: 80,
  tensao: 12,

  personagens: [
    { id: "jandira", nome: "Jandira", papel: "Vítima", assento: "centro",
      avatar: { pele: "#a86a48", cabelo: "longo", corCabelo: "#1d1209", traje: "camisa", corTraje: "#4a4438" } },
    { id: "aline", nome: "Dra. Aline", papel: "Promotora", assento: "esq1",
      avatar: { pele: "#e8c39a", cabelo: "coque", corCabelo: "#3a2a1a", traje: "blazer", corTraje: "#33424f", corBlusa: "#efe5c8" } },
    { id: "ruy", nome: "Dr. Ruy", papel: "Advogado de defesa", assento: "dir1",
      avatar: { pele: "#d8a87f", cabelo: "curto", corCabelo: "#574737", traje: "terno", corTraje: "#2a1d12", corGravata: "#7a2e2e", oculos: true } },
    { id: "valter", nome: "Válter", papel: "Réu", assento: "dir2",
      avatar: { pele: "#c98e66", cabelo: "curto", corCabelo: "#241a10", traje: "camisa", corTraje: "#3a3a40", barba: true } }
  ],

  autos: {
    resumo: "Ação penal — CP, art. 213. Denúncia recebida há 5 meses. Hoje: depoimento da vítima e interrogatório. A vítima compareceu acompanhada da equipe do CREAS. Há nos autos representação do MP pela prisão preventiva, com base em AMEAÇAS posteriores ao fato, documentadas em dois boletins de ocorrência recentes.",
    pecas: [
      { id: "denuncia", titulo: "Denúncia e laudo (referidos)",
        texto: "A denúncia descreve o fato na forma do art. 213 do CP, instruída com laudo pericial do IML — cujas conclusões corroboram a versão da ofendida — e relatório de atendimento da rede de saúde na mesma data. As peças técnicas constam do apenso 1, com acesso restrito (segredo de justiça, CPP, art. 201, §6º)." },
      { id: "ameacas", titulo: "Boletins de ocorrência — ameaças recentes",
        texto: "BO de 22 dias atrás: a vítima relata que o réu passou três vezes em frente ao seu trabalho, fazendo gesto de silêncio. BO de 9 dias atrás: mensagens de número desconhecido — 'retira tudo, você sabe o que acontece' — periciadas, com indícios de origem no aparelho do irmão do réu. O MP representa pela PREVENTIVA com base no risco à instrução e à integridade da vítima (CPP, arts. 312, §2º, e 313, I)." },
      { id: "defesa2", titulo: "Requerimentos da defesa",
        texto: "A defesa de Válter requer: (i) a presença do réu na sala durante TODO o depoimento da vítima, 'para o exercício pleno da autodefesa'; (ii) autorização para inquirir a ofendida sobre 'seu comportamento social e relacionamentos pregressos, aptos a contextualizar o consentimento'. Protesta por nulidade caso indeferidos." },
      { id: "protocolo", titulo: "Protocolo de Julgamento — Res. CNJ 492/2023",
        texto: "Nota da assessoria: aplicável ao caso o Protocolo para Julgamento com Perspectiva de Gênero (obrigatório — Res. CNJ 492/2023): evitar revitimização, vedar perguntas sobre a vida sexual pregressa (CPP, art. 400-A, Lei 14.245/2021), assegurar depoimento sem intimidação (CPP, art. 217), e valorar a palavra da vítima conforme jurisprudência consolidada do STJ em crimes contra a dignidade sexual." }
    ]
  },

  focos: [
    { id: "f_217", rotulo: "O art. 217 do CPP", dica: "Se a presença do réu inibe a verdade, ele acompanha por videoconferência — sem nulidade.",
      grifos: [{ peca: "defesa2", trecho: "a presença do réu na sala durante TODO o depoimento da vítima" }] },
    { id: "f_400a", rotulo: "A Lei Mariana Ferrer", dica: "CPP, art. 400-A: pergunta sobre vida pregressa da vítima é VEDADA — e indeferi-la exige fundamentação em ata.",
      grifos: [{ peca: "defesa2", trecho: "seu comportamento social e relacionamentos pregressos" }] },
    { id: "f_preventiva", rotulo: "As ameaças nos autos", dica: "Dois BOs recentes e perícia nas mensagens: risco CONCRETO e CONTEMPORÂNEO — o material exato dos arts. 312, §2º, e 313, I.",
      grifos: [{ peca: "ameacas", trecho: "'retira tudo, você sabe o que acontece'" }] },
    { id: "f_palavra", rotulo: "A palavra da vítima", dica: "Em crimes sexuais, a palavra coerente da vítima tem especial relevância probatória (STJ) — somada, aqui, ao laudo.",
      grifos: [{ peca: "denuncia", trecho: "cujas conclusões corroboram a versão da ofendida" }] }
  ],

  arco: {
    antes: { emocao: "medo", gesto: "angustia" },
    depois: [
      { se: function (f) { return !!f.vitimaSegura; }, tom: "bom",
        falas: [
          { quem: "jandira", emocao: "choro", texto: "Doutor... hoje eu volto pra casa sem olhar por cima do ombro. A senhora promotora explicou onde ele está. Eu dormi duas horas por noite esses meses. Hoje eu vou dormir." },
          { quem: "aline", emocao: "firme", texto: "E a rede de apoio segue com ela até o fim do processo, Excelência. A audiência de hoje vai virar aula no nosso núcleo: dá para fazer JUSTO e fazer DIREITO ao mesmo tempo." }
        ] },
      { se: function (f) { return !!f.revitimizadaInstrucao; }, tom: "grave",
        falas: [
          { quem: "aline", emocao: "raiva", texto: "Excelência, a vítima saiu da sala dizendo que se soubesse como era, não teria denunciado. Pense no tamanho dessa frase. O Ministério Público vai pensar nela por muito tempo." }
        ] }
    ]
  },

  vidasTocadas: [
    { se: "vitimaSegura", tom: "bom",
      texto: "Jandira dormiu sabendo onde ele estava — e não era na esquina dela. A denúncia que ela teve coragem de fazer foi tratada com a seriedade que merecia." },
    { se: function (f) { return f.condenadoSemPreventiva; }, tom: "grave",
      texto: "A condenação saiu — mas o réu saiu pela mesma porta que a vítima, e os boletins de ameaça continuam valendo na rua." },
    { se: "revitimizadaInstrucao", tom: "grave",
      texto: "Jandira disse na saída: 'se eu soubesse, não tinha denunciado'. Cada mulher que a ouvir vai guardar essa frase." },
    { se: "absolvidoPalavra", tom: "grave",
      texto: "'Palavra contra palavra' — contra laudo, rede de saúde e coerência. A próxima vítima da comarca saberá o que a espera no fórum." }
  ],

  inicio: "i1",
  cenas: {

    i1: {
      falas: [
        { quem: "narrador", texto: "16h30. Jandira aguarda na antessala com a psicóloga do CREAS. Na sala, o réu ajeita o colarinho. A defesa distribui requerimentos. A promotora confere os boletins de ocorrência pela terceira vez." },
        { quem: "ruy", emocao: "firme", texto: "Excelência, a defesa reitera por escrito: o réu tem o direito de presenciar o depoimento — autodefesa plena. Qualquer retirada será arguida como nulidade." },
        { quem: "aline", emocao: "firme", texto: "E o Ministério Público lembra, Excelência, que há dois boletins de ameaça NOS AUTOS. A vítima informou à equipe que não consegue falar diante do réu. O art. 217 existe para esta exata situação." }
      ],
      decisao: {
        prompt: "Jandira está prestes a entrar. Como você organiza a sala para o depoimento dela?",
        opcoes: [
          { rotulo: "Manter o réu na sala, de frente: 'a ampla defesa não se flexibiliza por desconforto'",
            fundamento: "CF, art. 5º, LV — ampla defesa",
            efeitos: { tec: -8, hum: -10, imp: -4, tempo: 6 },
            setFlags: { revitimizadaInstrucao: true },
            reacoes: [
              { quem: "narrador", texto: "Jandira entra, vê o réu, e para no meio da sala. O depoimento que se segue é curto, monossilábico, de olhos no chão. A promotora encerra as perguntas antes do previsto — não há o que colher de uma testemunha congelada." },
              { quem: "aline", emocao: "raiva", texto: "O Ministério Público consigna: a presença do réu esvaziou a prova, Excelência. O art. 217 foi escrito para impedir exatamente o que acabamos de assistir." }
            ],
            feedback: { acerto: "grave", titulo: "A ampla defesa não inclui intimidar",
              texto: "O art. 217 do CPP resolve a tensão há décadas: constatado que a presença do réu causa temor apto a prejudicar a verdade, o juiz determina sua retirada, mantendo-o informado por videoconferência COM o defensor na sala — autodefesa e contraditório PRESERVADOS, diz a jurisprudência pacífica. Manter o réu de frente não protegeu a defesa; destruiu a prova e feriu quem já tinha sido ferida." },
            proxima: "i2" },

          { rotulo: "Retirar o réu para sala contígua COM videoconferência e defensor presente, advertindo desde já as partes sobre o art. 400-A (vedação de perguntas sobre a vida pregressa)",
            fundamento: "CPP, arts. 217 e 400-A; Res. CNJ 492/2023",
            requerFoco: "f_217",
            efeitos: { tec: 9, hum: 9, tempo: 8 },
            carimbo: "ART. 217 APLICADO",
            setFlags: { depoimentoProtegido: true },
            reacoes: [
              { quem: "ruy", emocao: "neutro", texto: "Com a videoconferência ativa e este defensor na sala... a nulidade perde objeto. Consigne-se apenas o protesto de estilo, Excelência." },
              { quem: "narrador", texto: "Jandira entra. Olha ao redor — e a cadeira do réu está vazia. Os ombros baixam meio centímetro. Ela respira, e diz: 'pode perguntar, doutora. Eu vim contar.'" }
            ],
            feedback: { acerto: "otimo", titulo: "A sala arrumada para a verdade",
              texto: "Execução exemplar do art. 217: o réu vê e ouve tudo por vídeo, o defensor permanece, e a vítima depõe sem o olhar que a calava — nulidade nenhuma sobrevive a esse arranjo. A advertência prévia sobre o 400-A completa o quadro: as regras do jogo ficaram claras ANTES da primeira pergunta, como manda o protocolo do CNJ." },
            proxima: "i2" },

          { rotulo: "Perguntar a Jandira, na frente de todos, se ela 'se incomoda' com a presença do réu",
            fundamento: "Oitiva da interessada",
            efeitos: { tec: -3, hum: -5, tempo: 5 },
            reacoes: [
              { quem: "aline", emocao: "triste", texto: "Excelência, pedir que ela diga ISSO olhando para ele é pedir que ela escolha entre a verdade e a segurança — em voz alta." }
            ],
            feedback: { acerto: "ruim", titulo: "A pergunta que entrega a resposta",
              texto: "Bem-intencionada, mas invertida: obrigar a vítima a 'pedir' a retirada do réu, diante dele, é transferir a ela o ônus — e o risco — de uma decisão que é SUA, juiz. O art. 217 não exige requerimento da vítima: exige a constatação do temor, que dois BOs de ameaça já documentavam de sobra." },
            proxima: "i2" }
        ]
      }
    },

    i2: {
      falas: [
        { quem: "narrador", texto: "O depoimento avança. Jandira responde com firmeza crescente às perguntas da promotora. Chega a vez da defesa." },
        { quem: "ruy", emocao: "neutro", texto: "Senhora Jandira... para CONTEXTUALIZAR o alegado, a defesa precisa compreender seu estilo de vida à época. A senhora costumava frequentar festas? Quantos relacionamentos a senhora manteve no ano anterior ao fato?" },
        { quem: "aline", emocao: "raiva", texto: "OBJEÇÃO, Excelência. Art. 400-A do CPP, literal." }
      ],
      decisao: {
        prompt: "A pergunta vedada está no ar. A sala inteira espera a sua reação.",
        opcoes: [
          { rotulo: "Permitir, com ressalva: 'a defesa tem latitude na inquirição; a testemunha responda apenas o que quiser'",
            fundamento: "Amplitude da defesa técnica",
            efeitos: { tec: -10, hum: -12, imp: -6, tempo: 6 },
            setFlags: { revitimizadaInstrucao: true, manchaGrave: true },
            reacoes: [
              { quem: "jandira", emocao: "choro", texto: "Eu vim falar do que ELE fez... e o senhor deixa perguntarem da MINHA vida?" },
              { quem: "aline", emocao: "raiva", texto: "O Ministério Público requer cópia da ata para as providências cabíveis, Excelência. TODAS elas." }
            ],
            feedback: { acerto: "grave", titulo: "A lei que nasceu de uma audiência como esta",
              texto: "O art. 400-A do CPP (Lei 14.245/2021) foi escrito DEPOIS — e POR CAUSA — de audiências assim: é VEDADA a manifestação sobre circunstâncias ou elementos alheios aos fatos, e expressamente a exploração da vida sexual pregressa da vítima. Permitir 'com ressalva' é descumprir norma literal e repetir, com selo judicial, a violência que o processo apura. A responsabilização do magistrado está no próprio artigo." },
            proxima: "i3" },

          { rotulo: "Indeferir secamente: 'indefiro; próxima pergunta'",
            fundamento: "Poder de polícia da audiência",
            efeitos: { tec: 2, hum: 3, tempo: 4 },
            reacoes: [
              { quem: "ruy", emocao: "neutro", texto: "Consigne-se o indeferimento SEM fundamentação, para fins de apelação, Excelência." }
            ],
            feedback: { acerto: "bom", titulo: "Certo no resultado, frágil no registro",
              texto: "Indeferir era obrigatório — mas a ata é a memória do processo: sem a fundamentação expressa (art. 400-A; Lei 14.245/2021), a defesa transformará o 'indefiro' seco em tese de cerceamento na apelação. Uma frase a mais em ata — 'pergunta vedada por lei, sem pertinência com os fatos' — e a tese morreria no nascedouro." },
            proxima: "i3" },

          { rotulo: "Indeferir COM fundamentação em ata: pergunta vedada pelo art. 400-A do CPP, sem pertinência com os fatos — e advertir que a reiteração configurará violação funcional",
            fundamento: "CPP, art. 400-A; Lei 14.245/2021; Res. CNJ 492/2023",
            requerFoco: "f_400a",
            efeitos: { tec: 9, hum: 8, imp: 3, tempo: 7 },
            carimbo: "PERGUNTA INDEFERIDA",
            setFlags: { dignidadePreservada: true },
            reacoes: [
              { quem: "ruy", emocao: "vergonha", texto: "...a defesa prossegue com perguntas sobre OS FATOS, Excelência." },
              { quem: "jandira", emocao: "firme", texto: "Obrigada, doutor. Pode continuar, doutor Ruy. Sobre os fatos, eu respondo o que for." },
              { quem: "narrador", texto: "Algo muda na sala: a testemunha que entrou com medo termina o depoimento com a voz firme. A ata registra cada palavra." }
            ],
            feedback: { acerto: "otimo", titulo: "A objeção acolhida no tempo e na forma",
              texto: "Resposta completa: indeferimento IMEDIATO (a pergunta não chega à vítima), fundamentação EXPRESSA em ata (blinda contra a tese de cerceamento) e advertência sobre reiteração (o 400-A prevê responsabilização). É o roteiro da Lei Mariana Ferrer aplicado como a lei quis: a defesa permanece ampla — sobre OS FATOS; a dignidade da vítima permanece intacta — sobre TUDO." },
            proxima: "i3" }
        ]
      }
    },

    i3: {
      falas: [
        { quem: "narrador", texto: "Instrução encerrada, interrogatório colhido, alegações finais orais. O laudo corrobora; a palavra da vítima foi coerente do BO à audiência; as ameaças recentes estão periciadas. O MP reitera a condenação E a preventiva. A defesa pede absolvição por 'fragilidade probatória'." },
        { quem: "aline", emocao: "firme", texto: "Dois boletins em três semanas, Excelência, mensagens periciadas: 'retira tudo, você sabe o que acontece'. O risco não é tese — está datado, registrado e dirigido à testemunha central do processo." }
      ],
      decisao: {
        prompt: "Sentença em audiência. O que você decide — e o que decide JUNTO?",
        opcoes: [
          { rotulo: "Absolver: 'palavra contra palavra não sustenta condenação — in dubio pro reo'",
            fundamento: "CPP, art. 386, VII",
            efeitos: { tec: -10, hum: -10, tempo: 8 },
            carimbo: "ABSOLVIDO",
            setFlags: { absolvidoPalavra: true, manchaGrave: true },
            reacoes: [
              { quem: "aline", emocao: "raiva", texto: "'Palavra contra palavra' com LAUDO corroborante e rede de saúde no mesmo dia, Excelência? Apelação imediata. E a vítima sai daqui para a rua onde ele faz ronda." }
            ],
            feedback: { acerto: "grave", titulo: "O clichê que ignora os autos",
              texto: "A fórmula 'palavra contra palavra' não descreve este processo: a palavra da vítima — que em crimes sexuais tem especial relevância probatória, por jurisprudência consolidada do STJ — veio CORROBORADA por laudo do IML e atendimento da rede na mesma data, e manteve coerência por cinco meses. Aplicar o in dubio onde não há dúvida razoável não é garantismo: é recusa de valorar a prova que está nos autos." },
            proxima: "fim_grave" },

          { rotulo: "Condenar nos termos da denúncia, em regime inicial fechado — mas SEM preventiva: 'réu que respondeu solto apela solto'",
            fundamento: "CPP, art. 387, §1º; Súmula 347/STJ (por analogia)",
            efeitos: { tec: 2, hum: -4, tempo: 8 },
            carimbo: "CONDENADO",
            setFlags: { condenadoSemPreventiva: true },
            reacoes: [
              { quem: "jandira", emocao: "medo", texto: "Ele... ele vai embora pela mesma porta que eu, doutor?" },
              { quem: "aline", emocao: "raiva", texto: "Os DOIS boletins de ameaça, Excelência! O risco que justificaria a preventiva acabou de GANHAR motivo novo: a condenação!" }
            ],
            feedback: { acerto: "ruim", titulo: "A regra geral aplicada à exceção documentada",
              texto: "'Respondeu solto, apela solto' é a regra — PARA O RÉU QUE NÃO AMEAÇA. Aqui havia exatamente o que o art. 312, §2º, exige para a exceção: fatos NOVOS e CONTEMPORÂNEOS (dois BOs, mensagens periciadas) demonstrando risco à vítima — agora multiplicado pela condenação. A sentença ficou tecnicamente de pé; a vítima, desprotegida na calçada." },
            proxima: "fim_ruim" },

          { rotulo: "Condenar com fundamentação completa (palavra da vítima + laudo + coerência) E decretar a PREVENTIVA por fatos concretos e atuais: as ameaças documentadas — com encaminhamento de Jandira à rede de proteção",
            fundamento: "STJ — palavra da vítima; CPP, arts. 312, §2º, 313, I, e 315; Lei 9.807/99 (rede)",
            requerFoco: "f_preventiva",
            efeitos: { tec: 10, hum: 8, imp: 3, tempo: 12 },
            carimbo: "CONDENADO — PREVENTIVA",
            setFlags: { estupradorPreso: true, vitimaSegura: true, condenacaoSolida: true },
            evento: "prisao:valter",
            reacoes: [
              { quem: "valter", emocao: "raiva", texto: "Isso não fica assim." },
              { quem: "narrador", texto: "A frase do réu, dita com o oficial já ao lado, entra na ata — e vira o último tijolo da própria preventiva que o leva." },
              { quem: "jandira", emocao: "choro", texto: "Acabou?... Doutora, acabou de verdade?" },
              { quem: "aline", emocao: "firme", texto: "A parte mais difícil, sim, Jandira. E a rede vai com você no resto. Excelência: o Ministério Público registra que ESTA é a audiência que a Resolução 492 descreve." }
            ],
            feedback: { acerto: "otimo", titulo: "Condenação que protege — nas duas direções",
              texto: "Sentença completa em todos os eixos: (1) a valoração probatória segue a jurisprudência do STJ — palavra da vítima coerente + corroboração pericial = prova suficiente; (2) a preventiva não é efeito automático da condenação (seria nula), mas resposta a FATOS concretos, datados e periciados — exatamente os arts. 312, §2º, e 313, I; (3) o encaminhamento à rede (Lei 9.807) cuida de quem o processo às vezes esquece: a pessoa que voltará para casa. A prisão que a sala assistiu não foi espetáculo — foi a ameaça documentada encontrando consequência." },
            proxima: "fim_otimo" }
        ]
      }
    },

    fim_otimo: {
      falas: [
        { quem: "narrador", texto: "A escolta cruza o corredor. Atrás do vidro da antessala, Jandira observa em silêncio — não com alegria, com ALÍVIO, que é outra coisa. A psicóloga do CREAS anota o telefone do plantão e entrega: 'qualquer coisa, a qualquer hora'. Ela guarda o papel. Pela primeira vez em meses, talvez não precise dele." }
      ],
      fim: {
        titulo: "A CORAGEM RECOMPENSADA",
        selo: "otimo",
        texto: "Do art. 217 à preventiva fundamentada, cada decisão desta audiência fez a mesma afirmação por meios diferentes: denunciar VALEU A PENA. A vítima depôs sem medo, a defesa atuou no seu espaço legítimo, a condenação saiu blindada — e a ameaça que rondava a porta do trabalho dela dorme hoje sob custódia do Estado. É disto que se trata a jurisdição penal: não de vingança, de SEGURANÇA."
      }
    },

    fim_ruim: {
      falas: [
        { quem: "narrador", texto: "O réu assina a intimação da sentença no balcão e sai. Jandira espera vinte minutos na antessala — o tempo de ele 'ganhar distância' — antes de atravessar o mesmo corredor." }
      ],
      fim: {
        titulo: "CONDENADO — E NA CALÇADA",
        selo: "ruim",
        texto: "A condenação honra a prova dos autos. Mas a pergunta da vítima — 'ele sai pela mesma porta que eu?' — ficou sem a resposta que dois boletins de ocorrência pediam. A preventiva tinha requisitos de sobra e ficou na gaveta; a apelação demorará anos; as rondas em frente ao trabalho dela, talvez não."
      }
    },

    fim_grave: {
      falas: [
        { quem: "narrador", texto: "A sala esvazia em silêncio constrangido. No corredor, a psicóloga do CREAS recolhe os pertences de Jandira, que saiu sem esperar a cópia da sentença." }
      ],
      fim: {
        titulo: "EM DÚVIDA QUE NÃO HAVIA",
        selo: "grave",
        texto: "Laudo, rede de saúde, cinco meses de coerência — reduzidos a 'palavra contra palavra'. A apelação do MP tem a jurisprudência inteira a favor; mas o estrago da tarde não se reforma em segundo grau: cada futura vítima desta comarca ouvirá, antes de decidir denunciar, o que aconteceu na sala em que a verdade não foi suficiente."
      }
    }
  }
});
