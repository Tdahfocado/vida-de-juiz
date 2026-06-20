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
  },
  {
    id: "dia5",
    titulo: "Dia 5 — Dia Eleitoral",
    subtitulo: "Como juiz eleitoral, uma AIJE de compra de votos: a prova é clara, e é nula. Decida contra a multidão.",
    inicio: "14:00",
    casos: ["aije"]
  },
  {
    id: "dia6",
    titulo: "Dia 6 — Dia no Juizado Especial",
    subtitulo: "Audiências de instrução no próprio Juizado: dois criminais (som alto na LCP e moto sem CNH — desproporção e atipicidade) e dois cíveis. Conclua para destravar a festa do 4º título.",
    inicio: "09:00",
    casos: ["jecc-somalto", "jecc-cnh", "jecc-negativacao", "jecc-vicio"]
  }
];
