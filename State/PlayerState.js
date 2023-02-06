class PlayerState {
    constructor() {
        //tous les pokemons capturés
        this.pokemons = {
            "p1": {
                pokemonId: 0,
                hp: 30,
                maxHp: 50,
                xp: 95,
                maxXp: 100,
                level: 1,
                status: null,
                actions: ["paralyseStatus","soinStatus", "damage1"],
            },
            "p2": {
                pokemonId: 1,
                hp: 30,
                maxHp: 50,
                xp: 95,
                maxXp: 100,
                level: 1,
                status: null,
                actions: ["soinStatus", "damage1"],
            }
        }
        //equipe
        this.lineup = ["p1", "p2"];
        //objets
        this.items = [            
            {actionId: "item_recoverHp", instanceId: "item1"},
            {actionId: "item_recoverHp", instanceId: "item2"},
            {actionId: "item_recoverHp", instanceId: "item3"},
        ];
    }
}

window.playerState = new PlayerState();