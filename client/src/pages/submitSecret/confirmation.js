import React from 'react';
import { Link } from 'react-router-dom';
import * as Constants from '../../helpers/constants.js';

function navigationShare(e) {
  if (navigator.share) {
    navigator.share({
      title: 'ESSW',
      text: 'A secret is being shared with you.',
      url: e.target.getAttribute('data-url')
    })
  }
}

const Confirmation = ({secretData}) => {
  const shareUrl = Constants.HOST_NAME + '/secret/' + secretData.id;

  const shareUrlInput = document.getElementById('share-url-input');

  return (
    <>
      <h1>Your secret has been encrypted</h1>
      <p>Your secret has been encrypted and saved securely.</p>
      <p>Copy the URL or use the Share button to share your unique secret with someone else.</p>
      <div className='row g-3 mb-2'>
        <div className='col-10'>
          <input id='share-url-input' type='text' className='form-control' value={shareUrl} readOnly={true}/>
        </div>
        <button className='btn btn-primary col-2' onClick={navigationShare} data-url={shareUrl}>
          <i className='bi bi-share me-2'></i>
          Share
        </button>
      </div>
      <p>Your secret will automatically expire at {new Date(secretData.expires_at).toString()}</p>
      <a href='/' className='btn btn-light d-block w-100'>Share another secret</a>
    </>
  );
}

export default Confirmation;
