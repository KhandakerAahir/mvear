
/* =========================
   GAME STATE
========================= */
const state = {
    stage: 0,
    index: 0,
    locked: false
};

/* =========================
   MCQ DATA
========================= */
const stages = [
{
name: "Good Habits",
questions: [
{ q: "Brush teeth how many times a day?", options: ["Once", "Twice", "Never", "Sometimes"], a: 1 },
{ q: "Skipping breakfast is:", options: ["Good", "Bad", "Optional", "Best"], a: 1 },
{ q: "Clean room means:", options: ["Good habit", "Bad habit", "Danger", "None"], a: 0 },
{ q: "Sleeping late is:", options: ["Healthy", "Unhealthy", "Best", "Required"], a: 1 },
{ q: "Washing hands helps:", options: ["Spread germs", "Remove germs", "Increase dirt", "Nothing"], a: 1 }
]
}
];

/* =========================
   START GAME
========================= */
function startGame() {
    state.stage = 0;
    state.index = 0;
    loadQuestion();
}

/* =========================
   LOAD QUESTION (SAFE)
========================= */
function loadQuestion() {

    const stage = stages[state.stage];

    if (!stage) return;

    const q = stage.questions[state.index];

    if (!q) return;

    state.locked = false;

    document.getElementById("stageTitle").textContent =
        `Stage: ${stage.name}`;

    document.getElementById("question").innerHTML = `
        <div class="q-text">${q.q}</div>

        <div class="mcq-grid">
            ${q.options.map((opt, i) =>
                `<button onclick="answer(${i})">${opt}</button>`
            ).join("")}
        </div>
    `;
}

/* =========================
   ANSWER SYSTEM (BUG-FREE CORE)
========================= */
function answer(i) {

    if (state.locked) return;
    state.locked = true;

    const stage = stages[state.stage];
    const q = stage.questions[state.index];

    const buttons = document.querySelectorAll(".mcq-grid button");

    if (!q || !buttons.length) return;

    // show correct
    buttons[q.a].classList.add("correct");

    // show wrong
    if (i !== q.a) {
        buttons[i].classList.add("wrong");
    }

    setTimeout(nextQuestion, 800);
}

/* =========================
   NEXT QUESTION FLOW (SAFE)
========================= */
function nextQuestion() {

    const stage = stages[state.stage];

    if (!stage) return;

    state.index++;

    // stage complete
    if (state.index >= stage.questions.length) {
        state.stage++;
        state.index = 0;

        // game complete
        if (state.stage >= stages.length) {
            document.getElementById("question").innerHTML =
                "<h2>🎉 ALL STAGES COMPLETED</h2>";
            return;
        }
    }

    loadQuestion();
}
