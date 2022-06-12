class OverWorldMap {
    constructor(config) {
        this.gameObjects = config.gameObjects;
        this.walls = config.walls || {};

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;

        this.isCutscenePlaying = false;
    }

    drawLowerImage(ctx, cameraPerson) {
        ctx.drawImage(
            this.lowerImage,
            utils.withGrid(10.5)- cameraPerson.x,
            utils.withGrid(5)- cameraPerson.y
        )
    }
    drawUpperImage(ctx, cameraPerson) {
        ctx.drawImage(
            this.upperImage,
            utils.withGrid(10.5)- cameraPerson.x,
            utils.withGrid(5)- cameraPerson.y
        )
    }

    isSpaceTaken(currentX, currentY,direction) {
        const {x,y} = utils.nextPosition(currentX, currentY, direction);
        return this.walls[`${x},${y}`] || false;
    }

    mountObjects() {
        Object.keys(this.gameObjects).forEach(key => {

            let object = this.gameObjects[key];
            object.id = key;

            //TODO : determine if this object should actually mount
            object.mount(this);
        })
    }

    async startCutScene(events) {
        console.log(events);
        this.isCutscenePlaying = true;

        //start loop of async events
        //await each one
        for(let i=0; i<events.length; i++) {
            const eventHandler = new OverWorldEvent({
                event: events[i],
                map: this,
            })
            await eventHandler.init();
        }

        this.isCutscenePlaying = false;
    }

    //wall code
    addWall(x,y) {
        this.walls[`${x},${y}`] = true;
    }
    removeWall(x,y) {
        delete this.walls[`${x},${y}`];
    }
    moveWall(wasX, wasY, direction) {
        this.removeWall(wasX,wasY);
        const {x,y} = utils.nextPosition(wasX, wasY, direction);
        this.addWall(x,y);
    }
}

window.OverWorldMaps = {
    DemoRoom: {
        lowerSrc: "img/maps/demoroom_lower.png",
        upperSrc: "img/maps/demoroom_upper.png",
        gameObjects: {
            hero: new Person( {
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(6)
            }),
            npc1:new Person( {
                x: utils.withGrid(4),
                y: utils.withGrid(5),
                src: "img/personages/perso2.png"
            })
        }
    },
    Centre_Pokemon: {
        lowerSrc: "img/maps/centrepokemonLower.png",
        upperSrc: "img/maps/centrepokemonUpper.png",
        gameObjects:{
            hero: new Person( {                
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(6)
            }),
            infirmiere: new Person( {
                x: utils.withGrid(10),
                y: utils.withGrid(3),
                src: "img/personages/infirmiere.png"
            })
        }
    },
    Ville1: {
        lowerSrc: "img/maps/ville1_lower.png",
        upperSrc: "img/maps/ville1_upper.png",
        gameObjects: {
            hero: new Person( {
                isPlayerControlled: true,
                x: utils.withGrid(11),
                y: utils.withGrid(20)
            }),
            npc1:new Person( {
                x: utils.withGrid(20),
                y: utils.withGrid(19),
                src: "img/personages/perso2.png",
                behaviorLoop: [
                    { type: "stand", direction: "down", time: 1200},
                    { type: "stand", direction: "right", time: 1200},
                ]
            }),
            infirmiere: new Person( {
                x: utils.withGrid(30),
                y: utils.withGrid(19),
                //src: "img/personages/infirmiere.png",
                behaviorLoop: [
                    { type: "walk", direction: "left"},
                    { type: "stand", direction: "up", time: 800},
                    { type: "walk", direction: "up"},
                    { type: "walk", direction: "right"},
                    { type: "walk", direction: "down"},
                ]
            })
        },
        walls: {
            
            [utils.asGridCoord(11,19)] : true,
            
        }

    }
}