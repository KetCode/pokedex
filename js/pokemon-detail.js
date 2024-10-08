let currentPokemonID = null;
const warningMessages = [];

document.addEventListener("DOMContentLoaded", () => {
    const MAX_POKEMONS = 649;
    const pokemonID = new URLSearchParams(window.location.search).get("id");
    const id = parseInt(pokemonID, 10);

    if (id < 1 || id > MAX_POKEMONS) {
        return (window.location.href = "./index.html");
    }

    currentPokemonID = id;
    loadPokemon(id);
});

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

function setTypeBackgroundColor(poke) {
    const mainType = poke.types[0].type.name;
    const color = getComputedStyle(document.documentElement).getPropertyValue(`--${mainType}`);
    warningMessages.push(getComputedStyle(document.documentElement).getPropertyValue(`--${mainType}`));

    if (!color) {
        console.warn(`Cor náo definida por tipo: ${mainType}`);
        return;
    }

    const detailMainElement = document.querySelector(".detail-main");
    setElementStyles([detailMainElement], "backgroundColor", color);
    setElementStyles(document.querySelectorAll(".power-wrapper > p"), "backgroundColor", color);
    setElementStyles(document.querySelectorAll(".stats-wrap p.stats"), "color", color);
    setElementStyles(document.querySelectorAll(".stats-wrap .progress-bar"), "color", color);

    const bodyElement = document.querySelector("body");
    setElementStyles([bodyElement], "backgroundColor", color);

    const rgbaColor = rgbaFromHex(color);
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `.stats-wrap .progress-bar::-webkit-progress-bar {
        background-color: rgba(${rgbaColor}, 0.5);
    }
    .stats-wrap .progress-bar::-webkit-progress-value {
        background-color: ${color};
    }
    `;

    document.head.appendChild(styleTag);
}

function displayPokemonDetails(poke) {
    const { name, id, types, weight, height, abilities, stats } = poke;
    const capitalizePokemonName = capitalize(name);

    const detailMainElement = document.querySelector(".detail-main");
    detailMainElement.classList.add(name.toLowerCase());

    document.querySelector(".name").textContent = capitalizePokemonName;

    document.querySelector(".pokemon-id").textContent = `#${String(id).padStart(3, "0")}`;

    const imageElement = document.querySelector(".detail-img img");
    imageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
    imageElement.alt = name;

    const typeWrapper = document.querySelector(".power");
    typeWrapper.innerHTML = "";
    types.forEach(({ type }) => {
        createAndAppendElement(typeWrapper, "p", {
            className: `body3-fonts type ${type.name}`,
            textContent: type.name,
        });
    });

    document.querySelector(".pokemon-detail-wrap .pokemon-detail p.body3-fonts").textContent = `${weight / 10} kg`;
    document.querySelector(".pokemon-detail-wrap .pokemon-detail p.body3-fonts.height").textContent = `${height / 10} m`;

    const abilitiesWrapper = document.querySelector(".pokemon-detail-wrap .pokemon-detail.move");
    abilities.forEach(({ ability }) => {
        createAndAppendElement(abilitiesWrapper, "p", {
            className: "body3-fonts",
            textContent: ability.name,
        });
    });

    const statsWrapper = document.querySelector(".stats-wrapper");
    statsWrapper.innerHTML = "";

    const statNameMapping = {
        hp: "HP",
        attack: "ATK",
        defense: "DEF",
        "special-attack": "SATK",
        "special-defense": "SDEF",
        speed: "SPD",
    }

    stats.forEach(({ stat, base_stat }) => {
        const statDiv = document.createElement("div");
        statDiv.className = "stats-wrap";
        statsWrapper.appendChild(statDiv);

        createAndAppendElement(statDiv, "p", {
            className: "body3-fonsts stats",
            textContent: statNameMapping[stat.name],
        });
        createAndAppendElement(statDiv, "p", {
            className: "body3-fonsts",
            textContent: String(base_stat).padStart(3, "0"),
        });
        createAndAppendElement(statDiv, "progress", {
            className: "progress-bar",
            value: base_stat,
            max: 100,
        });
    });

    setTypeBackgroundColor(poke);
}

function getEnglishFlavorText(pokemonSpecies) {
    for (let entry of pokemonSpecies.flavor_text_entries) {
        if (entry.language.name === "en") {
            let flavor = entry.flavor_text.replace(/\f/g, " ");
            return flavor;
        }
    }
    return "";
}

function displayEvolutions(evolutions) {
    const evolutionsWrapper = document.querySelector(".evolutions-wrapper");
    evolutionsWrapper.innerHTML = "";
    let isLastEvolution = false;

    function recursiveDisplayEvolutions(evolutions, parentDiv) {
        if (!evolutions) return;
        
        const evolution = evolutions.species;
        const evolutionName = evolution.name;
        const evolutionId = evolution.url.split("/").slice(-2, -1)[0];

        if (evolutionId > 649) return

        const evolutionDiv = document.createElement("div");
        evolutionDiv.className = "evolution";
        parentDiv.appendChild(evolutionDiv);

        createAndAppendElement(evolutionDiv, "img", {
            src: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${evolutionId}.svg`,
            alt: evolutionName,
        });

        createAndAppendElement(evolutionDiv, "p", {
            textContent: capitalize(evolutionName),
        });

        evolutionDiv.addEventListener("click", () => {
            window.location.assign(`./detail.html?id=${evolutionId}`);
        });

        if (evolutions.evolves_to.length > 1) {
            if (!isLastEvolution) {
                const arrowIcon = document.createElement("img");
                arrowIcon.src = "./assets/arrow-right.svg";
                arrowIcon.className = "arrow";
                arrowIcon.alt = "Arrow";
                evolutionsWrapper.appendChild(arrowIcon);
            }

            const evolutionsList = document.createElement("div");
            evolutionsList.className = "evolutions-list";
            evolutionsWrapper.appendChild(evolutionsList);

            evolutions.evolves_to.forEach((evolution) => {
                const evolutionDiv = document.createElement("div");
                evolutionDiv.className = "evolution";
                evolutionsList.appendChild(evolutionDiv);
                
                recursiveDisplayEvolutions(evolution, evolutionsList);
            });

            isLastEvolution = true;
        } else if (evolutions.evolves_to.length === 1) {
            const nextEvolution = evolutions.evolves_to[0];

            if (!isLastEvolution) {
                const arrowIcon = document.createElement("img");
                arrowIcon.src = "./assets/arrow-right.svg";
                arrowIcon.className = "arrow";
                arrowIcon.alt = "Arrow";
                evolutionsWrapper.appendChild(arrowIcon);
            }

            recursiveDisplayEvolutions(nextEvolution, parentDiv);
        } else {
            isLastEvolution = true;
        }
    }
    recursiveDisplayEvolutions(evolutions, evolutionsWrapper);
}

console.log(warningMessages);