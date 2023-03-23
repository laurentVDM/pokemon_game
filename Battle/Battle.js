class Battle {
  constructor({enemy, onComplete}) {

    this.enemy = enemy;
    this.onComplete = onComplete;
    this.copy = new Object;

    this.combatants = {}

    this.activeCombatants = {
      player: null,
      enemy: null,
    }

    if(this.enemy.name === "savage"){
      this.randomPokemon();
    }
    

    //dynamically add player team
    window.playerState.lineup.forEach(id => {
      this.addCombatant(id, "player", window.playerState.pokemons[id])
    })
    //now enemy team
    Object.keys(this.enemy.pokemons).forEach(key => {
      this.addCombatant("e_"+key, "enemy", this.enemy.pokemons[key])
    })
    
    //starts empty
    this.items = [];

    //add in player items
    window.playerState.items.forEach( item => {
      this.items.push({
        ...item,
        team: "player"
      })
    })
    this.usedInstanceIds = {};
  }

  randomPokemon(){   
      let pokeLength = Object.keys(this.enemy.pokemons).length;
      let random = Math.floor(Math.random()*pokeLength+1)
      for(let i=0; i<pokeLength; i++){
        this.copy[i] = this.enemy.pokemons[i]
        if(i !== random-1){          
          delete this.enemy.pokemons[i]
        }
      }    
  }

  addCombatant(id, team, config) {
    this.combatants[id] = new Combatant({      
      ...PokemonsList[0][config.pokemonId],
      ...config,
      team,
      isPlayerControlled: team === "player"
    }, this)

    //Populate first active pokemon
    this.activeCombatants[team] = this.activeCombatants[team] || id
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("Battle");
    this.element.innerHTML = (`
    <div class="Battle_hero">
      <img src="${'img/personages/pokemon_hero_back_battle.png'}" alt="Hero" />
    </div>
    <div class="Battle_enemy">
      <img src=${this.enemy.src} alt=${this.enemy.name} />
    </div>
    `)
  }

  init(container) {
    utils.stopAllMusic();
    audio.battle.play();

    this.createElement();
    container.appendChild(this.element);

    this.playerTeam = new Team("player", "Hero");
    this.enemyTeam = new Team("enemy", "Bully");

    Object.keys(this.combatants).forEach(key => {
      let combatant = this.combatants[key];
      combatant.id = key;
      combatant.init(this.element);

      //Add to correct team
      if(combatant.team === "player") {
        this.playerTeam.combatants.push(combatant)
      } else if(combatant.team === "enemy") {
        this.enemyTeam.combatants.push(combatant)
      }
    })

    this.playerTeam.init(this.element);
    this.enemyTeam.init(this.element);

    //creation cycle de tour, apres chauque tour on recoit une reponse, qu'on traite differement
    this.turnCycle = new TurnCycle({
      battle : this,
      onNewEvent: event => {
        return new Promise(resolve => {
          const battleEvent = new BattleEvent(event, this)
          battleEvent.init(resolve);
        })
      },
      onWinner: winner => {
        //sauvegarde ce qui s'est passé en combat
        const playerState = window.playerState;
        Object.keys(playerState.pokemons).forEach(id => {
          const playerStatePokemon = playerState.pokemons[id];
          const combatant = this.combatants[id];
          if (combatant) {
            playerStatePokemon.maxHp = combatant.maxHp;
            playerStatePokemon.hp = combatant.hp;
            playerStatePokemon.maxXp = combatant.maxXp;
            playerStatePokemon.xp = combatant.xp;
            playerStatePokemon.level = combatant.level;
            playerStatePokemon.status = combatant.status;
          }
        })
        //get rid of player used items
        playerState.items = playerState.items.filter( item => {
          return !this.usedInstanceIds[item.instanceId]
        })

        //if savage pokemon reput all pokemons in the list
        this.enemy.pokemons = this.copy;
        

        this.element.remove();
        this.onComplete(winner==="player");
        //TODO: gerer si ennemy gagne
      }
    })
    this.turnCycle.init();

  }

}