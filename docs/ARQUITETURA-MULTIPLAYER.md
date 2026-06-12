# 🎭 Arquitetura do Multiplayer (Fase 2)

> **A visão**: audiências com pessoas de verdade em cada cadeira — um jogador como juiz,
> outros como advogado do autor, advogado do réu, promotor de justiça e defensor
> público. Antes da audiência, cada equipe traça estratégia em sala privada: instrui
> suas partes (NPCs), escolhe teses e formula perguntas. Na audiência, as perguntas são
> submetidas ao juiz-jogador, que defere, indefere ou manda reformular — e todos sentem
> as consequências em tempo real.

Este documento explica **por que** isso não está no protótipo, **como** será feito sem
perder a hospedagem gratuita e **o que** no código atual já prepara o terreno.

---

## 1. A restrição técnica, em linguagem simples

O protótipo é um site **estático**: arquivos parados que o navegador de cada pessoa
baixa e executa sozinho. É o que permite jogar com duplo clique e hospedar de graça no
GitHub Pages.

Multiplayer em tempo real exige o oposto: um ponto central que receba a jogada de A e
entregue a B em milissegundos. Isso é um **backend** (servidor). O GitHub Pages não
executa servidores — só entrega arquivos.

**A ponte: Firebase (Google).** O Firebase oferece "backend como serviço": o jogo
continua sendo um site estático no GitHub Pages, mas conversa, via JavaScript, com um
banco de dados em tempo real na nuvem (Realtime Database). Quando o juiz defere uma
pergunta, o Firebase avisa todos os navegadores conectados àquela sala em ~100 ms.
O plano gratuito (Spark) comporta dezenas de partidas simultâneas — mais que suficiente
para turmas, cursos e escolas judiciais.

```
[Navegador do Juiz]      [Navegador do Promotor]      [Navegador da Defesa]
        \                        |                            /
         \_______________________|___________________________/
                                 |
                    Firebase Realtime Database
                  (o "estado da audiência" mora aqui)
                                 |
                 GitHub Pages (entrega o jogo, como hoje)
```

## 2. Papéis e poderes

| Papel | Joga como | Poderes principais |
|---|---|---|
| **Juiz** | preside | abre/encerra atos, decide objeções, defere/indefere perguntas, decide incidentes, sentencia |
| **Advogado(a) do autor / da vítima** | equipe A | tese, instrução das partes-NPC, perguntas, objeções, propostas de acordo |
| **Advogado(a) do réu** | equipe B | idem, pelo outro polo |
| **Promotor(a) de Justiça** | custos legis / acusação | pareceres, requerimentos (ex.: preventiva), perguntas, recursos |
| **Defensor(a) Público(a)** | assistência | acompanha a parte vulnerável, objeções, requerimentos protetivos |

As **partes e testemunhas continuam NPCs** — e isso é uma decisão de design, não uma
limitação: o NPC responde conforme a *instrução prévia* recebida da equipe na fase de
estratégia (agressiva, contida, emocional...) combinada com a *qualidade da pergunta*
feita. Instruiu mal ou perguntou induzindo? A testemunha-NPC derrapa na frente de todos.

## 3. O fluxo de uma partida

1. **Lobby** — o juiz cria a sala e recebe um código (ex.: `TOGA-7F3K`); os demais
   entram com o código e escolhem papéis livres.
2. **Distribuição** — todos recebem os mesmos autos; cada equipe recebe ainda um
   **dossiê privado** (informações que só o seu cliente sabe — inclusive as ruins).
3. **Fase de estratégia (10 min, sala privada por equipe)** — cada equipe: escolhe a
   tese (entre 2–3 alternativas com prós/contras), instrui suas partes-NPC e redige até
   N perguntas por depoente. O juiz, enquanto isso, estuda os autos e marca focos — como
   no protótipo.
4. **Audiência síncrona** — o juiz preside seguindo o roteiro processual do caso;
   perguntas das equipes entram numa fila visível ao juiz, que defere/indefere/manda
   reformular (a outra equipe pode objetar antes da decisão); NPCs respondem conforme
   instrução + qualidade da pergunta; incidentes dos casos (a retratação, o "teste do
   apego"...) viram momentos de requerimento e decisão ao vivo.
5. **Deliberação e sentença** — o juiz decide; o sistema avalia **todos**: o juiz pelos
   eixos atuais (técnica, humanidade, celeridade, imparcialidade) e cada equipe por
   *desempenho técnico* (teses sustentáveis, perguntas deferidas, objeções acolhidas),
   não apenas por "ganhar" — porque advogar bem uma causa difícil vale mais que vencer
   uma fácil.

## 4. Esboço do estado compartilhado (Realtime Database)

```json
{
  "salas": {
    "TOGA-7F3K": {
      "casoId": "protetiva",
      "fase": "estrategia",
      "jogadores": {
        "uid1": { "nome": "Sérgio", "papel": "juiz", "pronto": true },
        "uid2": { "nome": "Marina", "papel": "mp", "pronto": false }
      },
      "estrategia": {
        "equipeReu": { "tese": "t2", "instrucoes": { "ivan": "contido" },
                        "perguntas": [ { "para": "marlene", "texto": "..." } ] }
      },
      "audiencia": {
        "cenaAtual": "c3",
        "filaPerguntas": [ { "de": "uid2", "para": "ivan", "texto": "...", "status": "pendente" } ],
        "decisoes": [ { "cena": "c2", "opcao": 0, "ts": 1730000000 } ],
        "reputacaoJuiz": { "tec": 58, "hum": 62, "cel": 50, "imp": 55 }
      }
    }
  }
}
```

Regras de segurança do Firebase garantem que cada equipe só lê a própria pasta de
estratégia — o "segredo de justiça" do dossiê privado é imposto pelo banco, não por
confiança.

## 5. O que o código atual JÁ prepara

- **Casos como dados**: o mesmo arquivo de caso serve aos dois modos — basta acrescentar
  campos (`dossiePrivado`, `teses`, `bancoDePerguntas`) sem quebrar o single-player.
- **Motor separado da interface**: o `motor.js` não sabe se quem decidiu foi um clique
  local ou uma mensagem do Firebase — trocar a origem do evento é cirurgia pequena.
- **Papéis já estruturados** nos personagens (`papel: "Promotor"`, `"Defensora Pública"`...):
  são as cadeiras que os jogadores ocuparão.
- **Objeções e decisões sobre perguntas** já são mecânica central do protótipo — no
  multiplayer, apenas trocam o autor (jogador, em vez de roteiro).

## 6. Degrau intermediário: modo "passa o celular" (hot-seat)

Antes do Firebase, há um degrau sem backend nenhum: **multiplayer local**. Na fase de
estratégia, cada jogador pega o aparelho na sua vez (a tela esconde os dossiês dos
demais); na audiência, o aparelho circula a cada decisão de papel. Tecnicamente é só
gestão de turnos sobre o motor atual — ótimo para testar o desenho do multiplayer em
sala de aula antes de investir na sincronização online.

## 7. Custos e contas (transparência total)

| Item | Custo |
|---|---|
| GitHub Pages (hospedagem) | R$ 0 |
| Firebase Spark (até ~100 conexões simultâneas, 1 GB) | R$ 0 |
| Domínio próprio (opcional, ex.: toga.jus.br não — algo como togajogo.com.br) | ~R$ 40/ano |

A Fase 2 inteira cabe no custo zero. O que ela pede é tempo de desenvolvimento — e o
roteiro está em `ROADMAP.md`.
