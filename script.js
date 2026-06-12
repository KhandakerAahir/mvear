
let state = {
    xp: 0,
    level: 1,
    coins: 0,
    hp: 100,
    currentStage: 0,
    qIndex: 0,
    stageDone: Array(8).fill(0),
    combo: 0,
    badges: []
};

/* =========================
   STAGES (MCQ SYSTEM)
========================= */
const stages = [
{
name:"Good Habits",
questions:[
{q:"Brush teeth twice a day?", options:["Yes","No","Sometimes","Never"], a:0},
{q:"Skipping breakfast is healthy?", options:["Yes","No","Maybe","Always"], a:1},
{q:"Clean room is good habit?", options:["Yes","No","Dirty is best","Ignore"], a:0},
{q:"Sleeping late is good?", options:["Yes","No","Sometimes","Always"], a:1},
{q:"Washing hands is important?", options:["Yes","No","Never","Optional"], a:0}
]
},
{
name:"Awareness",
questions:[
{q:"Fire is dangerous?", options:["Yes","No","Toy","Food"], a:0},
{q:"Traffic rules should be followed?", options:["Yes","No","Sometimes","Never"], a:0},
{q:"Strangers are always safe?", options:["Yes","No","Always","Maybe"], a:1},
{q:"Cross road carefully?", options:["Yes","No","Run blindly","Ignore"], a:0},
{q:"Electric wires are safe to touch?", options:["Yes","No","Always","Maybe"], a:1}
]
},
{
name:"Digital Safety",
questions:[
{q:"Share OTP with anyone?", options:["Yes","No","Sometimes","Maybe"], a:1},
{q:"Strong password is important?", options:["Yes","No","Weak is fine","Optional"], a:0},
{q:"Unknown links are safe?", options:["Yes","No","Always","Free"], a:1},
{q:"Cyberbullying is harmful?", options:["Yes","No","Fun","Joke"], a:0},
{q:"Same password everywhere is safe?", options:["Yes","No","Best","Always"], a:1}
]
},
{
name:"Environment",
questions:[
{q:"Trees give oxygen?", options:["Yes","No","Maybe","Never"], a:0},
{q:"Plastic is good for nature?", options:["Yes","No","Always","Best"], a:1},
{q:"Save water is important?", options:["Yes","No","Optional","Never"], a:0},
{q:"Pollution is harmful?", options:["Yes","No","Good","Healthy"], a:0},
{q:"Recycling helps?", options:["Yes","No","Useless","Bad"], a:0}
]
},
{
name:"Moral Values",
questions:[
{q:"Helping others is good?", options:["Yes","No","Bad","Optional"], a:0},
{q:"Stealing is right?", options:["Yes","No","Always","Good"], a:1},
{q:"Respect elders?", options:["Yes","No","Never","Ignore"], a:0},
{q:"Lying is good?", options:["Yes","No","Always","Best"], a:1},
{q:"Kindness matters?", options:["Yes","No","Bad","Optional"], a:0}
]
},
{
name:"Rules",
questions:[
{q:"Rules should be followed?", options:["Yes","No","Never","Optional"], a:0},
{q:"Breaking laws is good?", options:["Yes","No","Always","Best"], a:1},
{q:"School rules matter?", options:["Yes","No","Ignore","Never"], a:0},
{q:"Traffic rules are important?", options:["Yes","No","Optional","Maybe"], a:0},
{q:"Discipline is bad?", options:["Yes","No","Always","Good"], a:1}
]
},
{
name:"Responsibilities",
questions:[
{q:"Students should study?", options:["Yes","No","Never","Optional"], a:0},
{q:"Help family?", options:["Yes","No","Ignore","Always no"], a:0},
{q:"Keep environment clean?", options:["Yes","No","Never","Bad"], a:0},
{q:"Ignore duties?", options:["Yes","No","Always","Best"], a:1},
{q:"Help society?", options:["Yes","No","Optional","Bad"], a:0}
]
},
{
name:"Health",
questions:[
{q:"Exercise is important?", options:["Yes","No","Never","Optional"], a:0},
{q:"Junk food is healthy?", options:["Yes","No","Always","Best"], a:1},
{q:"Drink water daily?", options:["Yes","No","Never","Bad"], a:0},
{q:"Sleep is important?", options:["Yes","No","Optional","Ignore"], a:0},
{q:"Fruits are healthy?", options:["Yes","No","Bad","Never"], a:0}
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
   LOAD QUESTION (MCQ)
========================= */
function loadQuestion(){
    const stage = stages[state.currentStage];

    if(state.qIndex >= stage.questions.length){
        completeStage();
        return;
    }

    const q = stage.questions[state.qIndex];

    document.getElementById("question").innerHTML = `
        <b>${q.q}</b><br><br>
        ${q.options.map((opt,i)=>
            `<button class="answer-btn" onclick="answer(${i})">${opt}</button>`
        ).join("")}
    `;
}

/* =========================
   ANSWER SYSTEM
========================= */
function answer(selected){
    const q = stages[state.currentStage].questions[state.qIndex];

    if(selected === q.a){
        state.xp += 10 + state.combo;
        state.coins += 5;
        state.combo++;
    } else {
        state.hp -= 10;
        state.combo = 0;
    }

    if(state.hp <= 0){
        alert("Game Over!");
        location.reload();
    }

    state.qIndex++;

    updateUI();
    loadQuestion();
}

/* =========================
   COMPLETE STAGE
========================= */
function completeStage(){
    state.stageDone[state.currentStage] = 1;

    state.xp += 50;
    state.coins += 20;

    const name = stages[state.currentStage].name;

    if(!state.badges.includes(name)){
        state.badges.push(name);
    }

    alert(name + " Completed!");

    state.currentStage++;
    state.qIndex = 0;

    updateUI();
    loadStages();
}

/* =========================
   UI UPDATE
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

    const done = state.stageDone.filter(x=>x===1).length;
    document.getElementById("bar").style.width =
        (done / stages.length) * 100 + "%";

    document.getElementById("badges").innerText =
        state.badges.length ? state.badges.join(", ") : "None";
}

/* =========================
   SAVE SYSTEM
========================= */
setInterval(()=>{
    localStorage.setItem("mvear_final_game", JSON.stringify(state));
}, 3000);

/* =========================
   LOAD SAVE
========================= */
window.onload = function(){
    const data = JSON.parse(localStorage.getItem("mvear_final_game"));

    if(data){
        state = data;
    }

    loadStages();
    updateUI();
};
