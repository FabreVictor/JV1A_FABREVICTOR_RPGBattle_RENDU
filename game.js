import { RPGCharacter } from './character.js';

// Objectif 1 : 
//  - w/h du type monstres différent du type hero
//  - positionner le monstres à droite et les heros à gauche verticalement
//  - changer la couleur des monstres
//  - mettre une couleur de fond sur le canvas

// Defines characters and monsters here !!!
const NBCHAR = 4;
const NBMONSTERS = 3;
const CHAR_START_X = 400;
const MONSTER_START_X = 60;
const CHAR_COLOR_ARRAY = ["green", "red", "blue", "yellow", "orange"];
const HEROES_NAME = ["jojo", "kiki", "mimi", "pipo"]
const HEROES_DAMAGE = [4, 2, 1, 1]
const CHAR_MANA = [13, 16, 18, 6];
const COLONNE = { heroes: 200, monsters: 50 };

// Code 
class RPGGame {

    /*----------------------------------------------*/
    static init() {
        this.turn = "hero"
        this.nbChars = NBCHAR;
        this.nbMonsters = NBMONSTERS;
        this.log = [];

        this.chars = [];
        this.monsters = [];
        for (let i = 0; i < this.nbChars; i++) {
            this.chars[i] = new RPGCharacter(); //
            this.chars[i].init("hero", COLONNE.heroes, 10 + (60 * i), 1, CHAR_MANA[i]);
            this.chars[i].setColor(CHAR_COLOR_ARRAY[1, 3]);
            this.chars[i].setName(HEROES_NAME[i]);
            this.chars[i].setDamages(HEROES_DAMAGE[i]);
        }
        for (let i = 0; i < this.nbMonsters; i++) {
            this.monsters[i] = new RPGCharacter(); //
            this.monsters[i].init("monster", COLONNE.monsters, 30 + (60 * i), 5 + i, 10 + i);
            this.monsters[i].setColor(CHAR_COLOR_ARRAY[0]);
            this.monsters[i].setName("Monstre " + (i + 1));
        }

        RPGGame.displayLog("Click on a Hero to select its action...");

        this.canvas = document.querySelector('canvas');

        const canvas = document.querySelector('canvas');
        canvas.addEventListener('mousedown', function(e) {
            RPGGame.getCursorPosition(canvas, e)
        })
        canvas.addEventListener('mousemove', function(e) {
            RPGGame.canvasMouseMove(canvas, e)
        })

        document.querySelector('#action-attack').addEventListener('mousedown', function(e) {
            let msg = RPGGame.selectedChar.actionAttack();
            RPGGame.displayLog(msg);
            RPGGame.hideMenu();
        });
        document.querySelector('#action-sort').addEventListener('mousedown', function(e) {
            let msg = RPGGame.selectedChar.actionSort();
            RPGGame.displayLog(msg);
            RPGGame.hideMenu();
        });
        document.querySelector('#action-repos').addEventListener('mousedown', function(e) {
            let msg = RPGGame.selectedChar.actionRepos();
            RPGGame.displayHeroBox(RPGGame.selectedChar, RPGGame.lastClick);
            RPGGame.displayLog(msg);
            RPGGame.hideMenu();
        });
        document.querySelector('#action-defence').addEventListener('mousedown', function(e) {
            let msg = RPGGame.selectedChar.actionDefence();
            RPGGame.displayHeroBox(RPGGame.selectedChar, RPGGame.lastClick);
            RPGGame.displayLog(msg);
            RPGGame.hideMenu();
        });


    }

    static hideMenu() {
        let box = document.querySelector('#charbox')
        box.style.display = "none";
    }

