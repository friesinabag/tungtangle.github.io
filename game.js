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

    ais: [],
    log: [],
    turn: 1,
    turnNumber: 1
};

const locations = [
    {
        name: "Tung Town",
        description: "A peaceful town where new Tungs begin."
    },
    {
        name: "Mossy Woods",
        description: "A forest filled with wild Tungs."
    },
    {
        name: "Tung Mountains",
        description: "A harsh area where powerful Tungs train."
    },
    {
        name: "Neon City",
        description: "A futuristic city full of competitive Tungs."
    },
    {
        name: "Ancient Ruins",
        description: "Ancient ruins containing mysterious items."
    }
];

const aiNames = [
    "Bonk",
    "Bongo",
    "Mango",
    "Noodle",
    "Turbo",
    "Wobble",
    "Chunk",
    "Zappy"
];

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addLog(message) {
    game.log.unshift(message);

    if (game.log.length > 60) {
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
        `${Math.max(0, p.hp / p.maxHp) * 100}%`;

    document.getElementById("energy-bar").style.width =
        `${Math.max(0, p.energy / p.maxEnergy) * 100}%`;

    document.getElementById("xp-bar").style.width =
        `${Math.max(0, p.xp / p.xpNeeded) * 100}%`;

    document.getElementById("log").innerHTML =
        game.log
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

    addLog(`⭐ ${p.name} reached Level ${p.level}!`);

    checkEvolution();
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

        addLog(`✨ ${p.name} evolved into Mega Tung!`);
    }

    if (p.level >= 10 && p.species === "Mega Tung") {
        p.species = "Alpha Tung";

        p.maxHp += 50;
        p.hp = p.maxHp;

        p.power += 15;
        p.defence += 10;
        p.speed += 8;

        addLog(`👑 ${p.name} became an Alpha Tung!`);
    }
}

function spendEnergy(amount) {
    const p = game.player;

    if (p.energy < amount) {
        addLog("⚠️ Not enough energy.");
        return false;
    }

    p.energy -= amount;
    return true;
}

/* =========================
   TURN SYSTEM
========================= */

function playerAction(action) {

    if (game.turn !== 1) {
        return;
    }

    let success = false;

    if (action === "explore") {
        success = playerExplore();
    }

    if (action === "power") {
        success = playerTrain("power");
    }

    if (action === "defence") {
        success = playerTrain("defence");
    }

    if (action === "speed") {
        success = playerTrain("speed");
    }

    if (action === "rest") {
        success = playerRest();
    }

    if (action === "fight") {
        openFight();
        return;
    }

    if (action === "inventory") {
        openInventory();
        return;
    }

    if (action === "travel") {
        openTravel();
        return;
    }

    if (success) {
        endPlayerTurn();
    }
}

function endPlayerTurn() {

    game.turn = 2;

    addLog("🔄 Your turn has ended.");

    updateUI();

    setTimeout(() => {
        aiTurns();
    }, 700);
}

function aiTurns() {

    addLog("🤖 AI Tungs are taking their turns...");

    let delay = 700;

    game.ais.forEach((ai, index) => {

        setTimeout(() => {

            aiTakeTurn(ai);

        }, delay);

        delay += 800;
    });

    setTimeout(() => {

        game.turnNumber++;
        game.turn = 1;

        addLog(`🟢 Your turn! Turn ${game.turnNumber}.`);

        updateUI();

    }, delay);
}

/* =========================
   PLAYER ACTIONS
========================= */

function playerExplore() {

    if (!spendEnergy(10)) {
        return false;
    }

    const roll = random(1, 100);

    if (roll <= 35) {

        const xp = random(15, 30);

        gainXP(xp);

        addLog(`🌲 You explored and gained ${xp} XP.`);

    } else if (roll <= 55) {

        game.inventory.berry++;

        addLog("🍓 You found a Berry!");

    } else if (roll <= 70) {

        game.inventory.energyDrink++;

        addLog("🥤 You found an Energy Drink!");

    } else if (roll <= 85) {

        game.inventory.trainingToken++;

        addLog("🎟️ You found a Training Token!");

    } else {

        addLog("👀 You encountered a wild Tung!");

        const rival = createAI();

        setTimeout(() => {
            startFight(rival);
        }, 200);
    }

    checkEvolution();
    updateUI();

    return true;
}

