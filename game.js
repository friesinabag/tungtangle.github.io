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

    turn: "player",

    turnNumber: 1,

    aiIndex: 0
};


const locations = [

    {
        name: "Tung Town",
        description:
            "A peaceful town where Tungs begin their journey."
    },

    {
        name: "Mossy Woods",
        description:
            "A forest filled with wild Tungs."
    },

    {
        name: "Tung Mountains",
        description:
            "A harsh place where powerful Tungs train."
    },

    {
        name: "Neon City",
        description:
            "A futuristic city full of competitive Tungs."
    },

    {
        name: "Ancient Ruins",
        description:
            "Ancient ruins containing mysterious items."
    }

];


const aiNames = [

    "Bonk",
    "Bongo",
    "Mango",
    "Noodle",
    "Turbo"

];


function random(min, max) {

    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;

}


/* =========================
   LOG
========================= */

function addLog(message) {

    game.log.unshift(message);

    if (game.log.length > 80) {

        game.log.pop();

    }

    updateUI();

}


/* =========================
   PLAYER STATS
========================= */

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

    p.xpNeeded =
        Math.floor(
            p.xpNeeded * 1.35
        );

    p.maxHp += 15;

    p.hp = p.maxHp;

    p.maxEnergy += 5;

    p.energy = p.maxEnergy;

    p.power += 3;

    p.defence += 2;

    p.speed += 2;

    addLog(
        `⭐ ${p.name} reached Level ${p.level}!`
    );

    checkEvolution();

}


function checkEvolution() {

    const p = game.player;

    if (
        p.level >= 5 &&
        p.species === "Tung"
    ) {

        p.species = "Mega Tung";

        p.maxHp += 30;

        p.hp = p.maxHp;

        p.power += 8;

        p.defence += 5;

        p.speed += 4;

        addLog(
            `✨ ${p.name} evolved into Mega Tung!`
        );

    }


    if (
        p.level >= 10 &&
        p.species === "Mega Tung"
    ) {

        p.species = "Alpha Tung";

        p.maxHp += 50;

        p.hp = p.maxHp;

        p.power += 15;

        p.defence += 10;

        p.speed += 8;

        addLog(
            `👑 ${p.name} became an Alpha Tung!`
        );

    }

}


/* =========================
   ENERGY
========================= */

function spendEnergy(amount) {

    const p = game.player;

    if (p.energy < amount) {

        addLog(
            "⚠️ You don't have enough energy."
        );

        return false;

    }

    p.energy -= amount;

    return true;

}


/* =========================
   TURN SYSTEM
========================= */

function playerAction(action) {

    if (game.turn !== "player") {

        return;

    }


    if (action === "explore") {

        if (playerExplore()) {

            finishPlayerTurn();

        }

    }


    else if (
        action === "power" ||
        action === "defence" ||
        action === "speed"
    ) {

        if (
            playerTrain(action)
        ) {

            finishPlayerTurn();

        }

    }


    else if (action === "rest") {

        playerRest();

        finishPlayerTurn();

    }


    else if (action === "fight") {

        openFight();

    }

}


function finishPlayerTurn() {

    game.turn = "ai";

    game.aiIndex = 0;

    updateUI();

    addLog(
        "🔴 Your turn has ended."
    );

    setTimeout(
        runNextAI,
        700
    );

}


function runNextAI() {

    if (
        game.aiIndex >=
        game.ais.length
    ) {

        finishAITurns();

        return;

    }


    const ai =
        game.ais[game.aiIndex];


    document.getElementById(
        "turn-title"
    ).textContent =
        `${ai.name.toUpperCase()}'S TURN`;


    document.getElementById(
        "turn-description"
    ).textContent =
        "The AI is making its move...";


    aiTakeTurn(ai);


    game.aiIndex++;


    setTimeout(
        runNextAI,
        900
    );

}


function finishAITurns() {

    game.turn = "player";

    game.turnNumber++;

    game.aiIndex = 0;


    addLog(
        `🟢 Your turn! Turn ${game.turnNumber}.`
    );


    updateUI();

}


/* =========================
   PLAYER ACTIONS
========================= */

