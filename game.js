/* ============================================================
   TUNG TANGLE
   Complete Game Engine
   ============================================================ */


/* ============================================================
   CONFIGURATION
   ============================================================ */

const SPRITE_SHEET = "tung-sprites.png";

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

const BASE_STATS = {
    hp: 100,
    maxHp: 100,

    energy: 100,
    maxEnergy: 100,

    power: 10,
    defence: 5,
    speed: 5,

    level: 1,
    xp: 0,

    wins: 0,

    day: 1,

    location: "Tung Town",

    species: "Tung",

    spriteRole: "normal",

    shiny: false
};


/* ============================================================
   GLOBAL GAME STATE
   ============================================================ */

const game = {

    player: {
        name: "Chomper",
        ...BASE_STATS
    },

    ais: [],

    inventory: {
        apple: 2,
        potion: 1,
        energyDrink: 1
    },

    log: [],

    turn: "player",

    turnNumber: 1,

    aiIndex: 0,

    battleInProgress: false,

    currentBattle: null,

    initialized: false

};


/* ============================================================
   SPRITE SHEET
   ============================================================ */

const spriteSheet = new Image();

spriteSheet.src = SPRITE_SHEET;

spriteSheet.onload = function () {

    console.log("Tung sprite sheet loaded.");

    updateUI();

};

spriteSheet.onerror = function () {

    console.warn(
        "Could not load " +
        SPRITE_SHEET +
        ". Check the filename."
    );

};


/*
    The supplied sprite sheet is a visual sprite atlas.

    These source rectangles correspond to the different
    characters/roles shown on the sheet.

    They are scaled down to 32x32 when drawn.
*/

const SPRITES = {

    normal: {
        x: 48,
        y: 84,
        w: 55,
        h: 155
    },

    idle: {
        x: 50,
        y: 370,
        w: 55,
        h: 100
    },

    walk: {
        x: 390,
        y: 370,
        w: 55,
        h: 100
    },

    attack: {
        x: 680,
        y: 370,
        w: 70,
        h: 100
    },

    hurt: {
        x: 1015,
        y: 370,
        w: 70,
        h: 100
    },

    victory: {
        x: 1140,
        y: 370,
        w: 70,
        h: 100
    },

    defeat: {
        x: 1370,
        y: 370,
        w: 70,
        h: 100
    },

    speed: {
        x: 215,
        y: 555,
        w: 80,
        h: 155
    },

    power: {
        x: 405,
        y: 555,
        w: 90,
        h: 155
    },

    defence: {
        x: 590,
        y: 555,
        w: 90,
        h: 155
    },

    explorer: {
        x: 780,
        y: 555,
        w: 90,
        h: 155
    },

    resting: {
        x: 970,
        y: 555,
        w: 90,
        h: 155
    },

    fighter: {
        x: 1170,
        y: 555,
        w: 90,
        h: 155
    },

    travel: {
        x: 1370,
        y: 555,
        w: 90,
        h: 155
    },

    mega: {
        x: 450,
        y: 85,
        w: 90,
        h: 155
    },

    alpha: {
        x: 830,
        y: 75,
        w: 90,
        h: 165
    },

    shinyAlpha: {
        x: 1190,
        y: 75,
        w: 90,
        h: 165
    }

};


/* ============================================================
   BASIC HELPERS
   ============================================================ */

function random(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}


function clamp(value, min, max) {

    return Math.max(
        min,
        Math.min(max, value)
    );

}


function randomChoice(array) {

    return array[
        Math.floor(
            Math.random() * array.length
        )
    ];

}


function sleep(ms) {

    return new Promise(
        resolve => setTimeout(resolve, ms)
    );

}


/* ============================================================
   NAME SELECTION
   ============================================================ */

function choosePlayerName() {

    const currentName =
        game.player.name || "";

    let name =
        prompt(
            "Choose your Tung's name:",
            currentName
        );


    if (
        name === null ||
        name.trim() === ""
    ) {

        name =
            currentName ||
            "Chomper";

    }


    name =
        name
            .trim()
            .substring(0, 18);


    game.player.name =
        name;


    updateUI();

    addLog(
        `🐸 Your Tung is called ${name}!`
    );

}


/* ============================================================
   AI CREATION
   ============================================================ */

function createAI(name) {

    return {

        name: name,

        hp: 100,
        maxHp: 100,

        energy: 100,
        maxEnergy: 100,

        power: 10,
        defence: 5,
        speed: 5,

        level: 1,
        xp: 0,

        wins: 0,

        day: 1,

        location: "Tung Town",

        species: "Tung",

        spriteRole: "normal",

        shiny: false,

        lastAction: "Waiting..."

    };

}


/* ============================================================
   NEW ROUND / AI ROSTER
   ============================================================ */

function createAIs() {

    game.ais = [];


    /*
       Random number between 5 and 13.

       There are exactly 13 names in the pool.
    */

    const amount =
        random(
            5,
            AI_NAMES.length
        );


    const shuffled =
        [...AI_NAMES].sort(
            () => Math.random() - 0.5
        );


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        game.ais.push(
            createAI(
                shuffled[i]
            )
        );

    }


    addLog(
        `🤖 ${amount} rival Tungs have entered this round!`
    );


    updateUI();

}


/* ============================================================
   LOGGING
   ============================================================ */

function addLog(message) {

    game.log.unshift(message);


    if (
        game.log.length > 100
    ) {

        game.log.pop();

    }


    updateLog();

}


