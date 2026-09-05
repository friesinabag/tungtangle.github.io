// ============================================================
// TUNG TANGLE
// ============================================================


// ============================================================
// AI NAME POOL
// ============================================================

const AI_NAMES = [

    "Rocky",
    "Dave",
    "Zip",
    "Chomper",
    "Sigil",
    "Obama",
    "Messi",
    "Ronaldo",
    "Cookie",
    "Bubble",
    "Zap",
    "Mortis",
    "E"

];


// ============================================================
// EVERYONE STARTS WITH THE SAME BASE STATS
// ============================================================

const BASE_STATS = {

    level: 1,

    hp: 100,
    maxHp: 100,

    energy: 100,
    maxEnergy: 100,

    xp: 0,
    xpNeeded: 100,

    power: 10,
    defence: 5,
    speed: 5,

    wins: 0,

    location: "Tung Town"

};


// ============================================================
// GAME
// ============================================================

const game = {

    player: {

        ...BASE_STATS,

        name: "Chomper",

        species: "Tung"

    },

    inventory: {

        apple: 2,

        energyDrink: 1

    },

    ais: [],

    log: [],

    turn: "player",

    turnNumber: 1,

    aiIndex: 0,

    round: 1

};


// ============================================================
// START
// ============================================================

function startGame() {

    let name =
        prompt(
            "What do you want to name your Tung?"
        );

    if (
        !name ||
        name.trim() === ""
    ) {

        name = "Chomper";

    }

    game.player.name =
        name.trim();

    createAIs();

    addLog(
        `🟫 Welcome to Tung Tangle, ${game.player.name}!`
    );

    addLog(
        `🏆 Round ${game.round} has begun!`
    );

    addLog(
        `🤖 ${game.ais.length} AI Tungs have entered!`
    );

    updateUI();

}


// ============================================================
// RANDOM AI LINEUP
// 5 - 13 AIs
// ============================================================

function createAIs() {

    game.ais = [];

    const amount =
        Math.floor(
            Math.random() * 9
        ) + 5;

    const names =
        [...AI_NAMES]
            .sort(
                () => Math.random() - 0.5
            );

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        game.ais.push({

            ...BASE_STATS,

            name: names[i],

            species: "Tung",

            lastAction: "Waiting..."

        });

    }

}


// ============================================================
// EVOLUTION
// ============================================================

function getSpecies(level) {

    if (level >= 10) {

        return "Alpha Tung";

    }

    if (level >= 5) {

        return "Mega Tung";

    }

    return "Tung";

}


// ============================================================
// PIXEL TUNG
// 32x32 CANVAS
// ============================================================

