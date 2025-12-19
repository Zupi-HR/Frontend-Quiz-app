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
const submitBtn = document.querySelector(".submit-btn");
const nextBtn = document.querySelector(".next-btn");
const quizCompleted = document.getElementById("quiz-completed");
const finalScore = document.querySelector(".score-card strong");
const resultSubject = document.querySelector(".score-card .header-subject");
const playAgainBtn = document.querySelector(".play-again-btn");

let currentQuestion = 0;
let currentScore = 0;
let currentQuiz = null;

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
  resetGame();
  currentQuiz = quiz;
  headerSubject.dataset.quizType = currentQuiz.title;
  headerSubject.innerHTML = `
  <img src="${currentQuiz.icon}" alt="">
  <span>${currentQuiz.title}</span>
  `;
  quizMenu.classList.add("hidden");
  quizQuestion.classList.remove("hidden");
  renderQuestion(currentQuiz);
  updateProgressBar();
}

function updateProgressBar() {
  questionNumberDisplay.textContent = currentQuestion + 1;
  const progress = (currentQuestion + 1) * 10;
  progressBarInner.style.setProperty("--progress-value", progress);
  document
    .querySelector(".progress-bar")
    .setAttribute("aria-valuenow", progress);
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

function checkAnswer(form) {
  const selectedInput = form.querySelector('input[name="answer"]:checked');
  if (!selectedInput) {
    return;
  }
  const selectedLabel = selectedInput.closest(".option-card");
  const selectedAnswer = selectedInput.value;
  const correctAnswer = currentQuiz.questions[currentQuestion].answer;

  if (selectedAnswer === correctAnswer) {
    selectedLabel.classList.add("correct");
    currentScore++;
  } else {
    selectedLabel.classList.add("incorrect");
    const allOptions = form.querySelectorAll('input[name="answer"]');
    allOptions.forEach((option) => {
      if (option.value === correctAnswer) {
        option
          .closest(".option-card")
          .querySelector(".icon-correct").style.display = "block";
      }
    });
  }
}

function renderQuestion(quiz) {
  const question = quiz?.questions[currentQuestion];
  if (!question) return;
  questionText.textContent = question.question;
  errorMessage.classList.remove("visible");
  question.options.forEach((choice, index) => {
    answerLabels[index].classList.remove("correct", "incorrect");
    const correctIcon = answerLabels[index].querySelector(".icon-correct");
    if (correctIcon) correctIcon.style.display = "";
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

function finishQuiz() {
  quizQuestion.classList.add("hidden");

  quizCompleted.classList.remove("hidden");
  finalScore.textContent = currentScore;
  resultSubject.innerHTML = headerSubject.innerHTML;
  resultSubject.dataset.quizType = currentQuiz.title;
}

function resetGame() {
  currentQuestion = 0;
  currentScore = 0;
  currentQuiz = null;
  form.querySelector("fieldset").disabled = false;
  delete headerSubject.dataset.quizType;
  headerSubject.innerHTML = "";
  quizCompleted.classList.add("hidden");
  submitBtn.classList.remove("hidden");
  nextBtn.classList.add("hidden");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!checkValidity()) {
    return;
  }
  form.querySelector("fieldset").disabled = true;
  checkAnswer(e.target);
  submitBtn.classList.add("hidden");
  nextBtn.classList.remove("hidden");
});

nextBtn.addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < currentQuiz.questions.length) {
    form.querySelector("fieldset").disabled = false;
    renderQuestion(currentQuiz);
    updateProgressBar();
    nextBtn.classList.add("hidden");
    submitBtn.classList.remove("hidden");
  } else {
    finishQuiz();
  }
});

playAgainBtn.addEventListener("click", () => {
  quizMenu.classList.remove("hidden");
  resetGame();
});
