# 📝 Criando seus próprios casos

Os casos do TOGA são **arquivos de dados** em `js/casos/`. Você não precisa saber
programar para escrever um: precisa saber Direito e seguir o formato abaixo (que é,
essencialmente, preencher uma ficha). Este tutorial explica campo a campo.

## Passo 0 — Instalar o caso novo

1. Copie um caso existente (ex.: `caso-vizinhos.js`) e renomeie (ex.: `caso-despejo.js`).
2. No `index.html`, adicione a linha, **antes** do `main.js`:
   ```html
   <script src="js/casos/caso-despejo.js"></script>
   ```
3. A posição da linha define a posição na pauta do dia.

## A ficha do caso (visão geral)

```js
TOGA.casos.push({
  id: "despejo",                      // identificador único, sem espaços
  titulo: "Despejo do Bar do Zé",     // aparece na pauta e no HUD
  subtitulo: "Uma frase de impacto que resume o dilema.",
  area: "Cível",                      // etiqueta exibida (qualquer texto)
  hora: "16:30",                      // hora da pauta (o relógio do jogo respeita)
  duracaoPrevistaMin: 60,             // estourar muito isso custa Celeridade

  personagens: [ ... ],               // quem está na sala (ver §1)
  autos: { resumo: "...", pecas: [ ... ] },   // o que se lê na preparação (§2)
  focos: [ ... ],                     // os "pontos de estudo" estratégicos (§3)

  inicio: "c1",                       // id da primeira cena
  cenas: { ... }                      // o coração do caso (§4)
});
```

## §1 — Personagens

```js
{ id: "ze", nome: "Zé", papel: "Réu", assento: "dir1",
  avatar: { pele: "#d8a87f", cabelo: "curto", corCabelo: "#241a10",
            traje: "camisa", corTraje: "#5a4a3a", oculos: false, barba: true } }
```

- **assento** (a câmera é a visão do juiz): `centro` (depoente),
  `esq1`–`esq3` (mesa à esquerda: autor/MP), `dir1`–`dir3` (mesa à direita: réu/defesa).
- **papel** colore o nome na caixa de diálogo. Valores com cor própria:
  `Promotor`, `Promotora`, `Defensora Pública`, `Advogado`, `Advogada`. Outros papéis
  (Autor, Réu, Vítima, Testemunha...) usam a cor padrão.
- **avatar**: `cabelo` aceita `curto | coque | longo | calvo`; `traje` aceita
  `terno | blazer | camisa | vestido` (terno aceita `corGravata`; blazer aceita
  `corBlusa`); `oculos` e `barba` são `true/false`; cores em hexadecimal.
- Personagens "especiais" que NÃO precisam ser declarados: `narrador` (voz da
  ambientação) e `voce` (o próprio juiz).

## §2 — Autos (a preparação)

`resumo` é o parágrafo de contexto; `pecas` são as abas de leitura:

```js
pecas: [
  { id: "inicial", titulo: "Petição inicial", texto: "Texto da peça.\n\nUse \\n\\n para parágrafos." }
]
```

Boa prática: esconda nas peças as informações que os **focos** (§3) e as **opções
desbloqueáveis** (§4) vão recompensar. Quem lê os autos com atenção joga melhor — esse
é o ponto pedagógico do jogo.

## §3 — Focos (estratégia pré-audiência)

O jogador marca **até 2**. Cada foco pode destravar opções na audiência:

```js
focos: [
  { id: "f_recibos", rotulo: "Os recibos de aluguel",
    dica: "Há um padrão nas datas dos pagamentos. Qual?" }
]
```

## §4 — Cenas: falas, decisões e ramos

Cada cena tem `falas` (sequência exibida com efeito de digitação) e, ao final, **ou**
uma `decisao` **ou** um `fim`:

```js
c1: {
  falas: [
    { quem: "narrador", texto: "16h30. Última audiência do dia." },
    { quem: "ze", emocao: "raiva", texto: "Vinte anos de ponto, doutor!" }
  ],
  decisao: {
    prompt: "Como você abre os trabalhos?",
    opcoes: [ ... ]
  }
}
```

