# 🗺 ROADMAP — de um dia de audiências a uma vida inteira de juiz

## ✅ Fase 1 — Protótipo "Dia de Audiências" (este pacote)
**Objetivo: provar a mecânica central.** Decidir com fundamento → sentir no ato →
colher depois.

- [x] Motor genérico de casos (dados separados de lógica)
- [x] 4 audiências completas (violência doméstica, família, JEC, "guarda" de pet)
- [x] Fase de estratégia (leitura dos autos + focos que desbloqueiam decisões)
- [x] Consequências imediatas (reações, carimbo, martelo, reputação ao vivo)
- [x] Consequências encadeadas (interlúdios, manchetes, múltiplos finais)
- [x] Modo Estudo (fundamentação após cada decisão)
- [x] Sala de audiências em SVG com avatares expressivos; salvamento local
- [x] Hospedagem gratuita (GitHub Pages), funciona offline com duplo clique

**Próximos incrementos ainda dentro da Fase 1** (ordene como quiser):
- [x] Mais casos — **entregue como "Dia 2 — Dia Decisivo"** (`js/pautas.js`): seis casos
      sensíveis onde a atuação judicial é decisiva — audiência de custódia com furto
      famélico (soltura + acolhimento de ofício das crianças), plantão da saúde
      (Tema 106/STJ + e-NatJus + o desenho da Alice), medida de proteção na infância
      (família extensa × abrigo), despejo com as duas pontas vulneráveis (acordo-ponte
      com aluguel social), previdenciário por competência delegada (CF, art. 109, §3º)
      e instrução criminal com proteção à vítima (CPP, arts. 217 e 400-A) e prisão em
      audiência. Todos com desfechos positivos E negativos (arco emocional + "Vidas
      tocadas"), e a melhor opção em posição IMPREVISÍVEL (auditada pelo validador).
- [x] **Vida de gabinete e bem-estar** — sistema de ESTRESSE (sobe com decisões
      ruins, casos tensos e manifestações ríspidas; alivia com água, frigobar e
      atendimento no novo SETOR DE SAÚDE do fórum; no nível crítico a visão
      embaça); DESPACHOS DE GABINETE na pilha de conclusos (busca e apreensão,
      acolhimento urgente, alimentos, prisão civil, registro tardio de certidão —
      com a certidão emoldurada como lembrança), ofícios institucionais
      (Corregedoria/metas, CNJ/decoro e redes sociais — Res. 305/2019), o dilema
      do almoço com teste de SERENIDADE no balcão, e a recomendação de segurança
      pessoal (Res. CNJ 291). Policiamento fixo no corredor e na sala, fluxo de
      presos escoltados à 2ª vara, placas (1ª VARA, DIRETORIA DO FORO, CENTRAL DE
      MANDADOS, SETOR DE SAÚDE) e TUTORIAL na primeira partida.
- [x] Mais casos — **entregue como "Dia 3 — Plantão Noturno"** (`js/pautas.js`): quatro
      urgências entre 21h40 e meia-noite — entrega voluntária de recém-nascido (ECA,
      art. 19-A × adoção à brasileira), suprimento de consentimento para transfusão em
      criança (CF, art. 5º; ECA 98/101), internação psiquiátrica na crise (Lei
      10.216/2001: laudo, último recurso, leito SUS × clínica asilar) e medida protetiva
      de plantão (Lei 11.340, arts. 12-C, 19, §1º, 22-24-A). A pauta declara `inicio:
      "21:30"` (o motor aceita expediente fora do padrão). Ainda em aberto: execução
      penal (remição por leitura?) e consumidor/superendividamento (Lei 14.181/2021).
- [x] **A comarca lembra** — flags do Dia 1 herdadas no Dia 2 (`d1_*`, lista branca em
      `motor.js`): reencontros (a carta de Marlene, o relatório de Sofia), manchetes de
      eco e a página **"Um ano depois"** no jornal do epílogo (com os três dias).
- [x] **Lembranças tangíveis em todo lugar** — registro neutro (`js/lembrancas.js`) +
      artes em canvas puro (`js/arte.js`, sem WebGL): cartas manuscritas, desenhos,
      comprovantes — visíveis no 3D (gabinete), nos interlúdios (campo `anexo`) e no
      novo **mural do gabinete** do epílogo 2D (clique para ampliar).
- [x] Estatísticas pós-jogo por decisão — **código do resultado** (epílogo, sem servidor
      e sem dados pessoais) + **painel do professor** (`tools/painel-professor.html`):
      distribuição das escolhas da turma por decisão e médias por eixo.
- [x] **Modo Demonstração** (`?demo=1`) — um caso curto para eventos/estandes, sem
      tutorial e sem tocar nos saves; inatividade devolve à tela de atração.
- [x] Cartão compartilhável **por caso** (tela de desfecho) e URL do jogo nos cartões
      (configure `TOGA.config.urlJogo` em `main.js` ao publicar).
- [x] **A vida fora da toga** — vinhetas dirigidas pelo estresse (o áudio da filha, a
      consulta adiada) e o saldo pessoal do juiz no epílogo ("E você?").
- [x] Acessibilidade: narração por voz (Web Speech API), alto contraste, navegação
      por teclado nas decisões (↑/↓ + Enter), ARIA (aria-live nas falas, role=meter
      nas barras), texto instantâneo sob `prefers-reduced-motion`
- [x] "Modo prova" (chave no menu; boletim por eixo no epílogo)
- [x] **Sistema de recompensas** — conquistas persistentes com vitrine, níveis de
      carreira reputacionais (estrelas no menu e no cartão), convite a rejogar na
      pauta (melhor selo por caso), combo de decisões exemplares e EVENTOS DE
      RECONHECIMENTO que se somam durante o jogo: elogio funcional da Corregedoria,
      selo Excelência, entrevista da Gazeta (testa o decoro — Res. 305), visita de
      estudantes, convite da Escola Judicial e o abaixo-assinado da comunidade —
      com a "parede de honrarias" no gabinete.
- [x] **Juiz(a) personalizável** — gênero, tom de pele e cabelo (menu → 👤), valendo
      no boneco 3D, no cartão do dia e nos vocativos ("doutora") dos diálogos.
- [x] Foco de estudo sem trava: opção não estudada oferece "reler os autos (+4 min)".

## 🎭 Fase 2 — Multiplayer com papéis processuais
**Objetivo: cada cadeira da sala, um jogador.** Detalhes completos em
`ARQUITETURA-MULTIPLAYER.md`.

- [ ] Degrau 2.0 — hot-seat local (passa o aparelho), sem backend
- [ ] Degrau 2.1 — Firebase: salas com código, papéis, presença em tempo real
- [ ] Degrau 2.2 — fase de estratégia por equipe (dossiês privados, teses, perguntas)
- [ ] Degrau 2.3 — audiência síncrona: fila de perguntas → juiz defere/indefere;
      NPCs respondem conforme instrução + qualidade da pergunta
- [ ] Degrau 2.4 — avaliação por papel (advogar bem ≠ vencer) e ranking de turma

## 🎨 Fase 3 — Gráficos e imersão
**Objetivo: a sala que se sente.** O SVG atual foi desenhado para ser substituível —
a interface conversa com a cena por uma API mínima (`montar`, `falar`, `setEmocao`),
então trocar o "palco" não toca o motor.

- [ ] 3.1 — Retratos ilustrados de alta qualidade + animação 2D (respiração, gestos)
- [x] 3.2 — Sala 3D no navegador com Three.js — **entregue e ampliado**: fórum
      explorável em terceira pessoa (gabinete, corredor, sala), personagens
      low-poly procedurais com as 9 emoções, interlúdios encarnados (assessora,
      balcão), mesmo save dos dois modos. **Ampliações entregues depois**:
      diretor de câmera na audiência (plano geral ⇄ foco em quem fala),
      linguagem corporal por emoção, público figurante que reage, elenco que
      entra andando e senta, martelo clicável (2D e 3D), sombras suaves com
      chave de qualidade, texturas procedurais (piso, lambris, tapete, brasão,
      mural, quadros), luz que acompanha o relógio do expediente (manhã → fim
      de tarde) e joystick virtual + interação por toque no celular.
- [x] 3.3 — Vozes sintetizadas (narração Web Speech) e trilha ambiente do fórum —
      módulo `js/audio.js`: arquivos opcionais em `assets/audio/` (file://-safe,
      via HTMLAudioElement) com fallback de síntese Web Audio para tudo
      (papel, passos, murmúrio, sino, tom grave, martelo)
- [ ] 3.4 — Se o projeto crescer além do navegador: porte para engine (Godot é
      gratuita e exporta para web, desktop e celular)

## 🌍 Fase 4 — "A Vida de um Juiz" (o mundo aberto)
**Objetivo: o sonho de origem.** A audiência vira UMA das atividades de um cotidiano
simulado:

- [ ] Gabinete: pilha de conclusos com prazos — escolher o que despachar primeiro
- [ ] Plantão judiciário: madrugada, telefone toca, decisões sob pressão de minutos
- [ ] Carreira: remoção, promoção por antiguidade/merecimento, vitaliciamento,
      Corregedoria, eleições para a direção do fórum
- [ ] Vida fora da toga: estudo (sua Técnica decai sem atualização!), família, saúde —
      equilíbrio como mecânica, não como discurso
- [ ] Comarca viva: as pessoas das suas audiências reaparecem na rua, no mercado,
      na fila do banco — e lembram de como foram tratadas
- [ ] Eventos sistêmicos: mutirões, metas do CNJ, inspeções, uma pandemia, uma enchente

---

### Princípio que atravessa todas as fases
**Verossimilhança jurídica em primeiro lugar.** Cada mecânica nova só entra se um
profissional do Direito, jogando, reconhecer a sua rotina — e se um estudante, jogando,
aprender algo citável. Diversão é consequência de verdade bem encenada.
