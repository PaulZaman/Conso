import Header from "../components/Header";
import Footer from "../components/Footer";
import FileUploader from "../components/fileSubmit";
import { useState, useEffect } from "react";
import "../style/style-pages/Profile.css";
import Button from "../components/button";
import apiLink from "../constants";
import authentificate_user from "../authentification";

export default function Profile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [documentTypes, setDocumentTypes] = useState({});
  const [isBanker, setIsBanker] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankID, setBankID] = useState("");
  const [bankLogoPath, setBankLogoPath] = useState("");
  const [requiredDocuments, setRequiredDocuments] = useState([]);
  const [fileUploaderVisible, setFileUploaderVisible] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [initialUserInfo, setInitialUserInfo] = useState({});

  useEffect(() => {
    // authentify user
    const authenticateUser = async () => {
      let res = await authentificate_user();
      if (res === false) {
        window.location.href = "/login";
      }
    };
    authenticateUser();
    // get user + information about docs types

    const getInfo = async () => {
      try {
        const response = await fetch(`${apiLink}/document/types`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setDocumentTypes(data);
        } else {
          throw new Error("Failed to fetch document types");
        }

        const userResponse = await fetch(`${apiLink}/user`, {
          method: "POST",
          body: JSON.stringify({
            id: localStorage.getItem("user_id"),
            token: localStorage.getItem("token"),
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setFirstName(userData.user.firstname);
          setLastName(userData.user.lastname);
          setDob(new Date(userData.user.dob).toLocaleDateString("en-GB"));
          setEmail(userData.user.email);
          setPassword(userData.user.password);
        } else {
          throw new Error("Failed to fetch user information");
        }
      } catch (error) {
        console.log(error);
      }
    };
    getInfo();

    const isUserBanker = async () => {
      fetch(`${apiLink}/user/isBanker`, {
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
          setIsBanker(data.result);
          if (data.result === true) {
            bankInfo();
          }
        })
        .catch((error) => {
          console.log(error);
          return false;
        });
    };
    isUserBanker();

    const bankInfo = async () => {
      fetch(`${apiLink}/banker/bank`, {
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
          console.log(data);
          setBankID(data.bank.id);
          setBankName(data.bank.name);
          setBankLogoPath(data.bank.logo_path);
          setRequiredDocuments(data.bank.documents_required);
        })
        .catch((error) => {
          console.log(error);
        });
    };
  }, []);
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/home";
  };

  const handleUpdate = async () => {
    try {
      if (
        firstName.trim() === "" ||
        lastName.trim() === "" ||
        email.trim() === "" ||
        password.trim() === ""
      ) {
        setUpdateError("Veuillez remplir tous les champs.");
        return;
      }
      if (
        firstName === initialUserInfo.firstname &&
        lastName === initialUserInfo.lastname &&
        dob === new Date(initialUserInfo.dob).toLocaleDateString("fr-FR") &&
        email === initialUserInfo.email &&
        password === initialUserInfo.password
      ) {
        setUpdateError("Aucune modification détectée.");
        return;
      }
      const currentDate = new Date();
      const userBirthdate = new Date(dob);
      const ageDiff = currentDate.getTime() - userBirthdate.getTime();
      const ageInYears = Math.floor(ageDiff / (1000 * 3600 * 24 * 365.25));

      if (ageInYears < 18) {
        setUpdateError("Vous devez avoir au moins 18 ans.");
        return;
      }
      const response = await fetch(`${apiLink}/user/update`, {
        method: "PUT",
        body: JSON.stringify({
          firstname: firstName,
          lastname: lastName,
          dob: dob,
          email: email,
          password: password,
          id: localStorage.getItem("user_id"),
          token: localStorage.getItem("token"),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setUpdateSuccess(true);
        setUpdateError(""); // Réinitialiser l'erreur s'il y en avait une précédemment
        location.reload();
      } else {
        throw new Error(
          "Impossible de mettre à jour les informations de l'utilisateur"
        );
      }
    } catch (error) {
      console.error(error);
      setUpdateError(
        "Une erreur s'est produite lors de la mise à jour des informations de l'utilisateur."
      );
      setUpdateSuccess(false); // Réinitialiser la valeur de mise à jour réussie en cas d'erreur
    }
  };

  const toggleFileUploader = () => {
    setFileUploaderVisible(!fileUploaderVisible);
  };

  return (
    <>
      <Header />
      {isBanker ? (
        <div className="bankerProfile">
          <div className="bankerInfo">
            <h1>BANKER INFO</h1>
            <div className="bankerName">
              <h3>{firstName}</h3>
              <h3>{lastName}</h3>
            </div>
            <h3>{email}</h3>
          </div>
          <div className="bankInfo">
            <h1>BANK INFO</h1>
            <h3>Bank Name : {bankName}</h3>
            <p>
              <b>Required documents :</b>
            </p>
            <ul className="requiredDocumentBank">
              {requiredDocuments.map((document) => (
                <li key={document.id}>{document.nametype}</li>
              ))}
            </ul>
          </div>
          <Button onClick={handleLogout} text="Déconnexion" />
        </div>
      ) : (
        <div className="userProfile">
          <div className="uploadSection">
            <h1 className="profileTitle">Mon Profil</h1>
            <div className="profileInformation">
              <div className="profileLabels">
                <h3>Prénom</h3>
                <h3>Nom</h3>
                <h3>Date de naissance</h3>
                <h3>Email</h3>
                <h3>Mot de passe</h3>
              </div>
              <div className="inputs">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <input
                  type="text"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            {updateError && <p className="error-message">{updateError}</p>}
            {updateSuccess && !updateError && (
              <p className="successMessage">Profil mis à jour avec succès !</p>
            )}
            <Button onClick={handleUpdate} text="Mettre à jour" />

            <div className="uploadSection">
              <div className="fileSection">
                <Button
                  className="documentsButton"
                  onClick={toggleFileUploader}
                  text="Mes documents"
                />
                {fileUploaderVisible && (
                  <div>
                    {Object.keys(documentTypes).map((key) => (
                      <div className="sectionPair" key={key}>
                        <FileUploader item={documentTypes[key]} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <Button onClick={handleLogout} text="Déconnexion" />
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
