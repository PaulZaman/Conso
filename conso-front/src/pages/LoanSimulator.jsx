import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/LoanSimulator.css"; // Ajout de la feuille de style

export default function LoanSimulator() {
  const [revenuMensuel, setRevenuMensuel] = useState(0);
  const [dureeEndettement, setDureeEndettement] = useState(0);
  const [personnes, setPersonnes] = useState(1);

  const tauxEndettement = personnes === 1 ? 0.35 : 0.4;
  const tauxEmprunt = 3.36;

  const mensualite = (revenuMensuel * tauxEndettement).toFixed(2);
  const capaciteEmprunt = (mensualite * 12 * dureeEndettement).toFixed(2);
  const coutCredit = (
    (capaciteEmprunt * tauxEmprunt * dureeEndettement) /
    100
  ).toFixed(2);
  const coutDuCredit = (capaciteEmprunt - coutCredit).toFixed(2);

  return (
    <>
      <Header />
      <h1>Simuler ma capacité d&eapos;emprunt</h1>
      <div className="loan-simulator-container">
        <div className="form-box">
          <h2>Ma situation</h2>
          <div>
            <label>
              Demandeur(s)
              <div>
                <label>
                  <input
                    type="radio"
                    name="personnes"
                    value={1}
                    checked={personnes === 1}
                    onChange={() => setPersonnes(1)}
                  />
                  Seul
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    name="personnes"
                    value={2}
                    checked={personnes === 2}
                    onChange={() => setPersonnes(2)}
                  />
                  À deux
                </label>
              </div>
            </label>
          </div>
          <div>
            <label>
              Revenu mensuel
              <input
                type="range"
                min="0"
                max="10000"
                value={revenuMensuel}
                onChange={(e) => setRevenuMensuel(parseFloat(e.target.value))}
              />
              {revenuMensuel} €
            </label>
          </div>
          <div>
            <label>
              Durée d&eapos;endettement (en années)
              <input
                type="range"
                min="0"
                max="30"
                value={dureeEndettement}
                onChange={(e) => setDureeEndettement(parseInt(e.target.value))}
              />
              {dureeEndettement} ans
            </label>
          </div>
        </div>
        <div className="results-box">
          <h2>Ma simulation</h2>
          <p>
            <span>Mensualité</span>
            <span>{mensualite} €</span>
          </p>
          <p>
            <span>Capacité d&eapos;emprunt</span>
            <span>{capaciteEmprunt} €</span>
          </p>
          <p>
            <span>Coût total du crédit</span>
            <span>{coutCredit} €</span>
          </p>
          <p>
            <span>Coût du crédit</span>
            <span>{coutDuCredit} €</span>
          </p>
          <p>
            <span>Taux moyen</span>
            <span>{tauxEmprunt}%</span>
          </p>
          <p>
            <span>Durée d&eapos;endettement</span>
            <span>{dureeEndettement} ans</span>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
