import { useState, useEffect } from "react";
import { fetchPokemonList, fetchPokemonDetails, fetchAbilityList } from "../api/pokeAPI";
import Modal from "./Modal";
import Navbar from "./Navbar";

const API_URL = 'https://pokeapi.co/api/v2/';

const PokemonList = () => {
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const [selectedAbility, setSelectedAbility] = useState(''); // Added state for selected ability
  const [abilities, setAbilities] = useState([]); // Added state for abilities
  const limit = 20;

  const loadPokemon = async (page) => {
    setIsLoading(true); // Set loading to true when starting fetch
    const offset = (page - 1) * limit;
    const pokemonDetails = await fetchPokemonList(offset, limit);
    setPokemon(pokemonDetails);
    setFilteredPokemon(pokemonDetails);
    setIsLoading(false); // Set loading to false after fetch
  };

  const loadAbilities = async () => {
    const abilitiesList = await fetchAbilityList();
    setAbilities(abilitiesList);
  };

  useEffect(() => {
    loadPokemon(currentPage);
    loadAbilities(); // Load abilities when component mounts
  }, [currentPage]);

  const handleSearch = (searchTerm) => {
    if (searchTerm === '') {
      setFilteredPokemon(pokemon);
    } else {
      const filtered = pokemon.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredPokemon(filtered);
    }
  };

  const handleCardClick = async (name) => {
    const details = await fetchPokemonDetails(`${API_URL}pokemon/${name}`);
    setSelectedPokemon(details.data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPokemon(null);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAbilityChange = (e) => {
    const ability = e.target.value;
    setSelectedAbility(ability);
    if (ability === '') {
      setFilteredPokemon(pokemon);
    } else {
      const filtered = pokemon.filter(p => p.abilities.some(a => a.ability.name === ability));
      setFilteredPokemon(filtered);
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-200 to-blue-500 min-h-screen">
      <Navbar onSearch={handleSearch} />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <select
            value={selectedAbility}
            onChange={handleAbilityChange}
            className="bg-white text-blue-700 px-4 py-2 rounded"
          >
            <option value="">All Abilities</option>
            {abilities.map((ability, index) => (
              <option key={index} value={ability.name}>
                {ability.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredPokemon.length === 0 ? (
            <div className="col-span-full text-center text-white text-2xl font-semibold">
              This Pokémon doesn't exist
            </div>
          ) : (
            filteredPokemon.map((p, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transform transition duration-200 hover:scale-105 cursor-pointer border border-blue-300"
                onClick={() => handleCardClick(p.name)}
              >
                <img src={p.image} alt={p.name} className="w-32 h-32 mx-auto mb-2 rounded-lg border border-gray-200" />
                <p className="text-center text-xl font-semibold text-blue-700 capitalize">{p.name}</p>
              </div>
            ))
          )}
        </div>
        {isLoading && (
          <div className="flex justify-center items-center my-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600 border-opacity-70"></div>
          </div>
        )}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-white text-xl">Page {currentPage}</span>
          <button
            onClick={handleNextPage}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedPokemon && (
          <div className="text-center p-6">
            <img
              src={selectedPokemon.sprites.front_default}
              alt={selectedPokemon.name}
              className="mx-auto mb-4 w-40 h-40 border border-blue-300 rounded-lg shadow-lg"
            />
            <h2 className="text-4xl font-bold text-gray-700 mb-4 uppercase">{selectedPokemon.name}</h2>
            <h5 className="text-2xl font-bold text-gray-700 mb-4">Number: <span className=" bg-yellow-500 rounded-md px-3 py-1 inline-block m-1">#{selectedPokemon.id}</span></h5>
            <div className="mb-4 text-black">
              <p className="text-lg"><strong>Base Experience:</strong> {selectedPokemon.base_experience}</p>
              <p className="text-lg"><strong>Height:</strong> {selectedPokemon.height}</p>
              <p className="text-lg"><strong>Weight:</strong> {selectedPokemon.weight}</p>
            </div>
            <div className="mb-4">
              <strong className="text-lg text-black">Type:</strong>
              <ul className="list-disc list-inside text-black">
                {selectedPokemon.types.map((type, index) => (
                  <li key={index} className="text-lg capitalize bg-blue-100 rounded-md px-3 py-1 inline-block m-1">{type.type.name}</li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <strong className="text-lg text-black">Abilities:</strong>
              <ul className="list-disc list-inside text-black">
                {selectedPokemon.abilities.map((ability, index) => (
                  <li key={index} className="text-lg capitalize bg-blue-100 rounded-md px-3 py-1 inline-block m-1">
                    {ability.ability.name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <strong className="text-lg text-black">Stats:</strong>
              <ul className="list-disc list-inside text-black">
                {selectedPokemon.stats.map((stat, index) => (
                  <li key={index} className="text-lg capitalize bg-blue-100 rounded-md px-3 py-1 inline-block m-1">
                    {stat.stat.name}: {stat.base_stat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PokemonList;