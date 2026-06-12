/* ============================================================
   CASO 5 — "Frajola contra Sansão"
   Juizado Especial Cível · pauta das 16:45
   ------------------------------------------------------------
   Temas: responsabilidade civil pelo fato do animal (CC, art.
   936) e suas DUAS únicas excludentes; instinto não é força
   maior; culpa concorrente da vítima (CC, art. 945); dano
   moral pela perda de animal de estimação (na esteira do
   REsp 1.713.167/SP: ser senciente, objeto de afeto);
   proporcionalidade das obrigações de fazer (CPC, arts. 8º e
   497) e a ironia simétrica: a autora pede liberdade para os
   seus gatos e cárcere para o cão alheio.
   ============================================================ */

window.TOGA = window.TOGA || {};
TOGA.casos = TOGA.casos || [];

TOGA.casos.push({
  id: "gatos",
  titulo: "Frajola contra Sansão",
  subtitulo: "Nove gatos com a rua inteira, um cão com dois minutos de calçada por dia — e um encontro de nove segundos que acabou em morte.",
  area: "Juizado Especial Cível",
  hora: "16:45",
  duracaoPrevistaMin: 60,
  tensao: 4,

  personagens: [
    { id: "iolanda", nome: "D. Iolanda", papel: "Autora", assento: "esq1",
      avatar: { pele: "#e8c49c", cabelo: "coque", corCabelo: "#b9b3a6", traje: "vestido", corTraje: "#5a6a7a", oculos: true } },
    { id: "edson", nome: "Edson", papel: "Réu", assento: "dir1",
      avatar: { pele: "#c98e66", cabelo: "curto", corCabelo: "#241a10", traje: "camisa", corTraje: "#4a5a3a", barba: true } },
    { id: "beto", nome: "Seu Beto", papel: "Informante", assento: "centro",
      avatar: { pele: "#d8a87f", cabelo: "calvo", corCabelo: "#8a8378", traje: "camisa", corTraje: "#6a5a4a", oculos: true } }
  ],

  autos: {
    resumo: "Iolanda, 63, cuida há 11 anos de gatos comunitários — nove atualmente, castrados e vacinados às suas custas, com livre acesso à casa dela por um portãozinho basculante. Frajola, o mais antigo (7 anos), foi morto na calçada por Sansão, o cão de Edson, no momento diário em que o portão se abre para o cão receber o dono. Ela pede R$ 10 mil de danos morais e o confinamento permanente do cão. Ele invoca o instinto — e os gatos no telhado.",
    pecas: [
      { id: "inicial", titulo: "Reclamação inicial (atermação)",
        texto: "IOLANDA narra: dedica-se há 11 anos aos gatos de rua do bairro; os nove atuais são castrados, vacinados e identificados, e transitam livremente entre a casa dela e a vizinhança. No dia 12 de maio, por volta das 19h, o cão SANSÃO saiu em disparada do imóvel do réu e matou FRAJOLA na calçada, à vista dela. Pede: (a) R$ 10.000,00 de danos morais; (b) que o réu seja obrigado a manter o cão PERMANENTEMENTE confinado no interior da residência, 'para que os gatos do bairro possam transitar em paz'. (Reduzida a termo — Lei 9.099/95, art. 14, §3º.)" },
      { id: "contestacao", titulo: "Contestação oral reduzida a termo",
        texto: "EDSON, motorista de aplicativo, sustenta: Sansão (SRD de porte grande, 5 anos) vive DENTRO de casa o dia inteiro, sozinho. A única 'soltura' é o ritual da chegada: quando Edson estaciona, por volta das 19h, abre o portão e o cão corre à calçada para recebê-lo — 'dois minutos, todo dia, há cinco anos, sem nunca ter acontecido nada'. No dia do fato, Frajola estava na calçada; Sansão avançou 'por instinto, porque cachorro é cachorro'; Edson se jogou sobre o cão e levou arranhões ao separar. Alega culpa exclusiva da vítima (gatos criados soltos) e força maior (instinto natural). Formula PEDIDO CONTRAPOSTO: que a autora seja obrigada a manter seus gatos fora do imóvel dele — junta fotos dos felinos no telhado e sobre o carro." },
      { id: "veterinario", titulo: "Prontuário veterinário e recibos",
        texto: "Prontuário de FRAJOLA na Clínica São Francisco: 7 anos de acompanhamento, castração, vacinação anual em dia, microchip registrado em nome de Iolanda. Causa mortis: traumatismo por mordedura. Recibos juntados: ração e areia, média de R$ 380,00/mês; castração de 23 animais ao longo dos anos, custeada pela autora. Declaração da veterinária: 'Frajola foi o primeiro resgatado da Sra. Iolanda e a acompanhava até dentro da clínica, no colo, sem caixa de transporte.'" },
      { id: "video", titulo: "Vídeo da câmera do vizinho",
        texto: "Capturas do vídeo da câmera de segurança de SEU BETO (vizinho fronteiriço, arrolado como informante): às 19h04, o portão do réu se abre; Sansão dispara em linha reta; o ataque na calçada dura NOVE SEGUNDOS; Edson aparece no quadro em seguida, puxando o cão pelo pescoço e caindo no asfalto. Em gravações de OUTRAS datas, fornecidas pelo mesmo vizinho a pedido do réu: gatos da autora caminhando no muro do réu, sobre o telhado e dormindo no capô do carro dele." },
      { id: "posturas", titulo: "Código de Posturas do Município",
        texto: "Cópia juntada PELA AUTORA, art. 86: 'É proibido conduzir ou deixar ANIMAL em via ou logradouro público sem guia ou contenção adequada, respondendo o proprietário ou detentor pelos danos que o animal causar.' Art. 87: 'Animais encontrados soltos em via pública poderão ser recolhidos pelo serviço municipal.' Nota da secretaria do Juizado: o dispositivo não distingue espécies." }
    ]
  },

  focos: [
    { id: "f_936", rotulo: "O art. 936 do Código Civil", dica: "O dono do animal responde — salvo DUAS excludentes, e só duas. 'Instinto' está entre elas?" },
    { id: "f_vinculo", rotulo: "Sete anos de Frajola", dica: "Prontuário, microchip, colo na clínica: o que separa dano moral indenizável de mero dissabor é PROVA de vínculo." },
    { id: "f_posturas", rotulo: "A pegadinha das posturas", dica: "A autora juntou o Código de Posturas contra o réu. Releia o art. 86: ele fala em 'animal' — de quem são os animais soltos na via?" },
    { id: "f_bemestar", rotulo: "Confinar resolve?", dica: "CF, art. 225, §1º, VII, veda crueldade. Pense no desenho de uma obrigação de fazer que proteja os gatos SEM torturar o cão (CPC, arts. 8º e 497)." }
  ],

  arco: {
    antes: { emocao: "triste", gesto: "angustia" },
    depois: [
      { se: function (f) { return !!f.pactoGatos; }, tom: "bom", gesto: "abraco",
        falas: [
          { quem: "iolanda", emocao: "feliz", texto: "Doutor, o Edson fixou a plaquinha do Frajola no muro ele mesmo — 'sete anos de muro'. E o Sansão na guia parece até outro cachorro. Levei sardinha pra ele. Pro cachorro, digo." },
          { quem: "edson", emocao: "feliz", texto: "Quem diria que a gente ia sair de um processo combinando horário de gato, Excelência. Mas funciona. Funciona." }
        ] },
      { se: function (f) { return !!f.confinamentoTotal; }, tom: "grave",
        falas: [
          { quem: "edson", emocao: "raiva", texto: "O Sansão uiva dia e noite, doutor — agora os MESMOS vizinhos do abaixo-assinado reclamam do uivo. A Sociedade Protetora protocolou contra a sua decisão. Confinaram o cachorro e o problema junto." }
        ] }
    ]
  },

  vidasTocadas: [
    { se: "pactoGatos", tom: "bom",
      texto: "O muro do Frajola ganhou uma plaquinha em forma de peixe — e o quintal, um tratado de paz que se cumpre sozinho." },
    { se: "confinamentoTotal", tom: "grave",
      texto: "O cão confinado uiva dia e noite. Os vizinhos trocaram o abaixo-assinado do barulho pelo do uivo." }
  ],

  inicio: "g1",
  cenas: {

    g1: {
      falas: [
        { quem: "narrador", texto: "16h45. Pela segunda vez no dia, a pauta late e mia. Sobre a mesa da autora, uma caixinha de papelão; dentro, uma coleira vermelha com plaquinha em forma de peixe." },
        { quem: "iolanda", emocao: "triste", texto: "Essa coleira eu comprei quando ele tinha um ano, doutor. Frajola. Sete anos comigo. Ele esperava eu acordar em cima do muro, todo dia, chovesse ou não." },
        { quem: "edson", emocao: "triste", texto: "Doutor, eu sinto muito, de verdade. Mas o Sansão não é bravo. Ele viu o gato e foi — instinto. Cachorro é cachorro. Ninguém manda na natureza." }
      ],
      decisao: {
        prompt: "Dois donos enlutados cada um à sua maneira, e uma tese de 'instinto' na mesa. Como você fixa as premissas?",
        opcoes: [
          { rotulo: "Antecipar o senso comum: 'gato criado solto na rua corre risco — quem deixa, assume'",
            fundamento: "Autocolocação em risco",
            efeitos: { tec: -6, hum: -8, tempo: 3 },
            carimbo: "RISCO ASSUMIDO",
            setFlags: { gatoFrieza: true },
            reacoes: [
              { quem: "iolanda", emocao: "choro", texto: "Então gato de rua pode morrer, é isso? Onze anos cuidando pra ouvir que a culpa é minha?" },
              { quem: "beto", emocao: "triste", texto: "Doutor, com licença... a senhora cuida é dos gatos que os OUTROS abandonam." }
            ],
            feedback: { acerto: "grave", titulo: "O atalho que inverte a lei",
              texto: "O art. 936 não contém uma excludente genérica de 'risco assumido': exige prova de CULPA DA VÍTIMA — comportamento concreto e causalmente decisivo, a ser demonstrado pelo réu, não presumido da bancada. Dizer 'quem deixa solto, assume' antes da instrução é antecipar julgamento contra a parte (a imparcialidade sente) e ainda errar o direito: no máximo se chegaria à culpa CONCORRENTE (CC, art. 945), que reduz — não exclui — a indenização." },
            proxima: "g2" },

          { rotulo: "Fixar a régua legal de saída: quem responde é o DONO, e a responsabilidade é objetiva — a discussão será sobre excludentes, extensão do dano e o desenho da convivência, não sobre 'culpa do cachorro'",
            fundamento: "CC, art. 936 — o dono ou detentor do animal ressarcirá o dano por este causado, se não provar culpa da vítima ou força maior",
            requerFoco: "f_936",
            efeitos: { tec: 10, tempo: 5 },
            carimbo: "PREMISSAS FIXADAS",
            setFlags: { enquadrouGatos: true },
            reacoes: [
              { quem: "edson", emocao: "surpresa", texto: "Então mesmo sem eu ter culpa... respondo?" },
              { quem: "iolanda", emocao: "neutro", texto: "Foi o que eu sempre disse: o cachorro é dele, o dever era dele." }
            ],
            feedback: { acerto: "otimo", titulo: "O fato do animal e o dever de guarda",
              texto: "O art. 936 do CC consagra responsabilidade OBJETIVA pelo fato do animal: o dono responde independentemente de culpa, e só se exonera provando <b>culpa da vítima</b> ou <b>força maior</b> — rol taxativo. Fixar isso de saída muda o eixo da audiência: ninguém vai julgar o caráter de Sansão, e sim o cumprimento do dever de guarda de Edson e o comportamento da própria vítima (que aqui é a DONA do gato, não o gato). É o enquadramento que organiza tudo o que vem." },
            proxima: "g2" },

          { rotulo: "Não enquadrar ainda: ouvir os dois e o informante antes de qualquer premissa",
            fundamento: "Prudência instrutória",
            efeitos: { tec: 3, hum: 3, tempo: 4 },
            carimbo: "INSTRUÇÃO ABERTA",
            feedback: { acerto: "bom", titulo: "Legítimo — mas a tese do 'instinto' fica viva",
              texto: "Ouvir antes de enquadrar é postura defensável. O custo é tático: sem a premissa do art. 936 fixada, Edson seguirá repetindo 'instinto, ninguém manda na natureza' como se fosse defesa — e a autora, achando que precisa provar 'maldade' do cão. Quem estudou o dispositivo pouparia meia audiência." },
            proxima: "g2" }
        ]
      }
    },

    g2: {
      falas: [
        { quem: "narrador", texto: "Seu Beto presta compromisso de dizer a verdade como informante. Conhece os dois há vinte anos; a câmera é dele." },
        { quem: "beto", emocao: "neutro", texto: "Foi rápido, doutor. O portão abriu, o Sansão saiu que nem flecha — nove segundos, contei no vídeo. O Edson se jogou em cima do cachorro, rolou no asfalto, ralou o braço todo. Não deu tempo de nada." },
        { quem: "edson", emocao: "raiva", texto: "Pergunta pra ele dos gatos, doutor! Pergunta de quem dorme no capô do MEU carro e usa meu telhado de passarela! Por que só o meu bicho tem que viver preso?" }
      ],
      decisao: {
        prompt: "O réu quer arrastar a instrução para os gatos no quintal dele. O fato é estranho à causa — ou é a outra metade dela?",
        opcoes: [
          { rotulo: "Cortar: 'os gatos não estão sendo julgados — quem matou foi o cachorro do senhor'",
            fundamento: "Delimitação do objeto ao fato da inicial",
            efeitos: { imp: -6, tec: -4, tempo: 3 },
            carimbo: "MATÉRIA EXCLUÍDA",
            reacoes: [
              { quem: "edson", emocao: "raiva", texto: "Então a regra só vale pra um lado? Bonito." }
            ],
            feedback: { acerto: "ruim", titulo: "Meia audiência para um conflito inteiro",
              texto: "Dupla falha: processual, porque a Lei 9.099 expressamente admite contestação oral com pedido contraposto na audiência (arts. 30 e 31) — indeferi-lo de plano é negar ao réu o que o rito lhe dá; e estratégica, porque o comportamento dos gatos importa para a culpa concorrente (CC, art. 945). Detalhe que a sala notou: quem 'matou' não foi parte — réu é o DONO. A frase da bancada errou até o sujeito." },
            proxima: "g3" },

          { rotulo: "Admitir o tema só como 'contexto', sem recebê-lo como pedido contraposto",
            fundamento: "Instrução ampla, objeto restrito",
            efeitos: { tec: 2, tempo: 4 },
            carimbo: "REGISTRADO COMO CONTEXTO",
            feedback: { acerto: "bom", titulo: "Ouviu tudo, decidirá metade",
              texto: "Colher a prova é acerto; recusar o contraposto é desperdiçá-la. Sem ele, mesmo que você se convença de que os gatos da autora também violam as posturas, não poderá impor a ela obrigação nenhuma — e o conflito voltará ao Juizado pela porta da frente, com novas custas emocionais. O art. 31 da Lei 9.099 existe exatamente para isso." },
            proxima: "g3" },

          { rotulo: "Acolher como a OUTRA METADE do caso: colher prova sobre os dois fatos — o ataque E o trânsito dos gatos — recebendo o pedido contraposto e cogitando culpa concorrente",
            fundamento: "Lei 9.099/95, arts. 30 e 31 (contestação oral e pedido contraposto); CC, art. 945; Código de Posturas, art. 86 — 'animal', sem distinção de espécie",
            requerFoco: "f_posturas",
            efeitos: { tec: 8, imp: 5, tempo: 6 },
            carimbo: "CONTRAPOSTO RECEBIDO",
            setFlags: { simetriaVista: true },
            reacoes: [
              { quem: "iolanda", emocao: "surpresa", texto: "Mas... o código de posturas fui EU que juntei! Era contra ele!" },
              { quem: "beto", emocao: "neutro", texto: "Se o doutor quer saber: os gatos dela passeiam no quarteirão inteiro mesmo. Nunca fizeram mal a ninguém — mas que passeiam, passeiam." }
            ],
            feedback: { acerto: "otimo", titulo: "A prova que a autora juntou contra si",
              texto: "O art. 86 do Código de Posturas — juntado pela própria autora — proíbe deixar 'ANIMAL' solto em via pública, sem distinguir cão de gato. O Juizado admite pedido contraposto fundado nos mesmos fatos (Lei 9.099, art. 31), e o trânsito livre dos gatos é juridicamente relevante duas vezes: como possível culpa concorrente da vítima (CC, art. 945, reduzindo a indenização) e como objeto do contraposto. Receber tudo num único processo é a vocação do JEC: o conflito REAL é a convivência do quarteirão, não nove segundos isolados." },
            proxima: "g3" }
        ]
      }
    },

    g3: {
      falas: [
        { quem: "edson", emocao: "firme", texto: "Doutor, eu repito e sustento: foi INSTINTO. Força maior. O senhor pode condenar um homem porque o bicho dele é... bicho? Sansão nunca mordeu gente. Ele viu um gato e o sangue falou. Isso é mais forte que tudo." },
        { quem: "iolanda", emocao: "raiva", texto: "E o meu Frajola morreu por ser bicho também! O instinto dele era tomar sol na calçada onde sempre tomou!" }
      ],
      decisao: {
        prompt: "A tese central da defesa: instinto natural como força maior. Sua decisão sobre ela:",
        opcoes: [
          { rotulo: "Acolher a tese: 'ninguém manda na natureza — fato da natureza é força maior; sem culpa, sem dever de indenizar'",
            fundamento: "Equidade com o réu (Lei 9.099, art. 6º)",
            efeitos: { tec: -10, hum: -6, tempo: 3 },
            carimbo: "FORÇA MAIOR RECONHECIDA",
            setFlags: { absolveuInstinto: true },
            reacoes: [
              { quem: "iolanda", emocao: "choro", texto: "Então qualquer cachorro pode matar qualquer gato e a resposta da Justiça é 'a natureza é assim'?!" },
              { quem: "edson", emocao: "surpresa", texto: "Eu... ganhei?" }
            ],
            feedback: { acerto: "grave", titulo: "A sentença que revoga o art. 936",
              texto: "Se instinto fosse força maior, o art. 936 jamais se aplicaria — animais só causam dano por instinto. A equidade do art. 6º da Lei 9.099 autoriza adequar a decisão às circunstâncias, não negar vigência a regra expressa do Código Civil. A Turma Recursal reformará — e, pior, a mensagem prática ao bairro é devastadora: o dever de guarda de animais virou letra morta na comarca." },
            proxima: "g4" },

          { rotulo: "Meio-termo intuitivo: o instinto não exclui, mas 'atenua moralmente' — anunciar que a indenização será reduzida porque o cão 'não teve maldade'",
            fundamento: "Gradação da reprovabilidade",
            efeitos: { tec: -5, tempo: 3 },
            carimbo: "ATENUANTE ANOTADA",
            feedback: { acerto: "ruim", titulo: "Planos misturados",
              texto: "A responsabilidade do art. 936 é objetiva: não depende de 'maldade' de ninguém — nem do cão (que não é sujeito de culpa) nem do dono. O que reduz indenização nesse terreno é a culpa CONCORRENTE da vítima (CC, art. 945) ou a modulação do quantum pelos critérios usuais — nunca uma 'atenuante moral canina'. O fundamento errado fragiliza até o resultado eventualmente certo." },
            proxima: "g4" },

          { rotulo: "Rejeitar com técnica: o instinto é exatamente o risco que o dever de guarda existe para conter — força maior é fato EXTERNO, imprevisível e inevitável; o previsível ritual do portão não é nada disso",
            fundamento: "CC, art. 936 — excludentes taxativas; força maior (CC, art. 393, p. único) é fato necessário externo, não a natureza do próprio animal",
            requerFoco: "f_936",
            efeitos: { tec: 10, tempo: 5 },
            carimbo: "TESE REJEITADA",
            setFlags: { instintoRejeitado: true },
            reacoes: [
              { quem: "edson", emocao: "vergonha", texto: "Quer dizer que... justamente PORQUE ele é cachorro, eu tinha que segurar." },
              { quem: "beto", emocao: "neutro", texto: "É que nem freio de caminhão, Edson. Ninguém culpa a descida — culpa quem desceu sem freio." }
            ],
            feedback: { acerto: "otimo", titulo: "O instinto não exonera — ele fundamenta o dever",
              texto: "A força maior que exonera (CC, arts. 936 e 393, parágrafo único) é o fato necessário, EXTERNO ao devedor, cujos efeitos não era possível evitar — um raio, uma enchente. O instinto predatório de um cão de grande porte é o oposto: característica INTERNA, conhecida e previsível, que constitui a própria razão de ser do dever de guarda. Soltar o cão sem guia na calçada, todos os dias no mesmo horário, é justamente a cautela que faltou. Aceitar 'instinto = força maior' esvaziaria o art. 936 por completo: todo dano causado por animal decorre, afinal, de algum instinto." },
            proxima: "g4" }
        ]
      }
    },

    g4: {
      falas: [
        { quem: "iolanda", emocao: "firme", texto: "Doutor, o que eu quero é simples: que esse cachorro NUNCA MAIS ponha o focinho na rua. Preso dentro de casa, pra sempre. Os gatos do bairro têm direito de andar em paz." },
        { quem: "edson", emocao: "raiva", texto: "Pra sempre?! Então prende os gatos dela também! Ou a liberdade que ela cobra pros bichos dela não vale pro meu?" },
        { quem: "narrador", texto: "A pergunta de Edson fica suspensa no ar da sala. Ninguém — nem a autora — tem resposta pronta para ela." }
      ],
      decisao: {
        prompt: "Confinamento perpétuo do cão de um lado; 'prende os gatos também' do outro. Como você desenha a obrigação de fazer?",
        opcoes: [
          { rotulo: "Deferir o pedido da autora: confinamento total e permanente de Sansão, sob multa diária",
            fundamento: "Prevenção máxima de novo ataque (CPC, art. 497)",
            efeitos: { tec: -8, hum: -6, tempo: 5 },
            carimbo: "CONFINAMENTO DECRETADO",
            setFlags: { confinamentoTotal: true },
            reacoes: [
              { quem: "edson", emocao: "choro", texto: "O senhor tá condenando o bicho à cela perpétua... Ele não fez por mal, doutor. Quem errou fui EU. Pune a mim!" },
              { quem: "beto", emocao: "triste", texto: "Cachorro grande preso pra sempre dentro de casa, doutor... isso acaba com o juízo do bicho. Eu já vi acontecer." }
            ],
            feedback: { acerto: "grave", titulo: "Proteger bichos torturando um bicho",
              texto: "A medida é desproporcional em todos os testes do art. 8º do CPC: inadequada (o risco está no MANEJO do portão, não na existência do cão), desnecessária (guia e dupla contenção bastam) e desproporcional em sentido estrito (impõe sofrimento permanente — maus-tratos vedados pela CF, art. 225, §1º, VII, e tipificados na Lei 9.605, art. 32). E repare na incoerência que Edson gritou e o processo registrou: a mesma sentença que celebra a liberdade dos gatos decreta a perpétua do cão. Decisão com prazo de reforma — e de manchete." },
            proxima: "g5" },

          { rotulo: "Indeferir os DOIS cárceres e desenhar o proporcional: Sansão só sai na guia, com manejo de portão em duas etapas; a autora contém os gatos no horário crítico da chegada e mantém identificação — cada um cede o mínimo que protege o outro",
            fundamento: "CPC, arts. 8º (proporcionalidade) e 497 (tutela específica pelo meio menos gravoso); CF, art. 225, §1º, VII (vedação de crueldade — confinamento perpétuo é maus-tratos)",
            requerFoco: "f_bemestar",
            efeitos: { tec: 10, hum: 8, tempo: 8 },
            carimbo: "OBRIGAÇÕES MODULADAS",
            setFlags: { equacaoJusta: true },
            reacoes: [
              { quem: "edson", emocao: "neutro", texto: "Guia e portão fechado antes de abrir o de dentro... isso eu consigo fazer. Isso é cuidado, não é prisão." },
              { quem: "iolanda", emocao: "neutro", texto: "E os meus ficam dentro de casa só na hora que ele chega... Sete da noite. Frajola... Frajola morreu às sete da noite." }
            ],
            feedback: { acerto: "otimo", titulo: "Tutela específica não é vingança específica",
              texto: "O art. 497 do CPC manda assegurar o resultado prático equivalente — e o art. 8º manda fazê-lo pelo meio proporcional. O resultado que a autora pode exigir é SEGURANÇA para os gatos, não sofrimento para o cão: confinar permanentemente um animal de grande porte, sem jamais sair, é crueldade vedada pela própria Constituição (art. 225, §1º, VII) que protege... os gatos dela. A simetria fecha a conta: guia e dupla contenção de um lado, recolhimento no horário crítico do outro. Nenhum animal preso; nenhum animal morto." },
            proxima: "g5" },

          { rotulo: "Indeferir tudo: 'cada um cuide do seu animal — o Juizado não administra quintais'",
            fundamento: "Mínima intervenção judicial",
            efeitos: { tec: -6, cel: 2, tempo: 3 },
            carimbo: "PEDIDOS PREVENTIVOS INDEFERIDOS",
            setFlags: { riscoIntacto: true },
            reacoes: [
              { quem: "iolanda", emocao: "medo", texto: "Então amanhã às sete da noite o portão abre de novo... e eu conto os meus gatos de novo, um por um." }
            ],
            feedback: { acerto: "ruim", titulo: "A tragédia continua agendada",
              texto: "O ataque não foi um raio em céu azul: foi o resultado previsível de um ritual diário que CONTINUARÁ acontecendo hoje às 19h. Negar qualquer obrigação de fazer é devolver as partes ao exato cenário do dia 12 de maio, com um gato a menos e um rancor a mais. A tutela específica do art. 497 existe para impedir o dano de amanhã — não apenas precificar o de ontem." },
            proxima: "g5" }
        ]
      }
    },

    g5: {
      falas: [
        { quem: "narrador", texto: "Fim da instrução. Edson olha longamente para a caixinha com a coleira vermelha sobre a mesa da autora." },
        { quem: "edson", emocao: "triste", texto: "Dona Iolanda... o Sansão dorme na minha cama. Se fosse ele naquela calçada, eu não tinha nem vindo trabalhar. Eu sei o tamanho do que a senhora perdeu. Sete anos, a senhora disse." },
        { quem: "iolanda", emocao: "choro", texto: "Sete anos, Edson. Você viu ele crescer naquele muro. Você dava bom dia pra ele, eu via da janela." }
      ],
      decisao: {
        prompt: "A janela do acordo entreabriu — ou você sentencia. Sua construção final:",
        opcoes: [
          { rotulo: "Sem acordo: SENTENCIAR com as réguas dos autos — dano moral de R$ 5.000 reduzido pela culpa concorrente, obrigações de fazer recíprocas, contraposto parcialmente procedente",
            fundamento: "CC, arts. 936 e 945; CPC, art. 497; vínculo provado nos autos",
            efeitos: { tec: 6, tempo: 8 },
            carimbo: "PROCEDENTE EM PARTE",
            setFlags: { sentencaGatos: true },
            reacoes: [
              { quem: "iolanda", emocao: "neutro", texto: "Reduzido por quê, doutor? Ah... os meus também andavam soltos. Entendi. Dói, mas entendi." },
              { quem: "edson", emocao: "neutro", texto: "Justo. Mais justo que eu esperava, pra ser franco." }
            ],
            feedback: { acerto: "bom", titulo: "Sentença honesta, paz incerta",
              texto: "Tecnicamente íntegra: responsabilidade objetiva reconhecida (CC, art. 936), instinto rejeitado como excludente, redução pela concorrência da vítima (art. 945 — os gatos também circulavam irregularmente, art. 86 das Posturas), obrigações proporcionais para os dois lados. O que a sentença não faz — e o acordo faria — é costurar a vizinhança: amanhã os dois ainda dividem o mesmo muro, agora com um título executivo entre eles." },
            proxima: function (f) { return f.confinamentoTotal ? "fim_grave" : "fim_bom"; } },

          { rotulo: "Costurar o acordo completo: indenização de R$ 4.000 em parcelas, reconhecendo o vínculo; protocolo recíproco do portão e dos gatos; multa por descumprimento; e a plaquinha de Frajola afixada no muro onde ele vivia",
            fundamento: "Vínculo provado (prontuário de 7 anos, microchip, declaração da veterinária) + Lei 9.099, arts. 2º e 22 — conciliação como vocação do rito; cláusula penal dá dentes ao acordo",
            requerFoco: "f_vinculo",
            efeitos: { tec: 8, hum: 10, tempo: 12 },
            carimbo: "ACORDO HOMOLOGADO",
            setFlags: { pactoGatos: true },
            reacoes: [
              { quem: "edson", emocao: "neutro", texto: "Quatro mil eu pago, parcelado, e pago olhando no olho. E a plaquinha... a plaquinha eu mesmo fixo no muro, se a senhora deixar." },
              { quem: "iolanda", emocao: "feliz", texto: "Deixo. Ele gostava de você, sabia? Gato sabe escolher gente." },
              { quem: "narrador", texto: "Seu Beto assoa o nariz com estrondo e pede desculpas ao microfone." }
            ],
            feedback: { acerto: "otimo", titulo: "O acordo que os autos pediam",
              texto: "Quem estudou o prontuário sabia: o vínculo de 7 anos estava documentado (microchip, vacinas, a declaração do colo na clínica), tornando o dano moral sólido — na esteira do REsp 1.713.167/SP, que reconhece o animal como ser senciente e objeto de afeto. Com esse trunfo NA MESA, a autora podia ceder no valor sem ceder no reconhecimento; e a cláusula penal evita o destino clássico dos acordos 'de palavra'. O protocolo recíproco resolve o conflito real — o do quarteirão. Conciliação é isto: cada um sai com o que mais precisava." },
            proxima: function (f) { return "fim_otimo"; } },

          { rotulo: "Julgar improcedente o dano moral: 'a perda de um animal, ainda que estimado, é dissabor da vida em sociedade'",
            fundamento: "Contenção da indústria do dano moral",
            efeitos: { tec: -6, hum: -10, tempo: 5 },
            carimbo: "IMPROCEDENTE",
            setFlags: { gatoFrieza: true },
            reacoes: [
              { quem: "iolanda", emocao: "choro", texto: "Dissabor... Sete anos de um ser que me esperava no muro todo dia viraram 'dissabor'." },
              { quem: "beto", emocao: "triste", texto: "..." }
            ],
            feedback: { acerto: "ruim", titulo: "A jurisprudência já saiu desse lugar",
              texto: "Com vínculo PROVADO — prontuário de 7 anos, microchip, despesas constantes, a cena do colo na clínica — a perda violenta do animal ultrapassa em muito o aborrecimento cotidiano: atinge a esfera afetiva tutelada pelos arts. 186 e 927 do CC e 5º, V e X, da CF. A linha do REsp 1.713.167/SP (senciência, objeto de afeto) tornou anacrônica a tese do 'é só um bicho'. A Turma Recursal devolverá a sentença — e a comarca, a confiança." },
            proxima: function (f) { return f.confinamentoTotal ? "fim_grave" : "fim_ruim"; } }
        ]
      }
    },

    /* ---------------- DESFECHOS ---------------- */
    fim_otimo: {
      fim: { selo: "otimo", titulo: "O tratado do muro",
        texto: "Na saída, Edson segura a porta para D. Iolanda — e pergunta, baixinho, qual ração Frajola gostava, 'pros outros oito, de vez em quando'. Seu Beto promete ceder as imagens da câmera 'só pra coisa boa daqui pra frente'. No termo de audiência, entre cláusulas e multas, está escrita a única sentença que importava: amanhã, às sete da noite, o portão abre devagar." }
    },
    fim_bom: {
      fim: { selo: "bom", titulo: "Resolvido por sentença",
        texto: "As obrigações estão escritas, o valor está fixado, a Turma Recursal provavelmente manterá tudo. As partes saem por lados opostos do corredor, civilizadas e distantes. Justiça feita — convivência adiada. Há dias em que é o máximo que o fórum entrega." }
    },
    fim_ruim: {
      fim: { selo: "ruim", titulo: "O muro ficou mais alto",
        texto: "D. Iolanda sai abraçada à caixinha com a coleira vermelha, sem olhar para trás. Edson não comemora: venceu um processo e perdeu a vizinhança inteira, que amanhã saberá de tudo na padaria. Na sua mesa, os autos fechados parecem mais pesados do que quando chegaram." }
    },
    fim_grave: {
      fim: { selo: "grave", titulo: "A perpétua de Sansão",
        texto: "O termo registra: o cão não sairá mais. Edson assina com a mão trêmula e sai sem cumprimentar ninguém. À noite, o bairro inteiro ouvirá o uivo comprido vindo da casa fechada — inclusive os gatos, livres, no alto do muro. Alguma coisa na equação não fechou, e você sabe exatamente o quê." }
    }
  }
});
