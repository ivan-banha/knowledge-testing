import { state } from "./state.js";
import { getRandomQuestion } from "./util.js";
import { getQuestionCardTemplate, getTopicInfoTemplate } from "./templates.js";

let swapsLeft = 0;

window.onload = function () {
  renderTopicInfo();

  const shouldRestoreSelectedQuestions =
    state.selectedTopic.selectedQuestions.length > 0;

  if (shouldRestoreSelectedQuestions) {
    renderExistingQuestions();
  } else {
    renderTipQuestion();
  }
};

window.startTesting = function () {
  // https://stackoverflow.com/questions/12564999/onclick-page-go-to-homepage-without-any-absolute-path
  window.location = "/testing";
};

function renderTipQuestion() {
  swapsLeft = state.selectedTopic.maxSwaps;

  const cardTemplate = getQuestionCardTemplate();
  const nodes = getNodesFromCard(cardTemplate);

  nodes.title.innerText = "Виберіть питання, на яке хочете дати відповідь";
  nodes.attemptsCounter.innerText = swapsLeft;
  nodes.confirmQuestionBtn.addEventListener("click", (event) => {
    const card = event.target.closest("li");

    confirmQuestion(card);
  });
  nodes.changeQuestionBtn.addEventListener("click", function (event) {
    nodes.confirmQuestionBtn.disabled = false;

    const card = event.target.closest("li");
    const question = getRandomQuestion();

    updateQuestionCard(card, question);
    swapsLeft--;
  });

  const container = document.getElementById("question-cards");
  container.append(cardTemplate);
}

function confirmQuestion(card) {
  const questionId = card.id;
  const question = state.selectedTopic.questions.find(
    (question) => question.id === questionId,
  );
  const nodes = getNodesFromCard(card);

  state.addSelectedQuestion(question);

  nodes.confirmQuestionBtn.remove();
  nodes.changeQuestionBtn.remove();
  nodes.attemptsCounter.remove();

  const shouldShowNextQuestion =
    state.selectedTopic.maxQuestions >
    state.selectedTopic.selectedQuestions.length;

  if (shouldShowNextQuestion) {
    renderNextQuestion();
  } else {
    const submitButton = document.querySelector(".submit");
    submitButton.disabled = false;
  }
}

function renderTopicInfo() {
  const topicInfo = getTopicInfoTemplate();
  const container = document.getElementById("topic-info");

  // https://stackoverflow.com/questions/16302045/finding-child-element-of-parent-with-javascript
  const title = topicInfo.querySelector("h1");
  const description = topicInfo.querySelector("p");

  title.innerText = state.selectedTopic.title;
  description.innerHTML = `
        Тест буде складатись з ${state.selectedTopic.maxQuestions} питань, в кожного питання буде функція заміни
        <br />
        питання, при якій питання змінитися на інше, можливо це буде складніше, а
        <br />
        можливо легше. Ви можете змінити питання лише ${state.selectedTopic.maxSwaps} рази
  `;

  container.appendChild(topicInfo);
}

function renderExistingQuestions() {
  const container = document.getElementById("question-cards");

  state.selectedTopic.selectedQuestions.forEach((question) => {
    const cardTemplate = getQuestionCardTemplate();
    cardTemplate.id = question.id;

    const nodes = getNodesFromCard(cardTemplate);

    nodes.title.innerText = question.question;
    nodes.attemptsCounter.remove();
    nodes.confirmQuestionBtn.remove();
    nodes.changeQuestionBtn.remove();

    container.append(cardTemplate);
  });

  renderNextQuestion();
}

function renderNextQuestion() {
  swapsLeft = state.selectedTopic.maxSwaps;
  const questionCard = getQuestionCardTemplate();
  const container = document.getElementById("question-cards");
  const question = getRandomQuestion();

  const card = questionCard.querySelector("li");
  updateQuestionCard(card, question);

  const nodes = getNodesFromCard(questionCard);

  nodes.confirmQuestionBtn.disabled = false;
  nodes.confirmQuestionBtn.addEventListener("click", (event) => {
    const card = event.target.closest("li");
    confirmQuestion(card);
  });

  nodes.changeQuestionBtn.addEventListener("click", function (event) {
    swapsLeft--;

    const card = event.target.closest("li");
    const question = getRandomQuestion();

    updateQuestionCard(card, question);
  });

  container.append(questionCard);
}

function updateQuestionCard(card, question) {
  const nodes = getNodesFromCard(card);

  card.id = question.id;

  nodes.title.innerText = question.question;
  nodes.attemptsCounter.innerText = swapsLeft;

  if (swapsLeft === 0) {
    nodes.changeQuestionBtn.disabled = true;

    confirmQuestion(card);
  }
}

function getNodesFromCard(card) {
  const title = card.querySelector(".card-title");
  const attemptsCounter = card.querySelector(".attempts-counter");
  const confirmQuestionBtn = card.querySelector(".confirm-question");
  const changeQuestionBtn = card.querySelector(".change-question");

  return {
    title,
    attemptsCounter,
    confirmQuestionBtn,
    changeQuestionBtn,
  };
}
