# Testes de ponta a ponta do TOGA

Bateria de regressão que joga o jogo de verdade num Chrome headless
(via Playwright), abrindo o `index.html` por `file://` — exatamente
como o jogador abre.

## Preparação (uma vez)

Os testes usam o **Google Chrome instalado no sistema** (não baixam
navegador). Instale apenas a biblioteca de controle, em qualquer pasta
(fora do projeto, para não criar `node_modules` aqui):

```bash
mkdir -p ~/toga-testes && cd ~/toga-testes
npm init -y && npm i playwright-core
```

## Como rodar

De dentro da pasta onde instalou o `playwright-core`:

```bash
node /caminho/para/vida-de-juiz/tools/testes/teste-fluxo.js
```

(ou copie os testes para a pasta de instalação — eles localizam o
`index.html` pela posição do arquivo, então mantenha-os em
`tools/testes/` e rode com `NODE_PATH` apontando para o
`node_modules` da pasta de instalação, p.ex.:
`NODE_PATH=~/toga-testes/node_modules node tools/testes/teste-fluxo.js`)

Screenshots são gravados na pasta atual.

## O que cada teste cobre

| Arquivo | Cobre |
|---|---|
| `teste-fluxo.js` | **Regressão principal**: o bot (`TOGA.debug3d.botDia`) joga o dia inteiro em 2D e em 3D; falha se travar ou se houver qualquer erro de JS. Rode após QUALQUER mudança. |
| `teste-dia2.js` | Dia 2 completo em 2D/3D com escolhas variadas; desenho da Alice (interlúdio + lembrança no gabinete); cinemática inversa da custódia. |
| `teste-prisao.js` | Cinemática de prisão dirigida (protetiva → preventiva): escolta até a cela + persistência da cela após reload (`sincronizarCela`). |
| `teste-mobile.js` | Emulação Pixel 7: joystick virtual anda, tap no aviso interage, fog reduzido. |
| `teste-camera.js` | Diretor de câmera: orador centralizado (NDC≈0), FOV 58⇄48, retorno ao plano geral na decisão. |
| `teste-fase5.js` | Grifos (persistência por reabertura e por reload), grifo por foco, pauta-pasta, jornal do epílogo com virada de página. |
| `teste-fase6.js` | Acessibilidade: teclado nas decisões (↑/↓/Enter), alto contraste persistente, ARIA, reduced-motion. |

## Validador estrutural (sem navegador)

```bash
node tools/validar-casos.js
```

Confere a integridade dos 12 casos, das pautas e dos despachos
(cenas órfãs, destinos inexistentes, grifos que não batem com o texto,
melhor opção previsível em 1º lugar etc.). Deve terminar com `0 erro(s)`.
