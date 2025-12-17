let storedTheme = localStorage.getItem("darkMode");
const darkModeToggle = document.querySelector(".theme-toggle");
const headerSubject = document.getElementById("header-subject");
const quizMenu = document.getElementById("quiz-menu");
const quizQuestion = document.getElementById("quiz-question");
const questionText = document.querySelector(".question-text");
const form = document.querySelector("form");
const errorMessage = document.querySelector(".error-message");
const progressBarInner = document.querySelector(".progress-bar-inner");
const questionNumberDisplay = document.querySelector(".question-number");
const answerLabels = document.querySelectorAll(".quiz-question .option-card");

let currentProgress = 0;
let currentQuestion = 0;

function enableDarkMode() {
  document.body.dataset.theme = "dark";
  localStorage.setItem("darkMode", "enabled");
  darkModeToggle.checked = true;
}

function disableDarkMode() {
  delete document.body.dataset.theme;
  localStorage.setItem("darkMode", "disabled");
  darkModeToggle.checked = false;
}

if (storedTheme === "enabled") {
  enableDarkMode();
}

darkModeToggle.addEventListener("change", () => {
  if (darkModeToggle.checked) {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});

async function getData() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error("Could not fetch data");
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

function startQuiz(quiz) {
  headerSubject.dataset.quizType = quiz.title;
  headerSubject.innerHTML = `
  <img src="${quiz.icon}" alt="">
  <span>${quiz.title}</span>
  `;
  quizMenu.classList.add("hidden");
  quizQuestion.classList.remove("hidden");
  renderQuestion(quiz);
  updateProgressBar();
}

function updateProgressBar() {
  questionNumberDisplay.textContent = currentQuestion + 1;
  progressBarInner.style.setProperty(
    "--progress-value",
    (currentProgress += 10)
  );
}

function checkValidity() {
  if (!form.checkValidity()) {
    errorMessage.classList.add("visible");
    return false;
  } else {
    errorMessage.classList.remove("visible");
    return true;
  }
}

function checkAnswer() {}

function renderQuestion(quiz) {
  const question = quiz?.questions[currentQuestion];
  if (!question) return;
  questionText.textContent = question.question;
  errorMessage.classList.remove("visible");
  question.options.forEach((choice, index) => {
    const input = answerLabels[index].querySelector('input[type="radio"]');
    input.value = choice;
    input.checked = false;
    const text = answerLabels[index].querySelector(".text");
    text.textContent = choice;
  });
}

quizMenu.addEventListener("click", async (event) => {
  const menuOption = event.target.closest("button[data-quiz-type]");
  if (!menuOption) return;
  const quizData = await getData();
  if (!quizData) return;
  const quizTitle = menuOption.dataset.quizType;
  const selectedQuiz = quizData.quizzes.find(
    (quiz) => quiz.title === quizTitle
  );
  startQuiz(selectedQuiz);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!checkValidity()) {
    return;
  }
  currentQuestion++;
});
