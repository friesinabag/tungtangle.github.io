<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tung Tangle</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>

    <div id="game">

        <header>
            <div>
                <h1>🐸 TUNG TANGLE</h1>
                <p class="subtitle">Become the ultimate Alpha Tung</p>
            </div>

            <div class="header-buttons">
                <button onclick="saveGame()">💾 Save</button>
                <button onclick="loadGame()">📂 Load</button>
            </div>
        </header>

        <main>

            <section id="player-card" class="card">
                <div class="player-title">
                    <div>
                        <h2 id="tung-name">Chomper</h2>
                        <p id="species">Tung</p>
                    </div>

                    <div class="level">
                        LEVEL <span id="level">1</span>
                    </div>
                </div>

                <div class="bars">

                    <div class="bar-container">
                        <span>❤️ HP</span>
                        <div class="bar">
                            <div id="hp-bar" class="bar-fill hp"></div>
                        </div>
                        <span id="hp-text">100 / 100</span>
                    </div>

                    <div class="bar-container">
                        <span>⚡ Energy</span>
                        <div class="bar">
                            <div id="energy-bar" class="bar-fill energy"></div>
                        </div>
                        <span id="energy-text">100 / 100</span>
                    </div>

                    <div class="bar-container">
                        <span>⭐ XP</span>
                        <div class="bar">
                            <div id="xp-bar" class="bar-fill xp"></div>
                        </div>
                        <span id="xp-text">0 / 100</span>
                    </div>

                </div>

                <div class="stats">
                    <div>💪 Power <strong id="power">10</strong></div>
                    <div>🛡️ Defence <strong id="defence">5</strong></div>
                    <div>⚡ Speed <strong id="speed">5</strong></div>
                    <div>🏆 Wins <strong id="wins">0</strong></div>
                    <div>📅 Day <strong id="day">1</strong></div>
                    <div>📍 <strong id="location">Tung Town</strong></div>
                </div>
            </section>

            <section class="actions">

                <button class="action-button" onclick="explore()">
                    🌲
                    <strong>Explore</strong>
                    <small>Find items & encounters</small>
                </button>

                <button class="action-button" onclick="train('power')">
                    💪
                    <strong>Train Power</strong>
                    <small>Increase attack strength</small>
                </button>

                <button class="action-button" onclick="train('defence')">
                    🛡️
                    <strong>Train Defence</strong>
                    <small>Become harder to defeat</small>
                </button>

                <button class="action-button" onclick="train('speed')">
                    ⚡
                    <strong>Train Speed</strong>
                    <small>Improve your speed</small>
                </button>

                <button class="action-button" onclick="rest()">
                    💤
                    <strong>Rest</strong>
                    <small>Restore energy & HP</small>
                </button>

                <button class="action-button" onclick="openFight()">
                    ⚔️
                    <strong>Fight</strong>
                    <small>Battle a rival Tung</small>
                </button>

                <button class="action-button" onclick="openInventory()">
                    🎒
                    <strong>Inventory</strong>
                    <small>Use your items</small>
                </button>

                <button class="action-button" onclick="openTravel()">
                    🗺️
                    <strong>Travel</strong>
                    <small>Visit different areas</small>
                </button>

            </section>

            <section class="card log-card">
                <h2>📜 Adventure Log</h2>
                <div id="log"></div>
            </section>

        </main>

    </div>

    <div id="modal" class="modal hidden">
        <div class="modal-content">

            <button class="close" onclick="closeModal()">✕</button>

            <h2 id="modal-title"></h2>

            <div id="modal-body"></div>

        </div>
    </div>

    <script src="game.js"></script>

</body>
</html>
* {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;
    font-family: Arial, Helvetica, sans-serif;
    background:
        radial-gradient(circle at top, #29345f, #101322 65%);
    color: white;
}

button {
    font-family: inherit;
    cursor: pointer;
}

#game {
    width: min(1100px, 94%);
    margin: auto;
    padding-bottom: 40px;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 28px 0;
    gap: 20px;
}

h1 {
    margin: 0;
    font-size: 38px;
    letter-spacing: 2px;
}

.subtitle {
    margin: 5px 0 0;
    color: #aeb8d9;
}

.header-buttons {
    display: flex;
    gap: 10px;
}

.header-buttons button {
    border: 0;
    padding: 11px 16px;
    border-radius: 10px;
    background: #252d4b;
    color: white;
    font-weight: bold;
}

.header-buttons button:hover {
    background: #364064;
}

.card {
    background: rgba(24, 29, 50, 0.95);
    border: 1px solid #394261;
    border-radius: 18px;
    padding: 22px;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
}