function updateLog() {

    const log =
        document.getElementById("log");


    if (!log) return;


    log.innerHTML =
        game.log
            .slice(0, 40)
            .map(
                item =>
                    `<div class="log-entry">${escapeHTML(item)}</div>`
            )
            .join("");

}


function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}


/* ============================================================
   TURN SYSTEM
   ============================================================ */

function setTurn(turn) {

    game.turn =
        turn;


    const panel =
        document.getElementById(
            "turn-panel"
        );


    const icon =
        document.getElementById(
            "turn-icon"
        );


    const title =
        document.getElementById(
            "turn-title"
        );


    const description =
        document.getElementById(
            "turn-description"
        );


    if (!panel) return;


    panel.classList.remove(
        "turn-player",
        "turn-ai"
    );


    if (
        turn === "player"
    ) {

        panel.classList.add(
            "turn-player"
        );


        if (icon) {
            icon.textContent = "🟢";
        }


        if (title) {
            title.textContent =
                "YOUR TURN";
        }


        if (description) {
            description.textContent =
                "Choose an action.";
        }

    }
    else if (
        turn === "ai"
    ) {

        panel.classList.add(
            "turn-ai"
        );


        if (icon) {
            icon.textContent = "🤖";
        }


        if (title) {

            const ai =
                game.ais[
                    game.aiIndex
                ];

            title.textContent =
                ai
                    ? `${ai.name.toUpperCase()}'S TURN`
                    : "AI TURN";

        }


        if (description) {

            description.textContent =
                "The rival Tungs are taking their actions.";

        }

    }

}


/* ============================================================
   ENERGY
   ============================================================ */

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


/* ============================================================
   XP / LEVELS
   ============================================================ */

function gainXP(amount) {

    game.player.xp +=
        amount;


    while (
        game.player.xp >= 100
    ) {

        game.player.xp -=
            100;

        levelUp();

    }


    updateUI();

}


function levelUp() {

    game.player.level++;


    game.player.maxHp +=
        10;


    game.player.hp =
        game.player.maxHp;


    game.player.maxEnergy +=
        5;


    game.player.energy =
        game.player.maxEnergy;


    addLog(
        `🎉 ${game.player.name} reached Level ${game.player.level}!`
    );


    checkEvolution();

}


function checkEvolution() {

    if (
        game.player.level >= 10
    ) {

        game.player.species =
            "Alpha Tung";


        game.player.spriteRole =
            "alpha";


        /*
           Small chance to become Shiny Alpha.

           Once shiny, it stays shiny.
        */

        if (
            !game.player.shiny &&
            Math.random() < 0.08
        ) {

            game.player.shiny =
                true;

            game.player.spriteRole =
                "shinyAlpha";


            addLog(
                `✨ INCREDIBLE! ${game.player.name} became a SHINY ALPHA TUNG!`
            );

        }

        else {

            addLog(
                `👑 ${game.player.name} evolved into ALPHA TUNG!`
            );

        }

    }
    else if (
        game.player.level >= 5
    ) {

        game.player.species =
            "Mega Tung";


        game.player.spriteRole =
            "mega";


        addLog(
            `🔥 ${game.player.name} evolved into MEGA TUNG!`
        );

    }
    else {

        game.player.species =
            "Tung";

    }

}


/* ============================================================
   PLAYER ACTION
   ============================================================ */

function playerAction(action) {

    if (
        game.turn !== "player"
    ) {

        return;

    }


    if (
        game.battleInProgress
    ) {

        return;

    }


    let successful =
        false;


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

            successful =
                playerRest();

            break;


        case "fight":

            openFight();

            return;


        default:

            return;

    }


    if (
        successful
    ) {

        finishPlayerTurn();

    }

}


/* ============================================================
   TRAINING
   ============================================================ */

function playerTrain(stat) {

    if (
        !spendEnergy(15)
    ) {

        return false;

    }


    const increase =
        random(1, 15);


    game.player[stat] +=
        increase;


    game.player.spriteRole =
        stat;


    gainXP(10);


    const statName =
        stat
            .charAt(0)
            .toUpperCase() +
        stat.slice(1);


    addLog(
        `💪 ${game.player.name} trained ${statName} and gained +${increase}!`
    );


    return true;

}


/* ============================================================
   EXPLORE
   ============================================================ */

function playerExplore() {

    if (
        !spendEnergy(10)
    ) {

        return false;

    }


    game.player.spriteRole =
        "explorer";


    const xp =
        random(5, 25);


    gainXP(xp);


    const roll =
        Math.random();


    if (
        roll < 0.25
    ) {

        game.inventory.apple++;


        addLog(
            `🌲 ${game.player.name} explored and found an Apple!`
        );

    }
    else if (
        roll < 0.40
    ) {

        game.inventory.potion++;


        addLog(
            `🌲 ${game.player.name} found a Health Potion!`
        );

    }
    else if (
        roll < 0.50
    ) {

        game.inventory.energyDrink++;


        addLog(
            `🌲 ${game.player.name} found an Energy Drink!`
        );

    }
    else {

        addLog(
            `🌲 ${game.player.name} explored and gained ${xp} XP!`
        );

    }


    return true;

}


/* ============================================================
   REST
   ============================================================ */

function playerRest() {

    game.player.spriteRole =
        "resting";


    const hp =
        random(15, 30);


    const energy =
        random(15, 30);


    game.player.hp =
        clamp(
            game.player.hp + hp,
            0,
            game.player.maxHp
        );


    game.player.energy =
        clamp(
            game.player.energy + energy,
            0,
            game.player.maxEnergy
        );


    game.player.day++;


    addLog(
        `💤 ${game.player.name} rested and recovered ${hp} HP and ${energy} Energy.`
    );


    return true;

}