    /*----------------------------------------------*/
    static displayLog(text) {
            if (this.log.length > 10) {
                this.log.shift();
            }
            this.log.push(text);
            let currentLog = this.log.join("<br>");
            document.querySelector('#display-log').innerHTML = currentLog;
        }
        /*----------------------------------------------*/
    static canvasMouseMove(canvas, e) {
        const elementRelativeX = e.offsetX;
        const elementRelativeY = e.offsetY;
        const x = elementRelativeX * canvas.width / canvas.clientWidth;
        const y = elementRelativeY * canvas.height / canvas.clientHeight;

        let box = document.querySelector('#monsterbox')
        box.style.display = "none";

        for (let monster of RPGGame.monsters) {
            let rect = monster.getCoord();
            //console.log(rect, x, y);
            if ((x >= rect.x && x <= (rect.x + rect.w)) &&
                (y >= rect.y && y <= (rect.y + rect.h))) {
                let box = document.querySelector('#monsterbox')
                box.style.display = "block";
                box.style.left = rect.x + rect.w + 4;
                box.style.top = rect.y;
                let label = box.querySelector('#monstername');
                label.innerHTML = monster.getName();
                label = box.querySelector('#health');
                label.innerHTML = monster.getHealthCurrent() + "/" + monster.getHealth();
                //console.log(char.getName())
            }
        }
    }

    /*----------------------------------------------*/
    static getCursorPosition(canvas, e) {
        const elementRelativeX = e.offsetX;
        const elementRelativeY = e.offsetY;
        const x = elementRelativeX * canvas.width / canvas.clientWidth;
        const y = elementRelativeY * canvas.height / canvas.clientHeight;
        for (let char of RPGGame.chars) {
            let rect = char.getCoord();
            //console.log(rect, x, y);
            if ((x >= rect.x && x <= (rect.x + rect.w)) &&
                (y >= rect.y && y <= (rect.y + rect.h))) {
                //console.log(char.getName())
                if (RPGGame.selectedChar) {
                    RPGGame.selectedChar.setColor("yellow");
                }
                char.setColor("red")
                RPGGame.selectedChar = char;
                RPGGame.lastClick = rect;
                RPGGame.displayHeroBox(char, rect);
                char.setColor("red")
            }
        }
        for (let monster of RPGGame.monsters) {
            let rect = monster.getCoord();
            //console.log(rect, x, y);
            if ((x >= rect.x && x <= (rect.x + rect.w)) &&
                (y >= rect.y && y <= (rect.y + rect.h))) {
                //console.log(char.getName())
                RPGGame.selectedMonster = monster;
                RPGGame.displayLog(monster.getName() + " selected. HP" + monster.getHealthCurrent());
                if (RPGGame.selectedChar) {
                    let msg = RPGGame.selectedChar.processAction(monster)
                    RPGGame.selectedChar.setTurnDone();
                    if (RPGGame.selectedChar.getLastaction() == "attack") {
                        RPGGame.selectedChar.moveReturn(monster.getX(), monster.getY(), 5)
                    } else {
                        RPGGame.selectedChar.spellCast(monster.getX(), monster.getY(), 20)
                    }
                    RPGGame.displayLog(msg);
                    RPGGame.displayHeroBox(RPGGame.selectedChar, RPGGame.lastClick);
                }
            }
        }
        //console.log("x: " + x + " y: " + y)
    }

    /*----------------------------------------------*/
    static displayHeroBox(char, rect) {
        if (char.charDead()) {
            return
        }
        let box = document.querySelector('#charbox')
        box.style.display = "block";
        box.style.left = rect.x + rect.w + 4;
        box.style.top = rect.y;
        let label = box.querySelector('#charname');
        label.innerHTML = char.getName();
        label = box.querySelector('#mana');
        label.innerHTML = char.getManaCurrent() + "/" + char.getMana();
        label = box.querySelector('#health');
        label.innerHTML = char.getHealthCurrent() + "/" + char.getHealth();
        console.log(box);
        box = document.querySelector('#action')

        // Enable all
        let action1 = document.querySelector('#action-attack')
        action1.style.color = (char.getLastaction() == "attack") ? "black" : "white";
        let action2 = document.querySelector('#action-sort')
        action2.style.color = (char.getLastaction() == "spell") ? "black" : "white";
        let action3 = document.querySelector('#action-repos')
        action3.style.color = (char.getLastaction() == "repos") ? "black" : "white";
        let action4 = document.querySelector('#action-defence')
        action4.style.color = (char.getLastaction() == "defence") ? "black" : "white";

        box.style.display = "block";
        box.style.left = rect.x + rect.w + 4;
        box.style.top = rect.y;
        return;
    }

