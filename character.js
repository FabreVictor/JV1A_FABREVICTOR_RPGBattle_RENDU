export class RPGCharacter {
    mana = 0;
    manacurrent = 0;
    health = 0;
    healthcurrent = 0;
    x = 40;
    y = 50;
    w = 40;
    h = 40;
    damages = 1;
    color = 'white';
    type = "NONE";
    name = 'Unknown';
    lastaction = "";
    etat = "";

    constructor() {

    }

    init(type, x, y, health = 10, mana = 10) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.health = health;
        this.healthcurrent = health;
        this.mana = mana;
        this.manacurrent = mana;
        this.turnDone = false;
    }
    setTurnDone() {
        this.turnDone = true;
    }

    newTurn() {
        this.turnDone = false;
    }

    isTurnDone() {
        return this.turnDone
    }

    setDamages(damages = 1) {
        this.damages = damages
    }

    setName(name = 'Unknown') {
        this.name = name
    }
    getX() {
        return this.x
    }
    getY() {
        return this.y
    }

    getName() {
        return this.name
    }

    setColor(color = 'white') {
        this.color = color;
    }

    charDead() {
        return this.isDead
    }

    getColor() {
        if (this.isDead) {
            return 'grey';
        } else {
            return this.color;

        }

    }

    getCoord() {
        if (this.ismove) {
            if (this.x > this.moveX) {
                this.x -= this.moveSpeed;
            } else {
                this.x += this.moveSpeed;
            }
            if (this.y > this.moveY) {
                this.y -= this.moveSpeed;
            } else {
                this.y += this.moveSpeed;
                if (this.y >= this.moveY) {}
            }
            if (!this.isreturn && Math.abs(this.x - this.moveX) <= 15 && Math.abs(this.y - this.moveY) <= 15) {
                this.isreturn = true;
                this.moveX = this.returnX;
                this.moveY = this.returnY;
            }
            if (this.isreturn && Math.abs(this.x - this.returnX) <= 15 && Math.abs(this.y - this.returnY) <= 15) {
                this.ismove = false;
                this.x = this.returnX
                this.y = this.returnY
            }
        }
        return { x: this.x, y: this.y, w: this.w, h: this.h }
    }

    getLastaction() {
        return this.lastaction
    }
    getType() {
        return this.type;
    }
    getMana() {
        return this.mana;
    }
    getManaCurrent() {
        return this.manacurrent;
    }
    getHealth() {
        return this.health;
    }
    getHealthCurrent() {
        return this.healthcurrent;
    }

    getDamages() {
        return this.damages;
    }
    actionAttack() {
        if (this.lastaction == "attack") {
            return this.name + " has already done this action at the previous turn";
        }
        if (this.turnDone) {
            return this.name + " already played this turn";
        }
        this.lastaction = "attack";
        return this.name + " is attacking." + "<Br>" + "Please select a target...";
    }
    actionSort() {
        if (this.lastaction == "spell") {
            return this.name + " has already done this action at the previous turn";

        }
        if (this.turnDone) {
            return this.name + " already played this turn";
        }
        this.lastaction = "spell";
        console.log("SORT !!!!!");
        return this.name + " is casting." + "<Br>" + "Please select a target..."
    }
    sufferDamages(damages = 1) {
        if (this.isDefence) {
            damages -= 2;
            if (damages < 0) {
                damages = 0;
                this.healthcurrent -= damages
            } else {
                this.healthcurrent -= damages
            }


        } else {
            this.healthcurrent -= damages;
        }
        if (this.healthcurrent <= 0) {
            this.healthcurrent = 0
            this.isDead = true
            return this.name + " is dead!!!!"
        }
        return this.name + " suffered damages. Current HP are " + this.healthcurrent
    }

    processAction(monster) {
        if (this.lastaction == "attack") {
            return monster.sufferDamages(this.damages);
        }
        if (this.lastaction == "spell") {
            if (this.manacurrent >= 5) {
                this.manacurrent -= 5
                return monster.sufferDamages(5)
            }
            return "not enough MA."
        }
        return "No action available !"
    }

    entierAleatoire(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    actionRepos() {
        if (this.lastaction == "repos") {
            return this.name + " has already done this action at the previous turn";
        }
        if (this.turnDone) {
            return this.name + " already played this turn";
        }
        this.turnDone = true;
        this.lastaction = "repos";
        this.manacurrent += this.entierAleatoire(1, 5);
        if (this.manacurrent > this.mana) {
            this.manacurrent = this.mana
        }

        this.healthcurrent += this.entierAleatoire(1, 5);
        if (this.healthcurrent > this.health) {
            this.healthcurrent = this.health
        }
        return this.name + " His current HP and MA are :" + this.healthcurrent + "/" + this.manacurrent;

    }
    actionDefence() {
        if (this.lastaction == "defence") {
            return this.name + " has already done this action at the previous turn";
        }
        if (this.turnDone) {
            return this.name + " already played this turn";
        }
        this.turnDone = true;
        this.lastaction = "defence";
        this.isDefence = true
        return this.name + " is defending the next damage targeting him will suffer penality"


    }

    moveReturn(x, y, speed) {
        this.ismove = true;
        this.isreturn = false;
        this.moveX = x;
        this.moveY = y;
        this.moveSpeed = speed;
        this.returnX = this.x;
        this.returnY = this.y;
    }

    spellCast(x, y, duration) {
        this.isSpell = true;
        this.spellX = x;
        this.spellY = y;
        this.spellCount = 0;
        this.spellDuration = duration;
    }

    displaySpell() {
        if (this.isSpell) {
            let wh = this.entierAleatoire(10, 20);
            this.spellCount++;
            if (this.spellCount >= this.spellDuration) {
                this.isSpell = false;
            }
            return {
                x: this.spellX + this.entierAleatoire(-10, 10),
                y: this.spellY + this.entierAleatoire(-10, 10),
                w: wh,
                h: wh,
            }
        }
    }

    //randomAnimate() {
    //this.x = this.x + Math.floor((Math.random() * 100));
    //this.x = this.y + Math.floor((Math.random() * 100));
    //}

    move() {

    }
}