/* ============================================================
   FINISH PLAYER TURN
   ============================================================ */

function finishPlayerTurn() {

    game.turn =
        "ai";


    game.aiIndex =
        0;


    setTurn("ai");


    updateUI();


    addLog(
        "🤖 AI TURN BEGINS..."
    );


    setTimeout(
        runNextAI,
        600
    );

}


/* ============================================================
   AI TURN LOOP
   ============================================================ */

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


    if (!ai) {

        finishAITurns();

        return;

    }


    setTurn("ai");


    updateUI();


    /*
       Highlight current AI.
    */

    highlightAI(
        game.aiIndex
    );


    addLog(
        `🤖 ${ai.name}'s turn.`
    );


    setTimeout(
        () => {

            aiTakeTurn(ai);

        },
        500
    );

}


/* ============================================================
   AI ACTION
   ============================================================ */

function aiTakeTurn(ai) {

    if (
        !ai ||
        ai.hp <= 0
    ) {

        game.aiIndex++;

        setTimeout(
            runNextAI,
            500
        );

        return;

    }


    const roll =
        Math.random();


    /*
       15% CHANCE TO ATTACK PLAYER
    */

    if (
        roll < 0.15
    ) {

        ai.spriteRole =
            "fighter";


        ai.lastAction =
            "Attacked YOU";


        updateUI();


        addLog(
            `⚔️ ${ai.name} decided to attack ${game.player.name}!`
        );


        /*
           Stop normal AI loop while battle occurs.
        */

        startAIAttack(
            ai
        );


        return;

    }


    /*
       POWER
    */

    if (
        roll < 0.33
    ) {

        const increase =
            random(1, 15);


        ai.power +=
            increase;


        ai.spriteRole =
            "power";


        ai.lastAction =
            `Power +${increase}`;


        addLog(
            `💪 ${ai.name} trained Power and gained +${increase}!`
        );

    }


    /*
       DEFENCE
    */

    else if (
        roll < 0.51
    ) {

        const increase =
            random(1, 15);


        ai.defence +=
            increase;


        ai.spriteRole =
            "defence";


        ai.lastAction =
            `Defence +${increase}`;


        addLog(
            `🛡️ ${ai.name} trained Defence and gained +${increase}!`
        );

    }


    /*
       SPEED
    */

    else if (
        roll < 0.69
    ) {

        const increase =
            random(1, 15);


        ai.speed +=
            increase;


        ai.spriteRole =
            "speed";


        ai.lastAction =
            `Speed +${increase}`;


        addLog(
            `⚡ ${ai.name} trained Speed and gained +${increase}!`
        );

    }


    /*
       EXPLORE
    */

    else if (
        roll < 0.84
    ) {

        const xp =
            random(5, 20);


        ai.xp +=
            xp;


        ai.spriteRole =
            "explorer";


        ai.lastAction =
            `Explored +${xp} XP`;


        addLog(
            `🌲 ${ai.name} explored and gained ${xp} XP!`
        );


        aiLevelCheck(
            ai
        );

    }


    /*
       REST
    */

    else {

        const recovered =
            random(15, 30);


        ai.hp =
            clamp(
                ai.hp + recovered,
                0,
                ai.maxHp
            );


        ai.energy =
            clamp(
                ai.energy + recovered,
                0,
                ai.maxEnergy
            );


        ai.spriteRole =
            "resting";


        ai.lastAction =
            "Rested";


        addLog(
            `💤 ${ai.name} rested and recovered ${recovered} HP.`
        );

    }


    updateUI();


    /*
       Continue to next AI.
    */

    game.aiIndex++;


    setTimeout(
        runNextAI,
        700
    );

}


/* ============================================================
   AI LEVEL CHECK
   ============================================================ */

function aiLevelCheck(ai) {

    while (
        ai.xp >= 100
    ) {

        ai.xp -=
            100;


        ai.level++;


        ai.maxHp +=
            10;


        ai.hp =
            ai.maxHp;


        ai.maxEnergy +=
            5;


        ai.energy =
            ai.maxEnergy;


        if (
            ai.level >= 10
        ) {

            ai.species =
                "Alpha Tung";


            ai.spriteRole =
                "alpha";

        }
        else if (
            ai.level >= 5
        ) {

            ai.species =
                "Mega Tung";


            ai.spriteRole =
                "mega";

        }

    }

}


/* ============================================================
   FINISH AI TURNS
   ============================================================ */

function finishAITurns() {

    game.turn =
        "player";


    game.aiIndex =
        0;


    game.turnNumber++;


    game.player.day++;


    /*
       Small passive energy regeneration.
    */

    game.player.energy =
        clamp(
            game.player.energy + 10,
            0,
            game.player.maxEnergy
        );


    setTurn("player");


    addLog(
        `🟢 YOUR TURN — Round ${game.turnNumber}`
    );


    /*
       NEW AI ROSTER EVERY ROUND
    */

    createAIs();


    updateUI();

}


/* ============================================================
   AI HIGHLIGHT
   ============================================================ */

function highlightAI(index) {

    document
        .querySelectorAll(".ai")
        .forEach(
            element =>
                element.classList.remove(
                    "active"
                )
        );


    const current =
        document.querySelector(
            `.ai[data-index="${index}"]`
        );


    if (current) {

        current.classList.add(
            "active"
        );

    }

}


/* ============================================================
   FIGHT MENU
   ============================================================ */

