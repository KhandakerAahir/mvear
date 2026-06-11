
/* =========================
   STATE
========================= */

const STORAGE_KEYS = {
  xp: "mvear_xp",
  level: "mvear_level",
  stars: "mvear_stars",
  avatar: "mvear_avatar"
};

let state = {
  xp: +localStorage.getItem(STORAGE_KEYS.xp) || 0,
  level: +localStorage.getItem(STORAGE_KEYS.level) || 1,
  stars: +localStorage.getItem(STORAGE_KEYS.stars) || 0,
  avatar: localStorage.getItem(STORAGE_KEYS.avatar) || "🙂",
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
musicOn ? music.pause() : music.play();
musicOn = !musicOn;
}

/* =========================
   AVATAR
========================= */

const avatars = ["🙂","😎","🧠","👨‍💻","🚀","🤖"];

function setAvatar(){
const pick = prompt("Choose avatar:\n" + avatars.join(" "));
if(avatars.includes(pick)){
state.avatar = pick;
save();
updateUI();
}
}

/* =========================
   WORLDS (8)
========================= */

const worlds = [
{
name:"🌱 Habits",
color:"#1f2937",
locked:false,
questions:[/* 5 MCQs */]
},
{
name:"🌍 Awareness",
color:"#065f46",
locked:true,
questions:[/* 5 MCQs */]
},
{
name:"❤️ Values",
color:"#7f1d1d",
locked:true,
questions:[/* 5 MCQs */]
},
{
name:"🧭 Responsibility",
color:"#92400e",
locked:true,
questions:[/* 5 MCQs */]
},
{
name:"🏃 Health",
color:"#0ea5e9",
locked:true,
questions:[/* 5 MCQs */]
},
{
name:"🚦 Safety",
color:"#f97316",
locked:true,
questions:[/* 5 MCQs */]
},
{
name:"💻 Digital",
color:"#a855f7",
locked:true,
questions:[/* 5 MCQs */]
},
{
name:"🏆 Final",
color:"#4c1d95",
locked:true,
questions:[/* 5 MCQs */]
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
const bar = document.getElementById("xpBar");
bar.style.width = ((state.xp % 50) * 2) + "%";
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

function enterWorld(index){
state.world = index;
state.qIndex = 0;
loadQuestion();
}

/* =========================
   LOAD QUESTION
========================= */

function loadQuestion(){

const world = worlds[state.world];
const q = world.questions[state.qIndex];

if(!q){
completeWorld();
return;
}

document.getElementById("title").innerText =
`${world.name} (${state.qIndex+1}/5)`;

startTimer();

let options = q.options.map(opt=>{
return `<button class="option-btn" onclick="checkAnswer('${opt}')">${opt}</button>`;
}).join("");

document.getElementById("gameArea").innerHTML = `
<div class="quiz-container">

<div class="question-box">
${q.q}
</div>

<div class="answer-box">
${options}
</div>

</div>`;
}

/* =========================
   TIMER
========================= */

function startTimer(){
clearInterval(timer);
timeLeft = 15;

document.getElementById("timer").innerText = timeLeft;

timer = setInterval(()=>{
timeLeft--;
document.getElementById("timer").innerText = timeLeft;

if(timeLeft <= 0){
nextQuestion();
}
},1000);
}

/* =========================
   CHECK ANSWER
========================= */

function checkAnswer(answer){

const q = worlds[state.world].questions[state.qIndex];

if(answer === q.a){
state.xp += 10;
state.stars += 1;
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
`<h2>🏆 World Completed!</h2>`;

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

const box = document.getElementById("levelUpScreen");
box.classList.remove("hidden");

document.getElementById("levelText").innerText =
`Level ${state.level}`;

setTimeout(()=>{
box.classList.add("hidden");
},2000);
}

/* =========================
   SAVE / LOAD
========================= */

function save(){
localStorage.setItem(STORAGE_KEYS.xp, state.xp);
localStorage.setItem(STORAGE_KEYS.level, state.level);
localStorage.setItem(STORAGE_KEYS.stars, state.stars);
localStorage.setItem(STORAGE_KEYS.avatar, state.avatar);
}

/* =========================
   INIT
========================= */

updateUI();
showMap();
