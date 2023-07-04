import { useState, useEffect } from "react";
import Modal from "react-modal";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ApplicationBanker from "../components/ApplicationsBanker";
import authentificate_user from "../authentification";
import apiLink from "../constants";
import "../style/style-components/LoanVisualizationBankerModal.css";
import "../style/style-pages/LoanVisualizationBanker.css";
import Button from "../components/button";
Modal.setAppElement("#root");

export default function LoanVisualizationBanker() {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [salary, setSalary] = useState("");
  const [email, setEmail] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [userDocuments, setUserDocuments] = useState([]);

  const [documentPaths, setDocumentPaths] = useState([]);

  // New state for interest rate

  useEffect(() => {
    const authenticateUser = async () => {
      let res = await authentificate_user();
      if (res === false) {
        window.location.href = "/login";
      }
    };
    authenticateUser();

    const getInfo = async () => {
      fetch(`${apiLink}/banker/applications`, {
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
          console.log(data.applications);
          setApplications(data.applications);
        })
        .catch((error) => {
          // Handle any errors that occur during the request
          console.error(error);
        });
    };
    getInfo();
  }, []);

  const rejectApplication = async (application) => {
    fetch(`${apiLink}/banker/refuse`, {
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
        alert("Application rejected");
        // Handle the response data
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        console.error(error);
      });
  };
  // afficher correctement le nom d'un document
  const decodeURL = (url) => {
    return decodeURIComponent(url.replace(/\+/g, " "));
  };

  const makeOffer = async (application, interestRate) => {
    fetch(`${apiLink}/banker/offer`, {
      method: "POST",
      body: JSON.stringify({
        id: localStorage.getItem("user_id"),
        token: localStorage.getItem("token"),
        loan_application_id: application.id,
        interest_rate: interestRate,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Application accepted, offer created");
        // Handle the response data
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        console.error(error);
      });
  };

  const getUser = async (application) => {
    fetch(`${apiLink}/banker/user`, {
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
        console.log(data.user);
        setFirstName(data.user.firstname);
        setLastName(data.user.lastname);
        setDob(new Date(data.user.dob).toLocaleDateString("en-GB"));
        setEmail(data.user.email);
        setSalary(data.user.salary);
        setUserDocuments(data.documents);

        // Loop through the documents and store the paths in an array
        const documentPaths = data.documents.map(
          (document) => document.document_path
        );
        console.log(data);
        console.log(documentPaths);

        // Update the state with the document paths
        setDocumentPaths(documentPaths);
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        console.error(error);
      });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const approvedApplications = applications.filter(
    (application) => application.status === "approved"
  );

  const pendingApplications = applications.filter(
    (application) => application.status === "pending"
  );

  const handleAccept = () => {
    // Perform the accept action here
    if (interestRate === "") {
      alert("Please enter an interest rate");
      return;
    }
    makeOffer(selectedApplication, interestRate);
    console.log("Application accepted:", selectedApplication);
    // Reset the selected application and interest rate
    setSelectedApplication(null);
    setInterestRate("");
    location.reload();
  };

  const handleReject = () => {
    // Perform the reject action here
    rejectApplication(selectedApplication);
    console.log("Application rejected:", selectedApplication);
    // Reset the selected application
    setSelectedApplication(null);
    location.reload();
  };

  const handleApplicationClick = (application) => {
    setSelectedApplication(application);
    getUser(application); // Fetch user data
    openModal();
  };

  const handleOpenAllDocuments = () => {
    documentPaths.forEach((documentPath) => {
      window.open(documentPath, "_blank");
    });
  };

  const getFileNameFromPath = (filePath) => {
    const parts = filePath.split("/");
    let fileName = parts[parts.length - 1];
    const questionMarkIndex = fileName.indexOf("?");
    if (questionMarkIndex !== -1) {
      fileName = fileName.substring(0, questionMarkIndex);
    }
    return fileName;
  };

  return (
    <>
      <Header />
      <h1>Consulter vos requêtes de prêts</h1>
      <div className="applications">
        <h1>Demandes approuvées</h1>
        <ul>
          {approvedApplications.map((application, index) => (
            <li key={index}>
              <ApplicationBanker
                id={application.id} // Pass the user's first name as prop
                loanAmount={application.amount}
                tenure={application.tenure}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="applications">
        <h1>Demandes en attente</h1>
        <ul>
          {pendingApplications.map((application, index) => (
            <li key={index} onClick={() => handleApplicationClick(application)}>
              <ApplicationBanker
                id={application.id} // Pass the user's first name as prop
                loanAmount={application.amount}
                tenure={application.tenure}
              />
            </li>
          ))}
        </ul>
      </div>
      <Footer />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Application Description"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        {selectedApplication && (
          <div>
            <div className="userLegalInfo">
              <h1>
                {firstName} {lastName}
              </h1>
              <p>{dob}</p>
            </div>
            <p>{email}</p>
            <p>
              Salaire: <b>{salary}</b>€/mois
            </p>
            <div className="loanInfo">
              <p>
                <b>{selectedApplication.amount}</b>€ sur{" "}
                <b>{selectedApplication.tenure}</b> années
              </p>
            </div>
            <p>Files:</p>
            {documentPaths.length > 0 ? (
              <>
                {documentPaths.map((documentPath, index) => (
                  <div key={index}>
                    <p>{getFileNameFromPath(decodeURL(documentPath))}</p>
                  </div>
                ))}
                <Button
                  text="Ouvrir les documents"
                  onClick={handleOpenAllDocuments}
                />
              </>
            ) : (
              <p>Aucun fichier trouvé.</p>
            )}

            <p>Interest rate :</p>
            <input
              type="text"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
            />
            {/* Add any other specific application information here */}
            <div className="buttonBanker">
              <Button text="Accepter" onClick={handleAccept} />
              <Button text="Rejetter" onClick={handleReject} />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
