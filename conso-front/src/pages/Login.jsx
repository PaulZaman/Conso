import React, { useState } from "react";
import "../style/Login.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/button";
import apiLink from "../constants";
import authentificate_user from "../authentification";
import { useEffect } from "react";

function LoginForm() {
  useEffect(() => {
    const authenticateUser = async () => {
      let res = await authentificate_user();
      if (res === true) {
        window.location.href = "/loan_application";
      }
    };
    authenticateUser();
  }, []);

  // State variables
  const [email, setEmail] = useState("example@example.com");
  const [password, setPassword] = useState("password");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Form validation and submission
  const validateForm = (e) => {
    e.preventDefault();

    // Email validation pattern
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Validate email
    if (!email.match(emailPattern)) {
      setEmailError("Please enter a valid email address.");
      return;
    } else {
      setEmailError("");
    }

    // Validate password
    if (password.length < 5) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    } else {
      setPasswordError("");
    }

    // Submit the form
    handleSubmission(email, password);
  };

  // Handle form submission
  const handleSubmission = (email, password) => {
    // Make API request to login
    fetch(`${apiLink}/login`, {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data
        console.log(data);

        // Store the token and user_id in local storage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user_id);

        // Redirect to loan application page if login is successful
        if (data.token) {
          window.location.href = "/loan_application";
        }
        if (data.message === "User not found") {
          setEmailError("User not found");
        }
        if (data.message === "Incorrect password") {
          setPasswordError("Incorrect password");
        }
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        console.error(error);
      });
  };

  return (
    <div>
      <Header />
      <div className="loginCard">
        <h2>Happy to see you again!</h2>
        <form className="connexionForm">
          <div>
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
              id="email"
            />
          </div>
          <div>
            <span className="error">{emailError}</span>
          </div>
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
            <span className="pwd-error">{passwordError}</span>
          </div>

          <p className="textLink">
            Don't have an account?{" "}
            <a className="signInLink" href="/signin">
              Sign in
            </a>
          </p>
          <Button onClick={validateForm} text="Log in" />
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default LoginForm;