function playerExplore() {

    if (!spendEnergy(10)) {

        return false;

    }


    const roll =
        random(1, 100);


    if (roll <= 40) {

        const xp =
            random(15, 30);

        gainXP(xp);

        addLog(
            `🌲 You explored and gained ${xp} XP.`
        );

    }


    else if (roll <= 60) {

        game.inventory.berry++;

        addLog(
            "🍓 You found a Berry!"
        );

    }


    else if (roll <= 75) {

        game.inventory.energyDrink++;

        addLog(
            "🥤 You found an Energy Drink!"
        );

    }


    else {

        game.inventory.trainingToken++;

        addLog(
            "🎟️ You found a Training Token!"
        );

    }


    checkEvolution();

    return true;

}


function playerTrain(stat) {

    if (!spendEnergy(15)) {

        return false;

    }


    let increase =
        random(1, 3);


    if (
        game.inventory.trainingToken > 0
    ) {

        increase += 2;

        game.inventory.trainingToken--;

        addLog(
            "🎟️ Training Token boosted your training!"
        );

    }


    game.player[stat] += increase;


    gainXP(10);


    const names = {

        power: "Power",

        defence: "Defence",

        speed: "Speed"

    };


    addLog(
        `💪 ${names[stat]} increased by ${increase}.`
    );


    return true;

}


function playerRest() {

    const p = game.player;


    p.energy =
        Math.min(
            p.maxEnergy,
            p.energy + 35
        );


    p.hp =
        Math.min(
            p.maxHp,
            p.hp + 25
        );


    addLog(
        "💤 You rested and recovered."
    );

}


/* =========================
   AI CREATION
========================= */

function createAI() {

    const level =
        random(1, 5);


    return {

        name:
            aiNames[
                random(
                    0,
                    aiNames.length - 1
                )
            ],

        level,

        hp:
            70 + level * 10,

        maxHp:
            70 + level * 10,

        energy: 80,

        maxEnergy: 80,

        power:
            7 + level * 2,

        defence:
            4 + level,

        speed:
            4 + level,

        wins:
            random(0, 4),

        location:
            locations[
                random(
                    0,
                    locations.length - 1
                )
            ].name,

        action:
            "Waiting"

    };

}


function createAIs() {

    game.ais = [];

    for (
        let i = 0;
        i < 5;
        i++
    ) {

        game.ais.push(
            createAI()
        );

    }

}


/* =========================
   AI TURN
========================= */

function aiTakeTurn(ai) {

    let action;


    if (ai.energy <= 15) {

        ai.energy =
            Math.min(
                ai.maxEnergy,
                ai.energy + 35
            );

        action =
            "💤 Rested";

    }


    else {

        const roll =
            random(1, 100);


        if (roll <= 40) {

            const stats = [
                "power",
                "defence",
                "speed"
            ];


            const stat =
                stats[
                    random(
                        0,
                        stats.length - 1
                    )
                ];


            const increase =
                random(1, 3);


            ai[stat] += increase;

            ai.energy -= 15;


            action =
                `💪 Trained ${stat} +${increase}`;

        }


        else if (roll <= 65) {

            ai.energy -= 10;

            action =
                "🌲 Explored";

        }


        else if (roll <= 85) {

            ai.energy -= 5;


            ai.location =
                locations[
                    random(
                        0,
                        locations.length - 1
                    )
                ].name;


            action =
                `🗺️ Travelled to ${ai.location}`;

        }


        else {

            ai.energy -= 10;

            const won =
                random(1, 100) <= 55;


            if (won) {

                ai.wins++;

                action =
                    "⚔️ Won a battle";

            }

            else {

                action =
                    "⚔️ Lost a battle";

            }

        }

    }


    ai.action = action;


    addLog(
        `🤖 ${ai.name}: ${action}`
    );


    updateUI();

}


/* =========================
   FIGHTING
========================= */

