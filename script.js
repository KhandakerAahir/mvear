const state = {
xp:0,
level:1,
coins:0,
hp:100,
world:0,
qIndex:0,
bossHp:100
};

const worlds = [
{
name:"🌲 Forest",
bossHp:100,
questions:[
{q:"2+2?",options:["3","4","5","6"],a:"4"},
{q:"5-3?",options:["1","2","3","4"],a:"2"},
{q:"10/2?",options:["4","5","6","3"],a:"5"}
]
},
{
name:"🏜️ Desert",
bossHp:120,
questions:[
{q:"3+3?",options:["5","6","7","8"],a:"6"},
{q:"4×2?",options:["6","7","8","9"],a:"8"},
{q:"9-3?",options:["5","6","7","8"],a:"6"}
]
},
{
name:"❄️ Winter",
bossHp:140,
questions:[
{q:"6+6?",options:["11","12","13","14"],a:"12"},
{q:"8-2?",options:["5","6","7","8"],a:"6"},
{q:"2×5?",options:["9","10","11","12"],a:"10"}
]
}
];

function showStages(){
document.getElementById("title").innerText="Select Stage";

let html=`<div class="stage-menu">`;

worlds.forEach((w,i)=>{
html+=`<button onclick="startWorld(${i})">${w.name}</button>`;
});

html+=`</div>`;
document.getElementById("gameArea").innerHTML=html;
}

function startWorld(i){
state.world=i;
state.qIndex=0;
state.hp=100;
state.bossHp=worlds[i].bossHp;
loadQ();
}

function loadQ(){

let w=worlds[state.world];

if(state.qIndex>=3 || state.hp<=0 || state.bossHp<=0){
return endWorld();
}

let q=w.questions[state.qIndex];

document.getElementById("title")=
document.getElementById("title").innerText=
`${w.name} | Boss:${state.bossHp} HP | You:${state.hp}`;

document.getElementById("gameArea").innerHTML=`
<div class="quiz-container">
<div class="question-box">${q.q}</div>
<div class="answer-box" id="ans"></div>
</div>`;

let options=[...q.options].sort(()=>Math.random()-0.5);

let box=document.getElementById("ans");

options.forEach(o=>{
let b=document.createElement("button");
b.className="option-btn";
b.innerText=o;
b.onclick=()=>check(o,q.a);
box.appendChild(b);
});
}

function check(sel,correct){

if(sel===correct){
state.bossHp-=30;
state.xp+=10;
state.coins+=5;
}else{
state.hp-=20;
}

state.qIndex++;
update();
loadQ();
}

function endWorld(){

state.xp+=100;
state.coins+=50;
state.hp=Math.min(100,state.hp+30);

document.getElementById("gameArea").innerHTML=`
<h2>World Complete!</h2>
<button onclick="showStages()">Back</button>`;
}

function update(){
document.getElementById("xp").innerText=state.xp;
document.getElementById("level").innerText=state.level;
document.getElementById("coins").innerText=state.coins;
document.getElementById("hpFill").style.width=state.hp+"%";
}

function buyItem(){alert("Shop coming soon")}
function rps(){alert("RPS working")}

update();
showStages();
