import PropTypes from 'prop-types';
import '../style/visualizationUser.css';

export default function VisualizationUser(props) {
  let color;

  if (props.status === 'pending') {
    color = 'orange';
  } else if (props.status === 'approved') {
    color = 'green';
  } else {
    color = 'red';
  }

  return (
    <>
      {props.status === 'approved' ? (
        <div style={{ borderColor: color }} className="visualizationCard">
          <p>{props.applicationID}</p>
          <p>{props.bank}</p>
          <p>{props.amount}€</p>
          <p>{props.tenure} years</p>
          <p>{props.datePostedUser}</p>
          <a className="link" onClick={props.onClick}>
            {props.onClickText}
          </a>
        </div>
      ) : (
        <div style={{ borderColor: color }} className="visualizationCard">
          <p>{props.applicationID}</p>
          <p>{props.bank}</p>
          <p>{props.amount}€</p>
          <p>{props.tenure} years</p>
          <p>{props.datePostedUser}</p>
          <a className="link" onClick={props.onClick}>
            {props.onClickText}
          </a>
        </div>
      )}
    </>
  );
}

VisualizationUser.propTypes = {
  applicationID: PropTypes.number.isRequired,
  bank: PropTypes.number.isRequired,
  status: PropTypes.oneOf(['pending', 'approved', 'refused']).isRequired,
  amount: PropTypes.number.isRequired,
  tenure: PropTypes.number.isRequired,
  datePostedUser: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onClickText: PropTypes.string.isRequired,
};