function openFight() {

    if (
        game.turn !== "player"
    ) {

        return;

    }


    if (
        game.battleInProgress
    ) {

        return;

    }


    const alive =
        game.ais.filter(
            ai =>
                ai.hp > 0
        );


    if (
        alive.length === 0
    ) {

        addLog(
            "⚔️ There are no available rivals."
        );


        return;

    }


    const buttons =
        alive
            .map(
                ai => {

                    const index =
                        game.ais.indexOf(
                            ai
                        );


                    return `

                    <button
                        class="rival-button"
                        onclick="startFight(${index})"
                    >

                        ⚔️ ${escapeHTML(ai.name)}

                        <span>
                            Lv ${ai.level}
                            •
                            ⚔️ ${ai.power}
                            •
                            🛡️ ${ai.defence}
                            •
                            ⚡ ${ai.speed}
                        </span>

                    </button>

                    `;

                }
            )
            .join("");


    showModal(

        "⚔️ CHOOSE YOUR OPPONENT",

        `

        <div class="rivals">

            ${buttons}

        </div>

        `

    );

}


/* ============================================================
   PLAYER STARTS BATTLE
   ============================================================ */

function startFight(index) {

    if (
        game.turn !== "player"
    ) {

        return;

    }


    const enemy =
        game.ais[index];


    if (
        !enemy ||
        enemy.hp <= 0
    ) {

        return;

    }


    if (
        !spendEnergy(20)
    ) {

        return;

    }


    game.battleInProgress =
        true;


    game.turn =
        "battle";


    let playerHP =
        game.player.hp;


    let enemyHP =
        enemy.hp;


    let finished =
        false;


    let playerTurn =
        game.player.speed >=
        enemy.speed;


    /*
       Battle UI
    */

    showModal(

        `⚔️ ${game.player.name} VS ${enemy.name}`,

        `

        <div class="battle-arena">

            <div class="battle-header">

                <div class="battle-fighter">

                    <canvas
                        id="battle-player"
                        width="32"
                        height="32"
                    ></canvas>

                    <div class="battle-name">
                        ${escapeHTML(
                            game.player.name
                        )}
                    </div>

                    <div class="battle-stats">
                        💪 ${game.player.power}
                        🛡️ ${game.player.defence}
                        ⚡ ${game.player.speed}
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
                        ${playerHP}/${game.player.maxHp}
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
                        ${escapeHTML(
                            enemy.name
                        )}
                    </div>

                    <div class="battle-stats">
                        💪 ${enemy.power}
                        🛡️ ${enemy.defence}
                        ⚡ ${enemy.speed}
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
                        ${enemyHP}/${enemy.maxHp}
                    </div>

                </div>

            </div>


            <div
                id="battle-turn"
                class="battle-turn"
            >
                ⚔️ BATTLE!
            </div>


            <div
                id="battle-log"
                class="battle-log"
            ></div>


            <div class="battle-controls">

                <button
                    id="run-button"
                    class="run-button"
                    onclick="attemptRun()"
                >
                    🏃 RUN
                </button>

            </div>

        </div>

        `

    );


    const playerCanvas =
        document.getElementById(
            "battle-player"
        );


    const enemyCanvas =
        document.getElementById(
            "battle-enemy"
        );


    drawTungSprite(
        playerCanvas,
        game.player,
        "normal"
    );


    drawTungSprite(
        enemyCanvas,
        enemy,
        "normal"
    );


    function battleMessage(message) {

        const log =
            document.getElementById(
                "battle-log"
            );


        if (!log) return;


        const event =
            document.createElement(
                "div"
            );


        event.className =
            "battle-event";


        event.textContent =
            message;


        log.appendChild(
            event
        );


        log.scrollTop =
            log.scrollHeight;

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
                `${clamp(
                    playerHP /
                    game.player.maxHp *
                    100,
                    0,
                    100
                )}%`;

        }


        if (enemyBar) {

            enemyBar.style.width =
                `${clamp(
                    enemyHP /
                    enemy.maxHp *
                    100,
                    0,
                    100
                )}%`;

        }


        if (playerText) {

            playerText.textContent =
                `${playerHP}/${game.player.maxHp}`;

        }


        if (enemyText) {

            enemyText.textContent =
                `${enemyHP}/${enemy.maxHp}`;

        }


        if (turnText) {

            turnText.textContent =
                playerTurn
                    ? `🟢 ${game.player.name}'S TURN`
                    : `🔴 ${enemy.name}'S TURN`;

        }

    }


    /*
       PLAYER ATTACK
    */

    function playerAttack() {

        if (
            finished
        ) {

            return;

        }


        game.player.spriteRole =
            "attack";


        drawTungSprite(
            playerCanvas,
            game.player,
            "attack"
        );


        battleMessage(
            `⚔️ ${game.player.name} attacks!`
        );


        const rawDamage =
            game.player.power +
            random(0, 5);


        const defenceReduction =
            Math.floor(
                enemy.defence *
                0.35
            );


        const damage =
            Math.max(
                1,
                rawDamage -
                defenceReduction
            );


        enemyHP =
            Math.max(
                0,
                enemyHP -
                damage
            );


        battleMessage(
            `🟢 ${game.player.name} dealt ${damage} damage!`
        );


        setTimeout(
            () => {

                battleMessage(
                    `🔴 ${enemy.name} took ${damage} damage!`
                );


                updateBattleUI();


                if (
                    enemyHP <= 0
                ) {

                    finishBattle(
                        true
                    );


                    return;

                }


                playerTurn =
                    false;


                updateBattleUI();


                setTimeout(
                    enemyAttack,
                    800
                );

            },
            650
        );

    }


    /*
       ENEMY ATTACK
    */

    function enemyAttack() {

        if (
            finished
        ) {

            return;

        }


        enemy.spriteRole =
            "attack";


        drawTungSprite(
            enemyCanvas,
            enemy,
            "attack"
        );


        battleMessage(
            `⚔️ ${enemy.name} attacks!`
        );


        /*
           Speed dodge mechanic.

           Faster players get a chance to dodge.
        */

        const speedDifference =
            game.player.speed -
            enemy.speed;


        let dodgeChance =
            0;


        if (
            speedDifference > 0
        ) {

            dodgeChance =
                Math.min(
                    40,
                    speedDifference *
                    2
                );

        }


        if (
            Math.random() *
            100 <
            dodgeChance
        ) {

            battleMessage(
                `⚡ ${game.player.name} dodged the attack!`
            );


            playerTurn =
                true;


            updateBattleUI();


            setTimeout(
                playerAttack,
                800
            );


            return;

        }


        const rawDamage =
            enemy.power +
            random(0, 5);


        const defenceReduction =
            Math.floor(
                game.player.defence *
                0.35
            );


        const damage =
            Math.max(
                1,
                rawDamage -
                defenceReduction
            );


        playerHP =
            Math.max(
                0,
                playerHP -
                damage
            );


        battleMessage(
            `🔴 ${enemy.name} dealt ${damage} damage!`
        );


        setTimeout(
            () => {

                battleMessage(
                    `🟢 ${game.player.name} took ${damage} damage!`
                );


                game.player.spriteRole =
                    "hurt";


                drawTungSprite(
                    playerCanvas,
                    game.player,
                    "hurt"
                );


                updateBattleUI();


                if (
                    playerHP <= 0
                ) {

                    finishBattle(
                        false
                    );


                    return;

                }


                playerTurn =
                    true;


                updateBattleUI();


                setTimeout(
                    playerAttack,
                    800
                );

            },
            650
        );

    }


    /*
       FINISH BATTLE
    */

    function finishBattle(
        playerWon
    ) {

        if (
            finished
        ) {

            return;

        }


        finished =
            true;


        game.battleInProgress =
            false;


        if (
            playerWon
        ) {

            game.player.wins++;


            game.player.hp =
                Math.max(
                    1,
                    playerHP
                );


            enemy.hp =
                0;


            enemy.lastAction =
                "Defeated";


            enemy.spriteRole =
                "defeat";


            drawTungSprite(
                enemyCanvas,
                enemy,
                "defeat"
            );


            battleMessage(
                `🏆 ${game.player.name} defeated ${enemy.name}!`
            );


            gainXP(40);


            game.player.spriteRole =
                "victory";


            drawTungSprite(
                playerCanvas,
                game.player,
                "victory"
            );

        }
        else {

            game.player.hp =
                1;


            enemy.hp =
                Math.max(
                    1,
                    enemyHP
                );


            battleMessage(
                `❌ ${enemy.name} defeated ${game.player.name}!`
            );


            game.player.spriteRole =
                "defeat";


            drawTungSprite(
                playerCanvas,
                game.player,
                "defeat"
            );

        }


        updateBattleUI();


        setTimeout(
            () => {

                closeModal();


                game.turn =
                    "ai";


                /*
                   Continue the AI round.
                */

                game.aiIndex++;


                game.battleInProgress =
                    false;


                setTimeout(
                    runNextAI,
                    700
                );

            },
            1600
        );

    }


    /*
       Store the active battle so RUN can access it.
    */

    game.currentBattle = {

        enemy: enemy,

        getPlayerHP: () =>
            playerHP,

        getEnemyHP: () =>
            enemyHP,

        isFinished: () =>
            finished,

        getPlayerTurn: () =>
            playerTurn,

        enemyAttack: enemyAttack,

        battleMessage: battleMessage

    };


    /*
       Initial battle message.
    */

    battleMessage(
        `⚔️ ${game.player.name} challenged ${enemy.name}!`
    );


    if (
        game.player.speed >=
        enemy.speed
    ) {

        battleMessage(
            `⚡ ${game.player.name} is faster and attacks first!`
        );

    }
    else {

        battleMessage(
            `⚡ ${enemy.name} is faster and attacks first!`
        );

    }


    updateBattleUI();


    setTimeout(
        () => {

            if (
                playerTurn
            ) {

                playerAttack();

            }
            else {

                enemyAttack();

            }

        },
        900
    );

}


