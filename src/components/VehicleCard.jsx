import { useState, useEffect } from "react";
import "./vehiclecard.css";

const VehicleCard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Función para obtener el ID del vehículo de SWAPI
  const getVehicleId = (swapiId) => {
    return swapiId;
  };

  // Función modificada para usar una API de imágenes alternativa
  const getVehicleImageUrl = (id) => {
    // Usamos starwars-visualguide.com que proporciona imágenes oficiales de Star Wars
    return `https://starwars-visualguide.com/assets/img/vehicles/${id}.jpg`;
  };

  const handleNext = () => {
    if (vehicles.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % vehicles.length);
    }
  };

  const handlePrevious = () => {
    if (vehicles.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + vehicles.length) % vehicles.length);
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
            id: vehicle.uid,
            imageUrl: getVehicleImageUrl(getVehicleId(vehicle.uid))
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

  useEffect(() => {
    const nextButton = document.querySelector('.veh-btn-next');
    const backButton = document.querySelector('.veh-btn-back');
    
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
  }, [vehicles.length]); 

  if (loading) {
    return <div className="veh_card loading">Cargando vehículos...</div>;
  }

  if (error) {
    return <div className="veh_card error">{error}</div>;
  }
  
  if (vehicles.length === 0) {
    return <div className="veh_card">No se encontraron vehículos</div>;
  }
  
  const vehicle = vehicles[currentIndex];

  return (
    <div className="veh_card">
      <div className="veh-image-container">
        <img 
          src={vehicle.imageUrl} 
          alt={`Imagen de ${vehicle.name}`}
          onError={(e) => {
         
            e.target.onerror = null;
            e.target.style.display = "none";
            
            // Crear un elemento de fallback
            const fallbackContainer = document.createElement('div');
            fallbackContainer.className = 'fallback-image';
            const textContainer = document.createElement('div');
            textContainer.className = 'fallback-image-text';
            textContainer.textContent = vehicle.name;
            fallbackContainer.appendChild(textContainer);
            
            
            e.target.parentNode.appendChild(fallbackContainer);
          }}
          className="veh-image"
        />
      </div>
      <h2>{vehicle.name}</h2>
      <div className="veh-details">
        <p><strong>Modelo:</strong> {vehicle.model}</p>
        <p><strong>Fabricante:</strong> {vehicle.manufacturer}</p>
        <p><strong>Precio:</strong> {vehicle.cost_in_credits} créditos</p>
        <p><strong>Longitud:</strong> {vehicle.length} m</p>
        <p><strong>Velocidad máx.:</strong> {vehicle.max_atmosphering_speed} km/h</p>
        <p><strong>Tripulación:</strong> {vehicle.crew}</p>
        <p><strong>Pasajeros:</strong> {vehicle.passengers}</p>
      </div>
    </div>
  );
};

export default VehicleCard;