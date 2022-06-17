class GameObject {
    constructor(config) {
        this.id = null;
        this.isMounted = false;
        this.x = config.x || 0;     //on defini x ou 0 par defaut
        this.y = config.y || 0;
        this.direction = config.direction || "down";
        this.sprite = new Sprite( {
            gameObject: this,
            src: config.src || "/img/personages/personage.png",
        });

        this.behaviorLoop = config.behaviorLoop || [];
        this.behaviorLoopIndex = 0;

        this.talking = config.talking || [];
    }

    mount(map) {
        console.log("mounting");
        this.isMounted = true;
        map.addWall(this.x, this.y);

        //if we have behavior, kick off after delay
        setTimeout(() => {
            this.doBehaviorEvent(map);
        }, 10)
    }

    update() {

    }

    async doBehaviorEvent(map) {

        //dont do anything if there is a cutscene or there is no config to do anything
        if(map.isCutscenePlaying || this.behaviorLoop.length === 0 || this.isStanding ) {
            return;
        }

        //setting up our event with relevent info
        let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
        eventConfig.who = this.id;

        //create an event instance out of our next event config
        const eventHandler = new OverWorldEvent({ map, event: eventConfig });
        await eventHandler.init();

        //setting next event to fire
        this.behaviorLoopIndex += 1;
        if (this.behaviorLoopIndex === this.behaviorLoop.length) {
            this.behaviorLoopIndex = 0;
        }

        //do it again
        this.doBehaviorEvent(map);
    }
}