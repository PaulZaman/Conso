import PropTypes from 'prop-types';
import { GrValidate } from 'react-icons/gr';
import '../style/style-components/simulationButton.css';

export default function SimulationButton(props) {
  return (
    <div className="simulationButtonDiv">
        <button onClick={props.onclick} className="simulationButton">
          <GrValidate style={{ color: 'white' }} className="simulationIcon" />
          <p>{props.text}</p>
        </button>
    </div>
  );
}

SimulationButton.propTypes = {
  onclick: PropTypes.func,
  text: PropTypes.string.isRequired,
};
