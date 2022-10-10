import React from 'react';
import Collapse from 'bootstrap/js/dist/collapse';
import { getFileIcon, humanReadableSize } from '../../helpers/file';
import * as Constants from '../../helpers/constants.js';
import * as Cryptography from '../../helpers/cryptography.js';

const expiryOptions = [
  {label: '5 minutes', value: 5*60},
  {label: '30 minutes', value: 30*60},
  {label: '1 hour', value: 1*60*60},
  {label: '3 hours', value: 3*60*60},
  {label: '12 hours', value: 12*60*60},
  {label: '1 day', value: 1*24*60*60},
  {label: '3 days', value: 3*24*60*60},
  {label: '7 days', value: 7*24*60*60}
];

const encryptionOptions = [
  {label: 'aes', value: 'aes'},
  {label: 'des', value: 'des'},
  {label: 'tripledes', value: 'tripledes'},
  {label: 'rabbit', value: 'rabbit'},
  {label: 'rc4', value: 'rc4'},
  {label: 'rc4drop', value: 'rc4drop'},
  {label: 'Public Key', value: 'publickey'},
  {label: 'none', value: 'none'}
];

const Form = ({formResponse}) => {
  const [errorMessage, updateErrorMessage] = React.useState('');
  const [formData, updateFormData] = React.useState(Object.freeze({
    text: '',
    files: [],
    passphrase: '',
    expiry: 5*60,
    method: 'aes',
    max_access_attempts: -1,
    ip_based_access_attempts: false,
    allow_insecure_passphrase: false
  }));

  const handleInputChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim()
    });
  }

  const handleSwitchChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.checked
    });
  };

  const handleFileChange = (e) => {
    let output = document.getElementById('files-list');
    let filesHtml = [];

    for (const file of e.target.files) {
      filesHtml.push(`
        <div class='col'>
          <div class='card h-100'>
            <div class='card-body d-flex flex-column align-items-center'>
              <i class='bi ${getFileIcon(file.type)} h1'></i>
              <span class='font-monospace small'>${file.name}</span>
              <span class='text-muted small fw-bold pt-2'>${humanReadableSize(file.size)}</span>
            </div>
          </div>
        </div>
      `);
      // TODO create different method of file input to allow on-the-go modification of file list
      // <a href='#' class='p-1 position-absolute top-0 end-0 fs-5 text-danger'>
      //   <i class='bi bi-x'></i>
      // </a>
    };

    output.innerHTML = filesHtml.join('');
    updateFormData({
      ...formData,
      files: e.target.files
    });
  };

  const handleGenerateKeyPair = async (e) => {
    var keyPair = await Cryptography.generateKeyPair()
    console.log(keyPair)
    document.getElementById('passphrase').value = keyPair.publicKey
    updateFormData({
      ...formData,
      ['passphrase']: document.getElementById('passphrase').value.trim()
    });
    sessionStorage.setItem('privateKey', keyPair.privateKey)
    document.getElementById('priv-key-copy-button').style.display = 'block';
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let body = new FormData();
      for (const [key, value] of Object.entries(formData)) {
        console.log([key, value])
        if (key === 'files') {
          for (const file of formData.files) {
            body.append('files', file);
          }
          continue;
        }

        body.append(key, value);
      };
      let res = await fetch(Constants.getApiAddress() + '/api/v2/secret/submit', {
        method: 'POST',
        body: body
      });

      let json = await res.json();
      if (res.status === 200) {
        formResponse(json);
      } else {
        // TODO error message should come from client validations
        updateErrorMessage(JSON.stringify(json, null, 4))
      }
    } catch (err) {
      console.log(err)
    };
  }

  const copyPrivateKey = async (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(sessionStorage.getItem('privateKey'));
    console.log(e);
    e.target.innerText = 'Copy private key (Copied!)';
    sessionStorage.removeItem('privateKey');
  }

  return (
    <>
      <h1>Create a secret message</h1>
      {errorMessage && (
        <div className='alert alert-danger'>{errorMessage}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className='row g-3'>
          <textarea id='text' name='text' placeholder='Our little secret...' onChange={handleInputChange} className='form-control' rows='3'></textarea>
          {formData.method !== 'publickey' &&
            <>
            <input id='files' type='file' onChange={handleFileChange} className='form-control'/>
            <div id='files-list' className='row row-cols-4 g-1 mt-1'></div>
            </>
          }
          <div className='col'>
              <label id='div-input-pass-pub-label' for='passphrase' className='col-sm-2 col-form-label'>Secret key</label>
              <div className='row'>
              {formData.method !== 'publickey' &&
                  <>
                      <div id='div-input-pass-pub' className='col-sm-10'>
                        <input type='password' id='passphrase' name='passphrase' onChange={handleInputChange} className='form-control'/>
                      </div>
                  </>
              }
              {formData.method === 'publickey' &&
                  <>
                      <textarea rows='7' cols='80' id='passphrase' name='passphrase' placeholder='-----BEGIN PUBLIC KEY-----&#10;MIIBojANBgkqhkiG9w0BAQEFAAOCAY8AMIIBigKCAYEAvk3&#10;...&#10;-----END PUBLIC KEY-----\' onChange={handleInputChange} className='form-control' rows='3'/ >
                      <button id='div-input-pass-pub-genkey' type='button' onClick={handleGenerateKeyPair} className='btn btn-primary d-block w-5'>Generate Key Pair</button>
                      <a id='priv-key-copy-button' href='#' onClick={copyPrivateKey}>Copy private key</a>
                  </>
              }
              </div>
          </div>
          <div className='card'>
            <div className='card-body'>
              <div className='accordion'>
                <div className='accordion-item'>
                  <div className='accordion-header'>
                    <button className='accordion-button fw-bold' type='button' data-bs-toggle='collapse' data-bs-target='#advanced-options-menu' aria-expanded='false'>
                      Advanced Options
                    </button>
                  </div>
                  <div id='advanced-options-menu' className='accordion-collapse collapse'>
                    <div className='accordion-body'>
                      <div className='my-3 row'>
                        <label for='expiry' className='col-sm-6 col-form-label'>Expires in</label>
                        <div className='col-sm-6'>
                          <select id='expiry' name='expiry' onChange={handleInputChange} className='form-select'>
                            {expiryOptions.map((option) => <option value={option.value}>{option.label}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className='mb-3 row'>
                        <label for='method' className='col-sm-6 col-form-label'>Encryption method</label>
                        <div className='col-sm-6'>
                          <select id='method' name='method' onChange={handleInputChange} className='form-select'>
                            {encryptionOptions.map((option) => <option value={option.value}>{option.label}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className='mb-3 row'>
                        <label for='max_access_attempts' className='col-sm-6 col-form-label'>
                          Max access attempts
                          <small className='text-muted'> (-1 infinite)</small>
                        </label>
                        <div className='col-sm-6'>
                          <input id='max_access_attempts' name='max_access_attempts' type='number' min='-1' max='999' onChange={handleInputChange} className='form-control'/>
                        </div>
                      </div>
                      <div className='mb-3 row'>
                        <label className='form-check-label col-sm-6' for='ip_based_access_attempts'>Limit access attempts per IP</label>
                        <div className='col-sm-6'>
                          <div className='form-check form-switch'>
                            <input className='form-check-input' type='checkbox' id='ip_based_access_attempts' name='ip_based_access_attempts' onChange={handleSwitchChange}/>
                          </div>
                        </div>
                      </div>
                      <div className='mb-3 row'>
                        <label className='form-check-label col-sm-6' for='allow_insecure_passphrase'>Allow insecure passphrase</label>
                        <div className='col-sm-6'>
                          <div className='form-check form-switch'>
                            <input className='form-check-input' type='checkbox' id='allow_insecure_passphrase' name='allow_insecure_passphrase' onChange={handleSwitchChange}/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button type='submit' className='btn btn-primary d-block w-100'>Submit secret</button>
        </div>
      </form>
    </>
  )
}

export default Form;
