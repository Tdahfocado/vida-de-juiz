# ⚖ TOGA — A Vida de um Juiz
### Módulo 1: Dia de Audiências (protótipo jogável)

Um jogo sério sobre o ofício de julgar. Você é o juiz de uma comarca fictícia e tem
**seis audiências na pauta de hoje**: medidas protetivas (Lei Maria da Penha), uma
disputa de guarda, um conflito de vizinhança no Juizado, a "guarda" de um cachorro
chamado Thor, a morte do gato Frajola pelo cão do vizinho (responsabilidade pelo fato
do animal, dano moral e a ironia de pedir liberdade para uns bichos e cárcere para
outro) e, fechando o dia, a instrução de um homicídio em que "todos sabem" quem matou —
mas a única testemunha ocular jura não ter visto nada, e o promotor pede que VOCÊ a
prenda por falso testemunho.

Cada decisão exige **conhecimento jurídico real** — os fundamentos citados (artigos,
súmulas, precedentes) são verdadeiros — e cada escolha tem **consequência sentida no
ato**: a sala reage, sua reputação muda na hora, o carimbo bate, o martelo soa. Algumas
consequências chegam depois, entre uma audiência e outra, como na vida: um habeas corpus
julgado, um ofício da Corregedoria, uma sacola de mangas no balcão da secretaria.

---

## 🎮 Como jogar AGORA (sem instalar nada)

1. Baixe/descompacte esta pasta inteira.
2. Dê **dois cliques no arquivo `index.html`**.
3. Pronto — o jogo abre no seu navegador. Não precisa de internet (apenas as fontes
   ficam mais bonitas online), não precisa de servidor, não instala nada.

### 🕹 Modo 3D — ande pelo fórum

Ligue a chave **"Modo 3D"** no menu e o jogo vira um jogo de exploração em terceira
pessoa: você controla o juiz **andando pelo fórum** (gabinete → corredor → sala de
audiências) com **W A S D / setas** (← → giram a câmera; arrastar o mouse também) e
interage com a tecla **E**:

- **Computador do gabinete** → consulta a pauta do dia;
- **Autos sobre a mesa** → abre a preparação do caso da vez;
- **Cafeteira** → um café antes do próximo ato (recomendado);
- **Bancada da sala** → sente-se para apregoar as partes e conduzir a audiência;
- **Assessora / balcão da secretaria** → os interlúdios viram recados e entregas
  que chegam às suas mãos entre uma audiência e outra;
- **NPCs no corredor** → as partes do próximo caso esperam nos bancos;
- **Porta de saída** → encerra o expediente (epílogo).

Tudo é desenhado **por código** (low-poly procedural com Three.js, sem nenhum asset
baixado): os personagens 3D nascem dos MESMOS dados de avatar dos casos, e os rostos
reusam literalmente as 9 expressões do modo 2D. O **mesmo save funciona nos dois
modos** — alterne à vontade. Sem suporte a WebGL, o jogo cai com elegância no modo
clássico. (Controles por toque em celular: na lista da Fase 3 do ROADMAP.)

O progresso é salvo **no seu próprio navegador** (tecnologia chamada `localStorage`):
feche e volte depois com o botão "Continuar de onde parei".

### O ciclo de uma audiência
1. **Pauta** → escolha o caso da vez (a ordem é a da pauta, como num fórum de verdade).
2. **Autos** → leia as peças processuais e marque até **2 pontos de estudo**. Isso é a
   sua fase de estratégia: pontos estudados **desbloqueiam decisões melhores** durante a
   audiência (as opções bloqueadas aparecem com 🔒 — "você não estudou este ponto").
3. **Audiência** → conduza o ato: falas, objeções, depoimentos, momentos de decisão.
   Quatro barras medem você o tempo todo: ⚖ Técnica, ❤ Humanidade, ⏱ Celeridade e
   🛡 Imparcialidade.
4. **Modo Estudo** (ligado por padrão) → após cada decisão, um painel explica o
   fundamento jurídico do acerto ou do erro. Desligue no menu para jogar "no escuro".
