/* ---------------- SAFE STATE LOAD ---------------- */

function load(key, fallback){
try{
let data = localStorage.getItem(key);
return data ? JSON.parse(data) : fallback;
}catch{
return fallback;
}
}

let stars = load("stars",0);
let xp = load("xp",0);
let level = load("level",1);

let progress = load("progress",{completed:[]});
let badges = load("badges",[]);
let pillars = load("pillars",{
habits:0,
awareness:0,
morals:0
});

/* ---------------- WORLDS ---------------- */

const worlds = [
{
name:"🧠 Habits",
pillar:"habits",
color:"#64748b",
questions:[
["Wake early?","yes"],
["Brush teeth?","yes"],
["Study daily?","yes"],
["Eat junk food?","no"],
["Sleep late?","no"]
]
},
{
name:"🌱 Awareness",
pillar:"awareness",
color:"#16a34a",
questions:[
["Plants give oxygen?","yes"],
["Pollution good?","no"],
["Save water?","yes"],
["Cut trees?","no"],
["Nature matters?","yes"]
]
},
{
name:"❤️ Values",
pillar:"morals",
color:"#dc2626",
questions:[
["Lying good?","no"],
["Help others?","yes"],
["Respect elders?","yes"],
["Stealing ok?","no"],
["Be kind?","yes"]
]
}
];

/* ---------------- STATE ---------------- */

let currentWorld = 0;
let qIndex = 0;

/* ---------------- UI ---------------- */

function updateUI(){
document.getElementById("stars").innerText = stars;
document.getElementById("xp").innerText = xp;
document.getElementById("level").innerText = level;
}

updateUI();

/* ---------------- WORLD MAP ---------------- */

function showWorld(){

document.getElementById("title").innerText="🌍 World Map";

let worldArea = document.getElementById("worldArea");
let gameArea = document.getElementById("gameArea");

worldArea.innerHTML="";
gameArea.innerHTML="";
document.getElementById("result").innerText="";

let html = `<div class="map">`;

worlds.forEach((w,i)=>{

let unlocked = i===0 || progress.completed.includes(i-1);

html += `
<div class="zone ${unlocked?"unlocked":"locked"}"
style="background:${w.color}"
onclick="enterWorld(${i})">
${unlocked ? w.name : "🔒 Locked"}
</div>`;
});

html += `</div>`;

worldArea.innerHTML = html;
}

/* ---------------- ENTER WORLD ---------------- */

function enterWorld(i){

let unlocked = i===0 || progress.completed.includes(i-1);

if(!unlocked){
document.getElementById("result").innerText="🔒 Locked World";
return;
}

currentWorld=i;
qIndex=0;

document.getElementById("worldArea").innerHTML="";
loadQuestion();
}

/* ---------------- QUESTIONS ---------------- */

function loadQuestion(){

let w = worlds[currentWorld];
let q = w.questions[qIndex];

if(!q){

if(!progress.completed.includes(currentWorld)){
progress.completed.push(currentWorld);

stars+=5;
xp+=20;

pillars[w.pillar] = (pillars[w.pillar]||0) + 1;

checkBadges();
}

save();

document.getElementById("gameArea").innerHTML="🎉 World Completed!";
return;
}

document.getElementById("title").innerText = w.name;

document.getElementById("gameArea").innerHTML = `
<p>${q[0]}</p>
<input id="answerInput">
<br><br>
<button onclick="checkAnswer()">Submit</button>
`;
}

/* ---------------- ANSWER CHECK (SAFE) ---------------- */

function checkAnswer(){

let input = document.getElementById("answerInput");
let userAns = (input?.value || "").toLowerCase().trim();

let q = worlds[currentWorld].questions[qIndex];

if(userAns === q[1]){
stars++;
xp+=10;
document.getElementById("result").innerText="✔ Correct!";
}else{
document.getElementById("result").innerText="❌ Wrong!";
}

qIndex++;

levelUp();
save();
loadQuestion();
}

/* ---------------- LEVEL SYSTEM ---------------- */

function levelUp(){

let need = level * 60;

if(xp >= need){
xp -= need;
level++;
document.getElementById("result").innerText="🏆 Level Up!";
}
}

/* ---------------- BADGES ---------------- */

function checkBadges(){

if(pillars.habits>=2 && !badges.includes("Habit Builder")){
badges.push("Habit Builder");
}

if(pillars.awareness>=2 && !badges.includes("Awareness Hero")){
badges.push("Awareness Hero");
}

if(pillars.morals>=2 && !badges.includes("Moral Champion")){
badges.push("Moral Champion");
}
}

/* ---------------- DASHBOARD ---------------- */

function showDashboard(){

document.getElementById("title").innerText="📊 Dashboard";

document.getElementById("worldArea").innerHTML="";
document.getElementById("gameArea").innerHTML="";
document.getElementById("result").innerText="";

document.getElementById("gameArea").innerHTML=`
<p>⭐ Stars: ${stars}</p>
<p>📈 XP: ${xp}</p>
<p>🏆 Level: ${level}</p>
<p>🌍 Completed Worlds: ${progress.completed.length}/${worlds.length}</p>
<p>🏅 Badges: ${badges.join(" | ") || "None"}</p>
`;
}

/* ---------------- SAVE ---------------- */

function save(){

localStorage.setItem("stars",JSON.stringify(stars));
localStorage.setItem("xp",JSON.stringify(xp));
localStorage.setItem("level",JSON.stringify(level));
localStorage.setItem("progress",JSON.stringify(progress));
localStorage.setItem("badges",JSON.stringify(badges));
localStorage.setItem("pillars",JSON.stringify(pillars));

updateUI();
}