**Emoções disponíveis** (mudam o rosto do avatar na cena):
`neutro · firme · feliz · triste · choro · raiva · surpresa · medo · vergonha`

### A anatomia de uma opção

```js
{ rotulo: "Texto do botão (a decisão em si)",
  fundamento: "A base legal exibida em itálico no cartão",
  requerFoco: "f_recibos",            // OPCIONAL: 🔒 trava sem o foco marcado
  efeitos: { tec: 8, hum: -3, imp: 0, cel: 0, tempo: 6 },  // reputação + minutos gastos
  carimbo: "DEFERIDO",                // o que o carimbo "bate" na cena
  setFlags: { acordoFechado: true },  // OPCIONAL: liga lembretes p/ o futuro
  reacoes: [                          // OPCIONAL: a sala reage NA HORA
    { quem: "ze", emocao: "feliz", texto: "Sabia que o senhor ia entender!" }
  ],
  feedback: {                          // o painel do Modo Estudo
    acerto: "otimo",                   // otimo | bom | ruim | grave
    titulo: "Por que essa decisão se sustenta",
    texto: "Explique o fundamento. Pode usar <b>negrito</b>."
  },
  proxima: "c2"                        // para onde a história vai
}
```

### Ramos inteligentes: `proxima` como função

É aqui que decisões antigas mudam o futuro. Em vez de um texto fixo, `proxima` pode ser
uma função que recebe as **flags** acumuladas e devolve o id da próxima cena:

```js
proxima: function (f) {
  if (f.acordoFechado) return "fim_otimo";
  if (f.brigaFeia) return "fim_ruim";
  return "fim_bom";
}
```

### Os finais do caso

```js
fim_otimo: {
  fim: { selo: "otimo",               // otimo | bom | ruim | grave (cor do selo)
         titulo: "O bar reabre segunda",
         texto: "O texto de encerramento, em tom narrativo.",
         setFlags: { despejoResolvido: true } }   // opcional
}
```

## §5 — Interlúdios e manchetes (consequências de longo alcance)

Ficam no `js/main.js`, em duas listas:

```js
// Aparece ENTRE audiências, se a condição for verdadeira
TOGA.interludios.push({
  id: "int_bar", aposCaso: 4,                 // dispara após o caso de índice 4 (0 = primeiro)
  condicao: function (f) { return !!f.despejoResolvido; },
  tom: "bom",                                  // bom | grave | neutro
  titulo: "Convite na portaria",
  texto: "Zé mandou dizer que a feijoada de reabertura tem lugar reservado.",
  efeitos: { hum: 2 }                          // opcional
});

// Aparece no MURAL do epílogo
TOGA.manchetes.push({
  condicao: function (flags, reputacao) { return !!flags.despejoResolvido; },
  fonte: "Folha do Bairro",
  titulo: "Bar do Zé reabre após acordo na Justiça"
});
```

## Checklist de qualidade (aprenda com os 6 casos prontos)

- [ ] Toda `decisao` tem 3–4 opções **plausíveis** — o erro bom é o que um leigo
      escolheria convicto.
- [ ] Pelo menos 1 opção `requerFoco` por caso (recompensa quem leu os autos).
- [ ] `feedback` de TODAS as opções ensina algo citável (artigo, súmula, precedente).
- [ ] As `reacoes` fazem a consequência ser **sentida no ato** — alguém protesta,
      chora, consigna em ata, agradece.
- [ ] Os `fins` variam de verdade conforme as flags (mínimo: ótimo / bom / ruim).
- [ ] Releia como juiz: o "ótimo" do jogo resistiria a um recurso? Se não, ajuste.

## O validador agora EXIGE (diretrizes do projeto viraram checagem)

Rode `node tools/validar-casos.js` antes de dar o caso por pronto. Além da
integridade estrutural, ele agora trata como **erro** (não aviso):