5. **Epílogo** → ao fim das seis audiências, a imprensa local "noticia" o seu dia e
   você recebe um veredito de carreira. Há vários finais.

---

## 🌐 Como publicar na internet DE GRAÇA (GitHub Pages)

O jogo é um site **estático** (só HTML, CSS e JavaScript) — o tipo de site que o GitHub
hospeda gratuitamente. Passo a passo **sem linha de comando**:

1. Crie uma conta gratuita em https://github.com (se ainda não tiver).
2. Clique no **+** (canto superior direito) → **New repository**.
   - Repository name: `toga` (ou o nome que preferir)
   - Marque **Public** → **Create repository**.
3. Na página do repositório, clique em **uploading an existing file**.
4. Arraste para lá **todo o conteúdo da pasta** `vida-de-juiz` (o `index.html` precisa
   ficar na raiz do repositório, junto com as pastas `css`, `js` e `docs`).
5. Clique em **Commit changes**.
6. Vá em **Settings → Pages** (menu lateral).
   - Em "Build and deployment" → Source: **Deploy from a branch**
   - Branch: **main** / pasta **/(root)** → **Save**.
7. Aguarde 1–2 minutos. Seu jogo estará no ar em:
   `https://SEU-USUARIO.github.io/toga/`

Qualquer pessoa com o link joga — celular, tablet ou computador. Cada atualização que
você fizer nos arquivos (pode editar direto pelo site do GitHub) republica o jogo
automaticamente.

> **Por que não hospedar na minha própria máquina?** Porque expor um computador pessoal
> à internet exige cuidados sérios de segurança. O GitHub Pages entrega o mesmo
> resultado com risco zero e custo zero — seu computador fica fora da equação.

---

## 📂 A estrutura do projeto (e o que cada peça faz)

```
vida-de-juiz/
├── index.html            ← a "casa" do jogo: telas e ordem dos scripts
├── css/
│   └── estilo.css        ← toda a aparência (cores, fontes, animações)
├── js/
│   ├── cena.js           ← desenha a sala de audiências em SVG (avatares, emoções, martelo)
│   ├── motor.js          ← as REGRAS: estado, reputação, relógio, ramificações, salvamento
│   ├── ui.js             ← a INTERFACE: telas, diálogos, cartões de decisão, epílogo
│   ├── main.js           ← a partida: interlúdios, manchetes e botões do menu
│   ├── vendor/
│   │   └── three.min.js  ← Three.js r149 (build UMD oficial, licença MIT em LICENSE-three.txt)
│   ├── 3d/               ← o MODO 3D (mesmo motor, mesmos casos — outro palco)
│   │   ├── nucleo3d.js   ← renderer, loop de quadros, detecção de WebGL
│   │   ├── rosto.js      ← rostos em canvas: as MESMAS 9 emoções do 2D, via Path2D
│   │   ├── boneco.js     ← personagens low-poly nascidos dos avatares dos casos
│   │   ├── mundo.js      ← o fórum: gabinete, corredor e sala (colisão por caixas)
│   │   ├── controles.js  ← andar em terceira pessoa (WASD + câmera com colisão)
│   │   ├── interacao.js  ← a tecla E: proximidade + olhar + prompt
│   │   ├── cena3d.js     ← fachada com a MESMA API da cena 2D + modo mundo
│   │   └── debug3d.js    ← teleporte e interação programática (testes/bots)
│   └── casos/            ← ⭐ os CASOS são só dados — crie os seus!
│       ├── caso-protetiva.js
│       ├── caso-guarda.js
│       ├── caso-vizinhos.js
│       ├── caso-thor.js
│       ├── caso-gatos.js
│       └── caso-juri.js
├── docs/
│   ├── CRIANDO-CASOS.md            ← tutorial para escrever audiências novas
│   ├── ARQUITETURA-MULTIPLAYER.md  ← o plano da Fase 2 (advogados e MP jogáveis)
│   └── ROADMAP.md                  ← da Fase 1 ao "mundo aberto"
└── tools/
    └── validar-casos.js  ← revisor automático dos casos (rode: node tools/validar-casos.js)
```

