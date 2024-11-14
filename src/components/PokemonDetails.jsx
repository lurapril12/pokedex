import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchPokemonDetails } from "../api/pokeAPI";

const API_URL = 'https://pokeapi.co/api/v2/';

const PokemonDetails = () => {
  const { name } = useParams();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetchPokemonDetails(`${API_URL}pokemon/${name}`);
        setDetails(response.data);
      } catch (error) {
        console.error("Error fetching Pokemon details:", error);
      }
    };
    fetchDetails();
  }, [name]);

  if (!details) return <div>Loading...</div>;

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold">{details.name}</h2>
      <p>#{details.id}</p>
      <p>Type: {details.types}</p>
      <img src={details.sprites.front_default} alt={details.name} />
      <p>Height: {details.height}</p>
      <p>Weight: {details.weight}</p>
    </div>
  );
};

export default PokemonDetails;