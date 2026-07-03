export const questions = [
  {
    id: 1,
    question: "Dans combien de pays se déroule la Coupe du Monde 2026 ?",
    answers: ["2", "3", "4", "1"],
    correct: 1,
    emoji: "🌍",
  },
  {
    id: 2,
    question: "Combien d'équipes participent à la Coupe du Monde 2026 ?",
    answers: ["32", "48", "40", "36"],
    correct: 1,
    emoji: "⚽",
  },
  {
    id: 3,
    question: "Quel pays organise la Coupe du Monde 2026 avec les États-Unis et le Mexique ?",
    answers: ["Brésil", "Canada", "Japon", "Espagne"],
    correct: 1,
    emoji: "🍁",
  },
  {
    id: 4,
    question: "Quel pays a remporté la Coupe du Monde 2022 au Qatar ?",
    answers: ["France", "Argentine", "Brésil", "Espagne"],
    correct: 1,
    emoji: "🏆",
  },
  {
    id: 5,
    question: "Combien de fois le Brésil a-t-il remporté la Coupe du Monde ?",
    answers: ["4", "5", "6", "3"],
    correct: 1,
    emoji: "🇧🇷",
  },
  {
    id: 6,
    question: "Qui détient le record de buts en Coupe du Monde ?",
    answers: ["Ronaldo (Brésil)", "Miroslav Klose", "Pelé", "Gerd Müller"],
    correct: 1,
    emoji: "👟",
  },
  {
    id: 7,
    question: "Dans quelle ville américaine se trouve le SoFi Stadium, un des stades de 2026 ?",
    answers: ["New York", "Los Angeles", "Dallas", "Miami"],
    correct: 1,
    emoji: "🏟️",
  },
  {
    id: 8,
    question: "Quel joueur a marqué le but de la victoire en finale 2022 ?",
    answers: ["Messi", "Montiel (pen)", "Di María", "Álvarez"],
    correct: 1,
    emoji: "🎯",
  },
  {
    id: 9,
    question: "La Coupe du Monde 1930 a eu lieu dans quel pays ?",
    answers: ["Brésil", "Uruguay", "Argentine", "France"],
    correct: 1,
    emoji: "📅",
  },
  {
    id: 10,
    question: "Quel gardien a arrêté 3 penaltys en finale 2022 ?",
    answers: ["Lloris", "Martínez", "Alisson", "De Gea"],
    correct: 1,
    emoji: "🧤",
  },
  {
    id: 11,
    question: "Combien de groupes y aura-t-il en phase de groupe à la CdM 2026 ?",
    answers: ["8", "12", "16", "10"],
    correct: 1,
    emoji: "📊",
  },
  {
    id: 12,
    question: "Quelle nation africaine a atteint les demi-finales en 2022 ?",
    answers: ["Sénégal", "Maroc", "Ghana", "Cameroun"],
    correct: 1,
    emoji: "🌍",
  },
  {
    id: 13,
    question: "Qui a remporté le Ballon d'Or du tournoi (Golden Ball) en 2022 ?",
    answers: ["Mbappé", "Messi", "Modric", "Benzema"],
    correct: 1,
    emoji: "⭐",
  },
  {
    id: 14,
    question: "Combien de buts Kylian Mbappé a-t-il marqué en finale 2022 ?",
    answers: ["2", "3", "1", "4"],
    correct: 1,
    emoji: "🇫🇷",
  },
  {
    id: 15,
    question: "Quel est le surnom de l'équipe nationale du Brésil ?",
    answers: ["La Celeste", "La Seleção", "La Furia", "Les Bleus"],
    correct: 1,
    emoji: "🟡",
  },
  {
    id: 16,
    question: "En quelle année la France a-t-elle remporté sa première Coupe du Monde ?",
    answers: ["1994", "1998", "2002", "1990"],
    correct: 1,
    emoji: "🇫🇷",
  },
  {
    id: 17,
    question: "Quel stade accueillera la finale de la CdM 2026 ?",
    answers: ["Rose Bowl", "MetLife Stadium", "AT&T Stadium", "Azteca"],
    correct: 1,
    emoji: "🏆",
  },
  {
    id: 18,
    question: "Qui a remporté le Soulier d'Or (Golden Boot) en 2022 ?",
    answers: ["Messi", "Mbappé", "Álvarez", "Giroud"],
    correct: 1,
    emoji: "👟",
  },
  {
    id: 19,
    question: "Combien de Coupes du Monde l'Allemagne a-t-elle remportées ?",
    answers: ["3", "4", "5", "2"],
    correct: 1,
    emoji: "🇩🇪",
  },
  {
    id: 20,
    question: "La Coupe du Monde 2026 commencera en quel mois ?",
    answers: ["Mai", "Juin", "Juillet", "Août"],
    correct: 1,
    emoji: "📆",
  },
];

function shuffleAnswers(q) {
  const shuffled = [...q.answers].sort(() => Math.random() - 0.5);
  const correctText = q.answers[q.correct];
  return { ...q, answers: shuffled, correct: shuffled.indexOf(correctText) };
}

/* Infinite question pool - reshuffles when exhausted */
let _pool = [];
export function nextQuestion() {
  if (_pool.length === 0)
    _pool = [...questions].sort(() => Math.random() - 0.5);
  return shuffleAnswers(_pool.pop());
}

export function getShuffledQuestions(count = 10) {
  return [...questions].sort(() => Math.random() - 0.5)
    .slice(0, count).map(shuffleAnswers);
}
