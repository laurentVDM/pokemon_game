

(function() {
    const promises = []
    for(let i=1; i<= 649/*649*/; i++) {
      const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
      promises.push(fetch(url).then((res) => res.json()));      
    }
    
    Promise.all(promises).then((results)=>{
      const pokemon = results.map((result) =>({
        name: result.name,
        icon: result.sprites.versions['generation-v']['black-white']['front_default'],
        image: result.sprites.versions['generation-v']['black-white'].animated['front_default'],
        back_image: result.sprites.versions['generation-v']['black-white'].animated['back_default'],
        type: result.types.map((type) => type.type.name).join(', '),
        id: result.id,
        stats: result.stats.map((stat) => stat.stat.name + ": " + stat.base_stat).join(', ')
      }));
      PokemonsList.push(pokemon)
    })
    setTimeout(function() {
    },3000);
})
();

//const 