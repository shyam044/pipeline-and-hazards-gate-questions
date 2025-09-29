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
    title: "Question‑01: ~ GATE 2024 Set-02 [MSQ]",
    questionText: `An instruction format has the following structure:<br>
    <strong>Instruction Number: Opcode destination reg, source reg-1, source reg-2</strong><br><br>
    Consider the following sequence of instructions to be executed in a pipelined processor:<br>
    I1: DIV R3, R1, R2<br>
    I2: SUB R5, R3, R4<br>
    I3: ADD R3, R5, R6<br>
    I4: MUL R7, R3, R8<br><br>
    Which of the following statements is/are TRUE?`,
    options: [
      { id: "opt1", text: "(A) There is a RAW dependency on R3 between I1 and I2" },
      { id: "opt2", text: "(B) There is a WAR dependency on R3 between I1 and I3" },
      { id: "opt3", text: "(C) There is a RAW dependency on R3 between I2 and I3" },
      { id: "opt4", text: "(D) There is a WAW dependency on R3 between I3 and I4" }
    ],
    correct: ["opt1"],
    explanation: `✅ Option (A) is correct because there is a <strong>Read After Write (RAW)</strong> dependency on register <code>R3</code> between instructions I1 and I2. I1 writes to R3, and I2 reads from R3, so I2 must wait for I1 to finish.<br><br>
❌ Option (B) is incorrect because I3 is writing to R3, not reading it before I1 writes — this would be a WAR (Write After Read), but that’s not happening here.<br><br>
❌ Option (C) is incorrect because I2 writes to R5, and I3 reads R5 — so the RAW is on R5, not R3.<br><br>
❌ Option (D) is incorrect because although both I3 and I4 reference R3, only I3 writes to it — I4 reads R3. So, no Write After Write (WAW) dependency exists.`
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