.player-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.player-title h2 {
    margin: 0;
    font-size: 28px;
}

.player-title p {
    margin: 4px 0 0;
    color: #9ea9cc;
}

.level {
    background: #303b69;
    border-radius: 12px;
    padding: 12px 16px;
    font-weight: bold;
}

.level span {
    font-size: 24px;
}

.bars {
    margin-top: 22px;
    display: grid;
    gap: 12px;
}

.bar-container {
    display: grid;
    grid-template-columns: 90px 1fr 90px;
    align-items: center;
    gap: 10px;
    font-size: 14px;
}

.bar {
    height: 14px;
    background: #101321;
    border-radius: 20px;
    overflow: hidden;
}

.bar-fill {
    height: 100%;
    width: 0%;
    transition: width 0.3s ease;
}

.hp {
    background: #e05252;
}

.energy {
    background: #d8a83e;
}

.xp {
    background: #6d72df;
}

.stats {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
    margin-top: 22px;
}

.stats div {
    background: #202640;
    padding: 12px;
    border-radius: 10px;
    text-align: center;
    color: #aeb8d9;
}

.stats strong {
    display: block;
    color: white;
    font-size: 18px;
    margin-top: 4px;
}

.actions {
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
}

.action-button {
    min-height: 120px;
    border: 1px solid #394261;
    border-radius: 15px;
    background: #1b2139;
    color: white;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 7px;
    transition: transform 0.15s, background 0.15s;
}

.action-button:hover {
    transform: translateY(-3px);
    background: #272f4e;
}

.action-button:first-letter {
    font-size: 28px;
}

.action-button strong {
    font-size: 16px;
}

.action-button small {
    color: #919bbd;
}

.log-card {
    margin-top: 20px;
}

.log-card h2 {
    margin-top: 0;
}

#log {
    max-height: 230px;
    overflow-y: auto;
}

.log-entry {
    padding: 9px 0;
    border-bottom: 1px solid #303750;
    color: #c3cae1;
}

.modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 100;
}

.hidden {
    display: none;
}

.modal-content {
    width: min(600px, 100%);
    max-height: 85vh;
    overflow-y: auto;
    background: #181d32;
    border: 1px solid #414b70;
    border-radius: 18px;
    padding: 28px;
    position: relative;
    box-shadow: 0 20px 70px rgba(0, 0, 0, 0.5);
}

.close {
    position: absolute;
    top: 12px;
    right: 14px;
    border: 0;
    background: transparent;
    color: #aeb8d9;
    font-size: 22px;
}

.modal-content h2 {
    margin-top: 0;
}

.modal-button {
    width: 100%;
    margin-top: 10px;
    padding: 13px;
    border: 0;
    border-radius: 10px;
    background: #303b69;
    color: white;
    font-weight: bold;
}

.modal-button:hover {
    background: #414e87;
}

.rival {
    background: #202640;
    border-radius: 13px;
    padding: 15px;
    margin: 10px 0;
}

.rival h3 {
    margin: 0 0 5px;
}

.rival p {
    margin: 4px 0;
    color: #aeb8d9;
}

.item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #202640;
    border-radius: 12px;
    padding: 14px;
    margin: 10px 0;
}

.item button {
    border: 0;
    background: #3a477d;
    color: white;
    padding: 8px 12px;
    border-radius: 8px;
    font-weight: bold;
}

.location {
    background: #202640;
    border-radius: 12px;
    padding: 15px;
    margin: 10px 0;
}

.location button {
    width: 100%;
    padding: 10px;
    margin-top: 8px;
    border: 0;
    border-radius: 8px;
    background: #3a477d;
    color: white;
    font-weight: bold;
}

.win {
    text-align: center;
    font-size: 22px;
    padding: 20px;
}

@media (max-width: 800px) {

    h1 {
        font-size: 28px;
    }

    header {
        flex-direction: column;
        align-items: flex-start;
    }

    .stats {
        grid-template-columns: repeat(3, 1fr);
    }

    .actions {
        grid-template-columns: repeat(2, 1fr);
    }

}

@media (max-width: 500px) {

    .bar-container {
        grid-template-columns: 70px 1fr;
    }

    .bar-container > span:last-child {
        grid-column: 2;
    }

    .stats {
        grid-template-columns: repeat(2, 1fr);
    }

    .actions {
        grid-template-columns: 1fr;
    }

}
const game = {
    player: {
        name: "Chomper",
        species: "Tung",
        level: 1,
        xp: 0,
        xpNeeded: 100,

        hp: 100,
        maxHp: 100,

        energy: 100,
        maxEnergy: 100,

        power: 10,
        defence: 5,
        speed: 5,

        wins: 0,
        day: 1,
        location: "Tung Town"
    },

    inventory: {
        berry: 2,
        energyDrink: 1,
        trainingToken: 0
    },

    rivals: [],

    log: []
};

