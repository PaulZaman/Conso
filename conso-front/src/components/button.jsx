import '../style/Button.css'

export default function Button(props){
    return(
        <a href={props.to}>
            <button onClick={props.onClick} className='Button' type='button'>
                <p>{props.text}</p>
            </button>
        </a>
    );
}