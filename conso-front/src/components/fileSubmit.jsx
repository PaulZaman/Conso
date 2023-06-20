import '../style/fileSubmit.css'
import Button from "../components/button";
import React, { useState } from 'react';

export default function FileUploader(props) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    // Perform the upload logic here
    // ...
  };

  const handleDelete = () => {
    setSelectedFile(null);
  };

  return (
    <div>
      <div className='submitSection'>

        <h2>{props.title}</h2>
          <input type="file" onChange={handleFileChange} />
          <div className='buttonGroup'>
              <Button onClick={handleDelete} text="Delete" />
              <Button onClick={handleUpload} text="Submit" />
          </div>
      </div>
    </div>
  );
}

