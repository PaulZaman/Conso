import PropTypes from 'prop-types';
import '../style/Button.css';

export default function Button(props) {
  return (
      <button onClick={props.onClick} className="Button" type="button">
        <p className="textLink">{props.text}</p>
      </button>
  );
}

Button.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string.isRequired,
};
