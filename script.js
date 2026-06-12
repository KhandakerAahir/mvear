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

/* ===================== 8 STAGES ===================== */
const stages = [
{
    name: "Good Habits 😄",
    difficulty: 1,
    questions: [
        { q: "Brush teeth?", options: ["Once","Twice","Never","Sometimes"], a: 1 },
        { q: "Breakfast is?", options: ["Bad","Good","Optional","Useless"], a: 1 },
        { q: "Clean room shows?", options: ["Discipline","Lazy","Careless","Nothing"], a: 0 },
        { q: "Sleeping late is?", options: ["Healthy","Unhealthy","Best","Required"], a: 1 },
        { q: "Washing hands removes?", options: ["Dust","Germs","Oil","Color"], a: 1 }
    ]
},
{
    name: "Awareness ⚠️",
    difficulty: 1,
    questions: [
        { q: "Fire is?", options: ["Safe","Dangerous","Toy","Food"], a: 1 },
        { q: "Traffic rules?", options: ["Ignore","Follow","Break","Skip"], a: 1 },
        { q: "Strangers can be?", options: ["Safe","Risky","Family","Pet"], a: 1 },
        { q: "Road crossing?", options: ["Careless","Careful","Running","Blind"], a: 1 },
        { q: "Electric wires are?", options: ["Safe","Dangerous","Toy","Food"], a: 1 }
    ]
},
{
    name: "Environment 🌱",
    difficulty: 2,
    questions: [
        { q: "Trees give?", options: ["Plastic","Oxygen","Smoke","Noise"], a: 1 },
        { q: "Plastic is?", options: ["Good","Bad","Healthy","Safe"], a: 1 },
        { q: "Saving water is?", options: ["Useless","Important","Bad","Optional"], a: 1 },
        { q: "Pollution is?", options: ["Good","Harmful","Funny","Safe"], a: 1 },
        { q: "Recycling helps?", options: ["Nature","Damage","Waste","Nothing"], a: 0 }
    ]
},
{
    name: "Digital Safety 🔐",
    difficulty: 2,
    questions: [
        { q: "OTP should be shared?", options: ["Yes","No","Maybe","Sometimes"], a: 1 },
        { q: "Strong password?", options: ["12345","Name","Mix letters","Blank"], a: 2 },
        { q: "Unknown links are?", options: ["Safe","Dangerous","Game","Friend"], a: 1 },
        { q: "Cyberbullying is?", options: ["Good","Harmful","Funny","Normal"], a: 1 },
        { q: "Same password everywhere?", options: ["Safe","Risky","Best","Smart"], a: 1 }
    ]
},
{
    name: "Moral Values ❤️",
    difficulty: 3,
    questions: [
        { q: "Helping others?", options: ["Bad","Good","Useless","Wrong"], a: 1 },
        { q: "Stealing is?", options: ["Right","Wrong","Normal","Good"], a: 1 },
        { q: "Respect elders?", options: ["Optional","Important","Bad","Useless"], a: 1 },
        { q: "Lying is?", options: ["Good","Bad","Helpful","Required"], a: 1 },
        { q: "Kindness is?", options: ["Weak","Good","Danger","Funny"], a: 1 }
    ]
},
{
    name: "Responsibilities 🧑‍🤝‍🧑",
    difficulty: 3,
    questions: [
        { q: "Students should?", options: ["Study","Play all day","Sleep only","Ignore"], a: 0 },
        { q: "Helping family?", options: ["Bad","Good","Optional","Wrong"], a: 1 },
        { q: "Clean environment?", options: ["Ignore","Maintain","Break","Destroy"], a: 1 },
        { q: "Duty means?", options: ["Responsibility","Fun","Game","Nothing"], a: 0 },
        { q: "Helping society?", options: ["Good","Bad","Optional","Useless"], a: 0 }
    ]
},
{
    name: "Rules 📜",
    difficulty: 4,
    questions: [
        { q: "Rules should be?", options: ["Broken","Followed","Ignored","Removed"], a: 1 },
        { q: "Laws are?", options: ["Useless","Important","Optional","Funny"], a: 1 },
        { q: "Traffic rules?", options: ["Not needed","Important","Danger","Game"], a: 1 },
        { q: "School rules?", options: ["Useless","Important","Optional","Bad"], a: 1 },
        { q: "Discipline is?", options: ["Bad","Good","Weak","None"], a: 1 }
    ]
},
{
    name: "Health 💪",
    difficulty: 4,
    questions: [
        { q: "Exercise is?", options: ["Useless","Important","Danger","Optional"], a: 1 },
        { q: "Junk food?", options: ["Healthy","Unhealthy","Best","Required"], a: 1 },
        { q: "Drink water?", options: ["Never","Daily","Sometimes","Rarely"], a: 1 },
        { q: "Sleep is?", options: ["Important","Useless","Danger","Optional"], a: 0 },
        { q: "Fruits are?", options: ["Healthy","Unhealthy","Bad","Danger"], a: 0 }
    ]
}
];

