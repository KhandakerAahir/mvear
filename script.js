let stars = +localStorage.getItem("stars") || 0;
let xp = +localStorage.getItem("xp") || 0;
let level = +localStorage.getItem("level") || 1;
let avatar = localStorage.getItem("avatar") || "🙂";

let current = 0;
let qIndex = 0;
let timer;
let time = 0;
let streak = 0;
let skill = 1;

/* MUSIC */
let music = new Audio("https://cdn.pixabay.com/audio/2022/10/16/audio_7c6f3.mp3");
music.loop = true;
let musicOn = false;

function toggleMusic(){
if(!musicOn){music.play();musicOn=true;}
else{music.pause();musicOn=false;}
}

/* SOUND */
const sounds = {
correct:new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a3.mp3"),
wrong:new Audio("https://cdn.pixabay.com/download/audio/2021/08/04/audio_4b9c8c.mp3"),
click:new Audio("https://cdn.pixabay.com/download/audio/2022/03/10/audio_c5c8b0.mp3")
};

function play(s){
if(sounds[s]){
sounds[s].currentTime=0;
sounds[s].play();
}
}

/* AVATAR */
const avatars=["🙂","😎","🧠","👨‍💻","🚀","🤖"];

function setAvatar(){
let pick=prompt("Choose: "+avatars.join(" "));
if(avatars.includes(pick)){
avatar=pick;
localStorage.setItem("avatar",avatar);
updateUI();
}
}

/* WORLDS */
const worlds=[
{name:"🌱 Habits",color:"#1f2937",locked:false,questions:[
{q:"Brush teeth daily?",a:"yes",d:"easy"},
{q:"Wake early?",a:"yes",d:"easy"},
{q:"Sleep late good?",a:"no",d:"easy"}
]},

{name:"🌍 Awareness",color:"#065f46",locked:true,questions:[
{q:"Trees give oxygen?",a:"yes",d:"easy"}
]},

{name:"❤️ Values",color:"#7f1d1d",locked:true,questions:[
{q:"Be honest?",a:"yes",d:"easy"}
]}
];

/* UI */
function updateUI(){
document.getElementById("stars").innerText=stars;
document.getElementById("xp").innerText=xp;
document.getElementById("level").innerText=level;
document.getElementById("avatar").innerText=avatar;
}
updateUI();

/* MAP */
function showMap(){
let html="<div class='map'>";
worlds.forEach((w,i)=>{
html+=`
<div class="node"
style="background:${w.color};opacity:${w.locked?0.4:1}"
onclick="${w.locked?'':`enter(${i})`}">
${w.locked?'🔒 Locked':w.name}
</div>`;
});
html+="</div>";
document.getElementById("worldArea").innerHTML=html;
document.getElementById("gameArea").innerHTML="";
}

/* ENTER */
function enter(i){
current=i;
qIndex=0;
load();
}

/* LOAD */
function load(){
let w=worlds[current];
let q=w.questions[qIndex];

if(!q){
document.getElementById("gameArea").innerHTML="🏆 Completed!";
if(worlds[current+1]) worlds[current+1].locked=false;
return;
}

document.getElementById("title")=w.name+" ["+q.d+"]";

time = q.d==="easy"?20:15;

timer=setInterval(()=>{
time--;
document.getElementById("timer").innerText=time;
if(time<=0){qIndex++;load();}
},1000);

document.getElementById("gameArea").innerHTML=`
<div class="quiz-container">
<div class="question-box">${q.q}</div>
<div class="answer-box">
<button onclick="check('yes')">YES</button>
<button onclick="check('no')">NO</button>
</div>
</div>`;
}

/* CHECK */
function check(ans){
let q=worlds[current].questions[qIndex];

if(ans===q.a){
stars++;xp+=10;streak++;
play("correct");
}else{
streak=0;
play("wrong");
}

if(streak%3===0) xp+=10;

qIndex++;
levelCheck();
save();
load();
}

/* LEVEL */
function levelCheck(){
if(xp>=level*50){
xp-=level*50;
level++;
showLevelUp();
}
updateUI();
}

/* LEVEL SCREEN */
function showLevelUp(){
let s=document.getElementById("levelUpScreen");
s.classList.remove("hidden");
document.getElementById("levelText").innerText="Level "+level;

setTimeout(()=>s.classList.add("hidden"),2000);
}

/* SAVE */
function save(){
localStorage.setItem("stars",stars);
localStorage.setItem("xp",xp);
localStorage.setItem("level",level);
}
