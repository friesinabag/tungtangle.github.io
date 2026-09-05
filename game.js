// ============================================================
// TUNG TANGLE
// Complete game.js
// 32x32 pixel-art sprite system
// ============================================================


// ============================================================
// SPRITE SHEET
// ============================================================

const SPRITE_SHEET = "spritesheet.png";

const spriteImage = new Image();

spriteImage.src = SPRITE_SHEET;


// ============================================================
// SPRITE COORDINATES
// Based on the supplied 1536x1024 sprite sheet
// ============================================================

const SPRITES = {

    // ========================================================
    // EVOLUTION SPRITES
    // ========================================================

    tung: {
        x: 45,
        y: 88,
        w: 65,
        h: 150
    },

    mega: {
        x: 445,
        y: 88,
        w: 78,
        h: 150
    },

    alpha: {
        x: 792,
        y: 72,
        w: 90,
        h: 165
    },

    shiny: {
        x: 1188,
        y: 72,
        w: 90,
        h: 165
    },


    // ========================================================
    // IDLE
    // ========================================================

    idle: [
        {
            x: 48,
            y: 372,
            w: 50,
            h: 95
        },

        {
            x: 128,
            y: 372,
            w: 50,
            h: 95
        },

        {
            x: 210,
            y: 372,
            w: 50,
            h: 95
        },

        {
            x: 292,
            y: 372,
            w: 50,
            h: 95
        }
    ],


    // ========================================================
    // WALK
    // ========================================================

    walk: [
        {
            x: 388,
            y: 372,
            w: 52,
            h: 95
        },

        {
            x: 468,
            y: 372,
            w: 52,
            h: 95
        },

        {
            x: 548,
            y: 372,
            w: 52,
            h: 95
        },

        {
            x: 628,
            y: 372,
            w: 52,
            h: 95
        }
    ],


    // ========================================================
    // ATTACK
    // ========================================================

    attack: [

        {
            x: 695,
            y: 370,
            w: 75,
            h: 100
        },

        {
            x: 785,
            y: 370,
            w: 78,
            h: 100
        },

        {
            x: 875,
            y: 365,
            w: 105,
            h: 105
        }
    ],


    // ========================================================
    // HURT
    // ========================================================

    hurt: {
        x: 1010,
        y: 372,
        w: 75,
        h: 95
    },


    // ========================================================
    // VICTORY
    // ========================================================

    victory: [

        {
            x: 1128,
            y: 372,
            w: 75,
            h: 95
        },

        {
            x: 1210,
            y: 372,
            w: 75,
            h: 95
        }
    ],


    // ========================================================
    // DEFEAT
    // ========================================================

    defeat: [

        {
            x: 1340,
            y: 390,
            w: 95,
            h: 70
        },

        {
            x: 1440,
            y: 390,
            w: 95,
            h: 70
        }
    ],


    // ========================================================
    // ROLE SPRITES
    // ========================================================

    normal: {
        x: 42,
        y: 560,
        w: 115,
        h: 150
    },

    speed: {
        x: 210,
        y: 560,
        w: 115,
        h: 150
    },

    power: {
        x: 390,
        y: 560,
        w: 115,
        h: 150
    },

    defence: {
        x: 565,
        y: 560,
        w: 115,
        h: 150
    },

    explorer: {
        x: 735,
        y: 560,
        w: 115,
        h: 150
    },

    resting: {
        x: 985,
        y: 560,
        w: 115,
        h: 150
    },

    fighter: {
        x: 1170,
        y: 560,
        w: 115,
        h: 150
    },

    travel: {
        x: 1360,
        y: 560,
        w: 115,
        h: 150
    }
};


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
// BASE STATS
// EVERY TUNG STARTS THE SAME
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
// GAME STATE
// ============================================================

const game = {

    player: {

        ...BASE_STATS,

        name: "Chomper",

        species: "Tung",

        spriteRole: "normal",

        shiny: false

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

    round: 1,

    battleInProgress: false

};


// ============================================================
// RANDOM NUMBER
// ============================================================

function random(min, max) {

    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;

}


// ============================================================
// SHUFFLE
// ============================================================

function shuffle(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );

        [
            array[i],
            array[j]
        ] =
        [
            array[j],
            array[i]
        ];

    }

    return array;

}


// ============================================================
// SPECIES
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
// GET EVOLUTION SPRITE
// ============================================================

