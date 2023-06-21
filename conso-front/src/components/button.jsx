import '../style/Button.css'

export default function Button(props){
    return(
        <a href={props.to}>
            <button onClick={props.onClick} className='Button' type='button'>
                <p className='textLink'>{props.text}</p>
            </button>
        </a>
    );
}