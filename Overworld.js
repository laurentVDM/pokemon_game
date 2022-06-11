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

            Object.values(this.map.gameObjects).forEach(object => {
                object.update( {
                    arrow: this.directionInput.direction
                });
            })

            //draw lower layer
            this.map.drawLowerImage(this.ctx, cameraPerson);

            //draw game objects
            Object.values(this.map.gameObjects).forEach(object => {
                
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

    init() {
        this.map = new OverWorldMap(window.OverWorldMaps.Ville1);

        this.directionInput = new DirectionInput();
        this.directionInput.init();
        this.directionInput.direction; //up right left down

        this.startGameLoop();
    }

}