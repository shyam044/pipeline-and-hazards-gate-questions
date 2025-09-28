// DOM references
const timeDisplay = document.getElementById("timeDisplay");
const questionTitleEl = document.getElementById("question-title");
const questionBoxEl = document.getElementById("question-box");
const explanationEl = document.getElementById("explanation");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const explainBtn = document.getElementById("explainBtn");

const questions = [
  {
    id: 1,
    title: "Question‑01: ~ GATE 2024 Set‑01 [MSQ]",
    questionText: "Consider a Boolean expression given by F(X, Y, Z) = Σ(3,5,6,7). Which of the following statements is/are CORRECT?",
    options: [
      { id: "opt1", text: "(A) F(X,Y,Z) = Π(0,1,2,4)" },
      { id: "opt2", text: "(B) F(X,Y,Z) = XY + YZ + XZ" },
      { id: "opt3", text: "(C) F(X,Y,Z) is independent of input Y" },
      { id: "opt4", text: "(D) F(X,Y,Z) is independent of input X" }
    ],
    correct: ["opt1", "opt2"],
    explanation: "Option A is correct because the zero‑minterms are 0,1,2,4 → F = Π(0,1,2,4).<br>Option B is correct because simplifying Σ(3,5,6,7) yields XY + YZ + XZ."
  },
  {
    id: 2,
    title: "Question‑02: ~ GATE 2024 Set‑02 [MSQ]",
    questionText: "For a Boolean variable x, which of the following statements is/are FALSE?",
    options: [
      { id: "opt1", text: "(A) x·1 = x" },
      { id: "opt2", text: "(B) x + 1 = x" },
      { id: "opt3", text: "(C) x·x = 0" },
      { id: "opt4", text: "(D) x + x̅ = 1" }
    ],
    correct: ["opt2", "opt3"],
    explanation: "In Boolean algebra:<br>(B) is FALSE because x + 1 = 1 always, so cannot equal x.<br>(C) is FALSE because x·x = x, not 0."
  }
];

let currentIndex = 0;
let questionTimer = null;
let counter = 0;

function startTimer() {
  counter = 0;
  if (questionTimer !== null) {
    clearInterval(questionTimer);
  }
  questionTimer = setInterval(() => {
    counter++;
    let hrs = Math.floor(counter / 3600);
    let mins = Math.floor((counter % 3600) / 60);
    let secs = counter % 60;
    let timeStr = `Time: ${hrs > 0 ? hrs + " hr " : ""}${mins > 0 ? mins + " min " : ""}${secs} sec`;
    timeDisplay.textContent = timeStr;
  }, 1000);
}

function renderQuestion() {
  const q = questions[currentIndex];
  questionTitleEl.textContent = q.title;

  let html = `<p class="lead font-weight-bold">${q.questionText}</p>`;
  q.options.forEach(opt => {
    html += `
      <div class="form-check mb-2">
        <input class="form-check-input" type="checkbox" id="${opt.id}">
        <label class="form-check-label" for="${opt.id}">${opt.text}</label>
      </div>`;
  });
  html += `
    <div class="text-center mt-4">
      <button class="btn btn-primary btn-lg" id="submitBtn">Submit</button>
    </div>
    <p id="feedback" class="feedback mt-4 text-center"></p>
    <p id="timeTaken" class="text-center font-italic text-muted"></p>
  `;

  questionBoxEl.innerHTML = html;

  // Hide explanation by default for each new question
  explanationEl.classList.add("d-none");
  explanationEl.innerHTML = `<strong>Explanation:</strong><br>${q.explanation}`;

  document.getElementById("submitBtn").addEventListener("click", checkAnswer);

  // Start timer fresh
  startTimer();
}

function checkAnswer() {
  const q = questions[currentIndex];
  const feedbackEl = document.getElementById("feedback");
  const timeTakenEl = document.getElementById("timeTaken");

  const checked = q.options
    .filter(opt => document.getElementById(opt.id).checked)
    .map(opt => opt.id);

  const isCorrect = (checked.length === q.correct.length) &&
    checked.every(id => q.correct.includes(id));

  if (isCorrect) {
    feedbackEl.textContent = "✔ Correct";
    feedbackEl.style.color = "green";
  } else if (checked.length === 0) {
    alert("Please select at least one option before submitting.");
    return;
  } else {
    feedbackEl.textContent = "✘ Wrong";
    feedbackEl.style.color = "red";
  }

  timeTakenEl.textContent = `You took ${timeDisplay.textContent} to solve this question.`;

  if (questionTimer !== null) {
    clearInterval(questionTimer);
  }

  // Shade correct and wrong options
  q.options.forEach(opt => {
    const checkboxEl = document.getElementById(opt.id);
    const container = checkboxEl.closest(".form-check");
    container.classList.remove("option-correct", "option-wrong");

    if (q.correct.includes(opt.id)) {
      // correct option — shade green
      container.classList.add("option-correct");
    } else if (checkboxEl.checked && !q.correct.includes(opt.id)) {
      // user selected a wrong option — shade red
      container.classList.add("option-wrong");
    }
  });

  // Do not auto reveal explanation — user must click the button
}

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  } else {
    // If on first question already, redirect to that URL
    window.location.href = "https://shyam044.github.io/gate-questions/";
  }
});

nextBtn.addEventListener("click", () => {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  }
});

explainBtn.addEventListener("click", () => {
  explanationEl.classList.remove("d-none");
});

// Initialise
renderQuestion();
