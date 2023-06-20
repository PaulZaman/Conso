import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/button";
import React, { useState } from "react";
import "../style/AccountCreation.css";
import api_link from "../constants";

export default function SignInForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [birthdateError, setBirthdateError] = useState("");
  const [verification, setVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationCodeError, setVerificationCodeError] = useState("");

  const validateForm = (e) => {
    e.preventDefault();

    const namePattern = /^[A-Za-z]+$/;
    const birthdatePattern =
      /^(0[1-9]|1[0-9]|2[0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/;

    if (!firstName.match(namePattern)) {
      setFirstNameError("Please enter a valid first name (only letters).");
      return;
    } else {
      setFirstNameError("");
    }

    if (!lastName.match(namePattern)) {
      setLastNameError("Please enter a valid last name (only letters).");
      return;
    } else {
      setLastNameError("");
    }

    if (!birthdate.match(birthdatePattern)) {
      setBirthdateError("Please enter a valid birthdate (dd/mm/yyyy).");
      return;
    } else {
      setBirthdateError("");
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email.match(emailPattern)) {
      setEmailError("Please enter a valid email address.");
      return;
    } else {
      setEmailError("");
    }

    if (password.length < 5) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    } else {
      setPasswordError("");
    }

    // convert birthdate to ISO format
    const dateParts = birthdate.split("/");
    const dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    const birthdateISO = dateObject.toISOString();

    // API
    console.log(firstName, lastName, birthdateISO, email, password);
    fetch(`${api_link}/user/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname: firstName,
        lastname: lastName,
        dob: birthdateISO,
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (
          res.message ===
          "User created successfully, you can now verify your account"
        ) {
          setVerification(true);
          localStorage.setItem("user_id", res.user.id);
          return;
        }
        if (res.message === "Email already exists") {
          setEmailError("Email already exists");
        }
        setPasswordError(res.message);
      })
      .catch((err) => console.log(err));
  };

  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
    if (e.target.value.length === 4) {
      fetch(`${api_link}/user/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: localStorage.getItem("user_id"),
          token: e.target.value,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          if (res.message === "User verified successfully") {
            window.location.href = "/login";
            return;
          }
          if (res.status !== 200) {
            setVerificationCodeError(res.message);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div>
      <Header />
      <div className="signInCard">
        <h2>Sign In</h2>
        {!verification && (
          <form className="signInForm" onSubmit={validateForm}>
            <div>
              <label>First Name:</label>
              <div>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  required
                />
              </div>
              <div>
                <span className="error">{firstNameError}</span>
              </div>
            </div>
            <div id="last-name">
              <label>Last Name:</label>
              <div>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                  required
                />
              </div>
              <div>
                <span className="error">{lastNameError}</span>
              </div>
              <br />
            </div>
            <div>
              <label>Birthdate (dd/mm/yyyy):</label>
              <div>
                <input
                  type="text"
                  value={birthdate}
                  onChange={(e) => {
                    setBirthdate(e.target.value);
                  }}
                  required
                />
              </div>
              <div>
                <span className="error">{birthdateError}</span>
              </div>
            </div>
            <div>
              <label>Email:</label>
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  required
                />
              </div>
              <div>
                <span className="error">{emailError}</span>
              </div>
              <label>Password:</label>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  required
                />
              </div>
              <div>
                <span className="error">{passwordError}</span>
              </div>
            </div>
            <p className="textLink">
              Already have an account ?{" "}
              <a className="logInLink" href="/login">
                Log in
              </a>
            </p>
            <Button text="Create an account" onClick={validateForm} />
          </form>
        )}
        {verification && (
          <div className="verificationBox">
            <h4>
              A verification code has been sent to your email address. Please
              enter the code below.
            </h4>
            <div className="verificationCodeInput">
              <input
                type="text"
                value={verificationCode}
                onChange={handleVerificationCodeChange}
                maxLength={4}
              />
            </div>
            <div>
              <span className="error">{verificationCodeError}</span>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
