import "./character.css";
import CharacterCard from "./Charactercard";

const Character = () => {

        return (
                <div className="character">

                        <div className="cha-btn">
                                <button className="cha-btn-next"> Next </button>
                                <button className="cha-btn-back"> Back </button>
                        </div>

                        <div className="carousel">

                                <div className="list">

                                        <div className="cha-cha-card">
                                                <CharacterCard />
                                        </div>
                                </div>


                        </div>




                </div>

        );
}

export default Character;