function getEvolutionSprite(tung) {

    if (tung.shiny && tung.level >= 10) {

        return SPRITES.shiny;

    }

    if (tung.level >= 10) {

        return SPRITES.alpha;

    }

    if (tung.level >= 5) {

        return SPRITES.mega;

    }

    return SPRITES.tung;

}


// ============================================================
// DRAW SPRITE
//
// Everything is rendered onto a 32x32 canvas.
// imageSmoothingEnabled = false keeps the pixel-art look.
// ============================================================

function drawSprite(canvas, sprite) {

    if (!canvas || !sprite) return;

    const ctx =
        canvas.getContext("2d");

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.imageSmoothingEnabled = false;


    if (!spriteImage.complete) {

        spriteImage.onload = () => {

            drawSprite(
                canvas,
                sprite
            );

        };

        return;

    }


    const scale =
        Math.min(

            32 / sprite.w,

            32 / sprite.h

        );


    const width =
        Math.max(
            1,
            Math.round(
                sprite.w * scale
            )
        );


    const height =
        Math.max(
            1,
            Math.round(
                sprite.h * scale
            )
        );


    const x =
        Math.floor(
            (32 - width) / 2
        );


    const y =
        Math.floor(
            (32 - height) / 2
        );


    ctx.drawImage(

        spriteImage,

        sprite.x,
        sprite.y,
        sprite.w,
        sprite.h,

        x,
        y,
        width,
        height

    );

}


// ============================================================
// DRAW EVOLUTION
// ============================================================

function drawEvolutionSprite(
    canvas,
    tung
) {

    drawSprite(
        canvas,
        getEvolutionSprite(tung)
    );

}


// ============================================================
// DRAW ROLE
// ============================================================

function drawRoleSprite(
    canvas,
    role
) {

    const sprite =
        SPRITES[role] ||
        SPRITES.normal;


    drawSprite(
        canvas,
        sprite
    );

}


// ============================================================
// DRAW DEFAULT SPRITE
// ============================================================

function drawTungSprite(
    canvas,
    tung
) {

    if (
        tung.spriteRole &&
        tung.spriteRole !== "normal"
    ) {

        drawRoleSprite(
            canvas,
            tung.spriteRole
        );

    }

    else {

        drawEvolutionSprite(
            canvas,
            tung
        );

    }

}


// ============================================================
// PLAYER NAME
// ============================================================

function chooseName() {

    let name =
        prompt(
            "What do you want to name your Tung?"
        );


    if (
        !name ||
        !name.trim()
    ) {

        name = "Chomper";

    }


    // Limit extremely long names

    name =
        name
            .trim()
            .substring(
                0,
                18
            );


    game.player.name =
        name;

}


// ============================================================
// CREATE AI
// ============================================================

function createAI(name) {

    const ai = {

        ...BASE_STATS,

        name: name,

        species: "Tung",

        spriteRole: "normal",

        shiny:
            Math.random() < 0.03,

        lastAction:
            "Waiting..."

    };


    return ai;

}


// ============================================================
// CREATE NEW ROUND
// RANDOM AI AMOUNT + NAMES
// ============================================================

function createAIs() {

    game.ais = [];


    // Random amount between 5 and 13

    const amount =
        random(
            5,
            AI_NAMES.length
        );


    let names =
        shuffle(
            [...AI_NAMES]
        );


    // If the player chose an AI name,
    // avoid using that name when possible.

    const filtered =
        names.filter(
            name =>
                name.toLowerCase() !==
                game.player.name.toLowerCase()
        );


    if (
        filtered.length >= amount
    ) {

        names = filtered;

    }


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        game.ais.push(
            createAI(
                names[i]
            )
        );

    }

}


// ============================================================
// START GAME
// ============================================================

function startGame() {

    chooseName();

    createAIs();


    addLog(
        `🟫 Welcome, ${game.player.name}!`
    );


    addLog(
        `🏆 ROUND ${game.round} has begun!`
    );


    addLog(
        `🤖 ${game.ais.length} AI Tungs have entered the round!`
    );


    updateUI();

}


// ============================================================
// LOG
// ============================================================

function addLog(message) {

    game.log.unshift(
        message
    );


    if (
        game.log.length > 100
    ) {

        game.log.pop();

    }


    updateLog();

}


// ============================================================
// UPDATE LOG
// ============================================================

