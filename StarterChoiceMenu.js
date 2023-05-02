class StarterChoiceMenu {
    constructor({pokemons,storyFlag,onComplete}) {
        this.pokemons = pokemons;
        this.storyFlag = storyFlag
        this.onComplete = onComplete;
    }

    getOptions(pageKey) {
        console.log("this.pokemons", this.pokemons)
        //page par defaut
        if (pageKey === "root") {
            const choices = Object.keys(this.pokemons).map((key) => {
                const {pokemonId} = this.pokemons[key];
                const base = PokemonsList[0][pokemonId];
                return {
                    label: `<img src="${base.icon}" width=15% height=140%></img>`+base.name ,
                    description: `Choisir ${base.name}`,
                    handler: () => {
                        const selectedPokemon = this.pokemons[key]; 
                        const storyflagParam = this.storyFlag;                                             
                        this.onComplete(selectedPokemon, storyflagParam);
                        this.close(); 
                    }
                }
            });

            
            return[
                ...choices,
                {
                    label: "Fermer menu",
                    description: "Ferme le menu",
                    handler: () => {
                        this.close();
                    }
                }
            ]
        }
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("StarterMenu");
        // -- this.element.classList.add("overlayMenu");
        this.element.innerHTML = (`
            <h2>Starter Choice Menu</h2>
        `)
    }

    close() {
        this.esc?.unbind();
        this.keyboardMenu.end();
        this.element.remove();
        this.onComplete();
    }
    
    async init(container) {
        this.createElement();
        this.keyboardMenu = new KeyboardMenu({
          descriptionContainer: container
        })
        this.keyboardMenu.init(this.element);
        this.keyboardMenu.setOptions(this.getOptions("root"));
    
        container.appendChild(this.element);
    
        //attendre prc esc ouvre aussi le menu
        utils.wait(200);
        this.esc = new KeyPressListner("Escape", () => {
            this.close();
        })
    }
}