function drawTung(
    canvas,
    species = "Tung",
    direction = "right"
) {

    if (!canvas) return;

    const ctx =
        canvas.getContext("2d");

    ctx.clearRect(
        0,
        0,
        32,
        32
    );

    ctx.imageSmoothingEnabled = false;


    // COLORS

    let body = "#a85d27";
    let light = "#d8893c";
    let dark = "#633316";
    let eye = "#fff4dc";


    if (species === "Mega Tung") {

        body = "#b96829";
        light = "#f0a148";
        dark = "#6d3515";

    }


    if (species === "Alpha Tung") {

        body = "#c8752d";
        light = "#ffbd55";
        dark = "#713414";

    }


    // SHADOW

    ctx.fillStyle = "#000000";

    ctx.fillRect(
        7,
        29,
        18,
        2
    );


    // LEGS

    ctx.fillStyle = dark;

    ctx.fillRect(
        10,
        23,
        3,
        7
    );

    ctx.fillRect(
        20,
        23,
        3,
        7
    );


    // BODY

    ctx.fillStyle = body;

    ctx.fillRect(
        9,
        8,
        15,
        17
    );


    // BODY LIGHT

    ctx.fillStyle = light;

    ctx.fillRect(
        11,
        10,
        3,
        12
    );


    // HEAD

    ctx.fillStyle = body;

    ctx.fillRect(
        8,
        4,
        17,
        8
    );


    // TOP

    ctx.fillStyle = light;

    ctx.fillRect(
        10,
        4,
        12,
        2
    );


    // EYES

    ctx.fillStyle = eye;

    ctx.fillRect(
        10,
        6,
        5,
        5
    );

    ctx.fillRect(
        18,
        6,
        5,
        5
    );


    // PUPILS

    ctx.fillStyle = "#17120e";

    if (direction === "left") {

        ctx.fillRect(
            10,
            7,
            2,
            3
        );

        ctx.fillRect(
            18,
            7,
            2,
            3
        );

    } else {

        ctx.fillRect(
            13,
            7,
            2,
            3
        );

        ctx.fillRect(
            21,
            7,
            2,
            3
        );

    }


    // NOSE

    ctx.fillStyle = dark;

    ctx.fillRect(
        15,
        10,
        3,
        2
    );


    // SMILE

    ctx.fillRect(
        14,
        12,
        7,
        1
    );

    ctx.fillRect(
        16,
        13,
        3,
        1
    );


    // ARMS

    ctx.fillStyle = light;

    ctx.fillRect(
        6,
        14,
        3,
        8
    );

    ctx.fillRect(
        24,
        14,
        3,
        8
    );


    // CLUB

    ctx.fillStyle = dark;

    ctx.fillRect(
        4,
        20,
        2,
        9
    );

    ctx.fillStyle = light;

    ctx.fillRect(
        2,
        18,
        5,
        5
    );


    // MEGA ARMOUR

    if (species === "Mega Tung") {

        ctx.fillStyle = "#596575";

        ctx.fillRect(
            7,
            16,
            3,
            6
        );

        ctx.fillRect(
            23,
            16,
            3,
            6
        );

        ctx.fillStyle = "#aeb8c5";

        ctx.fillRect(
            7,
            17,
            2,
            2
        );

    }


    // ALPHA CAPE

    if (species === "Alpha Tung") {

        ctx.fillStyle = "#8b1821";

        ctx.fillRect(
            5,
            13,
            3,
            13
        );

        ctx.fillRect(
            24,
            13,
            3,
            13
        );


        // CROWN

        ctx.fillStyle = "#ffd83d";

        ctx.fillRect(
            10,
            2,
            13,
            2
        );

        ctx.fillRect(
            11,
            0,
            2,
            3
        );

        ctx.fillRect(
            15,
            1,
            2,
            2
        );

        ctx.fillRect(
            20,
            0,
            2,
            3
        );

    }

}


// ============================================================
// PLAYER SPRITE
// ============================================================

function drawPlayerSprite() {

    drawTung(

        document.getElementById(
            "player-sprite"
        ),

        game.player.species,

        "right"

    );

}


// ============================================================
// LOG
// ============================================================

function addLog(message) {

    game.log.unshift(message);

    if (
        game.log.length > 60
    ) {

        game.log.pop();

    }

    updateLog();

}


function updateLog() {

    const element =
        document.getElementById(
            "log"
        );

    if (!element) return;

    element.innerHTML =
        game.log
            .map(
                message =>
                    `<div class="log-entry">${message}</div>`
            )
            .join("");

}


// ============================================================
// XP
// ============================================================

function gainXP(amount) {

    game.player.xp += amount;

    addLog(
        `⭐ ${game.player.name} gained ${amount} XP.`
    );

    while (
        game.player.xp >=
        game.player.xpNeeded
    ) {

        game.player.xp -=
            game.player.xpNeeded;

        levelUp();

    }

}


// ============================================================
// LEVEL UP
// ============================================================

function levelUp() {

    game.player.level++;

    game.player.maxHp += 10;

    game.player.hp =
        game.player.maxHp;

    game.player.maxEnergy += 5;

    game.player.energy =
        game.player.maxEnergy;

    game.player.power += 2;

    game.player.defence += 1;

    game.player.speed += 1;

    game.player.xpNeeded =
        Math.floor(
            game.player.xpNeeded * 1.25
        );

    const oldSpecies =
        game.player.species;

    game.player.species =
        getSpecies(
            game.player.level
        );

    addLog(
        `🎉 ${game.player.name} reached LEVEL ${game.player.level}!`
    );


    if (
        oldSpecies !==
        game.player.species
    ) {

        if (
            game.player.species ===
            "Mega Tung"
        ) {

            addLog(
                `🧬 ${game.player.name} evolved into MEGA TUNG!`
            );

        }

        if (
            game.player.species ===
            "Alpha Tung"
        ) {

            addLog(
                `👑 ${game.player.name} evolved into ALPHA TUNG!`
            );

        }

    }

}


// ============================================================
// ENERGY
// ============================================================

