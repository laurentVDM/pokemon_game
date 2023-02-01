class Battle {
  constructor() {
    this.combatants = {
      "player1": new Combatant({
        ...PokemonsList[0][0],
        team: "player",
        hp: 30,
        maxHp: 50,
        xp: 75,
        maxXp: 100,
        level: 100,
        status: null,
        /*status: {
          type: "soin",
          img: "/img/status/brulure.png",
          expiresIn: 1
        },
        */
        actions: ["soinStatus", "damage1"],
        isPlayerControlled: true
      }, this),
      "enemy1": new Combatant({
        ...PokemonsList[0][1],
        team: "enemy",
        hp: 20,
        maxHp: 100,
        xp: 20,
        maxXp: 100,
        level: 1,
        actions: ["paralyseStatus","damage1"]
      }, this),
      "enemy2": new Combatant({
        ...PokemonsList[0][2],
        team: "enemy",
        hp: 25,
        maxHp: 50,
        xp: 30,
        maxXp: 100,
        level: 1,
        actions: ["damage1"]
      }, this)
    }
    this.activeCombatants = {
      player: "player1",
      enemy: "enemy1",
    }
    this.items = [
      {actionId: "item_recoverStatus", instanceId: "p1", team: "player"},
      {actionId: "item_recoverStatus", instanceId: "p2", team: "player"},      
      {actionId: "item_recoverStatus", instanceId: "p3", team: "enemy"},
      {actionId: "item_recoverHp", instanceId: "p4", team: "player"},
    ]
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("Battle");
    this.element.innerHTML = (`
    <div class="Battle_hero">
      <img src="${'img/personages/pokemon_hero_back_battle.png'}" alt="Hero" />
    </div>
    <div class="Battle_enemy">
      <img src=${'img/personages/perso2.png'} alt="Enemy" />
    </div>
    `)
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);

    Object.keys(this.combatants).forEach(key => {
      let combatant = this.combatants[key];
      combatant.id = key;
      combatant.init(this.element);
    })

    //creation cycle de tour, apres chauque tour on recoit une reponse, qu'on traite differement
    this.turnCycle = new TurnCycle({
      battle : this,
      onNewEvent: event => {
        return new Promise(resolve => {
          const battleEvent = new BattleEvent(event, this)
          battleEvent.init(resolve);
        })
      }
    })
    this.turnCycle.init();

  }

}