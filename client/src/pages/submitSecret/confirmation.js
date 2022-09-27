import React from 'react';

const Confirmation = ({secretData}) => {
  return (
    <>
      <h1>Your secret has been submitted</h1>
      <p>ID: {secretData.id}</p>
      <p>Expires At: {new Date(secretData.expires_at).toString()}</p>
    </>
  );
}

export default Confirmation;
