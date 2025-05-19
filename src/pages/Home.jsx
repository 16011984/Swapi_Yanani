
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import "./home.css";
import Character from "../components/Character.jsx";
import Vehicle from "../components/Vehicle.jsx";
import Planet from "../components/Planet.jsx";

const Home = () => {

  const {store, dispatch} =useGlobalReducer()

	return (
		<div className="home">
			<Character/>
			<Vehicle/>
			<Planet/>
		</div>
	);
}; 
export default Home;