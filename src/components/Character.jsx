import { useState, useEffect } from "react";
import "./character.css";
import CharacterCard from "./Charactercard";

const Character = () => {
  const [characters, setCharacters] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 3 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para manejar el botón siguiente
  const handleNext = () => {
    if (characters.length > 0) {
      const newIndex = (selectedIndex + 1) % characters.length;
      setSelectedIndex(newIndex);
      
      // Ajustar el rango visible si es necesario
      updateVisibleRange(newIndex);
    }
  };

  // Función para manejar el botón anterior
  const handlePrevious = () => {
    if (characters.length > 0) {
      const newIndex = (selectedIndex - 1 + characters.length) % characters.length;
      setSelectedIndex(newIndex);
      
      // Ajustar el rango visible si es necesario
      updateVisibleRange(newIndex);
    }
  };

  // Función para actualizar el rango visible basado en el índice seleccionado
  const updateVisibleRange = (index) => {
    const visibleCount = 4; // Número de tarjetas visibles en el slider
    
    // Si el índice seleccionado está fuera del rango visible actual, ajustamos el rango
    if (index < visibleRange.start || index >= visibleRange.end) {
      // Calculamos nuevo inicio basado en el índice seleccionado
      let newStart = Math.max(0, index - 1);
      
      // Aseguramos que no exceda el límite de caracteres
      if (newStart + visibleCount > characters.length) {
        newStart = Math.max(0, characters.length - visibleCount);
      }
      
      setVisibleRange({
        start: newStart,
        end: Math.min(newStart + visibleCount, characters.length)
      });
    }
  };

  // Función para seleccionar un personaje directamente
  const handleSelectCharacter = (index) => {
    setSelectedIndex(index);
  };

  // Función para obtener color basado en personaje
  const getCharacterColor = (id) => {
    // Colores basados en el ID del personaje
    const colors = [
      '#FFD700', // Dorado (Luke)
      '#C0C0C0', // Plateado (C-3PO)
      '#87CEEB', // Azul cielo (R2-D2)
      '#FF0000', // Rojo (Darth Vader)
      '#A52A2A', // Marrón (Leia)
      '#8B4513', // Marrón saddlebrown (Owen)
      '#FFFACD', // Amarillo claro (Beru)
      '#FFF8DC', // Cornsilk (R5-D4)
      '#FF8C00', // Naranja oscuro (Biggs)
      '#ADD8E6', // Azul claro (Obi-Wan)
      '#9370DB', // Púrpura (Anakin)
      '#20B2AA', // Verde azulado (Wilhuff Tarkin)
      '#663399', // Azul-púrpura (Chewbacca)
      '#DC143C', // Carmesí (Han Solo)
      '#00FF7F', // Verde primavera (Greedo)
      '#B8860B', // Oro oscuro (Jabba)
      '#708090', // Gris pizarra (Wedge)
      '#556B2F', // Verde oliva (Porkins)
      '#2E8B57', // Verde mar (Yoda)
      '#4B0082', // Índigo (Palpatine)
    ];
    
    // Seleccionar un color basado en el ID (usando módulo para asegurarnos de que esté dentro del rango)
    const colorIndex = (parseInt(id) - 1) % colors.length;
    return colors[colorIndex];
  };

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        // Hacemos la petición a la API de SWAPI para obtener personajes
        const response = await fetch("https://www.swapi.tech/api/people?page=1&limit=20");
        
        if (!response.ok) {
          throw new Error("Error en la petición a la API");
        }
        
        const data = await response.json();
        
        // Para cada personaje, necesitamos hacer una petición adicional para obtener detalles
        const characterDetailsPromises = data.results.map(async (character) => {
          const detailResponse = await fetch(character.url);
          const detailData = await detailResponse.json();
          return {
            ...detailData.result.properties,
            id: character.uid
          };
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

  // Conectamos los botones a las funciones
  useEffect(() => {
    // Buscar los botones en el DOM
    const nextButton = document.querySelector('.cha-btn-next');
    const backButton = document.querySelector('.cha-btn-back');
    
    if (nextButton) {
      nextButton.addEventListener('click', handleNext);
    }
    
    if (backButton) {
      backButton.addEventListener('click', handlePrevious);
    }
    
    // Limpieza al desmontar
    return () => {
      if (nextButton) {
        nextButton.removeEventListener('click', handleNext);
      }
      
      if (backButton) {
        backButton.removeEventListener('click', handlePrevious);
      }
    };
  }, [characters.length, selectedIndex]); // Depende de la longitud de personajes y el índice seleccionado

  if (loading) {
    return <div className="character loading">Cargando personajes...</div>;
  }

  if (error) {
    return <div className="character error">{error}</div>;
  }

  // Si no hay personajes, mostrar un mensaje
  if (characters.length === 0) {
    return <div className="character">No se encontraron personajes</div>;
  }

  // Obtener el personaje seleccionado
  const selectedCharacter = characters[selectedIndex];

  // Obtener los personajes visibles para el slider
  const visibleCharacters = characters.slice(visibleRange.start, visibleRange.end);

  return (
    <div className="character">
      {/* Fondo con la visualización del personaje */}
      <div 
        className="character-backdrop"
        style={{ 
          backgroundColor: getCharacterColor(selectedCharacter.id),
        }}
      >
        <div className="character-visual">
          <div className="character-initial">
            {selectedCharacter.name.charAt(0)}
          </div>
        </div>
      </div>
      
      {/* Información del personaje superpuesta */}
      <div className="character-info-overlay">
        <h1 className="character-name">{selectedCharacter.name}</h1>
        <div className="character-attributes">
          <div className="attribute">
            <span className="attribute-label">Género</span>
            <span className="attribute-value">{selectedCharacter.gender}</span>
          </div>
          <div className="attribute">
            <span className="attribute-label">Nacimiento</span>
            <span className="attribute-value">{selectedCharacter.birth_year}</span>
          </div>
          <div className="attribute">
            <span className="attribute-label">Altura</span>
            <span className="attribute-value">{selectedCharacter.height} cm</span>
          </div>
          <div className="attribute">
            <span className="attribute-label">Peso</span>
            <span className="attribute-value">{selectedCharacter.mass} kg</span>
          </div>
          <div className="attribute">
            <span className="attribute-label">Ojos</span>
            <span className="attribute-value">{selectedCharacter.eye_color}</span>
          </div>
          <div className="attribute">
            <span className="attribute-label">Pelo</span>
            <span className="attribute-value">{selectedCharacter.hair_color}</span>
          </div>
          <div className="attribute">
            <span className="attribute-label">Piel</span>
            <span className="attribute-value">{selectedCharacter.skin_color}</span>
          </div>
        </div>
      </div>

      {/* Slider de personajes en la parte inferior */}
      <div className="character-slider">
        {visibleCharacters.map((character, index) => (
          <div 
            key={character.id}
            className={`slider-item ${index + visibleRange.start === selectedIndex ? 'selected' : ''}`}
            onClick={() => handleSelectCharacter(index + visibleRange.start)}
          >
            <div 
              className="slider-visual"
              style={{ 
                backgroundColor: getCharacterColor(character.id)
              }}
            >
              <div className="slider-initial">{character.name.charAt(0)}</div>
            </div>
            <div className="slider-name">{character.name}</div>
          </div>
        ))}
      </div>

      {/* Botones de navegación */}
      <div className="cha-btn">
        <button className="cha-btn-back"> Back </button>
        <button className="cha-btn-next"> Next </button>
      </div>
    </div>
  );
};

export default Character;