function updateLog() {

    const log =
        document.getElementById(
            "log"
        );


    if (!log) return;


    log.innerHTML =
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
        `⭐ ${game.player.name} gained ${amount} XP!`
    );


    while (
        game.player.xp >=
        game.player.xpNeeded
    ) {

        game.player.xp -=
            game.player.xpNeeded;

        levelUp();

    }


    updateUI();

}


// ============================================================
// LEVEL UP
// ============================================================

function levelUp() {

    const oldSpecies =
        game.player.species;


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
            game.player.xpNeeded *
            1.25
        );


    game.player.species =
        getSpecies(
            game.player.level
        );


    addLog(
        `🎉 LEVEL UP! ${game.player.name} is now level ${game.player.level}!`
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

        return;

    }


    if (
        game.battleInProgress
    ) {

        return;

    }


    if (
        action === "fight"
    ) {

        openFight();

        return;

    }


    let success = true;


    switch(action) {

        case "explore":

            success =
                playerExplore();

            break;


        case "power":

            success =
                playerTrain(
                    "power"
                );

            break;


        case "defence":

            success =
                playerTrain(
                    "defence"
                );

            break;


        case "speed":

            success =
                playerTrain(
                    "speed"
                );

            break;


        case "rest":

            playerRest();

            break;

    }


    if (
        success !== false
    ) {

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


    game.player.spriteRole =
        "explorer";


    const roll =
        Math.random();


    if (
        roll < 0.4
    ) {

        const xp =
            random(
                10,
                30
            );


        gainXP(xp);


        addLog(
            `🌲 ${game.player.name} explored and found ${xp} XP!`
        );

    }

    else if (
        roll < 0.65
    ) {

        game.inventory.apple++;


        addLog(
            `🍎 ${game.player.name} found an Apple!`
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


    game.player.spriteRole =
        stat;


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


    game.player.spriteRole =
        "resting";


    addLog(
        `💤 ${game.player.name} rested and recovered!`
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
        "🤖 The AI Tungs are taking their turns..."
    );


    setTimeout(
        runNextAI,
        700
    );

}


// ============================================================
// RUN NEXT AI
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


    game.turn = "ai";


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
        500
    );

}


// ============================================================
// AI TURN
// ============================================================

function aiTakeTurn(ai) {

    const roll =
        Math.random();


    if (
        roll < 0.22
    ) {

        ai.power++;

        ai.spriteRole =
            "power";

        ai.lastAction =
            "Trained Power";


        addLog(
            `🤖 ${ai.name} trained Power!`
        );


        return;

    }


    if (
        roll < 0.42
    ) {

        ai.defence++;

        ai.spriteRole =
            "defence";

        ai.lastAction =
            "Trained Defence";


        addLog(
            `🤖 ${ai.name} trained Defence!`
        );


        return;

    }


    if (
        roll < 0.58
    ) {

        ai.speed++;

        ai.spriteRole =
            "speed";

        ai.lastAction =
            "Trained Speed";


        addLog(
            `🤖 ${ai.name} trained Speed!`
        );


        return;

    }


    if (
        roll < 0.76
    ) {

        const xp =
            random(
                5,
                20
            );


        ai.xp += xp;

        ai.spriteRole =
            "explorer";

        ai.lastAction =
            `Explored +${xp} XP`;


        addLog(
            `🤖 ${ai.name} explored and gained ${xp} XP!`
        );


        return;

    }


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


    ai.spriteRole =
        "resting";


    ai.lastAction =
        "Rested";


    addLog(
        `🤖 ${ai.name} rested.`
    );

}


// ============================================================
// FINISH ALL AI TURNS
// START NEW ROUND
// ============================================================

function finishAITurns() {

    game.turn = "player";

    game.aiIndex = 0;

    game.turnNumber++;

    game.round++;


    addLog(
        `🏆 ROUND ${game.round - 1} complete!`
    );


    // Create completely new AI lineup

    createAIs();


    addLog(
        `🔄 ROUND ${game.round} begins!`
    );


    addLog(
        `🤖 ${game.ais.length} new AI Tungs have entered!`
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
        (ai,index) => {

            html += `

                <button
                    class="rival"
                    onclick="startFight(${index})"
                >

                    <span class="rival-name">

                        ${ai.shiny ? "✨ " : ""}

                        ${ai.name}

                    </span>

                    <br>

                    ❤️ ${ai.hp}/${ai.maxHp}

                    <br>

                    💪 ${ai.power}

                    &nbsp;

                    🛡️ ${ai.defence}

                    &nbsp;

                    ⚡ ${ai.speed}

                    <br><br>

                    LEVEL ${ai.level}

                </button>

            `;

        }
    );


    html +=
        `</div>`;


    showModal(
        "⚔️ CHOOSE YOUR OPPONENT",
        html
    );

}


