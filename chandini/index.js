const textDisplay = document.getElementById("textDisplay");
const input = document.getElementById("input");

const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const accEl = document.getElementById("accuracy");
const cpmEl = document.getElementById("cpm");
const scoreList = document.getElementById("scores");

let timer, time = 60;
let started = false;

const paragraphs = [
  "Practice typing daily to improve your speed and accuracy.",
  "JavaScript enables dynamic and interactive web pages.",
  "Consistency and focus are keys to mastering typing skills."
];

// Load paragraph with span wrapping
function loadText() {
  const random = paragraphs[Math.floor(Math.random() * paragraphs.length)];
  textDisplay.innerHTML = random.split("").map(char => `<span>${char}</span>`).join("");
}

// Start
function startTest() {
  if (started) return;
  started = true;

  timer = setInterval(() => {
    time--;
    timeEl.textContent = time;

    if (time === 0) {
      clearInterval(timer);
      saveScore();
    }
  }, 1000);
}

// Typing Logic
input.addEventListener("input", () => {
  const characters = textDisplay.querySelectorAll("span");
  const typed = input.value.split("");

  let correct = 0;

  characters.forEach((charSpan, index) => {
    const char = typed[index];

    if (char == null) {
      charSpan.classList.remove("correct", "incorrect");
    } else if (char === charSpan.innerText) {
      charSpan.classList.add("correct");
      charSpan.classList.remove("incorrect");
      correct++;
    } else {
      charSpan.classList.add("incorrect");
      charSpan.classList.remove("correct");
    }
  });

  let accuracy = (correct / typed.length) * 100 || 100;
  accEl.textContent = Math.floor(accuracy);

  let elapsed = 60 - time;
  let wpm = (typed.length / 5) / (elapsed / 60) || 0;
  let cpm = typed.length / elapsed * 60 || 0;

  wpmEl.textContent = Math.floor(wpm);
  cpmEl.textContent = Math.floor(cpm);
});

// Save Score (Leaderboard)
function saveScore() {
  let scores = JSON.parse(localStorage.getItem("scores")) || [];
  scores.push(wpmEl.textContent);
  scores.sort((a,b) => b - a);
  localStorage.setItem("scores", JSON.stringify(scores.slice(0,5)));
  displayScores();
}

// Display Leaderboard
function displayScores() {
  let scores = JSON.parse(localStorage.getItem("scores")) || [];
  scoreList.innerHTML = scores.map(s => `<li>${s} WPM</li>`).join("");
}

// Restart
function restart() {
  clearInterval(timer);
  time = 60;
  started = false;
  input.value = "";
  timeEl.textContent = time;
  loadText();
}

// Init
loadText();
displayScores();