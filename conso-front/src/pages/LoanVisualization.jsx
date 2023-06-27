import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/LoanVisualization.css";
import authentificate_user from "../authentification";
import { useState, useEffect } from "react";
import apiLink from "../constants";
import VisualizationUser from "../components/visualizationUser";
import Button from "../components/button";

export default function LoanVisualization() {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);

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
    setSelectedApplication(application);
  };

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

  return (
    <>
      <Header />
      <div>
        <h1>Vos demandes de prêts</h1>
        <div className="yeu">
        <Button className="test_____" text="Nouvelle Demande" />

        </div>

        <h1>Approved Applications</h1>
        <div className="labels">
          <p>ID</p>
          <p>Banque</p>
          <p>Amount</p>
          <p>Tenure</p>
          <p>Date</p>
        </div>
        <ul>
          {approvedApplications.map((application, index) => (
            <li key={index} onClick={() => handleApplicationClick(application)}>
              <VisualizationUser
                applicationID={application.id}
                bank={application.bank_id}
                status={application.status}
                amount={application.amount}
                tenure={application.tenure}
                date={new Date(application.date_posted).toLocaleDateString("en-GB")}
              />
             
            </li>
          ))}
        </ul>

        <h1>Pending Applications</h1>
        <div className="labels">
          <p>ID</p>
          <p>Banque</p>
          <p>Amount</p>
          <p>Tenure</p>
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
                date={new Date(application.date_posted).toLocaleDateString("en-GB")}
              />
            </li>
          ))}
        </ul>

        <h1>Rejected applications</h1>
        <div className="labels">
          <p>ID</p>
          <p>Banque</p>
          <p>Amount</p>
          <p>Tenure</p>
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
                date={new Date(application.date_posted).toLocaleDateString("en-GB")}
              />
            </li>
          ))}
        </ul>

      </div>

      <Footer />
    </>
  );
}
