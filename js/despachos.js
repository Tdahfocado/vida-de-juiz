/* ============================================================
   TOGA — despachos.js : OS CONCLUSOS DO GABINETE
   ------------------------------------------------------------
   Nem toda decisão acontece de toga, em audiência: a pilha de
   conclusos sobre a mesa decide vidas em silêncio. Cada item
   tem UMA decisão (com fundamento e consequência imediata) —
   e alguns testam menos o Direito e mais a SERENIDADE.

   Formato:
   { id, titulo, area, pauta ("*" = qualquer dia),
     se?(estado) -> disponível?, texto (a peça/relato),
     opcoes: [{ rotulo, fundamento, efeitos (tec/hum/cel/imp/
       estresse/tempo), setFlags, feedback{acerto,titulo,texto},
       resultado{tom, titulo, texto} }],
     vidasTocadas?: [{se, texto, tom}] }
   ============================================================ */

window.TOGA = window.TOGA || {};

/* No modo 3D, os ofícios institucionais (TJCE, ACM, ESMEC...) só
   entram na pilha depois que o juiz passa na DIRETORIA: a Samantha
   é quem organiza o expediente. No 2D (sem fórum para andar), eles
   chegam direto — ninguém fica trancado fora do conteúdo. */
function expedienteLiberado(estado) {
  if (!TOGA.config || !TOGA.config.modo3d) return true;
  return !!(estado && estado.flags && estado.flags._expedienteSamantha);
}

