class Sprite {
    constructor(config) {

        //setup images
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        }

        //config animation et etat initial
        this.animations = config.animations || {
            idleDown: [
                [0,0]
            ]

        }
        this.currentAnimation = config.currentAnimation || "idleDown";
        this.currentAnimationFrame = 0;

        this.gameObject = config.gameObject;
    }

    draw(ctx) {
        const x = this.gameObject.x;
        const y = this.gameObject.y;

        this.isLoaded && ctx.drawImage(
            this.image,
            0,0,
            this.image.width/4,this.image.height/4,
            x,y,
            this.image.width / 8,this.image.height / 8
        )
    }
}