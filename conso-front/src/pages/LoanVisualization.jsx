import  { useState, useEffect } from "react";
import Modal from "react-modal";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/LoanVisualization.css";
import "../style/LoanVisualizationModal.css";
import authentificate_user from "../authentification";
import VisualizationUser from "../components/visualizationUser";
import Button from "../components/button";
import apiLink from "../constants";
import CE_logo from "../asset/logo-caisse-epargne.png";
import CA_logo from "../asset/logo-credit-agricole.png";
import CM_logo from "../asset/logo-Crédit-Mutuel.png";
import SG_logo from "../asset/logo-societe-generale.png";


export default function LoanVisualization() {
  const [applications, setApplications] = useState([]);
  const [amount, setAmount] = useState("");
  const [tenure, setTenure] = useState("");
  const [selectedOffer, setSelectedOffer] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modal2IsOpen, setModal2IsOpen] = useState(false);

  const [selectedBank, setSelectedBank] = useState(null);
  const [bankIDS, setBankIDS] = useState([]);


  useEffect(() => {
    const authenticateUser = async () => {
      let res = await authentificate_user();
      if (res === false) {
        window.location.href = "/login";
      }
    };
    authenticateUser();

    const getInfo = async () => {
      fetch(`${apiLink}/user/applications`, {
        method: "POST",
        body: JSON.stringify({
          id: localStorage.getItem("user_id"),
          token: localStorage.getItem("token"),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response data
          setApplications(data.applications);
        })
        .catch((error) => {
          // Handle any errors that occur during the request
          console.error(error);
        });
    };
    getInfo();

    
  const getBanks = async () => {
    fetch(`${apiLink}/bank`, {
      method: "POST",
      body: JSON.stringify({
        id: localStorage.getItem("user_id"),
        token: localStorage.getItem("token"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data
        
      const bankIDs = data.banks.map((bank) => bank.id);

      // Utiliser setBankIDS pour définir le tableau des ID
      setBankIDS(bankIDs);

      })
      .catch((error) => {
        // Handle any errors that occur during the request
        console.error(error);
      });
  };
  getBanks();
  }, []);

  const openModal = () => {
    setModalIsOpen(true);
  };
  const openModal2 = () => {
    setModal2IsOpen(true);
  };
  

  const closeModal = () => {
    setModalIsOpen(false);
    location.reload();
  };

  const closeModal2 = () => {
    setModal2IsOpen(false);
  };
  

  const getOffer = async (application) => {
    fetch(`${apiLink}/user/offer`, {
      method: "POST",
      body: JSON.stringify({
        id: localStorage.getItem("user_id"),
        token: localStorage.getItem("token"),
        loan_application_id: application.id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data
        setSelectedOffer(data.offer)
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        console.error(error);
      });
  };
  

  
  const createLoan = async (bankID, _amount, _tenure) => {
    fetch(`${apiLink}/user/apply`, {
      method: "POST",
      body: JSON.stringify({
        id: localStorage.getItem("user_id"),
        token: localStorage.getItem("token"),
        bank_id: bankID,
        amount: _amount,
        tenure: _tenure
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data
        if(data.message==='Error creating loan application'){
          alert(data.message+". You may already have a loan accepted for this bank");

        }
        closeModal();

      })
      .catch((error) => {
        // Handle any errors that occur during the request
        console.log(error)
      });
  };

  const handleDelete = () => {
      console.log("ca arrive");
  }

  const approvedApplications = applications.filter(
    (application) => application.status === "approved"
  );

  const pendingApplications = applications.filter(
    (application) => application.status === "pending"
  );

  const rejectedApplications = applications.filter(
    (application) => application.status === "rejected"
  );

  const handleApplicationClick = (application) => {
    getOffer(application);
  };

  rreturn (
    <>
      <Header />
      <div>
        <h1>Vos demandes de prêts</h1>
        <div className="yeu">
          <Button onClick={openModal} className="test_____" text="Nouvelle Demande" />
        </div>
  
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Modal"
          className="modal-content-"
          overlayClassName="modal-overlay"
        >
          <h2>Nouvelle Demande</h2>
          <div className="loanInputs">
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Montant"
            />
            <input
              type="text"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              placeholder="Durée"
            />
          </div>
  
          <div className="bank-logos">
            <img
              src={CE_logo}
              alt="CE Bank"
              className={`bank-logo ${selectedBank === bankIDS[1] ? "selected" : ""}`}
              onClick={() => setSelectedBank(bankIDS[1])}
            />
            <img
              src={CA_logo}
              alt="CA Bank"
              className={`bank-logo ${selectedBank === bankIDS[2] ? "selected" : ""}`}
              onClick={() => setSelectedBank(bankIDS[2])}
            />
            <img
              src={CM_logo}
              alt="CM Bank"
              className={`bank-logo ${selectedBank === bankIDS[3] ? "selected" : ""}`}
              onClick={() => setSelectedBank(bankIDS[3])}
            />
            <img
              src={SG_logo}
              alt="SG Bank"
              className={`bank-logo ${selectedBank === bankIDS[0] ? "selected" : ""}`}
              onClick={() => setSelectedBank(bankIDS[0])}
            />
          </div>
          <div className="popUpButtons">
            <Button text="Envoyer" onClick={() => {
              if (!amount || !tenure) {
                alert("Le montant et la durée sont des champs obligatoires");
                return;
              }
              createLoan(selectedBank, amount, tenure);
            }} />
            <Button text="Fermer" onClick={closeModal} />
          </div>
        </Modal>
  
        <Modal
          isOpen={modal2IsOpen}
          onRequestClose={closeModal2}
          contentLabel="Modal 2"
          className="modal-content-"
          overlayClassName="modal-overlay"
        >
          <h2>Offre associée à votre demande de prêt</h2>
          <p>Votre ID de prêt : #{selectedOffer.loan_application_id}</p>
          <p>Demande acceptée à un taux d'intérêt annuel de <b>{selectedOffer.interest_rate}%</b></p>
          <p>Accepté le {new Date(selectedOffer.date_posted).toLocaleDateString("fr-FR")}</p>
          <p><i>Votre banquier vous contactera bientôt pour poursuivre la procédure de prêt</i></p>
          <Button text="Fermer" onClick={closeModal2} />
        </Modal>
  
        <h1>Demandes approuvées</h1>
  
        <div className="labels">
          <p>ID</p>
          <p>Banque</p>
          <p>Montant</p>
          <p>Durée</p>
          <p>Date</p>
        </div>
        <ul>
          {approvedApplications.map((application, index) => (
            <li key={index}>
              <VisualizationUser
                applicationID={application.id}
                bank={application.bank_id}
                status={application.status}
                amount={application.amount}
                tenure={application.tenure}
                onClickText="Voir l'offre"
                onClick={() => { handleApplicationClick(application); getOffer(application); openModal2(); }}
                datePostedUser={new Date(application.date_posted).toLocaleDateString("fr-FR")}
              />
            </li>
          ))}
        </ul>
  
        <h1>Demandes en attente</h1>
        <div className="labels">
          <p>ID</p>
          <p>Banque</p>
          <p>Montant</p>
          <p>Durée</p>
          <p>Date</p>
        </div>
        <ul>
          {pendingApplications.map((application, index) => (
            <li key={index}>
              <VisualizationUser
                applicationID={application.id}
                bank={application.bank_id}
                status={application.status}
                amount={application.amount}
                tenure={application.tenure}
                onClickText="Supprimer"
                onClick={() => handleDelete()}
                datePostedUser={new Date(application.date_posted).toLocaleDateString("fr-FR")}
              />
            </li>
          ))}
        </ul>
  
        <h1>Demandes rejetées</h1>
        <div className="labels">
          <p>ID</p>
          <p>Banque</p>
          <p>Montant</p>
          <p>Durée</p>
          <p>Date</p>
        </div>
        <ul>
          {rejectedApplications.map((application, index) => (
            <li key={index}>
              <VisualizationUser
                applicationID={application.id}
                bank={application.bank_id}
                status={application.status}
                amount={application.amount}
                tenure={application.tenure}
                date={new Date(application.date_posted).toLocaleDateString("fr-FR")}
              />
            </li>
          ))}
        </ul>
      </div>
  
      <Footer />
    </>
  );
          }