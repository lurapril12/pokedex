import axios from 'axios';

const API_URL = 'https://pokeapi.co/api/v2/';

export const fetchPokemonList = async (offset, limit) => {
  const response = await axios.get(`${API_URL}pokemon?offset=${offset}&limit=${limit}`);
  const pokemonList = response.data.results;

  // Fetch details for each Pokemon to get the image URL
  const detailedPokemonList = await Promise.all(
    pokemonList.map(async (pokemon) => {
      const details = await fetchPokemonDetails(pokemon.url);
      return {
        name: pokemon.name,
        image: details.data.sprites.front_default,
      };
    })
  );

  return detailedPokemonList;
};

export const fetchPokemonDetails = async (url) => {
  try {
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error("Error fetching Pokemon details:", error);
    throw error;
  }
};

export const fetchAbilityList = async () => {
  try {
    let abilities = [];
    let url = `${API_URL}ability`;
    while (url) {
      const response = await axios.get(url);
      abilities = abilities.concat(response.data.results);
      url = response.data.next; // Get the next page URL
    }
    return abilities;
  } catch (error) {
    console.error("Error fetching ability list:", error);
    throw error;
  }
};