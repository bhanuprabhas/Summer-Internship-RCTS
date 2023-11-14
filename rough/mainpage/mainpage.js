import React, { useState, useRef } from 'react';
import './mainpage.css';
import { Link } from 'react-router-dom';

const Mainpage = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState(null);
  const formRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formRef.current.reset();

    // Create a FormData object
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);

    // Make an API call to upload the file
    fetch('http://127.0.0.1:5000/upload', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message); // Display success message or handle response
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
    <div className="upload-page">
      <h1>Upload Excel Sheet</h1>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="form-group">
        <label htmlFor="user-name">Name:</label>
          <input
            type="str"
            id="user-name"
            onChange={handleNameChange}
          />
          <br />
          <label htmlFor="excel-file">Select Excel File:</label>
          <input
            type="file"
            id="excel-file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit">Upload</button>
      </form>  
      <div className='all-button'><Link to="/all"><button type="view">Go to All</button></Link></div>
    </div>
    
    </div>
  );
};

export default Mainpage;
