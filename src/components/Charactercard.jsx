import { useState, useEffect } from "react";
import "./charactercard.css";

const CharacterCard = () => {
  const [characters, setCharacters] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Función para obtener el ID del personaje de SWAPI
  const getCharacterId = (swapiId) => {
    return swapiId;
  };

  // Función modificada para usar una API de imágenes alternativa
  const getCharacterImageUrl = (id) => {
    // Usamos starwars-visualguide.com que proporciona imágenes oficiales de Star Wars
    return `https://starwars-visualguide.com/assets/img/characters/${id}.jpg`;
  };

  const handleNext = () => {
    if (characters.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % characters.length);
    }
  };

  const handlePrevious = () => {
    if (characters.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + characters.length) % characters.length);
    }
  };

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch("https://www.swapi.tech/api/people?page=1&limit=20");
        
        if (!response.ok) {
          throw new Error("Error en la petición a la API");
        }
        
        const data = await response.json();
        
        const characterDetailsPromises = data.results.map(async (character) => {
          const detailResponse = await fetch(character.url);
          const detailData = await detailResponse.json();
          return {
            ...detailData.result.properties,
            id: character.uid,
            imageUrl: getCharacterImageUrl(getCharacterId(character.uid))
          };
        });
        
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

  useEffect(() => {
    const nextButton = document.querySelector('.cha-btn-next');
    const backButton = document.querySelector('.cha-btn-back');
    
    if (nextButton) {
      nextButton.addEventListener('click', handleNext);
    }
    
    if (backButton) {
      backButton.addEventListener('click', handlePrevious);
    }
    
    // Limpieza
    return () => {
      if (nextButton) {
        nextButton.removeEventListener('click', handleNext);
      }
      
      if (backButton) {
        backButton.removeEventListener('click', handlePrevious);
      }
    };
  }, [characters.length]); 

  if (loading) {
    return <div className="cha_card loading">Cargando personajes...</div>;
  }

  if (error) {
    return <div className="cha_card error">{error}</div>;
  }
  
  if (characters.length === 0) {
    return <div className="cha_card">No se encontraron personajes</div>;
  }
  
  const character = characters[currentIndex];

  return (
    <div className="cha_card">
      <div className="char-image-container">
        <img 
          src={character.imageUrl} 
          alt={`Imagen de ${character.name}`}
          onError={(e) => {
         
            e.target.onerror = null;
            e.target.style.display = "none";
            
            // Crear un elemento de fallback
            const fallbackContainer = document.createElement('div');
            fallbackContainer.className = 'fallback-image';
            const textContainer = document.createElement('div');
            textContainer.className = 'fallback-image-text';
            textContainer.textContent = character.name;
            fallbackContainer.appendChild(textContainer);
            
            
            e.target.parentNode.appendChild(fallbackContainer);
          }}
          className="char-image"
        />
      </div>
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
  );
};

export default CharacterCard;