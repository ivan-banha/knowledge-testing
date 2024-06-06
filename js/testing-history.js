import { state } from "./state.js";

console.log("testing history");

window.onload = function () {
  renderHistory();
};

function renderHistory() {
  const historyItemsContainer = document.getElementById(
    "history-items-container",
  );
  const historyItemTemplate = document.getElementById(
    "history-item-template",
  ).content;

  state.history.sort((firstItem, secondItem) => {
    return firstItem.createdAt > secondItem.createdAt ? -1 : 1;
  });

  state.history.forEach((history, index, items) => {
    const topic = state.topics.find((topic) => topic.id === history.topicId);
    const historyItem = historyItemTemplate.cloneNode(true);

    const itemTopic = historyItem.querySelector(".history-topic");
    itemTopic.innerText = `Тема: ${topic.title}`;

    const order = historyItem.querySelector(".history-order");
    order.innerText = items.length - index;

    const scores = historyItem.querySelector(".history-scores");
    scores.innerText = `Бали: ${history.correctAnswers} з ${history.totalQuestions}`;

    historyItemsContainer.appendChild(historyItem);
  });
}
