
/* =========================
   STATE (CORE GAME DATA)
========================= */

const state = {
xp: +localStorage.getItem("xp") || 0,
level: +localStorage.getItem("level") || 1,
coins: +localStorage.getItem("coins") || 0,
stars: +localStorage.getItem("stars") || 0,
avatar: localStorage.getItem("avatar") || "🙂",

hp: +localStorage.getItem("hp") || 100,
maxHp: 100,

world: 0,
qIndex: 0,

lives: 3,
streak: 0,

badges: JSON.parse(localStorage.getItem("badges")) || []
};

/* =========================
   SOUND SYSTEM
========================= */

const sounds = {
correct: new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8a3.mp3"),
wrong: new Audio("https://cdn.pixabay.com/audio/2021/08/04/audio_4b9c8c.mp3"),
click: new Audio("https://cdn.pixabay.com/audio/2022/03/10/audio_c5c8b0.mp3"),
complete: new Audio("https://cdn.pixabay.com/audio/2022/03/10/audio_5b8c3b.mp3")
};

function play(s){
if(sounds[s]){
sounds[s].currentTime = 0;
sounds[s].play();
}
}

/* =========================
   WORLDS (MCQ GAME)
========================= */

const worlds = [
{
name:"🌱 Habits",
questions:[
{q:"Best habit?",options:["Exercise","Sleep","Games","Scroll"],a:"Exercise"},
{q:"Success needs?",options:["Discipline","Luck","Sleep","Fear"],a:"Discipline"},
{q:"Good routine?",options:["Plan","Chaos","Lazy","None"],a:"Plan"},
{q:"Health habit?",options:["Eat well","Junk","Skip","Nothing"],a:"Eat well"},
{q:"Growth needs?",options:["Practice","Ignore","Stop","Quit"],a:"Practice"}
]
},
{
name:"🌍 Awareness",
questions:[
{q:"Trees give?",options:["Oxygen","Plastic","Smoke","Stone"],a:"Oxygen"},
{q:"Pollution caused by?",options:["Humans","Clouds","Stars","Wind"],a:"Humans"},
{q:"Recycle means?",options:["Reuse","Burn","Throw","Ignore"],a:"Reuse"},
{q:"Clean energy?",options:["Solar","Coal","Oil","Gas"],a:"Solar"},
{q:"Water is?",options:["Precious","Useless","Danger","Waste"],a:"Precious"}
]
}
];

/* =========================
   UI UPDATE
========================= */

function updateUI(){

document.getElementById("xp").innerText = state.xp;
document.getElementById("level").innerText = state.level;
document.getElementById("coins").innerText = state.coins;
document.getElementById("avatar").innerText = state.avatar;

/* HEALTH BAR */
const hpFill = document.getElementById("hpFill");
if(hpFill){
hpFill.style.width = state.hp + "%";
}
}

/* =========================
   TYPE ANIMATION
========================= */

function typeText(el,text){
el.innerHTML="";
let i=0;

let interval=setInterval(()=>{
el.innerHTML += text[i];
i++;

if(i>=text.length){
clearInterval(interval);
}
},30);
}

/* =========================
   AVATAR EVOLUTION
========================= */

function updateAvatar(){
if(state.level >= 10) state.avatar = "🧠";
else if(state.level >= 5) state.avatar = "😎";
else state.avatar = "🙂";
}

/* =========================
   HP SYSTEM ❤️
========================= */

function damageHP(amount){
state.hp -= amount;

if(state.hp <= 0){
state.hp = 0;
gameOver();
}
}

/* =========================
   GAME OVER
========================= */

function gameOver(){
document.getElementById("gameArea").innerHTML = `
<h2 style="color:red;">💀 Game Over</h2>
<p>You ran out of health!</p>
<button onclick="location.reload()">Restart</button>
`;

play("wrong");
save();
}

/* =========================
   LOAD QUESTION
========================= */

