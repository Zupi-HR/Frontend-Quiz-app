let storedTheme = localStorage.getItem("darkMode");
const darkModeToggle = document.querySelector(".theme-toggle");
const headerSubject = document.getElementById("header-subject");
const quizMenu = document.getElementById("quiz-menu");
const quizQuestion = document.getElementById("quiz-question");

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
