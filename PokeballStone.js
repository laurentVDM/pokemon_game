class PokeballStone extends GameObject {
    constructor(config) {
        super(config);  
        this.sprite = new Sprite({
            gameObject: this,
            //src: "/img/personages/ghetsis.png",
            src: "/img/maps/pokeball_duo.png",
            animations: {
                "used-down"   : [ [1,0] ],
                "unused-down"   : [ [0,0] ],
            },
            currentAnimation: "used-down"
        });
        this.storyFlag = config.storyFlag;

        this.talking = [
            {
                required: [this.storyFlag],
                events: [
                    {type: "textMessage", text: "Pokeball deja ouverte"},
                ]
            },
            {
                events: [
                    {type: "textMessage", text: "Que contient la pokeball"},
                    {type: "addStoryFlag", flag: this.storyFlag},
                ]
            }
        ]
    }

    update(){
        //check si on a le storyflag, si oui on affiche apres le ?, sinon :
        this.sprite.currentAnimation = playerState.storyFlags[this.storyFlag]
        ? "unused-down" 
        : "used-down"
    }
}