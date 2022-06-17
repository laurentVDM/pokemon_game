class Overworld {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
    }

    startGameLoop() {
        const step = () => {

            //Clear off canvas before drawing new layers
            this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);

            //Establish the camera person
            const cameraPerson = this.map.gameObjects.hero;

            //update all objects
            Object.values(this.map.gameObjects).forEach(object => {
                object.update( {
                    arrow: this.directionInput.direction,
                    map: this.map,
                });
            })

            //draw lower layer
            this.map.drawLowerImage(this.ctx, cameraPerson);

            //draw game objects
            Object.values(this.map.gameObjects).sort((a,b) => {
                return a.y-b.y;
            }).forEach(object => {                
                object.sprite.draw(this.ctx, cameraPerson);
            })

            //draw upper layer
            this.map.drawUpperImage(this.ctx, cameraPerson);

            requestAnimationFrame(() => {
                step();
            })
        }
        step();
    }

    bindActionInput() {
        new KeyPressListner("Space", () => {
            //is there a person here to talk to?
            this.map.checkForActionCutScene()
        })
    }

    init() {
        this.map = new OverWorldMap(window.OverWorldMaps.Ville1);
        this.map.mountObjects();      
        
        this.bindActionInput();

        this.directionInput = new DirectionInput();
        this.directionInput.init();
        this.directionInput.direction; //up right left down

        this.startGameLoop();

        this.map.startCutScene([
            
            { who: "hero", type: "walk", direction: "down"},
            { who: "npc1", type: "walk", direction: "down"},
            { who: "npc1", type: "walk", direction: "left"},
            { who: "npc1", type: "walk", direction: "left"},
            { who: "npc1", type: "walk", direction: "left"},
            { who: "npc1", type: "walk", direction: "left"},
            { who: "npc1", type: "walk", direction: "left"},
            { who: "npc1", type: "walk", direction: "left"},
            { who: "npc1", type: "walk", direction: "left"},
            { who: "npc1", type: "walk", direction: "left"},
            { who: "npc1", type: "walk", direction: "left"},
            { who: "npc1", type: "stand", direction: "down"},
            {type: "textMessage", text:"Maintenant c'est moi qui decide"}
        ])
    }

}