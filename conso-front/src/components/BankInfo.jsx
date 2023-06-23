import '../style/BankInfo.css'

export default function BankInfo(props){
    return(
        <div className='bankInfoCard'>
            <img src={props.img} alt={props.alt} />
            <h3>{props.bankName}</h3>                
            <div>
                <p className='bankDescription'>{props.description}</p>
                <a className='bankLink' href={props.link}>See more</a>
            </div>
        </div>
    );
}