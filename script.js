let storedTheme = localStorage.getItem("darkMode");
const darkModeToggle = document.querySelector(".theme-toggle");

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