function spendEnergy(amount) {

    if (
        game.player.energy <
        amount
    ) {

        addLog(
            "⚡ Not enough energy!"
        );

        return false;

    }

    game.player.energy -=
        amount;

    return true;

}


// ============================================================
// PLAYER ACTION
// ============================================================

function playerAction(action) {

    if (
        game.turn !== "player"
    ) {

        addLog(
            "⏳ It isn't your turn!"
        );

        return;

    }


    if (
        action === "fight"
    ) {

        openFight();

        return;

    }


    let successful = true;


    switch (action) {

        case "explore":

            successful =
                playerExplore();

            break;


        case "power":

            successful =
                playerTrain(
                    "power"
                );

            break;


        case "defence":

            successful =
                playerTrain(
                    "defence"
                );

            break;


        case "speed":

            successful =
                playerTrain(
                    "speed"
                );

            break;


        case "rest":

            playerRest();

            break;

    }


    if (successful !== false) {

        finishPlayerTurn();

    }

}


// ============================================================
// EXPLORE
// ============================================================

function playerExplore() {

    if (
        !spendEnergy(10)
    ) {

        return false;

    }


    const roll =
        Math.random();


    if (
        roll < .35
    ) {

        const xp =
            Math.floor(
                Math.random() * 20
            ) + 10;

        gainXP(xp);

        addLog(
            `🌲 ${game.player.name} explored and found XP!`
        );

    }

    else if (
        roll < .55
    ) {

        game.inventory.apple++;

        addLog(
            `🍎 ${game.player.name} found an apple!`
        );

    }

    else {

        addLog(
            `🌲 ${game.player.name} explored the area.`
        );

    }


    return true;

}


// ============================================================
// TRAIN
// ============================================================

function playerTrain(stat) {

    if (
        !spendEnergy(15)
    ) {

        return false;

    }


    game.player[stat]++;

    gainXP(10);

    addLog(
        `💪 ${game.player.name} trained ${stat}!`
    );

    return true;

}


// ============================================================
// REST
// ============================================================

function playerRest() {

    game.player.hp =
        Math.min(
            game.player.maxHp,
            game.player.hp + 30
        );

    game.player.energy =
        Math.min(
            game.player.maxEnergy,
            game.player.energy + 30
        );

    addLog(
        `💤 ${game.player.name} rested.`
    );

}


// ============================================================
// FINISH PLAYER TURN
// ============================================================

function finishPlayerTurn() {

    game.turn = "ai";

    game.aiIndex = 0;

    updateUI();

    addLog(
        "🤖 AI Tungs are taking their turns..."
    );

    setTimeout(
        runNextAI,
        700
    );

}


// ============================================================
// AI TURN
// ============================================================

function runNextAI() {

    if (
        game.aiIndex >=
        game.ais.length
    ) {

        finishAITurns();

        return;

    }


    const ai =
        game.ais[
            game.aiIndex
        ];


    ai.lastAction =
        "Taking turn...";


    updateUI();


    setTimeout(
        () => {

            aiTakeTurn(ai);

            updateUI();

            game.aiIndex++;

            setTimeout(
                runNextAI,
                700
            );

        },
        400
    );

}


// ============================================================
// AI BEHAVIOUR
// ============================================================

function aiTakeTurn(ai) {

    const roll =
        Math.random();


    if (
        roll < .30
    ) {

        const stats = [
            "power",
            "defence",
            "speed"
        ];

        const stat =
            stats[
                Math.floor(
                    Math.random() *
                    stats.length
                )
            ];

        ai[stat]++;

        ai.lastAction =
            `Trained ${stat}.`;

        addLog(
            `🤖 ${ai.name} trained ${stat}.`
        );

        return;

    }


    if (
        roll < .50
    ) {

        ai.hp =
            Math.min(
                ai.maxHp,
                ai.hp + 25
            );

        ai.energy =
            Math.min(
                ai.maxEnergy,
                ai.energy + 25
            );

        ai.lastAction =
            "Rested.";

        addLog(
            `🤖 ${ai.name} rested.`
        );

        return;

    }


    if (
        roll < .75
    ) {

        const xp =
            Math.floor(
                Math.random() * 15
            ) + 5;

        ai.xp += xp;

        ai.energy =
            Math.max(
                0,
                ai.energy - 10
            );

        ai.lastAction =
            `Explored (+${xp} XP).`;

        addLog(
            `🤖 ${ai.name} explored and gained ${xp} XP.`
        );

        return;

    }


    ai.speed++;

    ai.lastAction =
        "Practised speed.";

    addLog(
        `🤖 ${ai.name} practised speed.`
    );

}