const locations = [
    {
        name: "Tung Town",
        description: "A peaceful town where new Tungs begin their journey."
    },
    {
        name: "Mossy Woods",
        description: "A mysterious forest filled with wild Tungs."
    },
    {
        name: "Tung Mountains",
        description: "A dangerous mountain region where powerful Tungs train."
    },
    {
        name: "Neon City",
        description: "A futuristic city packed with competitive Tungs."
    },
    {
        name: "Ancient Ruins",
        description: "Old ruins said to contain extremely rare items."
    }
];

const rivalNames = [
    "Grumpy",
    "Bongo",
    "Mango",
    "Bonk",
    "Noodle",
    "Turbo",
    "Wobble",
    "Chunk",
    "Zappy",
    "Munch"
];

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addLog(message) {
    game.log.unshift(message);

    if (game.log.length > 40) {
        game.log.pop();
    }

    updateUI();
}

function updateUI() {
    const p = game.player;

    document.getElementById("tung-name").textContent = p.name;
    document.getElementById("species").textContent = p.species;

    document.getElementById("level").textContent = p.level;

    document.getElementById("power").textContent = p.power;
    document.getElementById("defence").textContent = p.defence;
    document.getElementById("speed").textContent = p.speed;

    document.getElementById("wins").textContent = p.wins;
    document.getElementById("day").textContent = p.day;
    document.getElementById("location").textContent = p.location;

    document.getElementById("hp-text").textContent =
        `${p.hp} / ${p.maxHp}`;

    document.getElementById("energy-text").textContent =
        `${p.energy} / ${p.maxEnergy}`;

    document.getElementById("xp-text").textContent =
        `${p.xp} / ${p.xpNeeded}`;

    document.getElementById("hp-bar").style.width =
        `${(p.hp / p.maxHp) * 100}%`;

    document.getElementById("energy-bar").style.width =
        `${(p.energy / p.maxEnergy) * 100}%`;

    document.getElementById("xp-bar").style.width =
        `${(p.xp / p.xpNeeded) * 100}%`;

    const log = document.getElementById("log");

    log.innerHTML = game.log
        .map(entry => `<div class="log-entry">${entry}</div>`)
        .join("");
}

function gainXP(amount) {
    const p = game.player;

    p.xp += amount;

    while (p.xp >= p.xpNeeded) {
        p.xp -= p.xpNeeded;
        levelUp();
    }
}

function levelUp() {
    const p = game.player;

    p.level++;

    p.xpNeeded = Math.floor(p.xpNeeded * 1.35);

    p.maxHp += 15;
    p.hp = p.maxHp;

    p.maxEnergy += 5;
    p.energy = p.maxEnergy;

    p.power += 3;
    p.defence += 2;
    p.speed += 2;

    addLog(`⭐ ${p.name} reached level ${p.level}!`);
}

function checkEvolution() {
    const p = game.player;

    if (p.level >= 5 && p.species === "Tung") {
        p.species = "Mega Tung";

        p.maxHp += 30;
        p.hp = p.maxHp;

        p.power += 8;
        p.defence += 5;
        p.speed += 4;

        addLog(`✨ EVOLUTION! ${p.name} evolved into Mega Tung!`);
    }

    if (p.level >= 10 && p.species === "Mega Tung") {
        p.species = "Alpha Tung";

        p.maxHp += 50;
        p.hp = p.maxHp;

        p.power += 15;
        p.defence += 10;
        p.speed += 8;

        addLog(`👑 FINAL EVOLUTION! ${p.name} became an Alpha Tung!`);
    }
}

function spendEnergy(amount) {
    const p = game.player;

    if (p.energy < amount) {
        addLog("⚠️ You don't have enough energy.");
        return false;
    }

    p.energy -= amount;
    return true;
}

function explore() {
    if (!spendEnergy(10)) {
        return;
    }

    const roll = random(1, 100);

    if (roll <= 35) {
        const xp = random(15, 30);

        gainXP(xp);

        addLog(`🌲 You explored the area and gained ${xp} XP.`);
    }

    else if (roll <= 55) {
        game.inventory.berry++;

        addLog("🍓 You found a Berry!");
    }

    else if (roll <= 70) {
        game.inventory.energyDrink++;

        addLog("🥤 You found an Energy Drink!");
    }

    else if (roll <= 85) {
        game.inventory.trainingToken++;

        addLog("🎟️ You found a Training Token!");
    }

    else {
        const rival = createRival();

        addLog(`👀 A wild Tung named ${rival.name} appeared!`);

        setTimeout(() => {
            openFight(rival);
        }, 100);
    }

    checkEvolution();
    updateUI();
}

