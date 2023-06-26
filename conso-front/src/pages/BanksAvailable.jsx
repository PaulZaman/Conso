import Header from "../components/Header";
import Footer from "../components/Footer";
import BankInfo from "../components/BankInfo";
import CE from '../asset/logo-caisse-epargne.png';
import '../style/BanksAvailable.css'

export default function BanksAvailable(){
    return (
        <>
        <Header />
        <div className="banksContent">
        <BankInfo img={CE} alt="Caisse d'épargne" bankName="Caisse d'épargne" description='AH OUI OUI OUI' link='www.twitter.com' />
        <BankInfo img={CE} alt="Caisse d'épargne" bankName="Caisse d'épargne" description='AH OUI OUI OUI' link='www.twitter.com' />
        <BankInfo img={CE} alt="Caisse d'épargne" bankName="Caisse d'épargne" description='AH OUI OUI OUI' link='www.twitter.com' />
        <BankInfo img={CE} alt="Caisse d'épargne" bankName="Caisse d'épargne" description='AH OUI OUI OUI' link='www.twitter.com' />
        <BankInfo img={CE} alt="Caisse d'épargne" bankName="Caisse d'épargne" description='AH OUI OUI OUI' link='www.twitter.com' />
        <BankInfo img={CE} alt="Caisse d'épargne" bankName="Caisse d'épargne" description='AH OUI OUI OUI' link='www.twitter.com' />
        <BankInfo img={CE} alt="Caisse d'épargne" bankName="Caisse d'épargne" description='AH OUI OUI OUI' link='www.twitter.com' />
        <BankInfo img={CE} alt="Caisse d'épargne" bankName="Caisse d'épargne" description='AH OUI OUI OUI' link='www.twitter.com' />
        <BankInfo img={CE} alt="Caisse d'épargne" bankName="Caisse d'épargne" description='AH OUI OUI OUI' link='www.twitter.com' />
        <BankInfo img={CE} alt="Caisse d'épargne" bankName="Caisse d'épargne" description='AH OUI OUI OUI' link='www.twitter.com' />
        <BankInfo img={CE} alt="Caisse d'épargne" bankName="Caisse d'épargne" description='AH OUI OUI OUI' link='www.twitter.com' />
        <BankInfo img={CE} alt="Caisse d'épargne" bankName="Caisse d'épargne" description='AH OUI OUI OUI' link='www.twitter.com' />

        </div>
        <Footer />

        </>
    );
}