function openFight() {

    if (game.turn !== "player") {

        return;

    }


    let html = "";


    game.ais.forEach(
        (rival, index) => {

            html += `

                <div class="rival">

                    <h3>
                        🐸 ${rival.name}
                    </h3>

                    <p>
                        Level ${rival.level}
                    </p>

                    <p>
                        ❤️ HP: ${rival.hp}
                    </p>

                    <p>
                        💪 Power: ${rival.power}
                    </p>

                    <p>
                        🛡️ Defence: ${rival.defence}
                    </p>

                    <p>
                        ⚡ Speed: ${rival.speed}
                    </p>

                    <p>
                        🏆 Wins: ${rival.wins}
                    </p>

                    <button
                        class="modal-button"
                        onclick="startFight(${index})">

                        ⚔️ Fight

                    </button>

                </div>

            `;

        }
    );


    showModal(
        "⚔️ Choose Opponent",
        html
    );

}


function startFight(index) {

    if (game.turn !== "player") {

        return;

    }


    closeModal();


    if (!spendEnergy(10)) {

        return;

    }


    const p =
        game.player;

    const rival =
        game.ais[index];


    let playerHP =
        p.hp;

    let enemyHP =
        rival.hp;


    let battleLog = [];


    let rounds = 0;


    while (
        playerHP > 0 &&
        enemyHP > 0 &&
        rounds < 30
    ) {

        rounds++;


        if (
            p.speed >=
            rival.speed
        ) {

            const damage =
                Math.max(
                    1,
                    p.power +
                    random(-3, 4) -
                    Math.floor(
                        rival.defence / 2
                    )
                );


            enemyHP -= damage;


            battleLog.push(
                `💥 You dealt ${damage} damage.`
            );


            if (
                enemyHP <= 0
            ) {

                break;

            }


            const enemyDamage =
                Math.max(
                    1,
                    rival.power +
                    random(-3, 4) -
                    Math.floor(
                        p.defence / 2
                    )
                );


            playerHP -= enemyDamage;


            battleLog.push(
                `💢 ${rival.name} dealt ${enemyDamage} damage.`
            );

        }


        else {

            const enemyDamage =
                Math.max(
                    1,
                    rival.power +
                    random(-3, 4) -
                    Math.floor(
                        p.defence / 2
                    )
                );


            playerHP -= enemyDamage;


            battleLog.push(
                `💢 ${rival.name} dealt ${enemyDamage} damage.`
            );


            if (
                playerHP <= 0
            ) {

                break;

            }


            const damage =
                Math.max(
                    1,
                    p.power +
                    random(-3, 4) -
                    Math.floor(
                        rival.defence / 2
                    )
                );


            enemyHP -= damage;


            battleLog.push(
                `💥 You dealt ${damage} damage.`
            );

        }

    }


    if (
        playerHP > 0
    ) {

        p.wins++;

        p.hp =
            Math.max(
                1,
                playerHP
            );


        rival.hp =
            Math.max(
                1,
                enemyHP
            );


        const xp =
            random(25, 45);


        gainXP(xp);


        addLog(
            `🏆 You defeated ${rival.name}! +${xp} XP.`
        );

    }


    else {

        p.hp =
            Math.max(
                1,
                Math.floor(
                    p.maxHp * 0.25
                )
            );


        addLog(
            `❌ ${rival.name} defeated you.`
        );

    }


    checkEvolution();


    updateUI();


    showModal(

        playerHP > 0
            ? "🏆 VICTORY!"
            : "❌ DEFEAT",

        battleLog
            .slice(-12)
            .map(
                line =>
                    `<div class="log-entry">${line}</div>`
            )
            .join("")
        +

        `

            <button
                class="modal-button"
                onclick="
                    closeModal();
                    finishPlayerTurn();
                ">

                Continue

            </button>

        `

    );

}


/* =========================
   INVENTORY
========================= */

