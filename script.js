
/* =========================
   GAME STATE
========================= */
let state = {
    xp: 0,
    level: 1,
    coins: 0,
    hp: 100,
    currentStage: null,
    qIndex: 0,
    stageDone: Array(8).fill(0),
    combo: 0,
    badges: []
};

/* =========================
   STAGES (8 × 5 QUESTIONS)
========================= */
const stages = [
{
name:"Good Habits",
questions:[
{q:"Brush teeth how many times a day?", options:["Once","Twice","Never","Sometimes"], a:1},
{q:"Skipping breakfast is:", options:["Good","Bad","Optional","Best"], a:1},
{q:"Clean room means:", options:["Good habit","Bad habit","Danger","None"], a:0},
{q:"Sleeping late is:", options:["Healthy","Unhealthy","Best","Required"], a:1},
{q:"Washing hands helps:", options:["Spread germs","Remove germs","Increase dirt","Nothing"], a:1}
]
},

{
name:"Awareness",
questions:[
{q:"Fire is:", options:["Safe","Dangerous","Toy","Food"], a:1},
{q:"Traffic rules should be:", options:["Ignored","Followed","Broken","Optional"], a:1},
{q:"Strangers are:", options:["Always safe","Sometimes risky","Always friends","Always family"], a:1},
{q:"Cross road should be:", options:["Careless","Careful","Running","Blind"], a:1},
{q:"Electric wires are:", options:["Safe","Dangerous","Toys","Food"], a:1}
]
},

{
name:"Digital Safety",
questions:[
{q:"OTP should be shared?", options:["Yes","No","Sometimes","Maybe"], a:1},
{q:"Strong password is:", options:["12345","Name","Mix letters","Blank"], a:2},
{q:"Unknown links are:", options:["Safe","Dangerous","Games","Friends"], a:1},
{q:"Cyberbullying is:", options:["Good","Harmful","Funny","Normal"], a:1},
{q:"Same password everywhere is:", options:["Safe","Risky","Best","Smart"], a:1}
]
},

{
name:"Environment",
questions:[
{q:"Trees give:", options:["Plastic","Oxygen","Smoke","Noise"], a:1},
{q:"Plastic is:", options:["Good","Bad","Healthy","Useful"], a:1},
{q:"Saving water is:", options:["Useless","Important","Bad","Optional"], a:1},
{q:"Pollution is:", options:["Good","Harmful","Helpful","Neutral"], a:1},
{q:"Recycling helps:", options:["Environment","Pollution","Damage","Nothing"], a:0}
]
},

{
name:"Moral Values",
questions:[
{q:"Helping others is:", options:["Bad","Good","Useless","Wrong"], a:1},
{q:"Stealing is:", options:["Right","Wrong","Good","Normal"], a:1},
{q:"Respect elders is:", options:["Optional","Important","Bad","Useless"], a:1},
{q:"Lying is:", options:["Good","Bad","Helpful","Required"], a:1},
{q:"Kindness is:", options:["Bad","Good","Weakness","Danger"], a:1}
]
},

{
name:"Rules",
questions:[
{q:"Rules should be:", options:["Broken","Followed","Ignored","Removed"], a:1},
{q:"Laws are:", options:["Useless","Important","Optional","Funny"], a:1},
{q:"Traffic rules:", options:["Not needed","Important","Danger","Game"], a:1},
{q:"School rules:", options:["Useless","Important","Optional","Bad"], a:1},
{q:"Discipline is:", options:["Bad","Good","Weak","None"], a:1}
]
},

{
name:"Responsibilities",
questions:[
{q:"Students should:", options:["Study","Play only","Sleep only","Ignore"], a:0},
{q:"Helping family is:", options:["Bad","Good","Optional","Wrong"], a:1},
{q:"Clean environment:", options:["Ignore","Maintain","Destroy","Break"], a:1},
{q:"Duty means:", options:["Responsibility","Fun","Game","Nothing"], a:0},
{q:"Helping society is:", options:["Good","Bad","Optional","Useless"], a:0}
]
},

{
name:"Health",
questions:[
{q:"Exercise is:", options:["Useless","Important","Danger","Optional"], a:1},
{q:"Junk food is:", options:["Healthy","Unhealthy","Best","Required"], a:1},
{q:"Drink water:", options:["Never","Daily","Sometimes","Rarely"], a:1},
{q:"Sleep is:", options:["Important","Useless","Danger","Optional"], a:0},
{q:"Fruits are:", options:["Healthy","Unhealthy","Bad","Danger"], a:0}
]
}
];