function train(stat) {
    if (!spendEnergy(15)) {
        return;
    }

    const p = game.player;

    let increase = random(1, 3);

    if (game.inventory.trainingToken > 0) {
        increase += 2;
        game.inventory.trainingToken--;

        addLog("🎟️ Training Token boosted your training!");
    }

    p[stat] += increase;

    gainXP(10);

    const names = {
        power: "Power",
        defence: "Defence",
        speed: "Speed"
    };

    addLog(`💪 ${names[stat]} increased by ${increase}.`);

    checkEvolution();
    updateUI();
}

function rest() {
    const p = game.player;

    p.energy = Math.min(p.maxEnergy, p.energy + 35);
    p.hp = Math.min(p.maxHp, p.hp + 25);

    addLog("💤 You rested and recovered.");

    updateUI();
}

function createRival() {
    const p = game.player;

    const difficulty = Math.max(0, p.level - 1);

    return {
        name: rivalNames[random(0, rivalNames.length - 1)],
        level: Math.max(1, p.level + random(-1, 2)),
        power: random(8, 13) + difficulty * 2,
        defence: random(3, 8) + difficulty,
        speed: random(3, 8) + difficulty,
        hp: random(60, 100) + difficulty * 12
    };
}

function createRivals() {
    game.rivals = [];

    for (let i = 0; i < 5; i++) {
        game.rivals.push(createRival());
    }
}

function openFight(specificRival = null) {
    const rivals = specificRival
        ? [specificRival]
        : [createRival(), createRival(), createRival()];

    let html = "";

    rivals.forEach((rival, index) => {

        html += `
            <div class="rival">
                <h3>🐸 ${rival.name}</h3>

                <p>Level ${rival.level}</p>
                <p>❤️ HP: ${rival.hp}</p>
                <p>💪 Power: ${rival.power}</p>
                <p>🛡️ Defence: ${rival.defence}</p>
                <p>⚡ Speed: ${rival.speed}</p>

                <button
                    class="modal-button"
                    onclick='startFight(${JSON.stringify(rival)})'>
                    ⚔️ Fight
                </button>
            </div>
        `;
    });

    showModal("⚔️ Choose Your Opponent", html);
}

function startFight(rival) {
    closeModal();

    if (!spendEnergy(10)) {
        return;
    }

    const p = game.player;

    let playerHP = p.hp;
    let enemyHP = rival.hp;

    let rounds = 0;
    let battleLog = [];

    while (playerHP > 0 && enemyHP > 0 && rounds < 30) {
        rounds++;

        const playerFirst =
            p.speed >= rival.speed
                ? true
                : Math.random() < 0.5;

        if (playerFirst) {
            const damage =
                Math.max(1, p.power + random(-3, 4) - Math.floor(rival.defence / 2));

            enemyHP -= damage;

            battleLog.push(`💥 You dealt ${damage} damage.`);

            if (enemyHP <= 0) {
                break;
            }

            const enemyDamage =
                Math.max(1, rival.power + random(-3, 4) - Math.floor(p.defence / 2));

            playerHP -= enemyDamage;

            battleLog.push(`💢 ${rival.name} dealt ${enemyDamage} damage.`);
        }

        else {
            const enemyDamage =
                Math.max(1, rival.power + random(-3, 4) - Math.floor(p.defence / 2));

            playerHP -= enemyDamage;

            battleLog.push(`💢 ${rival.name} dealt ${enemyDamage} damage.`);

            if (playerHP <= 0) {
                break;
            }

            const damage =
                Math.max(1, p.power + random(-3, 4) - Math.floor(rival.defence / 2));

            enemyHP -= damage;

            battleLog.push(`💥 You dealt ${damage} damage.`);
        }
    }

    if (playerHP > 0) {
        const xp = random(25, 45);

        p.wins++;
        p.hp = Math.max(1, playerHP);

        gainXP(xp);

        addLog(
            `🏆 Victory against ${rival.name}! +${xp} XP.`
        );

        checkEvolution();

        if (p.wins >= 5 && p.level >= 10) {
            showVictory();
        }

    } else {
        p.hp = Math.max(1, Math.floor(p.maxHp * 0.25));

        addLog(`❌ ${rival.name} defeated you. You barely escaped.`);
    }

    updateUI();

    setTimeout(() => {
        showBattleReport(rival, battleLog, playerHP > 0);
    }, 100);
}

