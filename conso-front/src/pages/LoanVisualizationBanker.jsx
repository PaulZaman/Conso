import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ApplicationBanker from "../components/ApplicationsBanker";
import authentificate_user from "../authentification";
import apiLink from "../constants";
import "../style/LoanVisualizationModal.css";
import "../style/LoanVisualizationBanker.css";
import Button from "../components/button";


Modal.setAppElement("#root");

export default function LoanVisualizationBanker() {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const rejectedApplications = applications.filter(
    (application) => application.status === "rejected"
  );

  const handleAccept = () => {
    // Perform the accept action here
    console.log("Application accepted:", selectedApplication);
    // Reset the selected application
    setSelectedApplication(null);
  };

  const handleReject = () => {
    // Perform the reject action here
    console.log("Application rejected:", selectedApplication);
    // Reset the selected application
    setSelectedApplication(null);
  };

  const handleApplicationClick = (application) => {
    setSelectedApplication(application);
    openModal();
  };

  return (
    <>
      <Header />
      <h1>Consulter vos demandes de prêts</h1>
      <div className="applications">
        <h1>Approved Applications</h1>

        <ul>
          {approvedApplications.map((application, index) => (
            <li key={index}>
              <ApplicationBanker
                name={application.id}
                monthlySalary={application.bank_id}
                loanAmount={application.amount}
                tenure={application.tenure}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="applications">
        <h1>Pending Applications</h1>
        <ul>
          {pendingApplications.map((application, index) => (
            <li key={index} onClick={() => handleApplicationClick(application)}>
              <ApplicationBanker
                name={application.id}
                monthlySalary={application.bank_id}
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
            <h1>Name: {selectedApplication.id}</h1>
            <p>Date of birth</p>
            <p>Monthly Salary: {selectedApplication.bank_id}</p>
            <p>Loan Amount: {selectedApplication.amount}</p>
            <p>Tenure: {selectedApplication.tenure}</p>
            <p>Email: {selectedApplication.tenure}</p>
            <p>Files</p>
            <p>Interest rate : </p>
            {/* Ajoutez d'autres informations spécifiques à l'application ici */}
            <Button text="Accept"/>
            <Button text="Reject"/>
          </div>
        )}
      </Modal>
    </>
  );
}
