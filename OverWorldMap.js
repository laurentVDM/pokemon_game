class OverWorldMap {
    constructor(config) {
        this.gameObjects = config.gameObjects;
        this.walls = config.walls || {};

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;
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
        Object.values(this.gameObjects).forEach(o => {
            //TODO : determine if this object should actually mount
            o.mount(this);
        })
    }

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
                y: utils.withGrid(18),
                src: "img/personages/perso2.png"
            })
        },
        walls: {
            
            [utils.asGridCoord(11,19)] : true,
            
        }

    }
}