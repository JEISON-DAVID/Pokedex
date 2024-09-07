document.addEventListener('DOMContentLoaded', () => {
    const pokemonContainer = document.getElementById('pokemon-container');
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('search-button');
    const filterSelect = document.getElementById('filter');

    const fetchPokemon = async () => {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();
        return data.results;
    };

    const fetchPokemonDetails = async (url) => {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    };

    const fetchPokemonSpecies = async (url) => {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    };

    const createStatBar = (stat, className, label) => {
        const bar = document.createElement('div');
        bar.classList.add('stat-bar');
        const barInner = document.createElement('div');
        barInner.classList.add('stat-bar-inner', className);
        barInner.style.width = `${stat}%`;
        const barLabel = document.createElement('div');
        barLabel.classList.add('stat-bar-label');
        barLabel.textContent = `${label}: ${stat}`;
        barInner.appendChild(barLabel);
        bar.appendChild(barInner);
        return bar;
    };

    const displayPokemon = async (pokemonList) => {
        pokemonContainer.innerHTML = '';
        for (const pokemon of pokemonList) {
            const details = await fetchPokemonDetails(pokemon.url);
            const speciesData = await fetchPokemonSpecies(details.species.url);
            const spanishName = speciesData.names.find(name => name.language.name === 'es').name;
            const spanishDescription = speciesData.flavor_text_entries.find(entry => entry.language.name === 'es').flavor_text;
            const evolutions = await fetch(speciesData.evolution_chain.url).then(res => res.json());

            const card = document.createElement('div');
            card.classList.add('pokemon-card');
            card.innerHTML = `
                <div class="pokemon-card-inner">
                    <div class="pokemon-card-front">
                        <h2>${spanishName}</h2>
                        <img src="${details.sprites.front_default}" alt="${spanishName}">
                        <div class="pokemon-info">
                            <div class="chart-container">
                                ${createStatBar(details.stats[2].base_stat, 'defense', 'Defensa').outerHTML}
                                ${createStatBar(details.stats[1].base_stat, 'attack', 'Ataque').outerHTML}
                                ${createStatBar(details.stats[5].base_stat, 'speed', 'Velocidad').outerHTML}
                                ${createStatBar(details.stats[0].base_stat, 'hp', 'HP').outerHTML}
                                ${createStatBar(details.weight / 10, 'weight', 'Peso').outerHTML}
                                ${createStatBar(details.height / 10, 'height', 'Altura').outerHTML}
                                ${createStatBar(details.stats[3].base_stat, 'special-attack', 'Ataque Especial').outerHTML}
                                ${createStatBar(details.stats[4].base_stat, 'special-defense', 'Defensa Especial').outerHTML}
                            </div>
                        </div>
                    </div>
                    <div class="pokemon-card-back">
                        <div class="pokemon-info">
                            <h2>${spanishName}</h2>
                            <p>${spanishDescription}</p>
                            <h3>Evoluciones</h3>
                            <div class="evolutions">
                                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolutions.chain.species.url.split('/').slice(-2, -1)}.png" alt="${evolutions.chain.species.name}">
                                ${evolutions.chain.evolves_to.map(evo => `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.species.url.split('/').slice(-2, -1)}.png" alt="${evo.species.name}">`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            card.addEventListener('click', () => {
                card.classList.toggle('flipped');
            });
            pokemonContainer.appendChild(card);
        }
    };

    const filterPokemon = (pokemonList, filter) => {
        if (filter === 'all') return pokemonList;
        return pokemonList.filter(pokemon => pokemon.types.some(type => type.type.name === filter));
    };

    const searchPokemon = (pokemonList, query) => {
        return pokemonList.filter(pokemon => pokemon.name.toLowerCase().includes(query.toLowerCase()));
    };

    const init = async () => {
        let pokemonList = await fetchPokemon();
        displayPokemon(pokemonList);

        searchButton.addEventListener('click', () => {
            const filteredList = searchPokemon(pokemonList, searchInput.value);
            displayPokemon(filteredList);
        });

        filterSelect.addEventListener('change', () => {
            const filteredList = filterPokemon(pokemonList, filterSelect.value);
            displayPokemon(filteredList);
        });
    };

    init();
});
