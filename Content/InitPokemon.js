

(function() {
    const promises = []
    for(let i=1; i<= 649/*649*/; i++) {
      const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
      promises.push(fetch(url).then((res) => res.json()));      
    }
    console.log(promises)
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
      console.log("list",PokemonsList)
    })
    setTimeout(function() {
        console.log('Les pokemons sont la');
    },3000);
})
();

//const 