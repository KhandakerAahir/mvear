/* STATE */
let stars = +localStorage.getItem("stars") || 0;
let xp = +localStorage.getItem("xp") || 0;
let level = +localStorage.getItem("level") || 1;

let progress = JSON.parse(localStorage.getItem("progress"));
if(!progress || !Array.isArray(progress.completed)){
progress = { completed: [] };
}

let currentWorld = 0;
let qIndex = 0;

/* WORLDS */
const worlds = [
{ name:"🌱 Habits", color:"#1f2937",
questions:gen([
"Wake early?","Brush teeth?","Study daily?","Sleep late?","Drink water?",
"Exercise?","Be disciplined?","Avoid laziness?","Keep clean?","Follow routine?"
])},

{ name:"🌍 Awareness", color:"#065f46",
questions:gen([
"Trees give oxygen?","Pollution good?","Save water?","Plastic harmful?","Nature important?",
"Recycle?","Protect animals?","Keep clean?","Waste water?","Cut trees?"
])},

{ name:"❤️ Values", color:"#7f1d1d",
questions:gen([
"Be honest?","Help others?","Respect elders?","Steal ok?","Be kind?",
"Forgive?","Lie good?","Respect teachers?","Cheat ok?","Spread kindness?"
])},

{ name:"🧭 Responsibility", color:"#92400e",
questions:gen([
"Do homework?","Break rules?","Help family?","Avoid duties?","Be responsible?",
"Complete tasks?","Ignore work?","Care others?","Follow rules?","Be accountable?"
])},

{ name:"🏃 Health", color:"#0ea5e9",
questions:gen([
"Exercise?","Drink water?","Eat junk food?","Sleep well?","Stay active?",
"Eat fruits?","Be lazy?","Maintain hygiene?","Stay fit?","Skip meals?"
])},

{ name:"🚦 Safety", color:"#f97316",
questions:gen([
"Cross safely?","Play road?","Follow rules?","Use phone walking?","Stay alert?",
"Obey signals?","Be careless?","Stay safe?","Ignore danger?","Be careful?"
])},

{ name:"💻 Digital", color:"#a855f7",
questions:gen([
"Share password?","Safe internet?","Trust strangers?","Protect privacy?","Click unknown links?",
"Strong password?","Be secure?","Download unknown apps?","Respect privacy?","Stay safe online?"
])},

{ name:"🏆 Final", color:"#4c1d95",
questions:gen([
"Be honest?","Be responsible?","Care environment?","Respect others?","Good habits matter?",
"Stay disciplined?","Help others?","Follow values?","Stay safe?","Learn daily?"
])}
];

/* HELP */
function gen(list){
return list.map(q=>[q,"yes"]);
}

/* UI */
function updateUI(){
document.getElementById("stars").innerText = stars;
document.getElementById("xp").innerText = xp;
document.getElementById("level").innerText = level;
}
updateUI();

/* MAP */
function showWorldMap(){

document.getElementById("title").innerText="World Map";

let html = `<div class="map">`;

worlds.forEach((w,i)=>{

let unlocked = i===0 || progress.completed.includes(i-1);
let percent = Math.min(100, progress.completed.includes(i) ? 100 : 0);

html += `
<div class="zone ${unlocked?'':'locked'}"
style="background:${w.color}"
onclick="enterWorld(${i})">

${w.name}

<div class="progress">
<div class="fill" style="width:${percent}%"></div>
</div>

</div>`;
});

html += `</div>`;

document.getElementById("worldArea").innerHTML = html;
document.getElementById("gameArea").innerHTML = "";
}

/* ENTER */
function enterWorld(i){

let unlocked = i===0 || progress.completed.includes(i-1);
if(!unlocked){
document.getElementById("result").innerText="Locked";
return;
}

currentWorld = i;
qIndex = 0;
loadQ();
}

/* QUESTIONS */
function loadQ(){

let w = worlds[currentWorld];
let q = w.questions[qIndex];

if(!q){

if(!progress.completed.includes(currentWorld)){
progress.completed.push(currentWorld);
stars += 5;
xp += 20;
checkLevel();
checkCertificate();
save();
}

document.getElementById("gameArea").innerHTML="World Completed!";
return;
}

document.getElementById("title").innerText = w.name;

document.getElementById("gameArea").innerHTML=`
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
document.getElementById("result").innerText="Correct!";
}else{
document.getElementById("result").innerText="Wrong!";
}

qIndex++;
checkLevel();
save();
loadQ();
}

/* LEVEL */
function checkLevel(){

let need = level*50;

if(xp>=need){
xp-=need;
level++;
levelUpAnim();
}
}

/* LEVEL ANIMATION */
function levelUpAnim(){
document.body.style.background="#1a2e1a";
setTimeout(()=>document.body.style.background="#0b1220",500);
}

/* CERTIFICATE */
function checkCertificate(){
if(progress.completed.length === worlds.length){
document.getElementById("result").innerHTML=
"🏆 CERTIFIED MVEAR LEARNER!";
}
}

/* SAVE */
function save(){
localStorage.setItem("stars",stars);
localStorage.setItem("xp",xp);
localStorage.setItem("level",level);
localStorage.setItem("progress",JSON.stringify(progress));
updateUI();
}

/* PATTERN GAME */
const patterns=["ABAB","AABB","ABBA","BAAB","AAAA"];

function showPatterns(){

document.getElementById("title").innerText="Pattern Game";

let html="";

patterns.forEach(p=>{
html+=`<div class="card" onclick="checkPattern('${p}')">${p}</div>`;
});

document.getElementById("worldArea").innerHTML=html;
document.getElementById("gameArea").innerHTML="";
}

/* pattern check */
function checkPattern(p){
document.getElementById("result").innerText="Pattern: "+p;
}
