class SubmissionMenu {
    constructor({caster, enemy, onComplete, items, replacements}){
        this.caster = caster;
        this.enemy = enemy;
        this.replacements = replacements;
        this.onComplete = onComplete;

        let quantityMap= {};
        items.forEach(item => {
            if(item.team === caster.team) {
                let existing = quantityMap[item.actionId];
                if(existing) {
                    existing.quantity += 1;
                } else{
                    quantityMap[item.actionId] = {
                        actionId: item.actionId,
                        quantity: 1,
                        instanceId: item.instanceId
                    }
                }
            }
        });
        this.items = Object.values(quantityMap);
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
                        this.keyboardMenu.setOptions( this.getPages().replacements)
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
                ...this.items.map(item => {
                    const action = Actions[item.actionId];
                    return {
                        label: action.name,
                        description: action.description,
                        right: () => {
                            return "x"+item.quantity
                        },
                        handler: () => {
                            this.menuSubmit(action, item.instanceId);
                        }
                    }
                }),
                backOption
            ],
            replacements: [
                ...this.replacements.map(replacement => {
                    return {
                        label: replacement.name,
                        description: replacement.description,
                        handler: () => {
                           //swap
                           this.menuSubmitReplacement(replacement)
                        }
                    }
                }),
                backOption
            ]
        }
    }

    menuSubmitReplacement(replacement) {
        this.keyboardMenu?.end();
        this.onComplete({
            replacement
        })
    }

    menuSubmit(action, instanceId=null) {

        this.keyboardMenu?.end();

        this.onComplete({
            action,
            target: action.targetType === "friendly" ? this.caster : this.enemy,
            instanceId,
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