
/* =========================
   GAME STATE
========================= */
let state = {
    currentStage: 0,
    currentQ: 0,
    locked: false
};

/* =========================
   STAGES + MCQ QUESTIONS
========================= */
const stages = [
{
name: "Good Habits",
questions: [
{
q: "Brush teeth how many times a day?",
options: ["Once", "Twice", "Never", "Sometimes"],
a: 1
},
{
q: "Skipping breakfast is:",
options: ["Good", "Bad", "Optional", "Best"],
a: 1
},
{
q: "Clean room means:",
options: ["Good habit", "Bad habit", "Danger", "None"],
a: 0
},
{
q: "Sleeping late is:",
options: ["Healthy", "Unhealthy", "Best", "Required"],
a: 1
},
{
q: "Washing hands helps:",
options: ["Spread germs", "Remove germs", "Increase dirt", "Nothing"],
a: 1
}
]
}
];

/* =========================
   START GAME
========================= */
function startGame() {
    state.currentStage = 0;
    state.currentQ = 0;
    loadQuestion();
}

/* =========================
   LOAD QUESTION
========================= */
function loadQuestion() {

    const stage = stages[state.currentStage];
    const q = stage.questions[state.currentQ];

    state.locked = false;

    document.getElementById("stageTitle").innerText =
        "Stage: " + stage.name;

    document.getElementById("question").innerHTML = `
        <div class="q-text">${q.q}</div>

        <div class="mcq-grid">
            <button onclick="answer(0)">${q.options[0]}</button>
            <button onclick="answer(1)">${q.options[1]}</button>
            <button onclick="answer(2)">${q.options[2]}</button>
            <button onclick="answer(3)">${q.options[3]}</button>
        </div>
    `;
}

/* =========================
   ANSWER SYSTEM (FIXED MCQ CORE)
========================= */
function answer(i) {

    if (state.locked) return;
    state.locked = true;

    const stage = stages[state.currentStage];
    const q = stage.questions[state.currentQ];

    const buttons = document.querySelectorAll(".mcq-grid button");

    // highlight correct
    buttons[q.a].classList.add("correct");

    // wrong answer highlight
    if (i !== q.a) {
        buttons[i].classList.add("wrong");
    }

    // delay before next question
    setTimeout(() => {

        state.currentQ++;

        // stage finished
        if (state.currentQ >= stage.questions.length) {

            state.currentStage++;
            state.currentQ = 0;

            // game finished
            if (state.currentStage >= stages.length) {
                document.getElementById("question").innerHTML =
                    "<h2>🎉 ALL STAGES COMPLETED!</h2>";
                return;
            }
        }

        loadQuestion();

    }, 900);
}
