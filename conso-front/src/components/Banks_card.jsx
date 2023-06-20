import '../style/Banks_card.css'
import SG from '../asset/logo-societe-generale.png'
import CM from '../asset/logo-Crédit-Mutuel.png'
import CA from '../asset/logo-credit-agricole.png'
import CE from '../asset/logo-caisse-epargne.png'


export default function BanksCard(){
    return(
        <div className='contentCard'>
            <img src={SG} alt='société générale' ></img>
            <img src={CM} alt='crédit mutuel'></img>
            <img src={CA} alt='crédit agricole'></img>
            <img src={CE} alt="caisse d'épargne"></img>
        </div>
    );
}