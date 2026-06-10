/* STATE */
let stars = +localStorage.getItem("stars") || 0;
let xp = +localStorage.getItem("xp") || 0;
let level = +localStorage.getItem("level") || 1;
let rank = localStorage.getItem("rank") || "Beginner";

let avatar = localStorage.getItem("avatar") || "👦";

let progress = JSON.parse(localStorage.getItem("progress"));
if(!progress || !Array.isArray(progress.completed)){
progress = { completed: [] };
}

/* GAME STATE */
let current = 0;
let q = 0;
let streak = 0;
let timer = null;
let time = 0;

/* WORLDS (8) */
const worlds = [
"🌱 Habits","🌍 Awareness","❤️ Values","🧭 Responsibility",
"🏃 Health","🚦 Safety","💻 Digital","🏆 Final"
].map((n,i)=>({
name:n,
color:["#1f2937","#065f46","#7f1d1d","#92400e","#0ea5e9","#f97316","#a855f7","#4c1d95"][i],
questions:Array.from({length:10},(_,x)=>[`Q${x+1} in ${n}?`,"yes"])
}));

/* UI */
function update(){
document.getElementById("stars").innerText=stars;
document.getElementById("xp").innerText=xp;
document.getElementById("level").innerText=level;
document.getElementById("rank").innerText=rank;
document.getElementById("avatar").innerText=avatar;
}
update();

/* MAP */
function showMap(){
document.getElementById("title").innerText="🌍 Map";

let html="<div class='map'>";

worlds.forEach((w,i)=>{
let ok = i===0 || progress.completed.includes(i-1);

html+=`
<div class="node"
style="background:${w.color}"
onclick="enter(${i})">
${ok? w.name : "🔒"}
</div>`;
});

html+="</div>";

document.getElementById("worldArea").innerHTML=html;
document.getElementById("gameArea").innerHTML="";
}

/* ENTER */
function enter(i){

if(!(i===0 || progress.completed.includes(i-1))){
document.getElementById("result").innerText="Locked";
return;
}

if(!puzzleGate()) return;

current=i;
q=0;
load();
}

/* PUZZLE GATE */
function puzzleGate(){
let a=prompt("Gate: 2+2?");
return a==="4";
}

/* LOAD QUESTION */
function load(){

let w=worlds[current];
let qu=w.questions[q];

if(!qu){
finishWorld();
return;
}

document.getElementById("title")=w.name;

time=15;
startTimer();

document.getElementById("gameArea").innerHTML=`
<p>${qu[0]}</p>
<input id="ans">
<button onclick="check()">OK</button>
`;
}

/* TIMER */
function startTimer(){
clearInterval(timer);

timer=setInterval(()=>{
time--;
document.getElementById("timer").innerText=time;

if(time<=0){
clearInterval(timer);
q++;
load();
}
},1000);
}

/* CHECK */
function check(){

let a=document.getElementById("ans").value.toLowerCase();
let w=worlds[current].questions[q];

if(a===w[1]){
stars++;
xp+=5;
streak++;
document.getElementById("result").innerText="✔";
}else{
streak=0;
document.getElementById("result").innerText="❌ NPC: Try again!";
}

if(streak%3===0) xp+=10;

q++;
levelCheck();
save();
load();
}

/* LEVEL */
function levelCheck(){
if(xp>=level*50){
xp-=level*50;
level++;
document.body.style.background="#1a2e1a";
setTimeout(()=>document.body.style.background="#0b1220",500);
}
rankSystem();
}

/* RANK */
function rankSystem(){
if(xp>300) rank="Legend 🔥";
else if(xp>200) rank="Master 🏆";
else if(xp>120) rank="Guardian 🛡️";
else if(xp>60) rank="Explorer 🌍";
}

/* FINISH */
function finishWorld(){
if(!progress.completed.includes(current)){
progress.completed.push(current);
stars+=10;
xp+=20;
}
save();
document.getElementById("gameArea").innerHTML="🏆 Completed!";
}

/* DAILY */
function daily(){
let today=new Date().toDateString();
let last=localStorage.getItem("daily");

if(last===today){
alert("Already done");
return;
}

localStorage.setItem("daily",today);
stars+=5;
xp+=20;
save();
}

/* SAVE */
function save(){
localStorage.setItem("stars",stars);
localStorage.setItem("xp",xp);
localStorage.setItem("level",level);
localStorage.setItem("rank",rank);
localStorage.setItem("progress",JSON.stringify(progress));
update();
}
