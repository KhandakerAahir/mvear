
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
},
{
name:"🌋 Volcano",
bossHp:160,
questions:[
{q:"7+8?",options:["14","15","16","17"],a:"15"},
{q:"12-5?",options:["6","7","8","5"],a:"7"},
{q:"3×4?",options:["11","12","13","10"],a:"12"}
]
},
{
name:"🌊 Ocean",
bossHp:180,
questions:[
{q:"20/4?",options:["4","5","6","3"],a:"5"},
{q:"9+9?",options:["16","17","18","19"],a:"18"},
{q:"5×2?",options:["8","9","10","11"],a:"10"}
]
},
{
name:"🏙️ City",
bossHp:200,
questions:[
{q:"15+10?",options:["20","25","30","35"],a:"25"},
{q:"18-9?",options:["8","9","10","7"],a:"9"},
{q:"6×3?",options:["15","16","18","20"],a:"18"}
]
},
{
name:"🪐 Space",
bossHp:250,
questions:[
{q:"50/5?",options:["8","9","10","11"],a:"10"},
{q:"12+12?",options:["22","23","24","25"],a:"24"},
{q:"7×7?",options:["47","48","49","50"],a:"49"}
]
}
];

function showStages(){

document.getElementById("title").innerText="Select World";

let html="<div class='stage-menu'>";

worlds.forEach((w,i)=>{
html+=`<button onclick="startWorld(${i})">${w.name}</button>`;
});

html+="</div>";

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

document.getElementById("title").innerText=
`${w.name} | Boss HP: ${state.bossHp} | HP: ${state.hp}`;

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
<h2>World Completed!</h2>
<button onclick="showStages()">Back</button>`;

update();

}

function update(){

document.getElementById("xp").innerText=state.xp;
document.getElementById("level").innerText=state.level;
document.getElementById("coins").innerText=state.coins;
document.getElementById("hpFill").style.width=state.hp+"%";

}

function buyItem(type){

if(type==="life" && state.coins>=30){
state.coins-=30;
state.hp=Math.min(100,state.hp+30);
}

if(type==="skip" && state.coins>=20){
state.coins-=20;
state.qIndex++;
loadQ();
}

if(type==="hint" && state.coins>=15){
state.coins-=15;
alert("Think carefully!");
}

update();

}

function rps(user){

let arr=["rock","paper","scissors"];
let ai=arr[Math.floor(Math.random()*3)];

if(user===ai){
alert("Draw!");
}
else if(
(user==="rock"&&ai==="scissors")||
(user==="paper"&&ai==="rock")||
(user==="scissors"&&ai==="paper")
){
alert("You Win!");
state.coins+=10;
}else{
alert("You Lose!");
state.hp-=10;
}

update();

}

update();
showStages();
