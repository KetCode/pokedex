document.getElementById('search-button').addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = document.getElementById('search-input');
    const pokemonName = searchInput.value.trim();
  
    if (pokemonName) {
      pokeApi.getPokemonByName(pokemonName)
        .then((pokemon) => {
          console.log(pokemon);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  });