/* SAFE INIT (NO CRASHES EVER) */
let stars = Number(localStorage.getItem("stars")) || 0;
let env = Number(localStorage.getItem("env")) || 0;
let xp = Number(localStorage.getItem("xp")) || 0;
let level = Number(localStorage.getItem("level")) || 1;

/* SAFE PROGRESS */
let progress = JSON.parse(localStorage.getItem("progress"));
if (!progress || !Array.isArray(progress.completed)) {
progress = { completed: [] };
}

/* WORLD DATA */
const worlds = [
{ name:"Habits 1", color:"#1f2937",
questions:[
["Wake early?","yes"],
["Brush teeth?","yes"],
["Study daily?","yes"],
["Sleep late?","no"],
["Drink water?","yes"]
]},

{ name:"Awareness", color:"#065f46",
questions:[
["Trees give oxygen?","yes"],
["Pollution good?","no"],
["Save water?","yes"],
["Plastic harmful?","yes"],
["Nature important?","yes"]
]},

{ name:"Values", color:"#7f1d1d",
questions:[
["Lying good?","no"],
["Help others?","yes"],
["Respect elders?","yes"],
["Stealing ok?","no"],
["Be kind?","yes"]
]},

{ name:"Responsibility", color:"#92400e",
questions:[
["Homework?","yes"],
["Break rules?","no"],
["Help family?","yes"],
["Avoid duty?","no"],
["Be responsible?","yes"]
]},

{ name:"Final Test", color:"#4c1d95",
questions:[
["Be honest?","yes"],
["Be responsible?","yes"],
["Care environment?","yes"],
["Respect others?","yes"],
["Good habits matter?","yes"]
]}
];

let currentWorld = 0;
let qIndex = 0;

/* UI SAFE */
function updateUI(){
document.getElementById("stars").innerText = stars;
document.getElementById("env").innerText = env;
document.getElementById("level").innerText = level;
}
updateUI();

/* WORLD MAP */
function showWorldMap(){

document.getElementById("title").innerText = "World Map";

let html = `<div class="map">`;

worlds.forEach((w,i)=>{
let unlocked = i===0 || progress.completed.includes(i-1);

html += `
<div class="zone ${unlocked?'unlocked':'locked'}"
style="background:${w.color}"
onclick="enterWorld(${i})">
${unlocked ? w.name : "Locked"}
</div>`;
});

html += `</div>`;

document.getElementById("worldArea").innerHTML = html;
document.getElementById("gameArea").innerHTML = "";
document.getElementById("result").innerText = "";
}

/* ENTER WORLD */
function enterWorld(i){

let unlocked = i===0 || progress.completed.includes(i-1);

if(!unlocked){
document.getElementById("result").innerText = "Locked World";
return;
}

currentWorld = i;
qIndex = 0;

loadQuestion();
}

/* QUESTION */
function loadQuestion(){

let w = worlds[currentWorld];
let q = w.questions[qIndex];

if(!q){

if(!progress.completed.includes(currentWorld)){
progress.completed.push(currentWorld);
stars += 5;
env += 10;
xp += 20;
checkLevel();
save();
}

document.getElementById("gameArea").innerHTML = "World Completed!";
return;
}

document.getElementById("title").innerText = w.name;

document.getElementById("gameArea").innerHTML = `
<p>${q[0]}</p>
<input id="ans">
<br><br>
<button onclick="check()">Submit</button>
`;
}

/* CHECK */
function check(){

let ans = document.getElementById("ans").value.toLowerCase().trim();
let q = worlds[currentWorld].questions[qIndex];

if(ans === q[1]){
stars++;
xp += 5;
env += 2;
document.getElementById("result").innerText = "Correct!";
}else{
document.getElementById("result").innerText = "Wrong!";
}

qIndex++;
checkLevel();
save();
loadQuestion();
}

/* LEVEL */
function checkLevel(){
let need = level * 50;

if(xp >= need){
xp -= need;
level++;
}
}

/* SAVE */
function save(){
localStorage.setItem("stars",stars);
localStorage.setItem("env",env);
localStorage.setItem("xp",xp);
localStorage.setItem("level",level);
localStorage.setItem("progress",JSON.stringify(progress));
}
