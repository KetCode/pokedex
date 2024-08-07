async function getEvolutions(pokemonSpecies) {
    try {
        const evolutionChainUrl = pokemonSpecies.evolution_chain.url
        const response = await fetch(evolutionChainUrl)
        const data = await response.json()
        const evolutions = data.chain
        displayEvolutions(evolutions)
    } catch (error) {
        console.log(error)
    }
}