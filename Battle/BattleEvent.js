class BattleEvent {
    constructor(event, battle) {
        this.event = event;
        this.battle = battle;
    }

    textMessage(resolve) {

        const text = this.event.text
        .replace("{CASTER}", this.event.caster?.name)
        .replace("{TARGET}", this.event.target?.name)
        .replace("{ACTION}", this.event.action?.name)

        const message = new TextMessage({
            text,
            onComplete: () => {
                resolve();
            }
        })
        message.init( this.battle.element)
    }

    async stateChange(resolve) {
        const {caster, target, damage, recover, status, action} = this.event;
        let who = this.event.onCaster ? caster : target;
        if (damage) {
            let newHp = target.hp - damage
            if(newHp < 0){
                newHp = 0;
            }
            //modify the target to have less HP
            target.update({
              hp: newHp
            })
            
            //start blinking
            target.pokemonElement.classList.add("battle-damage-blink");
        }

        if (recover) {            
            let newHp = who.hp + recover;
            if (newHp > who.maxHp) {
              newHp = who.maxHp;
            }
            who.update({
              hp: newHp
            })
        }

        if(status) {
            who.update({
                status: {...status}
            })
        }
        if(status === null) {
            who.update({
                status: null
            })
        }

        //Wait a little bit
        await utils.wait(600)

        //update Team Components
        this.battle.playerTeam.update();
        this.battle.enemyTeam.update();

        //Update Team components
        //this.battle.playerTeam.update();
        //this.battle.enemyTeam.update();

        //stop blinking
        target.pokemonElement.classList.remove("battle-damage-blink");
        resolve();
    }    

    submissionMenu(resolve) {
        const {caster} = this.event;
        const menu = new SubmissionMenu({
            caster: caster,
            enemy: this.event.enemy,
            items: this.battle.items,
            replacements: Object.values(this.battle.combatants).filter(c => {
                return c.id !== caster.id && c.team === caster.team && c.hp > 0
            }),
            onComplete: submission => {
                //submission is what move to use, who to use it on
                resolve(submission)
            }
        })
        menu.init( this.battle.element)
    }

    replacementMenu(resolve) {
        const menu = new ReplacementMenu({
            replacements: Object.values(this.battle.combatants).filter(c =>{
                return c.team === this.event.team && c.hp > 0
            }),
            onComplete: replacement => {
                resolve(replacement)
            }
        })
        menu.init(this.battle.element)
    }

    async replace(resolve) {
        const {replacement} = this.event;

        //Clear out the old combat
        const prevCombatant = this.battle.combatants[this.battle.activeCombatants[replacement.team]];
        this.battle.activeCombatants[replacement.team] = null;
        prevCombatant.update();
        await utils.wait(400);
        
        //in the new
        this.battle.activeCombatants[replacement.team] = replacement.id;
        replacement.update();
        await utils.wait(400);

        //update Team Components
        this.battle.playerTeam.update();
        this.battle.enemyTeam.update();

        resolve();
    }

    giveXp(resolve) {
        let amount = this.event.xp;
        const {combatant} = this.event;
        const step = () => {
            if (amount>0) {
                amount-=1;
                combatant.xp +=1;

                //check if we hit level up
                if(combatant.xp === combatant.maxXp) {
                    combatant.xp = 0;
                    combatant.maxXp = 150;
                    combatant.maxHp +=5;
                    combatant.hp +=5;
                    combatant.level +=1;
                }

                combatant.update();
                requestAnimationFrame(step);
                return;
            }
            resolve();
        }
        requestAnimationFrame(step);
    }

    animation(resolve) {
        const functionName = BattleAnimations[this.event.animation];
        functionName(this.event, resolve)
    }

    init(resolve) {
        this[this.event.type](resolve);
    }
}