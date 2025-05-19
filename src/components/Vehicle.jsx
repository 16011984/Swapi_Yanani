import { useState, useEffect } from "react";
import "./vehicle.css";

const Vehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 3 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Estado para manejar los favoritos
  const [favorites, setFavorites] = useState(() => {
   
    const savedFavorites = localStorage.getItem('starWarsVehicleFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

 
  const handleNext = () => {
    if (vehicles.length > 0) {
      const newIndex = (selectedIndex + 1) % vehicles.length;
      setSelectedIndex(newIndex);
      
     
      updateVisibleRange(newIndex);
    }
  };


  const handlePrevious = () => {
    if (vehicles.length > 0) {
      const newIndex = (selectedIndex - 1 + vehicles.length) % vehicles.length;
      setSelectedIndex(newIndex);
      
     
      updateVisibleRange(newIndex);
    }
  };

  
  const updateVisibleRange = (index) => {
    const visibleCount = 4; 


    if (index < visibleRange.start || index >= visibleRange.end) {
      
      let newStart = Math.max(0, index - 1);
      
      
      if (newStart + visibleCount > vehicles.length) {
        newStart = Math.max(0, vehicles.length - visibleCount);
      }
      
      setVisibleRange({
        start: newStart,
        end: Math.min(newStart + visibleCount, vehicles.length)
      });
    }
  };

  
  const handleSelectVehicle = (index) => {
    setSelectedIndex(index);
  };


  const getVehicleColor = (id) => {
    // Colores basados en el ID del vehículo - tonos verdes para diferenciar
    const colors = [
      '#4CAF50', // Verde
      '#8BC34A', // Verde claro
      '#CDDC39', // Lima
      '#7CB342', // Verde ligero
      '#388E3C', // Verde oscuro
      '#33691E', // Verde bosque
      '#00796B', // Verde azulado oscuro
      '#009688', // Verde azulado
      '#26A69A', // Verde menta
      '#00BFA5', // Verde menta claro
      '#2E7D32', // Verde bosque claro
      '#1B5E20', // Verde bosque oscuro
      '#004D40', // Verde azulado profundo
      '#00C853', // Verde brillante
      '#64DD17', // Lima brillante
      '#AEEA00', // Lima ácido
      '#69F0AE', // Verde menta brillante
      '#00E676', // Verde primavera
      '#76FF03', // Verde lima brillante
      '#B9F6CA', // Verde menta pálido
    ];
    
   
    const colorIndex = (parseInt(id) - 1) % colors.length;
    return colors[colorIndex];
  };

  
  const addToFavorites = () => {
    if (vehicles.length > 0) {
      const vehicle = vehicles[selectedIndex];
      
      
      const isAlreadyFavorite = favorites.some(fav => fav.id === vehicle.id);
      
      if (!isAlreadyFavorite) {
        
        const favoriteVehicle = {
          id: vehicle.id,
          name: vehicle.name,
          color: getVehicleColor(vehicle.id)
        };
        
        
        const newFavorites = [...favorites, favoriteVehicle];
        setFavorites(newFavorites);
        
        // Guardar en localStorage
        localStorage.setItem('starWarsVehicleFavorites', JSON.stringify(newFavorites));
        
       
        setNotificationMessage(`${vehicle.name} añadido a favoritos!`);
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 2000);
        
        
        const event = new CustomEvent('vehicleFavoritesUpdated', {
          detail: { favorites: newFavorites }
        });
        window.dispatchEvent(event);
      } else {
        
        setNotificationMessage(`${vehicle.name} ya está en tus favoritos!`);
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 2000);
      }
    }
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
       
        const response = await fetch("https://www.swapi.tech/api/vehicles?page=1&limit=20");
        
        if (!response.ok) {
          throw new Error("Error en la petición a la API");
        }
        
        const data = await response.json();
        
       
        const vehicleDetailsPromises = data.results.map(async (vehicle) => {
          const detailResponse = await fetch(vehicle.url);
          const detailData = await detailResponse.json();
          return {
            ...detailData.result.properties,
            id: vehicle.uid
          };
        });
        
        
        const detailedVehicles = await Promise.all(vehicleDetailsPromises);
        setVehicles(detailedVehicles);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("No se pudieron cargar los vehículos");
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) {
    return <div className="vehicle loading">Cargando vehículos...</div>;
  }

  if (error) {
    return <div className="vehicle error">{error}</div>;
  }

 
  if (vehicles.length === 0) {
    return <div className="vehicle">No se encontraron vehículos</div>;
  }

  
  const selectedVehicle = vehicles[selectedIndex];

  
  const isAlreadyFavorite = favorites.some(fav => fav.id === selectedVehicle.id);

  
  const visibleVehicles = vehicles.slice(visibleRange.start, visibleRange.end);

  return (
    <div className="vehicle">
      {/* Notificación de agregado a favoritos */}
      {showNotification && (
        <div className={`favorite-notification ${isAlreadyFavorite ? 'already' : 'added'}`}>
          {notificationMessage}
        </div>
      )}
      
      {/* Fondo con la visualización del vehículo */}
      <div 
        className="vehicle-backdrop"
        style={{ 
          backgroundColor: getVehicleColor(selectedVehicle.id),
        }}
      >
        <div className="vehicle-visual">
          <div className="vehicle-initial">
            {selectedVehicle.name.charAt(0)}
          </div>
        </div>
      </div>
      
      {/* Información del vehículo */}
      <div className="vehicle-info-overlay">
        <h1 className="vehicle-name">{selectedVehicle.name}</h1>
        

        <div className="vehicle-attributes">
          <div className="attribute">
            <span className="attribute-label">Modelo</span>
            <span className="attribute-value">{selectedVehicle.model}</span>
          </div>
          <div className="attribute">
            <span className="attribute-label">Fabricante</span>
            <span className="attribute-value">{selectedVehicle.manufacturer}</span>
          </div>
          <div className="attribute">
            <span className="attribute-label">Precio</span>
            <span className="attribute-value">{selectedVehicle.cost_in_credits} créditos</span>
          </div>
          <div className="attribute">
            <span className="attribute-label">Longitud</span>
            <span className="attribute-value">{selectedVehicle.length} m</span>
          </div>
          <div className="attribute">
            <span className="attribute-label">Velocidad</span>
            <span className="attribute-value">{selectedVehicle.max_atmosphering_speed} km/h</span>
          </div>
          <div className="attribute">
            <span className="attribute-label">Tripulación</span>
            <span className="attribute-value">{selectedVehicle.crew}</span>
          </div>
          <div className="attribute">
            <span className="attribute-label">Pasajeros</span>
            <span className="attribute-value">{selectedVehicle.passengers}</span>
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
      <div className="vehicle-slider">
        {visibleVehicles.map((vehicle, index) => (
          <div 
            key={vehicle.id}
            className={`slider-item ${index + visibleRange.start === selectedIndex ? 'selected' : ''}`}
            onClick={() => handleSelectVehicle(index + visibleRange.start)}
          >
            <div 
              className="slider-visual"
              style={{ 
                backgroundColor: getVehicleColor(vehicle.id)
              }}
            >
              <div className="slider-initial">{vehicle.name.charAt(0)}</div>
            </div>
            <div className="slider-name">{vehicle.name}</div>
          </div>
        ))}
      </div>

      
      <div className="veh-btn">
        <button 
          className="veh-btn-back" 
          onClick={handlePrevious}
          type="button"
        >
          Back
        </button>
        <button 
          className="veh-btn-next" 
          onClick={handleNext}
          type="button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Vehicle;