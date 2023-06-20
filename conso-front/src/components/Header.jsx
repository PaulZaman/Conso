import React, { useEffect, useState } from "react";
import "../style/Header.css";
import Logo from "../asset/logo.png";
import authentificate_user from "../authentification";

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
      <a className="link_app" href="/loan_application">
        Déposer ma demande de prêt
      </a>
      {loggedIn ? (
        <button className="buttonHeader" type="button" onClick={handleLogout}>
          Se déconnecter
        </button>
      ) : (
        <button
          className="buttonHeader"
          type="button"
          onClick={() => (window.location.href = "/login")}
        >
          Se connecter
        </button>
      )}
    </header>
  );
}
