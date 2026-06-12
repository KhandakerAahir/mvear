
/* =========================
   GAME STATE
========================= */
const state = {
    stage: 0,
    index: 0,
    xp: 0,
    coins: 0,
    hp: 100,
    locked: false,
    timer: null,
    timeLeft: 15
};

/* =========================
   STAGES (8 × 5 MCQs)
========================= */
const stages = [
{
name: "Good Habits",
questions: [
{q:"Brush teeth how many times a day?", options:["Once","Twice","Never","Sometimes"], a:1},
{q:"Skipping breakfast is:", options:["Good","Bad","Optional","Best"], a:1},
{q:"Clean room means:", options:["Good habit","Bad habit","Danger","None"], a:0},
{q:"Sleeping late is:", options:["Healthy","Unhealthy","Best","Required"], a:1},
{q:"Washing hands helps:", options:["Spread germs","Remove germs","Increase dirt","Nothing"], a:1}
]
},

{
name: "Awareness",
questions: [
{q:"Fire is:", options:["Safe","Dangerous","Toy","Food"], a:1},
{q:"Traffic rules should be:", options:["Ignored","Followed","Broken","Optional"], a:1},
{q:"Strangers are:", options:["Safe","Risky","Friends","Family"], a:1},
{q:"Cross road should be:", options:["Careless","Careful","Running","Blind"], a:1},
{q:"Electric wires are:", options:["Safe","Dangerous","Toys","Food"], a:1}
]
},

{
name: "Digital Safety",
questions: [
{q:"OTP should be shared?", options:["Yes","No","Sometimes","Maybe"], a:1},
{q:"Strong password is:", options:["12345","Name","Mix letters","Blank"], a:2},
{q:"Unknown links are:", options:["Safe","Dangerous","Games","Friends"], a:1},
{q:"Cyberbullying is:", options:["Good","Harmful","Funny","Normal"], a:1},
{q:"Same password everywhere is:", options:["Safe","Risky","Best","Smart"], a:1}
]
},

{
name: "Environment",
questions: [
{q:"Trees give:", options:["Plastic","Oxygen","Smoke","Noise"], a:1},
{q:"Plastic is:", options:["Good","Bad","Healthy","Useful"], a:1},
{q:"Saving water is:", options:["Useless","Important","Bad","Optional"], a:1},
{q:"Pollution is:", options:["Good","Harmful","Helpful","Neutral"], a:1},
{q:"Recycling helps:", options:["Environment","Pollution","Damage","Nothing"], a:0}
]
},

{
name: "Moral Values",
questions: [
{q:"Helping others is:", options:["Bad","Good","Useless","Wrong"], a:1},
{q:"Stealing is:", options:["Right","Wrong","Good","Normal"], a:1},
{q:"Respect elders is:", options:["Optional","Important","Bad","Useless"], a:1},
{q:"Lying is:", options:["Good","Bad","Helpful","Required"], a:1},
{q:"Kindness is:", options:["Bad","Good","Weakness","Danger"], a:1}
]
},

{
name: "Rules",
questions: [
{q:"Rules should be:", options:["Broken","Followed","Ignored","Removed"], a:1},
{q:"Laws are:", options:["Useless","Important","Optional","Funny"], a:1},
{q:"Traffic rules:", options:["Not needed","Important","Danger","Game"], a:1},
{q:"School rules:", options:["Useless","Important","Optional","Bad"], a:1},
{q:"Discipline is:", options:["Bad","Good","Weak","None"], a:1}
]
},

{
name: "Responsibilities",
questions: [
{q:"Students should:", options:["Study","Play only","Sleep only","Ignore"], a:0},
{q:"Helping family is:", options:["Bad","Good","Optional","Wrong"], a:1},
{q:"Clean environment:", options:["Ignore","Maintain","Destroy","Break"], a:1},
{q:"Duty means:", options:["Responsibility","Fun","Game","Nothing"], a:0},
{q:"Helping society is:", options:["Good","Bad","Optional","Useless"], a:0}
]
},

{
name: "Health",
questions: [
{q:"Exercise is:", options:["Useless","Important","Danger","Optional"], a:1},
{q:"Junk food is:", options:["Healthy","Unhealthy","Best","Required"], a:1},
{q:"Drink water:", options:["Never","Daily","Sometimes","Rarely"], a:1},
{q:"Sleep is:", options:["Important","Useless","Danger","Optional"], a:0},
{q:"Fruits are:", options:["Healthy","Unhealthy","Bad","Danger"], a:0}
]
}
];

/* =========================
   START GAME
========================= */
function startGame() {
    state.stage = 0;
    state.index = 0;
    state.xp = 0;
    state.coins = 0;
    state.hp = 100;

    loadQuestion();
}

/* =========================
   TIMER SYSTEM (SAFE)
========================= */
function startTimer() {
    clearInterval(state.timer);
    state.timeLeft = 15;

    state.timer = setInterval(() => {

        state.timeLeft--;

        const stageName = stages[state.stage]?.name || "";

        document.getElementById("stageTitle").textContent =
            `Stage: ${stageName} | Time: ${state.timeLeft}s`;

        if (state.timeLeft <= 0) {
            clearInterval(state.timer);
            autoFail();
        }

    }, 1000);
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

    startTimer();

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
   ANSWER SYSTEM (BUG FREE)
========================= */
function answer(i) {

    if (state.locked) return;
    state.locked = true;

    clearInterval(state.timer);

    const stage = stages[state.stage];
    const q = stage.questions[state.index];

    const buttons = document.querySelectorAll(".mcq-grid button");

    if (!q || !buttons.length) return;

    // correct highlight
    buttons[q.a].classList.add("correct");

    // wrong highlight
    if (i !== q.a) {
        buttons[i].classList.add("wrong");
    }

    // rewards
    if (i === q.a) {
        state.xp += 10;
        state.coins += 5;
    } else {
        state.hp -= 10;
    }

    setTimeout(nextQuestion, 800);
}

/* =========================
   TIMEOUT FAIL
========================= */
function autoFail() {
    state.hp -= 10;
    nextQuestion();
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

            clearInterval(state.timer);
            return;
        }
    }

    loadQuestion();
}
