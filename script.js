
/* =========================
   STATE
========================= */

const state = {
xp: +localStorage.getItem("xp") || 0,
level: +localStorage.getItem("level") || 1,
coins: +localStorage.getItem("coins") || 0,
hp: +localStorage.getItem("hp") || 100,

world: 0,
qIndex: 0,
streak: 0
};

/* =========================
   WORLDS (8 STAGES - 5 QUESTIONS EACH)
========================= */

const worlds = [

{
name:"🌱 Good Habits",
questions:[
{q:"Best morning habit?",options:["Wake early","Sleep late","Skip breakfast","Stay lazy"],a:"Wake early"},
{q:"Discipline means?",options:["Consistency","Chaos","Fear","Luck"],a:"Consistency"},
{q:"Healthy routine includes?",options:["Exercise","Junk food","No sleep","Stress"],a:"Exercise"},
{q:"Good habit is?",options:["Reading","Smoking","Waste time","Laziness"],a:"Reading"},
{q:"Success needs?",options:["Practice","Avoid work","Quit","Ignore"],a:"Practice"}
]
},

{
name:"🌍 Awareness",
questions:[
{q:"Trees give?",options:["Oxygen","Plastic","Smoke","Noise"],a:"Oxygen"},
{q:"Pollution caused by?",options:["Humans","Stars","Clouds","Rain"],a:"Humans"},
{q:"We should save?",options:["Water","Fire","Dust","Smoke"],a:"Water"},
{q:"Earth is?",options:["Precious","Useless","Fake","Dangerous"],a:"Precious"},
{q:"Recycle means?",options:["Reuse","Burn","Throw","Destroy"],a:"Reuse"}
]
},

{
name:"🧭 Responsibilities",
questions:[
{q:"Homework is?",options:["Duty","Option","Waste","Ignore"],a:"Duty"},
{q:"Helping family is?",options:["Responsibility","Optional","Bad","Avoid"],a:"Responsibility"},
{q:"Ignoring work is?",options:["Wrong","Good","Funny","Smart"],a:"Wrong"},
{q:"Blaming others is?",options:["Bad","Good","Normal","Helpful"],a:"Bad"},
{q:"Rules should be?",options:["Followed","Ignored","Broken","Skipped"],a:"Followed"}
]
},

{
name:"📜 Rules",
questions:[
{q:"Traffic rules are for?",options:["Safety","Fun","Noise","Chaos"],a:"Safety"},
{q:"Breaking rules leads to?",options:["Danger","Reward","Success","Peace"],a:"Danger"},
{q:"Rules create?",options:["Order","Chaos","Confusion","Delay"],a:"Order"},
{q:"School rules give?",options:["Discipline","Freedom","Confusion","Stress"],a:"Discipline"},
{q:"Rules are?",options:["Important","Useless","Optional","Bad"],a:"Important"}
]
},

{
name:"❤️ Moral Values",
questions:[
{q:"Honesty means?",options:["Truth","Lie","Cheat","Hide"],a:"Truth"},
{q:"Kindness is?",options:["Good","Bad","Weakness","Danger"],a:"Good"},
{q:"Helping others is?",options:["Right","Wrong","Optional","Useless"],a:"Right"},
{q:"Stealing is?",options:["Wrong","Right","Funny","Normal"],a:"Wrong"},
{q:"Respect is?",options:["Important","Optional","Fake","Bad"],a:"Important"}
]
},

{
name:"🌿 Environment",
questions:[
{q:"Trees give?",options:["Clean air","Pollution","Heat","Noise"],a:"Clean air"},
{q:"Plastic is?",options:["Harmful","Safe","Good","Magic"],a:"Harmful"},
{q:"We should save?",options:["Nature","Waste","Smoke","Fire"],a:"Nature"},
{q:"Global warming is?",options:["Danger","Gift","Fun","Nothing"],a:"Danger"},
{q:"Clean environment is?",options:["Healthy","Bad","Dangerous","Useless"],a:"Healthy"}
]
},

{
name:"🧠 Digital Safety",
questions:[
{q:"Strong password is?",options:["Safe","Weak","Open","Easy"],a:"Safe"},
{q:"Unknown links should be?",options:["Avoided","Clicked","Shared","Trusted"],a:"Avoided"},
{q:"Personal info should be?",options:["Protected","Shared","Posted","Ignored"],a:"Protected"},
{q:"Cyber safety is?",options:["Important","Useless","Fake","Optional"],a:"Important"},
{q:"Strangers online?",options:["Avoid","Trust","Meet","Follow"],a:"Avoid"}
]
},

{
name:"💪 Health & Fitness",
questions:[
{q:"Exercise gives?",options:["Fitness","Weakness","Fatigue","Pain"],a:"Fitness"},
{q:"Healthy food is?",options:["Good","Bad","Junk","Slow"],a:"Good"},
{q:"Sleep is?",options:["Important","Useless","Optional","Waste"],a:"Important"},
{q:"Water is needed for?",options:["Body","Fire","Smoke","Noise"],a:"Body"},
{q:"Junk food is?",options:["Unhealthy","Healthy","Safe","Good"],a:"Unhealthy"}
]
}

];

