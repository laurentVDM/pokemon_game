class Overworld {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
    }

    gameLoopStepwork() {
        //img for walls
        let wallImg = new Image();
        wallImg.src = "/img/orange.png"         //comm when not display
        //img for battleZone
        let battleZoneImg = new Image();
        battleZoneImg.src = "/img/purple.png"   //comm when not display

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
                   
        //draw walls
        Object.keys(this.map.walls).forEach(key => {
            const [x, y] = key.split(',');                
            this.ctx.drawImage( wallImg, x-cameraPerson.x+ utils.withGrid(10.5), y-cameraPerson.y+ utils.withGrid(6));
        })

        //draw battlezoneSpaces
        Object.keys(this.map.battleZoneSpaces).forEach(key => {
            const [x, y] = key.split(',');
            
            this.ctx.drawImage( battleZoneImg, x-cameraPerson.x+ utils.withGrid(10.5), y-cameraPerson.y+ utils.withGrid(6));
        })

        //draw upper layer
        this.map.drawUpperImage(this.ctx, cameraPerson);
    }

    startGameLoop() {
        //refresh at a certain speed
        let previousMs;
        const step = 1/120;
        const stepFn = (timestampMs) => {
            if(this.map.isPaused) {
                return;
            }
            if(previousMs === undefined) {
                previousMs = timestampMs;
            } 
            let delta = (timestampMs - previousMs) / 1000;
            while(delta >= step) {
                this.gameLoopStepwork();
                delta -= step
            }
            previousMs = timestampMs - delta * 1000          

            requestAnimationFrame(stepFn)
        }
        //first kickoff tick
        requestAnimationFrame(stepFn)
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

    startMap(mapConfig, heroInitialState=null) {        
        this.map = new OverWorldMap(mapConfig);
        this.map.overworld = this;
        this.map.mountObjects(); 
        utils.stopAllMusic();
        audio[mapConfig.id].play();

        if(heroInitialState){
            const {hero} = this.map.gameObjects;
            hero.x = heroInitialState.x;
            hero.y = heroInitialState.y;
            hero.direction = heroInitialState.direction;
        } 
        //pour save
        this.progress.mapId = mapConfig.id;
        this.progress.startingHeroX = this.map.gameObjects.hero.x;
        this.progress.startingHeroY = this.map.gameObjects.hero.y;
        this.progress.startingHeroDirection = this.map.gameObjects.hero.direction;
    }

    async init() {
        //create progress tracker
        this.progress = new Progress();

        //show titleScreen
        this.titleScreen = new Titlescreen({
            progress: this.progress
        })

        //test with loading sceen
        //const useSaveFile = await this.titleScreen.init(document.querySelector(".game-container"));
        //test without loading screen + change map in Progress.jssd
        const useSaveFile = null
        
        //Potentially load saved data
        let initialHeroState = null;
        if (useSaveFile) {
            this.progress.load();
            initialHeroState ={
                x : this.progress.startingHeroX,
                y : this.progress.startingHeroY,
                direction : this.progress.startingHeroDirection,
            }
        }

        //start first map
        this.startMap(window.OverworldMaps[this.progress.mapId], initialHeroState);   

        //create controls
        this.bindActionInput();
        this.bindHeroPositionCheck();

        this.directionInput = new DirectionInput();
        this.directionInput.init();
        this.directionInput.direction; //up right left down

        this.startGameLoop();

        this.map.startCutScene([
        ])
    }

}