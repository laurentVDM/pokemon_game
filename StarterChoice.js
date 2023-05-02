class StarterChoice extends GameObject {
    constructor(config) {
        super(config);
        this.sprite = new Sprite({
            gameObject: this,
            src: "/img/maps/pokeball_duo.png",
            animations: {
                "used-down"   : [ [1,0] ],  //pour faire disparaire 01 et 11
                "unused-down"   : [ [0,0] ],
            },
            currentAnimation: "used-down"
        });        
        this.storyFlag = config.storyFlag;
        this.pokemons = config.pokemons;
        this.talking = [
            {
                required: [this.storyFlag],
                events: [
                    {type: "textMessage", text: "J'espere que ton starter te plait"},
                ]
            },
            {
                events: [
                    {type: "textMessage", text: "Que contient la pokeball"},
                    {type: "selectPokemon", pokemons: this.pokemons, storyFlag: this.storyFlag},
                ]
            }
        ]
    }
}