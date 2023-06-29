import React from "react";
import '../style/ApplicationBanker.css';

export default function ApplicationBanker(props) {
  return (
    <div className='applicationBanker'>
      <p>{props.id}</p>
      <p>{props.tenure} years</p>
      <p>
        <b>{props.loanAmount}</b>€
      </p>
    </div>
  );
}
