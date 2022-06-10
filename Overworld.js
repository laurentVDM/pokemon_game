class Overworld{
    constructor(config){
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
    }

    init(){
        const image = new Image();
        image.onload = () =>{
            this.ctx.drawImage(image,0,0)
        }
        image.src = "/img/maps/ville1.png";

        //Placer des gameObjects
        const hero = new GameObject({
            x:5,
            y:6,
        });

        const player2 = new GameObject({
            x:3,
            y:4,
            src: "/img/personages/perso2.png"
        });

        setTimeout(()=>{
            hero.sprite.draw(this.ctx);
            player2.sprite.draw(this.ctx);
        },200);
    }

}