/* =========================
   INIT
========================= */

updateUI();
showStages();

/* =========================
   SHOW STAGE BUTTONS
========================= */

function showStages(){

document.getElementById("title").innerText = "🌍 SELECT STAGE";

document.getElementById("gameArea").innerHTML = `
<div class="stage-menu">

<button onclick="startStage(0)">🌱 Good Habits</button>
<button onclick="startStage(1)">🌍 Awareness</button>
<button onclick="startStage(2)">🧭 Responsibilities</button>
<button onclick="startStage(3)">📜 Rules</button>
<button onclick="startStage(4)">❤️ Moral Values</button>
<button onclick="startStage(5)">🌿 Environment</button>
<button onclick="startStage(6)">🧠 Digital Safety</button>
<button onclick="startStage(7)">💪 Health & Fitness</button>

</div>
`;

}

/* =========================
   START STAGE
========================= */

function startStage(i){

state.world = i;
state.qIndex = 0;
state.streak = 0;

loadQuestion();

}

/* =========================
   LOAD QUESTION
========================= */

function loadQuestion(){

const world = worlds[state.world];

if(!world){
showStages();
return;
}

if(state.qIndex >= 5){
stageComplete();
return;
}

const q = world.questions[state.qIndex];

document.getElementById("title").innerText = world.name;

document.getElementById("gameArea").innerHTML = `
<div class="quiz-container">

<div class="question-box">${q.q}</div>

<div class="answer-box" id="answers"></div>

</div>
`;

let options = [...q.options].sort(()=>Math.random()-0.5);

const box = document.getElementById("answers");

options.forEach(opt=>{

const btn = document.createElement("button");
btn.className = "option-btn";
btn.innerText = opt;

btn.onclick = ()=>checkAnswer(opt,q.a);

box.appendChild(btn);

});

}

/* =========================
   CHECK ANSWER
========================= */

function checkAnswer(selected, correct){

if(selected === correct){

state.xp += 10;
state.coins += 5;
state.streak++;

}else{

state.streak = 0;
state.hp -= 20;

if(state.hp <= 0){
gameOver();
return;
}

}

state.qIndex++;

updateLevel();
updateUI();
save();

setTimeout(loadQuestion,200);

}

/* =========================
   LEVEL SYSTEM
========================= */

function updateLevel(){

if(state.xp >= state.level * 50){

state.xp -= state.level * 50;
state.level++;

}

}

/* =========================
   STAGE COMPLETE
========================= */

function stageComplete(){

state.coins += 50;
state.xp += 100;
state.hp = Math.min(100,state.hp + 30);

document.getElementById("gameArea").innerHTML = `
<div class="reward-card">
<h2>🎉 Stage Completed!</h2>
<p>💰 +50 Coins</p>
<p>⭐ +100 XP</p>
<p>❤️ +30 HP</p>

<button onclick="showStages()">⬅ Back to Stages</button>
</div>
`;

save();
updateUI();

}

/* =========================
   GAME OVER
========================= */

function gameOver(){

document.getElementById("gameArea").innerHTML = `
<h2 style="color:red;">💀 Game Over</h2>
<button onclick="showStages()">Restart</button>
`;

}

/* =========================
   SHOP SYSTEM
========================= */

function buyItem(item){

if(item==="life" && state.coins>=30){
state.coins -= 30;
state.hp = Math.min(100,state.hp + 30);
}

if(item==="skip" && state.coins>=20){
state.coins -= 20;
state.qIndex++;
loadQuestion();
}

if(item==="hint" && state.coins>=15){
state.coins -= 15;
alert("💡 Think carefully!");
}

updateUI();
save();

}

/* =========================
   ROCK PAPER SCISSORS
========================= */

function rps(user){

const arr=["rock","paper","scissors"];
const ai = arr[Math.floor(Math.random()*3)];

if(user===ai){
alert("Draw!");
}
else if(
(user==="rock"&&ai==="scissors")||
(user==="paper"&&ai==="rock")||
(user==="scissors"&&ai==="paper")
){
alert("You Win!");
state.coins += 10;
}else{
alert("You Lose!");
state.hp -= 10;
}

updateUI();
save();

}

/* =========================
   UI UPDATE
========================= */

function updateUI(){

document.getElementById("xp").innerText = state.xp;
document.getElementById("level").innerText = state.level;
document.getElementById("coins").innerText = state.coins;

document.getElementById("hpFill").style.width = state.hp + "%";

}

/* =========================
   SAVE
========================= */

function save(){

localStorage.setItem("xp",state.xp);
localStorage.setItem("level",state.level);
localStorage.setItem("coins",state.coins);
localStorage.setItem("hp",state.hp);

}
