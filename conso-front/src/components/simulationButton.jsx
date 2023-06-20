import "../style/simulationButton.css";
import { GrValidate } from "react-icons/gr";

export default function SimulationButton(props) {
  return (
    <div className="simulationButtonDiv">
      <a href={props.to}>
        <button onClick={props.onclick} className="simulationButton">
          <GrValidate style={{ color: "white" }} className="simulationIcon" />
          <p>{props.text}</p>
        </button>
      </a>
    </div>
  );
}
