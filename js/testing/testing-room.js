import { state } from "../state.js";

console.log("Testing room");

window.onload = function () {
  console.log("Render questions", state);
  renderQuestions();
};

window.checkAnswers = function () {
  console.log("Check answers!");

  const questionsIds = state.selectedTopic.selectedQuestions.map(
    (question) => question.id,
  );

  const answeredQuestions = state.selectedTopic.selectedQuestions.filter(
    (question) => !!question.selectedAnswerId,
  );

  const hasUnansweredQuestions = questionsIds.length > answeredQuestions.length;

  if (hasUnansweredQuestions) {
    console.log("Has unanswered questions");

    const answeredQuestionsIds = answeredQuestions.map(
      (question) => question.id,
    );

    const unansweredQuestions = questionsIds.filter(
      (questionId) => !answeredQuestionsIds.includes(questionId),
    );

    unansweredQuestions.forEach((questionId) => {
      const questionCard = document.getElementById(questionId);

      questionCard.classList.add("unanswered-card");
    });

    return;
  }

  const parent = document.querySelector(".button-submit-questions");

  parent.children[0].remove();

  const summary = {
    topicId: state.selectedTopic.id,
    correctAnswers: 0,
    totalQuestions: state.selectedTopic.selectedQuestions.length,
  };

  const inputs = document.getElementsByTagName("input");
  Array.from(inputs).forEach((input) => {
    input.disabled = true;
  });

  for (const question of answeredQuestions) {
    const correctOption = document.getElementById(question.answerId);
    correctOption.parentElement.classList.add("correct-option");

    const isCorrectAnswer = question.selectedAnswerId === question.answerId;

    if (isCorrectAnswer) {
      summary.correctAnswers++;
      continue;
    }

    const incorrectOption = document.getElementById(question.selectedAnswerId);
    incorrectOption.parentElement.classList.add("wrong-option");
  }

  const template = document
    .getElementById("testing-results-template")
    .content.cloneNode(true);

  const resultSummary = template.querySelector("p");
  resultSummary.innerText = `Ви відповіли правильно на ${summary.correctAnswers} з ${summary.totalQuestions} питань`;

  state.addHistory(summary);
  parent.appendChild(template);
};

window.goHome = function () {
  state.resetSelectedTopic();

  // https://stackoverflow.com/questions/12564999/onclick-page-go-to-homepage-without-any-absolute-path
  window.location = "/";
};

function renderQuestions() {
  const container = document.getElementById("question-cards");

  state.selectedTopic.selectedQuestions.forEach((question) => {
    const template = getCardTemplate();

    const listNode = template.querySelector("li");
    listNode.id = question.id;

    const title = template.querySelector("legend");
    title.innerText = question.question;

    const optionsContainer = template.querySelector("fieldset");
    const optionTemplate = template.querySelector(".card-options");

    question.answers.forEach((answer) => {
      const option = optionTemplate.cloneNode(true);

      const input = option.querySelector("input");

      input.id = answer.id;
      input.name = question.id;
      input.value = answer.id;

      input.addEventListener("click", (e) => {
        const card = e.target.closest("li");

        if (card.classList.contains("unanswered-card")) {
          card.classList.remove("unanswered-card");
        }

        const questionId = card.id;
        const answerId = e.target.id;

        const question = state.selectedTopic.selectedQuestions.find(
          (question) => question.id === questionId,
        );

        question.selectedAnswerId = answerId;

        console.log(
          `Selected answer "${answerId}" for question "${questionId}"`,
        );
      });

      const label = option.querySelector("label");
      label.innerText = answer.answer;

      // https://stackoverflow.com/questions/15750290/setting-the-html-label-for-attribute-in-javascript
      label.htmlFor = answer.id;

      optionsContainer.appendChild(option);
    });

    optionTemplate.remove();

    container.append(template);
  });
}

export function getCardTemplate() {
  return document
    .getElementById("testing-card-template")
    .content.cloneNode(true);
}
