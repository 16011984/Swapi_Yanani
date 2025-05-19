import { useState, useEffect } from "react";
import "./planet.css";

const Planet = () => {
  const [planets, setPlanets] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 3 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Estado para manejar los favoritos
  const [favorites, setFavorites] = useState(() => {
   
    const savedFavorites = localStorage.getItem('starWarsPlanetFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

 
  const handleNext = () => {
    if (planets.length > 0) {
      const newIndex = (selectedIndex + 1) % planets.length;
      setSelectedIndex(newIndex);
      
     
      updateVisibleRange(newIndex);
    }
  };


  const handlePrevious = () => {
    if (planets.length > 0) {
      const newIndex = (selectedIndex - 1 + planets.length) % planets.length;
      setSelectedIndex(newIndex);
      
     
      updateVisibleRange(newIndex);
    }
  };

  
  const updateVisibleRange = (index) => {
    const visibleCount = 4; 


    if (index < visibleRange.start || index >= visibleRange.end) {
      
      let newStart = Math.max(0, index - 1);
      
      
      if (newStart + visibleCount > planets.length) {
        newStart = Math.max(0, planets.length - visibleCount);
      }
      
      setVisibleRange({
        start: newStart,
        end: Math.min(newStart + visibleCount, planets.length)
      });
    }
  };

  
  const handleSelectPlanet = (index) => {
    setSelectedIndex(index);
  };


  const getPlanetColor = (id) => {
    // Colores basados en el ID del planeta - tonos azules/púrpuras para diferenciar
    const colors = [
      '#3F51B5', // Índigo
      '#673AB7', // Púrpura profundo
      '#9C27B0', // Púrpura
      '#2196F3', // Azul
      '#03A9F4', // Azul claro
      '#00BCD4', // Cian
      '#009688', // Verde azulado
      '#311B92', // Índigo profundo
      '#4527A0', // Púrpura profundo oscuro
      '#512DA8', // Púrpura profundo medio
      '#5E35B1', // Púrpura profundo claro
      '#3949AB', // Índigo oscuro
      '#1A237E', // Índigo profundo
      '#283593', // Índigo oscuro medio
      '#303F9F', // Índigo oscuro claro
      '#0D47A1', // Azul profundo
      '#1565C0', // Azul oscuro
      '#1976D2', // Azul oscuro claro
      '#0288D1', // Azul ligero
      '#0097A7', // Cian oscuro
    ];
    
   
    const colorIndex = (parseInt(id) - 1) % colors.length;
    return colors[colorIndex];
  };

  
  const addToFavorites = () => {
    if (planets.length > 0) {
      const planet = planets[selectedIndex];
      
      
      const isAlreadyFavorite = favorites.some(fav => fav.id === planet.id);
      
      if (!isAlreadyFavorite) {
        
        const favoritePlanet = {
          id: planet.id,
          name: planet.name,
          color: getPlanetColor(planet.id)
        };
        
        
        const newFavorites = [...favorites, favoritePlanet];
        setFavorites(newFavorites);
        
        // Guardar en localStorage
        localStorage.setItem('starWarsPlanetFavorites', JSON.stringify(newFavorites));
        
       
        setNotificationMessage(`${planet.name} añadido a favoritos!`);
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 2000);
        
        
        const event = new CustomEvent('planetFavoritesUpdated', {
          detail: { favorites: newFavorites }
        });
        window.dispatchEvent(event);
      } else {
        
        setNotificationMessage(`${planet.name} ya está en tus favoritos!`);
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 2000);
      }
    }
  };

  useEffect(() => {
    const fetchPlanets = async () => {
      try {
       
        const response = await fetch("https://www.swapi.tech/api/planets?page=1&limit=20");
        
        if (!response.ok) {
          throw new Error("Error en la petición a la API");
        }
        
        const data = await response.json();
        
       
        const planetDetailsPromises = data.results.map(async (planet) => {
          const detailResponse = await fetch(planet.url);
          const detailData = await detailResponse.json();
          return {
            ...detailData.result.properties,
            id: planet.uid
          };
        });
        
        
        const detailedPlanets = await Promise.all(planetDetailsPromises);
        setPlanets(detailedPlanets);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("No se pudieron cargar los planetas");
        setLoading(false);
      }
    };

    fetchPlanets();
  }, []);

  if (loading) {
    return <div className="planet loading">Cargando planetas...</div>;
  }

  if (error) {
    return <div className="planet error">{error}</div>;
  }

 
  if (planets.length === 0) {
    return <div className="planet">No se encontraron planetas</div>;
  }

  
  const selectedPlanet = planets[selectedIndex];

  
  const isAlreadyFavorite = favorites.some(fav => fav.id === selectedPlanet.id);

  
  const visiblePlanets = planets.slice(visibleRange.start, visibleRange.end);

  return (
    <div className="planet">
      {/* Notificación de agregado a favoritos */}
      {showNotification && (
        <div className={`favorite-notification ${isAlreadyFavorite ? 'already' : 'added'}`}>
          {notificationMessage}
        </div>
      )}
      
      {/* Fondo con la visualización del planeta */}
      <div 
        className="planet-backdrop"
        style={{ 
          backgroundColor: getPlanetColor(selectedPlanet.id),
        }}
      >
        <div className="planet-visual">
          <div className="planet-initial">
            {selectedPlanet.name.charAt(0)}
          </div>
        </div>
      </div>
      
      {/* Información del planeta */}
      <div className="planet-info-overlay">
        <h1 className="planet-name">{selectedPlanet.name}</h1>
        

        <div className="planet-attributes">
          <div className="attribute">
            <span className="attribute-label">Clima</span>
            <span className="attribute-value">{selectedPlanet.climate}</span>
          </div>
          <div className="attribute">
            <span className="attribute-label">Terreno</span>
            <span className="attribute-value">{selectedPlanet.terrain}</span>
          </div>
          <div className="attribute">
            <span className="attribute-label">Diámetro</span>
            <span className="attribute-value">{selectedPlanet.diameter} km</span>
          </div>
          <div className="attribute">
            <span className="attribute-label">Rotación</span>
            <span className="attribute-value">{selectedPlanet.rotation_period} horas</span>
          </div>
          <div className="attribute">
            <span className="attribute-label">Período orbital</span>
            <span className="attribute-value">{selectedPlanet.orbital_period} días</span>
          </div>
          <div className="attribute">
            <span className="attribute-label">Población</span>
            <span className="attribute-value">{selectedPlanet.population}</span>
          </div>
          <div className="attribute">
            <span className="attribute-label">Gravedad</span>
            <span className="attribute-value">{selectedPlanet.gravity}</span>
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
      <div className="planet-slider">
        {visiblePlanets.map((planet, index) => (
          <div 
            key={planet.id}
            className={`slider-item ${index + visibleRange.start === selectedIndex ? 'selected' : ''}`}
            onClick={() => handleSelectPlanet(index + visibleRange.start)}
          >
            <div 
              className="slider-visual"
              style={{ 
                backgroundColor: getPlanetColor(planet.id)
              }}
            >
              <div className="slider-initial">{planet.name.charAt(0)}</div>
            </div>
            <div className="slider-name">{planet.name}</div>
          </div>
        ))}
      </div>

      
      <div className="pla-btn">
        <button 
          className="pla-btn-back" 
          onClick={handlePrevious}
          type="button"
        >
          Back
        </button>
        <button 
          className="pla-btn-next" 
          onClick={handleNext}
          type="button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Planet;