function showBattleReport(rival, battleLog, won) {
    const result = won
        ? "🏆 VICTORY!"
        : "❌ DEFEAT";

    let html = `
        <div class="win">
            <h2>${result}</h2>
            <p>Battle against <strong>${rival.name}</strong></p>
        </div>
    `;

    html += battleLog
        .slice(-10)
        .map(line => `<div class="log-entry">${line}</div>`)
        .join("");

    html += `
        <button class="modal-button" onclick="closeModal()">
            Continue
        </button>
    `;

    showModal(result, html);
}

function openInventory() {
    const items = game.inventory;

    let html = `
        <div class="item">
            <div>
                <strong>🍓 Berry</strong>
                <p>Restores 25 HP.</p>
                <small>Owned: ${items.berry}</small>
            </div>

            <button onclick="useItem('berry')">Use</button>
        </div>

        <div class="item">
            <div>
                <strong>🥤 Energy Drink</strong>
                <p>Restores 40 Energy.</p>
                <small>Owned: ${items.energyDrink}</small>
            </div>

            <button onclick="useItem('energyDrink')">Use</button>
        </div>

        <div class="item">
            <div>
                <strong>🎟️ Training Token</strong>
                <p>Boosts your next training session.</p>
                <small>Owned: ${items.trainingToken}</small>
            </div>
        </div>
    `;

    showModal("🎒 Inventory", html);
}

function useItem(item) {
    const p = game.player;

    if (game.inventory[item] <= 0) {
        addLog("⚠️ You don't have that item.");
        return;
    }

    if (item === "berry") {
        game.inventory.berry--;

        const healed = Math.min(25, p.maxHp - p.hp);

        p.hp += healed;

        addLog(`🍓 You ate a Berry and recovered ${healed} HP.`);
    }

    else if (item === "energyDrink") {
        game.inventory.energyDrink--;

        const restored =
            Math.min(40, p.maxEnergy - p.energy);

        p.energy += restored;

        addLog(`🥤 Energy Drink restored ${restored} energy.`);
    }

    closeModal();
    updateUI();
}

function openTravel() {
    let html = "";

    locations.forEach(location => {

        const current =
            location.name === game.player.location;

        html += `
            <div class="location">
                <strong>📍 ${location.name}</strong>
                <p>${location.description}</p>

                ${
                    current
                        ? "<strong>You're here.</strong>"
                        : `<button onclick='travel("${location.name}")'>
                            Travel here
                           </button>`
                }
            </div>
        `;
    });

    showModal("🗺️ Travel", html);
}

function travel(location) {
    if (!spendEnergy(5)) {
        return;
    }

    game.player.location = location;
    game.player.day++;

    addLog(`🗺️ You travelled to ${location}.`);
    addLog(`📅 Day ${game.player.day} begins.`);

    closeModal();
    updateUI();
}

function showVictory() {
    const score =
        game.player.power +
        game.player.wins * 25 +
        game.player.day * 5 +
        game.player.level * 50;

    showModal(
        "👑 ALPHA TUNG!",
        `
            <div class="win">
                <h2>You did it!</h2>

                <p>
                    ${game.player.name} has become the
                    ultimate Alpha Tung.
                </p>

                <h2>🏆 Score: ${score}</h2>

                <button class="modal-button"
                    onclick="closeModal()">
                    Continue
                </button>
            </div>
        `
    );
}

function showModal(title, body) {
    document.getElementById("modal-title").textContent = title;
    document.getElementById("modal-body").innerHTML = body;

    document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("modal").classList.add("hidden");
}

function saveGame() {
    localStorage.setItem(
        "tungTangleSave",
        JSON.stringify(game)
    );

    addLog("💾 Game saved!");
}

function loadGame() {
    const saved = localStorage.getItem("tungTangleSave");

    if (!saved) {
        addLog("📂 No saved game found.");
        return;
    }

    try {
        const loaded = JSON.parse(saved);

        Object.assign(game, loaded);

        addLog("📂 Game loaded!");

        updateUI();

    } catch {
        addLog("❌ The save file could not be loaded.");
    }
}

function newGame() {
    localStorage.removeItem("tungTangleSave");

    location.reload();
}

createRivals();

addLog("🐸 Welcome to Tung Tangle!");
addLog("🌟 Your journey to become an Alpha Tung begins.");

updateUI();
