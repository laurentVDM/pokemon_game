class TurnCycle {
    constructor({battle, onNewEvent}) {
        this.battle = battle;
        this.onNewEvent = onNewEvent;
        this.currentTeam = "player" // or "enemy"
    }

    async turn() {
        //get the caster
        const casterID = this.battle.activeCombatants[this.currentTeam];
        const caster = this.battle.combatants[casterID];
        const enemyID = this.battle.activeCombatants[caster.team === "player" ? "enemy": "player"];
        const enemy = this.battle.combatants[enemyID];

        const submission = await this.onNewEvent({
            type: "submissionMenu",
            caster,
            enemy
        })
        const resultingEvents = submission.action.succes;
        for (let i=0; i<resultingEvents.length; i++) {
            const event = {
                ...resultingEvents[i],
                submission,
                action: submission.action,
                caster,
                target: submission.target,
            }
            await this.onNewEvent(event);
        }

        this.currentTeam = this.currentTeam === "player" ? "enemy" : "player"
        this.turn();
    }

    async init() {
        await this.onNewEvent({
            type: "textMessage",
            text: "the battle is starting!"
        })

        //start first turn
        this.turn();
    }
}