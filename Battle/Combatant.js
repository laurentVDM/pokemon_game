class Combatant {
  constructor(config, battle) {
    Object.keys(config).forEach(key => {
      this[key] = config[key];
    })
    this.hp = typeof(this.hp) === "undefined" ? this.maxHp : this.hp
    this.battle = battle;
  }

  get hpPercent() {
    const percent = this.hp / this.maxHp * 100;
    return percent > 0 ? percent : 0;
  }

  get xpPercent() {
    return this.xp / this.maxXp * 100;
  }

  get isActive() {
    return this.battle.activeCombatants[this.team] === this.id;
  }

  get givesXp() {
    return this.level *20;
  }

  createElement() {
    this.hudElement = document.createElement("div");
    this.hudElement.classList.add("Combatant");
    this.hudElement.setAttribute("data-combatant", this.id);
    this.hudElement.setAttribute("data-team", this.team);
    this.hudElement.innerHTML = (`
      <p class="Combatant_name">${this.name}</p>
      <p class="Combatant_level"></p>
      <div class="Combatant_character_crop">
        <img class="Combatant_character" alt="${this.name}" src="${this.src}" />
      </div>
      <p class="Combatant_hp"></p>
      <svg viewBox="0 0 52 3" class="Combatant_life-container">
        <rect x=0 y=0 width="0%" height=1 fill="#82ff71" />
        <rect x=0 y=1 width="0%" height=2 fill="#3ef126" />
      </svg>
      <svg viewBox="0 0 64 2" class="Combatant_xp-container">
        <rect x=0 y=0 width="0%" height=1 fill="#ffd76a" />
        <rect x=0 y=1 width="0%" height=1 fill="#ffc934" />
      </svg>
      <p class="Combatant_status"></p>
    `);
    
    //<img class="Combatant_type" src="${this.icon}" alt="${this.type}" />
    
    this.pokemonElement = document.createElement("img");
    this.pokemonElement.classList.add("Pokemon");
    //si team du joueur on prend image de dos, sinon image normale
    const bonneImage = this.team ==="player" ? this.back_image : this.image
    this.pokemonElement.setAttribute("src", bonneImage );
    this.pokemonElement.setAttribute("alt", this.name );
    this.pokemonElement.setAttribute("data-team", this.team );

    this.hpFills = this.hudElement.querySelectorAll(".Combatant_life-container > rect");
    this.xpFills = this.hudElement.querySelectorAll(".Combatant_xp-container > rect");
  }

  update(changes={}) {
    //Update anything incoming
    Object.keys(changes).forEach(key => {
      this[key] = changes[key]
    });

    //Update active flag to show the correct pokemon & hud
    this.hudElement.setAttribute("data-active", this.isActive);
    this.pokemonElement.setAttribute("data-active", this.isActive);

    //Update HP & XP percent fills
    this.hpFills.forEach(rect => rect.style.width = `${this.hpPercent}%`)
    this.xpFills.forEach(rect => rect.style.width = `${this.xpPercent}%`)

    //Update level on screen
    this.hudElement.querySelector(".Combatant_level").innerText = "Niv." + this.level;

    //Update hp on screen (added)
    this.hudElement.querySelector(".Combatant_hp").innerText = this.hp + " / " + this.maxHp;

    //status
    const statusElement = this.hudElement.querySelector(".Combatant_status");
    if (this.status) {
      statusElement.innerText = this.status.type;
      statusElement.style.display = "block";
    } else {
      statusElement.innerText = "";
      statusElement.style.display = "none";
    }
  }

  getReplacedEvents(originalEvents) {

    if(this.status?.type === "paralyse" && utils.randomFromArray([true, true, false, false])) {  //25% chance
      return [
        {type: "textMessage", text: `${this.name} est paralyse, il n'a pas pu attaquer`}
      ]
    }
    return originalEvents;
  }

  getPostEvents() {
    if (this.status?.type === "soin") {
      return [
        {type: "textMessage", text: `${this.name} se soigne` },
        {type: "stateChange", recover: 10, onCaster: true }
      ]
    }
    return[];
  }

  decrementStatus() {
    if(this.status?.expiresIn > 0) {
      this.status.expiresIn -= 1;
      if(this.status?.expiresIn === 0) {
        this.update({
          status: null
        })
        return {
          type: "textMessage",
          text: "fin de status"
        }
      }
    }
    return null;
  }

  init(container) {
    this.createElement();
    container.appendChild(this.hudElement);
    container.appendChild(this.pokemonElement);
    this.update();
  }

}