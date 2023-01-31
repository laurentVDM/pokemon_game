window.Actions = {
    damage1: {
        name: "whomp",
        succes: [
            {type: "textMessage", text: "{CASTER} utilise {ACTION}"},
            {type: "animation", animation: "spin"},
            {type: "stateChange", damage: 10}
        ]
    }
}