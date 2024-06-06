export function getQuestionCardTemplate() {
  return document
    .getElementById("question-card-template")
    .content.cloneNode(true);
}

export function getTestingCardTemplate() {
  return document
      .getElementById("testing-card-template")
      .content.cloneNode(true);
}

export function getTopicInfoTemplate() {
  return document.getElementById("topic-info-template").content.cloneNode(true);
}
