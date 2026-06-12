const state = {
    stage: null,
    index: 0,
    hp: 100,
    points: 0,
    locked: false,
    combo: 0,
    bestCombo: 0,
    time: 15,
    timer: null
};

/* ===================== STAGES ===================== */
const stages = [
{
name: "Good Habits 😄",
questions: [
{ q: "Brush teeth?", options: ["Once", "Twice", "Never", "Sometimes"], a: 1 },
{ q: "Breakfast is?", options: ["Bad", "Good", "Optional", "Useless"], a: 1 }
]
},
{
name: "Awareness ⚠️",
questions: [
{ q: "Fire is?", options: ["Safe", "Dangerous", "Toy", "Food"], a: 1 },
{ q: "Traffic rules?", options: ["Ignore", "Follow", "Break", "Skip"], a: 1 }
]
}
];

/* ===================== START GAME ===================== */
function startGame() {
    state.stage = null;
    state.index = 0;
    state.hp = 100;
    state.points = 0;
    state.combo = 0;
    state.bestCombo = 0;

    clearInterval(state.timer);

    document.getElementById("resultScreen")?.classList.add("hidden");

    updateUI();
    showStages();
}

/* ===================== SHOW STAGES ===================== */
function showStages() {
    const menu = document.getElementById("stageMenu");
    if (!menu) return;

    document.getElementById("stageTitle").innerText = "🎮 Choose Your Stage";

    menu.innerHTML = stages.map((s, i) =>
        `<button onclick="selectStage(${i})">${s.name}</button>`
    ).join("");

    document.getElementById("question").innerHTML =
        "👉 Select a stage to start";
}

/* ===================== SELECT STAGE ===================== */
function selectStage(i) {
    state.stage = i;
    state.index = 0;
    state.hp = Math.max(state.hp, 0);
    state.combo = 0;

    loadQuestion();
}

/* ===================== LOAD QUESTION ===================== */
function loadQuestion() {
    if (state.stage === null) return;

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
        <div class="q-text">${q.q}</div>

        <div class="mcq-grid">
            ${q.options.map((o, i) =>
                `<button onclick="answer(${i})">${o}</button>`
            ).join("")}
        </div>

        <p>⏱ Time: <span id="time">${state.time}</span>s</p>
    `;

    updateUI();
}

/* ===================== TIMER ===================== */
function startTimer() {
    state.timer = setInterval(() => {
        state.time--;

        const t = document.getElementById("time");
        if (t) t.innerText = state.time;

        if (state.time <= 0) {
            clearInterval(state.timer);
            timeout();
        }
    }, 1000);
}

/* ===================== TIMEOUT ===================== */
function timeout() {
    state.hp -= 10;
    state.combo = 0;

    if (state.hp <= 0) return gameOver();

    nextQuestion();
}

/* ===================== ANSWER ===================== */
function answer(i) {
    if (state.locked) return;
    state.locked = true;

    clearInterval(state.timer);

    const stage = stages[state.stage];
    const q = stage.questions[state.index];
    const buttons = document.querySelectorAll(".mcq-grid button");

    buttons[q.a]?.classList.add("correct");

    if (i === q.a) {
        state.points += 10;
        state.combo++;
    } else {
        buttons[i]?.classList.add("wrong");
        state.hp -= 10;
        state.combo = 0;
    }

    if (state.combo > state.bestCombo) {
        state.bestCombo = state.combo;
    }

    updateUI();

    if (state.hp <= 0) {
        setTimeout(gameOver, 500);
        return;
    }

    setTimeout(nextQuestion, 600);
}

/* ===================== NEXT QUESTION ===================== */
function nextQuestion() {
    state.index++;

    if (state.stage === null) return;

    const stage = stages[state.stage];

    if (state.index >= stage.questions.length) {
        return showResult();
    }

    loadQuestion();
}

/* ===================== RESULT SCREEN ===================== */
function showResult() {
    clearInterval(state.timer);

    const screen = document.getElementById("resultScreen");
    screen.classList.remove("hidden");

    const stageName = stages[state.stage].name;

    document.getElementById("resultTitle").innerText =
        `${stageName} Complete 🎉`;

    let stars = 1;
    if (state.points >= 20) stars = 2;
    if (state.points >= 40) stars = 3;

    document.getElementById("resultScore").innerText =
        `Score: ${state.points} | Combo: ${state.bestCombo}`;

    document.getElementById("stars").innerText =
        "⭐".repeat(stars);

    unlockStage();
    saveGame();
}

/* ===================== GAME OVER ===================== */
function gameOver() {
    clearInterval(state.timer);

    const screen = document.getElementById("resultScreen");
    screen.classList.remove("hidden");

    document.getElementById("resultTitle").innerText =
        "💀 Game Over";

    document.getElementById("resultScore").innerText =
        `Score: ${state.points} | Best Combo: ${state.bestCombo}`;

    document.getElementById("stars").innerText = "";
}

/* ===================== UNLOCK SYSTEM ===================== */
function unlockStage() {
    let unlocked = parseInt(localStorage.getItem("unlock") || "0");

    if (state.stage >= unlocked) {
        localStorage.setItem("unlock", state.stage + 1);
    }
}

/* ===================== UI ===================== */
function updateUI() {
    const hp = document.getElementById("hpText");
    const points = document.getElementById("points");
    const bar = document.getElementById("hpBar");

    if (hp) hp.innerText = Math.max(0, state.hp);
    if (points) points.innerText = state.points;
    if (bar) bar.style.width = Math.max(0, state.hp) + "%";
}

/* ===================== NEXT STAGE BUTTON ===================== */
function nextStage() {
    document.getElementById("resultScreen")?.classList.add("hidden");

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

/* ===================== SAVE ===================== */
function saveGame() {
    localStorage.setItem("mcq_save", JSON.stringify({
        points: state.points,
        hp: state.hp,
        combo: state.bestCombo
    }));
}

/* ===================== INIT ===================== */
startGame();
