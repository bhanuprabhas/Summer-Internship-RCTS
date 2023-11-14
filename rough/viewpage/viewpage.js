import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./viewpage.css"

const Viewpage = () => {
  const navigate = useNavigate();
  const [collectionNames, setCollectionNames] = useState([]);

  useEffect(() => {
    // Fetch the collection names from the API
    fetch('http://127.0.0.1:5000/excels')
      .then(response => response.json())
      .then(result => {
        setCollectionNames(result.excels);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);


  // const handleCollectionClick = (collectionName) => {
  //   // Navigate to the next page of the clicked collection
  //   history.push(`/collection/${collectionName}`);
  // };

  return (
    <div>
      <h2>Excel Collections</h2>
      {collectionNames.length > 0 ? (
        <div className="collection-cards">
          {collectionNames.map(name => (
            <div key={name} className="collection-card" onClick={() => navigate(`/excel/${name}`)}>
              <h3>{name}</h3>
            </div>
          ))}
        </div>
      ) : (
        <p>No Excel collections found.</p>
      )}
    </div>
  );
};

export default Viewpage;