function openInventory() {

    if (
        game.turn !== "player"
    ) {

        return;

    }


    showModal(

        "🎒 Inventory",

        `

        <div class="item">

            <div>

                <strong>
                    🍓 Berry
                </strong>

                <p>
                    Restores 25 HP.
                </p>

                <small>
                    Owned:
                    ${game.inventory.berry}
                </small>

            </div>

            <button
                onclick="
                    useItem('berry')
                ">

                Use

            </button>

        </div>


        <div class="item">

            <div>

                <strong>
                    🥤 Energy Drink
                </strong>

                <p>
                    Restores 40 Energy.
                </p>

                <small>
                    Owned:
                    ${game.inventory.energyDrink}
                </small>

            </div>

            <button
                onclick="
                    useItem('energyDrink')
                ">

                Use

            </button>

        </div>


        <div class="item">

            <div>

                <strong>
                    🎟️ Training Token
                </strong>

                <p>
                    Boosts your next training session.
                </p>

                <small>
                    Owned:
                    ${game.inventory.trainingToken}
                </small>

            </div>

        </div>

        `

    );

}


function useItem(item) {

    if (
        game.turn !== "player"
    ) {

        return;

    }


    if (
        game.inventory[item] <= 0
    ) {

        return;

    }


    const p =
        game.player;


    if (
        item === "berry"
    ) {

        game.inventory.berry--;


        const healed =
            Math.min(
                25,
                p.maxHp - p.hp
            );


        p.hp += healed;


        addLog(
            `🍓 Berry restored ${healed} HP.`
        );

    }


    else if (
        item === "energyDrink"
    ) {

        game.inventory.energyDrink--;


        const restored =
            Math.min(
                40,
                p.maxEnergy - p.energy
            );


        p.energy += restored;


        addLog(
            `🥤 Energy Drink restored ${restored} energy.`
        );

    }


    closeModal();

    updateUI();

    finishPlayerTurn();

}


/* =========================
   TRAVEL
========================= */

function openTravel() {

    if (
        game.turn !== "player"
    ) {

        return;

    }


    let html = "";


    locations.forEach(
        location => {

            const current =
                location.name ===
                game.player.location;


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

                        ?

                        "<strong>You're here.</strong>"

                        :

                        `

                        <button
                            class="modal-button"
                            onclick='travel("${location.name}")'>

                            Travel

                        </button>

                        `
                    }

                </div>

            `;

        }
    );


    showModal(
        "🗺️ Travel",
        html
    );

}


function travel(location) {

    if (
        game.turn !== "player"
    ) {

        return;

    }


    if (
        !spendEnergy(5)
    ) {

        return;

    }


    game.player.location =
        location;


    game.player.day++;


    addLog(
        `🗺️ You travelled to ${location}.`
    );


    closeModal();

    updateUI();

    finishPlayerTurn();

}


/* =========================
   LEADERBOARD
========================= */

function scoreFor(tung) {

    return (

        tung.level * 100 +

        tung.wins * 75 +

        tung.power * 5 +

        tung.defence * 5 +

        tung.speed * 5

    );

}


function openLeaderboard() {

    const entries = [];


    game.ais.forEach(
        ai => {

            entries.push({

                name: ai.name,

                species: "Tung",

                level: ai.level,

                wins: ai.wins,

                score:
                    scoreFor(ai)

            });

        }
    );


    entries.push({

        name:
            game.player.name,

        species:
            game.player.species,

        level:
            game.player.level,

        wins:
            game.player.wins,

        score:
            scoreFor(game.player)

    });


    entries.sort(
        (a, b) =>
            b.score - a.score
    );


    let html = "";


    entries.forEach(
        (entry, index) => {

            const medal =

                index === 0
                    ? "🥇"

                    :

                index === 1
                    ? "🥈"

                    :

                index === 2
                    ? "🥉"

                    :

                `${index + 1}.`;


            html += `

                <div class="item">

                    <div>

                        <strong>
                            ${medal}
                            ${entry.name}
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

        }
    );


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


    addLog(
        "💾 Game saved!"
    );

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

    }

    catch {

        addLog(
            "❌ Save file could not be loaded."
        );

    }

}


/* =========================
   UI
========================= */

