import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/style-pages/About.css";
import ContentCard1 from "../components/Content_cards_1";
import Button from "../components/button";
import userAboutUs from "../asset/userAboutUs.png"
import bankerAboutUs from "../asset/bankerAboutUs.png"

export default function About(){

  function sendEmail() {
    var email = 'conso.srvc@gmail.com';
    var subject = "Conso. - J'ai une question!";
  
    var mailtoUrl = 'mailto:' + email + '?subject=' + encodeURIComponent(subject);
  
    window.open(mailtoUrl);
  }
    return (
        <>
        <Header />
        <div className="aboutUsContent">
          <h1 className="aboutUsTitle">Conso. Votre crédit en 2 clics</h1>
          <h1>Chez <b>Conso.</b>, nous sommes fiers de fournir une plateforme de brokerage immobilier qui met en relation les utilisateurs à la recherche de prêts avec des banquiers qualifiés. Notre objectif est de simplifier le processus de demande de prêt immobilier en offrant une expérience fluide, sécurisée et transparente pour tous nos utilisateurs. Que vous soyez un particulier à la recherche d'un prêt pour votre nouvelle maison ou un investisseur immobilier souhaitant obtenir un financement pour un projet, notre application de brokerage immobilier est là pour vous aider.</h1>
            
          <div className="content_group">
            <ContentCard1 text="Un seul dossier pour toutes vos demandes de prêts" />
            <ContentCard1 text="Toutes vos demandes aux mêmes endroit" />
            <ContentCard1 text="Suivi optimisé de vos démarches" />
          </div>

          <div className="userFunctionnalities">
            <img className="imgAboutUs" src={userAboutUs} alt="userAboutUs"></img>
            <div className="functionnalitiesContentText">
              <h3 className="functionnalitiesContentTextTitle">Service tout-en-un pour les demandeurs de prêts</h3>
              <ul>
                <li><b style={{color: '#9E44E4'}}>Gestion de compte</b> : Les utilisateurs peuvent facilement gérer leur compte personnel pour accéder à notre plateforme et commencer leurs demandes de prêts.</li>
                <li><b style={{color: '#9E44E4'}}>Simulation de prêt</b> : Notre application permet aux utilisateurs de simuler leur prêt en fournissant les informations nécessaires, telles que le montant souhaité, la durée du prêt et d'autres paramètres pertinents. Cela leur permet d'obtenir une estimation préliminaire de leur capacité d'emprunt.</li>
                <li><b style={{color: '#9E44E4'}}>Gestion des documents</b> : Notre application offre aux utilisateurs la possibilité de visualiser, modifier et mettre à jour leurs propres documents tout au long du processus de demande de prêt.</li>
                <li><b style={{color: '#9E44E4'}}>Candidature aux banques</b> : Les utilisateurs ont la possibilité de soumettre leur demande de prêt à une ou plusieurs banques partenaires via notre plateforme. Cela leur permet de maximiser leurs chances d'obtenir les meilleures offres de prêt.</li>
              
              </ul>
            </div>

          </div>
          <div className="bankerFunctionnalities">
          <div className="functionnalitiesContentText">
            <h3 className="functionnalitiesContentTextTitle">Processus de réponses aux demandes centralisé pour les banquiers</h3>
            <ul>
              <li><b style={{color: '#9E44E4'}}>Création de comptes pour les banquiers</b> : Nous offrons aux banques la possibilité de créer des comptes pour leurs banquiers afin de faciliter la collaboration et la communication avec les utilisateurs.</li>
              <li><b style={{color: '#9E44E4'}}>Consultation des demandes de prêt</b> : Les banques peuvent consulter toutes les demandes de prêt soumises par les utilisateurs via notre plateforme, leur permettant ainsi de prendre des décisions éclairées.</li>
              <li><b style={{color: '#9E44E4'}}>Réalisation d&apos;offres de prêt</b> : Les banques ont la possibilité de formuler des offres de prêt personnalisées en fonction des demandes des utilisateurs, en fournissant des taux d&apos;intérêt compétitifs et des conditions attractives.</li>
            </ul>        
          </div>
          <img className="imgAboutUs" src={bankerAboutUs} alt="bankerAboutUs"></img>
          </div>
          <div className="seeMore">
            <h3>Vous voulez en savoir plus ?</h3>
            <Button text="Nous contacter" onClick={sendEmail} />
          </div>
          <h1>Chez Conso., nous nous engageons à offrir une expérience utilisateur exceptionnelle, en simplifiant le processus de demande de prêt immobilier et en favorisant une collaboration transparente entre les utilisateurs et les banques. Nous nous efforçons de garantir la sécurité, la confidentialité et la fiabilité de notre plateforme, tout en offrant des fonctionnalités avancées pour répondre aux besoins spécifiques de nos utilisateurs et des banques partenaires.</h1>
        </div>
        <Footer />
        </>
    );
}