// ============================================================
// START BATTLE
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
    ) {

        return;

    }


    closeModal();


    game.turn =
        "fight";

    game.battleInProgress =
        true;


    game.player.spriteRole =
        "fighter";


    updateUI();


    const playerHP =
        game.player.hp;


    const enemyHP =
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

                <div class="battle-fighter">

                    <canvas
                        id="battle-player"
                        width="32"
                        height="32"
                    ></canvas>

                    <div class="battle-name player-name">

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

                    <div class="battle-name enemy-name">

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
                ⚔️ BATTLE STARTING...
            </div>


            <div
                id="battle-log"
                class="battle-log"
            ></div>

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


    drawEvolutionSprite(
        playerCanvas,
        game.player
    );


    drawEvolutionSprite(
        enemyCanvas,
        enemy
    );


    let currentPlayerHP =
        playerHP;


    let currentEnemyHP =
        enemyHP;


    let playerTurn =
        true;


    let finished =
        false;


    const battleLog =
        document.getElementById(
            "battle-log"
        );


    // ========================================================
    // BATTLE MESSAGE
    // ========================================================

    function battleMessage(message) {

        if (!battleLog) return;


        const event =
            document.createElement(
                "div"
            );


        event.className =
            "battle-event";


        event.textContent =
            message;


        battleLog.appendChild(
            event
        );


        battleLog.scrollTop =
            battleLog.scrollHeight;

    }


    // ========================================================
    // UPDATE BATTLE UI
    // ========================================================

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
                    currentPlayerHP /
                    playerMax *
                    100
                )}%`;

        }


        if (enemyBar) {

            enemyBar.style.width =
                `${Math.max(
                    0,
                    currentEnemyHP /
                    enemyMax *
                    100
                )}%`;

        }


        if (playerText) {

            playerText.textContent =
                `${currentPlayerHP}/${playerMax}`;

        }


        if (enemyText) {

            enemyText.textContent =
                `${currentEnemyHP}/${enemyMax}`;

        }


        if (turnText) {

            turnText.textContent =
                playerTurn
                    ? `🟢 ${game.player.name}'s turn`
                    : `🔴 ${enemy.name}'s turn`;

        }

    }


    // ========================================================
    // ATTACK ANIMATION
    // ========================================================

    function playAttack(
        canvas,
        callback
    ) {

        const frames =
            SPRITES.attack;


        let frame =
            0;


        function next() {

            if (!canvas) {

                callback();

                return;

            }


            drawSprite(
                canvas,
                frames[frame]
            );


            frame++;


            if (
                frame <
                frames.length
            ) {

                setTimeout(
                    next,
                    180
                );

            }

            else {

                setTimeout(
                    callback,
                    120
                );

            }

        }


        next();

    }


    // ========================================================
    // HURT ANIMATION
    // ========================================================

    function playHurt(
        canvas,
        tung,
        callback
    ) {

        drawSprite(
            canvas,
            SPRITES.hurt
        );


        setTimeout(
            () => {

                drawEvolutionSprite(
                    canvas,
                    tung
                );


                if (callback) {

                    callback();

                }

            },
            350
        );

    }


    // ========================================================
    // PLAYER ATTACK
    // ========================================================

    function playerAttack() {

        if (finished) return;


        const damage =
            Math.max(

                1,

                game.player.power -

                Math.floor(
                    enemy.defence / 2
                ) +

                random(
                    0,
                    5
                )

            );


        playAttack(

            playerCanvas,

            () => {

                currentEnemyHP =
                    Math.max(
                        0,
                        currentEnemyHP -
                        damage
                    );


                battleMessage(
                    `🟢 ${game.player.name} dealt ${damage} damage!`
                );


                updateBattleUI();


                setTimeout(
                    () => {

                        battleMessage(
                            `🔴 ${enemy.name} took ${damage} damage!`
                        );


                        playHurt(
                            enemyCanvas,
                            enemy
                        );


                        updateBattleUI();


                        if (
                            currentEnemyHP <=
                            0
                        ) {

                            setTimeout(
                                finishBattle,
                                500
                            );

                            return;

                        }


                        playerTurn =
                            false;


                        updateBattleUI();


                        setTimeout(
                            enemyAttack,
                            600
                        );

                    },
                    400
                );

            }

        );

    }


    // ========================================================
    // ENEMY ATTACK
    // ========================================================

    function enemyAttack() {

        if (finished) return;


        const damage =
            Math.max(

                1,

                enemy.power -

                Math.floor(
                    game.player.defence / 2
                ) +

                random(
                    0,
                    5
                )

            );


        playAttack(

            enemyCanvas,

            () => {

                currentPlayerHP =
                    Math.max(
                        0,
                        currentPlayerHP -
                        damage
                    );


                battleMessage(
                    `🔴 ${enemy.name} dealt ${damage} damage!`
                );


                updateBattleUI();


                setTimeout(
                    () => {

                        battleMessage(
                            `🟢 ${game.player.name} took ${damage} damage!`
                        );


                        playHurt(
                            playerCanvas,
                            game.player
                        );


                        updateBattleUI();


                        if (
                            currentPlayerHP <=
                            0
                        ) {

                            setTimeout(
                                finishBattle,
                                500
                            );

                            return;

                        }


                        playerTurn =
                            true;


                        updateBattleUI();


                        setTimeout(
                            playerAttack,
                            600
                        );

                    },
                    400
                );

            }

        );

    }


    // ========================================================
    // FINISH BATTLE
    // ========================================================

    function finishBattle() {

        if (finished) return;


        finished =
            true;


        game.battleInProgress =
            false;


        // ====================================================
        // PLAYER WINS
        // ====================================================

        if (
            currentEnemyHP <=
            0
        ) {

            game.player.wins++;


            game.player.hp =
                Math.max(
                    1,
                    currentPlayerHP
                );


            enemy.hp =
                0;


            battleMessage(
                `🏆 ${enemy.name} was defeated!`
            );


            battleMessage(
                `⭐ ${game.player.name} WON THE BATTLE!`
            );


            game.player.xp +=
                40;


            battleMessage(
                `⭐ ${game.player.name} gained 40 XP!`
            );


            while (
                game.player.xp >=
                game.player.xpNeeded
            ) {

                game.player.xp -=
                    game.player.xpNeeded;

                levelUp();

            }


            drawSprite(
                playerCanvas,
                SPRITES.victory[0]
            );


            setTimeout(
                () => {

                    showResult(
                        true,
                        enemy.name
                    );

                },
                1000
            );


        }

        // ====================================================
        // PLAYER LOSES
        // ====================================================

        else {

            game.player.hp =
                Math.max(
                    1,
                    currentPlayerHP
                );


            enemy.hp =
                enemyMax;


            battleMessage(
                `❌ ${game.player.name} lost the battle.`
            );


            drawSprite(
                playerCanvas,
                SPRITES.defeat[0]
            );


            setTimeout(
                () => {

                    showResult(
                        false,
                        enemy.name
                    );

                },
                1000
            );

        }

    }


    // ========================================================
    // START BATTLE
    // ========================================================

    updateBattleUI();


    battleMessage(
        `⚔️ ${game.player.name} VS ${enemy.name}!`
    );


    setTimeout(
        playerAttack,
        800
    );

}