// ============================================================
// FINISH AI TURNS
// ============================================================

function finishAITurns() {

    game.turn = "player";

    game.aiIndex = 0;

    game.turnNumber++;

    addLog(
        `🟢 Your turn! Turn ${game.turnNumber}.`
    );

    updateUI();

}


// ============================================================
// FIGHT MENU
// ============================================================

function openFight() {

    if (
        game.turn !== "player"
    ) return;


    let html =
        `<div class="rivals">`;


    game.ais.forEach(
        (ai, index) => {

            html += `

                <button
                    class="rival"
                    onclick="startFight(${index})"
                >

                    <strong>
                        ${ai.name}
                    </strong>

                    <span>
                        ❤️ ${ai.hp}/${ai.maxHp}
                    </span>

                    <span>
                        💪 ${ai.power}
                        🛡️ ${ai.defence}
                        ⚡ ${ai.speed}
                    </span>

                </button>

            `;

        }
    );


    html += "</div>";


    showModal(
        "⚔️ Choose Your Opponent",
        html
    );

}


// ============================================================
// COOL BATTLE
// ============================================================

function startFight(index) {

    if (
        game.turn !== "player"
    ) return;


    const enemy =
        game.ais[index];

    if (!enemy) return;


    if (
        !spendEnergy(20)
    ) return;


    closeModal();

    game.turn = "fight";

    updateUI();


    let playerHP =
        game.player.hp;

    let enemyHP =
        enemy.hp;


    const playerMax =
        game.player.maxHp;

    const enemyMax =
        enemy.maxHp;


    showModal(

        `⚔️ ${game.player.name} VS ${enemy.name}`,

        `

        <div class="battle-arena">

            <div class="battle-header">

                <div class="battle-fighter player">

                    <canvas
                        id="battle-player"
                        width="32"
                        height="32"
                    ></canvas>

                    <div class="battle-name">
                        ${game.player.name}
                    </div>

                    <div class="battle-hp">

                        <div
                            id="battle-player-bar"
                            class="battle-hp-fill"
                            style="width:100%"
                        ></div>

                    </div>

                    <div
                        id="battle-player-text"
                        class="battle-hp-text"
                    >
                        ${playerHP}/${playerMax}
                    </div>

                </div>


                <div class="battle-vs">
                    VS
                </div>


                <div class="battle-fighter enemy">

                    <canvas
                        id="battle-enemy"
                        width="32"
                        height="32"
                    ></canvas>

                    <div class="battle-name">
                        ${enemy.name}
                    </div>

                    <div class="battle-hp">

                        <div
                            id="battle-enemy-bar"
                            class="battle-hp-fill"
                            style="width:100%"
                        ></div>

                    </div>

                    <div
                        id="battle-enemy-text"
                        class="battle-hp-text"
                    >
                        ${enemyHP}/${enemyMax}
                    </div>

                </div>

            </div>


            <div
                id="battle-turn"
                class="battle-turn"
            >
                ⚔️ Battle starting...
            </div>


            <div
                id="battle-log"
                class="battle-log"
            ></div>

        </div>

        `

    );


    // DRAW 32x32 SPRITES

    drawTung(

        document.getElementById(
            "battle-player"
        ),

        game.player.species,

        "right"

    );


    drawTung(

        document.getElementById(
            "battle-enemy"
        ),

        enemy.species,

        "left"

    );


    const battleLog =
        document.getElementById(
            "battle-log"
        );


    let playerAttacks = true;

    let battleOver = false;


    function addBattleMessage(
        message
    ) {

        const line =
            document.createElement(
                "div"
            );

        line.className =
            "battle-event";

        line.textContent =
            message;

        battleLog.appendChild(
            line
        );

        battleLog.scrollTop =
            battleLog.scrollHeight;

    }


    function updateBattleUI() {

        const playerBar =
            document.getElementById(
                "battle-player-bar"
            );

        const enemyBar =
            document.getElementById(
                "battle-enemy-bar"
            );


        const playerText =
            document.getElementById(
                "battle-player-text"
            );

        const enemyText =
            document.getElementById(
                "battle-enemy-text"
            );


        const turnText =
            document.getElementById(
                "battle-turn"
            );


        if (playerBar) {

            playerBar.style.width =
                `${Math.max(
                    0,
                    playerHP /
                    playerMax *
                    100
                )}%`;

        }


        if (enemyBar) {

            enemyBar.style.width =
                `${Math.max(
                    0,
                    enemyHP /
                    enemyMax *
                    100
                )}%`;

        }


        if (playerText) {

            playerText.textContent =
                `${playerHP}/${playerMax}`;

        }


        if (enemyText) {

            enemyText.textContent =
                `${enemyHP}/${enemyMax}`;

        }


        if (turnText) {

            turnText.textContent =
                playerAttacks
                    ? `🟢 ${game.player.name}'s attack`
                    : `🔴 ${enemy.name}'s attack`;

        }

    }


    function battleStep() {

        if (battleOver) return;


        if (
            playerHP <= 0 ||
            enemyHP <= 0
        ) {

            finishBattle();

            return;

        }


        let damage;


        // PLAYER ATTACK

        if (playerAttacks) {

            damage =
                Math.max(

                    1,

                    game.player.power -

                    Math.floor(
                        enemy.defence / 2
                    ) +

                    Math.floor(
                        Math.random() * 6
                    )

                );


            enemyHP =
                Math.max(
                    0,
                    enemyHP - damage
                );


            addBattleMessage(
                `🟢 ${game.player.name} dealt ${damage} damage!`
            );


            setTimeout(
                () => {

                    addBattleMessage(
                        `🔴 ${enemy.name} took ${damage} damage!`
                    );

                },
                250
            );

        }


        // ENEMY ATTACK

        else {

            damage =
                Math.max(

                    1,

                    enemy.power -

                    Math.floor(
                        game.player.defence / 2
                    ) +

                    Math.floor(
                        Math.random() * 6
                    )

                );


            playerHP =
                Math.max(
                    0,
                    playerHP - damage
                );


            addBattleMessage(
                `🔴 ${enemy.name} dealt ${damage} damage!`
            );


            setTimeout(
                () => {

                    addBattleMessage(
                        `🟢 ${game.player.name} took ${damage} damage!`
                    );

                },
                250
            );

        }


        updateBattleUI();


        playerAttacks =
            !playerAttacks;


        setTimeout(
            battleStep,
            1100
        );

    }


    function finishBattle() {

        battleOver = true;


        // PLAYER WIN

        if (
            enemyHP <= 0
        ) {

            game.player.wins++;

            game.player.hp =
                Math.max(
                    1,
                    playerHP
                );


            enemy.hp = 0;


            addBattleMessage(
                `🏆 ${enemy.name} has been defeated!`
            );


            addBattleMessage(
                `⭐ ${game.player.name} won the battle!`
            );


            addBattleMessage(
                `⭐ +40 XP`
            );


            gainXP(40);


            setTimeout(
                () => {

                    showVictory(
                        game.player.name
                    );

                },
                1200
            );

        }


        // PLAYER LOSES

        else {

            game.player.hp =
                Math.max(
                    1,
                    playerHP
                );


            enemy.hp =
                enemyMax;


            addBattleMessage(
                `❌ ${game.player.name} lost the battle.`
            );


            setTimeout(
                () => {

                    showDefeat(
                        enemy.name
                    );

                },
                1200
            );

        }

    }


    function showVictory(name) {

        showModal(

            "🏆 VICTORY!",

            `

            <div class="victory-screen">

                <div class="victory-title">
                    VICTORY!
                </div>

                <p>
                    🟫 ${name} won the battle!
                </p>

                <p>
                    ⭐ +40 XP
                </p>

                <button
                    onclick="endBattle()"
                >
                    CONTINUE
                </button>

            </div>

            `

        );

    }


    function showDefeat(name) {

        showModal(

            "❌ DEFEAT",

            `

            <div class="victory-screen">

                <div
                    class="victory-title"
                    style="color:#ef5555"
                >
                    DEFEAT
                </div>

                <p>
                    ${name} won this battle.
                </p>

                <button
                    onclick="endBattle()"
                >
                    CONTINUE
                </button>

            </div>

            `

        );

    }


    battleStep();

}


