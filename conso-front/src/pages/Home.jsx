import Header from "../components/Header";
import React from "react";
import Footer from "../components/Footer";
import "../style/Home.css";
import ContentCard1 from "../components/Content_cards_1";
import BanksCard from "../components/Banks_card";
import SimulationButton from "../components/simulationButton";

export default function Home() {
  return (
    <div className="home_page">
      <Header />
      <h1 className="headSlogan">
        Terminés les rendez-vous interminables avec le banquier.{" "}
        <b className="test">Conso.</b> fait tout pour vous
      </h1>
      <SimulationButton text="Effectuer ma simulation" to="/loan_simulator" />

      <div className="content_group">
        <ContentCard1 text="Des courties à l'écoute et disponibles pour répondre à vos besoins" />
        <ContentCard1 text="Aucun frais cachés : Conso. met la transparence au centre de ses relations clients" />
        <ContentCard1 text="Aucun frais cachés : Conso. met la transparence au centre de ses relations clients" />
      </div>
      <h2 style={{ color: "white" }}>Parmi nos plus de 80 partenaires :</h2>

      <BanksCard />
      <Footer />
    </div>
  );
}
