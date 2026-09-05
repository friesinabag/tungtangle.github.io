/* =========================================================
   TUNG TANGLE
   COMPLETE GAME.JS
   ========================================================= */


/* =========================================================
   SETTINGS
   ========================================================= */

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

const MIN_AIS = 5;


/* =========================================================
   BASE STATS
   ========================================================= */

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


/* =========================================================
   GAME STATE
   ========================================================= */

const game = {

    player: {
        ...BASE_STATS,
        name: "Chomper"
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

    gameOver: false,

    initialized: false

};


/* =========================================================
   SPRITE SHEET
   ========================================================= */

const spriteSheet = new Image();

spriteSheet.src = SPRITE_SHEET;


/*
   These are crops from the exact sprite sheet.

   The sheet is 1536 x 1024.

   Every crop gets drawn onto a 32 x 32 canvas.
*/

const SPRITES = {

    /* Base / normal */

    normal: {
        x: 38,
        y: 550,
        w: 78,
        h: 172
    },


    /* Training roles */

    speed: {
        x: 205,
        y: 550,
        w: 105,
        h: 172
    },

    power: {
        x: 398,
        y: 550,
        w: 120,
        h: 172
    },

    defence: {
        x: 580,
        y: 550,
        w: 125,
        h: 172
    },

    explorer: {
        x: 770,
        y: 550,
        w: 125,
        h: 172
    },

    resting: {
        x: 955,
        y: 550,
        w: 130,
        h: 172
    },

    fighter: {
        x: 1145,
        y: 550,
        w: 135,
        h: 172
    },

    travel: {
        x: 1345,
        y: 550,
        w: 130,
        h: 172
    },


    /* Evolution */

    mega: {
        x: 425,
        y: 68,
        w: 115,
        h: 180
    },

    alpha: {
        x: 785,
        y: 62,
        w: 120,
        h: 185
    },

    shinyAlpha: {
        x: 1175,
        y: 62,
        w: 125,
        h: 185
    },


    /* Battle animations */

    attack: {
        x: 665,
        y: 355,
        w: 100,
        h: 125
    },

    hurt: {
        x: 995,
        y: 355,
        w: 105,
        h: 125
    },

    victory: {
        x: 1120,
        y: 355,
        w: 105,
        h: 125
    },

    defeat: {
        x: 1340,
        y: 355,
        w: 120,
        h: 125
    },

    idle: {
        x: 35,
        y: 355,
        w: 330,
        h: 125
    }

};


/* =========================================================
   RANDOM HELPERS
   ========================================================= */

function random(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}


function randomChoice(array) {

    return array[
        Math.floor(
            Math.random() * array.length
        )
    ];

}


function clamp(value, min, max) {

    return Math.max(
        min,
        Math.min(max, value)
    );

}


function sleep(ms) {

    return new Promise(
        resolve => setTimeout(resolve, ms)
    );

}


/* =========================================================
   NAME
   ========================================================= */

function choosePlayerName() {

    let name = prompt(
        "Choose your Tung's name:",
        game.player.name
    );


    if (
        name === null ||
        name.trim() === ""
    ) {

        return;

    }


    game.player.name =
        name
            .trim()
            .substring(0, 18);


    addLog(
        `🐸 Your Tung is called ${game.player.name}!`
    );


    updateUI();

}


/* =========================================================
   AI CREATION
   ========================================================= */

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


/* =========================================================
   CREATE AI ROSTER
   ========================================================= */

function createAIs() {

    /*
       IMPORTANT:

       This is only called when a NEW GAME starts.

       It is NOT called every round.
    */


    game.ais = [];


    const amount = random(
        MIN_AIS,
        AI_NAMES.length
    );


    const names = [
        ...AI_NAMES
    ].sort(
        () => Math.random() - 0.5
    );


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


    addLog(
        `🤖 ${amount} rival Tungs have entered the game!`
    );


    updateUI();

}


/* =========================================================
   LOG
   ========================================================= */

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


function updateLog() {

    const log =
        document.getElementById("log");


    if (!log) return;


    log.innerHTML =
        game.log
            .slice(0, 40)
            .map(
                message =>
                    `<div class="log-entry">${escapeHTML(message)}</div>`
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


/* =========================================================
   TURN DISPLAY
   ========================================================= */

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

            icon.textContent =
                "🟢";

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


        const ai =
            game.ais[
                game.aiIndex
            ];


        if (icon) {

            icon.textContent =
                "🤖";

        }


        if (title) {

            title.textContent =
                ai
                    ? `${ai.name.toUpperCase()}'S TURN`
                    : "AI TURN";

        }


        if (description) {

            description.textContent =
                "The rival Tungs are acting.";

        }

    }

}


/* =========================================================
   ENERGY
   ========================================================= */

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


/* =========================================================
   XP
   ========================================================= */

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


/* =========================================================
   LEVEL UP
   ========================================================= */

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


/* =========================================================
   EVOLUTION
   ========================================================= */

function checkEvolution() {

    if (
        game.player.level >= 10
    ) {

        game.player.species =
            "Alpha Tung";


        game.player.spriteRole =
            game.player.shiny
                ? "shinyAlpha"
                : "alpha";


        if (
            !game.player.shiny &&
            Math.random() < 0.08
        ) {

            game.player.shiny =
                true;


            game.player.spriteRole =
                "shinyAlpha";


            addLog(
                `✨ ${game.player.name} became a SHINY ALPHA TUNG!`
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

    }

    else {

        game.player.species =
            "Tung";


        if (
            ![
                "power",
                "defence",
                "speed",
                "explorer",
                "resting",
                "fighter",
                "travel"
            ].includes(
                game.player.spriteRole
            )
        ) {

            game.player.spriteRole =
                "normal";

        }

    }

}


/* =========================================================
   PLAYER ACTION
   ========================================================= */

function playerAction(action) {

    if (
        game.turn !== "player"
    ) {

        return;

    }


    if (
        game.battleInProgress ||
        game.gameOver
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

    }


    if (
        successful
    ) {

        finishPlayerTurn();

    }

}


/* =========================================================
   TRAINING
   ========================================================= */

function playerTrain(stat) {

    if (
        !spendEnergy(15)
    ) {

        return false;

    }


    /*
       RANDOM +1 TO +15
    */

    const increase =
        random(1, 15);


    game.player[stat] +=
        increase;


    game.player.spriteRole =
        stat;


    gainXP(10);


    const name =
        stat
            .charAt(0)
            .toUpperCase() +
        stat.slice(1);


    addLog(
        `💪 ${game.player.name} trained ${name} and gained +${increase}!`
    );


    return true;

}


/* =========================================================
   EXPLORE
   ========================================================= */

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
            `🌲 ${game.player.name} found an Apple!`
        );

    }

    else if (
        roll < 0.4
    ) {

        game.inventory.potion++;


        addLog(
            `🌲 ${game.player.name} found a Health Potion!`
        );

    }

    else if (
        roll < 0.5
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


/* =========================================================
   REST
   ========================================================= */

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
        `💤 ${game.player.name} recovered ${hp} HP and ${energy} Energy.`
    );


    return true;

}


