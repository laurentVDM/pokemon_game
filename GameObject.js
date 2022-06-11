class GameObject {
    constructor(config) {
        this.isMounted = false;
        this.x = config.x || 0;     //on defini x ou 0 par defaut
        this.y = config.y || 0;
        this.direction = config.direction || "down";
        this.sprite = new Sprite( {
            gameObject: this,
            src: config.src || "/img/personages/personage.png",
        });
    }

    mount(map) {
        console.log("mounting");
        this.isMounted = true;
        map.addWall(this.x, this.y);
    }

    update() {

    }
}