import PropTypes from "prop-types";
import "../style/style-components/visualizationUser.css";
import { useEffect } from "react";
import { useState } from "react";
import apiLink from "../constants";

export default function VisualizationUser({
  status,
  applicationID,
  bank,
  amount,
  tenure,
  datePostedUser,
  onClick,
  onClickText,
}) {
  let color;
  const [bankName, setBankName] = useState("");

  if (status === "pending") {
    color = "orange";
  } else if (status === "approved") {
    color = "green";
  } else {
    color = "red";
  }

  useEffect(() => {
    // Get bank name when component is mounted
    const getBankName = async () => {
      let body = {
        bank_id: bank,
      };
      const response = await fetch(apiLink + "/bank", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if ((data.message == "Bank retrieved successfully")) {
        setBankName(data.bank.name);
      }
    };
    getBankName();
  }, [status]);

  return (
    <>
      {status === "approved" ? (
        <div style={{ borderColor: color }} className="visualizationCard">
          <p>{applicationID}</p>
          <p>{bankName}</p>
          <p>{amount}€</p>
          <p>{tenure} mois</p>
          <p>{datePostedUser}</p>
          <a className="link" onClick={onClick}>
            {onClickText}
          </a>
        </div>
      ) : (
        <div style={{ borderColor: color }} className="visualizationCard">
          <p>{applicationID}</p>
          <p>{bankName}</p>
          <p>{amount}€</p>
          <p>{tenure} mois </p>
          <p>{datePostedUser}</p>
          <a className="link" onClick={onClick}>
            {onClickText}
          </a>
        </div>
      )}
    </>
  );
}



VisualizationUser.propTypes = {
  applicationID: PropTypes.number.isRequired,
  bank: PropTypes.number.isRequired,
  status: PropTypes.oneOf(["pending", "approved", "refused"]).isRequired,
  amount: PropTypes.number.isRequired,
  tenure: PropTypes.number.isRequired,
  datePostedUser: PropTypes.string,
  onClick: PropTypes.func,
  onClickText: PropTypes.string,
};