/* =========================================================
   PLAYER TURN FINISH
   ========================================================= */

function finishPlayerTurn() {

    if (
        game.gameOver
    ) {

        return;

    }


    game.aiIndex =
        0;


    setTurn(
        "ai"
    );


    addLog(
        "🤖 AI TURN BEGINS..."
    );


    updateUI();


    setTimeout(
        runNextAI,
        700
    );

}


/* =========================================================
   AI TURN LOOP
   ========================================================= */

function runNextAI() {

    /*
       ALL AI HAVE ACTED
    */

    if (
        game.aiIndex >=
        game.ais.length
    ) {

        finishAITurns();

        return;

    }


    /*
       Find next living AI.

       Defeated AIs remain in the roster.
    */

    while (
        game.aiIndex <
        game.ais.length &&
        game.ais[
            game.aiIndex
        ].hp <= 0
    ) {

        game.aiIndex++;

    }


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


    setTurn(
        "ai"
    );


    highlightAI(
        game.aiIndex
    );


    addLog(
        `🤖 ${ai.name}'s turn.`
    );


    updateUI();


    setTimeout(
        () => {

            aiTakeTurn(
                ai
            );

        },
        600
    );

}


/* =========================================================
   AI TURN
   ========================================================= */

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
       18% chance to attack YOU.

       THIS NOW ACTUALLY OPENS A BATTLE.
    */

    if (
        roll < 0.18
    ) {

        ai.spriteRole =
            "fighter";


        ai.lastAction =
            "Attacking YOU";


        addLog(
            `⚔️ ${ai.name} attacked ${game.player.name}!`
        );


        updateUI();


        startAIAttack(
            ai
        );


        return;

    }


    /*
       TRAIN POWER
    */

    if (
        roll < 0.38
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
            `💪 ${ai.name} gained +${increase} Power.`
        );

    }


    /*
       TRAIN DEFENCE
    */

    else if (
        roll < 0.56
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
            `🛡️ ${ai.name} gained +${increase} Defence.`
        );

    }


    /*
       TRAIN SPEED
    */

    else if (
        roll < 0.74
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
            `⚡ ${ai.name} gained +${increase} Speed.`
        );

    }


    /*
       EXPLORE
    */

    else if (
        roll < 0.88
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
            `🌲 ${ai.name} explored and gained ${xp} XP.`
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
            `💤 ${ai.name} rested.`
        );

    }


    updateUI();


    game.aiIndex++;


    setTimeout(
        runNextAI,
        850
    );

}


