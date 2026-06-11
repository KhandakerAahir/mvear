
/* =========================
   STATE
========================= */

const state = {
xp: +localStorage.getItem("xp") || 0,
level: +localStorage.getItem("level") || 1,
stars: +localStorage.getItem("stars") || 0,
avatar: localStorage.getItem("avatar") || "🙂",
world: 0,
qIndex: 0,
lives: 3,
streak: 0,
typingLock: false
};

/* =========================
   SOUND SYSTEM
========================= */

const sounds = {
correct: new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8a3.mp3"),
wrong: new Audio("https://cdn.pixabay.com/audio/2021/08/04/audio_4b9c8c.mp3"),
click: new Audio("https://cdn.pixabay.com/audio/2022/03/10/audio_c5c8b0.mp3")
};

function play(s){
if(sounds[s]){
sounds[s].currentTime = 0;
sounds[s].play();
}
}

/* =========================
   SHUFFLE (SAFE)
========================= */

function shuffle(arr){
let a=[...arr];
for(let i=a.length-1;i>0;i--){
let j=Math.floor(Math.random()*(i+1));
[a[i],a[j]]=[a[j],a[i]];
}
return a;
}

/* =========================
   WORLDS (SAFE STRUCTURE)
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
}
];

/* =========================
   UI UPDATE (SAFE)
========================= */

function updateUI(){
const el = (id)=>document.getElementById(id);

if(el("xp")) el("xp").innerText=state.xp;
if(el("level")) el("level").innerText=state.level;
if(el("stars")) el("stars").innerText=state.stars;
if(el("avatar")) el("avatar").innerText=state.avatar;

/* lives display optional */
if(el("result")){
el("result").innerText = `❤️ Lives: ${state.lives} | 🔥 Streak: ${state.streak}`;
}
}

/* =========================
   TYPEWRITER (SAFE)
========================= */

function typeText(el,text){
if(state.typingLock) return;
state.typingLock=true;

el.innerHTML="";
let i=0;

let interval=setInterval(()=>{
el.innerHTML+=text[i];
i++;

if(i>=text.length){
clearInterval(interval);
state.typingLock=false;
}
},35);
}

/* =========================
   AVATAR EVOLUTION
========================= */

function updateAvatar(){
if(state.level>=10) state.avatar="🧠";
else if(state.level>=5) state.avatar="😎";
else state.avatar="🙂";
}

/* =========================
   LIVES SYSTEM
========================= */

function loseLife(){
state.lives--;

if(state.lives<=0){
alert("💀 Game Over");
location.reload();
}
}

/* =========================
   XP MULTIPLIER
========================= */

function xpGain(){
return state.streak>=5 ? 20 : 10;
}

/* =========================
   LOAD QUESTION (FIXED CORE)
========================= */

function loadQuestion(){

const w=worlds[state.world];

if(!w || !w.questions) return;

const q=w.questions[state.qIndex];

if(!q){
alert("🏆 World Completed! Badge unlocked!");
return;
}

/* reset UI safely */
document.getElementById("gameArea").innerHTML=`
<div class="quiz-container">
<div class="question-box" id="qbox"></div>
<div class="answer-box" id="abox"></div>
</div>`;

/* question animation */
typeText(document.getElementById("qbox"),q.q);

/* shuffle options safely */
const opts=shuffle(q.options);

/* render answers */
const labels=["A","B","C","D"];
const box=document.getElementById("abox");
box.innerHTML="";

opts.forEach((opt,i)=>{
const btn=document.createElement("button");
btn.className="option-btn";
btn.innerText=`${labels[i]}. ${opt}`;

btn.onclick=()=>{
play("click");
checkAnswer(opt,q.a);
};

box.appendChild(btn);
});
}

/* =========================
   CHECK ANSWER
========================= */

function checkAnswer(opt,correct){

if(opt===correct){
play("correct");
state.streak++;
state.xp+=xpGain();
state.stars++;
}else{
play("wrong");
state.streak=0;
loseLife();
}

nextQuestion();
}

/* =========================
   NEXT QUESTION (SAFE)
========================= */

function nextQuestion(){
state.qIndex++;
updateAvatar();
updateUI();
save();
setTimeout(loadQuestion,200);
}

/* =========================
   ROCK PAPER SCISSORS
========================= */

function rps(player){

const arr=["rock","paper","scissors"];
const ai=arr[Math.floor(Math.random()*3)];

if(player===ai){
alert("Draw!");
}
else if(
(player==="rock"&&ai==="scissors")||
(player==="paper"&&ai==="rock")||
(player==="scissors"&&ai==="paper")
){
alert("You Win!");
state.xp+=10;
}
else{
alert("You Lose!");
}

updateUI();
save();
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
   INIT SAFELY
========================= */

updateUI();
loadQuestion();
