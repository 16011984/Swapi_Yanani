import { useState, useEffect } from "react";
import "./charactercard.css";

const CharacterCard = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        // Hacemos la petición a la API de SWAPI para obtener personajes
        const response = await fetch("https://www.swapi.tech/api/people?page=1&limit=10");
        
        if (!response.ok) {
          throw new Error("Error en la petición a la API");
        }
        
        const data = await response.json();
        
        // Para cada personaje, necesitamos hacer una petición adicional para obtener detalles
        const characterDetailsPromises = data.results.map(async (character) => {
          const detailResponse = await fetch(character.url);
          const detailData = await detailResponse.json();
          return detailData.result.properties;
        });
        
        // Esperamos a que todas las peticiones de detalles se completen
        const detailedCharacters = await Promise.all(characterDetailsPromises);
        setCharacters(detailedCharacters);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("No se pudieron cargar los personajes");
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  if (loading) {
    return <div className="cha_card loading">Cargando personajes...</div>;
  }

  if (error) {
    return <div className="cha_card error">{error}</div>;
  }

  return (
    <div className="characters-container">
      {characters.map((character, index) => (
        <div className="cha_card" key={index}>
          <h2>{character.name}</h2>
          <div className="char-details">
            <p><strong>Género:</strong> {character.gender}</p>
            <p><strong>Año de nacimiento:</strong> {character.birth_year}</p>
            <p><strong>Altura:</strong> {character.height} cm</p>
            <p><strong>Peso:</strong> {character.mass} kg</p>
            <p><strong>Color de ojos:</strong> {character.eye_color}</p>
            <p><strong>Color de pelo:</strong> {character.hair_color}</p>
            <p><strong>Color de piel:</strong> {character.skin_color}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CharacterCard;