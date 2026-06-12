let currentUser = null;

let state = {
    xp: 0,
    level: 1,
    coins: 0,
    hp: 100,
    achievements: [],
    stageProgress: [0,0,0,0,0,0,0,0],
    currentStage: null,
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

const questionEl = document.getElementById("question");
const stageTitle = document.getElementById("stageTitle");
const bar = document.getElementById("bar");

const msgEl = document.getElementById("msg");
const user = document.getElementById("user");
const pass = document.getElementById("pass");

/* =========================
   STAGES DATA
========================= */
const stages = [
{
name:"Good Habits",
questions:[
{q:"Brush teeth twice a day?", a:true},
{q:"Skipping breakfast is healthy?", a:false},
{q:"Washing hands is important?", a:true},
{q:"Sleeping late is good?", a:false},
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
{q:"Strangers can be trusted always?", a:false}
]
},
{
name:"Digital Safety",
questions:[
{q:"Share OTP with others?", a:false},
{q:"Strong password is important?", a:true},
{q:"Click unknown links?", a:false},
{q:"Cyberbullying is harmful?", a:true},
{q:"Same password everywhere is safe?", a:false}
]
},
{
name:"Environment",
questions:[
{q:"Trees give oxygen?", a:true},
{q:"Plastic is good for nature?", a:false},
{q:"We should save water?", a:true},
{q:"Pollution is harmful?", a:true},
{q:"Recycling helps environment?", a:true}
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
{q:"Traffic rules matter?", a:true},
{q:"School rules are important?", a:true},
{q:"Discipline is bad?", a:false}
]
},
{
name:"Responsibilities",
questions:[
{q:"Students should study?", a:true},
{q:"Keeping clean is responsibility?", a:true},
{q:"Ignoring duties is good?", a:false},
{q:"Helping family is responsibility?", a:true},
{q:"Helping society is important?", a:true}
]
},
{
name:"Health",
questions:[
{q:"Junk food is healthy?", a:false},
{q:"Drink water daily?", a:true},
{q:"Exercise is important?", a:true},
{q:"Skipping sleep is good?", a:false},
{q:"Fruits are healthy?", a:true}
]
}
];

/* =========================
   LOGIN
========================= */
function login(){
    const u = user.value.trim();
    const p = pass.value.trim();

    const data = JSON.parse(localStorage.getItem("mvear_"+u));

    if(!data) return setMsg("User not found");
    if(data.pass !== p) return setMsg("Wrong password");

    currentUser = u;
    state = {
        xp:data.xp || 0,
        level:data.level || 1,
        coins:data.coins || 0,
        hp:data.hp || 100,
        achievements:data.achievements || [],
        stageProgress:data.stageProgress || [0,0,0,0,0,0,0,0],
        currentStage:null,
        lastDaily:data.lastDaily || ""
    };

    loginBox.classList.add("hidden");
    game.classList.remove("hidden");

    render();
}

/* =========================
   STAGE SYSTEM
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
   SAVE SYSTEM
========================= */
function save(){
    if(!currentUser) return;
    localStorage.setItem("mvear_"+currentUser, JSON.stringify(state));
}

/* auto save */
setInterval(save, 3000);

/* =========================
   RENDER
========================= */
function render(){
    xpEl.innerText = state.xp;
    levelEl.innerText = state.level;
    coinsEl.innerText = state.coins;

    updateProgress();
    save();
}

/* =========================
   MESSAGE
========================= */
function setMsg(t){
    msgEl.innerText = t;
}
