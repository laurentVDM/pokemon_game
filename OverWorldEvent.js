class OverWorldEvent {
    constructor({map, event}) {
        this.map = map;
        this.event = event;
    }

    stand(resolve) {
        const who = this.map.gameObjects[this.event.who];
        who.startBehavior({
            map: this.map
        }, {
            type: "stand",
            direction: this.event.direction,
            time: this.event.time
        })

        //set up a handler to complete when a person is done standing
        //then resolve the event
        const completeHandler = e => {
            if(e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonStandComplete", completeHandler);
                resolve();
            }
        }

        document.addEventListener("PersonStandComplete", completeHandler)
    }

    walk(resolve) {
        const who = this.map.gameObjects[this.event.who];
        who.startBehavior({
            map: this.map
        }, {
            type: "walk",
            direction: this.event.direction,
            retry: true
        })

        //set up a handler to complete when a person is done walking
        //then resolve the event
        const completeHandler = e => {
            if(e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonWalkingComplete", completeHandler);
                resolve();
            }
        }

        document.addEventListener("PersonWalkingComplete", completeHandler)
    }

    textMessage(resolve) {

        if(this.event.faceHero) {
            const obj = this.map.gameObjects[this.event.faceHero];
            obj.direction = utils.oppositDirection(this.map.gameObjects["hero"].direction);
        }

        const message = new TextMessage({
            text: this.event.text,
            onComplete: () => resolve()
        })
        message.init(document.querySelector(".game-container"))
    }

    changeMap(resolve) {

        //desactivate old objects
        Object.values(this.map.gameObjects).forEach(obj => {
            obj.isMounted = false;
        })

        const sceneTransition = new SceneTransition();
        sceneTransition.init(document.querySelector(".game-container"), () => {
            this.map.overworld.startMap(window.OverworldMaps[this.event.map], {
                x: this.event.x,
                y: this.event.y,
                direction: this.event.direction,
            });
            resolve();
            
            sceneTransition.fadeOut();

        });        
    }

    battle(resolve) {
        audio[this.map.overworld.progress.mapId].pause()
        const battle = new Battle({
            enemy: Enemies[this.event.enemyId],
            onComplete: (didWin) => {
                resolve(didWin ? "WON_BATTLE": "LOST_BATTLE");
                //plays music of the map again
                utils.stopAllMusic();
                audio[this.map.overworld.progress.mapId].play();
            }
        })
        battle.init(document.querySelector(".game-container"));
        //audio[map].play();
    }

    pause(resolve){
        this.map.isPaused = true;
        const menu = new PauseMenu({
            progress: this.map.overworld.progress,
            onComplete: () => {
                resolve();                
                this.map.isPaused = false;
                this.map.overworld.startGameLoop();
            }
        });
        menu.init(document.querySelector(".game-container"));
    }

    addStoryFlag(resolve) {
        window.playerState.storyFlags[this.event.flag] = true;
        resolve();
    }

    addItem(resolve) {
        playerState.pushItem(this.event.item);
        resolve();
    }

    selectPokemon(resolve) {
        this.map.isPaused = true;
        const menu = new StarterChoiceMenu({
            pokemons: this.event.pokemons,
            storyFlag: this.event.storyFlag,
            onComplete: (selectedPokemon, storyflagParam) => {
                if(selectedPokemon){
                    console.log("y a un choix")
                    playerState.pushPokemon(selectedPokemon);
                    console.log("storyFlag", storyflagParam)
                    playerState.storyFlags[storyflagParam] = true;
                }else{
                    resolve();
                    this.map.isPaused = false;
                    this.map.overworld.startGameLoop();
                }
            },
        });
        menu.init(document.querySelector('.game-container'));
    }

    init() {
        return new Promise(resolve => {
            this[this.event.type](resolve)
        })
    }
}