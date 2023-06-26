/* eslint-disable react/prop-types */
import "../style/fileSubmit.css";
import Button from "../components/button";
import { useState } from "react";
import { storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import api_link from "../constants";

export default function FileUploader({ item }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const storageRef = ref(storage, selectedFile.name);

      uploadBytes(storageRef, selectedFile).then(() => {
        getDownloadURL(storageRef).then((url) => {
          console.log(url);
          const documentData = {
            id: localStorage.getItem("user_id"),
            document_type_id: item.id,
            document_path: url,
            token: localStorage.getItem("token"),
          };

          fetch(`${api_link}/document`, {
            method: "POST",
            body: JSON.stringify(documentData),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
            })
            .catch((error) => {
              console.log(error);
            });
        });
      });
    }
  };

  const handleDelete = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById("file-input");
    if (fileInput) {
      fileInput.value = ""; // Réinitialise la valeur du champ de sélection de fichier
    }
  };

  return (
    <div>
      <div className="submitSection">
        <h2>{item.nametype}</h2>
        <input id="file-input" type="file" onChange={handleFileChange} />

        <div className="buttonGroup">
          <Button onClick={handleUpload} text="Upload" />
          <Button onClick={handleDelete} text="Delete" />
        </div>
      </div>
    </div>
  );
}
