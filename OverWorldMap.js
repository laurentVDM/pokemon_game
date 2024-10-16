class OverWorldMap {
    constructor(config) {
        this.overworld = null;
        this.gameObjects = {};  //live objects
        this.configObjects = config.configObjects; //configuration objets

        this.cutSceneSpaces = config.cutSceneSpaces || {};
        this.walls = config.walls || {};
        this.battleZoneSpaces = config.battleZoneSpaces || {};

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;

        this.isCutscenePlaying = false;
        this.isPaused = false;
    }

    drawLowerImage(ctx, cameraPerson) {
        ctx.drawImage(
            this.lowerImage,
            utils.withGrid(10.5)- cameraPerson.x,
            utils.withGrid(5)- cameraPerson.y
        )
    }
    drawUpperImage(ctx, cameraPerson) {
        ctx.drawImage(
            this.upperImage,
            utils.withGrid(10.5)- cameraPerson.x,
            utils.withGrid(5)- cameraPerson.y
        )
    }

    isSpaceTaken(currentX, currentY, direction) {
        const {x,y} = utils.nextPosition(currentX, currentY, direction);
        if (this.walls[`${x},${y}`]) {
            return true;
        }
        //Check for game objects at this position
        return Object.values(this.gameObjects).find(obj => {
            if (obj.x === x && obj.y === y) { return true; }
            if (obj.intentPosition && obj.intentPosition[0] === x && obj.intentPosition[1] === y ) {
               return true;
            }
            return false;
        })
    }

    mountObjects() {
        Object.keys(this.configObjects).forEach(key => {
            let object = this.configObjects[key];
            object.id = key;
      
            let instance;
            if (object.type === "Person") {
                instance = new Person(object);
            }
            if (object.type === "PokeballStone") {
                instance = new PokeballStone(object);
            }
            if (object.type === "StarterChoice") {
                instance = new StarterChoice(object);
            }
            this.gameObjects[key] = instance;
            this.gameObjects[key].id = key;
            instance.mount(this);
        })
    }

    async startCutScene(events) {
        this.isCutscenePlaying = true;

        //start loop of async events
        //await each one
        for(let i=0; i<events.length; i++) {
            const eventHandler = new OverWorldEvent({
                event: events[i],
                map: this,
            })
            const result = await eventHandler.init();
            if (result === "LOST_BATTLE"){
                break;
            }
        }

        this.isCutscenePlaying = false;

        //reset npc to do their idle behavior
        //Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this));
    }

    checkForFootstepCutScene() {
        const hero = this.gameObjects["hero"];
        const match = this.cutSceneSpaces[`${hero.x},${hero.y}`];
        const matchBattleZoneSpaces = this.battleZoneSpaces[`${hero.x},${hero.y}`];    //check if hero is on battlezone
        if(!this.isCutscenePlaying && match && match[0].required) {
            const relevantScenario = match.find(scenario => {
                return (scenario.required || []).every(sf => {
                    return playerState.storyFlags[sf]
                })
            })
            relevantScenario && this.startCutScene(relevantScenario.events)
        }

        else if (!this.isCutscenePlaying && match) {
            this.startCutScene( match[0].events) 
        }
        else if (matchBattleZoneSpaces && utils.randomFromArray([true, false, false, false, false, false])){    //1 chance sur 6 
            this.startCutScene(matchBattleZoneSpaces.events)
        }

    }

    checkForActionCutScene() {
        const hero = this.gameObjects["hero"];
        const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
        const match = Object.values(this.gameObjects).find(object => {
            return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
        })
        if(!this.isCutscenePlaying && match && match.talking.length) {

            const relevantScenario = match.talking.find(scenario => {
                return (scenario.required || []).every(sf => {
                    return playerState.storyFlags[sf]
                })
            })
            relevantScenario && this.startCutScene(relevantScenario.events)
        }
    }

    
}

