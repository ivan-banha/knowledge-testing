import { state } from "./state.js";

export function getRandomInt(min, max) {
  return Math.ceil(Math.random() * (max - min) + min);
}

export function getRandomQuestion() {
  const lastIndex = state.selectedTopic.questions.length - 1;

  while (true) {
    const randomIndex = getRandomInt(0, lastIndex);
    const randomQuestion = state.selectedTopic.questions[randomIndex];

    const isAlreadySelected = state.selectedTopic.selectedQuestions.some(
      (question) => question.id === randomQuestion.id,
    );

    if (isAlreadySelected) {
      continue;
    }

    return randomQuestion;
  }
}
