import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState(null);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMetadata(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="App">
      <h2>File Metadata Microservice</h2>
      <input type="file" onChange={onFileChange} />
      <button onClick={onFileUpload}>Upload</button>

      {metadata && (
        <div>
          <h3>File Metadata:</h3>
          <p>Filename: {metadata.filename}</p>
          <p>Size: {metadata.size} bytes</p>
          <p>MIME Type: {metadata.mimetype}</p>
        </div>
      )}
    </div>
  );
}

export default App;
