/* ============================================================
   CASO: PLANTÃO — "A medida da meia-noite"
   ------------------------------------------------------------
   23h40. A delegacia encaminha ao plantão expediente de
   medidas protetivas: Eunice, costureira, 41 anos, foi
   ameaçada de morte com uma faca pelo companheiro embriagado,
   na frente do filho de 9 anos. Ela está na sala de espera
   COM o menino, sem ter para onde ir — a casa é dele. Não há
   laudo. Há o boletim, as fotos do telefone quebrado, a
   palavra dela. A Lei 11.340/2006 foi desenhada para esta
   hora: deferir inaudita altera pars, com cognição sumária —
   e fazer a decisão chegar à rua antes do amanhecer.

   Fundamentos centrais: Lei 11.340/2006, arts. 12-C, 18, 19,
   §1º, 22, 23 e 24-A; Formulário Nacional de Avaliação de
   Risco — FRIDA (Res. CNJ 284/2019 e Lei 14.149/2021);
   especial relevância da palavra da vítima (STJ, pacífico).
   Fecha o arco aberto no Dia 1 (caso "protetiva"): lá, a
   retratação em audiência; aqui, o deferimento na urgência.
   ============================================================ */

window.TOGA = window.TOGA || {};
TOGA.casos = TOGA.casos || [];

