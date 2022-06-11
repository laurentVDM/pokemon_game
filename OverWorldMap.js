class OverWorldMap {
    constructor(config) {
        this.gameObjects = config.gameObjects;

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;
    }

    drawLowerImage(ctx) {
        ctx.drawImage(this.lowerImage,0,0)
    }
    drawUppererImage(ctx) {
        ctx.drawImage(this.upperImage,0,0)
    }
}

window.OverWorldMaps = {
    DemoRoom: {
        lowerSrc: "img/maps/ville1_lower.png",
        upperSrc: "img/maps/ville1_upper.png",
        gameObjects: {
            hero: new Person( {
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(6)
            }),
            npc1:new Person( {
                x: utils.withGrid(4),
                y: utils.withGrid(8),
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
}