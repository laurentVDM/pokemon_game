window.Enemies = {
    "ghetsis" : {
        name: "Ghetis",
        src: "/img/personages/ghetsis.png",
        pokemons: {
            "a": {
                pokemonId: 3,
                maxHp: 50,
                hp: 1,
                level: 1,
                actions: ["damage1","soinStatus"]
            }
        }
    },
    "guzma" : {
        name: "Guzma",
        src: "/img/personages/guzma.png",
        pokemons: {
            "a": {
                pokemonId: 6,
                maxHp: 50,
                level: 1,
                actions: ["damage1","soinStatus"],
            },
            "b": {
                pokemonId: 7,
                maxHp: 75,
                level: 4,
                actions: ["damage1", "soinStatus"],
            }
        }
    }
}