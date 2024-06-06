import { state } from "../state.js";
import { getRandomQuestion } from "./util.js";
import { getTopicInfoTemplate, getCardTemplate } from "./templates.js";

console.log("Questions JS loaded");

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

function confirmQuestion(card) {
  const questionId = card.id;
  const question = state.selectedTopic.questions.find(
    (question) => question.id === questionId,
  );

  state.addSelectedQuestion(question);

  const confirmQuestionBtn = card.querySelector(".confirm-question");
  const changeQuestionBtn = card.querySelector(".change-question");
  const attemptsCounter = card.querySelector(".attempts-counter");

  confirmQuestionBtn.remove();
  changeQuestionBtn.remove();
  attemptsCounter.remove();

  const shouldShowNextQuestion =
    state.selectedTopic.maxQuestions >
    state.selectedTopic.selectedQuestions.length;

  if (shouldShowNextQuestion) {
    renderNextQuestion();
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
    const questionCard = getCardTemplate();

    question.id = question.id;

    const title = questionCard.querySelector(".card-title");
    title.innerText = question.question;

    const attemptsCounter = questionCard.querySelector(".attempts-counter");
    attemptsCounter.remove();

    const confirmQuestionBtn = questionCard.querySelector(".confirm-question");
    confirmQuestionBtn.remove();

    const changeQuestionBtn = questionCard.querySelector(".change-question");
    changeQuestionBtn.remove();

    container.append(questionCard);
  });

  renderNextQuestion();
}

function renderTipQuestion() {
  swapsLeft = state.selectedTopic.maxSwaps;
  const questionCard = getCardTemplate();
  const container = document.getElementById("question-cards");

  const title = questionCard.querySelector(".card-title");
  const attemptsCounter = questionCard.querySelector(".attempts-counter");
  title.innerText = "Виберіть питання, на яке хочете дати відповідь";
  attemptsCounter.innerText = swapsLeft;

  const confirmQuestionBtn = questionCard.querySelector(".confirm-question");
  const changeQuestionBtn = questionCard.querySelector(".change-question");

  confirmQuestionBtn.addEventListener("click", (event) => {
    confirmQuestion(event.target.closest("li"));
  });

  changeQuestionBtn.addEventListener("click", function (event) {
    confirmQuestionBtn.disabled = false;

    const card = event.target.closest("li");
    const question = getRandomQuestion();

    updateQuestionCard(card, question);

    swapsLeft--;

    console.log("click 2", card);
  });

  console.log(questionCard, confirmQuestionBtn, changeQuestionBtn);

  container.append(questionCard);
}

function renderNextQuestion() {
  swapsLeft = state.selectedTopic.maxSwaps;
  const questionCard = getCardTemplate();
  const container = document.getElementById("question-cards");
  const question = getRandomQuestion();

  updateQuestionCard(questionCard, question);

  const confirmQuestionBtn = questionCard.querySelector(".confirm-question");
  const changeQuestionBtn = questionCard.querySelector(".change-question");

  confirmQuestionBtn.addEventListener("click", (event) => {
    confirmQuestion(event.target.closest("li"));
  });

  changeQuestionBtn.addEventListener("click", function (event) {
    confirmQuestionBtn.disabled = false;

    const card = event.target.closest("li");
    const question = getRandomQuestion();

    updateQuestionCard(card, question);

    swapsLeft--;

    console.log("click 2", card);
  });

  console.log(questionCard, confirmQuestionBtn, changeQuestionBtn);

  container.append(questionCard);
}

function updateQuestionCard(card, question) {
  card.id = question.id;

  const title = card.querySelector(".card-title");
  const attemptsCounter = card.querySelector(".attempts-counter");

  title.innerText = question.question;
  attemptsCounter.innerText = swapsLeft;

  if (swapsLeft === 0) {
    const changeQuestionBtn = card.querySelector(".change-question");
    changeQuestionBtn.disabled = true;

    confirmQuestion(card);
  }
}