- [ ] **Desfechos positivos E negativos visíveis** — `arco.depois` precisa de pelo
      menos 1 ramo `tom: "bom"` E 1 ramo `tom: "grave"`; idem `vidasTocadas`
      (tons válidos: só `"bom"` e `"grave"`).
- [ ] **A melhor opção nunca pode ser previsível** — se a opção ótima/boa estiver em
      1º lugar em mais da metade das decisões do caso, o validador reprova.
      Embaralhe as posições (2ª, 3ª, 4ª).
- [ ] **Consequência tangível** (aviso) — alguma flag do caso deve ecoar em um
      interlúdio, manchete ou lembrança (`js/lembrancas.js`). Caso novo sem rastro
      no mundo é caso que termina quando a tela fecha — e não deveria.

Para deixar um OBJETO no gabinete (foto, carta, desenho): desenhe a arte em
`js/arte.js` (canvas puro — `TOGA.arte.carta(id, linhas, assinatura)` já resolve
qualquer carta manuscrita), registre em `js/lembrancas.js` (campo `arte`) e dê a
posição 3D em `js/3d/lembrancas3d.js` (`FORMA3D`). O mural 2D do epílogo e o modal
de ampliação vêm de graça. Para ANEXAR a arte a um interlúdio, use o campo
`anexo: "nomeDaArte"`.

Lembre também de acrescentar o `<script>` do caso novo em **dois** lugares:
`index.html` e `tools/painel-professor.html`.

### Interlúdios encarnados: o campo `entrega`

Quando a consequência merece mais que um cartão de texto, faça a pessoa ENTREGAR
o objeto em mãos:

```js
TOGA.interludios.push({
  id: "int_meu", aposCaso: 1, tom: "bom",
  condicao: function (f) { return !!f.minhaFlag; },
  titulo: "Uma visita no gabinete",
  texto: "Uma linha curta de contexto — a cena conta o resto.",
  entrega: {
    quem: { id: "alice", nome: "Alice", papel: "7 anos", escala: 0.75,
            avatar: { pele: "#d8a87f", cabelo: "longo", corCabelo: "#2c1c10",
                      traje: "vestido", corTraje: "#c94f6a" } },
    falas: [ { emocao: "firme", texto: "Não é presente. É documento." } ],
    objeto: "desenhoSuperJuiz",          // nome em TOGA.arte
    rotuloReceber: "🤲 Receber o documento"
  }
});
```

O avatar usa o MESMO formato dos personagens da sala (cena.js); `escala` encolhe
crianças. O jogador clica no balão para avançar as falas, recebe o objeto, vê em
tela cheia e o jogo confirma "guardado no seu gabinete". Sem `entrega`, o campo
`anexo: "nomeDaArte"` continua mostrando a imagem estática no cartão.

### `requerFoco` não trava mais — agora custa tempo

Opção com `requerFoco` cujo foco não foi marcado aparece com a oferta
"📖 Reler os autos agora (+4 min)": um clique cobra os minutos e destrava;
o segundo decide. Quem marcou o foco antes decide de graça — o estudo
prévio continua sendo a jogada ótima (a Celeridade agradece). Use o
`requerFoco` sem medo de bloquear a melhor decisão: o jogador sempre
tem o remédio, pelo preço certo.

## Conquistas e reconhecimento (js/conquistas.js)

- **Conquista nova**: acrescente um item em `LISTA` (`js/conquistas.js`) com
  `{id, icone, nome, desc, se(ctx)}`. O `ctx` traz `gatilho` ("decisao", "caso",
  "interludio", "entrega", "pausa", "epilogo"), `estado`, `flags`, `carreira` e
  `lembrancasAtivas`. Persistência e toast vêm de graça.
- **Evento de reconhecimento**: é um interlúdio comum (condicionado a
  `TOGA.conquistas.nivelCarreira()` / `tem("...")` — assim acontece UMA vez na
  carreira) ou um **despacho** com `se(estado)` quando há escolha a fazer
  (entrevista, palestra). Se a honraria merece parede, registre a arte em
  `js/arte.js` e a lembrança em `js/lembrancas.js` (a condição pode ler as
  conquistas, não só as flags).
