import Header from "../components/Header";
import Footer from "../components/Footer";
import FileUploader from "../components/fileSubmit";
import "../style/LoanApplication.css";
import SimulationButton from "../components/simulationButton";
import authentificate_user from "../authentification";
import { useEffect } from "react";

export default function LoanApplication() {
  useEffect(() => {
    const authenticateUser = async () => {
      let res = await authentificate_user();
      if (res === false) {
        window.location.href = "/login";
      }
    };
    authenticateUser();
  }, []);

  const handleUpload = () => {
    // Perform the upload logic here
    // ...
  };
  return (
    <>
      <Header />
      <div className="uploadSection">
        <div className="fileSection">
          <h1>My application</h1>

          <div className="sectionPair">
            <FileUploader title="Carte d'identité" />
            <FileUploader title="Fiche de paie" />
          </div>
          <div className="sectionPair">
            <FileUploader title="TEST" />
            <FileUploader title="YOOOO" />
          </div>
          <div className="sectionPair">
            <FileUploader title="WEWEEE" />
            <FileUploader title="ijhgvghji" />
          </div>
        </div>
        <SimulationButton
          onclick={handleUpload}
          text="Continue my application"
        />
      </div>
      <Footer />
    </>
  );
}
