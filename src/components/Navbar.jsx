import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  // Estados para los diferentes tipos de favoritos
  const [characterFavorites, setCharacterFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('starWarsFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  
  const [vehicleFavorites, setVehicleFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('starWarsVehicleFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  
  const [planetFavorites, setPlanetFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('starWarsPlanetFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  
  // Estado compartido para mostrar los favoritos
  const [showFavorites, setShowFavorites] = useState(false);
  
  // Estado para determinar qué tipo de favorito está siendo mostrado
  const [currentFavoriteType, setCurrentFavoriteType] = useState('characters');
  
  const favoritesDropdownRef = useRef(null);
  const favoritesBtnRef = useRef(null);

  // Función para eliminar un favorito del tipo actualmente seleccionado
  const removeFavorite = (id, e) => {
    e.stopPropagation();
    
    let updatedFavorites = [];
    
    if (currentFavoriteType === 'characters') {
      updatedFavorites = characterFavorites.filter(fav => fav.id !== id);
      setCharacterFavorites(updatedFavorites);
      localStorage.setItem('starWarsFavorites', JSON.stringify(updatedFavorites));
      
      const event = new CustomEvent('favoritesUpdated', {
        detail: { favorites: updatedFavorites }
      });
      window.dispatchEvent(event);
    } 
    else if (currentFavoriteType === 'vehicles') {
      updatedFavorites = vehicleFavorites.filter(fav => fav.id !== id);
      setVehicleFavorites(updatedFavorites);
      localStorage.setItem('starWarsVehicleFavorites', JSON.stringify(updatedFavorites));
      
      const event = new CustomEvent('vehicleFavoritesUpdated', {
        detail: { favorites: updatedFavorites }
      });
      window.dispatchEvent(event);
    }
    else if (currentFavoriteType === 'planets') {
      updatedFavorites = planetFavorites.filter(fav => fav.id !== id);
      setPlanetFavorites(updatedFavorites);
      localStorage.setItem('starWarsPlanetFavorites', JSON.stringify(updatedFavorites));
      
      const event = new CustomEvent('planetFavoritesUpdated', {
        detail: { favorites: updatedFavorites }
      });
      window.dispatchEvent(event);
    }
  };

  // Efectos para escuchar actualizaciones de favoritos
  useEffect(() => {
    const handleFavoritesUpdate = (event) => {
      setCharacterFavorites(event.detail.favorites);
    };
    
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    };
  }, []);
  
  useEffect(() => {
    const handleVehicleFavoritesUpdate = (event) => {
      setVehicleFavorites(event.detail.favorites);
    };
    
    window.addEventListener('vehicleFavoritesUpdated', handleVehicleFavoritesUpdate);
    
    return () => {
      window.removeEventListener('vehicleFavoritesUpdated', handleVehicleFavoritesUpdate);
    };
  }, []);
  
  useEffect(() => {
    const handlePlanetFavoritesUpdate = (event) => {
      setPlanetFavorites(event.detail.favorites);
    };
    
    window.addEventListener('planetFavoritesUpdated', handlePlanetFavoritesUpdate);
    
    return () => {
      window.removeEventListener('planetFavoritesUpdated', handlePlanetFavoritesUpdate);
    };
  }, []);

  // Efecto para detectar clics fuera del dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showFavorites &&
        favoritesDropdownRef.current &&
        favoritesBtnRef.current &&
        !favoritesDropdownRef.current.contains(event.target) &&
        !favoritesBtnRef.current.contains(event.target)
      ) {
        setShowFavorites(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFavorites]);

  // Función para alternar la visibilidad de los favoritos
  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  // Total de todos los favoritos
  const totalFavorites = characterFavorites.length + vehicleFavorites.length + planetFavorites.length;

  // Obtener los favoritos actuales basados en el tipo seleccionado
  const getCurrentFavorites = () => {
    switch (currentFavoriteType) {
      case 'characters':
        return characterFavorites;
      case 'vehicles':
        return vehicleFavorites;
      case 'planets':
        return planetFavorites;
      default:
        return characterFavorites;
    }
  };

  // Texto para el encabezado del dropdown
  const getFavoriteTitle = () => {
    switch (currentFavoriteType) {
      case 'characters':
        return 'Mis Personajes Favoritos';
      case 'vehicles':
        return 'Mis Vehículos Favoritos';
      case 'planets':
        return 'Mis Planetas Favoritos';
      default:
        return 'Mis Favoritos';
    }
  };

  return (
    <nav className="navbar">	
      <div className="nav-container">
      
        
        <div className="favorites-container">
          <button 
            ref={favoritesBtnRef}
            className={`nav-btn-fav ${totalFavorites > 0 ? 'has-favorites' : ''}`}
            onClick={toggleFavorites}
            type="button"
          >
            Favorites {totalFavorites > 0 && <span className="favorites-count">{totalFavorites}</span>}
          </button>
          
          {showFavorites && (
            <div ref={favoritesDropdownRef} className="favorites-dropdown">
              <div className="favorites-header">
                <h3>{getFavoriteTitle()}</h3>
                <div className="favorites-category-selector">
                  <button 
                    onClick={() => setCurrentFavoriteType('characters')}
                    className={currentFavoriteType === 'characters' ? 'active' : ''}
                    type="button"
                  >
                    Personajes {characterFavorites.length > 0 && <span>({characterFavorites.length})</span>}
                  </button>
                  <button 
                    onClick={() => setCurrentFavoriteType('vehicles')}
                    className={currentFavoriteType === 'vehicles' ? 'active' : ''}
                    type="button"
                  >
                    Vehículos {vehicleFavorites.length > 0 && <span>({vehicleFavorites.length})</span>}
                  </button>
                  <button 
                    onClick={() => setCurrentFavoriteType('planets')}
                    className={currentFavoriteType === 'planets' ? 'active' : ''}
                    type="button"
                  >
                    Planetas {planetFavorites.length > 0 && <span>({planetFavorites.length})</span>}
                  </button>
                </div>
              </div>
              
              {getCurrentFavorites().length === 0 ? (
                <div className="no-favorites">
                  No tienes favoritos aún
                </div>
              ) : (
                <ul className="favorites-list">
                  {getCurrentFavorites().map(favorite => (
                    <li key={favorite.id} className="favorite-item">
                      <div 
                        className="favorite-color" 
                        style={{ backgroundColor: favorite.color }}
                      ></div>
                      <span className="favorite-name">{favorite.name}</span>
                      <button 
                        className="remove-favorite-btn" 
                        onClick={(e) => removeFavorite(favorite.id, e)}
                        type="button"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;