// ============================================================
// END BATTLE
// ============================================================

function endBattle() {

    closeModal();

    game.turn = "ai";

    game.aiIndex = 0;

    updateUI();

    addLog(
        "🤖 AI Tungs are taking their turns..."
    );

    setTimeout(
        runNextAI,
        700
    );

}


// ============================================================
// INVENTORY
// ============================================================

function openInventory() {

    if (
        game.turn !== "player"
    ) return;


    showModal(

        "🎒 Inventory",

        `

        <button
            class="item"
            onclick="useItem('apple')"
        >

            🍎 Apple

            <span>
                x${game.inventory.apple}
            </span>

        </button>


        <button
            class="item"
            onclick="useItem('energyDrink')"
        >

            ⚡ Energy Drink

            <span>
                x${game.inventory.energyDrink}
            </span>

        </button>

        `

    );

}


function useItem(item) {

    if (
        game.turn !== "player"
    ) return;


    if (
        game.inventory[item] <= 0
    ) {

        addLog(
            "❌ You don't have that item."
        );

        return;

    }


    if (
        item === "apple"
    ) {

        game.player.hp =
            Math.min(
                game.player.maxHp,
                game.player.hp + 25
            );

        game.inventory.apple--;

        addLog(
            `🍎 ${game.player.name} ate an apple.`
        );

    }


    if (
        item === "energyDrink"
    ) {

        game.player.energy =
            Math.min(
                game.player.maxEnergy,
                game.player.energy + 40
            );

        game.inventory.energyDrink--;

        addLog(
            `⚡ ${game.player.name} used an Energy Drink.`
        );

    }


    closeModal();

    finishPlayerTurn();

}