/* ============================================================
   RUN FROM BATTLE
   ============================================================ */

function attemptRun() {

    if (
        !game.battleInProgress
    ) {

        return;

    }


    const battle =
        game.currentBattle;


    if (
        !battle
    ) {

        return;

    }


    if (
        battle.isFinished()
    ) {

        return;

    }


    const player =
        game.player;


    const enemy =
        battle.enemy;


    /*
       Running is available at ANY point.
    */

    battle.battleMessage(
        `🏃 ${player.name} tries to escape!`
    );


    const difference =
        player.speed -
        enemy.speed;


    let chance;


    /*
       Faster = better chance.
    */

    if (
        difference > 0
    ) {

        chance =
            Math.min(
                95,
                60 +
                difference *
                3
            );

    }
    else if (
        difference === 0
    ) {

        chance =
            50;

    }
    else {

        chance =
            Math.max(
                5,
                50 +
                difference *
                3
            );

    }


    /*
       Slight randomness.
    */

    const roll =
        Math.random() *
        100;


    if (
        roll < chance
    ) {

        battle.battleMessage(
            `💨 ${player.name} successfully escaped!`
        );


        game.battleInProgress =
            false;


        game.currentBattle =
            null;


        player.hp =
            Math.max(
                1,
                battle.getPlayerHP()
            );


        closeModal();


        addLog(
            `🏃 ${player.name} escaped from ${enemy.name}!`
        );


        /*
           Running ends the player's action,
           so AI continues.
        */

        game.turn =
            "ai";


        game.aiIndex++;


        setTimeout(
            runNextAI,
            700
        );

    }
    else {

        battle.battleMessage(
            `❌ ${player.name} failed to escape!`
        );


        if (
            player.speed <
            enemy.speed
        ) {

            battle.battleMessage(
                `⚡ ${enemy.name} is faster!`
            );

        }
        else {

            battle.battleMessage(
                `⚡ The escape attempt failed!`
            );

        }


        /*
           Failed escape gives enemy an immediate attack.
        */

        setTimeout(
            battle.enemyAttack,
            800
        );

    }

}


