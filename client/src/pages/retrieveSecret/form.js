import React from 'react';
import Collapse from 'bootstrap/js/dist/collapse';
import { getFileIcon, humanReadableSize } from '../../helpers/file';
import * as Constants from '../../helpers/constants.js';
import * as Cryptography from '../../helpers/cryptography.js';
import { useParams } from 'react-router-dom';

const Form = ({formResponse}) => {
  const { id } = useParams();
  const [errorMessage, updateErrorMessage] = React.useState('');
  const [formData, updateFormData] = React.useState(Object.freeze({
    passphrase: ''
  }));
  var [isPubkey, updateIsPublicKey] = React.useState(Object.freeze({
    checked: false
  }));

  const handleInputChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim()
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    var privateKey
    try {
      var formBody = [];
      for (const [key, value] of Object.entries(formData)) {
        var encodedKey = encodeURIComponent(key)
        var encodedValue
        if (key === 'passphrase' && Object.entries(isPubkey)[0][1] === true) {
          privateKey = value
          var pubKey = await Cryptography.privateToPublicKey(value)
          encodedValue = encodeURIComponent(pubKey)
        }
        else {
          encodedValue = encodeURIComponent(value)
        }
        formBody.push(encodedKey + '=' + encodedValue)
      };
      formBody = formBody.join('&');

      let res = await fetch(Constants.getApiAddress() + '/api/v2/secret/' + id, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: formBody
      });

      let json = await res.json();
      if (res.status === 200) {
        // Decrypt if encrypted with public key
        if(Object.entries(isPubkey)[0][1] === true){
          json.text = Cryptography.decryptUsingPrivateKey(json.text, privateKey)
        }

        formResponse(json);
      } else {
        // TODO error message should come from client validations
        updateErrorMessage(json.message)
      }
    } catch (err) {
      console.log(err)
    };
  };

  const handlePubkeyChange = async (e) => {
    e.preventDefault();

    const method = e.target.getAttribute('data-method');
    const targets = e.target.getAttribute('data-toggle');
    const toggles = document.querySelectorAll('[data-toggle="' + targets + '"]');

    toggles.forEach((t) => {
      t.classList.remove('active');
    });
    e.target.classList.add('active');

    updateIsPublicKey({
      ...isPubkey,
      ['checked']: (method === 'pubkey')
    });
  };

  return (
    <>
      {errorMessage && (
        <div className='alert alert-danger'>{errorMessage}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className='row g-3'>
          <div className='col-12'>
            <label>Decryption Mode</label>
            <nav class='nav nav-pills nav-justified mt-1'>
              <a class='nav-link active' onClick={handlePubkeyChange} data-toggle='method' data-method='passphrase'>Passphrase</a>
              <a class='nav-link' onClick={handlePubkeyChange} data-toggle='method' data-method='pubkey'>Private Key</a>
            </nav>
          </div>
          <div className='col-12'>
            <div className='row g-3'>
              {Object.entries(isPubkey)[0][1] === false &&
                <>
                  <label for='passphrase' className='col-sm-2 col-form-label'>Passphrase</label>
                  <div className='col-sm-10'>
                    <input type='password' id='passphrase' name='passphrase' onChange={handleInputChange} className='form-control'/>
                  </div>
                </>
              }
              {Object.entries(isPubkey)[0][1] === true &&
                <>
                  <div className='col-sm-2'>
                    <label for='passphrase' className='col-form-label'>Private Key</label>
                  </div>
                  <div className='col-sm-10'>
                    <textarea rows='7' cols='80' id='passphrase' name='passphrase' placeholder='-----BEGIN PRIVATE KEY-----&#10;MIIBojANBgkqhkiG9w0BAQEFAAOCAY8AMIIBigKCAYEAvk3&#10;...&#10;-----END PRIVATE KEY-----' onChange={handleInputChange} className='form-control'/>
                    <span className='small text-muted'>Your private key is not sent to the server. Decryption is done entirely on the client.</span>
                  </div>
                </>
              }
            </div>
          </div>
          <button type='submit' className='btn btn-primary d-block w-100'>Retrieve secret</button>
        </div>
      </form>
    </>
  )
}

export default Form;
