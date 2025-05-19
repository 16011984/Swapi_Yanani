import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {

  const [favorites, setFavorites] = useState(() => {
    
    const savedFavorites = localStorage.getItem('starWarsFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  
  
  const [showFavorites, setShowFavorites] = useState(false);
  

  const favoritesDropdownRef = useRef(null);
  
  const favoritesBtnRef = useRef(null);


  const removeFavorite = (id, e) => {

    e.stopPropagation();
    
 
    const updatedFavorites = favorites.filter(fav => fav.id !== id);
    
    // Actualizar el estado
    setFavorites(updatedFavorites);
    

    localStorage.setItem('starWarsFavorites', JSON.stringify(updatedFavorites));
    
  
    const event = new CustomEvent('favoritesUpdated', {
      detail: { favorites: updatedFavorites }
    });
    window.dispatchEvent(event);
  };

 
  useEffect(() => {
    const handleFavoritesUpdate = (event) => {
      setFavorites(event.detail.favorites);
    };
    
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    
    // Limpieza al desmontar
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    };
  }, []);


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


  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  return (
    <nav className="navbar">	
      <div className="nav-container">
        <Link to="/" className="nav-link-home">Home</Link>
        
        <div className="favorites-container">
          <button 
            ref={favoritesBtnRef}
            className={`nav-btn-fav ${favorites.length > 0 ? 'has-favorites' : ''}`}
            onClick={toggleFavorites}
            type="button"
          >
            Favorites {favorites.length > 0 && <span className="favorites-count">{favorites.length}</span>}
          </button>
          
          {showFavorites && (
            <div ref={favoritesDropdownRef} className="favorites-dropdown">
              <div className="favorites-header">
                <h3>Mis Personajes Favoritos</h3>
              </div>
              
              {favorites.length === 0 ? (
                <div className="no-favorites">
                  No tienes favoritos aún
                </div>
              ) : (
                <ul className="favorites-list">
                  {favorites.map(favorite => (
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