
/* =========================
   STATE
========================= */

const state = {
xp: +localStorage.getItem("xp") || 0,
level: +localStorage.getItem("level") || 1,
stars: +localStorage.getItem("stars") || 0,
avatar: localStorage.getItem("avatar") || "🙂",
world: 0,
qIndex: 0
};

let timer;
let timeLeft = 0;

/* =========================
   SHUFFLE FUNCTION
========================= */

function shuffle(arr){
for(let i = arr.length - 1; i > 0; i--){
const j = Math.floor(Math.random() * (i + 1));
[arr[i], arr[j]] = [arr[j], arr[i]];
}
return arr;
}

/* =========================
   MUSIC
========================= */

const music = new Audio("https://cdn.pixabay.com/audio/2022/10/16/audio_7c6f3.mp3");
music.loop = true;
let musicOn = false;

function toggleMusic(){
if(!musicOn){
music.play();
musicOn = true;
}else{
music.pause();
musicOn = false;
}
}

/* =========================
   AVATAR
========================= */

function setAvatar(){
let pick = prompt("Choose avatar 🙂 😎 🧠 🚀 🤖");
if(pick){
state.avatar = pick;
save();
updateUI();
}
}

/* =========================
   WORLDS
========================= */

const worlds = [
{
name:"🌱 Habits",
color:"#1f2937",
locked:false,
questions:[
{q:"Best morning habit?",options:["Exercise","Sleep","Games","Scrolling"],a:"Exercise"},
{q:"Good habit is?",options:["Reading","Smoking","Laziness","Anger"],a:"Reading"},
{q:"Success needs?",options:["Discipline","Luck","Excuses","Sleep"],a:"Discipline"},
{q:"Healthy routine?",options:["Sleep early","Stay late","Skip meals","No plan"],a:"Sleep early"},
{q:"Self growth comes from?",options:["Practice","Ignore","Fear","Hate"],a:"Practice"}
]
},

{
name:"🌍 Awareness",
color:"#065f46",
locked:true,
questions:[
{q:"Trees give?",options:["Oxygen","Plastic","Smoke","Stone"],a:"Oxygen"},
{q:"Pollution is caused by?",options:["Humans","Clouds","Stars","Wind"],a:"Humans"},
{q:"Recycle means?",options:["Reuse","Burn","Throw","Ignore"],a:"Reuse"},
{q:"Clean energy?",options:["Solar","Coal","Oil","Gas"],a:"Solar"},
{q:"Water is?",options:["Precious","Useless","Danger","Waste"],a:"Precious"}
]
},

{
name:"❤️ Values",
color:"#7f1d1d",
locked:true,
questions:[
{q:"Honesty means?",options:["Truth","Lie","Cheat","Hide"],a:"Truth"},
{q:"Kindness is?",options:["Help","Hate","Fight","Ignore"],a:"Help"},
{q:"Respect means?",options:["Value others","Insult","Hate","Ignore"],a:"Value others"},
{q:"Forgive means?",options:["Let go anger","Fight","Blame","Hate"],a:"Let go anger"},
{q:"Good character builds?",options:["Trust","Fear","Enemies","Problems"],a:"Trust"}
]
},

{
name:"🧭 Responsibility",
color:"#92400e",
locked:true,
questions:[
{q:"Responsibility means?",options:["Duty","Avoid","Sleep","Run"],a:"Duty"},
{q:"Who is responsible?",options:["You","Others","Luck","None"],a:"You"},
{q:"Rules give?",options:["Safety","Chaos","Danger","Fear"],a:"Safety"},
{q:"Good student?",options:["Works","Ignores","Sleeps","Plays"],a:"Works"},
{q:"Accountability is?",options:["Own actions","Blame others","Hide","Escape"],a:"Own actions"}
]
},

{
name:"🏃 Health",
color:"#0ea5e9",
locked:true,
questions:[
{q:"Healthy food?",options:["Fruits","Junk","Candy","Soda"],a:"Fruits"},
{q:"Exercise gives?",options:["Fitness","Weakness","Pain","Stress"],a:"Fitness"},
{q:"Water helps?",options:["Hydration","Harm","Nothing","Danger"],a:"Hydration"},
{q:"Sleep improves?",options:["Health","Weakness","Pain","Fear"],a:"Health"},
{q:"Balanced diet?",options:["All nutrients","Only sugar","Only junk","Nothing"],a:"All nutrients"}
]
},

{
name:"🚦 Safety",
color:"#f97316",
locked:true,
questions:[
{q:"Red light means?",options:["Stop","Go","Run","Jump"],a:"Stop"},
{q:"Cross road via?",options:["Zebra","Anywhere","Run","Jump"],a:"Zebra"},
{q:"Seatbelt is?",options:["Safety","Style","Fun","Hobby"],a:"Safety"},
{q:"Danger means?",options:["Risk","Safe","Easy","Calm"],a:"Risk"},
{q:"Emergency action?",options:["Stay calm","Panic","Run","Ignore"],a:"Stay calm"}
]
},

{
name:"💻 Digital",
color:"#a855f7",
locked:true,
questions:[
{q:"Strong password?",options:["Unique","1234","Name","123"],a:"Unique"},
{q:"Sharing password?",options:["Bad","Good","Safe","Smart"],a:"Bad"},
{q:"Phishing is?",options:["Scam","Game","App","Site"],a:"Scam"},
{q:"Unknown link?",options:["Avoid","Click","Trust","Open"],a:"Avoid"},
{q:"Privacy is?",options:["Important","Useless","Fake","Optional"],a:"Important"}
]
},

{
name:"🏆 Final",
color:"#4c1d95",
locked:true,
questions:[
{q:"Success needs?",options:["Hard work","Luck","Sleep","Excuses"],a:"Hard work"},
{q:"Learning is?",options:["Continuous","Stop","None","Optional"],a:"Continuous"},
{q:"Failure means?",options:["Try again","Quit","Cry","Stop"],a:"Try again"},
{q:"Best attitude?",options:["Positive","Negative","Lazy","Angry"],a:"Positive"},
{q:"Growth comes from?",options:["Practice","Ignore","Fear","Hate"],a:"Practice"}
]
}
];