/* =========================
   LOAD STAGES
========================= */
function loadStages(){
    const grid = document.getElementById("stageGrid");
    grid.innerHTML = "";

    stages.forEach((s,i)=>{
        const div = document.createElement("div");
        div.className = "stage";
        div.innerText = s.name;

        if(state.stageDone[i]){
            div.innerText += " 🏆";
        }

        div.onclick = () => selectStage(i);

        grid.appendChild(div);
    });
}

/* =========================
   SELECT STAGE
========================= */
function selectStage(i){
    state.currentStage = i;
    state.qIndex = 0;
    state.combo = 0;

    document.getElementById("stageTitle").innerText = stages[i].name;

    loadQuestion();
}

/* =========================
   LOAD QUESTION (SAFE FIX)
========================= */
function loadQuestion(){
    const stage = stages[state.currentStage];

    if(!stage) return;

    const q = stage.questions[state.qIndex];

    if(!q) return;

    document.getElementById("question").innerHTML = `
        <b>${q.q}</b><br><br>
        ${q.options.map((opt,i)=>
            `<button class="answer-btn" onclick="answer(${i})">${opt}</button>`
        ).join("")}
    `;
}

/* =========================
   ANSWER SYSTEM (FIXED FLOW)
========================= */
function answer(selected){

    const stage = stages[state.currentStage];
    const q = stage.questions[state.qIndex];

    if(!q) return;

    // correct answer
    if(selected === q.a){
        state.xp += 10 + state.combo;
        state.coins += 5;
        state.combo++;
    } else {
        state.hp -= 10;
        state.combo = 0;
    }

    // game over
    if(state.hp <= 0){
        alert("Game Over!");
        location.reload();
        return;
    }

    // MOVE NEXT
    state.qIndex++;

    // END STAGE CHECK
    if(state.qIndex >= stage.questions.length){
        completeStage();
        return;
    }

    updateUI();
    loadQuestion();
}

/* =========================
   COMPLETE STAGE
========================= */
function completeStage(){

    const stage = stages[state.currentStage];

    state.stageDone[state.currentStage] = 1;

    state.xp += 50;
    state.coins += 20;

    if(!state.badges.includes(stage.name)){
        state.badges.push(stage.name);
    }

    alert(stage.name + " Completed!");

    state.currentStage++;
    state.qIndex = 0;

    updateUI();
    loadStages();
}

/* =========================
   UI UPDATE (MATCH HTML/CSS)
========================= */
function updateUI(){

    document.getElementById("xpBar").style.width =
        (state.xp % 100) + "%";

    document.getElementById("coinBar").style.width =
        Math.min(state.coins, 100) + "%";

    document.getElementById("hpBar").style.width =
        state.hp + "%";

    document.getElementById("xp").innerText = state.xp;
    document.getElementById("level").innerText = Math.floor(state.xp / 100) + 1;
    document.getElementById("coins").innerText = state.coins;
    document.getElementById("hp").innerText = state.hp;

    const done = state.stageDone.filter(x => x === 1).length;
    document.getElementById("bar").style.width =
        (done / stages.length) * 100 + "%";

    document.getElementById("badges").innerText =
        state.badges.length ? state.badges.join(", ") : "None";
}

/* =========================
   SAVE SYSTEM
========================= */
setInterval(() => {
    localStorage.setItem("mvear_final_game", JSON.stringify(state));
}, 3000);

/* =========================
   LOAD GAME
========================= */
window.onload = function () {
    const data = JSON.parse(localStorage.getItem("mvear_final_game"));

    if (data) state = data;

    loadStages();
    updateUI();
};