/* ============================================================
   INVENTORY
   ============================================================ */

function openInventory() {

    if (
        game.turn !== "player"
    ) {

        return;

    }


    showModal(

        "🎒 INVENTORY",

        `

        <div class="items">

            <button
                class="item-button"
                onclick="useItem('apple')"
            >

                🍎 Apple

                <span>
                    ${game.inventory.apple}
                </span>

            </button>


            <button
                class="item-button"
                onclick="useItem('potion')"
            >

                ❤️ Health Potion

                <span>
                    ${game.inventory.potion}
                </span>

            </button>


            <button
                class="item-button"
                onclick="useItem('energyDrink')"
            >

                ⚡ Energy Drink

                <span>
                    ${game.inventory.energyDrink}
                </span>

            </button>

        </div>

        `

    );

}


/* ============================================================
   USE ITEM
   ============================================================ */

function useItem(item) {

    if (
        game.turn !== "player"
    ) {

        return;

    }


    if (
        !game.inventory[item] ||
        game.inventory[item] <= 0
    ) {

        addLog(
            "🎒 You don't have that item."
        );


        return;

    }


    let used =
        false;


    if (
        item === "apple"
    ) {

        game.player.hp =
            clamp(
                game.player.hp + 20,
                0,
                game.player.maxHp
            );


        game.inventory.apple--;


        addLog(
            `🍎 ${game.player.name} ate an Apple and recovered HP.`
        );


        used =
            true;

    }


    else if (
        item === "potion"
    ) {

        game.player.hp =
            clamp(
                game.player.hp + 50,
                0,
                game.player.maxHp
            );


        game.inventory.potion--;


        addLog(
            `❤️ ${game.player.name} used a Health Potion.`
        );


        used =
            true;

    }


    else if (
        item === "energyDrink"
    ) {

        game.player.energy =
            clamp(
                game.player.energy + 50,
                0,
                game.player.maxEnergy
            );


        game.inventory.energyDrink--;


        addLog(
            `⚡ ${game.player.name} drank an Energy Drink.`
        );


        used =
            true;

    }


    if (
        used
    ) {

        closeModal();


        finishPlayerTurn();

    }


    updateUI();

}


/* ============================================================
   TRAVEL
   ============================================================ */

function openTravel() {

    if (
        game.turn !== "player"
    ) {

        return;

    }


    showModal(

        "🗺️ TRAVEL",

        `

        <div class="locations">

            <button
                class="location-button"
                onclick="travel('Tung Town')"
            >
                🏠 Tung Town
            </button>


            <button
                class="location-button"
                onclick="travel('Tung Forest')"
            >
                🌲 Tung Forest
            </button>


            <button
                class="location-button"
                onclick="travel('Tung Mountains')"
            >
                ⛰️ Tung Mountains
            </button>


            <button
                class="location-button"
                onclick="travel('Tung Arena')"
            >
                🏟️ Tung Arena
            </button>

        </div>

        `

    );

}


/* ============================================================
   TRAVEL ACTION
   ============================================================ */

function travel(location) {

    if (
        game.turn !== "player"
    ) {

        return;

    }


    game.player.location =
        location;


    game.player.spriteRole =
        "travel";


    addLog(
        `🗺️ ${game.player.name} travelled to ${location}.`
    );


    closeModal();


    finishPlayerTurn();

}


/* ============================================================
   LEADERBOARD SCORE
   ============================================================ */

function scoreFor(tung) {

    return (

        tung.level * 100 +

        tung.wins * 250 +

        tung.power * 5 +

        tung.defence * 5 +

        tung.speed * 5

    );

}


/* ============================================================
   LEADERBOARD
   ============================================================ */

function openLeaderboard() {

    const all =
        [

            {
                ...game.player,
                isPlayer: true
            },

            ...game.ais

        ];


    all.sort(
        (a, b) =>
            scoreFor(b) -
            scoreFor(a)
    );


    const rows =
        all
            .map(
                (tung, index) => {

                    let medal =
                        `${index + 1}.`;


                    if (
                        index === 0
                    ) {

                        medal =
                            "🥇";

                    }
                    else if (
                        index === 1
                    ) {

                        medal =
                            "🥈";

                    }
                    else if (
                        index === 2
                    ) {

                        medal =
                            "🥉";

                    }


                    return `

                    <div class="leaderboard-row">

                        <strong>
                            ${medal}
                        </strong>

                        <span>

                            ${escapeHTML(
                                tung.name
                            )}

                            ${
                                tung.isPlayer
                                    ? " 🟢 YOU"
                                    : ""
                            }

                        </span>

                        <span>
                            Lv ${tung.level}
                        </span>

                        <span>
                            ${scoreFor(tung)}
                        </span>

                    </div>

                    `;

                }
            )
            .join("");


    showModal(

        "🏆 LEADERBOARD",

        `

        <div class="leaderboard">

            <div class="leaderboard-heading">

                <span>Rank</span>
                <span>Name</span>
                <span>Level</span>
                <span>Score</span>

            </div>

            ${rows}

        </div>

        `

    );

}


