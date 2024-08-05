const searchInput = document.getElementById('search-input');
const suggestionsList = document.getElementById('suggestions-list');
let debounceTimeout = null;

searchInput.addEventListener('input', () => {
  const pokemonName = searchInput.value.trim(); // trim metodo que remove espaços entre ambos (inicio e fim) | It removes any whitespace characters (spaces, tabs, line breaks, etc.) from the start and end of the string
  
  if (pokemonName.length >= 2) {
    clearTimeout(debounceTimeout); // Prevent a function from running multiple times and Cancel a timer that is no longer needed
    debounceTimeout = setTimeout(() => {
      pokeApi.searchPokemonsByNames(pokemonName)
        .then((pokemons) => {
          const suggestions = pokemons.filter((pokemon) => pokemon.name.startsWith(pokemonName)).map((pokemon) => pokemon.name);
          suggestionsList.textContent = '';
          if (suggestions.length === 0) {
            const noResultsElement = document.createElement('li');
            noResultsElement.textContent = 'No results found';
            suggestionsList.appendChild(noResultsElement);
          } else {
            suggestions.forEach((suggestion) => {
              const suggestionElement = document.createElement('li');
              suggestionElement.textContent = suggestion;
              suggestionElement.addEventListener('click', (e) => {
                e.stopPropagation();
                const pokemonName = suggestion;

                pokeApi.getPokemonByName(pokemonName)
                  .then((pokemon) => {
                    window.location.assign(`./detail.html?id=${pokemon.number}`);
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              });
              suggestionsList.appendChild(suggestionElement);
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }, 500);
  } else {
    clearTimeout(debounceTimeout);
    suggestionsList.textContent = '';
  }
});