// ============================================================
// BATTLE RESULT
// ============================================================

function showResult(
    won,
    enemyName
) {

    if (won) {

        showModal(

            "🏆 VICTORY!",

            `

            <div class="result">

                <div class="result-title">
                    VICTORY!
                </div>

                <p>
                    🟫 ${game.player.name}
                    defeated
                    ${enemyName}!
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

    else {

        showModal(

            "❌ DEFEAT",

            `

            <div class="result">

                <div
                    class="result-title"
                    style="color:#ef5555"
                >
                    DEFEAT
                </div>

                <p>
                    ${enemyName}
                    won this battle.
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

}


// ============================================================
// END BATTLE
// ============================================================

function endBattle() {

    closeModal();


    game.turn =
        "ai";


    game.aiIndex =
        0;


    game.battleInProgress =
        false;


    addLog(
        "🤖 The AI Tungs are taking their turns..."
    );


    updateUI();


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

        "🎒 INVENTORY",

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


// ============================================================
// USE ITEM
// ============================================================

function useItem(item) {

    if (
        game.turn !== "player"
    ) return;


    if (
        !game.inventory[item] ||
        game.inventory[item] <= 0
    ) {

        addLog(
            "❌ You don't have that item!"
        );

        return;

    }


    if (
        item === "apple"
    ) {

        const before =
            game.player.hp;


        game.player.hp =
            Math.min(
                game.player.maxHp,
                game.player.hp + 25
            );


        const recovered =
            game.player.hp -
            before;


        game.inventory.apple--;


        addLog(
            `🍎 ${game.player.name} recovered ${recovered} HP!`
        );

    }


    if (
        item === "energyDrink"
    ) {

        const before =
            game.player.energy;


        game.player.energy =
            Math.min(
                game.player.maxEnergy,
                game.player.energy + 40
            );


        const recovered =
            game.player.energy -
            before;


        game.inventory.energyDrink--;


        addLog(
            `⚡ ${game.player.name} recovered ${recovered} Energy!`
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

        "🗺️ TRAVEL",

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


// ============================================================
// TRAVEL
// ============================================================

function travel(location) {

    if (
        game.turn !== "player"
    ) return;


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


// ============================================================
// LEADERBOARD SCORE
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


// ============================================================
// LEADERBOARD
// ============================================================

function openLeaderboard() {

    const everyone = [

        game.player,

        ...game.ais

    ];


    everyone.sort(
        (a,b) =>
            scoreFor(b) -
            scoreFor(a)
    );


    let html = "";


    everyone.forEach(
        (tung,index) => {

            let medal;


            if (
                index === 0
            ) {

                medal = "🥇";

            }

            else if (
                index === 1
            ) {

                medal = "🥈";

            }

            else if (
                index === 2
            ) {

                medal = "🥉";

            }

            else {

                medal =
                    `${index + 1}.`;

            }


            html += `

                <div
                    class="leaderboard-row"
                >

                    <strong>

                        ${medal}

                        ${tung.shiny ? "✨ " : ""}

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

        `🏆 LEADERBOARD — ROUND ${game.round}`,

        html

    );

}


// ============================================================
// SAVE GAME
// ============================================================

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

    catch {

        addLog(
            "❌ Could not save the game."
        );

    }

}


// ============================================================
// LOAD GAME
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


        if (
            loaded.player
        ) {

            game.player =
                {

                    ...BASE_STATS,

                    ...game.player,

                    ...loaded.player

                };

        }


        if (
            loaded.inventory
        ) {

            game.inventory =
                {

                    ...game.inventory,

                    ...loaded.inventory

                };

        }


        if (
            Array.isArray(
                loaded.ais
            )
        ) {

            game.ais =
                loaded.ais;

        }


        if (
            Array.isArray(
                loaded.log
            )
        ) {

            game.log =
                loaded.log;

        }


        game.turn =
            loaded.turn ||
            "player";


        game.turnNumber =
            loaded.turnNumber ||
            1;


        game.aiIndex =
            loaded.aiIndex ||
            0;


        game.round =
            loaded.round ||
            1;


        game.battleInProgress =
            false;


        addLog(
            "📂 Game loaded!"
        );


        updateUI();

    }

    catch {

        addLog(
            "❌ The save file is corrupted."
        );

    }

}


// ============================================================
// UPDATE UI
// ============================================================

function updateUI() {

    const p =
        game.player;


    const name =
        document.getElementById(
            "tung-name"
        );


    const species =
        document.getElementById(
            "species"
        );


    const level =
        document.getElementById(
            "level"
        );


    if (name) {

        name.textContent =
            p.name;

    }


    if (species) {

        species.textContent =
            p.shiny && p.level >= 10
                ? "✨ Shiny Alpha Tung"
                : getSpecies(p.level);

    }


    if (level) {

        level.textContent =
            p.level;

    }


    const hpText =
        document.getElementById(
            "hp-text"
        );


    const energyText =
        document.getElementById(
            "energy-text"
        );


    const xpText =
        document.getElementById(
            "xp-text"
        );


    if (hpText) {

        hpText.textContent =
            `${p.hp} / ${p.maxHp}`;

    }


    if (energyText) {

        energyText.textContent =
            `${p.energy} / ${p.maxEnergy}`;

    }


    if (xpText) {

        xpText.textContent =
            `${p.xp} / ${p.xpNeeded}`;

    }


    const power =
        document.getElementById(
            "power"
        );


    const defence =
        document.getElementById(
            "defence"
        );


    const speed =
        document.getElementById(
            "speed"
        );


    const wins =
        document.getElementById(
            "wins"
        );


    if (power)
        power.textContent =
            p.power;


    if (defence)
        defence.textContent =
            p.defence;


    if (speed)
        speed.textContent =
            p.speed;


    if (wins)
        wins.textContent =
            p.wins;


    const location =
        document.getElementById(
            "location"
        );


    const round =
        document.getElementById(
            "round"
        );


    const turnNumber =
        document.getElementById(
            "turn-number"
        );


    if (location)
        location.textContent =
            p.location;


    if (round)
        round.textContent =
            game.round;


    if (turnNumber)
        turnNumber.textContent =
            game.turnNumber;


    // ========================================================
    // BARS
    // ========================================================

    const hpBar =
        document.getElementById(
            "hp-bar"
        );


    const energyBar =
        document.getElementById(
            "energy-bar"
        );


    const xpBar =
        document.getElementById(
            "xp-bar"
        );


    if (hpBar) {

        hpBar.style.width =
            `${Math.max(
                0,
                p.hp /
                p.maxHp *
                100
            )}%`;

    }


    if (energyBar) {

        energyBar.style.width =
            `${Math.max(
                0,
                p.energy /
                p.maxEnergy *
                100
            )}%`;

    }


    if (xpBar) {

        xpBar.style.width =
            `${Math.max(
                0,
                p.xp /
                p.xpNeeded *
                100
            )}%`;

    }


    // ========================================================
    // PLAYER SPRITE
    // ========================================================

    const playerCanvas =
        document.getElementById(
            "player-sprite"
        );


    if (playerCanvas) {

        drawTungSprite(
            playerCanvas,
            p
        );

    }


    // ========================================================
    // TURN PANEL
    // ========================================================

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


    if (
        game.turn === "player"
    ) {

        if (panel)
            panel.className =
                "turn-panel turn-player";


        if (icon)
            icon.textContent =
                "🟢";


        if (title)
            title.textContent =
                "YOUR TURN";


        if (description)
            description.textContent =
                "Choose an action.";

    }

    else if (
        game.turn === "ai"
    ) {

        if (panel)
            panel.className =
                "turn-panel turn-ai";


        if (icon)
            icon.textContent =
                "🤖";


        const ai =
            game.ais[
                game.aiIndex
            ];


        if (ai) {

            if (title)
                title.textContent =
                    `${ai.name.toUpperCase()}'S TURN`;


            if (description)
                description.textContent =
                    "The AI is choosing an action.";

        }

    }

    else {

        if (panel)
            panel.className =
                "turn-panel turn-ai";


        if (icon)
            icon.textContent =
                "⚔️";


        if (title)
            title.textContent =
                "BATTLE";


        if (description)
            description.textContent =
                "A battle is taking place.";

    }


    // ========================================================
    // DISABLE ACTION BUTTONS
    // ========================================================

    document
        .querySelectorAll(
            ".action-button"
        )
        .forEach(
            button => {

                button.disabled =
                    game.turn !== "player" ||
                    game.battleInProgress;

            }
        );


    // ========================================================
    // AI COUNT
    // ========================================================

    const aiCount =
        document.getElementById(
            "ai-count"
        );


    if (aiCount) {

        aiCount.textContent =
            `(${game.ais.length})`;

    }


    // ========================================================
    // AI LIST
    // ========================================================

    const aiList =
        document.getElementById(
            "ai-list"
        );


    if (!aiList) return;


    aiList.innerHTML =
        game.ais
            .map(
                (ai,index) => {

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

                                    ${ai.shiny ? "✨ " : ""}

                                    ${ai.name}

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


    // ========================================================
    // DRAW AI SPRITES
    // ========================================================

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


                if (!ai) return;


                drawTungSprite(
                    canvas,
                    ai
                );

            }
        );


    updateLog();

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


    if (!modal) return;


    modalTitle.textContent =
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


    if (modal) {

        modal.classList.add(
            "hidden"
        );

    }

}


// ============================================================
// SPRITE SHEET ERROR CHECK
// ============================================================

spriteImage.onerror = () => {

    console.error(
        "TUNG TANGLE: spritesheet.png could not be loaded."
    );


    addLog(
        "❌ ERROR: spritesheet.png could not be found."
    );

};


// ============================================================
// START WHEN IMAGE IS READY
// ============================================================

spriteImage.onload = () => {

    startGame();

};
