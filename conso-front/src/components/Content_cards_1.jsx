import '../style/ContentCard1.css'
import { GrValidate } from 'react-icons/gr';


export default function ContentCard1(props){
    return(
        <div className='content_card'>
            <GrValidate className='icon'/>
            <p>{props.text}</p>
        </div>
    );
}