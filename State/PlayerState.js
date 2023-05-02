class PlayerState {
    constructor() {
        //tous les pokemons capturés
        this.pokemons = {
            "p1": {
                pokemonId: 0,
                hp: 1,
                maxHp: 50,
                xp: 95,
                maxXp: 100,
                level: 1,
                status: null,
                actions: ["paralyseStatus","soinStatus", "damage1"],
            },
            "p2": {
                pokemonId: 1,
                hp: 1,
                maxHp: 50,
                xp: 95,
                maxXp: 100,
                level: 1,
                status: null,
                actions: ["paralyseStatus","soinStatus", "damage1"],
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
        //storyflags pour dire qui on a battu par ex
        this.storyFlags = {            
        };
    }

    pushItem(itemActionId) {
        const newItemInstanceId = `item${Date.now()}`;
        
        this.items.push({
            actionId: itemActionId,
            instanceId: newItemInstanceId
        })
    }

    pushPokemon(pokemon) {
        console.log(pokemon)
        //const pokemonKey = Object.keys(pokemon)[0];
        const newPokemonId = pokemon.pokemonId;
        const newMaxHP = pokemon.maxHp;
        const newMaxXP = pokemon.maxXp;

        const newPokemonKey = "p" + (Object.keys(this.pokemons).length + 1);

        this.pokemons[newPokemonKey] = {
            pokemonId: newPokemonId,
            hp: newMaxHP,
            maxHp: newMaxHP,
            xp: 0,
            maxXp: newMaxXP,
            level: 5,
            status: null,
            actions: ["soinStatus", "damage1"],
        };

        console.log("liste des pokemons apres un ajout: ", this.pokemons)
        this.lineup.push(newPokemonKey)
    }

    swapLineup(oldId, incomingId) {
        const oldIndex = this.lineup.indexOf(oldId);
        this.lineup[oldIndex] = incomingId;
        //utils.emitEvent("LineupChanged");     pour hud, pas encore besoin
    }
    
    moveToFront(futureFrontId) {
        this.lineup = this.lineup.filter(id => id !== futureFrontId);
        this.lineup.unshift(futureFrontId);
        //utils.emitEvent("LineupChanged");     pour hud, pas  encore besoin
    }
}

window.playerState = new PlayerState();