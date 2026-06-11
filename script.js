
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

const avatars = ["🙂","😎","🧠","👨‍💻","🚀","🤖"];

function setAvatar(){
let pick = prompt("Choose avatar:\n" + avatars.join(" "));
if(avatars.includes(pick)){
state.avatar = pick;
save();
updateUI();
}
}

/* =========================
   WORLDS (8 MCQ WORLDS)
========================= */

const worlds = [
{
name:"🌱 Habits",
color:"#1f2937",
locked:false,
questions:[
{q:"Best morning habit?",options:["Exercise","Sleep all day","Skip breakfast","Stay lazy"],a:"Exercise"},
{q:"Healthy sleep is?",options:["6-8 hours","2 hours","12 hours","No sleep"],a:"6-8 hours"},
{q:"Success needs?",options:["Discipline","Luck only","No work","Games"],a:"Discipline"},
{q:"Good habit is?",options:["Reading","Smoking","Laziness","Skipping work"],a:"Reading"},
{q:"Routine helps?",options:["Yes","No","Never","Harmful"],a:"Yes"}
]
},

{
name:"🌍 Awareness",
color:"#065f46",
locked:true,
questions:[
{q:"Trees give?",options:["Oxygen","Smoke","Plastic","Stone"],a:"Oxygen"},
{q:"Pollution is caused by?",options:["Humans","Clouds","Stars","Rain"],a:"Humans"},
{q:"Recycle means?",options:["Reuse waste","Burn it","Throw anywhere","Ignore"],a:"Reuse waste"},
{q:"Clean energy example?",options:["Solar","Coal","Oil","Gas"],a:"Solar"},
{q:"Water is?",options:["Precious","Useless","Waste","Danger only"],a:"Precious"}
]
},

{
name:"❤️ Values",
color:"#7f1d1d",
locked:true,
questions:[
{q:"Honesty means?",options:["Truth","Lying","Cheating","Hiding"],a:"Truth"},
{q:"Kindness means?",options:["Helping","Hurting","Ignoring","Fighting"],a:"Helping"},
{q:"Respect means?",options:["Value others","Insult","Ignore","Hate"],a:"Value others"},
{q:"Forgiveness is?",options:["Let go anger","Revenge","Fight","Blame"],a:"Let go anger"},
{q:"Good character builds?",options:["Trust","Enemies","Fear","Problems"],a:"Trust"}
]
},

{
name:"🧭 Responsibility",
color:"#92400e",
locked:true,
questions:[
{q:"Responsibility means?",options:["Duty","Avoid","Sleep","Ignore"],a:"Duty"},
{q:"Who is responsible?",options:["You","Others","Luck","Friends"],a:"You"},
{q:"Good student?",options:["Works","Ignores","Sleeps","Plays"],a:"Works"},
{q:"Rules ensure?",options:["Safety","Danger","Chaos","Confusion"],a:"Safety"},
{q:"Accountability is?",options:["Own actions","Blaming","Hiding","Lying"],a:"Own actions"}
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
{q:"Balanced diet is?",options:["All nutrients","Only sugar","Only junk","Nothing"],a:"All nutrients"}
]
},

{
name:"🚦 Safety",
color:"#f97316",
locked:true,
questions:[
{q:"Red light means?",options:["Stop","Go","Run","Jump"],a:"Stop"},
{q:"Cross road via?",options:["Zebra","Anywhere","Run","Jump"],a:"Zebra"},
{q:"Seatbelt is for?",options:["Safety","Style","Fun","Hobby"],a:"Safety"},
{q:"Danger means?",options:["Risk","Safe","Easy","Calm"],a:"Risk"},
{q:"Emergency you should?",options:["Stay calm","Panic","Run","Ignore"],a:"Stay calm"}
]
},

{
name:"💻 Digital",
color:"#a855f7",
locked:true,
questions:[
{q:"Strong password?",options:["Unique","1234","name","abcd"],a:"Unique"},
{q:"Sharing password is?",options:["Bad","Good","Safe","Smart"],a:"Bad"},
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
updateXPBar();
}

function updateXPBar(){
document.getElementById("xpBar").style.width =
((state.xp % 50) * 2) + "%";
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
   LOAD QUESTION (FIXED MCQ)
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

timer = setInterval(()=>{
timeLeft--;
document.getElementById("timer").innerText = timeLeft;

if(timeLeft <= 0){
nextQuestion();
}
},1000);

let html = `
<div class="quiz-container">

<div class="question-box">
${q.q}
</div>

<div class="answer-box" id="answers">
`;

q.options.forEach(opt=>{
html += `<button class="option-btn" data-opt="${opt}">${opt}</button>`;
});

html += `
</div>
</div>`;

document.getElementById("gameArea").innerHTML = html;

/* attach events safely */
document.querySelectorAll(".option-btn").forEach(btn=>{
btn.onclick = () => checkAnswer(btn.dataset.opt);
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
   NEXT QUESTION
========================= */

function nextQuestion(){
state.qIndex++;
checkLevel();
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
   LEVEL SYSTEM
========================= */

function checkLevel(){

if(state.xp >= state.level * 50){
state.xp -= state.level * 50;
state.level++;
showLevelUp();
}

updateUI();
}

function showLevelUp(){

let box = document.getElementById("levelUpScreen");
box.classList.remove("hidden");

document.getElementById("levelText").innerText =
"Level " + state.level;

setTimeout(()=>{
box.classList.add("hidden");
},2000);
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

updateUI();
showMap();