/* ===================== START ===================== */
function startGame() {
    resetState();
    showStages();
    updateUI();
}

/* ===================== RESET ===================== */
function resetState() {
    clearInterval(state.timer);

    state.stage = null;
    state.index = 0;
    state.hp = 100;
    state.points = 0;
    state.locked = false;
    state.combo = 0;
    state.bestCombo = 0;
}

/* ===================== SHOW STAGES ===================== */
function showStages() {
    document.getElementById("stageTitle").innerText = "🎮 Choose Your Stage";

    const menu = document.getElementById("stageMenu");

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
    state.combo = 0;

    loadQuestion();
}

/* ===================== LOAD QUESTION ===================== */
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
            timeOut();
        }
    }, 1000);
}

/* ===================== TIMEOUT ===================== */
function timeOut() {
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

    let score = 10 + stages[state.stage].difficulty * 2;

    if (i === q.a) {
        state.points += score;
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

    if (state.hp <= 0) return gameOver();

    setTimeout(nextQuestion, 600);
}

/* ===================== NEXT ===================== */
function nextQuestion() {
    state.index++;

    const stage = stages[state.stage];

    if (state.index >= stage.questions.length) {
        return showResult();
    }

    loadQuestion();
}

/* ===================== RESULT ===================== */
function showResult() {
    document.getElementById("resultScreen").classList.remove("hidden");

    const stage = stages[state.stage];

    document.getElementById("resultTitle").innerText =
        stage.name + " Complete 🎉";

    let stars = 1;
    if (state.points > 40) stars = 2;
    if (state.points > 70) stars = 3;

    document.getElementById("resultScore").innerText =
        `Score: ${state.points} | Combo: ${state.bestCombo}`;

    document.getElementById("stars").innerText = "⭐".repeat(stars);

    unlockStage();
}

/* ===================== GAME OVER ===================== */
function gameOver() {
    document.getElementById("resultScreen").classList.remove("hidden");

    document.getElementById("resultTitle").innerText = "💀 Game Over";

    document.getElementById("resultScore").innerText =
        `Score: ${state.points}`;

    document.getElementById("stars").innerText = "";
}

/* ===================== UNLOCK ===================== */
function unlockStage() {
    let unlocked = parseInt(localStorage.getItem("unlock") || "0");

    if (state.stage + 1 > unlocked) {
        localStorage.setItem("unlock", state.stage + 1);
    }
}

/* ===================== UI ===================== */
function updateUI() {
    document.getElementById("hpText").innerText = Math.max(0, state.hp);
    document.getElementById("points").innerText = state.points;
    document.getElementById("hpBar").style.width = Math.max(0, state.hp) + "%";
}

/* ===================== NEXT STAGE BUTTON ===================== */
function nextStage() {
    document.getElementById("resultScreen").classList.add("hidden");

    if (state.stage < stages.length - 1) {
        state.stage++;
    } else {
        startGame();
        return;
    }

    state.index = 0;
    state.hp = 100;
    state.combo = 0;

    loadQuestion();
}

/* ===================== INIT ===================== */
startGame();