/* =========================================================
   AI LEVEL UP
   ========================================================= */

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


/* =========================================================
   AI ATTACK
   ========================================================= */

function startAIAttack(ai) {

    if (
        game.gameOver
    ) {

        return;

    }


    /*
       AI attacks the player.

       The battle screen opens immediately.
    */

    game.battleInProgress =
        true;


    game.turn =
        "battle";


    startBattle(
        ai,
        true
    );

}


/* =========================================================
   FIGHT MENU
   ========================================================= */

function openFight() {

    if (
        game.turn !== "player" ||
        game.battleInProgress ||
        game.gameOver
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
            "🏆 There are no rivals left!"
        );


        playerGameWin();


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
                            • 💪 ${ai.power}
                            • 🛡️ ${ai.defence}
                            • ⚡ ${ai.speed}
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


/* =========================================================
   PLAYER STARTS FIGHT
   ========================================================= */

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


    startBattle(
        enemy,
        false
    );

}


/* =========================================================
   BATTLE ENGINE
   ========================================================= */

function startBattle(
    enemy,
    aiStarted
) {

    let playerHP =
        game.player.hp;


    let enemyHP =
        enemy.hp;


    let finished =
        false;


    /*
       Faster Tung goes first.

       If equal speed, player goes first.
    */

    let playerTurn =
        game.player.speed >=
        enemy.speed;


    showBattleScreen(
        enemy
    );


    const battleMessage =
        message => {

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

        };


    const updateBattle =
        () => {

            const pBar =
                document.getElementById(
                    "battle-player-bar"
                );


            const eBar =
                document.getElementById(
                    "battle-enemy-bar"
                );


            const pText =
                document.getElementById(
                    "battle-player-text"
                );


            const eText =
                document.getElementById(
                    "battle-enemy-text"
                );


            const turn =
                document.getElementById(
                    "battle-turn"
                );


            if (pBar) {

                pBar.style.width =
                    `${clamp(
                        playerHP /
                        game.player.maxHp *
                        100,
                        0,
                        100
                    )}%`;

            }


            if (eBar) {

                eBar.style.width =
                    `${clamp(
                        enemyHP /
                        enemy.maxHp *
                        100,
                        0,
                        100
                    )}%`;

            }


            if (pText) {

                pText.textContent =
                    `${playerHP}/${game.player.maxHp}`;

            }


            if (eText) {

                eText.textContent =
                    `${enemyHP}/${enemy.maxHp}`;

            }


            if (turn) {

                turn.textContent =
                    playerTurn
                        ? `🟢 ${game.player.name}'S TURN`
                        : `🔴 ${enemy.name}'S TURN`;

            }

        };


    /*
       PLAYER ATTACK
    */

    async function playerAttack() {

        if (
            finished
        ) {

            return;

        }


        playerTurn =
            true;


        updateBattle();


        setBattleSprite(
            "battle-player",
            game.player,
            "attack"
        );


        battleMessage(
            `⚔️ ${game.player.name} attacks ${enemy.name}!`
        );


        await sleep(550);


        /*
           Speed can also produce an attack dodge.
        */

        const speedDifference =
            game.player.speed -
            enemy.speed;


        let dodgeChance =
            0;


        if (
            speedDifference < 0
        ) {

            dodgeChance =
                Math.min(
                    30,
                    Math.abs(
                        speedDifference
                    ) * 1.5
                );

        }


        if (
            Math.random() * 100 <
            dodgeChance
        ) {

            battleMessage(
                `⚡ ${enemy.name} dodged the attack!`
            );


            setBattleSprite(
                "battle-enemy",
                enemy,
                "hurt"
            );


            await sleep(700);


            enemyTurn();

            return;

        }


        /*
           DEFENCE REDUCES DAMAGE.

           Every 3 Defence = approximately
           1 damage reduced.
        */

        const rawDamage =
            game.player.power +
            random(0, 5);


        const reduction =
            Math.floor(
                enemy.defence / 3
            );


        const damage =
            Math.max(
                1,
                rawDamage -
                reduction
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


        await sleep(650);


        battleMessage(
            `🔴 ${enemy.name} took ${damage} damage!`
        );


        updateBattle();


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


        updateBattle();


        await sleep(750);


        enemyTurn();

    }


    /*
       ENEMY ATTACK
    */

    async function enemyTurn() {

        if (
            finished
        ) {

            return;

        }


        playerTurn =
            false;


        updateBattle();


        setBattleSprite(
            "battle-enemy",
            enemy,
            "attack"
        );


        battleMessage(
            `⚔️ ${enemy.name} attacks ${game.player.name}!`
        );


        await sleep(550);


        /*
           Faster players can dodge.
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
                    50,
                    speedDifference * 2
                );

        }


        if (
            Math.random() * 100 <
            dodgeChance
        ) {

            battleMessage(
                `⚡ ${game.player.name} dodged the attack!`
            );


            setBattleSprite(
                "battle-player",
                game.player,
                "normal"
            );


            await sleep(700);


            playerTurn =
                true;


            updateBattle();


            await sleep(500);


            playerAttack();


            return;

        }


        /*
           Defence reduces enemy damage.
        */

        const rawDamage =
            enemy.power +
            random(0, 5);


        const reduction =
            Math.floor(
                game.player.defence / 3
            );


        const damage =
            Math.max(
                1,
                rawDamage -
                reduction
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


        await sleep(650);


        battleMessage(
            `🟢 ${game.player.name} took ${damage} damage!`
        );


        setBattleSprite(
            "battle-player",
            game.player,
            "hurt"
        );


        updateBattle();


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


        updateBattle();


        await sleep(750);


        playerAttack();

    }


    /*
       FINISH
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


        game.currentBattle =
            null;


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


            setBattleSprite(
                "battle-enemy",
                enemy,
                "defeat"
            );


            battleMessage(
                `🏆 ${game.player.name} defeated ${enemy.name}!`
            );


            gainXP(40);


            setBattleSprite(
                "battle-player",
                game.player,
                "victory"
            );


            /*
               Check whether every AI
               has now been defeated.
            */

            const remaining =
                game.ais.filter(
                    ai =>
                        ai.hp > 0
                );


            if (
                remaining.length === 0
            ) {

                setTimeout(
                    playerGameWin,
                    1700
                );


                return;

            }

        }
        else {

            game.player.hp =
                0;


            setBattleSprite(
                "battle-player",
                game.player,
                "defeat"
            );


            battleMessage(
                `💀 ${enemy.name} defeated ${game.player.name}!`
            );


            setTimeout(
                playerGameLose,
                1700
            );


            return;

        }


        /*
           Battle ended but there are still
           AIs alive.

           If the AI attacked the player,
           continue the AI round.

           If the player started the fight,
           the player's action is now finished.
        */

        setTimeout(
            () => {

                closeModal();


                if (
                    aiStarted
                ) {

                    game.aiIndex++;

                    game.turn =
                        "ai";


                    setTimeout(
                        runNextAI,
                        500
                    );

                }
                else {

                    game.turn =
                        "ai";


                    game.aiIndex =
                        0;


                    setTimeout(
                        runNextAI,
                        500
                    );

                }

            },
            1700
        );

    }


    /*
       Save battle state so RUN can use it.
    */

    game.currentBattle = {

        enemy: enemy,

        getPlayerHP:
            () => playerHP,

        getEnemyHP:
            () => enemyHP,

        getPlayerTurn:
            () => playerTurn,

        isFinished:
            () => finished,

        battleMessage:
            battleMessage,

        enemyTurn:
            enemyTurn

    };


    /*
       Opening messages.
    */

    if (
        aiStarted
    ) {

        battleMessage(
            `🚨 ${enemy.name} suddenly attacked!`
        );

    }
    else {

        battleMessage(
            `⚔️ ${game.player.name} challenged ${enemy.name}!`
        );

    }


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


    updateBattle();


    setTimeout(
        () => {

            if (
                playerTurn
            ) {

                playerAttack();

            }
            else {

                enemyTurn();

            }

        },
        1000
    );

}


