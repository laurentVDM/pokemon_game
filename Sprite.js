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
            "idle-down" : [ [0,0] ],
            "idle-left" : [ [0,1] ],
            "idle-right": [ [0,2] ],
            "idle-up"   : [ [0,3] ],
            "walk-down" : [ [1,0], [0,0], [3,0], [0,0] ],
            "walk-left" : [ [1,1], [0,1], [3,1], [0,1] ],
            "walk-right": [ [1,2], [0,2], [3,2], [0,2] ],
            "walk-up"   : [ [1,3], [0,3], [3,3], [0,3] ]
        }
        this.currentAnimation = "idle-right"; // config.currentAnimation || "idle-Down";
        this.currentAnimationFrame = 0;

        this.animationFrameLimit = config.animationFrameLimit || 12;     //vitesse d'animation
        this.animationFrameProgress = this.animationFrameLimit;

        //reference the game object
        this.gameObject = config.gameObject;
    }

    get frame() {
        return this.animations[this.currentAnimation][this.currentAnimationFrame]
    }

    setAnimation(key) {
        if(this.currentAnimation !== key) {
            this.currentAnimation = key;
            this.currentAnimationFrame = 0;
            this.animationFrameProgress = this.animationFrameLimit;
        }
    }

    updateAnimationProgress() {
        //downtick frame progress
        if(this.animationFrameProgress > 0){
            this.animationFrameProgress -= 1;
            return;
        }

        //reset counter
        this.animationFrameProgress = this.animationFrameLimit;
        this.currentAnimationFrame +=1;

        if(this.frame === undefined){
            this.currentAnimationFrame = 0;
        }
    }

    draw(ctx, cameraPerson) {
        const x = this.gameObject.x - 8 + utils.withGrid(10.5) - cameraPerson.x;
        const y = this.gameObject.y - 2 + utils.withGrid(5) - cameraPerson.y;

        const [frameX, frameY] = this.frame;

        this.isLoaded && ctx.drawImage(
            this.image,
            frameX *64 , frameY *64,
            this.image.width/4,this.image.height/4,
            x,y,
            this.image.width / 8,this.image.height / 8
        )      

        this.updateAnimationProgress();
    }
}