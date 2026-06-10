
/* =========================
   STATE
========================= */
let stars = +localStorage.getItem("stars") || 0;
let xp = +localStorage.getItem("xp") || 0;
let level = +localStorage.getItem("level") || 1;

let avatar = localStorage.getItem("avatar") || "🙂";

let current = 0;
let qIndex = 0;
let timer;
let time = 0;
let streak = 0;

/* =========================
   SOUND SYSTEM
========================= */
const sounds = {
correct: new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a3.mp3"),
wrong: new Audio("https://cdn.pixabay.com/download/audio/2021/08/04/audio_4b9c8c.mp3"),
click: new Audio("https://cdn.pixabay.com/download/audio/2022/03/10/audio_c5c8b0.mp3")
};

function play(s){
if(sounds[s]){
sounds[s].currentTime = 0;
sounds[s].play();
}
}

/* =========================
   AVATAR
========================= */
function setAvatar(){
let pick = prompt("Choose avatar 🙂 😎 👦 👧 🧠");
if(pick){
avatar = pick;
localStorage.setItem("avatar", avatar);
document.getElementById("avatar").innerText = avatar;
}
}

/* =========================
   WORLDS (8 + DIFFICULTY)
========================= */
const worlds = [
{
name:"🌱 Habits",
color:"#1f2937",
questions:[
{q:"Brush teeth daily?",a:"yes",d:"easy"},
{q:"Wake early?",a:"yes",d:"easy"},
{q:"Sleep at 3AM healthy?",a:"no",d:"easy"},
{q:"Routine helps life?",a:"yes",d:"medium"},
{q:"Discipline matters?",a:"yes",d:"medium"},
{q:"Laziness is good?",a:"no",d:"medium"},
{q:"Consistency > talent?",a:"yes",d:"hard"},
{q:"Habits shape future?",a:"yes",d:"hard"},
{q:"Quit after failure?",a:"no",d:"hard"}
]
},

{
name:"🌍 Awareness",
color:"#065f46",
questions:[
{q:"Trees give oxygen?",a:"yes",d:"easy"},
{q:"Pollution good?",a:"no",d:"easy"},
{q:"Save water?",a:"yes",d:"easy"},
{q:"Recycle waste?",a:"yes",d:"medium"},
{q:"Plastic harmful?",a:"yes",d:"medium"},
{q:"Nature important?",a:"yes",d:"medium"},
{q:"Cut trees randomly ok?",a:"no",d:"hard"},
{q:"Protect animals?",a:"yes",d:"hard"},
{q:"Earth needs care?",a:"yes",d:"hard"}
]
},

{
name:"❤️ Values",
color:"#7f1d1d",
questions:[
{q:"Be honest?",a:"yes",d:"easy"},
{q:"Lying good?",a:"no",d:"easy"},
{q:"Help others?",a:"yes",d:"easy"},
{q:"Stealing ok?",a:"no",d:"medium"},
{q:"Respect elders?",a:"yes",d:"medium"},
{q:"Kindness matters?",a:"yes",d:"medium"},
{q:"Cheating is good?",a:"no",d:"hard"},
{q:"Forgive others?",a:"yes",d:"hard"},
{q:"Respect important?",a:"yes",d:"hard"}
]
},

{
name:"🧭 Responsibility",
color:"#92400e",
questions:[
{q:"Do homework?",a:"yes",d:"easy"},
{q:"Avoid duty?",a:"no",d:"easy"},
{q:"Help family?",a:"yes",d:"easy"},
{q:"Ignore tasks?",a:"no",d:"medium"},
{q:"Be responsible?",a:"yes",d:"medium"},
{q:"Follow rules?",a:"yes",d:"medium"},
{q:"Blame others?",a:"no",d:"hard"},
{q:"Complete work?",a:"yes",d:"hard"},
{q:"Accountability matters?",a:"yes",d:"hard"}
]
},

{
name:"🏃 Health",
color:"#0ea5e9",
questions:[
{q:"Exercise daily?",a:"yes",d:"easy"},
{q:"Drink water?",a:"yes",d:"easy"},
{q:"Eat junk always?",a:"no",d:"easy"},
{q:"Sleep 8 hours?",a:"yes",d:"medium"},
{q:"Stay active?",a:"yes",d:"medium"},
{q:"Skip meals often?",a:"no",d:"medium"},
{q:"Health matters?",a:"yes",d:"hard"},
{q:"Fitness important?",a:"yes",d:"hard"},
{q:"Ignore health?",a:"no",d:"hard"}
]
},

{
name:"🚦 Safety",
color:"#f97316",
questions:[
{q:"Cross safely?",a:"yes",d:"easy"},
{q:"Play on road?",a:"no",d:"easy"},
{q:"Follow signals?",a:"yes",d:"easy"},
{q:"Be careless?",a:"no",d:"medium"},
{q:"Stay alert?",a:"yes",d:"medium"},
{q:"Safety matters?",a:"yes",d:"medium"},
{q:"Ignore danger?",a:"no",d:"hard"},
{q:"Be responsible traffic?",a:"yes",d:"hard"},
{q:"Risky behavior ok?",a:"no",d:"hard"}
]
},

{
name:"💻 Digital",
color:"#a855f7",
questions:[
{q:"Share password?",a:"no",d:"easy"},
{q:"Safe internet?",a:"yes",d:"easy"},
{q:"Click unknown links?",a:"no",d:"easy"},
{q:"Protect privacy?",a:"yes",d:"medium"},
{q:"Strong password?",a:"yes",d:"medium"},
{q:"Cyber safety important?",a:"yes",d:"medium"},
{q:"Trust strangers online?",a:"no",d:"hard"},
{q:"Internet risky?",a:"yes",d:"hard"},
{q:"Stay alert online?",a:"yes",d:"hard"}
]
},

{
name:"🏆 Final",
color:"#4c1d95",
questions:[
{q:"Good habits matter?",a:"yes",d:"easy"},
{q:"Learning important?",a:"yes",d:"easy"},
{q:"Responsibility matters?",a:"yes",d:"easy"},
{q:"Help others?",a:"yes",d:"medium"},
{q:"Stay disciplined?",a:"yes",d:"medium"},
{q:"Be honest?",a:"yes",d:"medium"},
{q:"Ignore learning?",a:"no",d:"hard"},
{q:"Self growth matters?",a:"yes",d:"hard"},
{q:"Values shape life?",a:"yes",d:"hard"}
]
}
];

