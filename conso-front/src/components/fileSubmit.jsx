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
} from "firebase/storage";

import api_link from "../constants";

export default function FileUploader({ item }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentName, setDocumentName] = useState("");

  useEffect(() => {
    if (item === undefined) return;

    // Récupérer le document correspondant au document_type_id
    const getInfo = async () => {
      try {
        const response = await fetch(`${api_link}/document/get`, {
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
        console.log("Erreur lors de la récupération du document", error);
      }
    };

    getInfo();
  }, [item]);

  // return if item is not specified
  if (item == undefined) {
    return null;
  }

  const handleUpload = async () => {
    try {
      // Delete the existing file
      const response = await fetch(`${api_link}/document/get`, {
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

          const storageRef = ref(storage, documentPath);
          await deleteObject(storageRef);
          console.log("Previous file deleted successfully");
        }

        const storageRef = ref(storage, selectedFile.name);
        await handleDelete();
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
      } else {
        throw new Error("Error retrieving document information");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteServer = async () => {
    try {
      setDocumentName("");

      const response = await fetch(`${api_link}/document/get`, {
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

          const storageRef = ref(storage, documentPath);
          await deleteObject(storageRef);
          console.log("File deleted successfully");
        }
      } else {
        throw new Error("Error retrieving document information");
      }
    } catch (error) {
      console.log(error);
    }

    const documentToDeleteData = {
      id: localStorage.getItem("user_id"),
      document_type_id: item.id,
      token: localStorage.getItem("token"),
    };

    try {
      const deleteResponse = await fetch(`${api_link}/document`, {
        method: "DELETE",
        body: JSON.stringify(documentToDeleteData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (deleteResponse.ok) {
        const deleteData = await deleteResponse.json();
        console.log(deleteData);
      } else {
        throw new Error("Error deleting document");
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
      const response = await fetch(`${api_link}/document/get`, {
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
          {selectedFile && <Button onClick={handleUpload} text="Transférer" />}
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
