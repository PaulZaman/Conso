/* eslint-disable react/prop-types */
import "../style/style-components/fileSubmit.css";
import Button from "../components/button";
import { useState, useEffect } from "react";
import { storage } from "../config/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  getStorage,
} from "firebase/storage";

import api_link from "../constants";

export default function FileUploader({ item }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentName, setDocumentName] = useState("");

  useEffect(() => {
    // Récupérer le document correspondant au document_type_id
    const getInfo = async () => {
      try {
        const response = await fetch(`${api_link}/document`, {
          method: "POST",
          body: JSON.stringify({
            id: localStorage.getItem("user_id"),
            token: localStorage.getItem("token"),
            document_type_id: item.id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.message !== "Document not found") {
            const documentPath = data.document_path;
            const segments = documentPath.split("/");
            const filenameWithParams = segments[segments.length - 1];
            const filename = filenameWithParams.split("?")[0];
            setDocumentName(filename);
          }
        } else {
          throw new Error("Error retrieving document information");
        }
      } catch (error) {
        //console.log("Erreur lors de la récupération du document", error);
      }
    };

    getInfo();
  }, [item]);

  const handleUpload = async () => {
    try {
      const storageRef = ref(storage, selectedFile.name);
      handleDelete();
      await uploadBytes(storageRef, selectedFile);

      const url = await getDownloadURL(storageRef);
      console.log(url);

      const documentData = {
        id: localStorage.getItem("user_id"),
        document_type_id: item.id,
        document_path: url,
        token: localStorage.getItem("token"),
      };

      const uploadResponse = await fetch(`${api_link}/document`, {
        method: "POST",
        body: JSON.stringify(documentData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        console.log(uploadData);
        setDocumentName(selectedFile.name);
      } else {
        throw new Error("Error uploading file");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteServer = async () => {
    try {
      setDocumentName("");
      // delete from the MySQL database
      const response = await fetch(`${api_link}/document/del`, {
        method: "POST",
        body: JSON.stringify({
          id: localStorage.getItem("user_id"),
          token: localStorage.getItem("token"),
          document_type_id: item.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === "Document deleted successfully") {
          // delete from the Firebase storage
          const storageRef = ref(getStorage(), data.document_path);
          await deleteObject(storageRef);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById("file-input");
    if (fileInput) {
      fileInput.value = ""; // Réinitialise la valeur du champ de sélection de fichier
    }
  };

  const handleOpenLink = async () => {
    try {
      const response = await fetch(`${api_link}/document`, {
        method: "POST",
        body: JSON.stringify({
          id: localStorage.getItem("user_id"),
          token: localStorage.getItem("token"),
          document_type_id: item.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.document_path);
        window.open(data.document_path, "_blank");
      } else {
        throw new Error("Error retrieving document information");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownload = () => {
    if (documentName) {
      const link = document.createElement("a");
      link.href = documentName;
      link.setAttribute("download", "");
      link.click();
    }
  };

  // Fonction pour décoder l'URL et remplacer les %20 par des espaces
  const decodeURL = (url) => {
    return decodeURIComponent(url.replace(/\+/g, " "));
  };

  return (
    <div>
      <div className="submitSection">
        <h2>{item.nametype}</h2>
        <input
          id="file-input"
          type="file"
          onChange={(e) => {
            setSelectedFile(e.target.files[0]);
          }}
        />
        <div className="buttonGroup">
          {selectedFile && <Button onClick={handleUpload} text="Sauvegarder" />}
          {selectedFile && <Button onClick={handleDelete} text="Supprimer" />}
        </div>
        {documentName && (
          <div>
            Votre fichier :
            <div className="buttonGroup">
              <button onClick={handleOpenLink}>
                {decodeURL(documentName)}
              </button>
            </div>
          </div>
        )}
        <div className="buttonGroup">
          {documentName && (
            <Button onClick={handleDownload} text="Télécharger" />
          )}
          {documentName && (
            <Button
              onClick={handleDeleteServer}
              text="Supprimer de mon dossier"
            />
          )}
        </div>
      </div>
    </div>
  );
}