    /*----------------------------------------------*/
    static monstersAttack() {
        //RPGGame.displayLog("the monster attack");
        // 1 Choisir le monstre qui atatque
        let monster = RPGGame.monsters[RPGGame.monsterIndex];
        if (!monster.charDead()) {
            let target = monster.entierAleatoire(0, RPGGame.chars.length)
            let hero = RPGGame.chars[target];
            while (hero.charDead()) {
                target = monster.entierAleatoire(0, RPGGame.chars.length)
                hero = RPGGame.chars[target];
            }
            let damages = monster.getDamages();
            let msg = hero.sufferDamages(damages);
            monster.setTurnDone();
            RPGGame.displayLog(msg)
            RPGGame.displayLog("the " + monster.getName() + " attack " + RPGGame.chars[target].getName());
        }
        RPGGame.monsterIndex++;
        if (RPGGame.monsterIndex < RPGGame.monsters.length) {
            setTimeout(RPGGame.monstersAttack, 500);
        }
    }

    // 2 - Choisir le hero visé

    //3 - Récupérer les dégats du montres

    //4 - Apliquer sur le héros
    /*----------------------------------------------*/
    static run() {

        if (RPGGame.finished) return;

        let ctx = RPGGame.canvas.getContext('2d');
        ctx.clearRect(0, 0, RPGGame.canvas.width, RPGGame.canvas.height);
        let ndAction = 0;
        let nbDeadHero = 0;
        let nbDeadMonster = 0;

        // Draw characters
        for (let char of RPGGame.chars) {
            ctx.fillStyle = char.getColor();
            //char.randomAnimate();
            let rect = char.getCoord();
            ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

            if (char.isTurnDone() || char.charDead()) {
                ndAction += 1
            }
            if (char.charDead()) {
                nbDeadHero += 1
            }
        }
        if (nbDeadHero == RPGGame.chars.length) {
            RPGGame.displayLog("-------DEFEAT!!!-------")
            RPGGame.displayLog("-------GAME OVER-------")
            RPGGame.finished = true;
            return
        }

        // Manage turn
        if (RPGGame.turn === "hero" && ndAction == RPGGame.chars.length) {
            for (let monster of RPGGame.monsters) {
                monster.newTurn();
            }
            RPGGame.turn = "monster"
                // Manage monster attack
            RPGGame.monsterIndex = 0;
            RPGGame.displayLog("-------Monster turn-------")
            let box = document.querySelector('#charbox')
            box.style.display = "none";
            setTimeout(RPGGame.monstersAttack, 100);
        }

        ndAction = 0;
        nbDeadHero = 0;
        nbDeadMonster = 0;
        for (let monster of RPGGame.monsters) {
            ctx.fillStyle = monster.getColor();
            //char.randomAnimate();
            let rect = monster.getCoord();
            ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
            if (monster.isTurnDone() || monster.charDead()) {
                ndAction += 1
            }
            if (monster.charDead()) {
                nbDeadMonster += 1
            }
        }

        // manage spellm
        for (let char of RPGGame.chars) {
            let spellCoord = char.displaySpell();
            if (spellCoord) {
                ctx.fillStyle = "orange";
                ctx.fillRect(spellCoord.x, spellCoord.y, spellCoord.w, spellCoord.h);
            }
        }
        // Manage turn
        if (RPGGame.turn == "monster" && ndAction == RPGGame.monsters.length) {
            for (let char of RPGGame.chars) {
                char.newTurn();
            }
            RPGGame.turn = "hero"
            RPGGame.displayLog("-------Hero turn-------")
        }
        if (nbDeadMonster == RPGGame.monsters.length) {
            RPGGame.displayLog("-------VICTORY!!!-------");
            RPGGame.finished = true;
        }

    }
}

/*----------------------------------------------*/
console.log("LOADED !!!!");
RPGGame.init();
setInterval(RPGGame.run, 100);