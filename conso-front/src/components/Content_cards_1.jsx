import PropTypes from 'prop-types';
import { GrValidate } from 'react-icons/gr';
import '../style/ContentCard1.css';

export default function ContentCard1(props) {
  return (
    <div className="content_card">
      <GrValidate className="icon" />
      <p>{props.text}</p>
    </div>
  );
}

ContentCard1.propTypes = {
  text: PropTypes.string.isRequired,
};