TOGA.casos.push({
  id: "madrugada",
  titulo: "Plantão — A medida da meia-noite",
  subtitulo: "“Se você dormir, não acorda.” Não há laudo. Há a palavra dela — e a noite inteira pela frente.",
  area: "Plantão Judiciário — Violência Doméstica",
  hora: "23:40",
  duracaoPrevistaMin: 35,
  tensao: 10,

  personagens: [
    { id: "eunice", nome: "Eunice", papel: "Requerente", assento: "centro",
      avatar: { pele: "#c98e66", cabelo: "coque", corCabelo: "#2c1c10", traje: "camisa", corTraje: "#6a5a7a" } },
    { id: "dalva", nome: "Dra. Dalva", papel: "Delegada", assento: "esq1",
      avatar: { pele: "#8a5a3a", cabelo: "coque", corCabelo: "#1d1209", traje: "blazer", corTraje: "#33424f", corBlusa: "#e8e2d2" } },
    { id: "pilar", nome: "Dra. Pilar", papel: "Promotora", assento: "esq2",
      avatar: { pele: "#e8c39a", cabelo: "longo", corCabelo: "#3a2a1a", traje: "blazer", corTraje: "#2b3340", corBlusa: "#efe5c8", oculos: true } },
    { id: "ramos", nome: "Dr. Ramos", papel: "Defensor Público", assento: "dir1",
      avatar: { pele: "#d8a87f", cabelo: "curto", corCabelo: "#241a10", traje: "terno", corTraje: "#2f4a3e", corGravata: "#33424f", barba: true } }
  ],

  autos: {
    resumo: "Expediente de medidas protetivas de urgência (Lei 11.340/2006, art. 12, III) encaminhado pela delegacia ao plantão judiciário às 23h40. Eunice, 41 anos, costureira, registrou ocorrência nesta noite: o companheiro, Valdo, embriagado, quebrou o telefone dela, ameaçou-a com uma faca na frente do filho de 9 anos e disse que, se ela dormisse, não acordaria. Ela aguarda na sala de espera com a criança — a casa é dele. Não há laudo pericial. A autoridade policial representou pelo afastamento do agressor do lar e pela proibição de aproximação. O agressor não foi intimado: o pedido é de deferimento inaudita altera pars.",
    pecas: [
      { id: "bo", titulo: "Boletim de Ocorrência",
        texto: "Nesta data, por volta das 22h10, compareceu a esta Delegacia EUNICE, 41 anos, costureira, relatando que, momentos antes, na residência do casal, o companheiro VALDO, em visível estado de embriaguez, quebrou o aparelho celular da declarante arremessando-o contra a parede, apanhou uma faca de cozinha e a apontou contra a comunicante, na presença do filho do casal, de 9 anos, dizendo: “se você dormir, não acorda”. A comunicante deixou o imóvel somente com os documentos e a criança e permanece na sala de espera desta unidade, sem local para pernoite — o imóvel pertence ao autor. Juntam-se fotografias do aparelho celular destruído." },
      { id: "termo", titulo: "Termo de Declarações de Eunice",
        texto: "QUE convive maritalmente com VALDO há 11 anos; QUE ele bebe e as ameaças vêm aumentando de gravidade nos últimos meses; QUE nesta noite ele quebrou o telefone da declarante “para eu não chamar ninguém”; QUE em seguida apanhou a faca da pia da cozinha e a apontou contra a declarante, na frente do filho de 9 anos, dizendo “se você dormir, não acorda”; QUE a casa é do companheiro e a declarante não tem para onde ir com o filho; QUE trabalha como costureira e a renda não permite alugar nada de imediato; QUE há dois anos registrou ocorrência semelhante e voltou atrás, “porque ele chorou e prometeu”; QUE desta vez afirma: “dessa vez eu não volto atrás, doutor. Nem que eu durma na rua”." },
      { id: "repr", titulo: "Representação da Autoridade Policial",
        texto: "A autoridade policial signatária, com fundamento no art. 12, III, da Lei 11.340/2006, REPRESENTA pela concessão de medidas protetivas de urgência em favor da ofendida: (i) afastamento do agressor do lar, domicílio ou local de convivência com a ofendida (art. 22, II); (ii) proibição de aproximação da ofendida e do filho, com fixação de limite mínimo de distância, e proibição de contato por qualquer meio de comunicação (art. 22, III, “a” e “b”). Registra-se que a vítima permanece nesta unidade com a criança, sem local seguro para pernoite, e que os exames periciais não foram concluídos nesta madrugada — o que, à luz do risco relatado, não deve obstar a apreciação imediata." },
      { id: "antecedentes", titulo: "Certidão de Antecedentes (Valdo)",
        texto: "Certifico que, em desfavor de VALDO, consta: ocorrência de AMEAÇA contra a mesma vítima, registrada há 2 anos, com medida protetiva à época deferida e posteriormente revogada, tendo o feito sido arquivado após retratação da vítima, na forma do art. 16 da Lei 11.340/2006. Nada mais consta." }
    ]
  },

  focos: [
    { id: "f_palavra", rotulo: "A palavra de Eunice", dica: "Em violência doméstica, a palavra da vítima tem especial relevância (STJ). Leia o que ela disse — palavra por palavra.",
      grifos: [{ peca: "termo", trecho: "se você dormir, não acorda" },
               { peca: "termo", trecho: "dessa vez eu não volto atrás" }] },
    { id: "f_risco", rotulo: "Os marcadores de risco", dica: "Telefone quebrado para isolar, uma retratação antiga, escalada das ameaças: o ciclo da violência tem assinatura.",
      grifos: [{ peca: "bo", trecho: "quebrou o aparelho celular da declarante" },
               { peca: "antecedentes", trecho: "arquivado após retratação da vítima" }] },
    { id: "f_art22", rotulo: "O pedido da delegada", dica: "A representação pede medidas específicas. O art. 22 da Lei Maria da Penha tem o cardápio completo — inclusive a arma.",
      grifos: [{ peca: "repr", trecho: "afastamento do agressor do lar, domicílio ou local de convivência com a ofendida" },
               { peca: "repr", trecho: "proibição de aproximação da ofendida e do filho" }] },
    { id: "f_filho", rotulo: "O menino de nove anos", dica: "A faca foi apontada na frente da criança. A proteção do art. 22, III, “a”, alcança também os familiares da ofendida.",
      grifos: [{ peca: "bo", trecho: "na presença do filho do casal, de 9 anos" }] }
  ],

  /* ---------- arco emocional ---------- */
  arco: {
    antes: { emocao: "medo", gesto: "angustia" },
    depois: [
      { se: function (f) { return f.protegidaMadrugada && f.cumprimentoImediato; }, tom: "bom", gesto: "abraco",
        falas: [
          { quem: "eunice", emocao: "choro", texto: "Doutor... o policial me entregou a cópia na mão, ainda de madrugada. Eu dormi com ela na mesinha de cabeceira. A casa estava em silêncio — mas era um silêncio bom, sabe? De manhã eu levei o menino na escola." },
          { quem: "ramos", emocao: "feliz", texto: "A patrulha já passou lá duas vezes, Excelência. E Valdo assinou a ciência do art. 24-A: ele sabe que voltar é crime. A medida da meia-noite valeu a noite inteira." }
        ] },
      { se: function (f) { return f.protegidaMadrugada && !f.cumprimentoImediato; }, tom: "neutro",
        falas: [
          { quem: "eunice", emocao: "triste", texto: "A medida saiu, doutor, e eu agradeço. Mas eu passei a noite contando barulho de carro na rua. Papel guardado não tranca porta." }
        ] },
      { se: function (f) { return !!f.riscoMadrugada; }, tom: "grave",
        falas: [
          { quem: "dalva", emocao: "raiva", texto: "Excelência, o telefone da delegacia tocou de novo às 4h12. Mesma rua, mesma casa. Desta vez foi a vizinha quem ligou — Eunice estava sem telefone para pedir socorro. Ele quebrou justamente para isso." }
        ] }
    ]
  },

  vidasTocadas: [
    { se: function (f) { return f.protegidaMadrugada && f.cumprimentoImediato; }, tom: "bom",
      texto: "Eunice dormiu em casa com a porta segura e a cópia da medida na mesinha de cabeceira. De manhã, o filho foi para a escola." },
    { se: "redeAcionada", tom: "bom",
      texto: "O CREAS recebeu o ofício ainda de madrugada; a Patrulha Maria da Penha incluiu o endereço na ronda do dia seguinte." },
    { se: "riscoMadrugada", tom: "grave",
      texto: "A noite ficou em aberto. Às 4h12, o telefone do plantão policial tocou de novo — mesma rua, mesma casa, agora com viatura e perícia." },
    { se: "protetivaNegadaPlantao", tom: "grave",
      texto: "Eunice levou para o banco da delegacia, junto com o filho adormecido, a notícia de que faltava 'prova'. A faca continuou na pia da casa dele." }
  ],

  inicio: "p1",
  cenas: {

    /* ---------- ABERTURA: O EXPEDIENTE DA NOITE ---------- */
    p1: {
      falas: [
        { quem: "narrador", texto: "23h40. No fórum, só a sala do plantão tem luz acesa. A Dra. Dalva entra com o expediente debaixo do braço; atrás dela, Eunice, com o filho de nove anos adormecido no colo. Ela o deita no banco da sala de espera, cobre-o com o próprio casaco e entra — sem tirar os olhos da porta." },
        { quem: "dalva", emocao: "firme", texto: "Excelência, vim trazer pessoalmente. Ocorrência registrada às 22h10: faca apontada, ameaça de morte na frente da criança, telefone destruído. Representei pelo afastamento do lar e pela proibição de aproximação. Não há laudo — a perícia só assume às 8h. Mas o risco não assina ponto." },
        { quem: "ramos", emocao: "firme", texto: "A Defensoria Pública assiste a ofendida, Excelência, na forma dos arts. 27 e 28 da Lei Maria da Penha. Registro o essencial: ela não tem para onde ir. A casa é do agressor — e ele está nela, agora, com a faca na pia." },
        { quem: "pilar", emocao: "neutro", texto: "O Ministério Público está presente e consigna: o art. 19, §1º, dispensa a nossa manifestação prévia para o deferimento. Mas, para que conste em ata desde já — opinamos pela proteção." },
        { quem: "eunice", emocao: "medo", texto: "Doutor... eu sei que da outra vez eu voltei atrás. Dessa vez não. Dessa vez eu não volto atrás. Nem que eu durma na rua com o menino." }
      ],
      decisao: {
        prompt: "O expediente está na sua mesa. Não há laudo. É meia-noite menos vinte. Por onde começa?",
        opcoes: [
          { rotulo: "Designar audiência de justificação prévia, intimando Valdo para ser ouvido antes de qualquer decisão",
            fundamento: "Contraditório prévio (CPC, art. 9º)",
            efeitos: { tec: -10, hum: -10, imp: -4, tempo: 6 },
            carimbo: "JUSTIFICAÇÃO DESIGNADA",
            setFlags: { justificacaoPrevia: true, riscoMadrugada: true },
            reacoes: [
              { quem: "dalva", emocao: "raiva", texto: "Excelência, intimar Valdo esta noite é avisá-lo de que ela está na delegacia — e dar a ele a madrugada inteira de vantagem." },
              { quem: "eunice", emocao: "medo", texto: "Ele vai saber que eu vim aqui?... Doutor, ele falou que se eu dormir eu não acordo." },
              { quem: "ramos", emocao: "raiva", texto: "A Defensoria consigna o protesto: a lei dispensa expressamente a oitiva prévia. A audiência designada é o próprio risco com hora marcada." }
            ],
            feedback: { acerto: "grave", titulo: "O aviso ao agressor",
              texto: "A Lei 11.340/2006 é expressa: as medidas protetivas podem ser concedidas <b>de imediato, independentemente de audiência das partes e de manifestação do Ministério Público</b> (art. 19, §1º). O contraditório existe — mas é diferido: Valdo será intimado DA medida, e poderá impugná-la depois. Designar justificação prévia inverte a lógica protetiva: informa o agressor de que há um pedido contra ele, revela onde a vítima está e lhe entrega exatamente o tempo e a noite que ela veio pedir para não enfrentar sozinha. Em risco atual ou iminente, o art. 12-C (Lei 13.827/2019) manda afastar imediatamente — não agendar." },
            proxima: "fim_grave" },

          { rotulo: "Indeferir o pedido por ausência de laudo pericial e fragilidade probatória, ressalvando reapreciação quando instruído",
            fundamento: "Livre convencimento motivado; cautela probatória",
            efeitos: { tec: -10, hum: -12, imp: -6, tempo: 5 },
            carimbo: "PEDIDO INDEFERIDO",
            setFlags: { protetivaNegadaPlantao: true, riscoMadrugada: true },
            reacoes: [
              { quem: "eunice", emocao: "choro", texto: "Falta prova?... A prova ia ser o quê, doutor? Eu amanhecer morta?" },
              { quem: "ramos", emocao: "raiva", texto: "A cognição aqui é sumária, Excelência. Boletim, fotografias, antecedente e a palavra dela — que o STJ manda levar a sério. A Defensoria recorrerá ainda nesta madrugada." },
              { quem: "dalva", emocao: "triste", texto: "Vou levá-la de volta para o banco da sala de espera, então. É o único endereço seguro que sobrou para ela." }
            ],
            feedback: { acerto: "grave", titulo: "O laudo que a madrugada não tem",
              texto: "A cognição das medidas protetivas é <b>sumária</b>: exige verossimilhança e risco, não prova plena — o juízo de certeza pertence ao processo penal, que virá depois. A palavra da vítima tem <b>especial relevância</b> em contexto de violência doméstica (jurisprudência pacífica do STJ), e aqui ela não vem sozinha: boletim de ocorrência, fotografias do telefone destruído e um antecedente arquivado por retratação — o desenho clássico do ciclo da violência. O prazo de 48h do art. 18 é teto, não licença para esperar o expediente. Exigir laudo pericial à meia-noite é indeferir a urgência por ela ser urgente." },
            proxima: "fim_grave" },

          { rotulo: "Aplicar AGORA o Formulário Nacional de Avaliação de Risco e ouvir Eunice, mesmo à meia-noite, antes de decidir",
            fundamento: "FRIDA — Res. CNJ 284/2019 e Lei 14.149/2021; Lei 11.340/2006, art. 19, §1º",
            efeitos: { tec: 8, hum: 7, tempo: 9 },
            carimbo: "RISCO AVALIADO",
            setFlags: { fridaAplicado: true, ouviuEunice: true },
            reacoes: [
              { quem: "eunice", emocao: "choro", texto: "Ele quebrou meu telefone primeiro, doutor. Primeiro o telefone, depois a faca. Foi pra eu não ter como chamar ninguém. Aí ele disse... ele disse que se eu dormir, eu não acordo." },
              { quem: "pilar", emocao: "firme", texto: "Consigno, Excelência: ameaça de morte, arma branca, escalada, embriaguez, criança presente e retratação anterior. O formulário não tem coluna vazia." },
              { quem: "ramos", emocao: "neutro", texto: "A Defensoria registra: a escuta qualificada desta meia-noite já vale mais que muitos laudos, Excelência." }
            ],
            feedback: { acerto: "otimo", titulo: "A pergunta certa à meia-noite",
              texto: "O Formulário Nacional de Avaliação de Risco — FRIDA (Res. CNJ 284/2019; Lei 14.149/2021) — existe exatamente para isto: transformar o relato em <b>marcadores objetivos</b> de risco (arma, ameaça de morte, escalada, isolamento, criança presente, tentativa anterior interrompida por retratação). Aplicá-lo agora não atrasa a decisão — <b>fundamenta-a</b>. E o que Eunice diz tem peso jurídico próprio: a palavra da vítima possui especial relevância nos contextos de violência doméstica (STJ, pacífico). A cognição sumária do art. 19, §1º, pede precisamente isso: indícios sérios e risco descrito — ambos agora documentados." },
            proxima: "p2" }
        ]
      }
    },

    /* ---------- O CONTEÚDO DAS MEDIDAS ---------- */
    p2: {
      falas: [
        { quem: "narrador", texto: "O formulário preenchido fica sobre a mesa como um mapa: nenhum campo de risco em branco. Pela porta entreaberta, vê-se o menino dormindo no banco, o casaco da mãe pelos ombros." },
        { quem: "eunice", emocao: "medo", texto: "Tem uma coisa que eu nunca contei pra ninguém, doutor. Ele anda com a faca no carro, às vezes. E tem um facão da obra, no quartinho dos fundos." },
        { quem: "pilar", emocao: "firme", texto: "O Ministério Público requer o pacote integral do art. 22, Excelência: afastamento do lar, distância mínima, proibição de contato — e atenção ao inciso I: armas." },
        { quem: "dalva", emocao: "neutro", texto: "A representação está nos autos, Excelência. O que a senhora deferir agora, a viatura cumpre ainda esta noite." }
      ],
      decisao: {
        prompt: "A cognição é sumária; o risco, concreto e descrito. O que a decisão DEFERE?",
        opcoes: [
          { rotulo: "Determinar apenas rondas periódicas da Patrulha Maria da Penha no endereço do casal",
            fundamento: "Poder geral de cautela; vigilância preventiva",
            efeitos: { tec: -6, hum: -8, tempo: 4 },
            carimbo: "RONDAS DETERMINADAS",
            setFlags: { medidasFracas: true },
            reacoes: [
              { quem: "eunice", emocao: "medo", texto: "Rondas?... Mas ele fica DENTRO de casa, doutor. A viatura passa na rua e ele do lado de dentro, comigo?" },
              { quem: "ramos", emocao: "raiva", texto: "Com respeito, Excelência: ronda vigia calçada. A representação pediu afastamento do lar — e o risco está na cozinha, não na esquina." }
            ],
            feedback: { acerto: "ruim", titulo: "A viatura que passa; a faca que fica",
              texto: "Rondas vigiam a rua — não a casa. Com essa medida, Valdo continua dormindo sob o mesmo teto, com a faca na pia e o facão no quartinho, e Eunice continua sem poder voltar. O formulário de risco apontou ameaça de morte com arma branca: a resposta <b>proporcional</b> está no art. 22, II e III, da Lei 11.340/2006 — afastamento e distância. Medida protetiva que não altera a geografia do risco é paisagem jurídica." },
            proxima: "p3" },

          { rotulo: "Deferir: afastamento de Valdo do lar, proibição de aproximação a menos de 300 metros de Eunice e do filho, proibição de contato por qualquer meio e suspensão de eventual posse de armas — fundamentando no risco concreto descrito no formulário",
            fundamento: "Lei 11.340/2006, arts. 22, I, II e III, “a” e “b”, e 12-C",
            requerFoco: "f_art22",
            efeitos: { tec: 9, hum: 8, tempo: 8 },
            carimbo: "MPU DEFERIDA",
            setFlags: { afastamentoDeferido: true, pacoteCompleto: true },
            reacoes: [
              { quem: "eunice", emocao: "surpresa", texto: "Ele que sai?... Eu vim aqui achando que quem ia ficar sem casa era eu." },
              { quem: "pilar", emocao: "feliz", texto: "Fundamentação ancorada no risco concreto, item por item do formulário. Nada a aditar, Excelência." },
              { quem: "dalva", emocao: "firme", texto: "Recebido. Aproximação a menos de trezentos metros, contato por qualquer meio: tudo descrito. A equipe sabe o que fazer com isso." }
            ],
            feedback: { acerto: "otimo", titulo: "O pacote que o risco pede",
              texto: "Art. 22 aplicado na medida exata do caso: <b>afastamento do lar</b> (inciso II), <b>proibição de aproximação</b> com limite mínimo de distância — alcançando também o filho, pois a norma protege os familiares (III, “a”) —, <b>proibição de contato por qualquer meio</b> (III, “b”) e <b>suspensão de posse/restrição de porte de armas</b> (inciso I). E a fundamentação ancorada nos marcadores concretos — faca, ameaça de morte, escalada, criança presente — em vez de fórmulas genéricas é o que blinda a decisão contra impugnação. O art. 12-C completa: em risco atual ou iminente, o afastamento é imediato." },
            proxima: "p3" },

          { rotulo: "Deferir o afastamento do lar, mas SEM proibição de contato — “para não inviabilizar o diálogo sobre o filho”",
            fundamento: "Lei 11.340/2006, art. 22, II; preservação do vínculo parental",
            efeitos: { tec: -4, hum: -5, tempo: 5 },
            carimbo: "AFASTAMENTO PARCIAL",
            setFlags: { afastamentoDeferido: true, contatoLivre: true },
            reacoes: [
              { quem: "ramos", emocao: "firme", texto: "Excelência, o histórico destes autos mostra como termina o 'diálogo': uma retratação há dois anos e a ameaça de hoje. O telefone é a porta dos fundos da medida." },
              { quem: "eunice", emocao: "triste", texto: "Ele vai ligar, doutor. Ele sempre liga. Primeiro chorando... depois do outro jeito." }
            ],
            feedback: { acerto: "ruim", titulo: "O canal aberto da pressão",
              texto: "O contato é precisamente o instrumento da próxima fase do ciclo: o pedido de desculpas, a promessa, a cobrança pela retratação — o antecedente destes autos (arquivado após retratação) mostra exatamente como isso termina. Por isso o art. 22, III, “b”, proíbe contato <b>por qualquer meio de comunicação</b>: a violência psicológica não precisa de presença física. Questões sobre o filho, se necessárias, tramitam por intermédio do juízo, da Defensoria ou de terceiros — não pela linha direta entre o agressor e a vítima." },
            proxima: "p3" }
        ]
      }
    },

    /* ---------- ONDE ELES DORMEM HOJE ---------- */
    p3: {
      falas: [
        { quem: "narrador", texto: "00h10. As medidas tomam forma na minuta. Mas Eunice olha para a porta da sala de espera, onde o filho dorme — e a pergunta que ela não faz ocupa a sala inteira: e hoje?" },
        { quem: "eunice", emocao: "vergonha", texto: "Doutor... eu posso dormir no banco ali fora com ele? Só essa noite. Amanhã eu dou um jeito, eu juro." },
        { quem: "ramos", emocao: "firme", texto: "Excelência, a Defensoria requer expressamente: recondução da ofendida e do filho ao domicílio após o afastamento do agressor — ou abrigamento, se ela preferir —, e alimentos provisórios, na forma do art. 22, V. Ela não pode sair daqui com a medida na mão e a rua como endereço." }
      ],
      decisao: {
        prompt: "A medida afasta Valdo. Mas Eunice e o menino têm onde dormir HOJE?",
        opcoes: [
          { rotulo: "Recomendar que Eunice passe esta noite na casa de parentes e procure o CRAS pela manhã",
            fundamento: "Orientação à jurisdicionada",
            efeitos: { hum: -5, tempo: 3 },
            carimbo: "ORIENTAÇÃO VERBAL",
            reacoes: [
              { quem: "eunice", emocao: "triste", texto: "Parente, doutor?... Minha mãe morreu faz três anos. Era ela que eu tinha." },
              { quem: "ramos", emocao: "raiva", texto: "Está no termo de declarações, Excelência: 'não tem para onde ir'. A recomendação acabou de despejar a vítima." }
            ],
            feedback: { acerto: "ruim", titulo: "A solução que despeja a vítima",
              texto: "Recomendar que a vítima 'se vire' consagra a inversão que a Lei Maria da Penha veio corrigir: quem agrediu fica em casa; quem foi ameaçada perambula. A lei tem resposta expressa e à mão: <b>recondução da ofendida e de seus dependentes ao respectivo domicílio, após afastamento do agressor</b> (art. 23, II). E os autos avisavam: o termo de declarações registra que ela não tem para onde ir. Boa vontade verbal não substitui o dispositivo que existe exatamente para esta cena." },
            proxima: "p4" },

          { rotulo: "Nada a prover sobre moradia: é questão social, não jurisdicional — o plantão decide medidas, não hospedagem",
            fundamento: "Limites objetivos da jurisdição de plantão",
            efeitos: { tec: -6, hum: -10, tempo: 3 },
            carimbo: "NADA A PROVER",
            setFlags: { semTeto: true },
            reacoes: [
              { quem: "eunice", emocao: "choro", texto: "Então a medida diz que ele não pode chegar perto de mim... mas não diz onde eu durmo?" },
              { quem: "dalva", emocao: "triste", texto: "Volto a registrar, Excelência: a sala de espera da delegacia não é abrigo. Mas é para lá que ela volta, se nada for provido." }
            ],
            feedback: { acerto: "grave", titulo: "A jurisdição que termina na porta",
              texto: "O art. 23 da Lei 11.340/2006 é <b>jurisdição</b>, não assistencialismo: encaminhar a ofendida e os dependentes a programa de proteção ou atendimento (I), <b>reconduzi-los ao domicílio após o afastamento do agressor</b> (II), e fixar alimentos provisórios (art. 22, V). Dizer 'questão social' a uma mulher que vai dormir no banco da delegacia com o filho no colo é deferir a medida e negar a proteção. A Lei Maria da Penha foi desenhada para integrar Justiça e rede — e o juiz é a porta de entrada, não o porteiro que aponta a saída." },
            proxima: "p4" },

          { rotulo: "Determinar: recondução de Eunice e do filho ao lar, com escolta policial, após o cumprimento do afastamento — ou abrigamento provisório, se ela preferir —, com comunicação ao CREAS e à Patrulha Maria da Penha e alimentos provisórios, como requerido",
            fundamento: "Lei 11.340/2006, arts. 23, I e II, e 22, V",
            efeitos: { tec: 7, hum: 10, cel: -2, tempo: 8 },
            carimbo: "LAR ASSEGURADO",
            setFlags: { teto: true, redeAcionada: true },
            reacoes: [
              { quem: "eunice", emocao: "choro", texto: "Eu posso... eu posso escolher voltar pra minha casa? Com o menino? E a cama dele, o material da escola... está tudo lá, doutor." },
              { quem: "ramos", emocao: "feliz", texto: "A escolha é dela, Excelência — e a decisão garantiu as duas portas. É exatamente o desenho do art. 23." },
              { quem: "dalva", emocao: "firme", texto: "Escolta confirmada. Cumprido o afastamento, a mesma viatura a leva para casa. O CREAS recebe o ofício por e-mail funcional ainda nesta madrugada." }
            ],
            feedback: { acerto: "otimo", titulo: "Teto, rede e o dia seguinte",
              texto: "Decisão completa: <b>recondução ao domicílio com escolta, após o afastamento do agressor</b> (art. 23, II), <b>abrigamento pela rede se ela preferir</b> (art. 23, I), <b>alimentos provisórios</b> requeridos pela Defensoria (art. 22, V) e comunicação ao CREAS e à Patrulha Maria da Penha. O detalhe decisivo: a escolha entre voltar para casa ou abrigar-se é <b>dela</b> — a decisão judicial abre as duas portas em vez de empurrá-la por uma. Proteção que não resolve a noite de hoje é promessa; esta resolveu." },
            proxima: "p4" }
        ]
      }
    },

    /* ---------- A EFETIVIDADE NA MADRUGADA ---------- */
    p4: {
      falas: [
        { quem: "narrador", texto: "00h20. A decisão está assinada. Resta a pergunta que separa o papel da proteção: quando ela passa a existir no mundo — agora, ou no expediente?" },
        { quem: "dalva", emocao: "firme", texto: "A viatura está na porta do fórum, Excelência. Se a ordem sair agora, o afastamento se cumpre ainda esta noite — e Valdo assina a ciência diante da equipe." },
        { quem: "pilar", emocao: "neutro", texto: "O Ministério Público lembra: o descumprimento de medida protetiva é crime autônomo, art. 24-A. Mas só prende quem foi cientificado do que descumpre." }
      ],
      decisao: {
        prompt: "A decisão existe no papel. Como ela chega à rua?",
        opcoes: [
          { rotulo: "Expeça-se mandado, para cumprimento pelo oficial de justiça no próximo dia útil, na forma ordinária",
            fundamento: "Rotina cartorária; CPC, art. 212",
            efeitos: { tec: -10, hum: -12, imp: -6, tempo: 3 },
            carimbo: "CUMPRIMENTO ADIADO",
            setFlags: { cumprimentoTardio: true, riscoMadrugada: true },
            reacoes: [
              { quem: "dalva", emocao: "raiva", texto: "Próximo dia útil, Excelência?... A ameaça era para esta noite. Eu trouxe o expediente a esta hora exatamente por isso." },
              { quem: "ramos", emocao: "raiva", texto: "A Defensoria consigna: medida protetiva com eficácia adiada é indeferimento com outro nome. Peticionaremos ainda nesta madrugada." }
            ],
            feedback: { acerto: "grave", titulo: "A medida que chega depois do risco",
              texto: "A ameaça era “se você dormir, não acorda” — e o mandado dormiria no escaninho até segunda. A medida protetiva tem eficácia <b>imediata</b> (art. 19, §1º) e pode — deve — ser cumprida pelo plantão policial, que está na porta, de viatura ligada. Cumprimento diferido para o expediente equivale, na noite mais perigosa (que é esta), a indeferimento prático: a decisão certa que não chega a tempo protege tanto quanto a decisão que não existe." },
            proxima: "fim_grave" },

          { rotulo: "Determinar o cumprimento IMEDIATO pelo plantão policial, com ciência expressa a Valdo de que descumprir é crime (art. 24-A), intimação de Eunice com cópia da decisão em mãos e ofício à Patrulha Maria da Penha",
            fundamento: "Lei 11.340/2006, arts. 19, §1º, e 24-A; cumprimento pelo plantão policial",
            efeitos: { tec: 8, hum: 8, cel: 2, tempo: 6 },
            carimbo: "CUMPRA-SE IMEDIATO",
            setFlags: { cumprimentoImediato: true },
            reacoes: [
              { quem: "dalva", emocao: "feliz", texto: "Recebido na íntegra, Excelência. A equipe sai agora. Em uma hora, Valdo está fora da casa, cientificado por escrito — e ela, dentro." },
              { quem: "eunice", emocao: "surpresa", texto: "Eu vou ficar com uma cópia? Minha mesmo, pra mostrar se precisar?... Então essa noite eu durmo. Acho que essa noite eu durmo, doutor." },
              { quem: "pilar", emocao: "feliz", texto: "Com a ciência expressa do 24-A, qualquer descumprimento desta madrugada já nasce flagrante, Excelência. A medida saiu daqui com dentes." }
            ],
            feedback: { acerto: "otimo", titulo: "A decisão que vira realidade antes do amanhecer",
              texto: "Efetividade se constrói com quatro peças, e a decisão reuniu todas: <b>cumprimento imediato pelo plantão policial</b> (a eficácia do art. 19, §1º, levada a sério); <b>ciência expressa do art. 24-A</b> — descumprir medida protetiva é crime autônomo, hoje punido com reclusão de 2 a 5 anos (Lei 14.994/2024), com prisão em flagrante possível; <b>cópia da decisão em mãos da vítima</b>, para que ela saiba — e possa mostrar à viatura — o que a protege; e <b>ofício à Patrulha Maria da Penha</b>, para que alguém volte lá amanhã. É a diferença entre deferir uma medida e entregar uma proteção." },
            proxima: function (f) { return (f.pacoteCompleto && f.teto) ? "fim_otimo" : "fim_bom"; } },

          { rotulo: "Deferir o “cumpra-se” ao plantão policial, sem mais formalidades — ciência do art. 24-A, cópias e ofícios saem com o expediente de amanhã",
            fundamento: "Lei 11.340/2006, art. 19, §1º — eficácia imediata",
            efeitos: { tec: -2, hum: -3, cel: 3, tempo: 3 },
            carimbo: "CUMPRA-SE SIMPLES",
            setFlags: { cumprimentoIncompleto: true },
            reacoes: [
              { quem: "dalva", emocao: "neutro", texto: "A equipe cumpre o afastamento, Excelência. Mas sem o termo de ciência do 24-A, se ele voltar às 3h, a situação na porta fica... juridicamente nebulosa." },
              { quem: "ramos", emocao: "firme", texto: "E Eunice fica sem nada nas mãos até amanhã, Excelência. Se a viatura trocar de turno, a medida vira boato." }
            ],
            feedback: { acerto: "ruim", titulo: "Metade da eficácia",
              texto: "A ordem saiu — mas desarmada. Sem a <b>ciência expressa do art. 24-A</b>, o flagrante por descumprimento se fragiliza (só comete o crime quem sabe o que descumpre); sem a <b>cópia em mãos</b>, Eunice não tem o que mostrar à viatura às 3h da manhã; sem o <b>ofício à patrulha</b>, ninguém volta lá amanhã. Os 'expedientes formais' deixados para depois são, neste caso, a própria proteção: o afastamento desta noite vale exatamente o que durar a memória do plantão." },
            proxima: "fim_bom" }
        ]
      }
    },

    /* ---------- FINS ---------- */
    fim_otimo: {
      falas: [
        { quem: "narrador", texto: "01h05. A viatura sai na frente; atrás, o carro de apoio leva Eunice e o filho — o menino dorme no banco de trás sem saber que a noite mudou de dono. Valdo deixa a casa cientificado, por escrito, de que voltar é crime. Antes de apagar a luz do quarto, Eunice dobra a cópia da decisão e a deixa na mesinha de cabeceira, ao alcance da mão. Pela primeira vez em meses, ela dorme. De manhã, o menino vai à escola." }
      ],
      fim: {
        titulo: "A MEDIDA DA MEIA-NOITE",
        selo: "otimo",
        setFlags: { protegidaMadrugada: true, cumprimentoImediato: true },
        texto: "Trinta e cinco minutos de plantão, nenhuma audiência, nenhum laudo — e nenhuma ilegalidade: a Lei Maria da Penha foi desenhada exatamente para esta hora (arts. 12-C, 19, §1º, 22 e 23). A avaliação de risco fundamentou, o afastamento protegeu, a recondução devolveu a casa a quem nunca deveria tê-la perdido, e o cumprimento imediato transformou papel em porta segura. No Dia 1, uma audiência discutiu se a proteção devia cair; esta madrugada mostrou por que ela existe."
      }
    },

    fim_bom: {
      falas: [
        { quem: "narrador", texto: "00h40. A papelada do plantão se fecha. Alguma proteção saiu desta sala — mas com lacunas que a madrugada conhece bem. Na saída, Eunice pergunta ao Defensor, baixinho, o que fazer se ele aparecer. A resposta jurídica existe; o que falta é ela caber inteira nesta noite." }
      ],
      fim: {
        titulo: "PROTEGIDA PELA METADE",
        selo: "bom",
        setFlags: { protegidaMadrugada: true },
        texto: "A medida foi deferida — e isso já coloca a noite do lado certo da Lei 11.340/2006: a cognição sumária funcionou e o agressor não ditou as regras. Mas proteção real é feita de detalhes executáveis: o conteúdo completo do art. 22, o teto do art. 23, a ciência do art. 24-A, a cópia na mão da vítima. O que ficou para o expediente de amanhã era exatamente o que a urgência pedia para hoje — e a diferença entre os dois é medida em horas de insônia."
      }
    },

    fim_grave: {
      falas: [
        { quem: "narrador", texto: "A luz da sala do plantão se apaga. O que quer que tenha sido assinado, nada muda esta noite: Valdo dorme na casa, com a faca na pia, e Eunice procura uma posição menos dura no banco da sala de espera, o filho no colo, o casaco servindo de cobertor. Às 4h12, o telefone do plantão policial toca. É a mesma rua. A mesma casa. Desta vez, quem ligou foi a vizinha — Eunice não tinha mais telefone." }
      ],
      fim: {
        titulo: "A NOITE EM ABERTO",
        selo: "grave",
        setFlags: { riscoMadrugada: true, manchaGrave: true },
        texto: "O expediente pedia uma resposta antes do amanhecer, e a lei a autorizava expressamente: deferimento imediato, sem oitiva das partes (art. 19, §1º), afastamento em risco atual ou iminente (art. 12-C). A cognição sumária tinha tudo de que precisava — a palavra da vítima, o boletim, as fotografias, o antecedente arquivado por retratação. Faltou usá-la a tempo. O telefone tocando às 4h12 é o som exato de uma medida que não foi — ou que ainda estava no escaninho quando o risco bateu na porta."
      }
    }
  }
});