/* =========================
   UI
========================= */

function updateUI(){
document.getElementById("xp").innerText = state.xp;
document.getElementById("level").innerText = state.level;
document.getElementById("stars").innerText = state.stars;
document.getElementById("avatar").innerText = state.avatar;
}

/* =========================
   MAP
========================= */

function showMap(){

let html = "<div class='map'>";

worlds.forEach((w,i)=>{
html += `
<div class="node ${w.locked ? "locked":""}"
style="background:${w.color}"
onclick="${w.locked ? "" : `enterWorld(${i})`}">
${w.locked ? "🔒 Locked" : w.name}
</div>`;
});

html += "</div>";

document.getElementById("worldArea").innerHTML = html;
document.getElementById("gameArea").innerHTML = "";
document.getElementById("title").innerText = "World Map";
}

/* =========================
   ENTER WORLD
========================= */

function enterWorld(i){
state.world = i;
state.qIndex = 0;
loadQuestion();
}

/* =========================
   LOAD QUESTION (A/B/C/D SHUFFLE FIX)
========================= */

function loadQuestion(){

const w = worlds[state.world];
const q = w.questions[state.qIndex];

if(!q){
completeWorld();
return;
}

document.getElementById("title").innerText =
`${w.name} (${state.qIndex+1}/5)`;

clearInterval(timer);
timeLeft = 15;
document.getElementById("timer").innerText = timeLeft;

timer = setInterval(()=>{
timeLeft--;
document.getElementById("timer").innerText = timeLeft;
if(timeLeft <= 0) nextQuestion();
},1000);

/* SHUFFLE OPTIONS */
let options = shuffle([...q.options]);

const labels = ["A","B","C","D"];

let html = `
<div class="quiz-container">

<div class="question-box">
${q.q}
</div>

<div class="answer-box">
`;

options.forEach((opt,i)=>{
html += `
<button class="option-btn">
${labels[i]}. ${opt}
</button>`;
});

html += `
</div>
</div>`;

document.getElementById("gameArea").innerHTML = html;

/* CLICK HANDLER */
document.querySelectorAll(".option-btn").forEach(btn=>{
btn.addEventListener("click", ()=>{
const selected = btn.innerText.split(". ")[1];
checkAnswer(selected);
});
});
}

/* =========================
   CHECK ANSWER
========================= */

function checkAnswer(opt){

const q = worlds[state.world].questions[state.qIndex];

if(opt === q.a){
state.xp += 10;
state.stars++;
document.getElementById("result").innerText = "✔ Correct!";
}else{
document.getElementById("result").innerText = "❌ Wrong!";
}

nextQuestion();
}

/* =========================
   NEXT
========================= */

function nextQuestion(){
state.qIndex++;
save();
loadQuestion();
}

/* =========================
   WORLD COMPLETE
========================= */

function completeWorld(){

document.getElementById("gameArea").innerHTML =
"<h2>🏆 World Completed!</h2>";

if(worlds[state.world + 1]){
worlds[state.world + 1].locked = false;
}

setTimeout(showMap,1000);
}

/* =========================
   SAVE
========================= */

function save(){
localStorage.setItem("xp",state.xp);
localStorage.setItem("level",state.level);
localStorage.setItem("stars",state.stars);
localStorage.setItem("avatar",state.avatar);
}

/* =========================
   INIT
========================= */

showMap();
updateUI();
