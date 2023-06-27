/* eslint-disable react/prop-types */
import "../style/fileSubmit.css";
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
      fetch(`${api_link}/document/get`, {
        method: "POST",
        body: JSON.stringify({
          id: localStorage.getItem("user_id"),
          token: localStorage.getItem("token"),
          document_type_id: item.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message !== "Document not found") {
            const documentPath = data.document_path;
            const segments = documentPath.split("/");
            const filenameWithParams = segments[segments.length - 1];
            const filename = filenameWithParams.split("?")[0];
            setDocumentName(filename);
          }
        })
        .catch(() => {
          console.log("Erreur lors de la récupération du document");
        });
    };

    getInfo();
  }, [item]);

  // return if item is not specified
  if (item == undefined) {
    return;
  }

  const handleUpload = async () => {
    // Delete the existing file
    try {
      fetch(`${api_link}/document/get`, {
        method: "POST",
        body: JSON.stringify({
          id: localStorage.getItem("user_id"),
          token: localStorage.getItem("token"),
          document_type_id: item.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message !== "Document not found") {
            const documentPath = data.document_path;

            const storageRef = ref(storage, documentPath);
            deleteObject(storageRef)
              .then(() => {
                console.log("Previous file deleted successfully");
                uploadNewFile();
              })
              .catch((error) => {
                console.log("Error deleting previous file:", error);
              });
          } else {
            uploadNewFile();
          }
        })
        .catch(() => {
          console.log("Error retrieving document information");
        });
    } catch (e) {
      console.log(e);
    }
  };

  const uploadNewFile = () => {
    const storageRef = ref(storage, selectedFile.name);

    uploadBytes(storageRef, selectedFile)
      .then(() => {
        getDownloadURL(storageRef)
          .then((url) => {
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
                setDocumentName(selectedFile.name);
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log("Error retrieving download URL:", error);
          });
      })
      .catch((error) => {
        console.log("Error uploading file:", error);
      });
  };
  const handleDeleteServer = () => {
    // delete from firebase
    try {
      setDocumentName("");
      fetch(`${api_link}/document/get`, {
        method: "POST",
        body: JSON.stringify({
          id: localStorage.getItem("user_id"),
          token: localStorage.getItem("token"),
          document_type_id: item.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message !== "Document not found") {
            const documentPath = data.document_path;

            const storageRef = ref(storage, documentPath);
            deleteObject(storageRef)
              .then(() => {
                console.log("File deleted successfully");
              })
              .catch((error) => {
                console.log("Error deleting file:", error);
              });
          }
        })
        .catch(() => {
          console.log("error");
        });
    } catch (e) {
      console.log(e);
    }

    let documentToDeleteData = {
      id: localStorage.getItem("user_id"),
      document_type_id: item.id,
      token: localStorage.getItem("token"),
    };

    fetch(`${api_link}/document`, {
      method: "DELETE",
      body: JSON.stringify(documentToDeleteData),
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
        <input
          id="file-input"
          type="file"
          onChange={(e) => {
            setSelectedFile(e.target.files[0]);
          }}
        />
        {documentName && <p>Votre fichier : {documentName}</p>}
        <div className="buttonGroup">
          <Button onClick={handleUpload} text="Upload" />
          <Button onClick={handleDelete} text="Remove" />
          <Button onClick={handleDeleteServer} text="Delete" />
        </div>
      </div>
    </div>
  );
}