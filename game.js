// ============================================================
// TUNG TANGLE
// Uses the provided 1536x1024 Tung sprite sheet
// ============================================================


// ============================================================
// SPRITE SHEET
// ============================================================

const SPRITE_SHEET = "spritesheet.png";

const spriteImage = new Image();

spriteImage.src = SPRITE_SHEET;


// ============================================================
// EXACT SPRITE AREAS FROM THE PROVIDED SHEET
// ============================================================

const SPRITES = {

    // Evolution sprites

    tung:
        { x: 42, y: 82, w: 70, h: 160 },

    mega:
        { x: 442, y: 80, w: 78, h: 165 },

    alpha:
        { x: 792, y: 68, w: 82, h: 175 },

    shiny:
        { x: 1190, y: 68, w: 82, h: 175 },


    // Animation frames

    idle: [

        { x: 45, y: 360, w: 65, h: 110 },
        { x: 125, y: 360, w: 65, h: 110 },
        { x: 210, y: 360, w: 65, h: 110 },
        { x: 290, y: 360, w: 65, h: 110 }

    ],

    walk: [

        { x: 380, y: 360, w: 65, h: 110 },
        { x: 465, y: 360, w: 65, h: 110 },
        { x: 545, y: 360, w: 65, h: 110 },
        { x: 625, y: 360, w: 65, h: 110 }

    ],

    attack: [

        { x: 695, y: 360, w: 75, h: 110 },
        { x: 790, y: 360, w: 75, h: 110 },
        { x: 880, y: 360, w: 90, h: 110 }

    ],

    hurt:
        { x: 1010, y: 360, w: 75, h: 110 },

    victory: [

        { x: 1125, y: 360, w: 75, h: 110 },
        { x: 1210, y: 360, w: 75, h: 110 }

    ],

    defeat: [

        { x: 1350, y: 360, w: 80, h: 110 },
        { x: 1450, y: 360, w: 80, h: 110 }

    ],


    // Role sprites

    normal:
        { x: 42, y: 555, w: 115, h: 170 },

    speed:
        { x: 210, y: 555, w: 115, h: 170 },

    power:
        { x: 390, y: 555, w: 115, h: 170 },

    defence:
        { x: 565, y: 555, w: 115, h: 170 },

    explorer:
        { x: 735, y: 555, w: 115, h: 170 },

    resting:
        { x: 985, y: 555, w: 115, h: 170 },

    fighter:
        { x: 1170, y: 555, w: 115, h: 170 },

    travel:
        { x: 1360, y: 555, w: 115, h: 170 }

};


// ============================================================
// AI NAMES
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
// EVERYONE STARTS IDENTICAL
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

        species: "Tung",

        spriteRole: "normal"

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

    return array.sort(
        () => Math.random() - 0.5
    );

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
// SPRITE SOURCE
// ============================================================

function getEvolutionSprite(tung) {

    if (tung.shiny) {

        return SPRITES.shiny;

    }

    if (
        tung.level >= 10
    ) {

        return SPRITES.alpha;

    }

    if (
        tung.level >= 5
    ) {

        return SPRITES.mega;

    }

    return SPRITES.tung;

}


// ============================================================
// DRAW SPRITE
// ============================================================

function drawSprite(

    canvas,
    sprite,
    scale = 1

) {

    if (!canvas) return;

    const ctx =
        canvas.getContext("2d");

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.imageSmoothingEnabled = false;


    if (
        !spriteImage.complete
    ) {

        spriteImage.onload = () => {

            drawSprite(
                canvas,
                sprite,
                scale
            );

        };

        return;

    }


    const ratio =
        Math.min(

            canvas.width /
            sprite.w,

            canvas.height /
            sprite.h

        ) * scale;


    const width =
        sprite.w * ratio;

    const height =
        sprite.h * ratio;


    const x =
        (canvas.width - width) / 2;

    const y =
        (canvas.height - height) / 2;


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
// DRAW EVOLUTION SPRITE
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
// DRAW ROLE SPRITE
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
// PLAYER NAME
// ============================================================

function chooseName() {

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

}


// ============================================================
// CREATE AI ROUND
// ============================================================

function createAIs() {

    game.ais = [];


    // 5-13 AI Tungs

    const amount =
        random(
            5,
            AI_NAMES.length
        );


    const names =
        shuffle(
            [...AI_NAMES]
        );


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const ai = {

            ...BASE_STATS,

            name: names[i],

            species: "Tung",

            spriteRole: "normal",

            lastAction:
                "Waiting..."

        };


        // Tiny chance of shiny

        ai.shiny =
            Math.random() < 0.03;


        game.ais.push(ai);

    }

}