/* =========================================================
   RUN
   ========================================================= */

function attemptRun() {

    if (
        !game.battleInProgress
    ) {

        return;

    }


    const battle =
        game.currentBattle;


    if (
        !battle ||
        battle.isFinished()
    ) {

        return;

    }


    const enemy =
        battle.enemy;


    const player =
        game.player;


    battle.battleMessage(
        `🏃 ${player.name} tries to run!`
    );


    /*
       Speed controls escape chance.

       Faster = much better chance.

       Slower = difficult.
    */

    const difference =
        player.speed -
        enemy.speed;


    let chance;


    if (
        difference >= 0
    ) {

        chance =
            Math.min(
                95,
                55 +
                difference * 3
            );

    }
    else {

        chance =
            Math.max(
                5,
                55 +
                difference * 3
            );

    }


    const roll =
        Math.random() * 100;


    setTimeout(
        () => {

            if (
                roll < chance
            ) {

                battle.battleMessage(
                    `💨 ${player.name} escaped successfully!`
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
                   Running counts as the player's
                   action, so AI gets its turn.
                */

                game.turn =
                    "ai";


                game.aiIndex =
                    0;


                setTimeout(
                    runNextAI,
                    600
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
                        `⚡ ${enemy.name} is too fast!`
                    );

                }


                /*
                   Failed escape gives the enemy
                   a chance to immediately attack.
                */

                setTimeout(
                    battle.enemyTurn,
                    800
                );

            }

        },
        650
    );

}