TOGA.despachos = [

  /* ---------- 1. BUSCA E APREENSÃO ---------- */
  { id: "busca",
    titulo: "Representação por busca e apreensão",
    area: "Criminal — medidas cautelares",
    pauta: "*",
    texto: "OFÍCIO DO DELEGADO: investigação de roubo à residência da professora aposentada Olímpia, 74 anos — levaram as joias da família (aliança do falecido marido inclusive) e o notebook com as fotos de uma vida. Interceptação AUTORIZADA NOS AUTOS indica que os bens estão na casa de conhecido receptador, no bairro do Cruzeiro, e que 'vão despachar o material pra capital sábado'. O delegado representa pela BUSCA E APREENSÃO domiciliar, instruindo o pedido com o auto do roubo, a degravação e a qualificação do alvo.\n\nÉ quinta-feira. O mandado, se for o caso, precisa sair hoje.",
    opcoes: [
      { rotulo: "Indeferir por ora: 'aguarde-se mais diligências para reforçar os indícios'",
        fundamento: "Prudência investigativa",
        efeitos: { tec: -6, hum: -4, estresse: 4, tempo: 6 },
        feedback: { acerto: "ruim", titulo: "A prudência que chega depois do caminhão",
          texto: "Fundadas razões já havia (CPP, art. 240, §1º): interceptação judicial apontando o LUGAR e o PRAZO. Esperar 'mais diligências' quando os autos anunciam a remessa dos bens para sábado é deferir, na prática, o desaparecimento da prova — e das joias de uma vida." },
        resultado: { tom: "grave", titulo: "Sábado passou",
          texto: "Na segunda-feira, o delegado informa: a casa foi esvaziada no fim de semana, como a interceptação anunciava. As joias de Dona Olímpia viraram estatística. A investigação recomeça do zero — agora sem objeto." } },

      { rotulo: "DEFERIR com mandado certo e delimitado: endereço específico, objeto descrito (joias e eletrônicos roubados), cumprimento diurno, auto circunstanciado",
        fundamento: "CPP, arts. 240, §1º, e 245; CF, art. 5º, XI — fundadas razões + limites expressos",
        efeitos: { tec: 8, hum: 4, tempo: 8 },
        setFlags: { bensRecuperados: true },
        feedback: { acerto: "otimo", titulo: "A busca que cabe na Constituição",
          texto: "Mandado de busca não é salvo-conduto genérico: a CF exige determinação judicial FUNDAMENTADA e o CPP, objeto e endereço certos, cumprimento diurno e auto circunstanciado. Com a interceptação judicial indicando lugar e urgência, as 'fundadas razões' do art. 240, §1º, estavam maduras — e os limites que você escreveu protegem a diligência de futuras nulidades." },
        resultado: { tom: "bom", titulo: "Tudo recuperado — e com validade jurídica",
          texto: "A equipe cumpriu o mandado às 8h de sexta: joias, notebook e mais o produto de OUTROS dois roubos da região, tudo apreendido e periciado. À tarde, a escrivania te procura sorrindo: Dona Olímpia veio reconhecer a aliança do marido e pediu 'para agradecer ao doutor que assinou o papel'. O receptador responderá com prova ilibada — colhida nos exatos limites do mandado." } },

      { rotulo: "Deferir 'busca geral no bairro do Cruzeiro e adjacências, onde necessário'",
        fundamento: "Eficiência da persecução penal",
        efeitos: { tec: -10, imp: -6, estresse: 6, tempo: 6 },
        setFlags: { manchaGrave: true },
        feedback: { acerto: "grave", titulo: "O mandado genérico é a nulidade pronta",
          texto: "Busca 'no bairro e adjacências' é o exemplo de manual de mandado genérico — vedado pela CF (inviolabilidade domiciliar, art. 5º, XI) e pela jurisprudência pacífica (STF/STJ). Tudo o que for apreendido nascerá contaminado, e a responsabilidade civil do Estado (e a sua, funcional) vem no pacote." },
        resultado: { tom: "grave", titulo: "A prova que nasceu morta",
          texto: "A defesa do receptador nem precisou suar: habeas corpus com liminar reconhecendo a generalidade do mandado, busca anulada, bens devolvidos AO INVESTIGADO por ordem superior. A Corregedoria pediu informações. Dona Olímpia viu as joias na foto do auto de apreensão — e depois viu a Justiça devolvê-las para o ladrão." } }
    ],
    vidasTocadas: [
      { se: "bensRecuperados", tom: "bom",
        texto: "Dona Olímpia recuperou a aliança do marido — e veio ao fórum agradecer 'ao doutor que assinou o papel'." }
    ] },

  /* ---------- 2. ACOLHIMENTO URGENTE ---------- */
  { id: "acolhimentoUrgente",
    titulo: "Comunicação urgente do Conselho Tutelar",
    area: "Infância — plantão",
    pauta: "*",
    texto: "O Conselho Tutelar comunica, COM URGÊNCIA: recém-nascida de 22 dias encontrada em residência sem condições mínimas (sem água, mamadeiras azedas), genitora em surto psicótico não medicada, sozinha. A avó materna mora na cidade vizinha (40 min) e já está a caminho; é pessoa idônea, com vínculo, mas o Conselho não pode entregar a criança sem ordem judicial. A genitora foi conduzida ao CAPS. A bebê está na sede do Conselho, com fome.\n\nO ofício pede definição em HORAS.",
    opcoes: [
      { rotulo: "Determinar acolhimento INSTITUCIONAL imediato: berçário do abrigo até estudo completo",
        fundamento: "ECA, art. 101, VII — proteção imediata",
        efeitos: { tec: -4, hum: -6, estresse: 5, tempo: 6 },
        feedback: { acerto: "ruim", titulo: "O abrigo antes da avó",
          texto: "A proteção imediata estava certa; o ENDEREÇO, não. Com familiar idôneo a 40 minutos, a colocação na família extensa precede o acolhimento institucional (ECA, arts. 19, 25, par. único, e 101, §1º) — especialmente para uma recém-nascida, em que o vínculo dos primeiros dias importa." },
        resultado: { tom: "grave", titulo: "Berçário coletivo",
          texto: "A bebê passou a noite no abrigo. A avó chegou às 21h e dormiu na recepção, sem poder pegá-la no colo: 'amanhã, com o estudo', disseram. O estudo, semanas depois, recomendará exatamente o colo que esperava na recepção." } },

      { rotulo: "Aguardar o estudo psicossocial completo antes de qualquer medida — a criança fica no Conselho",
        fundamento: "Instrução prévia",
        efeitos: { tec: -8, hum: -10, estresse: 8, tempo: 4 },
        feedback: { acerto: "grave", titulo: "Recém-nascida não espera relatório",
          texto: "O Conselho Tutelar não é lugar de pernoite de bebê de 22 dias — não tem estrutura nem atribuição. Em risco atual, o juiz da infância decide COM o que tem e completa o estudo DEPOIS (ECA, arts. 98 e 101): a urgência é elemento da jurisdição protetiva, não obstáculo." },
        resultado: { tom: "grave", titulo: "A noite mais longa do Conselho",
          texto: "As conselheiras se revezaram a madrugada inteira com a bebê no colo, entre mamadeiras improvisadas. O ofício da manhã seguinte ao juízo tem uma frase que vai circular: 'esta criança dormiu no colo do Estado porque o Estado não respondeu'." } },

      { rotulo: "GUARDA PROVISÓRIA emergencial à avó (entrega na chegada, mediante termo), estudo psicossocial em 5 dias, tratamento da genitora oficiado ao CAPS e reavaliação em 30 dias",
        fundamento: "ECA, arts. 19, 25, par. único, 33, §1º, e 101; prioridade da família extensa",
        efeitos: { tec: 8, hum: 9, tempo: 9 },
        setFlags: { bebeProtegido: true },
        feedback: { acerto: "otimo", titulo: "Decisão do tamanho da urgência",
          texto: "Tudo no lugar: risco atual afastado HOJE (a bebê sai do Conselho), família extensa priorizada como manda a lei, estudo e reavaliação garantindo que a emergência não vire definitividade sem exame — e a mãe tratada como pessoa doente, não como ré. É o ECA aplicado na velocidade da vida real." },
        resultado: { tom: "bom", titulo: "O colo certo, ainda hoje",
          texto: "A avó assinou o termo às 19h40 e saiu do Conselho com a neta no colo e a mamadeira que as conselheiras prepararam para a viagem. O CAPS confirmou a internação voluntária da genitora — que, medicada, perguntou pela filha. A resposta pôde ser: 'com a sua mãe, te esperando'." } }
    ],
    vidasTocadas: [
      { se: "bebeProtegido", tom: "bom",
        texto: "Uma recém-nascida de 22 dias dormiu no colo da avó — e não num berçário coletivo — porque um despacho saiu em horas." }
    ] },

  /* ---------- 3. ALIMENTOS PROVISÓRIOS ---------- */
  { id: "alimentos",
    titulo: "Ação de alimentos — pedido liminar",
    area: "Família",
    pauta: "*",
    texto: "Inicial de ALIMENTOS c/c pedido liminar: Talita, 9 anos, representada pela mãe. O pai, vendedor com carteira assinada (contracheque juntado: R$ 3.400,00), deixou de contribuir há 5 meses, desde a nova união. A mãe, diarista, junta comprovantes: escola, remédio para asma, alimentação. Paternidade registrada, incontroversa.\n\nA Defensoria pede alimentos provisórios 'em percentual que o juízo entender adequado'.",
    opcoes: [
      { rotulo: "Fixar provisórios em 50% dos rendimentos do alimentante, 'em favor da criança'",
        fundamento: "Prioridade absoluta da criança (CF, art. 227)",
        efeitos: { tec: -5, estresse: 4, tempo: 5 },
        feedback: { acerto: "ruim", titulo: "Generosidade que não fecha conta",
          texto: "O binômio do art. 1.694, §1º, do CC tem DUAS pontas: necessidade de quem recebe E possibilidade de quem paga. Metade do salário de quem vive de comissão inviabiliza a própria subsistência do alimentante — e alimentos impagáveis viram execução, prisão e, principalmente, pensão NENHUMA chegando." },
        resultado: { tom: "grave", titulo: "O percentual que ninguém recebe",
          texto: "Dois meses depois, a primeira execução: o pai não pagou — entre pagar 50% e comer, escolheu comer. A revisional dele chegará antes do primeiro depósito. Talita segue sem a pensão; o processo, mais gordo." } },

      { rotulo: "Designar audiência de conciliação SEM liminar — 'alimentos se constroem por consenso'",
        fundamento: "CPC, art. 694",
        efeitos: { tec: -4, hum: -6, estresse: 3, tempo: 4 },
        feedback: { acerto: "grave", titulo: "Consenso não compra remédio de asma",
          texto: "A conciliação virá — mas a Lei de Alimentos é expressa: o juiz FIXARÁ desde logo alimentos provisórios ao despachar a inicial com prova do parentesco (Lei 5.478/68, art. 4º). Negar a liminar com paternidade registrada e necessidade documentada é deixar a criança financiando, com fome, o calendário do fórum." },
        resultado: { tom: "grave", titulo: "Até a audiência, nada",
          texto: "A audiência ficou para daqui a 40 dias. A mãe saiu do fórum direto para a farmácia — pediu fiado o remédio da asma, de novo. A Defensoria agravou: a liminar virá da instância superior, com a demora de quem precisou subir para descer." } },

      { rotulo: "FIXAR provisórios em 25% dos rendimentos líquidos (desconto em folha oficiado ao empregador) + 50% das despesas extraordinárias de saúde, com conciliação designada",
        fundamento: "Lei 5.478/68, art. 4º; CC, art. 1.694, §1º (binômio); desconto em folha (CPC, art. 529)",
        efeitos: { tec: 8, hum: 7, tempo: 7 },
        setFlags: { alimentosFixados: true },
        feedback: { acerto: "otimo", titulo: "O binômio bem calibrado",
          texto: "Percentual dentro da faixa consolidada na prática forense (20–30% para um filho), que a possibilidade do alimentante comporta; desconto EM FOLHA, que blinda contra o 'esqueci'; extraordinárias de saúde divididas — a asma de Talita não espera revisional. E a conciliação vem em seguida, para transformar o provisório em definitivo consensual." },
        resultado: { tom: "bom", titulo: "No quinto dia útil, como o aluguel",
          texto: "O ofício chegou ao RH na mesma semana. No primeiro pagamento, R$ 850 caíram na conta — a mãe mandou à Defensoria a foto do comprovante da mensalidade escolar PAGA EM DIA, com a legenda: 'primeira vez no ano'. O pai, aliviado pela previsibilidade, sinalizou acordo na conciliação." } }
    ],
    vidasTocadas: [
      { se: "alimentosFixados", tom: "bom",
        texto: "A mensalidade da escola de Talita foi paga em dia 'pela primeira vez no ano' — via desconto em folha que um despacho garantiu." }
    ] },

  /* ---------- 4. PRISÃO CIVIL DO DEVEDOR DE ALIMENTOS ---------- */
  { id: "prisaoCivil",
    titulo: "Execução de alimentos — rito da prisão",
    area: "Família — execução",
    pauta: "*",
    texto: "Execução pelo rito do art. 528 do CPC: devedor citado para pagar 3 parcelas atuais (R$ 2.550,00), provar pagamento ou justificar a impossibilidade — NÃO FEZ NADA em 10 dias. Nos autos: print do devedor em viagem de moto nova no fim de semana (juntado pela exequente) e certidão de que mantém emprego informal conhecido. A criança credora tem 7 anos. O MP opina pela prisão civil.\n\nConclusos para decisão.",
    opcoes: [
      { rotulo: "Conc, prazo suplementar de 15 dias 'em homenagem à menor onerosidade'",
        fundamento: "CPC, art. 805",
        efeitos: { tec: -6, hum: -5, estresse: 4, tempo: 5 },
        feedback: { acerto: "ruim", titulo: "A menor onerosidade do lado errado",
          texto: "A menor onerosidade protege o executado de EXCESSOS — não reescreve o rito alimentar. O art. 528 já deu o prazo legal: pagar, provar ou justificar. Silêncio + moto nova + trabalho conhecido = o retrato da recalcitrância que a prisão civil existe para vencer. Prazo extra aqui é fome com data nova." },
        resultado: { tom: "grave", titulo: "Mais 15 dias de nada",
          texto: "O prazo correu em branco, como o anterior. A exequente voltou com nova planilha — agora 4 parcelas — e uma pergunta da criança anotada pela Defensoria: 'o papai pode tudo?'. O rito recomeça, mais pesado." } },

      { rotulo: "DECRETAR a prisão civil por 30 dias (regime fechado, separado dos presos comuns), com protesto do débito e expedição imediata do mandado",
        fundamento: "CF, art. 5º, LXVII; CPC, art. 528, §§ 1º, 3º e 4º; Súmula 309/STJ (3 últimas parcelas)",
        efeitos: { tec: 8, hum: 5, estresse: 6, tempo: 7 },
        setFlags: { pensaoPaga: true },
        feedback: { acerto: "otimo", titulo: "A única prisão civil que a Constituição admite — usada para o que serve",
          texto: "Requisitos completos: débito ATUAL (Súmula 309/STJ), citação regular, silêncio absoluto, capacidade evidenciada (moto, trabalho). A prisão civil alimentar não é pena — é COERÇÃO: cessa no minuto em que se paga. E o protesto (art. 528, §1º) ataca o bolso por outro flanco. Decisão dura? É. Mas quem a tornou necessária não foi o juízo." },
        resultado: { tom: "bom", titulo: "Pagou em 36 horas",
          texto: "O mandado foi cumprido na segunda de manhã. Na quarta, o advogado do devedor — constituído em tempo recorde — juntou o comprovante: DÉBITO INTEGRAL depositado, com as custas. Alvará de soltura no mesmo dia, como manda a lei. A pensão dos meses seguintes vem caindo em dia: a moto, conta a exequente, foi vendida. A coerção coergiu — e a menina de 7 anos nem soube do mandado, só do leite na mesa." } },

      { rotulo: "Acolher a tese do 'desemprego notório da região' e converter o rito em penhora (art. 523), arquivando o pedido de prisão",
        fundamento: "Conversão em rito expropriatório",
        efeitos: { tec: -5, hum: -6, estresse: 4, tempo: 6 },
        feedback: { acerto: "grave", titulo: "A justificativa que ninguém apresentou",
          texto: "Justificar impossibilidade é ônus DO DEVEDOR, no prazo, com prova (art. 528, §2º) — não tese de ofício baseada em 'notoriedade' que os autos desmentem (moto nova, trabalho conhecido). Converter para penhora contra devedor sem patrimônio formal é arquivar a fome com outro nome." },
        resultado: { tom: "grave", titulo: "Penhora de nada",
          texto: "O oficial certificou o óbvio: 'não localizados bens penhoráveis em nome do executado' — a moto está no nome do irmão. A exequente recomeça o rito da prisão do zero, três meses e quatro parcelas depois. A informalidade venceu esta rodada por desistência do juízo." } }
    ],
    vidasTocadas: [
      { se: "pensaoPaga", tom: "bom",
        texto: "O débito alimentar integral foi pago em 36 horas de prisão civil — e as parcelas seguintes vêm caindo em dia." }
    ] },

  /* ---------- 5. REGISTRO TARDIO DE NASCIMENTO ---------- */
  { id: "certidao",
    titulo: "Registro tardio de nascimento",
    area: "Registros Públicos",
    pauta: "*",
    texto: "Pedido de REGISTRO TARDIO: Sebastiana, 66 anos, lavradora, NUNCA teve certidão de nascimento. Nasceu 'no sítio, de parteira', os pais analfabetos nunca registraram. Sem o papel, nunca teve RG, CPF, carteira de trabalho 'de verdade', título de eleitor — uma vida inteira de trabalho invisível. Agora, com a idade da aposentadoria rural, o INSS exige o óbvio que ela nunca teve.\n\nInstruem o pedido: justificação com 3 testemunhas (vizinhos de uma vida), certidão negativa dos cartórios da região, declaração do sindicato rural sobre décadas de lavoura. O MP opina favoravelmente.",
    opcoes: [
      { rotulo: "Converter em diligência: exigir DNA dos irmãos e certidões negativas de TODOS os cartórios do estado",
        fundamento: "Segurança registral máxima",
        efeitos: { tec: -5, hum: -7, estresse: 4, tempo: 6 },
        feedback: { acerto: "ruim", titulo: "A prova diabólica de quem nunca existiu no papel",
          texto: "A Lei 6.015 (art. 46) pede justificação idônea — que está NOS AUTOS: testemunhas, negativa regional, vínculo rural documentado. Exigir DNA e varredura estadual de quem nasceu de parteira há 66 anos é converter lacuna do Estado em ônus da vítima dela. O MP, fiscal da lei, já se satisfez." },
        resultado: { tom: "grave", titulo: "Mais um ano invisível",
          texto: "As diligências levarão meses e custarão o que Sebastiana não tem. O sindicato rural informou que casos assim desistem no meio do caminho — e seguem morrendo sem nome no papel. A aposentadoria, por ora, continua sendo dos outros." } },

      { rotulo: "DEFERIR o registro: justificação idônea, mandado ao cartório com expedição da PRIMEIRA VIA em mãos — e ofício ao INSS comunicando o registro para instruir o benefício rural",
        fundamento: "Lei 6.015/73, art. 46; CF, art. 1º, III (dignidade); gratuidade do registro (art. 30)",
        efeitos: { tec: 7, hum: 10, tempo: 7 },
        setFlags: { cidadaVisivel: true },
        feedback: { acerto: "otimo", titulo: "O despacho que cria uma cidadã",
          texto: "Registro civil é a porta de TODOS os outros direitos — sem ele não há RG, voto, benefício, nada. Com justificação idônea e parecer favorável do MP, deferir é ato vinculado à dignidade (CF, art. 1º, III). E o ofício ao INSS fecha o ciclo: o papel que faltava chega já a serviço da aposentadoria que ela ganhou na enxada, década por década." },
        resultado: { tom: "bom", titulo: "Sebastiana, 66 anos, EXISTE",
          texto: "O cartório expediu a primeira via na sexta-feira. Sebastiana segurou a certidão com as duas mãos e pediu para a escrevente LER EM VOZ ALTA o próprio nome completo — 'nunca ninguém leu ele num papel'. Três meses depois, chegou ao gabinete um cartão de agradecimento com a foto do primeiro comprovante de aposentadoria rural. Ela mandou também uma cópia da certidão, 'pra moldura, se o doutor quiser' — e o gabinete quis." } },

      { rotulo: "Indeferir: 'a via adequada é a administrativa, diretamente no cartório'",
        fundamento: "Provimento 28/CNJ — registro tardio extrajudicial",
        efeitos: { tec: -3, hum: -6, estresse: 3, tempo: 4 },
        feedback: { acerto: "ruim", titulo: "A porta giratória",
          texto: "A via extrajudicial EXISTE (Prov. 28/CNJ) — e foi tentada: a certidão negativa juntada veio justamente do cartório, que exigiu a justificação JUDICIAL pela idade do registro e ausência de documentos-base. Mandar de volta quem o cartório mandou para cá é a definição de Estado-pêndulo. O processo estava pronto para decidir." },
        resultado: { tom: "grave", titulo: "De volta à fila de onde veio",
          texto: "No cartório, a mesma resposta de antes: 'caso antigo assim, só com o juiz'. Sebastiana voltou para casa com a mesma pasta de papéis e uma dúvida nova: se nem o fórum nem o cartório podem, quem pode? A resposta legal era: você." } }
    ],
    vidasTocadas: [
      { se: "cidadaVisivel", tom: "bom",
        texto: "Sebastiana, 66 anos, ouviu o próprio nome lido de uma certidão pela primeira vez — e três meses depois, aposentada rural, mandou o cartão de agradecimento." }
    ] },

  /* ---------- 8. SEGURANÇA PESSOAL ---------- */
  { id: "seguranca",
    titulo: "Recomendação da escolta — rotina de deslocamento",
    area: "Segurança institucional",
    pauta: "*",
    texto: "O policial responsável pela segurança do fórum pede dois minutos no gabinete, porta fechada: 'Excelência, com as decisões desta semana' — ele não especifica quais — 'a recomendação técnica é VARIAR a rotina casa-fórum-casa: horários alternados, dois trajetos diferentes, evitar previsibilidade. Nada de alarme. É protocolo.' Deixa sobre a mesa um cartão com o telefone direto da inteligência da PM.\n\nÉ a primeira vez, em sua carreira, que alguém te diz isso.",
    opcoes: [
      ,

      { rotulo: "Agradecer e ignorar: 'trabalho aqui há anos, conheço esta cidade. Não vai acontecer nada.'",
        fundamento: "Percepção pessoal de segurança",
        efeitos: { estresse: -2, tempo: 2 },
        setFlags: { rotinaIgnorada: true },
        feedback: { acerto: "ruim", titulo: "A estatística não pergunta a opinião do otimista",
          texto: "A recomendação não nasceu de paranoia: nasceu de monitoramento que você não vê. Recusar protocolo de segurança por familiaridade com a cidade é o erro mais comum — e o mais documentado — nos relatórios de incidentes contra magistrados. O preço de estar errado, aqui, não se parcela." },
        resultado: { tom: "grave", titulo: "O carro da esquina",
          texto: "Na quinta-feira, no MESMO horário de sempre, um carro desconhecido ficou parado na sua rua com dois ocupantes — a vizinha notou e anotou a placa. A PM identificou: nada confirmado, 'mas o senhor entende o recado', disse o policial, sem precisar completar. Você variou o trajeto na sexta. O estresse, essa semana, mora no espelho retrovisor." } },

      ,

      { rotulo: "Solicitar escolta armada permanente e viatura na porta de casa",
        fundamento: "Segurança máxima",
        efeitos: { imp: -3, estresse: 4, tempo: 4 },
        feedback: { acerto: "ruim", titulo: "Resposta desproporcional também é erro de calibragem",
          texto: "A Res. 291 gradua as medidas pelo RISCO AVALIADO — e a avaliação técnica pediu variação de rotina, não comboio. Escolta permanente sem risco que a justifique consome efetivo, expõe a rotina da família a mais gente e cria a imagem pública de um juiz sitiado — ou estrelado." },
        resultado: { tom: "grave", titulo: "A viatura virou assunto",
          texto: "Três dias de viatura na porta renderam o apelido na feira ('o doutor escoltado'), uma nota irônica em coluna local e um pedido formal da PM para 'reavaliar a proporcionalidade do emprego de efetivo'. A medida caiu; o comentário, ficou." } },

      { rotulo: "Acatar a recomendação: variar trajetos e horários, avisar a família, guardar o telefone — e seguir trabalhando normalmente",
        fundamento: "Res. CNJ 291/2019 (segurança institucional); prudência sem alarde",
        efeitos: { imp: 3, estresse: 6, tempo: 4 },
        setFlags: { rotinaVariada: true },
        feedback: { acerto: "otimo", titulo: "Coragem não é previsibilidade",
          texto: "Juiz que decide contra interesses fortes não precisa de heroísmo de novela — precisa de PROTOCOLO. A Res. CNJ 291 estrutura exatamente isso: avaliação de risco e medidas proporcionais. Variar trajeto custa pouco, protege muito, e manda a mensagem certa: a jurisdição não se intimida nem se descuida. O estresse sobe um pouco — viver com cuidado pesa. Pesa menos que o contrário." },
        resultado: { tom: "bom", titulo: "Protocolo virou hábito",
          texto: "Em uma semana, os dois trajetos novos viraram rotina (um passa pela padaria boa — bônus inesperado). A inteligência da PM ligou uma única vez, para confirmar que a movimentação suspeita monitorada 'se dissipou'. Você nunca saberá o que era. Com protocolo, não precisou saber." } }
    ] },

  /* ---------- 9. O ALMOÇO (e a serenidade no balcão) ---------- */
  { id: "almoco",
    titulo: "O almoço — e o advogado exaltado",
    area: "A vida como ela é",
    pauta: "*",
    se: function (estado) { return estado.minutos >= 11 * 60 + 30; },
    texto: "12h40. A pauta da tarde espera. No restaurante do fórum tem comida de verdade e meia hora de conversa fora dos autos; no gabinete, a marmita de ontem e a pilha de conclusos.\n\nMas antes de qualquer garfada, a secretaria avisa: um ADVOGADO EXALTADO está no balcão há dez minutos, em voz alta, exigindo despacho IMEDIATO num processo que chegou ontem: 'O juiz almoça enquanto meu cliente espera! Isso vai para a OAB e para a imprensa!' As pessoas do corredor já olham.",
    opcoes: [
      { rotulo: "Sair ao balcão e devolver no mesmo tom: 'O senhor não grita na MINHA secretaria! Mais um decibel e dou voz de prisão por desacato!'",
        fundamento: "Poder de polícia (CPC, art. 360)",
        efeitos: { imp: -6, hum: -4, estresse: 12, tempo: 6 },
        setFlags: { explodiuBalcao: true },
        feedback: { acerto: "grave", titulo: "Quem grita com quem grita vira dupla",
          texto: "O poder de polícia existe para garantir a ordem — com ordem. Ameaçar prisão por desacato num bate-boca de balcão rebaixa a toga ao tom do interlocutor e produz a cena que ele queria: agora há um vídeo de celular onde é o JUIZ quem grita. A serenidade não é fraqueza; é o uniforme invisível do cargo." },
        resultado: { tom: "grave", titulo: "O vídeo tem 47 segundos",
          texto: "E nele só aparece a sua parte. Circulou no grupo da OAB local antes das 14h, com requintes de legenda. O advogado protocolou representação anexando o vídeo; a marmita ficou intacta; e a tarde inteira de audiências aconteceu com aquele zumbido na cabeça. O estresse de hoje tem nome, sobrenome e número de inscrição." } },

      { rotulo: "Recebê-lo com hora marcada: orientar a secretaria a agendá-lo para as 14h, com escrivã presente — e ALMOÇAR no restaurante, como planejado",
        fundamento: "LOMAN, art. 35, IV (atender com urbanidade, em horário compatível); serenidade funcional",
        efeitos: { imp: 6, hum: 3, estresse: -10, tempo: 12 },
        setFlags: { serenidadeBalcao: true, almocouBem: true },
        feedback: { acerto: "otimo", titulo: "Serenidade com estrutura",
          texto: "Resposta completa: o advogado SERÁ atendido (direito dele — LOMAN, art. 35, IV), mas em hora marcada, com testemunha funcional e sem gritaria como senha de prioridade. E o almoço de verdade não é autoindulgência: meia hora de pausa real é manutenção do único equipamento que o juízo tem — você. Quem cede o almoço a toda urgência alheia julga a tarde inteira com fome e pavio curto." },
        resultado: { tom: "bom", titulo: "Às 14h, outro homem",
          texto: "Alimentado e calmo, você recebeu às 14h um advogado VISIVELMENTE menor sem a plateia do corredor. Pedido anotado, despacho prometido na ordem cronológica — e ele saiu agradecendo, constrangido: 'o senhor me desculpe o balcão, doutor, o cliente me pressiona'. No restaurante, de quebra, o colega da 2ª vara dividiu uma solução de pauta que vai te poupar uma semana." } },

      { rotulo: "Largar o almoço e despachar AGORA o processo dele, 'para encerrar o constrangimento'",
        fundamento: "Apaziguamento",
        efeitos: { cel: 2, imp: -5, estresse: 8, tempo: 8 },
        setFlags: { furouFila: true },
        feedback: { acerto: "ruim", titulo: "O grito que vira jurisprudência de balcão",
          texto: "Despachar na hora SOB GRITARIA ensina à comarca inteira que gritar funciona — e quem espera em silêncio na ordem cronológica acaba de descobrir que é trouxa. A isonomia (CF, art. 5º) também se defende no balcão. E o seu almoço virou marmita fria de novo: o corpo cobra esses juros com taxa de estresse." },
        resultado: { tom: "grave", titulo: "Amanhã tem mais",
          texto: "O despacho saiu — e a notícia também: na manhã seguinte, OUTRO advogado tentou o mesmo método, citando o precedente de ontem ('o doutor atendeu o Fulano na hora!'). A secretaria já não sabe o que responder. A fila cronológica, essa, segue esperando educadamente." } }
    ] },

  /* ---------- 9-A. O OFÍCIO DO DESEMBARGADOR (TJCE) ----------
     Chega logo no início do Dia 1. Aceitar é só o começo: a
     capacitação acontece NO DIA SEGUINTE, no Salão do Júri —
     e a recompensa, idem. Compromisso assumido é compromisso
     cumprido: a flag atravessa a noite (motor.js, HERANCAS). */
  { id: "capacitacao",
    titulo: "Ofício do Des. Raimundo Nonato Silva Santos — TJCE",
    area: "Gabinete do Desembargador Raimundo Nonato Silva Santos",
    pauta: "dia1",
    anexo: "oficioTJCE",
    se: expedienteLiberado,
    texto: "Antes da primeira audiência, a assessora entrega um ofício com o timbre do Tribunal de Justiça do Estado do Ceará. É da lavra do Desembargador Raimundo Nonato Silva Santos: os painéis de produtividade destacaram esta comarca, e Sua Excelência solicita que o juízo promova uma CAPACITAÇÃO para a própria equipe — produtividade, gestão de processos e uso de tecnologia.\n\nA assessora aguarda a resposta com a caneta na mão. E acrescenta, baixinho: “a equipe ia gostar, doutor. A gente vive apagando incêndio sem nunca aprender a prevenção.”",
    opcoes: [
      { rotulo: "Pedir à assessoria que responda 'agradecendo a lembrança e informando que a pauta será analisada oportunamente'",
        fundamento: "Diplomacia de gabinete",
        efeitos: { cel: 1, tempo: 3 },
        feedback: { acerto: "ruim", titulo: "O 'oportunamente' que nunca chega",
          texto: "Toda comarca conhece esse ofício de resposta: educado, evasivo e estéril. O desembargador não pediu um favor pessoal — apontou que a sua experiência tem valor multiplicador. Resposta evasiva a convite institucional é oportunidade engavetada com protocolo." },
        resultado: { tom: "neutro", titulo: "Protocolado e esquecido",
          texto: "A resposta saiu impecável e não disse nada. A equipe continuou apagando incêndio sem aprender prevenção — e o painel de produtividade continuou mostrando o que poderia ter sido ensinado." } },

      { rotulo: "Responder POSITIVAMENTE no ato: aceitar o convite e marcar a capacitação para AMANHÃ, no Salão do Júri, com toda a equipe",
        fundamento: "LOMAN, art. 35, I (deveres de ofício); a gestão da unidade também é jurisdição",
        efeitos: { hum: 2, tec: 2, tempo: 8 },
        setFlags: { capacitacaoAceita: true },
        feedback: { acerto: "otimo", titulo: "Quem aceita ensinar, aprende duas vezes",
          texto: "Resposta de magistrado que entende o cargo: a produtividade da comarca não é mérito solitário do juiz — é método, e método se transmite. Marcar para AMANHÃ no Salão do Júri (a maior sala da casa) sinaliza prioridade. Agora é cumprir: compromisso com desembargador não prescreve da noite para o dia." },
        resultado: { tom: "bom", titulo: "Resposta na mesma hora",
          texto: "A assessora digitou a resposta sorrindo e avisou a equipe inteira antes de protocolar. Resultado imediato no corredor: o escrivão já separou as dúvidas de sistema, a estagiária preparou perguntas sobre prazos, e alguém escreveu na agenda da copa: “AMANHÃ — capacitação com o doutor, Salão do Júri. NÃO MARQUE NADA EM CIMA.”" } },

      { rotulo: "Agradecer e declinar: a pauta desta semana está desumana, e capacitação boa não se faz nas coxas",
        fundamento: "Gestão realista da agenda",
        efeitos: { estresse: -2, tempo: 3 },
        feedback: { acerto: "bom", titulo: "Recusa honesta vale mais que aceite fingido",
          texto: "É uma resposta legítima — melhor declinar com franqueza do que aceitar e ministrar uma capacitação pela metade. Mas repare no custo: a equipe que mais precisava do método continua sem ele, e convites institucionais bem-sucedidos raramente batem na mesma porta duas vezes." },
        resultado: { tom: "neutro", titulo: "Fica para outro semestre",
          texto: "O desembargador respondeu com elegância de quem entende de pauta. A equipe, avisada do quase, ficou com gostinho de quero-mais — “quem sabe quando a pauta aliviar, doutor”. A pauta, como se sabe, nunca alivia sozinha." } }
    ] },

  /* ---------- 9-A2. O CONVITE DA ACM ----------
     Também no início do Dia 1: a Associação Cearense de
     Magistrados convida para a palestra sobre as prerrogativas
     constitucionais — o tema mais incompreendido (e mais
     importante) da relação entre a magistratura e a sociedade. */
  { id: "acm",
    titulo: "Convite da ACM — José Hercy Ponte de Alencar",
    area: "Associação Cearense de Magistrados",
    pauta: "dia1",
    anexo: "oficioACM",
    se: expedienteLiberado,
    texto: "Junto com o expediente da manhã, um convite com o timbre da ASSOCIAÇÃO CEARENSE DE MAGISTRADOS, assinado pelo presidente José Hercy Ponte de Alencar: palestra de abertura do ciclo anual, com o tema “A importância das prerrogativas constitucionais da magistratura para a sociedade” — aberta ao público, com estudantes, imprensa e comunidade.\n\nO presidente arremata no último parágrafo: “ninguém melhor para explicar que vitaliciedade, inamovibilidade e irredutibilidade não são privilégios do juiz, e sim garantias de quem será julgado por ele — do que um juiz que as exerce todos os dias diante da sua comarca.”",
    opcoes: [
      { rotulo: "Pedir o material do evento e responder na semana que vem, depois de ver a pauta",
        fundamento: "Cautela de agenda",
        efeitos: { tempo: 3 },
        feedback: { acerto: "ruim", titulo: "O tema não espera",
          texto: "Há convites que admitem 'semana que vem' — este, não: prerrogativas da magistratura viraram pauta pública permanente, e o silêncio dos que as exercem deixa a explicação por conta de quem as ataca. O ciclo da ACM tem data; a dúvida da sociedade, não." },
        resultado: { tom: "neutro", titulo: "A cadeira ficou vazia",
          texto: "A resposta não chegou a tempo e a palestra de abertura coube a outro orador — competente, mas de gabinete. Faltou no palco exatamente o que o presidente pedia: a voz de quem decide olhando as pessoas nos olhos." } },

      { rotulo: "CONFIRMAR a participação no ato — e já enviar o roteiro: prerrogativas explicadas pelos CASOS, não pelos artigos",
        fundamento: "CF, art. 95 — vitaliciedade, inamovibilidade e irredutibilidade como garantias do jurisdicionado",
        efeitos: { hum: 3, imp: 2, tempo: 8 },
        setFlags: { palestraACM: true },
        feedback: { acerto: "otimo", titulo: "As garantias de quem é julgado",
          texto: "É a pedagogia certa para o tema certo: a vitaliciedade existe para que o juiz não decida com medo de perder o cargo; a inamovibilidade, para que ninguém 'transfira' o juiz que incomoda; a irredutibilidade, para que decisão não tenha preço. Explicado pelos casos — a protetiva que desagradou, a liminar contra o poderoso — o público entende em dez minutos o que o ataque às prerrogativas custaria a ELE. Falar disso à sociedade é defender a sociedade." },
        resultado: { tom: "bom", titulo: "Confirmado — e com fila",
          texto: "A ACM respondeu no mesmo dia: “auditório ampliado, transmissão confirmada, e o presidente fará questão de abrir a mesa”. José Hercy mandou um recado pessoal: “Excelência, prepare-se para a pergunta que sempre vem — 'mas juiz não ganha demais?' — e responda como o senhor decide: com fato, fundamento e a calma de quem não deve nada.”" } },

      { rotulo: "Declinar com elegância: magistrado fala nos autos, e prerrogativa não carece de palanque",
        fundamento: "Reserva e discrição funcional",
        efeitos: { estresse: -2, tempo: 3 },
        feedback: { acerto: "bom", titulo: "A reserva é legítima — mas o silêncio tem custo",
          texto: "Falar nos autos é a regra de ouro, e declinar é direito seu. Mas note a diferença: aqui ninguém pediu opinião sobre processo — pediram EXPLICAÇÃO INSTITUCIONAL sobre garantias constitucionais, exatamente o espaço que a Res. CNJ 305 considera saudável. Quando os que sabem se calam, o tema fica com os que gritam." },
        resultado: { tom: "neutro", titulo: "Outro assumirá o microfone",
          texto: "O presidente respondeu compreensivo — “a casa é sua quando quiser”. A palestra aconteceu com um professor convidado. Boa, dizem. Mas no debate, quando perguntaram “e na prática, doutor?”, faltou quem pudesse responder: “na prática, foi assim ontem de manhã, na minha sala”." } }
    ] },

  /* ---------- 9-B. O CONVITE DA ESMEC ----------
     A notícia da capacitação corre o Tribunal: a Coordenadora
     da Escola Superior da Magistratura convida o juízo para o
     corpo docente PERMANENTE. Só desperta depois do treinamento. */
  { id: "esmec",
    titulo: "Ofício da ESMEC — Juíza Coordenadora Ana Paula Feitosa Oliveira",
    area: "Escola Superior da Magistratura do Ceará",
    pauta: "*",
    anexo: "oficioESMEC",
    se: function (estado) {
      if (!expedienteLiberado(estado)) return false;
      if (!TOGA.conquistas || TOGA.conquistas.tem("docenteESMEC")) return false;
      return !!(estado && estado.flags._capacitacaoFeita) || TOGA.conquistas.tem("capacitadorTJCE");
    },
    texto: "O ofício chega com o timbre da ESMEC e vai direto ao ponto: a Juíza Coordenadora Ana Paula Feitosa Oliveira tomou conhecimento da capacitação ministrada à equipe da comarca — “com a didática rara de quem pratica o que ensina”, escreve ela — e convida o juízo a integrar o corpo docente PERMANENTE da Escola: formação inicial e continuada de magistrados e servidores, um módulo por semestre.\n\nA assessora lê por cima do seu ombro e resume o sentimento geral: “doutor... isso é tipo ser convocado pra seleção.”",
    opcoes: [
      { rotulo: "Agradecer e aceitar apenas participações pontuais, sem vínculo permanente — a comarca vem primeiro",
        fundamento: "Gestão de agenda; o magistério não pode concorrer com a jurisdição",
        efeitos: { cel: 1, tempo: 4 },
        feedback: { acerto: "bom", titulo: "Prudente — mas o permanente cabia",
          texto: "A cautela honra a vara: a jurisdição vem primeiro, sempre. Mas repare que o convite era para UM módulo por semestre — exatamente o formato que a Constituição admite (art. 95, parágrafo único, I) sem arranhar a pauta. O pontual ensina uma turma; o permanente forma uma geração." },
        resultado: { tom: "neutro", titulo: "Porta entreaberta",
          texto: "A Coordenadora respondeu que a Escola fica 'à disposição do meio-termo'. Você dará palestras avulsas quando der. O assento fixo no corpo docente, esse, ficou esperando — e cadeira de escola, como a de fórum, não fica vazia muito tempo." } },

      { rotulo: "ACEITAR o corpo docente permanente: um módulo por semestre, com os casos da comarca (anonimizados) como material vivo",
        fundamento: "CF, art. 95, parágrafo único, I (magistério); formar juízes é multiplicar jurisdição",
        efeitos: { hum: 3, tec: 3, tempo: 10 },
        setFlags: { esmecAceita: true },
        feedback: { acerto: "otimo", titulo: "Da tribuna do júri para a cátedra — sem sair da toga",
          texto: "É o desfecho natural do arco: a Presidência pediu uma aula, a aula virou método, o método virou convite. O magistério é a única função que a Constituição permite acumular com a judicatura — e a ESMEC é onde a experiência de uma comarca vira critério para todas as outras. Um módulo por semestre é exigente, mas é o tipo de cansaço que volta multiplicado." },
        resultado: { tom: "bom", titulo: "Bem-vindo(a) ao corpo docente",
          texto: "A resposta da Coordenadora chegou em duas horas, com a placa de DOCENTE PERMANENTE e a grade do próximo semestre em anexo: “módulo de abertura — 'Um dia de audiências', com o professor que viveu cada uma delas”. No fórum, a equipe comemorou como vitória do time: “a gente sabia, doutor. A gente assistiu primeiro.”" } },

      { rotulo: "Declinar: ensinar juiz é responsabilidade grande demais para quem ainda se sente aprendendo",
        fundamento: "Modéstia funcional",
        efeitos: { estresse: -2, tempo: 3 },
        feedback: { acerto: "ruim", titulo: "A modéstia que priva os outros",
          texto: "Sentir-se aprendendo é exatamente a credencial que a Escola procura — professor que se acha pronto ensina certezas; professor que aprende ensina método. Declinar por modéstia não protege ninguém: apenas priva os juízes novos do que a sua comarca já sabe na prática." },
        resultado: { tom: "neutro", titulo: "A Escola insistirá",
          texto: "A Coordenadora respondeu com uma única linha: “a ESMEC discorda da premissa, mas respeita — e renovará o convite.” A assessora imprimiu a resposta e deixou na sua mesa com um post-it: “ela tem razão, doutor”." } }
    ] },

  /* ---------- 10. RECONHECIMENTO: o pedido de entrevista ----------
     A fama boa também chega ao gabinete — e também testa o decoro. */
  { id: "entrevista",
    titulo: "Pedido de entrevista — Gazeta da Comarca",
    area: "Reconhecimento — e decoro",
    pauta: "*",
    se: function (estado) {
      if (!estado) return false;
      const r = estado.reputacao;
      return Math.round((r.tec + r.hum + r.cel + r.imp) / 4) >= 70;
    },
    texto: "A assessoria traz um e-mail impresso da GAZETA DA COMARCA: a editoria quer uma entrevista para a série 'Quem decide por nós' — perfil do juiz da comarca cujas audiências 'andam virando assunto de feira, no bom sentido'. O repórter promete pauta livre: pode perguntar 'dos casos famosos' aos 'bastidores do gabinete'.\n\nA Resolução CNJ 305/2019 e a LOMAN (art. 36, III) desenham o limite: o magistrado pode falar — mas não sobre processos, e não para a própria glória.",
    opcoes: [
      { rotulo: "Recusar com cortesia: agradecer, indicar a assessoria de imprensa do Tribunal e seguir a pauta",
        fundamento: "Res. CNJ 305/2019 — a comunicação pode ser institucional",
        efeitos: { cel: 2, tempo: 4 },
        feedback: { acerto: "bom", titulo: "Recusar também é resposta legítima",
          texto: "Nenhum magistrado é obrigado a dar entrevista — e encaminhar à assessoria do Tribunal é o protocolo prudente. Perde-se, porém, uma chance real: a comunicação institucional bem feita aproxima a comarca da Justiça, e ninguém explica uma audiência melhor do que quem a conduz. Recusa correta; oportunidade adiada." },
        resultado: { tom: "neutro", titulo: "A pauta seguiu",
          texto: "O repórter agradeceu e publicou a série com fontes da capital. Ficou boa — mas genérica: nenhum exemplo tinha a cara da SUA comarca. No balcão, as mesmas dúvidas de sempre continuam chegando sem tradutor." } },

      { rotulo: "Aceitar em grande estilo: dar os bastidores dos 'casos famosos' — afinal, as decisões foram públicas e a comarca merece saber dos detalhes",
        fundamento: "Publicidade dos atos processuais (CF, art. 93, IX)",
        efeitos: { imp: -8, tec: -4, tempo: 18 },
        setFlags: { manchaGrave: true },
        feedback: { acerto: "grave", titulo: "Publicidade do ATO não é vitrine do juiz",
          texto: "A publicidade do art. 93, IX, é do PROCESSO — não autoriza o juiz a comentar casos, rotular partes nem se promover sobre as dores alheias. A LOMAN (art. 36, III) veda exatamente isso, e a Res. 305 manda sobriedade até nas redes. A entrevista 'com bastidores' vira fato novo nos processos citados, munição para suspeições — e pauta da Corregedoria." },
        resultado: { tom: "grave", titulo: "A manchete errada",
          texto: "O título saiu maior que a intenção: “Juiz revela os bastidores dos casos que julgou”. Na terça, dois advogados juntaram a página aos autos; na quarta, a Corregedoria pediu informações; na quinta, o repórter já preparava a continuação. A vaidade tem prazo de validade curto e recurso em dobro." } },

      { rotulo: "Aceitar com pauta combinada: falar da INSTITUIÇÃO — como funciona uma audiência, o que é a rede de proteção, por que a fundamentação importa — e nada sobre processos ou pessoas",
        fundamento: "LOMAN, art. 36, III (a contrario sensu); Res. CNJ 305/2019 — informação institucional é lícita",
        efeitos: { hum: 4, tempo: 15 },
        setFlags: { entrevistaInstitucional: true },
        feedback: { acerto: "otimo", titulo: "A voz que explica, não a que aparece",
          texto: "É exatamente o espaço lícito: a LOMAN veda opinar sobre processo pendente (art. 36, III), não veda EXPLICAR a Justiça — e a Res. 305 incentiva a comunicação institucional responsável. Uma comarca que entende o que o juiz faz confia mais, recorre melhor e tem menos medo da porta do fórum. Falar da instituição é serviço; falar de si seria vaidade; falar dos casos seria infração." },
        resultado: { tom: "bom", titulo: "“Quem decide por nós” — página 3",
          texto: "A matéria saiu no domingo: nenhum processo citado — só uma hora de conversa sobre como nasce uma decisão, o que é uma audiência de custódia e por que existe rede de proteção. Na segunda-feira, a servidora do balcão notou: as pessoas chegaram perguntando MENOS 'cadê o juiz' e MAIS 'como funciona'. Missão da série, cumprida pela fonte." } }
    ] },

  /* ---------- 11. RECONHECIMENTO: o convite da Escola Judicial ---------- */
  { id: "palestra",
    titulo: "Convite — aula na Escola Judicial",
    area: "Reconhecimento",
    pauta: "*",
    se: function (estado) {
      if (!TOGA.conquistas || TOGA.conquistas.tem("palestrante")) return false;
      return TOGA.conquistas.tem("excelencia") || TOGA.conquistas.nivelCarreira().estrelas >= 3;
    },
    texto: "Ofício da ESCOLA JUDICIAL: a coordenação da formação inicial convida o juízo desta comarca para ministrar a aula 'Um dia de audiências: a técnica que protege e a escuta que repara' — para a turma de juízes recém-aprovados. O motivo, diz o ofício, é objetivo: 'as decisões desta comarca vêm sendo usadas como material de estudo, e os alunos pediram a fonte'.\n\nA aula é num sábado. O seu sábado.",
    opcoes: [
      { rotulo: "Recusar por sobrecarga: a pauta está pesada e o sábado é da família — talvez no próximo semestre",
        fundamento: "Autocuidado e gestão da própria agenda (Res. CNJ 207)",
        efeitos: { estresse: -4, tempo: 2 },
        feedback: { acerto: "bom", titulo: "Dizer não também é gestão",
          texto: "Recusa legítima: a Res. CNJ 207 trata a saúde do magistrado como política de Estado, e sábado de descanso também é manutenção da jurisdição. A Escola entenderá — e o convite, dado o motivo, voltará. Só não deixe a sobrecarga decidir para sempre: ensinar o que se faz bem também renova quem ensina." },
        resultado: { tom: "neutro", titulo: "Fica para a próxima",
          texto: "A coordenação respondeu com elegância: 'mantemos o convite em aberto'. O sábado foi da família — e rendeu. A aula aconteceu com outro palestrante; os alunos, dizem, perguntaram pela comarca mesmo assim." } },

      { rotulo: "Aceitar: preparar a aula com os casos ANONIMIZADOS — os erros possíveis, as decisões de referência e o que nenhum manual ensina sobre ouvir gente",
        fundamento: "CF, art. 95, parágrafo único, I (magistério); a formação de juízes é função institucional",
        efeitos: { hum: 3, estresse: 4, tempo: 6 },
        setFlags: { palestraAceita: true },
        feedback: { acerto: "otimo", titulo: "Quem ensina, decide duas vezes",
          texto: "O magistério é a única atividade que a Constituição permite acumular com a judicatura (CF, art. 95, parágrafo único, I) — e por boa razão: a experiência de quem decide é o material mais escasso da formação. Casos anonimizados, erros confessados e técnica explicada valem mais para um juiz novo do que dez manuais. A comarca que você construiu vai julgar em outras comarcas." },
        resultado: { tom: "bom", titulo: "A aula que virou aula dupla",
          texto: "O sábado rendeu: a turma não deixou você sair no horário — perguntaram da custódia, da escuta de crianças, do estresse, do café. A avaliação veio com nota máxima e um pedido formal de 'parte 2'. O certificado chegou na quarta, com uma anotação à mão da diretora: 'a fonte confere com o material'." } }
    ] }
];