function playerTrain(stat) {

    if (!spendEnergy(15)) {
        return false;
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

    return true;
}

function playerRest() {

    const p = game.player;

    p.energy = Math.min(
        p.maxEnergy,
        p.energy + 35
    );

    p.hp = Math.min(
        p.maxHp,
        p.hp + 25
    );

    addLog("💤 You rested and recovered.");

    return true;
}

/* =========================
   AI SYSTEM
========================= */

function createAI() {

    const level = random(1, 6);

    return {
        name: aiNames[random(0, aiNames.length - 1)],

        level,

        hp: 70 + level * 10,
        maxHp: 70 + level * 10,

        energy: 80,
        maxEnergy: 80,

        power: 7 + level * 2,
        defence: 4 + level,
        speed: 4 + level,

        wins: random(0, 4),

        location: locations[
            random(0, locations.length - 1)
        ].name,

        action: "Waiting"
    };
}

function createAIs() {

    game.ais = [];

    for (let i = 0; i < 5; i++) {

        game.ais.push(createAI());
    }
}

function aiTakeTurn(ai) {

    if (ai.energy <= 15) {

        ai.energy = Math.min(
            ai.maxEnergy,
            ai.energy + 30
        );

        ai.action = "Resting";

        addLog(`💤 ${ai.name} rested and recovered energy.`);

        return;
    }

    const roll = random(1, 100);

    if (roll <= 40) {

        const stats = [
            "power",
            "defence",
            "speed"
        ];

        const stat =
            stats[random(0, stats.length - 1)];

        ai[stat] += random(1, 3);
        ai.energy -= 15;

        ai.action =
            `Training ${stat}`;

        addLog(
            `💪 ${ai.name} trained ${stat}.`
        );

    } else if (roll <= 65) {

        ai.energy -= 10;

        const xp = random(10, 25);

        ai.action = "Exploring";

        addLog(
            `🌲 ${ai.name} explored and gained ${xp} XP.`
        );

    } else if (roll <= 85) {

        ai.energy -= 5;

        ai.location =
            locations[
                random(0, locations.length - 1)
            ].name;

        ai.action = "Travelling";

        addLog(
            `🗺️ ${ai.name} travelled to ${ai.location}.`
        );

    } else {

        ai.energy -= 10;

        ai.action = "Battling";

        addLog(
            `⚔️ ${ai.name} battled another Tung!`
        );

        if (random(1, 100) <= 55) {

            ai.wins++;

            addLog(
                `🏆 ${ai.name} won their battle!`
            );

        } else {

            addLog(
                `❌ ${ai.name} lost their battle.`
            );
        }
    }

    updateUI();
}

/* =========================
   FIGHTS
========================= */

function openFight() {

    let html = "";

    const opponents = [
        ...game.ais,
        createAI(),
        createAI()
    ];

    opponents.forEach((rival, index) => {

        html += `
            <div class="rival">

                <h3>🐸 ${rival.name}</h3>

                <p>Level ${rival.level}</p>
                <p>❤️ HP: ${rival.hp}</p>
                <p>💪 Power: ${rival.power}</p>
                <p>🛡️ Defence: ${rival.defence}</p>
                <p>⚡ Speed: ${rival.speed}</p>
                <p>🏆 Wins: ${rival.wins}</p>

                <button
                    class="modal-button"
                    onclick='startFight(${JSON.stringify(rival)})'>
                    ⚔️ Fight
                </button>

            </div>
        `;
    });

    showModal(
        "⚔️ Choose Opponent",
        html
    );
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

    while (
        playerHP > 0 &&
        enemyHP > 0 &&
        rounds < 30
    ) {

        rounds++;

        if (p.speed >= rival.speed) {

            const damage =
                Math.max(
                    1,
                    p.power +
                    random(-3, 4) -
                    Math.floor(rival.defence / 2)
                );

            enemyHP -= damage;

            battleLog.push(
                `💥 You dealt ${damage} damage.`
            );

            if (enemyHP <= 0) break;

            const enemyDamage =
                Math.max(
                    1,
                    rival.power +
                    random(-3, 4) -
                    Math.floor(p.defence / 2)
                );

            playerHP -= enemyDamage;

            battleLog.push(
                `💢 ${rival.name} dealt ${enemyDamage} damage.`
            );

        } else {

            const enemyDamage =
                Math.max(
                    1,
                    rival.power +
                    random(-3, 4) -
                    Math.floor(p.defence / 2)
                );

            playerHP -= enemyDamage;

            battleLog.push(
                `💢 ${rival.name} dealt ${enemyDamage} damage.`
            );

            if (playerHP <= 0) break;

            const damage =
                Math.max(
                    1,
                    p.power +
                    random(-3, 4) -
                    Math.floor(rival.defence / 2)
                );

            enemyHP -= damage;

            battleLog.push(
                `💥 You dealt ${damage} damage.`
            );
        }
    }

    if (playerHP > 0) {

        const xp = random(25, 45);

        p.wins++;

        p.hp = Math.max(
            1,
            playerHP
        );

        gainXP(xp);

        addLog(
            `🏆 You defeated ${rival.name}! +${xp} XP.`
        );

    } else {

        p.hp = Math.max(
            1,
            Math.floor(p.maxHp * 0.25)
        );

        addLog(
            `❌ ${rival.name} defeated you.`
        );
    }

    checkEvolution();

    updateUI();

    let report = battleLog
        .slice(-12)
        .map(x =>
            `<div class="log-entry">${x}</div>`
        )
        .join("");

    showModal(
        playerHP > 0
            ? "🏆 VICTORY!"
            : "❌ DEFEAT",
        `
            ${report}

            <button
                class="modal-button"
                onclick="closeModal(); endPlayerTurn();">
                Continue
            </button>
        `
    );
}

/* =========================
   INVENTORY
========================= */

function openInventory() {

    const items = game.inventory;

    showModal(
        "🎒 Inventory",
        `
        <div class="item">

            <div>
                <strong>🍓 Berry</strong>

                <p>
                    Restores 25 HP.
                </p>

                <small>
                    Owned: ${items.berry}
                </small>
            </div>

            <button
                onclick="useItem('berry')">
                Use
            </button>

        </div>

        <div class="item">

            <div>
                <strong>🥤 Energy Drink</strong>

                <p>
                    Restores 40 Energy.
                </p>

                <small>
                    Owned: ${items.energyDrink}
                </small>
            </div>

            <button
                onclick="useItem('energyDrink')">
                Use
            </button>

        </div>

        <div class="item">

            <div>
                <strong>🎟️ Training Token</strong>

                <p>
                    Makes training stronger.
                </p>

                <small>
                    Owned: ${items.trainingToken}
                </small>
            </div>

        </div>
        `
    );
}

function useItem(item) {

    if (game.turn !== 1) {
        addLog("⚠️ You can't use items during the AI turn.");
        return;
    }

    const p = game.player;

    if (game.inventory[item] <= 0) {

        addLog(
            "⚠️ You don't have that item."
        );

        return;
    }

    if (item === "berry") {

        game.inventory.berry--;

        const amount =
            Math.min(
                25,
                p.maxHp - p.hp
            );

        p.hp += amount;

        addLog(
            `🍓 Berry restored ${amount} HP.`
        );

    } else if (item === "energyDrink") {

        game.inventory.energyDrink--;

        const amount =
            Math.min(
                40,
                p.maxEnergy - p.energy
            );

        p.energy += amount;

        addLog(
            `🥤 Energy Drink restored ${amount} energy.`
        );
    }

    closeModal();

    updateUI();

    endPlayerTurn();
}

/* =========================
   TRAVEL
========================= */

function openTravel() {

    let html = "";

    locations.forEach(location => {

        const current =
            location.name === game.player.location;

        html += `
            <div class="location">

                <strong>
                    📍 ${location.name}
                </strong>

                <p>
                    ${location.description}
                </p>

                ${
                    current
                        ? "<strong>You're here.</strong>"
                        : `
                        <button
                            onclick='travel("${location.name}")'>
                            Travel
                        </button>
                        `
                }

            </div>
        `;
    });

    showModal(
        "🗺️ Travel",
        html
    );
}

function travel(location) {

    if (game.turn !== 1) {
        return;
    }

    if (!spendEnergy(5)) {
        return;
    }

    game.player.location = location;
    game.player.day++;

    addLog(
        `🗺️ You travelled to ${location}.`
    );

    closeModal();

    updateUI();

    endPlayerTurn();
}

/* =========================
   LEADERBOARD
========================= */

function getScore(tung) {

    return (
        tung.level * 100 +
        tung.wins * 50 +
        tung.power * 5 +
        tung.defence * 5 +
        tung.speed * 5
    );
}

function openLeaderboard() {

    const leaderboard = [
        ...game.ais.map(ai => ({
            name: ai.name,
            species: "Tung",
            level: ai.level,
            wins: ai.wins,
            score: getScore(ai)
        })),

        {
            name: game.player.name,
            species: game.player.species,
            level: game.player.level,
            wins: game.player.wins,
            score: getScore(game.player)
        }
    ];

    leaderboard.sort(
        (a, b) => b.score - a.score
    );

    let html = `
        <div class="leaderboard">
    `;

    leaderboard.forEach((entry, index) => {

        const medal =
            index === 0 ? "🥇" :
            index === 1 ? "🥈" :
            index === 2 ? "🥉" :
            `${index + 1}.`;

        html += `
            <div class="item">

                <div>

                    <strong>
                        ${medal} ${entry.name}
                    </strong>

                    <p>
                        ${entry.species}
                        · Level ${entry.level}
                        · ${entry.wins} wins
                    </p>

                </div>

                <strong>
                    ${entry.score}
                </strong>

            </div>
        `;
    });

    html += `
        </div>
    `;

    showModal(
        "🏆 TUNG LEADERBOARD",
        html
    );
}

/* =========================
   SAVE / LOAD
========================= */

function saveGame() {

    localStorage.setItem(
        "tungTangleSave",
        JSON.stringify(game)
    );

    addLog("💾 Game saved!");
}

function loadGame() {

    const saved =
        localStorage.getItem(
            "tungTangleSave"
        );

    if (!saved) {

        addLog(
            "📂 No saved game found."
        );

        return;
    }

    try {

        const loaded =
            JSON.parse(saved);

        Object.assign(
            game,
            loaded
        );

        addLog(
            "📂 Game loaded!"
        );

        updateUI();

    } catch {

        addLog(
            "❌ Save file couldn't be loaded."
        );
    }
}

/* =========================
   MODALS
========================= */

function showModal(title, body) {

    document.getElementById(
        "modal-title"
    ).textContent = title;

    document.getElementById(
        "modal-body"
    ).innerHTML = body;

    document.getElementById(
        "modal"
    ).classList.remove("hidden");
}

function closeModal() {

    document.getElementById(
        "modal"
    ).classList.add("hidden");
}

/* =========================
   START GAME
========================= */

createAIs();

addLog(
    "🐸 Welcome to Tung Tangle!"
);

addLog(
    "🔄 You act first. The AI Tungs act after you."
);

addLog(
    "🏆 Check the leaderboard to see who's winning!"
);

updateUI();
