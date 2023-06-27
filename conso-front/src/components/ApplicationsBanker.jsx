import '../style/ApplicationBanker.css'

export default function ApplicationBanker(props){
    return(
        <div className='applicationBanker'>
            <p>{props.name}</p>
            <p><b>{props.monthlySalary}</b>€/month</p>
            <p>{props.tenure}</p>
            <p><b>{props.loanAmount}</b>€</p>
        </div>
    );
}