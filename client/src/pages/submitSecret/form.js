//import React from 'react';
import Collapse from 'bootstrap/js/dist/collapse';
import { getFileIcon, humanReadableSize } from '../../helpers/file';
import React, {useState} from 'react';
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
  {label: 'AES', value: 'aes'},
  {label: 'DES', value: 'des'},
  {label: 'TripleDES', value: 'tripledes'},
  {label: 'Rabbit', value: 'rabbit'},
  {label: 'RC4', value: 'rc4'},
  {label: 'RC4Drop', value: 'rc4drop'},
  {label: 'Public Key (text only)', value: 'publickey'},
  {label: 'None', value: 'none'}
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
    document.getElementById('passphrase').value = keyPair.publicKey
    updateFormData({
      ...formData,
      ['passphrase']: document.getElementById('passphrase').value.trim()
    });
    sessionStorage.setItem('privateKey', keyPair.privateKey)

    const keyCopyBtn = document.getElementById('priv-key-copy-button');
    keyCopyBtn.classList.remove('btn-light', 'disabled');
    keyCopyBtn.classList.add('btn-success');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let body = new FormData();
      for (const [key, value] of Object.entries(formData)) {
        if (key === 'files') {
          // skip loading file data if method is set to public key
          if (formData.method === 'publickey')
            continue;

          for (const file of formData.files) {
            body.append('files', file);
          }
          continue;
        }
        // Perform public key encryption on client end
        else if (key === 'text' && Object.entries(formData)[4][1] === 'publickey') {
          var pubKey = Object.entries(formData)[2][1]
          body.append(key, Cryptography.encryptUsingPublicKey(value, pubKey))
        }
        body.append(key, value)
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
    e.target.innerText = 'Copied!';
    sessionStorage.removeItem('privateKey');

    setTimeout(() => {
      e.target.innerText = 'Copy private key';
      e.target.classList.remove('btn-success');
      e.target.classList.add('btn-outline-success');
    }, 2000);
  }


  var passPhraseGen = document.getElementById("passphrase");

  function genPassPhrase(){
    console.log("you clicked me");

    var passChars = "0123456789abcdeghijklmnopqrstuvwxyz!@#$%^&*()_+:<>?/ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passLength = 10;
    var password ="";

        for (var i = 0; i <= passLength; i++){
            var randomNumber = Math.floor(Math.random() * passChars.length);
            password+= passChars.substring(randomNumber, randomNumber +1);
        }
    document.getElementById("passphraseField").value = password;
  }

  const [Input, setInput] = useState("");
  const ValidateText = /^[a-zA-Z0-9_]*$/;

  function getInput(){
    console.log("youclickme");
        if (Input===""){
            alert('You must type something');
            }
         else if (!ValidateText.test(Input)){
             alert('Message must not contain special characters');
             }
}
  return (
    <>
      <h1>Share a secret</h1>
      {errorMessage && (
        <div className='alert alert-danger'>{errorMessage} </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className='row g-3'>
          <div className='col-12'>
            <textarea id='text' name='text' placeholder='Our little secret...' onChange={handleInputChange} className='form-control' rows='3' onChange={e =>setInput(e.target.value)}></textarea>
          </div>
          {formData.method !== 'publickey' &&
            <div className='col-12'>
              <input id='files' type='file' onChange={handleFileChange} className='form-control'/>
              <div id='files-list' className='row row-cols-4 g-1 mt-1'></div>
            </div>
          }
          <div className='col-12'>
            {formData.method !== 'publickey' &&
              <div className='row g-3'>
                <label id='div-input-pass-pub-label' for='passphrase' className='col-sm-2 col-form-label'>Passphrase</label>
                <div id='div-input-pass-pub' className='col-sm-10'>
                  <input type='password' id='passphrase' name='passphrase' onChange={handleInputChange} className='form-control'/>
                </div>
              </div>
            }

            <div className='col-12'>
                <button onClick={genPassPhrase} type="submit" class="" value="save">Generate Passphrase</button>
            </div>


            {formData.method === 'publickey' &&
              <div className='row g-3'>
                <label id='div-input-pass-pub-label' for='passphrase' className='col-sm-2 col-form-label'>Public key</label>
                <div id='div-input-pass-pub' className='col-sm-10'>
                  <textarea rows='7' cols='80' id='passphrase' name='passphrase' placeholder='-----BEGIN PUBLIC KEY-----&#10;MIIBojANBgkqhkiG9w0BAQEFAAOCAY8AMIIBigKCAYEAvk3&#10;...&#10;-----END PUBLIC KEY-----' onChange={handleInputChange} className='form-control'/>
                  <div className='d-flex flex-row mt-3'>
                    <button id='div-input-pass-pub-genkey' type='button' className='btn btn-light w-50 me-2' onClick={handleGenerateKeyPair}>Generate key pair</button>
                    <button id='priv-key-copy-button' type='button' className='btn btn-light disabled w-50 ms-2' onClick={copyPrivateKey}>Copy private key</button>
                  </div>
                </div>
              </div>
            }
          </div>
          <div className='col-12'>
            <div className='card'>
              <div className='card-body'>
                <div className='accordion'>
                  <div className='accordion-item'>
                    <div className='accordion-header'>
                      <button className='accordion-button collapsed fw-bold' type='button' data-bs-toggle='collapse' data-bs-target='#advanced-options-menu' aria-expanded='false'>
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
                        {/* <label for='infinite_access_attempts'>Infinite access attempts</label>
                         <input className='form-check-input' type='checkbox' id='infinite_access_attempts' aria-expanded='true' data-bs-toggle='collapse' data-bs-target='#access_attempts' name='max_access_attempts' checked/>
                         {/* Hide access attempt form by default */}
                        <div className='mb-3 row' id='access_attempts'>
                          <label for='max_access_attempts' className='col-sm-6 col-form-label'>
                            Max access attempts
                            <small className='text-muted'> (-1 infinite)</small>
                          </label>
                          <div className='col-sm-6'>
                            <input id='max_access_attempts' name='max_access_attempts' type='number' min='-1' max='999' value='-1' onChange={handleInputChange} className='form-control'/>
                            {/* TODO: Set value to -1 if hidden */}
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
          </div>
          <div className='col-12'>
            <button onClick={getInput} type='submit' className='btn btn-primary d-block w-100'>Submit secret</button>
          </div>
        </div>
      </form>
    </>
  )
}

export default Form;