/* ============================================================
   SAVE GAME
   ============================================================ */

function saveGame() {

    try {

        localStorage.setItem(
            "tungTangleSave",
            JSON.stringify(game)
        );


        addLog(
            "💾 Game saved!"
        );

    }
    catch (error) {

        console.error(error);


        addLog(
            "❌ Could not save the game."
        );

    }

}


/* ============================================================
   LOAD GAME
   ============================================================ */

function loadGame() {

    try {

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


        const loaded =
            JSON.parse(saved);


        /*
           Safe merge.

           This prevents older saves from
           breaking newer versions.
        */

        game.player =
            {

                ...BASE_STATS,

                ...loaded.player

            };


        game.inventory =
            {

                apple: 0,
                potion: 0,
                energyDrink: 0,

                ...(loaded.inventory || {})

            };


        game.ais =
            loaded.ais ||
            [];


        game.log =
            loaded.log ||
            [];


        game.turn =
            "player";


        game.turnNumber =
            loaded.turnNumber ||
            1;


        game.aiIndex =
            0;


        game.battleInProgress =
            false;


        game.currentBattle =
            null;


        checkEvolution();


        addLog(
            "📂 Game loaded!"
        );


        updateUI();

    }
    catch (error) {

        console.error(error);


        addLog(
            "❌ Save file could not be loaded."
        );

    }

}


/* ============================================================
   DRAW SPRITE
   ============================================================ */

function drawTungSprite(
    canvas,
    tung,
    temporaryRole = null
) {

    if (!canvas) return;


    const ctx =
        canvas.getContext(
            "2d"
        );


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    let role =
        temporaryRole ||
        tung.spriteRole ||
        "normal";


    /*
       Evolution always overrides ordinary
       action sprites when necessary.
    */

    if (
        tung.shiny &&
        tung.level >= 10 &&
        !temporaryRole
    ) {

        role =
            "shinyAlpha";

    }
    else if (
        tung.level >= 10 &&
        !temporaryRole
    ) {

        role =
            "alpha";

    }
    else if (
        tung.level >= 5 &&
        !temporaryRole
    ) {

        role =
            "mega";

    }


    const sprite =
        SPRITES[role] ||
        SPRITES.normal;


    if (
        !spriteSheet.complete ||
        spriteSheet.naturalWidth === 0
    ) {

        drawFallbackTung(
            canvas,
            tung,
            role
        );


        return;

    }


    ctx.imageSmoothingEnabled =
        false;


    /*
       32x32 output.

       This is what gives the game
       the pixel-art 32x32 appearance.
    */

    ctx.drawImage(

        spriteSheet,

        sprite.x,
        sprite.y,
        sprite.w,
        sprite.h,

        0,
        0,
        32,
        32

    );

}


/* ============================================================
   FALLBACK SPRITE
   ============================================================ */

function drawFallbackTung(
    canvas,
    tung,
    role
) {

    const ctx =
        canvas.getContext(
            "2d"
        );


    ctx.clearRect(
        0,
        0,
        32,
        32
    );


    ctx.imageSmoothingEnabled =
        false;


    /*
       Simple fallback so the game
       never shows a broken image.
    */

    let body =
        "#9a4d20";


    if (
        role === "mega"
    ) {

        body =
            "#c66b25";

    }


    if (
        role === "alpha"
    ) {

        body =
            "#9a3b1e";

    }


    if (
        role === "shinyAlpha"
    ) {

        body =
            "#ffd83d";

    }


    if (
        role === "speed"
    ) {

        body =
            "#258ac7";

    }


    if (
        role === "power"
    ) {

        body =
            "#d64b28";

    }


    if (
        role === "defence"
    ) {

        body =
            "#7d6b3c";

    }


    ctx.fillStyle =
        body;


    ctx.fillRect(
        9,
        5,
        14,
        22
    );


    ctx.fillStyle =
        "#111";


    ctx.fillRect(
        11,
        10,
        3,
        4
    );


    ctx.fillRect(
        18,
        10,
        3,
        4
    );


    ctx.fillStyle =
        "#fff";


    ctx.fillRect(
        11,
        9,
        3,
        3
    );


    ctx.fillRect(
        18,
        9,
        3,
        3
    );


    ctx.fillStyle =
        "#222";


    ctx.fillRect(
        14,
        22,
        5,
        2
    );

}


/* ============================================================
   UPDATE UI
   ============================================================ */

function updateUI() {

    updatePlayerUI();

    updateAIUI();

    updateLog();

    updateTurnUI();

    updateActionButtons();

}


/* ============================================================
   PLAYER UI
   ============================================================ */

function updatePlayerUI() {

    const p =
        game.player;


    setText(
        "tung-name",
        p.name
    );


    setText(
        "species",
        p.shiny
            ? "✨ Shiny Alpha Tung"
            : p.species
    );


    setText(
        "level",
        p.level
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
        "day",
        p.day
    );


    setText(
        "location",
        p.location
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
        `${p.xp} / 100`
    );


    setBar(
        "hp-bar",
        p.hp /
        p.maxHp *
        100
    );


    setBar(
        "energy-bar",
        p.energy /
        p.maxEnergy *
        100
    );


    setBar(
        "xp-bar",
        p.xp /
        100 *
        100
    );

}


