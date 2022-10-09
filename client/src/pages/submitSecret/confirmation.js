import React from 'react';
import {
  Link
} from 'react-router-dom'


const Confirmation = ({secretData}) => {
  return (
    <>
      <h1>Your secret has been submitted</h1>
      <p>URL: <Link to={'/secret/' + secretData.id}>{secretData.id}</Link></p>
      <p>Expires At: {new Date(secretData.expires_at).toString()}</p>
    </>
  );
}

export default Confirmation;
