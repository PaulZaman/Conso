import '../style/visualizationUser.css'


export default function VisualizationUser(props){

    function handleDelete(){

    }

    let color;

    if (props.status === 'pending') {
        color = 'orange';
    } else if (props.status === 'accepted') {
        color = 'green';
    } else {
        color = 'red';
    }
    return(
        <>
        

        <div style={{borderColor: color}}className='visualizationCard'>
                <p>{props.applicationID}</p>
                <p>{props.bank}</p>
                <p>{props.date}</p>
                <p>{props.amount}</p>
                <p>{props.tenure}</p>
                <a className='link' onClick={handleDelete}>Delete</a>
        </div>

        </>
    );
}