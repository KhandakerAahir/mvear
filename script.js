let state = {
    xp: 0,
    level: 1,
    coins: 0,
    hp: 100,
    currentStage: null,
    qIndex: 0,
    stageDone: [0,0,0,0,0,0,0,0],
    combo: 0,
    badges: []
};

/* =========================
   STAGES (8 LEVELS)
========================= */
const stages = [
{
name:"Good Habits",
questions:[
{q:"Brush teeth twice a day?", a:true},
{q:"Skipping breakfast is good?", a:false},
{q:"Wash hands regularly?", a:true},
{q:"Sleeping very late is healthy?", a:false},
{q:"Clean room is good habit?", a:true}
]
},
{
name:"Awareness",
questions:[
{q:"Fire is dangerous?", a:true},
{q:"Cross road without looking?", a:false},
{q:"Traffic rules matter?", a:true},
{q:"Electric wires are safe to touch?", a:false},
{q:"Strangers are always safe?", a:false}
]
},
{
name:"Digital Safety",
questions:[
{q:"Share OTP with anyone?", a:false},
{q:"Strong password is important?", a:true},
{q:"Click unknown links?", a:false},
{q:"Cyberbullying is harmful?", a:true},
{q:"Same password everywhere safe?", a:false}
]
},
{
name:"Environment",
questions:[
{q:"Trees give oxygen?", a:true},
{q:"Plastic is good for nature?", a:false},
{q:"Save water?", a:true},
{q:"Pollution is harmful?", a:true},
{q:"Recycling helps?", a:true}
]
},
{
name:"Moral Values",
questions:[
{q:"Helping others is good?", a:true},
{q:"Stealing is right?", a:false},
{q:"Respect elders?", a:true},
{q:"Lying is good?", a:false},
{q:"Kindness matters?", a:true}
]
},
{
name:"Rules",
questions:[
{q:"We should follow rules?", a:true},
{q:"Breaking laws is okay?", a:false},
{q:"Traffic rules important?", a:true},
{q:"School rules matter?", a:true},
{q:"Discipline is bad?", a:false}
]
},
{
name:"Responsibilities",
questions:[
{q:"Students should study?", a:true},
{q:"Keep environment clean?", a:true},
{q:"Ignore duties?", a:false},
{q:"Help family?", a:true},
{q:"Help society?", a:true}
]
},
{
name:"Health",
questions:[
{q:"Junk food is healthy?", a:false},
{q:"Drink water daily?", a:true},
{q:"Exercise important?", a:true},
{q:"Skipping sleep is good?", a:false},
{q:"Fruits are healthy?", a:true}
]
}
];

/* =========================
   ELEMENTS
========================= */
const stageGrid = document.getElementById("stageGrid");
const stageTitle = document.getElementById("stageTitle");
const questionEl = document.getElementById("question");

const xpEl = document.getElementById("xp");
const levelEl = document.getElementById("level");
const coinsEl = document.getElementById("coins");
const hpEl = document.getElementById("hp");
const bar = document.getElementById("bar");
const badgesEl = document.getElementById("badges");

/* =========================
   LOAD STAGES UI
========================= */
function loadStages(){
    stageGrid.innerHTML = "";

    stages.forEach((s,i)=>{
        const div = document.createElement("div");
        div.className = "stage";

        div.innerText = s.name;

        if(state.stageDone[i]){
            div.innerText += " 🏆";
        }

        if(i > state.currentStage && state.currentStage !== null){
            div.style.opacity = "0.5";
            div.onclick = () => alert("Locked Stage!");
        } else {
            div.onclick = () => selectStage(i);
        }

        stageGrid.appendChild(div);
    });
}

/* =========================
   SELECT STAGE
========================= */
function selectStage(i){
    state.currentStage = i;
    state.qIndex = 0;
    state.combo = 0;

    stageTitle.innerText = stages[i].name;

    loadQuestion();
}

/* =========================
   LOAD QUESTION
========================= */
function loadQuestion(){
    const stage = stages[state.currentStage];

    if(state.qIndex >= stage.questions.length){
        completeStage();
        return;
    }

    questionEl.innerText = stage.questions[state.qIndex].q;
}

/* =========================
   ANSWER SYSTEM
========================= */
function answer(userAns){
    const q = stages[state.currentStage].questions[state.qIndex];

    if(userAns === q.a){
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
    xpEl.innerText = state.xp;
    levelEl.innerText = Math.floor(state.xp / 100) + 1;
    coinsEl.innerText = state.coins;
    hpEl.innerText = state.hp;

    const done = state.stageDone.filter(x=>x===1).length;
    bar.style.width = (done / stages.length) * 100 + "%";

    badgesEl.innerText =
        state.badges.length ? state.badges.join(", ") : "None";
}

/* =========================
   SAVE SYSTEM
========================= */
setInterval(()=>{
    localStorage.setItem("mvear_pro_save", JSON.stringify(state));
}, 3000);

/* =========================
   LOAD SAVE
========================= */
window.onload = function(){
    const data = JSON.parse(localStorage.getItem("mvear_pro_save"));

    if(data){
        state = data;
    }

    loadStages();
    updateUI();
};