function loadQuestion(){

const world = worlds[state.world];

if(!world){
gameComplete();
return;
}

const q = world.questions[state.qIndex];

if(!q){
stageComplete();
return;
}

document.getElementById("gameArea").innerHTML = `
<div class="quiz-container">
<div class="question-box" id="qbox"></div>
<div class="answer-box" id="abox"></div>
</div>
`;

typeText(document.getElementById("qbox"), q.q);

/* shuffle options */
let options = [...q.options].sort(()=>Math.random()-0.5);

const box = document.getElementById("abox");

options.forEach(opt=>{

const btn = document.createElement("button");
btn.className = "option-btn";
btn.innerText = opt;

btn.onclick = ()=>{
checkAnswer(opt, q.a);
};

box.appendChild(btn);
});
}

/* =========================
   CHECK ANSWER
========================= */

function checkAnswer(opt, correct){

if(opt === correct){

play("correct");

state.streak++;
state.xp += state.streak >= 5 ? 20 : 10;
state.coins += 5;
state.stars++;

}else{

play("wrong");

state.streak = 0;
damageHP(25);
}

nextQuestion();
}

/* =========================
   NEXT QUESTION
========================= */

function nextQuestion(){

state.qIndex++;

updateAvatar();
updateUI();
save();

setTimeout(loadQuestion, 200);
}

/* =========================
   STAGE REWARD SYSTEM 🏆
========================= */

function stageComplete(){

play("complete");

state.coins += 50;
state.xp += 100;
state.hp = Math.min(100, state.hp + 30);

/* badge */
let badge = "🌍 Stage Complete";

if(state.world === 0) badge = "🌱 Habits Master";
if(state.world === 1) badge = "🌍 Awareness Hero";

state.badges.push(badge);

document.getElementById("gameArea").innerHTML = `
<div class="reward-card">
<h2>🎉 STAGE COMPLETED!</h2>

<p>💰 +50 Coins</p>
<p>⭐ +100 XP</p>
<p>❤️ +30 HP</p>
<p>🏅 ${badge}</p>

<button onclick="nextWorld()">▶ Continue</button>
</div>
`;

save();
updateUI();
}

/* =========================
   NEXT WORLD
========================= */

function nextWorld(){
state.world++;
state.qIndex = 0;
loadQuestion();
}

/* =========================
   GAME COMPLETE
========================= */

function gameComplete(){

document.getElementById("gameArea").innerHTML = `
<h2>🏆 YOU COMPLETED ALL WORLDS!</h2>
<p>Final Score: ${state.xp} XP</p>
`;

play("complete");
save();
}

/* =========================
   SHOP SYSTEM 💰
========================= */

function buyItem(item){

if(item === "life"){

if(state.coins < 30) return alert("Not enough coins!");
state.coins -= 30;
state.hp = Math.min(100, state.hp + 30);

}

if(item === "skip"){

if(state.coins < 20) return alert("Not enough coins!");
state.coins -= 20;
state.qIndex++;

loadQuestion();

}

if(item === "hint"){

if(state.coins < 15) return alert("Not enough coins!");
state.coins -= 15;
alert("💡 Think about keywords!");

}

save();
updateUI();
}

/* =========================
   ROCK PAPER SCISSORS 🎮
========================= */

function rps(player){

const arr = ["rock","paper","scissors"];
const ai = arr[Math.floor(Math.random()*3)];

if(player === ai){
alert("Draw!");
}
else if(
(player==="rock" && ai==="scissors") ||
(player==="paper" && ai==="rock") ||
(player==="scissors" && ai==="paper")
){
alert("You Win!");
state.coins += 10;
}
else{
alert("You Lose!");
damageHP(10);
}

updateUI();
save();
}

/* =========================
   SAVE SYSTEM
========================= */

function save(){

localStorage.setItem("xp", state.xp);
localStorage.setItem("level", state.level);
localStorage.setItem("coins", state.coins);
localStorage.setItem("hp", state.hp);
localStorage.setItem("avatar", state.avatar);
localStorage.setItem("badges", JSON.stringify(state.badges));

}

/* =========================
   INIT
========================= */

updateUI();
loadQuestion();
