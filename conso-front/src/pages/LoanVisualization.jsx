import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/LoanVisualization.css";
import SimulationButton from "../components/simulationButton";
import authentificate_user from "../authentification";
import { useState, useEffect } from "react";
import apiLink from "../constants";
import VisualizationUser from "../components/visualizationUser";
import Button from "../components/button";


export default function LoanVisualization() {

    /*
  const [applicationID, setApplicationID] = useState('');
  const [bank, setBank] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [tenure, setTenure] = useState('');*/
  useEffect(() => {
    const authenticateUser = async () => {
      let res = await authentificate_user();
      if (res === false) {
        window.location.href = "/login";
      }
    };
    authenticateUser();

    
  }, []);

  const getInfo = async () => {
    fetch(`${apiLink}/document` , {
      method: "POST",
      body: JSON.stringify({
        id: localStorage.getItem("user_id"),
        token : localStorage.getItem("token")
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data
        console.log(data.document)
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        console.error(error);
      });    };
  getInfo();

  return (
    <>
      <Header />
      <h1>My applications</h1>
      
      <div className='labels'>
                <p>ID</p>
                <p>Banque</p>
                <p>Date</p>
                <p>Amount</p>
                <p>Tenure</p>
                <Button text="Nouvelle Demande" />
            </div>
      <ul>
        <li>
        <VisualizationUser status="pending" applicationID='hhh' bank="hhh" date="hhh" amount="ghjk" tenure="ghjk" />

        </li>
      </ul>

      <Button onClick={getInfo} text="cfghjkl"/>
      <Footer />
    </>
  );
}
