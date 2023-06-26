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

  useEffect(() => {
    const authenticateUser = async () => {
      let res = await authentificate_user();
      if (res === false) {
        window.location.href = "/login";
      }
    };
    authenticateUser();
    const getInfo = async () => {
      fetch(`${apiLink}/user/get`, {
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
          console.log(data.user);
          setFirstName(data.user.firstname);
          setLastName(data.user.lastname);
          setDob(new Date(data.user.dob).toLocaleDateString("en-GB"));
          setEmail(data.user.email);
          setPassword(data.user.password);
        })
        .catch((error) => {
          // Handle any errors that occur during the request
          console.error(error);
        });
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
          console.error(error);
        });
    };
    getInfo();
  }, []);

  const handleUpdate = async () => {
    try {
      // Make an API request to update user information

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

      // Handle the response and update the user information in the component state or show a success message
      // ...
    } catch (error) {
      // Handle any errors that occurred during the API request
      console.log(error);
      // ...
    }
  };

  return (
    <>
      <Header />
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
      </div>
      <Footer />
    </>
  );
}
