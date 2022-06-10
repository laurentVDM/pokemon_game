class GameObject{
    constructor(config){
        this.x = config.x || 0;     //on defini x ou 0 par defaut
        this.y = config.y || 0;
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || "/img/personages/personage.png",
        });
    }
}