/* =========================
   UI UPDATE
========================= */
function updateUI(){
document.getElementById("stars").innerText=stars;
document.getElementById("xp").innerText=xp;
document.getElementById("level").innerText=level;
document.getElementById("avatar").innerText=avatar;
}
updateUI();

/* =========================
   MAP
========================= */
function showMap(){
play("click");

document.getElementById("title").innerText="🌍 World Map";

let html="<div class='map'>";

worlds.forEach((w,i)=>{
html+=`
<div class="node"
style="background:${w.color}"
onclick="enter(${i})">
${w.name}
</div>`;
});

html+="</div>";

document.getElementById("worldArea").innerHTML=html;
document.getElementById("gameArea").innerHTML="";
}

/* =========================
   ENTER WORLD
========================= */
function enter(i){
play("click");
current=i;
qIndex=0;
load();
}

/* =========================
   LOAD QUESTION
========================= */
function load(){

let w=worlds[current];
let q=w.questions[qIndex];

if(!q){
document.getElementById("gameArea").innerHTML="🏆 World Completed!";
return;
}

document.getElementById("title").innerText =
w.name + " [" + q.d + "]";

startTimer(q.d);

document.getElementById("gameArea").innerHTML=`
<p>${q.q}</p>
<input id="ans" placeholder="yes / no">
<button onclick="check()">Submit</button>
`;
}

/* =========================
   TIMER (DIFFICULTY)
========================= */
function startTimer(d){

clearInterval(timer);

time =
d==="easy"?20 :
d==="medium"?15 :10;

document.getElementById("timer").innerText=time;

timer=setInterval(()=>{
time--;
document.getElementById("timer").innerText=time;

if(time<=0){
clearInterval(timer);
qIndex++;
load();
}
},1000);
}

/* =========================
   CHECK ANSWER
========================= */
function check(){

let ans=document.getElementById("ans").value.toLowerCase();
let q=worlds[current].questions[qIndex];

if(ans===q.a){
play("correct");

stars++;
streak++;

if(q.d==="easy") xp+=5;
if(q.d==="medium") xp+=10;
if(q.d==="hard") xp+=20;

document.getElementById("result").innerText="✔ Correct!";
}else{
play("wrong");
streak=0;
document.getElementById("result").innerText="❌ Wrong!";
}

if(streak%3===0) xp+=10;

qIndex++;
levelCheck();
save();
load();
}

/* =========================
   LEVEL SYSTEM
========================= */
function levelCheck(){

if(xp>=level*50){
xp-=level*50;
level++;
document.body.style.background="#1a2e1a";
setTimeout(()=>document.body.style.background="#0b1220",400);
}

updateUI();
}

/* =========================
   SAVE
========================= */
function save(){
localStorage.setItem("stars",stars);
localStorage.setItem("xp",xp);
localStorage.setItem("level",level);
}
