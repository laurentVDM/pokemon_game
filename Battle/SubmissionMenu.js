class SubmissionMenu {
    constructor({caster, enemy, onComplete}){
        this.caster = caster;
        this.enemy = enemy;
        this.onComplete = onComplete;
    }

    getPages() {

        const backOption = {
            label: "Retour",
            description: "Retourne a la page d'avant",
            handler: () =>{
                this.keyboardMenu.setOptions( this.getPages().root)
            }
        };

        return {
            root: [
                {
                    label: "Attaque",
                    description: "Choisi une attaque",
                    handler: () =>{
                        //choise attack
                        this.keyboardMenu.setOptions( this.getPages().attacks)
                    }
                },
                {
                    label: "Items",
                    description: "Choisi un objet",
                    handler: () =>{
                        //go to item page
                        this.keyboardMenu.setOptions( this.getPages().items)
                    }
                },
                {
                    label: "Equipe",
                    description: "Change de pokemon",
                    handler: () =>{
                        //see pokemon options
                    }
                },

            ],
            attacks: [
                ...this.caster.actions.map(key => {
                    const action = Actions[key];
                    return {
                        label: action.name,
                        description: action.description,
                        handler: () => {
                            this.menuSubmit(action);
                        }
                    }
                }),
                backOption
            ],
            items: [
                {

                },
                backOption
            ]
        }
    }

    menuSubmit(action, instanceId=null) {

        this.keyboardMenu?.end();

        this.onComplete({
            action,
            target: action.targetType === "friendly" ? this.caster : this.enemy
        })
    }

    decide() {
        //decide random attack for enemy
        //const randomNum = utils.randomFromArray( [0,1,2,3])
        //this.menuSubmit(Actions[ this.caster.actions[randomNum] ]);
        this.menuSubmit(Actions[ this.caster.actions[0] ]);
    }

    showMenu(container) {
        this.keyboardMenu = new KeyboardMenu();
        this.keyboardMenu.init(container);
        this.keyboardMenu.setOptions( this.getPages().root )
    }

    init(container) {
        if( this.caster.isPlayerControlled) {
            this.showMenu(container)
        }else{
            this.decide()
        }
    }
}