let storedTheme = localStorage.getItem("darkMode");
const darkModeToggle = document.querySelector(".theme-toggle");
const headerSubject = document.getElementById("header-subject");
const quizMenu = document.getElementById("quiz-menu");

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

quizMenu.addEventListener("click", (event) => {
  const selectedButton = event.target.closest("button[data-quiz-type]");
  if (!selectedButton) return;
  const selectedSubject = selectedButton.dataset.quizType;
  console.log(selectedSubject);
});
