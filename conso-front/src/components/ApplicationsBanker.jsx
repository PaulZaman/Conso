import PropTypes from 'prop-types';
import '../style/style-components/ApplicationBanker.css';


export default function ApplicationBanker(props) {
  return (
    <div className="applicationBanker">
      <p>{props.id}</p>
      <p>{props.tenure} années</p>
      <p>
        <b>{props.loanAmount}</b>€
      </p>
    </div>
  );
}

ApplicationBanker.propTypes = {
  id: PropTypes.number.isRequired,
  tenure: PropTypes.number.isRequired,
  loanAmount: PropTypes.number.isRequired,
};
