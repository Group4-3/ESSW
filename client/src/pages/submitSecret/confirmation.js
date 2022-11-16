import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Constants from '../../helpers/constants.js';


const Confirmation = ({secretData}) => {
  const shareUrl = Constants.HOST_NAME + '/secret/' + secretData.id;
  const shareUrlInput = document.getElementById('share-url-input');

  const navigationShare = (e) => {
    if (navigator.share) {
      navigator.share({
        title: 'ESSW',
        text: 'A secret is being shared with you.',
        url: e.target.getAttribute('data-url')
      })
    }
  }

  useEffect(() => {
    if (!navigator.share) {
      document.getElementById('share-btn').classList.add('disabled');
      document.getElementById('share-btn').parentElement.title = 'Sharing has been disabled by your browser';
    };
  });

  const copyUrl = async (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(shareUrl);
    e.target.querySelector('.textCue').innerText = 'Copied!';

    setTimeout(() => {
      e.target.querySelector('.textCue').innerText = 'Copy';
    }, 2000);
  }

  return (
    <>
      <h1>Your secret has been encrypted</h1>
      <p>Your secret has been encrypted and saved securely.</p>
      <p>Copy the URL or use the Share button to share your unique secret with someone else.</p>
      <div className='row g-2 mb-2'>
        <div className='col-12 col-lg-6'>
          <input id='share-url-input' type='text' className='form-control' value={shareUrl} readOnly={true}/>
        </div>
        <div className='col-4 col-lg-2'>
          <a className='btn btn-primary w-100' href={shareUrl} target="_blank">
            <i className='bi bi-eye-fill me-2'></i>
            View
          </a>
        </div>
        <div className='col-4 col-lg-2'>
          <button id='copy-btn' className='btn btn-primary w-100' onClick={copyUrl} data-url={shareUrl}>
            <i className='bi bi-clipboard me-2'></i>
            <span className='textCue'>Copy</span>
          </button>
        </div>
        <div className='col-4 col-lg-2'>
          <button id='share-btn' className='btn btn-primary w-100' onClick={navigationShare} data-url={shareUrl}>
            <i className='bi bi-share me-2'></i>
            Share
          </button>
        </div>
      </div>
      <p>Your secret will automatically expire at {new Date(secretData.expires_at).toString()}</p>
      <a href='/' className='btn btn-light d-block w-100'>Share another secret</a>
    </>
  );
}

export default Confirmation;
