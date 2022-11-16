import React from 'react';
import { useTitle } from '../../components/title';

const NotFound = () => {
  const setTitle = useTitle("Not Found - ESSW Demo");

  return (
    <div className="d-flex align-items-center flex-column">
      <i className="bi bi-emoji-dizzy" style={{
        fontSize: '5rem'
      }}></i>
      <h1>404 Not Found</h1>
    </div>
  );
}

export default NotFound;
