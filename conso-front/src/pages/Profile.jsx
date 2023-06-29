import Header from "../components/Header";
import Footer from "../components/Footer";
import FileUploader from "../components/fileSubmit";
import { useState, useEffect } from "react";
import "../style/Profile.css";
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


  useEffect(() => {
    // athentificate user
    const authenticateUser = async () => {
      let res = await authentificate_user();
      if (res === false) {
        window.location.href = "/login";
      }
    };
    authenticateUser();
    // get user + information about docs types
    const getInfo = async () => {
      fetch(`${apiLink}/document/types`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response data
          setDocumentTypes(data);
        })
        .catch((error) => {
          // Handle any errors that occur during the request
          console.log(error);
        });
      
      fetch(`${apiLink}/user`, {
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
          console.log("hhhh")
          setFirstName(data.user.firstname);
          setLastName(data.user.lastname);
          setDob(new Date(data.user.dob).toLocaleDateString("en-GB"));
          setEmail(data.user.email);
          setPassword(data.user.password);
        })
        .catch((error) => {
          // Handle any errors that occur during the request
          console.log(error);
        });
        
    };
    getInfo();

    
  const isUserBanker = () => {
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
      })
      .catch((error) => {
        console.log(error);
      });
  };
  isUserBanker();


  const bankInfo = () => {
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
        setBankID(data.bank.id);
        setBankName(data.bank.name);
        setBankLogoPath(data.bank.logo_path)
        setRequiredDocuments(data.bank.documents_required)
      })
      .catch((error) => {
        console.log(error);
      });
  };
  bankInfo();
    
  }, []);


  





  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/home";
  };
  const handleUpdate = async () => {
    fetch(`${apiLink}/user/update`, {
      method: "POST",
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
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        console.error(error);
      });
  };



  return (
    <>
      <Header />
      {isBanker? (
        <div className="bankerProfile">

          <h1>BANK INFO</h1>
          <img src={bankLogoPath} alt={bankID}></img>
          <h3>{bankName}</h3>
          <ul className="requiredDocumentBank">
            {requiredDocuments.map((document) => (
            <li  key={document.id}>{document.nametype}</li>
            ))}
          </ul>

          <h1>BANKER INFO</h1>
          <div>
            <h3>{firstName}</h3>
            <h3>{lastName}</h3>
          </div>
          <h3>{email}</h3>
          <Button onClick={handleLogout} text="Log Out" />

        </div>
      
      ) : (

        <div className="userProfile">

          <div className="uploadSection">
            <h1 className="profileTitle">My Profile</h1>
            <div className="profileInformation">
              <div className="profileLabels">
                <h3>FirstName</h3>
                <h3>LastName</h3>
                <h3>Birthdate</h3>
                <h3>Email</h3>
                <h3>Password</h3>
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

            <Button onClick={handleUpdate} text="Update" />

            <div className="uploadSection">
              <div className="fileSection">
                <h1>Mes documents</h1>
                <div>
                  {Object.keys(documentTypes).map((key) => (
                    <div className="sectionPair" key={key}>
                      <FileUploader item={documentTypes[key]} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Button onClick={handleLogout} text="Log Out" />

          </div>

        </div>
      )}
      <Footer />
    </>
  );
}