/* =========================================================
   BATTLE SCREEN
   ========================================================= */

function showBattleScreen(enemy) {

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
                        ${game.player.hp}/${game.player.maxHp}
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
                        ${enemy.hp}/${enemy.maxHp}
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
                    class="run-button"
                    onclick="attemptRun()"
                >

                    🏃 RUN

                </button>

            </div>

        </div>

        `

    );


    setBattleSprite(
        "battle-player",
        game.player,
        "normal"
    );


    setBattleSprite(
        "battle-enemy",
        enemy,
        "normal"
    );

}


/* =========================================================
   SPRITE DRAWING
   ========================================================= */

function setBattleSprite(
    canvasId,
    tung,
    role
) {

    const canvas =
        document.getElementById(
            canvasId
        );


    if (!canvas) return;


    drawTungSprite(
        canvas,
        tung,
        role
    );

}


function getBestSpriteRole(
    tung,
    requestedRole
) {

    if (
        requestedRole
    ) {

        return requestedRole;

    }


    if (
        tung.shiny &&
        tung.level >= 10
    ) {

        return "shinyAlpha";

    }


    if (
        tung.level >= 10
    ) {

        return "alpha";

    }


    if (
        tung.level >= 5
    ) {

        return "mega";

    }


    return tung.spriteRole ||
        "normal";

}


function drawTungSprite(
    canvas,
    tung,
    requestedRole = null
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


    ctx.imageSmoothingEnabled =
        false;


    const role =
        getBestSpriteRole(
            tung,
            requestedRole
        );


    const sprite =
        SPRITES[role] ||
        SPRITES.normal;


    /*
       If the image hasn't loaded yet,
       use fallback.
    */

    if (
        !spriteSheet.complete ||
        spriteSheet.naturalWidth === 0
    ) {

        drawFallback(
            canvas,
            role
        );


        return;

    }


    /*
       Draw onto an offscreen canvas first.

       This lets us remove the dark
       sprite-sheet background.
    */

    const offscreen =
        document.createElement(
            "canvas"
        );


    offscreen.width =
        sprite.w;


    offscreen.height =
        sprite.h;


    const offCtx =
        offscreen.getContext(
            "2d"
        );


    offCtx.imageSmoothingEnabled =
        false;


    offCtx.drawImage(

        spriteSheet,

        sprite.x,
        sprite.y,
        sprite.w,
        sprite.h,

        0,
        0,
        sprite.w,
        sprite.h

    );


    /*
       Make the almost-black background
       transparent.

       The actual Tung outlines remain.
    */

    const imageData =
        offCtx.getImageData(
            0,
            0,
            sprite.w,
            sprite.h
        );


    const pixels =
        imageData.data;


    for (
        let i = 0;
        i < pixels.length;
        i += 4
    ) {

        const r =
            pixels[i];


        const g =
            pixels[i + 1];


        const b =
            pixels[i + 2];


        /*
           Remove only very dark pixels.

           This keeps the brown/black
           Tung outlines.
        */

        if (
            r < 24 &&
            g < 24 &&
            b < 24
        ) {

            pixels[i + 3] =
                0;

        }

    }


    offCtx.putImageData(
        imageData,
        0,
        0
    );


    /*
       Draw the cropped Tung
       onto the 32x32 canvas.
    */

    ctx.drawImage(

        offscreen,

        0,
        0,
        sprite.w,
        sprite.h,

        0,
        0,
        32,
        32

    );

}


/* =========================================================
   FALLBACK SPRITE
   ========================================================= */

function drawFallback(
    canvas,
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


    let body =
        "#a95825";


    if (
        role === "mega"
    ) {

        body =
            "#c96d28";

    }


    if (
        role === "alpha"
    ) {

        body =
            "#a63e22";

    }


    if (
        role === "shinyAlpha"
    ) {

        body =
            "#ffd83d";

    }


    ctx.fillStyle =
        body;


    ctx.fillRect(
        9,
        4,
        14,
        23
    );


    ctx.fillStyle =
        "white";


    ctx.fillRect(
        11,
        9,
        5,
        5
    );


    ctx.fillRect(
        17,
        9,
        5,
        5
    );


    ctx.fillStyle =
        "black";


    ctx.fillRect(
        13,
        10,
        2,
        3
    );


    ctx.fillRect(
        18,
        10,
        2,
        3
    );

}


/* =========================================================
   INVENTORY
   ========================================================= */

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


/* =========================================================
   USE ITEM
   ========================================================= */

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
            `🍎 ${game.player.name} ate an Apple.`
        );

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
            `⚡ ${game.player.name} used an Energy Drink.`
        );

    }


    closeModal();


    finishPlayerTurn();


    updateUI();

}


/* =========================================================
   TRAVEL
   ========================================================= */

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


/* =========================================================
   TRAVEL
   ========================================================= */

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


/* =========================================================
   LEADERBOARD
   ========================================================= */

function scoreFor(tung) {

    return (

        tung.level * 100 +

        tung.wins * 250 +

        tung.power * 5 +

        tung.defence * 5 +

        tung.speed * 5

    );

}


function openLeaderboard() {

    const all = [

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


/* =========================================================
   GAME WIN
   ========================================================= */

function playerGameWin() {

    if (
        game.gameOver
    ) {

        return;

    }


    game.gameOver =
        true;


    game.turn =
        "gameover";


    game.battleInProgress =
        false;


    addLog(
        `🏆 ${game.player.name} defeated EVERY rival Tung!`
    );


    showModal(

        "🏆 YOU WIN!",

        `

        <div class="game-over">

            <h2>
                👑 CHAMPION!
            </h2>

            <p>
                ${escapeHTML(
                    game.player.name
                )}
                defeated every Tung!
            </p>

            <p>
                🏆 Wins: ${game.player.wins}
            </p>

            <p>
                ⭐ Level: ${game.player.level}
            </p>

            <p>
                💪 Power: ${game.player.power}
            </p>

            <p>
                🛡️ Defence: ${game.player.defence}
            </p>

            <p>
                ⚡ Speed: ${game.player.speed}
            </p>

        </div>

        `

    );


    updateUI();

}


/* =========================================================
   GAME LOSS
   ========================================================= */

function playerGameLose() {

    if (
        game.gameOver
    ) {

        return;

    }


    game.gameOver =
        true;


    game.turn =
        "gameover";


    game.battleInProgress =
        false;


    addLog(
        `💀 ${game.player.name} has been defeated.`
    );


    showModal(

        "💀 GAME OVER",

        `

        <div class="game-over">

            <h2>
                💀 DEFEATED
            </h2>

            <p>
                ${escapeHTML(
                    game.player.name
                )}
                was defeated.
            </p>

            <p>
                Better luck next time!
            </p>

        </div>

        `

    );


    updateUI();

}


/* =========================================================
   SAVE
   ========================================================= */

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
            "❌ Could not save."
        );

    }

}


/* =========================================================
   LOAD
   ========================================================= */

function loadGame() {

    try {

        const saved =
            localStorage.getItem(
                "tungTangleSave"
            );


        if (!saved) {

            addLog(
                "📂 No save found."
            );


            return;

        }


        const loaded =
            JSON.parse(
                saved
            );


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


        /*
           IMPORTANT:

           Keep the saved AI roster.

           We do NOT create new AIs here.
        */

        game.ais =
            Array.isArray(
                loaded.ais
            )
                ? loaded.ais
                : [];


        /*
           Safety fix for old saves
           that have no AIs.
        */

        if (
            game.ais.length === 0
        ) {

            createAIs();

        }


        game.log =
            loaded.log || [];


        game.turn =
            "player";


        game.turnNumber =
            loaded.turnNumber || 1;


        game.aiIndex =
            0;


        game.battleInProgress =
            false;


        game.currentBattle =
            null;


        game.gameOver =
            false;


        checkEvolution();


        addLog(
            "📂 Game loaded!"
        );


        updateUI();

    }
    catch (error) {

        console.error(error);


        addLog(
            "❌ Save could not be loaded."
        );

    }

}


/* =========================================================
   UPDATE UI
   ========================================================= */

function updateUI() {

    updatePlayerUI();

    updateAIUI();

    updateLog();

    updateTurnUI();

    updateActionButtons();

}


/* =========================================================
   PLAYER UI
   ========================================================= */

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


/* =========================================================
   AI UI
   ========================================================= */

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
                    class="ai ${
                        ai.hp <= 0
                            ? "defeated"
                            : ""
                    }"
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
                            • Lv ${ai.level}
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

                            ${
                                ai.hp <= 0
                                    ? "💀 DEFEATED"
                                    : escapeHTML(
                                        ai.lastAction ||
                                        "Waiting..."
                                    )
                            }

                        </small>

                    </div>

                </div>

                `
            )
            .join("");


    game.ais.forEach(
        (ai, index) => {

            const canvas =
                document.querySelector(
                    `.ai[data-index="${index}"] canvas`
                );


            if (canvas) {

                drawTungSprite(
                    canvas,
                    ai
                );

            }

        }
    );


    highlightAI(
        game.aiIndex
    );

}