// ============================================================
// START
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
        `🤖 ${game.ais.length} AI Tungs entered this round!`
    );


    updateUI();

}


// ============================================================
// LOG
// ============================================================

function addLog(message) {

    game.log.unshift(message);


    if (
        game.log.length > 80
    ) {

        game.log.pop();

    }


    updateLog();

}


function updateLog() {

    const log =
        document.getElementById(
            "log"
        );


    if (!log) return;


    log.innerHTML =
        game.log
            .map(
                x =>
                    `<div class="log-entry">${x}</div>`
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


    const old =
        game.player.species;


    game.player.species =
        getSpecies(
            game.player.level
        );


    addLog(
        `🎉 LEVEL UP! ${game.player.name} is now level ${game.player.level}!`
    );


    if (
        old !==
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
        roll < .4
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
        roll < .65
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

    gainXP(10);


    if (
        stat === "power"
    ) {

        game.player.spriteRole =
            "power";

    }

    if (
        stat === "defence"
    ) {

        game.player.spriteRole =
            "defence";

    }

    if (
        stat === "speed"
    ) {

        game.player.spriteRole =
            "speed";

    }


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
        `💤 ${game.player.name} rested.`
    );

}


// ============================================================
// PLAYER TURN FINISHED
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


    updateUI();


    setTimeout(
        () => {

            aiTakeTurn(ai);

            updateUI();

            game.aiIndex++;


            setTimeout(
                runNextAI,
                650
            );

        },
        400
    );

}


// ============================================================
// AI ACTION
// ============================================================

function aiTakeTurn(ai) {

    const roll =
        Math.random();


    if (
        roll < .25
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
        roll < .45
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
        roll < .60
    ) {

        ai.speed++;

        ai.spriteRole =
            "speed";

        ai.lastAction =
            "Practised Speed";

        addLog(
            `🤖 ${ai.name} practised Speed!`
        );

        return;

    }


    if (
        roll < .78
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

                    <span class="rival-name">
                        ${ai.shiny ? "✨ " : ""}
                        ${ai.name}
                    </span>

                    ❤️ ${ai.hp}/${ai.maxHp}

                    <br>

                    💪 ${ai.power}

                    🛡️ ${ai.defence}

                    ⚡ ${ai.speed}

                    <br>

                    Lv.${ai.level}

                </button>

            `;

        }
    );


    html += "</div>";


    showModal(
        "⚔️ CHOOSE YOUR OPPONENT",
        html
    );

}


// ============================================================
// BATTLE
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


    game.player.spriteRole =
        "fighter";


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

        `⚔️ BATTLE — ${game.player.name} VS ${enemy.name}`,

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
                ⚔️ Battle starting...
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


    const battleLog =
        document.getElementById(
            "battle-log"
        );


    let playerAttacks = true;

    let finished = false;


    // ========================================================
    // BATTLE MESSAGE
    // ========================================================

    function battleMessage(
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


    // ========================================================
    // BATTLE UI
    // ========================================================

    function updateBattle() {

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
                    ? `🟢 ${game.player.name}'s turn`
                    : `🔴 ${enemy.name}'s turn`;

        }

    }


    // ========================================================
    // ATTACK ANIMATION
    // ========================================================

    function playAttackAnimation(
        canvas,
        finishedCallback
    ) {

        const frames =
            SPRITES.attack;


        let frame = 0;


        function nextFrame() {

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
                    nextFrame,
                    130
                );

            }

            else {

                setTimeout(
                    finishedCallback,
                    100
                );

            }

        }


        nextFrame();

    }


    // ========================================================
    // HURT ANIMATION
    // ========================================================

    function playHurtAnimation(
        canvas
    ) {

        drawSprite(
            canvas,
            SPRITES.hurt
        );


        setTimeout(
            () => {

                drawEvolutionSprite(
                    canvas,
                    canvas === playerCanvas
                        ? game.player
                        : enemy
                );

            },
            400
        );

    }


    // ========================================================
    // BATTLE STEP
    // ========================================================

    function battleStep() {

        if (finished) return;


        if (
            playerHP <= 0 ||
            enemyHP <= 0
        ) {

            finishBattle();

            return;

        }


        updateBattle();


        let damage;


        // ====================================================
        // PLAYER ATTACK
        // ====================================================

        if (
            playerAttacks
        ) {

            damage =
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


            playAttackAnimation(

                playerCanvas,

                () => {

                    enemyHP =
                        Math.max(
                            0,
                            enemyHP - damage
                        );


                    battleMessage(
                        `🟢 ${game.player.name} dealt ${damage} damage!`
                    );


                    setTimeout(
                        () => {

                            battleMessage(
                                `🔴 ${enemy.name} took ${damage} damage!`
                            );


                            playHurtAnimation(
                                enemyCanvas
                            );


                            updateBattle();

                        },
                        350
                    );

                }

            );

        }


        // ====================================================
        // ENEMY ATTACK
        // ====================================================

        else {

            damage =
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


            playAttackAnimation(

                enemyCanvas,

                () => {

                    playerHP =
                        Math.max(
                            0,
                            playerHP - damage
                        );


                    battleMessage(
                        `🔴 ${enemy.name} dealt ${damage} damage!`
                    );


                    setTimeout(
                        () => {

                            battleMessage(
                                `🟢 ${game.player.name} took ${damage} damage!`
                            );


                            playHurtAnimation(
                                playerCanvas
                            );


                            updateBattle();

                        },
                        350
                    );

                }

            );

        }


        playerAttacks =
            !playerAttacks;


        setTimeout(
            battleStep,
            1450
        );

    }


    // ========================================================
    // FINISH BATTLE
    // ========================================================

    function finishBattle() {

        if (finished) return;

        finished = true;


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


            battleMessage(
                `🏆 ${enemy.name} was defeated!`
            );


            battleMessage(
                `⭐ ${game.player.name} won the battle!`
            );


            battleMessage(
                `⭐ ${game.player.name} gained 40 XP!`
            );


            game.player.xp += 40;


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
                1300
            );

        }


        // PLAYER DEFEAT

        else {

            game.player.hp =
                Math.max(
                    1,
                    playerHP
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
                1200
            );

        }

    }


    battleStep();

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
                    ${enemyName} won this battle.
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


    game.turn = "ai";

    game.aiIndex = 0;


    addLog(
        "🤖 AI Tungs are taking their turns..."
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
        game.inventory[item] <= 0
    ) {

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
            `🍎 ${game.player.name} ate an Apple and recovered 25 HP.`
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
            "❌ Could not load save."
        );

    }

}


