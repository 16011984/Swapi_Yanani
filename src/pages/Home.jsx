
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import "./home.css";
import "../components/Character.jsx";
import Character from "../components/Character.jsx";

const Home = () => {

  const {store, dispatch} =useGlobalReducer()

	return (
		<div className="home">
			<Character/>
		</div>
	);
}; 
export default Home;