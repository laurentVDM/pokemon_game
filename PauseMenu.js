class PauseMenu {
  constructor({onComplete}) {
    this.onComplete = onComplete;
  }

  getOptions(pageKey) {

    //page par defaut
    if (pageKey === "root") {
      return [
        //...lineupPizzas,
        {
            label: "Equipe",
            description: "voir votre equipe",
            handler: () => {
                this.keyboardMenu.setOptions( this.getOptions("team") )
            }
          },
        {
            label: "Save",
            description: "Save your progress",
            handler: () => {
                //We'll come back to this...
            }
        },
        {
            label: "Fermer menu",
            description: "Ferme le menu de pause",
            handler: () => {
                this.close();
            }
        }
      ]
    }
    //si on appuye sur le bouton equipe
    if (pageKey === "team") {
        const lineupPokemons = playerState.lineup.map(id => {
            const {pokemonId} = playerState.pokemons[id];
            const base = PokemonsList[0][pokemonId];
            return {
                //lable affiche l'image du pokemon + le nom
                label: `<img src="${base.icon}" width=15% height=140%></img>`+base.name ,
                description: `Choisir ${base.name}`,
                handler: () => {
                    this.keyboardMenu.setOptions( this.getOptions(id) )
                }
            }
        })
        return [
            ...lineupPokemons,
            {
                label: "Retour",
                description: "Retour au menu",
                handler: () => {
                    this.keyboardMenu.setOptions( this.getOptions("root") );
                }
            }
        ]
    }
    //pour pokemon par ID
    return [
        {
            label: "Déplacer",
            description: "Met le pokemon à l'avant de l'équipe",
            handler: () => {
                playerState.moveToFront(pageKey);
                this.keyboardMenu.setOptions( this.getOptions("team") );
            }
        },
        {
            label: "Retour",
            description: "Retour au menu équipe",
            handler: () => {
                this.keyboardMenu.setOptions( this.getOptions("team") );
            }
        }
    ];    
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("PauseMenu");
    // -- this.element.classList.add("overlayMenu");
    this.element.innerHTML = (`
        <h2>Pause Menu</h2>
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