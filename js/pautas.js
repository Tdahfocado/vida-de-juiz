/* ============================================================
   TOGA — pautas.js : OS DIAS DE TRABALHO
   ------------------------------------------------------------
   Cada "pauta" é um dia jogável: um conjunto ordenado de casos
   (referenciados pelo id declarado em js/casos/*.js).

   O menu mostra um cartão por pauta; o save guarda qual dia
   está em andamento. Interlúdios e manchetes podem declarar
   `pauta: "dia2"` para valer só naquele dia (default: "dia1";
   `pauta: "*"` vale para todos).
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.pautas = [
  {
    id: "dia1",
    titulo: "Dia 1 — Dia de Audiências",
    subtitulo: "Seis audiências, uma comarca inteira de olho.",
    casos: ["protetiva", "guarda", "vizinhos", "thor", "gatos", "juri"]
  },
  {
    id: "dia2",
    titulo: "Dia 2 — Dia Decisivo",
    subtitulo: "Plantão e vara única: seis decisões que mudam vidas em horas.",
    casos: ["custodia", "saude", "acolhimento", "despejo", "beneficio", "instrucao"]
  },
  {
    id: "dia3",
    titulo: "Dia 3 — Plantão Noturno",
    subtitulo: "O fórum dorme; o Judiciário, não. Quatro urgências entre 21h40 e meia-noite.",
    inicio: "21:30",   // o relógio do expediente começa aqui (motor.js)
    casos: ["entrega", "transfusao", "internacao", "madrugada"]
  },
  {
    id: "dia4",
    titulo: "Dia 4 — Dia de Júri",
    subtitulo: "Um plenário, sete jurados, a comarca inteira assistindo. Você preside.",
    casos: ["feminicidio"]
  }
];
