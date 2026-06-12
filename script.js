
/* =========================
   THEME COLORS
========================= */
:root {
    --bg: #0f141b;
    --card: #1b2430;
    --text: #e6e6e6;
    --muted: #a7b0bd;

    --xp: #4aa3ff;
    --coin: #f1c40f;
    --hp: #2ecc71;

    --danger: #e74c3c;
}

/* =========================
   RESET
========================= */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* =========================
   BODY
========================= */
body {
    font-family: Arial, sans-serif;
    background: var(--bg);
    color: var(--text);
    text-align: center;
    line-height: 1.4;
}

/* =========================
   HEADER
========================= */
header {
    background: #121a24;
    padding: 18px;
    border-bottom: 1px solid #2a3442;
    position: sticky;
    top: 0;
    z-index: 10;
}

/* =========================
   CONTAINER
========================= */
.container {
    max-width: 900px;
    margin: auto;
    padding: 15px;
}

/* =========================
   CARDS
========================= */
.card {
    background: var(--card);
    padding: 16px;
    margin: 12px 0;
    border-radius: 14px;
    box-shadow: 0 4px 14px rgba(0,0,0,0.4);
}

/* =========================
   STAGE GRID
========================= */
.stage-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
    margin-top: 10px;
}

/* stage button */
.stage {
    background: #243042;
    padding: 14px;
    border-radius: 12px;
    cursor: pointer;
    font-weight: bold;
    transition: 0.2s;
}

.stage:hover {
    background: #2e3d52;
    transform: scale(1.05);
}

/* =========================
   QUESTION TEXT
========================= */
.game-box #question {
    font-size: 24px;
    font-weight: bold;
    margin: 20px 0;
}

/* =========================
   MCQ ANSWER BUTTONS
========================= */
.answer-btn {
    display: block;
    width: 100%;
    margin: 8px 0;
    padding: 16px;
    font-size: 18px;
    font-weight: bold;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    background: var(--xp);
    color: white;
    transition: 0.2s;
}

.answer-btn:hover {
    transform: scale(1.03);
    opacity: 0.9;
}

.answer-btn:active {
    transform: scale(0.97);
}

/* =========================
   PROGRESS SYSTEM (XP / COIN / HP)
========================= */
.stats-box {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 10px;
}

.stat {
    font-size: 16px;
    font-weight: bold;
}

/* BAR BACKGROUND */
.bar-bg {
    width: 100%;
    height: 18px;
    background: #2a3442;
    border-radius: 20px;
    overflow: hidden;
    margin-top: 6px;
}

/* XP BAR */
#xpBar {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #4aa3ff, #1e90ff);
    transition: width 0.4s ease;
}

/* COIN BAR */
#coinBar {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #f1c40f, #f39c12);
    transition: width 0.4s ease;
}

/* HP BAR */
#hpBar {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #2ecc71, #27ae60);
    transition: width 0.4s ease;
}

/* =========================
   STAGE PROGRESS BAR
========================= */
.progress {
    width: 100%;
    height: 22px;
    background: #2a3442;
    border-radius: 20px;
    overflow: hidden;
}

#bar {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #2ecc71, #27ae60);
    transition: width 0.4s ease;
}

/* =========================
   BADGES
========================= */
#badges {
    font-weight: bold;
    color: var(--text);
}

/* =========================
   MOBILE RESPONSIVE
========================= */
@media (max-width: 600px) {

    .stage-grid {
        grid-template-columns: 1fr;
    }

    .game-box #question {
        font-size: 20px;
    }

    .answer-btn {
        font-size: 16px;
        padding: 14px;
    }
}
