let currentUser = null;

let state = {
    xp: 0,
    level: 1,
    coins: 0,
    hp: 100,
    achievements: [],
    lastDaily: ""
};

/* =========================
   ELEMENTS
========================= */
const loginBox = document.getElementById("loginBox");
const game = document.getElementById("game");

const xpEl = document.getElementById("xp");
const levelEl = document.getElementById("level");
const coinsEl = document.getElementById("coins");
const hpBar = document.getElementById("hpBar");

const questionEl = document.getElementById("question");
const bossQ = document.getElementById("bossQ");
const msgEl = document.getElementById("msg");
const boardEl = document.getElementById("board");
const achEl = document.getElementById("achievements");
const dailyMsg = document.getElementById("dailyMsg");

/* =========================
   STORAGE HELPERS
========================= */
function saveData() {
    if (!currentUser) return;
    localStorage.setItem("mvear_" + currentUser, JSON.stringify(state));
}

function loadData(user) {
    return JSON.parse(localStorage.getItem("mvear_" + user));
}

/* =========================
   AUTH SYSTEM
========================= */
function register() {
    const u = user.value.trim();
    const p = pass.value.trim();

    if (!u || !p) return setMsg("Fill all fields");

    if (localStorage.getItem("mvear_" + u))
        return setMsg("User already exists");

    const newUser = {
        pass: p,
        xp: 0,
        level: 1,
        coins: 50,
        hp: 100,
        achievements: [],
        lastDaily: ""
    };

    localStorage.setItem("mvear_" + u, JSON.stringify(newUser));
    setMsg("Registered successfully!");
}

function login() {
    const u = user.value.trim();
    const p = pass.value.trim();

    const data = loadData(u);

    if (!data) return setMsg("User not found");
    if (data.pass !== p) return setMsg("Wrong password");

    currentUser = u;

    state.xp = data.xp;
    state.level = data.level;
    state.coins = data.coins;
    state.hp = data.hp;
    state.achievements = data.achievements || [];
    state.lastDaily = data.lastDaily || "";

    loginBox.classList.add("hidden");
    game.classList.remove("hidden");

    render();
}

/* =========================
   GAME CORE
========================= */
function addXP(amount) {
    state.xp += amount;
    state.coins += 5;

    const requiredXP = state.level * 100;

    if (state.xp >= requiredXP) {
        state.level++;
        unlock("Level Up!");
    }

    saveData();
    render();
}

/* =========================
   QUIZ SYSTEM
========================= */
let quizActive = false;
let correctAnswer = false;

function startQuiz() {
    quizActive = true;

    const questions = [
        { q: "2 + 2 = 4?", a: true },
        { q: "Earth is flat?", a: false },
        { q: "Water is H2O?", a: true }
    ];

    const q = questions[Math.floor(Math.random() * questions.length)];

    questionEl.innerText = q.q;
    correctAnswer = q.a;
}

function answer(userAns) {
    if (!quizActive) return;

    if (userAns === correctAnswer) {
        addXP(20);
        unlock("Quiz Master");
    } else {
        state.hp -= 10;
    }

    quizActive = false;
    render();
}

/* =========================
   BOSS SYSTEM
========================= */
let bossActive = false;

function startBoss() {
    bossActive = true;
    bossQ.innerText = "Boss: 10 + 10 = ?";
    correctAnswer = true;
}

function bossAnswer(ans) {
    if (!bossActive) return;

    if (ans === correctAnswer) {
        addXP(50);
        unlock("Boss Slayer");
    } else {
        state.hp -= 20;
    }

    bossActive = false;
    render();
}

/* =========================
   SHOP
========================= */
function buy(type) {
    if (type === "heal" && state.coins >= 30) {
        state.hp = 100;
        state.coins -= 30;
    }

    if (type === "xp" && state.coins >= 20) {
        state.xp += 40;
        state.coins -= 20;
    }

    if (type === "life" && state.coins >= 50) {
        state.hp = 100;
        state.coins -= 50;
        unlock("Survivor");
    }

    saveData();
    render();
}

/* =========================
   DAILY REWARD
========================= */
function dailyReward() {
    const today = new Date().toDateString();

    if (state.lastDaily === today) {
        dailyMsg.innerText = "Already claimed today!";
        return;
    }

    state.lastDaily = today;
    state.coins += 40;

    dailyMsg.innerText = "Daily reward claimed!";
    saveData();
    render();
}

/* =========================
   ACHIEVEMENTS
========================= */
function unlock(name) {
    if (!state.achievements.includes(name)) {
        state.achievements.push(name);
    }
}

/* =========================
   LEADERBOARD
========================= */
function updateLeaderboard() {
    let list = [];

    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);

        if (key.startsWith("mvear_")) {
            try {
                let data = JSON.parse(localStorage.getItem(key));
                list.push({
                    name: key.replace("mvear_", ""),
                    xp: data.xp || 0
                });
            } catch (e) {}
        }
    }

    list.sort((a, b) => b.xp - a.xp);

    boardEl.innerText =
        list.slice(0, 5)
            .map(x => `${x.name} - ${x.xp} XP`)
            .join("\n");
}

/* =========================
   RENDER UI
========================= */
function render() {
    xpEl.innerText = state.xp;
    levelEl.innerText = state.level;
    coinsEl.innerText = state.coins;

    hpBar.style.width = state.hp + "%";

    achEl.innerText =
        state.achievements.length > 0
            ? state.achievements.join(", ")
            : "None";

    updateLeaderboard();
}

/* =========================
   LOGOUT
========================= */
function logout() {
    saveData();
    location.reload();
}

/* =========================
   UI HELPERS
========================= */
function setMsg(text) {
    msgEl.innerText = text;
}