> **Criou ou editou um caso?** Rode `node tools/validar-casos.js` no terminal (precisa do
> Node.js). Ele confere se toda cena tem saída, se os ramos apontam para cenas que existem,
> se os focos exigidos foram declarados — e aponta exatamente onde está o problema.

### O princípio de arquitetura mais importante daqui
**Dados separados de lógica.** Os casos (`js/casos/`) não contêm programação de
verdade — são fichas estruturadas: personagens, falas, opções, efeitos, ramos. O motor
é genérico e lê qualquer ficha nesse formato. Consequência prática: **para criar uma
audiência nova você não precisa mexer no motor** — só escrever um arquivo de dados e
adicionar uma linha `<script>` no `index.html`. É o mesmo princípio que separa, num
tribunal, o rito (sempre igual) dos autos (sempre diferentes).

### Por que os casos são `.js` e não `.json`?
Detalhe técnico que vale aprender: navegadores **bloqueiam** a leitura de arquivos
`.json` quando a página é aberta por duplo clique (protocolo `file://`, restrição de
segurança chamada CORS). Guardando os dados em arquivos `.js` comuns, o jogo funciona
com duplo clique E no GitHub Pages — sem servidor, sem configuração. Além disso, `.js`
permite algo que JSON não permite: **ramos inteligentes**, em que o destino da história
é uma função que olha suas decisões anteriores (`proxima: function (flags) {...}`).

---

## 🧠 Conceitos de programação que este projeto ensina (para quem está começando)

- **HTML** = o esqueleto (telas, botões, caixas) · **CSS** = a pele (cores, fontes,
  animações) · **JavaScript** = os músculos e o cérebro (regras, reações, memória).
- **Estado**: um único objeto (`estado` no `motor.js`) guarda tudo o que muda —
  reputação, relógio, decisões. Salvar o jogo = transformar esse objeto em texto
  (`JSON.stringify`) e guardar no navegador (`localStorage`).
- **Flags**: "lembretes" que suas decisões acendem (`mpuRevogada: true`) e que cenas
  futuras consultam. É assim que o jogo "se lembra" de você.
- **SVG**: desenho descrito por código — por isso conseguimos trocar a expressão de um
  personagem ou girar o ponteiro do relógio em tempo real.
- **Web Audio**: o som do martelo não é um arquivo .mp3 — é sintetizado pelo navegador
  na hora.

---

## ❓ Perguntas frequentes

**O jogo afirma teses jurídicas?** Ele cita fundamentos reais (sempre conferíveis no
Modo Estudo), mas é obra de ficção educativa: casos, pessoas e comarca são inventados, e
a "pontuação" das escolhas é uma leitura pedagógica, não um gabarito oficial de conduta.

**Funciona no celular?** Sim — o layout se adapta. Publicado no GitHub Pages, vira um
link que abre em qualquer aparelho.

**Onde fica meu progresso?** No `localStorage` do navegador usado. Trocou de navegador
ou limpou os dados de navegação, o save se vai (a Fase 2, com contas online, resolve isso).

**E o multiplayer com advogados, promotores e defensores jogáveis?** Está desenhado em
detalhe em `docs/ARQUITETURA-MULTIPLAYER.md` — neste protótipo esses papéis são
interpretados pelo próprio jogo (NPCs que reagem às suas decisões), porque multiplayer
em tempo real exige um serviço de sincronização (Firebase), que é exatamente a Fase 2.

**Posso mudar nomes, casos, textos?** Deve! O jogo foi construído para ser editado.
Comece por `docs/CRIANDO-CASOS.md`.

---

*TOGA é um protótipo educacional. Os dispositivos legais citados estavam vigentes na
data de criação; o Direito muda — confira sempre a redação atual.*
