async function loadPokemon(id) {
    try {
        const [poke, pokemonSpecies] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => res.json()),
        ]);

        const abilitiesWrapper = document.querySelector(".pokemon-detail-wrap .pokemon-detail.move");
        abilitiesWrapper.innerHTML = "";

        if (currentPokemonID === id) {
            displayPokemonDetails(poke);
            const flavorText = getEnglishFlavorText(pokemonSpecies);
            document.querySelector(".body3-fonts.pokemon-description").textContent = flavorText;

            // window.history.pushState({}, "", `.detail.html?id=${id}`);
        }

        getEvolutions(pokemonSpecies);

        return true;
    }
    catch (error) {
        console.error("Ocorreu um erro ao consultar os detalhes do pokemon", error);
        return false;
    }
}