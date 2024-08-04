const searchInput = document.getElementById('search-input');
const suggestionsList = document.getElementById('suggestions-list');
let debounceTimeout = null;

searchInput.addEventListener('input', () => {
  const pokemonName = searchInput.value.trim(); // trim metodo que remove espaços entre ambos (inicio e fim) | It removes any whitespace characters (spaces, tabs, line breaks, etc.) from the start and end of the string
  
  if (pokemonName.length >= 3) {
    clearTimeout(debounceTimeout); // Prevent a function from running multiple times and Cancel a timer that is no longer needed
    debounceTimeout = setTimeout(() => {
      pokeApi.searchPokemonsByNames(pokemonName)
        .then((pokemons) => {
          const suggestions = pokemons.map((pokemon) => pokemon.name);
          suggestionsList.innerHTML = '';
          suggestions.forEach((suggestion) => {
            const suggestionElement = document.createElement('li');
            suggestionElement.textContent = suggestion;
            suggestionsList.appendChild(suggestionElement);
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }, 500);
  } else {
    clearTimeout(debounceTimeout);
    suggestionsList.innerHTML = '';
  }
});