// ============================================================
// TRAVEL
// ============================================================

function openTravel() {

    if (
        game.turn !== "player"
    ) return;


    showModal(

        "🗺️ Travel",

        `

        <button
            class="location"
            onclick="travel('Tung Town')"
        >
            🏘️ Tung Town
        </button>


        <button
            class="location"
            onclick="travel('Tung Forest')"
        >
            🌲 Tung Forest
        </button>


        <button
            class="location"
            onclick="travel('Tung Mountain')"
        >
            ⛰️ Tung Mountain
        </button>


        <button
            class="location"
            onclick="travel('Tung Arena')"
        >
            🏟️ Tung Arena
        </button>

        `

    );

}


function travel(location) {

    if (
        game.turn !== "player"
    ) return;


    game.player.location =
        location;

    addLog(
        `🗺️ ${game.player.name} travelled to ${location}.`
    );

    closeModal();

    finishPlayerTurn();

}


// ============================================================
// LEADERBOARD
// ============================================================

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

    const everyone = [

        game.player,

        ...game.ais

    ];


    everyone.sort(
        (a, b) =>
            scoreFor(b) -
            scoreFor(a)
    );


    let html = "";


    everyone.forEach(
        (tung, index) => {

            let medal;

            if (
                index === 0
            ) medal = "🥇";

            else if (
                index === 1
            ) medal = "🥈";

            else if (
                index === 2
            ) medal = "🥉";

            else
                medal =
                    `${index + 1}.`;


            html += `

                <div class="leaderboard-row">

                    <strong>

                        ${medal}
                        ${tung.name}

                    </strong>

                    <span>

                        ${getSpecies(tung.level)}
                        • Lv.${tung.level}
                        • ${tung.wins} wins
                        • ${scoreFor(tung)} pts

                    </span>

                </div>

            `;

        }
    );


    showModal(

        `🏆 Leaderboard — Round ${game.round}`,

        html

    );

}


// ============================================================
// SAVE
// ============================================================

function saveGame() {

    localStorage.setItem(

        "tungTangleSave",

        JSON.stringify(game)

    );

    addLog(
        "💾 Game saved!"
    );

}


// ============================================================
// LOAD
// ============================================================