/* =========================================================
   TURN UI
   ========================================================= */

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


/* =========================================================
   BUTTONS
   ========================================================= */

function updateActionButtons() {

    const buttons =
        document.querySelectorAll(
            ".action-button"
        );


    const enabled =
        game.turn === "player" &&
        !game.battleInProgress &&
        !game.gameOver;


    buttons.forEach(
        button => {

            button.disabled =
                !enabled;

        }
    );

}


/* =========================================================
   AI HIGHLIGHT
   ========================================================= */

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


    if (
        current &&
        game.ais[index] &&
        game.ais[index].hp > 0
    ) {

        current.classList.add(
            "active"
        );

    }

}


/* =========================================================
   DOM HELPERS
   ========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


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
        document.getElementById(
            id
        );


    if (!element) return;


    element.style.width =
        `${clamp(
            percent,
            0,
            100
        )}%`;

}


/* =========================================================
   MODAL
   ========================================================= */

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


    if (
        !game.battleInProgress
    ) {

        game.currentBattle =
            null;

    }

}


/* =========================================================
   NEW GAME
   ========================================================= */

function newGame() {

    let name =
        prompt(
            "Choose your Tung's name:",
            "Chomper"
        );


    if (
        !name ||
        !name.trim()
    ) {

        name =
            "Chomper";

    }


    game.player =
        {

            ...BASE_STATS,

            name:
                name
                    .trim()
                    .substring(0, 18)

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


    game.gameOver =
        false;


    /*
       CREATE THE AI ROSTER ONCE.

       THESE SAME AIs STAY FOR THE ENTIRE GAME.
    */

    createAIs();


    addLog(
        `🐸 Welcome to Tung Tangle, ${game.player.name}!`
    );


    addLog(
        "📊 All Tungs start with the same stats."
    );


    addLog(
        "⚔️ Defeat every rival to win!"
    );


    setTurn(
        "player"
    );


    updateUI();

}


/* =========================================================
   INITIALIZATION
   ========================================================= */

function initGame() {

    if (
        game.initialized
    ) {

        return;

    }


    game.initialized =
        true;


    const saved =
        localStorage.getItem(
            "tungTangleSave"
        );


    /*
       Automatically load a valid save.
    */

    if (
        saved
    ) {

        try {

            const loaded =
                JSON.parse(
                    saved
                );


            if (
                loaded.player
            ) {

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


                /*
                   KEEP SAME AI ROSTER.
                */

                game.ais =
                    Array.isArray(
                        loaded.ais
                    )
                        ? loaded.ais
                        : [];


                /*
                   Fix old saves that
                   accidentally have zero AIs.
                */

                if (
                    game.ais.length === 0
                ) {

                    createAIs();

                }


                game.log =
                    loaded.log || [];


                game.turn =
                    "player";


                game.turnNumber =
                    loaded.turnNumber || 1;


                game.aiIndex =
                    0;


                game.battleInProgress =
                    false;


                game.currentBattle =
                    null;


                game.gameOver =
                    false;


                checkEvolution();


                addLog(
                    "📂 Saved game loaded."
                );


                updateUI();


                return;

            }

        }
        catch (error) {

            console.warn(
                "Invalid save data."
            );

        }

    }


    /*
       No save = completely new game.
    */

    newGame();

}


/* =========================================================
   KEYBOARD
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            !game.battleInProgress
        ) {

            closeModal();

        }

    }
);


/* =========================================================
   START
   ========================================================= */

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
