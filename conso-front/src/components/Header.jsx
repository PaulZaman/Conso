import { useEffect, useState } from "react";
import "../style/style-components/Header.css";
import Logo from "../asset/logo.png";
import authentificate_user from "../authentification";
import Button from "./button";
import profileLogo from "../asset/profile.png";
import apiLink from "../constants";

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isBanker, setIsBanker] = useState("");

  useEffect(() => {
    const authenticateUser = async () => {
      let res = await authentificate_user();
      setLoggedIn(res);
    };
    authenticateUser();

    const isUserBanker = async () => {
      try {
        const response = await fetch(`${apiLink}/user/isBanker`, {
          method: "POST",
          body: JSON.stringify({
            id: localStorage.getItem("user_id"),
            token: localStorage.getItem("token"),
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsBanker(data.result);
        } else {
          setIsBanker(false); // Set isBanker state to false if an error occurred
        }
      } catch {
        setIsBanker(false); // Set isBanker state to false if an error occurred
      }
    };

    isUserBanker();
  }, []);

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
      <a href="/loan_simulator">Estimer ma capacité d&apos;emprunt</a>
      <a href="/about">Qui sommes nous ?</a>
      {loggedIn && !isBanker ? (
        <a
          className="link_app"
          onClick={() => (window.location.href = "/loan_visualization")}
        >
          Visualiser mes demandes
        </a>
      ) : loggedIn & isBanker ? (
        <a className="link_app" href="/loanBanker">
          Requêtes
        </a>
      ) : (
        <a
          className="link_app"
          onClick={() => (window.location.href = "/login")}
        >
          Visualiser mes demandes
        </a>
      )}
      {loggedIn ? (
        <img
          className="profileLogo"
          src={profileLogo}
          onClick={() => (window.location.href = "/profile")}
        ></img>
      ) : (
        <Button
          onClick={() => (window.location.href = "/login")}
          text="Se connecter"
        />
      )}
    </header>
  );
}