function loadGame() {

    const saved =
        localStorage.getItem(
            "tungTangleSave"
        );


    if (!saved) {

        addLog(
            "❌ No saved game found."
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


// ============================================================
// UI
// ============================================================

function updateUI() {

    const p =
        game.player;


    setText(
        "tung-name",
        p.name
    );

    setText(
        "species",
        p.species
    );

    setText(
        "level",
        p.level
    );

    setText(
        "hp-text",
        `${p.hp} / ${p.maxHp}`
    );

    setText(
        "energy-text",
        `${p.energy} / ${p.maxEnergy}`
    );

    setText(
        "xp-text",
        `${p.xp} / ${p.xpNeeded}`
    );

    setText(
        "power",
        p.power
    );

    setText(
        "defence",
        p.defence
    );

    setText(
        "speed",
        p.speed
    );

    setText(
        "wins",
        p.wins
    );

    setText(
        "location",
        p.location
    );

    setText(
        "round",
        game.round
    );

    setText(
        "turn-number",
        game.turnNumber
    );


    // BARS

    setWidth(
        "hp-bar",
        p.hp /
        p.maxHp *
        100
    );

    setWidth(
        "energy-bar",
        p.energy /
        p.maxEnergy *
        100
    );

    setWidth(
        "xp-bar",
        p.xp /
        p.xpNeeded *
        100
    );


    // SPRITE

    drawPlayerSprite();


    // TURN PANEL

    const panel =
        document.getElementById(
            "turn-panel"
        );

    const title =
        document.getElementById(
            "turn-title"
        );

    const description =
        document.getElementById(
            "turn-description"
        );

    const icon =
        document.getElementById(
            "turn-icon"
        );


    if (
        game.turn === "player"
    ) {

        panel.className =
            "turn-panel turn-player";

        icon.textContent =
            "🟢";

        title.textContent =
            "YOUR TURN";

        description.textContent =
            "Choose an action.";

    }

    else if (
        game.turn === "ai"
    ) {

        panel.className =
            "turn-panel turn-ai";

        icon.textContent =
            "🤖";


        const ai =
            game.ais[
                game.aiIndex
            ];


        if (ai) {

            title.textContent =
                `${ai.name.toUpperCase()}'S TURN`;

            description.textContent =
                "The AI is choosing an action.";

        }

    }

    else {

        panel.className =
            "turn-panel turn-ai";

        icon.textContent =
            "⚔️";

        title.textContent =
            "BATTLE";

        description.textContent =
            "A battle is taking place.";

    }


    // ACTION BUTTONS

    document
        .querySelectorAll(
            ".action-button"
        )
        .forEach(
            button => {

                button.disabled =
                    game.turn !==
                    "player";

            }
        );


    // AI LIST

    const aiList =
        document.getElementById(
            "ai-list"
        );


    if (aiList) {

        aiList.innerHTML =
            game.ais
                .map(
                    (ai, index) => {

                        const active =
                            game.turn === "ai" &&
                            index ===
                            game.aiIndex;


                        return `

                            <div
                                class="ai ${
                                    active
                                        ? "active"
                                        : ""
                                }"
                            >

                                <div class="ai-top">

                                    <canvas
                                        class="ai-sprite"
                                        width="32"
                                        height="32"
                                        data-index="${index}"
                                    ></canvas>

                                    <span class="ai-name">
                                        🤖 ${ai.name}
                                    </span>

                                    <span>
                                        Lv.${ai.level}
                                    </span>

                                </div>

                                <div class="ai-stats">

                                    ❤️ ${ai.hp}/${ai.maxHp}

                                    &nbsp;

                                    💪 ${ai.power}

                                    &nbsp;

                                    🛡️ ${ai.defence}

                                    &nbsp;

                                    ⚡ ${ai.speed}

                                </div>

                                <div class="ai-action">

                                    ${ai.lastAction}

                                </div>

                            </div>

                        `;

                    }
                )
                .join("");


        document
            .querySelectorAll(
                ".ai-sprite"
            )
            .forEach(
                canvas => {

                    const index =
                        Number(
                            canvas.dataset.index
                        );

                    const ai =
                        game.ais[index];

                    drawTung(

                        canvas,

                        ai.species,

                        "right"

                    );

                }
            );

    }


    updateLog();

}


// ============================================================
// HELPERS
// ============================================================

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value;

    }

}


function setWidth(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (element) {

        element.style.width =
            `${Math.max(
                0,
                Math.min(
                    100,
                    value
                )
            )}%`;

    }

}


// ============================================================
// MODAL
// ============================================================

function showModal(
    title,
    body
) {

    const modal =
        document.getElementById(
            "modal"
        );

    const modalTitle =
        document.getElementById(
            "modal-title"
        );

    const modalBody =
        document.getElementById(
            "modal-body"
        );


    modalTitle.textContent =
        title;

    modalBody.innerHTML =
        body;

    modal.classList.remove(
        "hidden"
    );

}


function closeModal() {

    document
        .getElementById(
            "modal"
        )
        .classList.add(
            "hidden"
        );

}


// ============================================================
// START GAME
// ============================================================

window.addEventListener(
    "load",
    startGame
);