window.OverworldMaps = {
    ProfLab: {
        id: "ProfLab",
        lowerSrc: "img/maps/prof_lab.png",
        upperSrc: "img/maps/prof_lab_upper.png",
        configObjects: {
            hero: {
                type: "Person",
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(6)
            },
            professeur:{
                type: "Person",
                x: utils.withGrid(9),
                y: utils.withGrid(11),
                src: "img/personages/professeur.png"
            },
            starterChoice1: {
                type: "StarterChoice",
                x: utils.withGrid(3),
                y: utils.withGrid(4),
                storyFlag: "Starter_GOT",   //meme dans StartChoiceMenu
                pokemons: {
                    "p1": {
                        pokemonId: 0,
                        maxHp: 50,
                        maxXp: 100,
                    },
                    "p2": {
                        pokemonId: 3,
                        maxHp: 50,
                        maxXp: 100,
                    },
                    "p3": {
                        pokemonId:6,
                        maxHp: 50,
                        maxXp: 100,
                    }

                }
            },
        },
        cutSceneSpaces: {
            [utils.asGridCoord(9,17)] : [
                {
                    events: [
                        {   
                            //TODO:changer ou on est tp
                            type: "changeMap",
                            map: "Ville_depart",
                            x:utils.withGrid(17),   
                            y:utils.withGrid(36),
                            direction: "down"
                        }
                    ]
                }
            ],
        }
    },
    Centre_Pokemon: {
        id: "Centre_Pokemon",
        lowerSrc: "img/maps/centrepokemonLower.png",
        upperSrc: "img/maps/centrepokemonUpper.png",
        configObjects:{
            hero: {  
                type: "Person",              
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(14)
            },
            infirmiere: {
                type: "Person",
                x: utils.withGrid(15),
                y: utils.withGrid(12),
                src: "img/personages/infirmiere.png",
                talking: [
                    {
                        events: [
                            {type: "textMessage", text: "salut c booba", faceHero:"infirmiere"},
                        ]
                    }
                ],
            }
        },
        walls: {  
            //haut gauche
            [utils.asGridCoord(6,11)] : true,
            [utils.asGridCoord(7,11)] : true,
            [utils.asGridCoord(8,11)] : true,
            [utils.asGridCoord(9,11)] : true,
            //gauche mur
            [utils.asGridCoord(5,12)] : true,
            [utils.asGridCoord(5,13)] : true,
            [utils.asGridCoord(5,14)] : true,
            [utils.asGridCoord(5,15)] : true,
            //gauche escalator
            [utils.asGridCoord(6,16)] : true,
            [utils.asGridCoord(7,16)] : true,
            [utils.asGridCoord(6,17)] : true,
            [utils.asGridCoord(7,17)] : true,
            //gauche dessous escalator
            [utils.asGridCoord(5,18)] : true,
            [utils.asGridCoord(5,19)] : true,
            [utils.asGridCoord(5,20)] : true,
            //coin bas gauche
            [utils.asGridCoord(6,21)] : true,
            //mur bas 
            [utils.asGridCoord(7,22)] : true,
            [utils.asGridCoord(8,22)] : true,  
            [utils.asGridCoord(9,22)] : true,
            [utils.asGridCoord(10,22)] : true,
            [utils.asGridCoord(11,22)] : true,  
            [utils.asGridCoord(12,22)] : true,  
            [utils.asGridCoord(13,22)] : true,  
            //laisse 2 pour la porte
            [utils.asGridCoord(16,22)] : true,              
            [utils.asGridCoord(17,22)] : true,                         
            [utils.asGridCoord(18,22)] : true,                          
            [utils.asGridCoord(19,22)] : true,                          
            [utils.asGridCoord(20,22)] : true,              
            [utils.asGridCoord(21,22)] : true,              
            [utils.asGridCoord(22,22)] : true,
            //coin bas droit                          
            [utils.asGridCoord(23,21)] : true, 
        },
        cutSceneSpaces: {
            [utils.asGridCoord(15,22)] : [
                {
                    events: [
                        {
                            type: "changeMap",
                            map: "Ville1",
                            x:utils.withGrid(37),
                            y:utils.withGrid(20),
                            direction: "down"
                        }
                    ]
                }
            ],
        }
    },
    Ville_depart: {
        id: "Ville_depart",
        lowerSrc: "img/maps/ville_depart_lower.png",
        upperSrc: "img/maps/ville_depart_upper.png",
        configObjects: {
            hero: {
                type: "Person",
                isPlayerControlled: true,
                x: utils.withGrid(35),
                y: utils.withGrid(20)
            },
            npc1: {
                type: "Person",
                x: utils.withGrid(15),
                y: utils.withGrid(21),
                src: "img/personages/ghetsis.png",
                talking: [
                    {
                        required:["DEFEATED_NPC1"],
                        events: []
                    },
                    {
                        events: [
                            {type: "textMessage", text: "c'est l'heure du combat", faceHero:"npc1"},
                            {type: "battle", enemyId: "ghetsis"},
                            {type: "addStoryFlag", flag: "DEFEATED_NPC1"},
                        ]
                    }
                ]
            },
            // npc2: {
            //     type: "Person",
            //     x: utils.withGrid(30),
            //     y: utils.withGrid(19),
            //     //src: "img/personages/infirmiere.png",
            //     behaviorLoop: [
            //         { type: "walk", direction: "left"},
            //         { type: "stand", direction: "up", time: 800},
            //         { type: "walk", direction: "up"},
            //         { type: "walk", direction: "right"},
            //         { type: "walk", direction: "down"},
            //     ],
            //     talking: [
            //         {
            //             required: ["TALKED_TO_NPC1"],
            //             events: [
            //                 {type: "textMessage", text: "tu l'as battu? Alors, je veux faire un combat", faceHero:"npc2"},
            //                 {type: "textMessage", text: "Que le meilleur gagne!"},
            //                 {type: "battle", enemyId: "ghetsis"},
            //                 {type: "addStoryFlag", flag: "DEFEATED_NPC2"},
            //                 {type: "textMessage", text: "Wow, quel combat"},
            //             ]
            //         },
            //         {
            //             events: [
            //                 {type: "textMessage", text: "Va battre l'autre gars", faceHero:"npc2"},
            //             ]
            //         }
            //     ]
            // },
            // npc3: {
            //     type: "Person",
            //     x: utils.withGrid(15),
            //     y: utils.withGrid(9),
            //     src: "img/personages/ghetsis.png",
            //     behaviorLoop: [
            //         { type: "stand", direction: "down", time: 1200},
            //         { type: "stand", direction: "right", time: 1200},
            //     ],
            //     talking: [
            //         {
            //             events: [
            //                 {type: "textMessage", text: "c'est l'heure du combat", faceHero:"npc1"},
            //                 {type: "addStoryFlag", flag: "TALKED_TO_NPC1"}
            //                 //{type: "battle", enemyId: "ghetsis"}
            //             ]
            //         }
            //     ]
            // },
            pokeball1: {
                type: "PokeballStone",
                x: utils.withGrid(19),
                y: utils.withGrid(21),
                storyFlag: "USED_ITEM_1",
                item: "item_recoverStatus"
            },
            
        },
        walls: {           
            // [utils.asGridCoord(23,27)] : true,        
        },
        battleZoneSpaces: {
            [utils.asGridCoord(38,21)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },
            [utils.asGridCoord(38,22)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },
            [utils.asGridCoord(38,23)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },
            [utils.asGridCoord(38,24)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },            
            [utils.asGridCoord(38,25)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },

            [utils.asGridCoord(39,21)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },
            [utils.asGridCoord(39,22)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },
            [utils.asGridCoord(39,23)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },
            [utils.asGridCoord(39,24)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },            
            [utils.asGridCoord(39,25)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },

            [utils.asGridCoord(40,21)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },
            [utils.asGridCoord(40,22)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },
            [utils.asGridCoord(40,23)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },
            [utils.asGridCoord(40,24)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },            
            [utils.asGridCoord(40,25)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },           
            [utils.asGridCoord(40,26)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },

            [utils.asGridCoord(41,21)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },
            [utils.asGridCoord(41,22)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },
            [utils.asGridCoord(41,23)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },
            [utils.asGridCoord(41,24)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },            
            [utils.asGridCoord(41,25)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },           
            [utils.asGridCoord(41,26)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },

            [utils.asGridCoord(42,21)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },
            [utils.asGridCoord(42,22)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },
            [utils.asGridCoord(42,23)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },
            [utils.asGridCoord(42,24)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },            
            [utils.asGridCoord(42,25)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },           
            [utils.asGridCoord(42,26)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },

            [utils.asGridCoord(43,21)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },
            [utils.asGridCoord(43,22)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },
            [utils.asGridCoord(43,23)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },
            [utils.asGridCoord(43,24)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },            
            [utils.asGridCoord(43,25)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },           
            [utils.asGridCoord(43,26)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },
         
            [utils.asGridCoord(44,25)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },           
            [utils.asGridCoord(44,26)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },

            [utils.asGridCoord(45,25)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },           
            [utils.asGridCoord(45,26)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },

            [utils.asGridCoord(46,25)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },           
            [utils.asGridCoord(46,26)] : { events: [ {type: "battle", enemyId: "savageVille1"} ] },
            
        },
        cutSceneSpaces: {
            //check if we got starter
            [utils.asGridCoord(23,27)] : [
                {
                    required : ["Starter_GOT"],
                    events: []
                },
                {
                    events: [
                        {type:"textMessage", text: "va voir le professeur"},
                        {who: "hero", type:"walk", direction: "down"}
                    ]
                }    
            ], 
            [utils.asGridCoord(24,27)] : [
                {
                    required : ["Starter_GOT"],
                    events: []
                },
                {
                    events: [
                        {type:"textMessage", text: "va voir le professeur"},
                        {who: "hero", type:"walk", direction: "down"}
                    ]
                }    
            ], 
            [utils.asGridCoord(25,27)] : [
                {
                    required : ["Starter_GOT"],
                    events: []
                },
                {
                    events: [
                        {type:"textMessage", text: "va voir le professeur"},
                        {who: "hero", type:"walk", direction: "down"}
                    ]
                }    
            ],  
            [utils.asGridCoord(26,27)] : [
                {
                    required : ["Starter_GOT"],
                    events: []
                },
                {
                    events: [
                        {type:"textMessage", text: "va voir le professeur"},
                        {who: "hero", type:"walk", direction: "down"}
                    ]
                }    
            ],
            [utils.asGridCoord(27,27)] : [
                {
                    required : ["Starter_GOT"],
                    events: []
                },
                {
                    events: [
                        {type:"textMessage", text: "va voir le professeur"},
                        {who: "hero", type:"walk", direction: "down"}
                    ]
                }    
            ], 
            [utils.asGridCoord(28,27)] : [
                {
                    required : ["Starter_GOT"],
                    events: []
                },
                {
                    events: [
                        {type:"textMessage", text: "va voir le professeur"},
                        {who: "hero", type:"walk", direction: "down"}
                    ]
                }    
            ],  
            //change maps          
            [utils.asGridCoord(17,35)] : [
                {
                    events: [
                        {
                            type: "changeMap",
                            map: "ProfLab",
                            x:utils.withGrid(9),
                            y:utils.withGrid(16),
                            direction: "up"
                        },
                    ]
                }
            ],
            [utils.asGridCoord(43,35)] : [
                {
                    events: [
                        {
                            type: "changeMap",
                            map: "ProfLab", //change with house
                            x:utils.withGrid(9),
                            y:utils.withGrid(16),
                            direction: "up"
                        },
                    ]
                }
            ],
            [utils.asGridCoord(17,44)] : [
                {
                    events: [
                        {
                            type: "changeMap",
                            map: "ProfLab", //change with bottom left house
                            x:utils.withGrid(9),
                            y:utils.withGrid(16),
                            direction: "up"
                        },
                    ]
                }
            ],
            [utils.asGridCoord(30,33)] : [
                {
                    events: [
                        {
                            type: "changeMap",
                            map: "ProfLab", //change with top right house
                            x:utils.withGrid(9),
                            y:utils.withGrid(16),
                            direction: "up"
                        },
                    ]
                }
            ],
            [utils.asGridCoord(33,41)] : [
                {
                    events: [
                        {
                            type: "changeMap",
                            map: "ProfLab", //change with bottom right house
                            x:utils.withGrid(9),
                            y:utils.withGrid(16),
                            direction: "up"
                        },
                    ]
                }
            ],
            //battle
            [utils.asGridCoord(15,22)] : [
                {
                    required : ["DEFEATED_NPC1"],
                    events: []
                },
                {
                    events: [
                        {type: "textMessage", text: "c'est l'heure du combat"},
                        {type: "battle", enemyId: "ghetsis"},
                        {type: "addStoryFlag", flag: "DEFEATED_NPC1"},
                    ]
                }    
            ],
            [utils.asGridCoord(15,23)] : [
                {
                    required : ["DEFEATED_NPC1"],
                    events: []
                },
                {
                    events: [
                        {type: "textMessage", text: "c'est l'heure du combat"},
                        {type: "battle", enemyId: "ghetsis"},
                        {type: "addStoryFlag", flag: "DEFEATED_NPC1"},
                    ]
                }    
            ],

        }

    }
}