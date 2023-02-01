window.Actions = {
    damage1: {
        name: "whomp",
        succes: [
            {type: "textMessage", text: "{CASTER} utilise {ACTION}"},
            {type: "animation", animation: "spin"},
            {type: "stateChange", damage: 10}
        ]
    },
    soinStatus: {
        name: "soin medical",
        targetType: "friendly",
        succes: [
            {type: "textMessage", text: "{CASTER} utilise {ACTION}"},
            {type: "stateChange", status: {type: "soin", expiresIn: 3} }
        ]
    },
    paralyseStatus: {
        name: "cage eclair",
        succes: [
            {type: "textMessage", text: "{CASTER} utilise {ACTION}"},
            {type: "animation", animation: "glob", color: "#dafd2a"},
            {type: "stateChange", status: {type: "paralyse", expiresIn: 3} },
            {type: "textMessage", text: "{TARGET} va avoir du mal a attaquer"},
        ]
    },
    //items
    item_recoverStatus: {
        name: "poudre soin",
        description: "soigne tous les problemes de status",
        targetType: "friendly",
        succes: [
            {type: "textMessage", text: "{CASTER} utilise une {ACTION}"},
            {type: "stateChange", status: null },
            {type: "textMessage", text: "{CASTER} se sent mieux"},
        ]
    },
    item_recoverHp: {
        name: "potion",
        description: "soigne le pokemon de 20 HP",
        targetType: "friendly",
        succes: [
            {type: "textMessage", text: "{CASTER} utilise une {ACTION}"},
            {type: "stateChange", recover: 20 },
        ]
    }
}