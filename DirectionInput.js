class DirectionInput {
    constructor(config) {
        this.heldDirection = [];

        this.map = {
            "z" : "up",
            "s" : "down",
            "q": "left",
            "d" : "right"
        }
    }

    get direction() {
        return this.heldDirection[0];
    }

    init() {
        document.addEventListener("keydown", event => {
            const dir = this.map[event.key];
            if(dir && this.heldDirection.indexOf(dir) ===-1) {
                this.heldDirection.unshift(dir);
            }
        });
        document.addEventListener("keyup", event => {
            const dir = this.map[event.key];
            const index = this.heldDirection.indexOf(dir);
            if(index > -1) {
                this.heldDirection.splice(index, 1); 
            }
        })
    }
}