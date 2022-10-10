import React from 'react';
import * as Constants from "../../helpers/constants.js";
import * as Cryptography from "../../helpers/cryptography.js";
import {
  useParams
} from "react-router-dom";

const RetrieveSecret = ({formResponse}) => {
  const { id } = useParams();
  const [errorMessage, updateErrorMessage] = React.useState('');
  const [formData, updateFormData] = React.useState(Object.freeze({
    passphrase: '',
  }));
  var [isPubkey] = React.useState(false);

  const handleInputChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim()
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      var formBody = [];
      for (const [key, value] of Object.entries(formData)) {
        if(key === 'passphrase'){
          Cryptography.privateToPublicKey(value);
        }
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(value);
        formBody.push(encodedKey + "=" + encodedValue);
      };
      formBody = formBody.join("&");

      let res = await fetch(Constants.getApiAddress() + '/api/v2/secret/' + id, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: formBody
      });

      let json = await res.json();
      if (res.status === 200) {
        //formResponse(json);
      } else {
        // TODO error message should come from client validations
        updateErrorMessage(JSON.stringify(json, null, 4))
      }
    } catch (err) {
      console.log(err)
    };
  }

  const handlePubkeyChange = async (e) => {
    isPubkey = e.target.checked
  }

  return (
    <>
      <h1>View Secret [{id}]</h1>
      {errorMessage && (
        <div className='alert alert-danger'>{errorMessage}</div>
      )}
    <form onSubmit={handleSubmit}>
      <div className='row g-3'>
        <div id="files-list" className="row row-cols-4 g-1 mt-1"></div>
        <div className="col">
          <div className="row">
            <label for="pubkey" className="col-sm-2 col-form-label">Passphrase</label>
            <div className='col-sm-1'>
              <div className='form-check form-switch row' style={{justifyContent: 'center'}}>
                <input className='form-check-input' type='checkbox' id='pubkey' name='pubkey' onChange={handlePubkeyChange} style={{width: '50%'}} />
              </div>
            </div>
            <label for="pubkey" className="col-sm-2 col-form-label">Private Key</label>
          </div>
          <div className="row">
            <div className="col-sm-10">
              {isPubkey === false &&
                <>
                  <label for="passphrase" className="col-sm-2 col-form-label">Passphrase</label>
                  <input type="password" id="passphrase" name="passphrase" onChange={handleInputChange} className="form-control"/>
                </>
              }
              {isPubkey === true &&
                <>
                  <label for="passphrase" className="col-sm-2 col-form-label">Private Key (Will never be sent to the server!)</label>
                  <input type="password" id="passphrase" name="passphrase" onChange={handleInputChange} className="form-control"/>
                </>
              }
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary d-block w-100">Retrieve secret</button>
      </div>
    </form>
  </>
  )
}

export default RetrieveSecret;