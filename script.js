let state = {
    xp: 0,
    level: 1,
    coins: 0,
    hp: 100,
    achievements: [],
    stageProgress: [0,0,0,0,0,0,0,0],
    currentStage: null
};

/* =========================
   ELEMENTS
========================= */
const xpEl = document.getElementById("xp");
const levelEl = document.getElementById("level");
const coinsEl = document.getElementById("coins");

const questionEl = document.getElementById("question");
const stageTitle = document.getElementById("stageTitle");
const bar = document.getElementById("bar");

/* =========================
   STAGES
========================= */
const stages = [
{ name:"Good Habits", questions:[
{q:"Brush teeth twice a day?", a:true},
{q:"Skipping breakfast is healthy?", a:false},
{q:"Washing hands is important?", a:true},
{q:"Sleeping late is good?", a:false},
{q:"Clean room is good habit?", a:true}
]},
{ name:"Awareness", questions:[
{q:"Fire is dangerous?", a:true},
{q:"Cross road without looking?", a:false},
{q:"Traffic rules matter?", a:true},
{q:"Electric wires are safe?", a:false},
{q:"Strangers always safe?", a:false}
]},
{ name:"Digital Safety", questions:[
{q:"Share OTP?", a:false},
{q:"Strong password important?", a:true},
{q:"Click unknown links?", a:false},
{q:"Cyberbullying is harmful?", a:true},
{q:"Same password everywhere safe?", a:false}
]},
{ name:"Environment", questions:[
{q:"Trees give oxygen?", a:true},
{q:"Plastic is good?", a:false},
{q:"Save water?", a:true},
{q:"Pollution is bad?", a:true},
{q:"Recycling helps?", a:true}
]},
{ name:"Moral Values", questions:[
{q:"Helping others is good?", a:true},
{q:"Stealing is right?", a:false},
{q:"Respect elders?", a:true},
{q:"Lying is good?", a:false},
{q:"Kindness matters?", a:true}
]},
{ name:"Rules", questions:[
{q:"Follow rules?", a:true},
{q:"Break laws?", a:false},
{q:"Traffic rules important?", a:true},
{q:"School rules matter?", a:true},
{q:"Discipline is bad?", a:false}
]},
{ name:"Responsibilities", questions:[
{q:"Study is responsibility?", a:true},
{q:"Keep clean?", a:true},
{q:"Ignore duties?", a:false},
{q:"Help family?", a:true},
{q:"Help society?", a:true}
]},
{ name:"Health", questions:[
{q:"Junk food healthy?", a:false},
{q:"Drink water daily?", a:true},
{q:"Exercise important?", a:true},
{q:"Skip sleep good?", a:false},
{q:"Fruits healthy?", a:true}
]}
];

/* =========================
   GAME FLOW
========================= */
let qIndex = 0;

function selectStage(i){
    state.currentStage = i;
    qIndex = 0;

    stageTitle.innerText = stages[i].name;
    loadQuestion();
}

function loadQuestion(){
    const stage = stages[state.currentStage];

    if(qIndex >= stage.questions.length){
        completeStage();
        return;
    }

    questionEl.innerText = stage.questions[qIndex].q;
}

/* =========================
   ANSWER SYSTEM
========================= */
function answer(userAns){
    if(state.currentStage === null) return;

    const stage = stages[state.currentStage];
    const correct = stage.questions[qIndex].a;

    if(userAns === correct){
        state.xp += 10;
        state.coins += 5;
    }

    qIndex++;
    loadQuestion();
    render();
}

/* =========================
   STAGE COMPLETE
========================= */
function completeStage(){
    state.stageProgress[state.currentStage] = 1;

    state.xp += 50;
    state.coins += 20;

    alert("Stage Completed!");

    updateProgress();
    render();
}

/* =========================
   PROGRESS BAR
========================= */
function updateProgress(){
    const done = state.stageProgress.filter(x=>x===1).length;
    const percent = (done / 8) * 100;

    bar.style.width = percent + "%";
}

/* =========================
   RENDER
========================= */
function render(){
    xpEl.innerText = state.xp;
    levelEl.innerText = state.level;
    coinsEl.innerText = state.coins;

    updateProgress();
}

/* =========================
   AUTO SAVE (optional)
========================= */
setInterval(() => {
    localStorage.setItem("mvear_game", JSON.stringify(state));
}, 3000);
