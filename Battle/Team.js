class Team {
  constructor(team, name) {
    this.team = team;
    this.name = name;
    this.combatants = [];
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("Team");
    this.element.setAttribute("data-team", this.team);
    this.combatants.forEach(c => {
      let icon = document.createElement("div");
      icon.setAttribute("data-combatant", c.id);
      icon.innerHTML = (`
        <svg xmlns="http://www.w3.org/2000/svg" width="7" viewBox="0 -0.5 7 10" shape-rendering="crispEdges">
        <path stroke="#c13939" d="M1 0h5M0 1h7M0 2h2M5 2h2" />
        <path stroke="#000000" d="M2 2h3M0 3h3M4 3h3M2 4h3" />
        <path stroke="#efedfc" d="M3 3h1M0 4h2M5 4h2M0 5h7M1 6h5" />
          
          <!-- Active indicator appears when needed with CSS -->
          <path class="active-pokemon-indicator" stroke="#000000" d="M3 8h1M2 9h3" />
          
          <!-- Dead paths appear when needed with CSS -->
          <path class="dead-pokemon" stroke="#939391" d="M1 0h5M0 1h7M0 2h2M5 2h2" />
          <path class="dead-pokemon" stroke="#000000" d="M2 2h3M0 3h3M4 3h3M2 4h3"/>
          <path class="dead-pokemon" stroke="#efedfc" d="M3 3h1M0 4h2M5 4h2M0 5h7M1 6h5" />
        </svg> 
      `)
      //Add to parent element
      this.element.appendChild(icon)
    })
  }

  update() {
    this.combatants.forEach(c => {
      const icon = this.element.querySelector(`[data-combatant="${c.id}"]`)
      icon.setAttribute("data-dead", c.hp <= 0 );
      icon.setAttribute("data-active", c.isActive );
    })
  }

  init(container) {
    this.createElement();
    this.update();
    container.appendChild(this.element);
  }
}