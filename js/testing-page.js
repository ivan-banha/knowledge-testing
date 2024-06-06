import { state } from "./state.js";
import { getTestingCardTemplate } from "./templates.js";

window.onload = function () {
  renderQuestions();
};

window.goHome = function () {
  state.resetSelectedTopic();

  // https://stackoverflow.com/questions/12564999/onclick-page-go-to-homepage-without-any-absolute-path
  window.location = "/";
};

window.checkAnswers = function () {
  const answeredQuestions = state.selectedTopic.selectedQuestions.filter(
    (question) => !!question.selectedAnswerId,
  );

  const hasUnansweredQuestions =
    state.selectedTopic.selectedQuestions.length > answeredQuestions.length;

  if (hasUnansweredQuestions) {
    return highlightUnansweredQuestions(answeredQuestions);
  }

  const parent = document.querySelector(".button-submit-questions");
  parent.children[0].remove();
  disableAllRadioInputs();

  const summary = {
    topicId: state.selectedTopic.id,
    correctAnswers: 0,
    totalQuestions: state.selectedTopic.selectedQuestions.length,
  };

  for (const question of answeredQuestions) {
    const isCorrectAnswer = question.selectedAnswerId === question.answerId;

    const correctOption = document.getElementById(question.answerId);
    correctOption.parentElement.classList.add("correct-option");

    const card = correctOption.closest("li");
    const resultIcon = card.querySelector(".card-result-icon");
    resultIcon.classList.add("visible-card-result-icon");

    if (isCorrectAnswer) {
      summary.correctAnswers++;
      resultIcon.src = "./assets/green-checkbox.png";
      resultIcon.alt = "Правильна відповідь";
      continue;
    }

    const incorrectOption = document.getElementById(question.selectedAnswerId);
    incorrectOption.parentElement.classList.add("wrong-option");

    resultIcon.src = "./assets/red-stop.png";
    resultIcon.alt = "Не правильна відповідь";
  }

  const template = document
    .getElementById("testing-results-template")
    .content.cloneNode(true);

  const resultSummary = template.querySelector("p");
  resultSummary.innerText = `Ви відповіли правильно на ${summary.correctAnswers} з ${summary.totalQuestions} питань`;

  state.addHistory(summary);
  parent.appendChild(template);
};

function renderQuestions() {
  const container = document.getElementById("question-cards");

  state.selectedTopic.selectedQuestions.forEach((question) => {
    const card = makeTestingCard(question);

    container.append(card);
  });
}

function makeTestingCard(question) {
  const template = getTestingCardTemplate();

  const listNode = template.querySelector("li");
  listNode.id = question.id;

  const title = template.querySelector("legend");
  title.innerText = question.question;

  const optionsContainer = template.querySelector(".card-options-container");
  const optionTemplate = template.querySelector(".card-options");

  question.answers.forEach((answer) => {
    const option = makeAnswerOption(optionTemplate, question, answer);

    optionsContainer.appendChild(option);
  });

  optionTemplate.remove();

  return template;
}

function makeAnswerOption(template, question, answer) {
  const option = template.cloneNode(true);

  const radioInput = option.querySelector("input");

  radioInput.id = answer.id;
  radioInput.name = question.id;
  radioInput.value = answer.id;

  radioInput.addEventListener("click", (e) => {
    const card = e.target.closest("li");

    const questionId = card.id;
    const answerId = e.target.id;

    const question = state.selectedTopic.selectedQuestions.find(
      (question) => question.id === questionId,
    );

    question.selectedAnswerId = answerId;
    card.classList.remove("unanswered-card");
  });

  const label = option.querySelector("label");

  // https://stackoverflow.com/questions/15750290/setting-the-html-label-for-attribute-in-javascript
  label.htmlFor = answer.id;
  label.innerText = answer.answer;

  return option;
}

function highlightUnansweredQuestions(answeredQuestions) {
  const answeredQuestionsIds = answeredQuestions.map((question) => question.id);

  state.selectedTopic.selectedQuestions.forEach((question) => {
    const isAnswered = answeredQuestionsIds.includes(question.id);

    if (isAnswered) {
      return;
    }

    const questionCard = document.getElementById(question.id);

    questionCard.classList.add("unanswered-card");
  });
}

function disableAllRadioInputs() {
  const inputs = document.getElementsByTagName("input");
  Array.from(inputs).forEach((input) => {
    input.disabled = true;
  });
}
