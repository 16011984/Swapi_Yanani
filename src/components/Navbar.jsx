import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {

	return (

		<nav className="navbar">	
			<div className="nav-container">
				<Link  to="/" className="nav-link-home">  Home </Link>
				<button className="nav-btn-fav">Favorites</button>
			</div>
		</nav>
	);
};
export default Navbar;