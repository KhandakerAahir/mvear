const state = {
    stage: 0,
    index: 0,
    hp: 100,
    points: 0,
    xp: 0,
    level: 1,
    combo: 0,
    bestCombo: 0,
    locked: false,
    time: 15,
    timer: null
};

/* ================= STAGES ================= */
const stages = [
{
name: "Good Habits",
questions: [
{q:"Brush teeth?", options:["Once","Twice","Never","Sometimes"], a:1},
{q:"Breakfast is?", options:["Bad","Good","Optional","Useless"], a:1}
]
},
{
name: "Awareness",
questions: [
{q:"Fire is?", options:["Safe","Dangerous","Toy","Food"], a:1},
{q:"Traffic rules?", options:["Ignore","Follow","Break","Optional"], a:1}
]
}
];

/* ================= SOUND ================= */
const sound = {
    correct: new Audio("correct.mp3"),
    wrong: new Audio("wrong.mp3")
};

/* ================= START GAME ================= */
function startGame() {
    loadSave();

    state.stage = 0;
    state.index = 0;
    state.hp = 100;
    state.points = 0;
    state.combo = 0;
    state.time = 15;

    document.getElementById("resultScreen").classList.add("hidden");

    updateUI();
    showStages();
}

/* ================= STAGE MENU ================= */
function showStages() {
    document.getElementById("stageTitle").innerText = "Choose Stage";

    document.getElementById("stageMenu").innerHTML =
    stages.map((s, i) => {
        let unlocked = i <= getUnlockedStage();
        return `
        <button ${!unlocked ? "disabled" : ""} onclick="selectStage(${i})">
            ${s.name} ${unlocked ? "" : "🔒"}
        </button>`;
    }).join("");

    document.getElementById("question").innerHTML =
        "Select a stage to begin";
}

/* ================= UNLOCK SYSTEM ================= */
function getUnlockedStage() {
    return parseInt(localStorage.getItem("unlock") || "0");
}

function unlockNextStage() {
    let current = getUnlockedStage();
    if (state.stage >= current) {
        localStorage.setItem("unlock", state.stage + 1);
    }
}

/* ================= SELECT STAGE ================= */
function selectStage(i) {
    state.stage = i;
    state.index = 0;
    state.combo = 0;
    state.time = 15;

    loadQuestion();
}

/* ================= LOAD QUESTION ================= */
function loadQuestion() {
    const stage = stages[state.stage];
    const q = stage.questions[state.index];

    state.locked = false;
    state.time = 15;

    clearInterval(state.timer);
    startTimer();

    const box = document.getElementById("question");
    box.classList.remove("fade");
    void box.offsetWidth;
    box.classList.add("fade");

    box.innerHTML = `
        <div><b>${q.q}</b></div>
        <div class="mcq-grid">
            ${q.options.map((o, i) =>
                `<button onclick="answer(${i})">${o}</button>`
            ).join("")}
        </div>
        <p>⏱ Time: <span id="time">${state.time}</span>s</p>
    `;

    updateUI();
}

/* ================= TIMER ================= */
function startTimer() {
    state.timer = setInterval(() => {
        state.time--;
        document.getElementById("time").innerText = state.time;

        if (state.time <= 0) {
            clearInterval(state.timer);
            timeout();
        }
    }, 1000);
}

/* ================= TIMEOUT ================= */
function timeout() {
    state.hp -= 10;
    state.combo = 0;
    nextQuestion();
}

/* ================= ANSWER SYSTEM ================= */
function answer(i) {
    if (state.locked) return;
    state.locked = true;

    clearInterval(state.timer);

    const stage = stages[state.stage];
    const q = stage.questions[state.index];
    const buttons = document.querySelectorAll(".mcq-grid button");

    buttons[q.a].classList.add("correct");

    if (i === q.a) {
        state.points += 10;
        state.xp += 10;
        state.combo++;
        sound.correct.play();
    } else {
        buttons[i].classList.add("wrong");
        state.hp -= 10;
        state.combo = 0;
        sound.wrong.play();
    }

    if (state.combo > state.bestCombo) {
        state.bestCombo = state.combo;
    }

    checkLevelUp();
    updateUI();

    if (state.hp <= 0) {
        setTimeout(gameOver, 600);
        return;
    }

    setTimeout(nextQuestion, 700);
}

/* ================= LEVEL SYSTEM ================= */
function checkLevelUp() {
    if (state.xp >= 50) {
        state.level++;
        state.xp = 0;
    }
}

/* ================= NEXT QUESTION ================= */
function nextQuestion() {
    state.index++;
    state.locked = false;

    if (state.index >= stages[state.stage].questions.length) {
        showResult();
        return;
    }

    loadQuestion();
}

/* ================= RESULT SCREEN ================= */
function showResult() {
    unlockNextStage();

    document.getElementById("resultScreen").classList.remove("hidden");

    document.getElementById("resultTitle").innerText =
        stages[state.stage].name + " Complete 🎉";

    let stars = 1;
    if (state.points >= 20) stars = 2;
    if (state.points >= 40) stars = 3;

    document.getElementById("resultScore").innerText =
        `Score: ${state.points} | Level: ${state.level} | Combo: ${state.bestCombo}`;

    document.getElementById("stars").innerText = "⭐".repeat(stars);

    saveGame();
}

/* ================= GAME OVER ================= */
function gameOver() {
    document.getElementById("resultScreen").classList.remove("hidden");

    document.getElementById("resultTitle").innerText = "💀 Game Over";

    document.getElementById("resultScore").innerText =
        `Score: ${state.points} | Level: ${state.level}`;

    document.getElementById("stars").innerText = "";
}

/* ================= NEXT STAGE BUTTON ================= */
function nextStage() {
    document.getElementById("resultScreen").classList.add("hidden");

    if (state.stage < stages.length - 1) {
        state.stage++;
    } else {
        state.stage = 0;
    }

    state.index = 0;
    state.hp = 100;
    state.combo = 0;

    loadQuestion();
}

/* ================= UI UPDATE ================= */
function updateUI() {
    document.getElementById("hpText").innerText = state.hp;
    document.getElementById("points").innerText = state.points;
    document.getElementById("hpBar").style.width = state.hp + "%";
}

/* ================= SAVE SYSTEM ================= */
function saveGame() {
    localStorage.setItem("mcq_save", JSON.stringify({
        unlock: getUnlockedStage(),
        level: state.level
    }));
}

function loadSave() {
    const data = JSON.parse(localStorage.getItem("mcq_save") || "{}");
    if (data.level) state.level = data.level;
}

/* ================= START ================= */
startGame();