// ============================================================
// UI
// ============================================================

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
        p.shiny
            ? "✨ Shiny Alpha Tung"
            : p.species;


    document.getElementById(
        "level"
    ).textContent =
        p.level;


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
        "location"
    ).textContent =
        p.location;


    document.getElementById(
        "round"
    ).textContent =
        game.round;


    document.getElementById(
        "turn-number"
    ).textContent =
        game.turnNumber;


    // Bars

    document.getElementById(
        "hp-bar"
    ).style.width =
        `${p.hp / p.maxHp * 100}%`;


    document.getElementById(
        "energy-bar"
    ).style.width =
        `${p.energy / p.maxEnergy * 100}%`;


    document.getElementById(
        "xp-bar"
    ).style.width =
        `${p.xp / p.xpNeeded * 100}%`;


    // Player sprite

    const playerCanvas =
        document.getElementById(
            "player-sprite"
        );


    if (
        p.spriteRole ===
        "normal"
    ) {

        drawEvolutionSprite(
            playerCanvas,
            p
        );

    }

    else {

        drawRoleSprite(
            playerCanvas,
            p.spriteRole
        );

    }


    // Turn panel

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


    // Disable actions during AI/fight

    document
        .querySelectorAll(
            ".action-button"
        )
        .forEach(
            button => {

                button.disabled =
                    game.turn !== "player";

            }
        );


    // AI count

    document.getElementById(
        "ai-count"
    ).textContent =
        `(${game.ais.length})`;


    // AI list

    const list =
        document.getElementById(
            "ai-list"
        );


    list.innerHTML =
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


                if (
                    ai.spriteRole ===
                    "normal"
                ) {

                    drawEvolutionSprite(
                        canvas,
                        ai
                    );

                }

                else {

                    drawRoleSprite(
                        canvas,
                        ai.spriteRole
                    );

                }

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


// ============================================================
// START
// ============================================================

spriteImage.onload = () => {

    startGame();

};
