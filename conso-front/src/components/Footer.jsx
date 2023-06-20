import '../style/Footer.css'
import Logo from '../asset/logo.png'

export default function Footer(){
    return(
        <footer>
            <img src={Logo} alt="logo" />
            <div className='footer_list'>
                <a href='/loan_simulator'>Estimer ma capacité d'emprunt</a>
                <a href='/about'>Qui sommes nous ?</a>
                <a href='/loan_application'>Déposer ma demande de prêt</a>
                <a href='mailto:matthieu.vichet@efrei.net'>Nous contacter</a>
            </div>
        </footer>
    );
}