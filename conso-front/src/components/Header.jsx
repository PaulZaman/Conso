import React, { useEffect, useState } from "react";
import "../style/Header.css";
import Logo from "../asset/logo.png";
import authentificate_user from "../authentification";
import Button from "./button";
import profileLogo from '../asset/profile.png'

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    const authenticateUser = async () => {
      let res = await authentificate_user();
      setLoggedIn(res);
    };
    authenticateUser();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/home";
  };

  return (
    <header>
      <a href="/home">
        <img
          className="logo"
          src={Logo}
          alt="Logo"
          style={{ height: "50px", width: "auto" }}
        />
      </a>
      <a href="/loan_simulator">Estimer ma capacité d'emprunt</a>
      <a href="/about">Qui sommes nous ?</a>
      {loggedIn ? (
        <a className="link_app" onClick={() => (window.location.href = '/loan_visualization')}>
          Visualiser mes demandes  
        </a>
      ) : (<a className="link_app" href="/banksAvailable">
      See banks
    </a>)}
      {loggedIn ? (
      <img className="profileLogo" src={profileLogo} onClick={() => (window.location.href = '/profile')}></img>
      ) : (
        <Button onClick={() => (window.location.href = '/login')} text="Se connecter" />
      )}
    </header>
  );
}
