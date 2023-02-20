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

            if(!this.map.isPaused) {
                requestAnimationFrame(() => {
                    step();
                })
            }
        }
        step();
    }

    bindActionInput() {
        new KeyPressListner("Space", () => {
            //is there a person here to talk to?
            this.map.checkForActionCutScene()
        })
        new KeyPressListner("Escape", () => {
            //is there a person here to talk to?
            if(!this.map.isCutscenePlaying) {
                this.map.startCutScene([
                    { type: "pause" }
                ])
            }
        })
    }

    bindHeroPositionCheck() {
        document.addEventListener("PersonWalkingComplete", e => {
            if (e.detail.whoId === "hero") {
                //hero's position has changed
                this.map.checkForFootstepCutScene()
            }
        });
    }

    startMap(mapConfig) {        
        this.map = new OverWorldMap(mapConfig);
        this.map.overworld = this;
        this.map.mountObjects();  
    }

    init() {
        this.startMap(window.OverworldMaps.Ville1);   
        
        this.bindActionInput();
        this.bindHeroPositionCheck();

        this.directionInput = new DirectionInput();
        this.directionInput.init();
        this.directionInput.direction; //up right left down

        this.startGameLoop();

        this.map.startCutScene([
            
            // { who: "hero", type: "walk", direction: "down"},
            // { who: "npc1", type: "walk", direction: "down"},
            // { who: "npc1", type: "walk", direction: "left"},
            // { who: "npc1", type: "walk", direction: "left"},
            // { who: "npc1", type: "walk", direction: "left"}, 
            // { who: "npc1", type: "walk", direction: "left"},
            // { who: "npc1", type: "walk", direction: "left"},
            // { who: "npc1", type: "walk", direction: "left"},
            // { who: "npc1", type: "walk", direction: "left"},
            // { who: "npc1", type: "walk", direction: "left"},
            // { who: "npc1", type: "walk", direction: "left"},
            // { who: "npc1", type: "stand", direction: "down"},
            //{type: "textMessage", text:"Maintenant c'est moi qui decide"}
            //{type: "changeMap", map: "Centre_Pokemon"}
            //{ type: "battle", enemyId: "ghetsis" }
        ])
    }

}