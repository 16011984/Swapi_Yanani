import { useState, useEffect } from "react";
import "./character.css";

const Character = () => {
  const [characters, setCharacters] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 3 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Estado para manejar los favoritos
  const [favorites, setFavorites] = useState(() => {
   
    const savedFavorites = localStorage.getItem('starWarsFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

 
  const handleNext = () => {
    if (characters.length > 0) {
      const newIndex = (selectedIndex + 1) % characters.length;
      setSelectedIndex(newIndex);
      
     
      updateVisibleRange(newIndex);
    }
  };


  const handlePrevious = () => {
    if (characters.length > 0) {
      const newIndex = (selectedIndex - 1 + characters.length) % characters.length;
      setSelectedIndex(newIndex);
      
     
      updateVisibleRange(newIndex);
    }
  };

  
  const updateVisibleRange = (index) => {
    const visibleCount = 4; 


    if (index < visibleRange.start || index >= visibleRange.end) {
      
      let newStart = Math.max(0, index - 1);
      
      
      if (newStart + visibleCount > characters.length) {
        newStart = Math.max(0, characters.length - visibleCount);
      }
      
      setVisibleRange({
        start: newStart,
        end: Math.min(newStart + visibleCount, characters.length)
      });
    }
  };

  
  const handleSelectCharacter = (index) => {
    setSelectedIndex(index);
  };


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
    
   
    const colorIndex = (parseInt(id) - 1) % colors.length;
    return colors[colorIndex];
  };

  
  const addToFavorites = () => {
    if (characters.length > 0) {
      const character = characters[selectedIndex];
      
      
      const isAlreadyFavorite = favorites.some(fav => fav.id === character.id);
      
      if (!isAlreadyFavorite) {
        
        const favoriteCharacter = {
          id: character.id,
          name: character.name,
          color: getCharacterColor(character.id)
        };
        
        
        const newFavorites = [...favorites, favoriteCharacter];
        setFavorites(newFavorites);
        
        // Guardar en localStorage
        localStorage.setItem('starWarsFavorites', JSON.stringify(newFavorites));
        
       
        setNotificationMessage(`${character.name} añadido a favoritos!`);
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 2000);
        
        
        const event = new CustomEvent('favoritesUpdated', {
          detail: { favorites: newFavorites }
        });
        window.dispatchEvent(event);
      } else {
        
        setNotificationMessage(`${character.name} ya está en tus favoritos!`);
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 2000);
      }
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
            id: character.uid
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

  if (loading) {
    return <div className="character loading">Cargando personajes...</div>;
  }

  if (error) {
    return <div className="character error">{error}</div>;
  }

 
  if (characters.length === 0) {
    return <div className="character">No se encontraron personajes</div>;
  }

  
  const selectedCharacter = characters[selectedIndex];

  
  const isAlreadyFavorite = favorites.some(fav => fav.id === selectedCharacter.id);

  
  const visibleCharacters = characters.slice(visibleRange.start, visibleRange.end);

  return (
    <div className="character">
      {/* Notificación de agregado a favoritos */}
      {showNotification && (
        <div className={`favorite-notification ${isAlreadyFavorite ? 'already' : 'added'}`}>
          {notificationMessage}
        </div>
      )}
      
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
      
      {/* Información del personaje */}
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

        {/* Botón de añadir a favoritos - Usando onClick de React */}
        <button 
          className={`add-to-favorites-btn ${isAlreadyFavorite ? 'already-favorite' : ''}`}
          onClick={addToFavorites}
          type="button"
        >
          {isAlreadyFavorite ? '★ En Favoritos' : '☆ Añadir a Favoritos'}
        </button>

      {/* Slider */}
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

      
      <div className="cha-btn">
        <button 
          className="cha-btn-back" 
          onClick={handlePrevious}
          type="button"
        >
          Back
        </button>
        <button 
          className="cha-btn-next" 
          onClick={handleNext}
          type="button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Character;