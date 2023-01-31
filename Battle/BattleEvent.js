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
        const {caster, target, damage} = this.event;

        if (damage) {
            //modify the target to have less HP
            target.update({
              hp: target.hp - damage
            })
            
            //start blinking
            target.pokemonElement.classList.add("battle-damage-blink");
        }

        //Wait a little bit
        await utils.wait(600)

        //Update Team components
        //this.battle.playerTeam.update();
        //this.battle.enemyTeam.update();

        //stop blinking
        target.pokemonElement.classList.remove("battle-damage-blink");
        resolve();
    }    

    submissionMenu(resolve) {
        const menu = new SubmissionMenu({
            caster: this.event.caster,
            enemy: this.event.enemy,
            onComplete: submission => {
                //submission is what move to use, who to use it on
                resolve(submission)
            }
        })
        menu.init( this.battle.element)
    }

    animation(resolve) {
        const functionName = BattleAnimations[this.event.animation];
        functionName(this.event, resolve)
    }

    init(resolve) {
        this[this.event.type](resolve);
    }
}