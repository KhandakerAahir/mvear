
/* =========================
   GAME STATE
========================= */
const state = {
    stage: null,
    index: 0,
    hp: 100,
    points: 0,
    locked: false
};

/* =========================
   STAGES (8 × 5 MCQs)
========================= */
const stages = [
{
name: "Good Habits",
questions: [
{q:"How many times should you brush teeth? 🪥", options:["Once","Twice","Never","Sometimes"], a:1},
{q:"Skipping breakfast is: 🍳", options:["Good","Bad","Optional","Best"], a:1},
{q:"Clean room means: 🧹", options:["Discipline","Lazy habit","Danger","None"], a:0},
{q:"Sleeping late is: 😴", options:["Healthy","Unhealthy","Best","Required"], a:1},
{q:"Washing hands helps: 🧼", options:["Spread germs","Remove germs","Increase dirt","Nothing"], a:1}
]
},

{
name: "Awareness",
questions: [
{q:"Fire is: 🔥", options:["Safe","Dangerous","Toy","Food"], a:1},
{q:"Traffic rules should be: 🚦", options:["Ignored","Followed","Broken","Optional"], a:1},
{q:"Strangers can be: 👤", options:["Safe","Risky","Friend","Family"], a:1},
{q:"Road crossing should be: 🚶", options:["Careless","Careful","Running","Blind"], a:1},
{q:"Electric wires are: ⚡", options:["Safe","Dangerous","Toy","Food"], a:1}
]
},

{
name: "Environment",
questions: [
{q:"Trees give: 🌳", options:["Plastic","Oxygen","Smoke","Noise"], a:1},
{q:"Plastic is: 🗑️", options:["Good","Bad","Healthy","Useful"], a:1},
{q:"Saving water is: 💧", options:["Useless","Important","Bad","Optional"], a:1},
{q:"Pollution is: 🏭", options:["Good","Harmful","Helpful","Funny"], a:1},
{q:"Recycling helps: ♻️", options:["Nature","Pollution","Damage","Nothing"], a:0}
]
},

{
name: "Moral Values",
questions: [
{q:"Helping others is: 🤝", options:["Bad","Good","Useless","Wrong"], a:1},
{q:"Stealing is: 🧑‍⚖️", options:["Right","Wrong","Good","Normal"], a:1},
{q:"Respect elders is: 👵", options:["Optional","Important","Bad","Useless"], a:1},
{q:"Lying is: 🤥", options:["Good","Bad","Helpful","Required"], a:1},
{q:"Kindness is: 💖", options:["Weakness","Good","Danger","Funny"], a:1}
]
},

{
name: "Digital Safety",
questions: [
{q:"OTP should be shared? 📱", options:["Yes","No","Sometimes","Maybe"], a:1},
{q:"Strong password is: 🔑", options:["12345","Name","Mix letters","Blank"], a:2},
{q:"Unknown links are: 🌐", options:["Safe","Dangerous","Game","Friend"], a:1},
{q:"Cyberbullying is: 💻", options:["Good","Harmful","Funny","Normal"], a:1},
{q:"Same password everywhere: 🔒", options:["Safe","Risky","Best","Smart"], a:1}
]
},

{
name: "Responsibilities",
questions: [
{q:"Students should: 📚", options:["Study","Play all day","Sleep only","Ignore"], a:0},
{q:"Helping family is: 🏠", options:["Bad","Good","Optional","Wrong"], a:1},
{q:"Clean environment: 🌍", options:["Ignore","Maintain","Destroy","Break"], a:1},
{q:"Duty means: 🎯", options:["Responsibility","Fun","Game","Nothing"], a:0},
{q:"Helping society is: 🏙️", options:["Good","Bad","Optional","Useless"], a:0}
]
},

{
name: "Rules",
questions: [
{q:"Rules should be: 📏", options:["Broken","Followed","Ignored","Removed"], a:1},
{q:"Laws are: ⚖️", options:["Useless","Important","Optional","Funny"], a:1},
{q:"Traffic rules: 🚦", options:["Not needed","Important","Danger","Game"], a:1},
{q:"School rules: 🏫", options:["Useless","Important","Optional","Bad"], a:1},
{q:"Discipline is: 📌", options:["Bad","Good","Weak","None"], a:1}
]
},

{
name: "Health",
questions: [
{q:"Exercise is: 🏃", options:["Useless","Important","Danger","Optional"], a:1},
{q:"Junk food is: 🍔", options:["Healthy","Unhealthy","Best","Required"], a:1},
{q:"Drink water: 💧", options:["Never","Daily","Sometimes","Rarely"], a:1},
{q:"Sleep is: 😴", options:["Important","Useless","Danger","Optional"], a:0},
{q:"Fruits are: 🍎", options:["Healthy","Unhealthy","Bad","Danger"], a:0}
]
}
];

/* =========================
   START GAME (STAGE MENU)
========================= */
function startGame() {
    state.stage = null;
    state.index = 0;
    state.hp = 100;
    state.points = 0;
    showStageMenu();
}

/* =========================
   STAGE MENU
========================= */
function showStageMenu() {

    document.getElementById("stageTitle").textContent =
        "🎮 Choose Your Stage";

    document.getElementById("question").innerHTML = `
        <div class="mcq-grid">
            ${stages.map((s, i) =>
                `<button onclick="selectStage(${i})">${s.name}</button>`
            ).join("")}
        </div>
    `;
}

/* =========================
   SELECT STAGE
========================= */
function selectStage(i) {
    state.stage = i;
    state.index = 0;
    loadQuestion();
}

/* =========================
   LOAD QUESTION
========================= */
function loadQuestion() {

    const stage = stages[state.stage];
    const q = stage.questions[state.index];

    state.locked = false;

    document.getElementById("stageTitle").textContent =
        `${stage.name} | ❤️ HP: ${state.hp} | ⭐ Points: ${state.points}`;

    document.getElementById("question").innerHTML = `
        <div class="q-text">${q.q}</div>

        <div class="mcq-grid">
            ${q.options.map((opt,i)=>
                `<button onclick="answer(${i})">${opt}</button>`
            ).join("")}
        </div>
    `;
}

/* =========================
   ANSWER SYSTEM
========================= */
function answer(i) {

    if (state.locked) return;
    state.locked = true;

    const stage = stages[state.stage];
    const q = stage.questions[state.index];

    const buttons = document.querySelectorAll(".mcq-grid button");

    buttons[q.a].classList.add("correct");

    if (i !== q.a) {
        buttons[i].classList.add("wrong");
        state.hp -= 10;
        state.points -= 5;
    } else {
        state.points += 10;
    }

    setTimeout(nextQuestion, 800);
}

/* =========================
   NEXT QUESTION FLOW
========================= */
function nextQuestion() {

    const stage = stages[state.stage];

    state.index++;

    if (state.index >= stage.questions.length) {
        showStageMenu();
        return;
    }

    loadQuestion();
}
