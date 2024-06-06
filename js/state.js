import { dataset } from "./topics.js";

console.log("Create state");

const restoredState = restoreState();

let state = {
  topics: restoredState.topics,
  selectedTopic: restoredState.selectedTopic,
  history: restoredState.history,
  // Setters
  setSelectedTopic: (topic) => {
    state.selectedTopic = topic;
    persistState();
  },
  addSelectedQuestion: (question) => {
    state.selectedTopic.selectedQuestions.push(question);
    persistState();
  },
  resetSelectedTopic: () => {
    state.selectedTopic = dataset[0];
    persistState();
  },
  addHistory: (history) => {
    history.createdAt = Date.now();
    state.history.push(history);
    persistState();
  },
};

function persistState() {
  localStorage.setItem("state", JSON.stringify(state));
}

function restoreState() {
  const persistedState = localStorage.getItem("state");

  // Ініціалізувати стан якщо користувач відкрив сторінку вперше
  if (!persistedState) {
    return {
      selectedTopic: dataset[0],
      topics: dataset,
      history: [],
    };
  }

  // Відновити попередній стан
  return JSON.parse(persistedState);
}

window.state = state;

export { state };