/* ============================================================
   AI UI
   ============================================================ */

function updateAIUI() {

    const list =
        document.getElementById(
            "ai-list"
        );


    if (!list) return;


    list.innerHTML =
        game.ais
            .map(
                (ai, index) => `

                <div
                    class="ai"
                    data-index="${index}"
                >

                    <canvas
                        width="32"
                        height="32"
                        class="ai-sprite"
                    ></canvas>


                    <div class="ai-info">

                        <strong>
                            ${escapeHTML(
                                ai.name
                            )}
                        </strong>

                        <span>
                            ${ai.species}
                            •
                            Lv ${ai.level}
                        </span>


                        <span>
                            ❤️ ${ai.hp}/${ai.maxHp}
                        </span>


                        <span>
                            💪 ${ai.power}
                            🛡️ ${ai.defence}
                            ⚡ ${ai.speed}
                        </span>


                        <small class="ai-action">
                            ${escapeHTML(
                                ai.lastAction ||
                                "Waiting..."
                            )}
                        </small>

                    </div>

                </div>

                `
            )
            .join("");


    /*
       Draw every AI sprite.
    */

    game.ais.forEach(
        (ai, index) => {

            const element =
                document.querySelector(
                    `.ai[data-index="${index}"] canvas`
                );


            if (element) {

                drawTungSprite(
                    element,
                    ai
                );

            }

        }
    );


    highlightAI(
        game.aiIndex
    );

}


/* ============================================================
   TURN UI
   ============================================================ */

function updateTurnUI() {

    if (
        game.turn === "player"
    ) {

        setTurn(
            "player"
        );

    }
    else if (
        game.turn === "ai"
    ) {

        setTurn(
            "ai"
        );

    }

}


/* ============================================================
   ACTION BUTTONS
   ============================================================ */

function updateActionButtons() {

    const buttons =
        document.querySelectorAll(
            ".action-button"
        );


    const enabled =
        game.turn === "player" &&
        !game.battleInProgress;


    buttons.forEach(
        button => {

            button.disabled =
                !enabled;

        }
    );

}


/* ============================================================
   DOM HELPERS
   ============================================================ */

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


function setBar(
    id,
    percent
) {

    const element =
        document.getElementById(id);


    if (!element) return;


    element.style.width =
        `${clamp(
            percent,
            0,
            100
        )}%`;

}


/* ============================================================
   MODAL
   ============================================================ */

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


    if (!modal) return;


    modalTitle.innerHTML =
        title;


    modalBody.innerHTML =
        body;


    modal.classList.remove(
        "hidden"
    );

}


function closeModal() {

    const modal =
        document.getElementById(
            "modal"
        );


    if (!modal) return;


    modal.classList.add(
        "hidden"
    );


    /*
       Do not accidentally end
       an active battle here.
    */

    if (
        !game.battleInProgress
    ) {

        game.currentBattle =
            null;

    }

}


/* ============================================================
   NEW GAME
   ============================================================ */

function newGame() {

    const name =
        prompt(
            "Choose your Tung's name:",
            "Chomper"
        );


    game.player =
        {

            ...BASE_STATS,

            name:
                name &&
                name.trim()
                    ? name
                        .trim()
                        .substring(0, 18)
                    : "Chomper"

        };


    game.inventory =
        {

            apple: 2,

            potion: 1,

            energyDrink: 1

        };


    game.log =
        [];


    game.turn =
        "player";


    game.turnNumber =
        1;


    game.aiIndex =
        0;


    game.battleInProgress =
        false;


    game.currentBattle =
        null;


    createAIs();


    addLog(
        `🐸 Welcome to Tung Tangle, ${game.player.name}!`
    );


    addLog(
        "📊 Every Tung starts with the same base stats."
    );


    addLog(
        "💪 Train your stats to become stronger."
    );


    updateUI();

}


/* ============================================================
   INITIALIZATION
   ============================================================ */

function initGame() {

    if (
        game.initialized
    ) {

        return;

    }


    game.initialized =
        true;


    /*
       Ask for name on first launch.

       If an existing save exists, don't
       overwrite it automatically.
    */

    const existing =
        localStorage.getItem(
            "tungTangleSave"
        );


    if (
        existing
    ) {

        try {

            const saved =
                JSON.parse(
                    existing
                );


            if (
                saved.player &&
                saved.player.name
            ) {

                game.player =
                    {

                        ...BASE_STATS,

                        ...saved.player

                    };


                game.inventory =
                    {

                        apple: 0,

                        potion: 0,

                        energyDrink: 0,

                        ...(saved.inventory || {})

                    };


                game.ais =
                    saved.ais ||
                    [];


                game.log =
                    saved.log ||
                    [];


                game.turn =
                    "player";


                game.turnNumber =
                    saved.turnNumber ||
                    1;


                game.aiIndex =
                    0;


                checkEvolution();


                addLog(
                    "📂 Saved game detected."
                );


                addLog(
                    "🟢 Your turn."
                );


                updateUI();


                return;

            }

        }
        catch (error) {

            console.warn(
                "Save data was invalid."
            );

        }

    }


    newGame();

}


/* ============================================================
   KEYBOARD SHORTCUT
   ============================================================ */

document.addEventListener(
    "keydown",
    event => {

        /*
           Escape closes menus but not
           an active battle.
        */

        if (
            event.key === "Escape" &&
            !game.battleInProgress
        ) {

            closeModal();

        }

    }
);


/* ============================================================
   START
   ============================================================ */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initGame
    );

}
else {

    initGame();

}
