import { state } from "./state.js";

console.log("JS Running");

/**
 * Explanation why it's important to assign a function to window object
 * https://stackoverflow.com/questions/57440091/how-to-have-onclick-function-calling-an-external-module-file
 * https://stackoverflow.com/questions/63655960/how-can-i-call-a-function-from-javascript-module-in-html-onclick
 */

window.addEventListener("load", function () {
  renderSelectedTopic();
});



window.showNextTopic = function () {
  console.log("Show next topic");

  const selectedTopicIndex = state.topics.findIndex(
    (topic) => topic.id === state.selectedTopic.id,
  );

  let nextTopicIndex = selectedTopicIndex + 1;
  const lastTopicIndex = state.topics.length - 1;

  const shouldShowFirstTopic = nextTopicIndex > lastTopicIndex;

  if (shouldShowFirstTopic) {
    nextTopicIndex = 0;
  }

  state.setSelectedTopic(state.topics[nextTopicIndex]);

  renderSelectedTopic();
};

window.showPreviousTopic = function () {
  console.log("showPreviousTopic");

  const selectedTopicIndex = state.topics.findIndex(
    (topic) => topic.id === state.selectedTopic.id,
  );

  let prevTopicIndex = selectedTopicIndex - 1;
  const shouldShowLastTopic = prevTopicIndex < 0;

  if (shouldShowLastTopic) {
    prevTopicIndex = state.topics.length - 1;
  }

  state.setSelectedTopic(state.topics[prevTopicIndex]);

  renderSelectedTopic();
};

function renderSelectedTopic() {
  const topicTitle = document.getElementById("topic-title");
  const topicDescription = document.getElementById("topic-description");
  const startTestLink = document.getElementById("start-test-button");

  topicTitle.innerText = state.selectedTopic.title;
  topicDescription.innerText = `Тест складається з ${state.selectedTopic.maxQuestions} питань`;
  startTestLink.href = `/questions?topicId=${state.selectedTopic.id}`;
}