function updateUI() {

    const p =
        game.player;


    document.getElementById(
        "tung-name"
    ).textContent =
        p.name;


    document.getElementById(
        "species"
    ).textContent =
        p.species;


    document.getElementById(
        "level"
    ).textContent =
        p.level;


    document.getElementById(
        "power"
    ).textContent =
        p.power;


    document.getElementById(
        "defence"
    ).textContent =
        p.defence;


    document.getElementById(
        "speed"
    ).textContent =
        p.speed;


    document.getElementById(
        "wins"
    ).textContent =
        p.wins;


    document.getElementById(
        "day"
    ).textContent =
        p.day;


    document.getElementById(
        "location"
    ).textContent =
        p.location;


    document.getElementById(
        "hp-text"
    ).textContent =
        `${p.hp} / ${p.maxHp}`;


    document.getElementById(
        "energy-text"
    ).textContent =
        `${p.energy} / ${p.maxEnergy}`;


    document.getElementById(
        "xp-text"
    ).textContent =
        `${p.xp} / ${p.xpNeeded}`;


    document.getElementById(
        "hp-bar"
    ).style.width =

        `${Math.max(
            0,
            p.hp / p.maxHp
        ) * 100}%`;


    document.getElementById(
        "energy-bar"
    ).style.width =

        `${Math.max(
            0,
            p.energy / p.maxEnergy
        ) * 100}%`;


    document.getElementById(
        "xp-bar"
    ).style.width =

        `${Math.max(
            0,
            p.xp / p.xpNeeded
        ) * 100}%`;


    /* TURN */

    const panel =
        document.getElementById(
            "turn-panel"
        );


    if (
        game.turn === "player"
    ) {

        panel.className =
            "turn-player";


        document.getElementById(
            "turn-icon"
        ).textContent =
            "🟢";


        document.getElementById(
            "turn-title"
        ).textContent =
            "YOUR TURN";


        document.getElementById(
            "turn-description"
        ).textContent =
            "Choose ONE action.";


    }

    else {

        panel.className =
            "turn-ai";


        document.getElementById(
            "turn-icon"
        ).textContent =
            "🤖";


        document.getElementById(
            "turn-description"
        ).textContent =
            "The AI Tungs are taking their turns.";

    }


    document.getElementById(
        "turn-number"
    ).textContent =
        game.turnNumber;


    /* ACTION BUTTONS */

    const buttons =
        document.querySelectorAll(
            ".action-button"
        );


    buttons.forEach(
        button => {

            button.disabled =
                game.turn !== "player";

        }
    );


    /* AI LIST */

    const aiList =
        document.getElementById(
            "ai-list"
        );


    aiList.innerHTML =
        game.ais
            .map(
                (ai, index) => `

                    <div class="
                        ai
                        ${
                            game.turn === "ai" &&
                            index === game.aiIndex
                                ? "active"
                                : ""
                        }
                    ">

                        <div class="ai-name">
                            🤖 ${ai.name}
                        </div>

                        <div class="ai-stats">

                            Level ${ai.level}<br>

                            💪 ${ai.power}
                            · 🛡️ ${ai.defence}
                            · ⚡ ${ai.speed}<br>

                            🏆 ${ai.wins} wins<br>

                            ⚡ Energy ${ai.energy}

                        </div>

                        <div class="ai-action">

                            ${
                                ai.action ||
                                "Waiting"
                            }

                        </div>

                    </div>

                `
            )
            .join("");


    /* LOG */

    document.getElementById(
        "log"
    ).innerHTML =

        game.log
            .map(
                entry =>
                    `<div class="log-entry">${entry}</div>`
            )
            .join("");

}


/* =========================
   MODAL
========================= */

function showModal(
    title,
    body
) {

    document.getElementById(
        "modal-title"
    ).textContent =
        title;


    document.getElementById(
        "modal-body"
    ).innerHTML =
        body;


    document.getElementById(
        "modal"
    ).classList.remove(
        "hidden"
    );

}


function closeModal() {

    document.getElementById(
        "modal"
    ).classList.add(
        "hidden"
    );

}


/* =========================
   START
========================= */

createAIs();


addLog(
    "🐸 Welcome to Tung Tangle!"
);


addLog(
    "🟢 You get the first turn."
);


addLog(
    "🔄 Every action ends your turn."
);


addLog(
    "🤖 The five AI Tungs will then act."
);


addLog(
    "🏆 Check the leaderboard to see who's winning!"
);


updateUI();
