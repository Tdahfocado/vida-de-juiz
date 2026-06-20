/* ============================================================
   CASO JECC: CÍVEL — "A geladeira que esquenta"
   ------------------------------------------------------------
   Audiência una do Juizado Especial Cível. Vício de produto
   durável: geladeira nova que não gela. A loja tenta jogar a
   culpa só na fabricante e oferecer conserto fora do prazo. O
   caso cobra a SOLIDARIEDADE dos fornecedores (CDC, art. 18) e
   o direito de ESCOLHA do consumidor depois de vencidos os 30
   dias para sanar o vício.
   ============================================================ */

window.TOGA = window.TOGA || {};
TOGA.casos.push({
  id: "jecc-vicio",
  titulo: "JECível — A geladeira que esquenta",
  subtitulo: "Produto novo com defeito, 40 dias sem solução. A loja diz que a culpa é só da fábrica. E o consumidor, escolhe o quê?",
  area: "Juizado Especial Cível",
  hora: "11:10",
  duracaoPrevistaMin: 30,
  tensao: 4,

  personagens: [
    { id: "seujose", nome: "Seu José", papel: "Autor (sem advogado)", assento: "centro",
      avatar: { pele: "#8a5436", cabelo: "calvo", corCabelo: "#9a9388", traje: "camisa", corTraje: "#54453a" } },
    { id: "prepostoLoja", nome: "Sra. Cláudia", papel: "Preposta da loja", assento: "esq1",
      avatar: { pele: "#e8c39a", cabelo: "coque", corCabelo: "#3a2a1a", traje: "blazer", corTraje: "#4a4438", corBlusa: "#efe5c8" } },
    { id: "advLoja", nome: "Dr. Paulo", papel: "Advogado da loja", assento: "esq2",
      avatar: { pele: "#d8a87f", cabelo: "curto", corCabelo: "#241a10", traje: "terno", corTraje: "#2a2a30", corGravata: "#5e2424", oculos: true } },
    { id: "rochelleC2", nome: "Rochelle", papel: "Conciliadora", assento: "dir2",
      avatar: { pele: "#d8a87f", cabelo: "longo", corCabelo: "#3a2a1a", traje: "vestido", corTraje: "#7a2e4a", corBlusa: "#efe5c8" } }
  ],

  autos: {
    resumo: "Ação de consumo (JECível, jus postulandi). Seu José comprou uma geladeira nova que nunca gelou direito. Reclamou na loja, que encaminhou à assistência técnica; passaram-se 40 dias e o vício não foi sanado. A loja sustenta que 'quem responde por defeito de fabricação é a fábrica' e oferece, agora, mais uma tentativa de conserto.",
    pecas: [
      { id: "compra", titulo: "Nota e histórico",
        texto: "Geladeira adquirida há 70 dias (R$ 2.800). Primeira reclamação no 8º dia. Duas idas à assistência técnica autorizada, sem solução. Decorridos mais de 30 dias desde a primeira reclamação, o vício persiste — o produto não mantém a refrigeração." },
      { id: "cdc18", titulo: "Nota da assessoria — CDC, art. 18",
        texto: "Vício do produto (art. 18 do CDC): os fornecedores respondem SOLIDARIAMENTE. Não sanado o vício em 30 dias, o consumidor pode EXIGIR, à sua escolha: (I) a substituição do produto; (II) a restituição da quantia paga, corrigida, sem prejuízo de perdas e danos; ou (III) o abatimento proporcional do preço. A escolha é do CONSUMIDOR." },
      { id: "defesaLoja", titulo: "Defesa da loja",
        texto: "A loja alega ilegitimidade passiva ('a responsabilidade por defeito de fabricação é exclusiva do fabricante') e, subsidiariamente, requer nova oportunidade de conserto, negando ao consumidor a troca ou a devolução." }
    ]
  },

  focos: [
    { id: "f_solidaria", rotulo: "Responsabilidade solidária", dica: "CDC, art. 18: TODOS os fornecedores da cadeia respondem solidariamente pelo vício do produto. A loja não se livra apontando a fábrica.",
      grifos: [{ peca: "cdc18", trecho: "respondem SOLIDARIAMENTE" }] },
    { id: "f_escolha", rotulo: "A escolha é do consumidor", dica: "Passados os 30 dias sem reparo, quem escolhe entre troca, devolução ou abatimento é o CONSUMIDOR — não o fornecedor.",
      grifos: [{ peca: "cdc18", trecho: "à sua escolha" }] }
  ],

  arco: {
    antes: { emocao: "raiva" },
    depois: [
      { se: function (f) { return !!f.vicioResolvido; }, tom: "bom",
        falas: [
          { quem: "seujose", emocao: "feliz", texto: "Setenta dias com geladeira de enfeite, doutor. Hoje eu escolho: quero meu dinheiro de volta e compro outra que funcione. Obrigado por me deixar ESCOLHER." }
        ] }
    ]
  },

  vidasTocadas: [
    { se: "vicioResolvido", tom: "bom",
      texto: "Seu José saiu com o direito que o CDC lhe dava: a escolha. A loja aprendeu que solidariedade não se terceiriza para a fábrica." },
    { se: "vicioContraLoja", tom: "grave",
      texto: "Mandar o consumidor 'procurar a fábrica' atrasou meses de comida estragada. A Turma Recursal reformará — solidariedade é texto expresso de lei." }
  ],

  inicio: "c1",
  cenas: {

    c1: {
      falas: [
        { quem: "narrador", texto: "11h10. Seu José trouxe a nota fiscal amassada de tanto manusear. A conciliadora Rochelle abre a audiência pela composição." },
        { quem: "advLoja", emocao: "firme", texto: "Excelência, preliminarmente: a loja é parte ilegítima. Defeito de fabricação é com o FABRICANTE. No mérito, oferecemos mais um conserto." },
        { quem: "seujose", emocao: "raiva", texto: "Mais um conserto?! Já foi DUAS vezes na assistência, doutor. Setenta dias! Eu quero é resolver, não consertar pela terceira." }
      ],
      decisao: {
        prompt: "A loja levanta ilegitimidade e oferece conserto. Como você conduz?",
        opcoes: [
          { rotulo: "Acolher a preliminar e extinguir contra a loja: 'defeito de fábrica se resolve com o fabricante'",
            fundamento: "Ilegitimidade passiva",
            efeitos: { tec: -10, hum: -8, tempo: 5 },
            carimbo: "EXTINTO CONTRA A LOJA",
            setFlags: { vicioContraLoja: true, manchaGrave: true },
            reacoes: [
              { quem: "seujose", emocao: "raiva", texto: "Então eu comprei da loja, paguei à loja, e agora tenho que caçar a fábrica em outro estado?!" }
            ],
            feedback: { acerto: "grave", titulo: "Solidariedade é texto expresso",
              texto: "O art. 18 do CDC é categórico: pelos VÍCIOS do produto respondem SOLIDARIAMENTE todos os fornecedores da cadeia — fabricante, distribuidor e COMERCIANTE. (A exclusividade do fabricante vale para o FATO do produto/acidente de consumo, art. 12 — não para o vício.) Extinguir contra a loja obriga o consumidor a perseguir a fábrica e contraria a lei: a loja é parte legítima e responde junto." },
            proxima: "fim_grave" },

          { rotulo: "Determinar mais um conserto em 30 dias 'para dar à loja a chance de sanar o vício'",
            fundamento: "CDC, art. 18, §1º (mal contado)",
            efeitos: { tec: -5, hum: -4, tempo: 5 },
            reacoes: [
              { quem: "seujose", emocao: "triste", texto: "Mais trinta dias, doutor? O prazo já passou faz tempo..." },
              { quem: "rochelleC2", emocao: "firme", texto: "Excelência, os 30 dias correram desde a primeira reclamação. Vencido o prazo, a escolha já passou a ser dele." }
            ],
            feedback: { acerto: "ruim", titulo: "O prazo dos 30 dias já correu",
              texto: "O §1º do art. 18 dá ao fornecedor 30 dias para sanar o vício — mas esse prazo já se esgotou (foram 40+ dias, duas idas à assistência). Vencido o prazo sem solução, abre-se ao CONSUMIDOR a tríplice escolha (troca, devolução ou abatimento). Conceder 'mais 30 dias' é reabrir um prazo que a lei deu uma única vez e transferir ao consumidor o ônus da ineficiência da loja." },
            proxima: "c2" },

          { rotulo: "Rejeitar a ilegitimidade (solidariedade, art. 18) e reconhecer que, vencidos os 30 dias, cabe ao CONSUMIDOR escolher a solução — passar à composição/decisão sobre essa escolha",
            fundamento: "CDC, art. 18, caput e §1º",
            requerFoco: "f_solidaria",
            efeitos: { tec: 9, hum: 7, tempo: 6 },
            carimbo: "PRELIMINAR REJEITADA",
            setFlags: { vicioSolidaria: true },
            reacoes: [
              { quem: "advLoja", emocao: "vergonha", texto: "...a loja mantém a oferta de conserto, Excelência, mas reconhece a legitimidade." },
              { quem: "rochelleC2", emocao: "feliz", texto: "Agora a conversa é a certa: o que o senhor José prefere — troca, dinheiro de volta ou abatimento?" }
            ],
            feedback: { acerto: "otimo", titulo: "Legitimidade certa, prazo certo",
              texto: "Dois acertos de uma vez: a loja é parte legítima (solidariedade do art. 18 do CDC), e o prazo de 30 dias para sanar o vício já se esgotou — o que faz nascer a tríplice opção do consumidor. Afastada a preliminar e fixado que a escolha é dele, a audiência passa, corretamente, a definir QUAL das soluções legais será adotada, conforme a vontade do consumidor." },
            proxima: "c2" }
        ]
      }
    },

    c2: {
      falas: [
        { quem: "narrador", texto: "Reconhecida a responsabilidade e vencido o prazo, resta definir a solução. Seu José é claro." },
        { quem: "seujose", emocao: "firme", texto: "Eu não quero mais essa geladeira, doutor. Quero meu dinheiro de volta, corrigido, e compro outra marca. Já perdi comida demais." },
        { quem: "advLoja", emocao: "neutro", texto: "Excelência, a loja prefere a troca por outra unidade igual — fica mais barato para nós que a devolução." }
      ],
      decisao: {
        prompt: "Vencido o prazo de reparo, qual solução você determina?",
        opcoes: [
          { rotulo: "Impor a TROCA por unidade igual, 'porque é a saída menos onerosa e o consumidor fica com produto novo'",
            fundamento: "CDC, art. 18, §1º, I",
            efeitos: { tec: -7, hum: -5, tempo: 6 },
            carimbo: "TROCA IMPOSTA",
            setFlags: { vicioTrocaImposta: true },
            reacoes: [
              { quem: "seujose", emocao: "raiva", texto: "Mas eu NÃO quero a mesma geladeira que já me deu dor de cabeça! A escolha não era minha?" }
            ],
            feedback: { acerto: "ruim", titulo: "A escolha é do consumidor, não do juiz",
              texto: "As três opções do art. 18, §1º (substituição, restituição ou abatimento) são alternativas à escolha do CONSUMIDOR — não do fornecedor nem do juízo. Impor a troca, ainda que pareça 'razoável', retira de Seu José o direito que a lei expressamente lhe confere. Ele pediu a restituição corrigida: é essa a solução a determinar." },
            proxima: "fim_ruim" },

          { rotulo: "Acolher a escolha do consumidor: restituição da quantia paga, corrigida e com juros, reconhecida a responsabilidade solidária da loja",
            fundamento: "CDC, art. 18, §1º, II",
            requerFoco: "f_escolha",
            efeitos: { tec: 10, hum: 8, imp: 2, tempo: 7 },
            carimbo: "RESTITUIÇÃO CORRIGIDA",
            setFlags: { vicioResolvido: true },
            reacoes: [
              { quem: "advLoja", emocao: "neutro", texto: "A loja cumprirá a restituição, Excelência. Sem recurso." },
              { quem: "seujose", emocao: "feliz", texto: "É isso, doutor! Dinheiro de volta e eu escolho a próxima. Obrigado por me ESCUTAR." }
            ],
            feedback: { acerto: "otimo", titulo: "O direito de escolher, respeitado",
              texto: "Decisão alinhada ao art. 18, §1º, II do CDC: vencido o prazo de reparo, o consumidor optou pela restituição da quantia paga, devidamente corrigida — e a sentença respeitou essa escolha, reconhecida a responsabilidade solidária da loja. Não se substituiu a vontade do consumidor pela conveniência do fornecedor: foi exatamente o que o Código de Defesa do Consumidor garante a quem pagou por um produto que não serviu." },
            proxima: "fim_otimo" },

          { rotulo: "Determinar apenas o abatimento de 30% no preço, 'meio-termo entre as partes'",
            fundamento: "CDC, art. 18, §1º, III",
            efeitos: { tec: -4, hum: -3, tempo: 6 },
            setFlags: { vicioAbatimento: true },
            reacoes: [
              { quem: "seujose", emocao: "triste", texto: "Mas eu vou continuar com a geladeira quebrada, só que mais barata? Isso não resolve, doutor." }
            ],
            feedback: { acerto: "ruim", titulo: "Meio-termo que ninguém pediu",
              texto: "O abatimento proporcional é uma das opções legais — mas, de novo, a escolha é do CONSUMIDOR, e ele pediu a restituição. Impor o abatimento como 'meio-termo' mantém Seu José com um produto que não funciona, apenas mais barato: não soluciona o vício e desrespeita a opção que a lei lhe assegura. Conciliação é construir acordo livre, não arbitrar uma terceira via não querida." },
            proxima: "fim_ruim" }
        ]
      }
    },

    fim_otimo: {
      falas: [
        { quem: "narrador", texto: "Seu José dobra a nota fiscal — agora com sossego — e aperta a mão de Rochelle na saída. A restituição cai em 15 dias; a próxima geladeira ele escolhe a dedo." }
      ],
      fim: {
        titulo: "O CONSUMIDOR NO COMANDO",
        selo: "otimo",
        texto: "A loja respondeu — porque a solidariedade do art. 18 não se terceiriza para a fábrica — e, vencido o prazo de reparo, prevaleceu a escolha de quem pagou: restituição corrigida. O Juizado fez o que o CDC promete: equilibrar a relação de consumo devolvendo poder a quem é vulnerável, sem inventar 'meios-termos' que ninguém pediu."
      }
    },

    fim_ruim: {
      falas: [
        { quem: "narrador", texto: "A sentença sai — mas não foi a solução que Seu José escolheu. Ele assina contrariado, sabendo que ainda terá trabalho pela frente." }
      ],
      fim: {
        titulo: "SOLUÇÃO DO JUIZ, NÃO DO CONSUMIDOR",
        selo: "ruim",
        texto: "A responsabilidade foi reconhecida — isso estava certo. Mas a tríplice opção do art. 18, §1º é do consumidor, e a sentença a substituiu pela conveniência do fornecedor ou por um meio-termo. Seu José pediu a restituição e recebeu outra coisa: tecnicamente discutível e, sobretudo, alheio ao que a lei pôs nas mãos dele."
      }
    },

    fim_grave: {
      falas: [
        { quem: "narrador", texto: "Extinto o processo contra a loja, Seu José sai sem solução, com a missão de 'procurar a fábrica' — em outro estado, por conta própria." }
      ],
      fim: {
        titulo: "MANDADO PARA A FÁBRICA",
        selo: "grave",
        texto: "A loja é parte legítima: o art. 18 do CDC impõe responsabilidade SOLIDÁRIA por vício a toda a cadeia de fornecimento. Extinguir contra ela transferiu ao consumidor o ônus de caçar o fabricante e contrariou texto expresso de lei. A reforma na Turma Recursal é questão de tempo — o prejuízo de Seu José, já é certo."
      }
    }
  }
});
