import React from 'react';
import * as Constants from "../../helpers/constants.js";
import {
  useParams
} from "react-router-dom";

const RetrieveSecret = ({formResponse}) => {
  const { id } = useParams();
  const [errorMessage, updateErrorMessage] = React.useState('');
  const [formData, updateFormData] = React.useState(Object.freeze({
    passphrase: '',
  }));

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

return (
  <>
    <h1>Enter Secret ID</h1>
    {errorMessage && (
      <div className='alert alert-danger'>{errorMessage}</div>
    )}
  <form onSubmit={handleSubmit}>
      
    <div className='row g-3'>
      <div id="files-list" className="row row-cols-4 g-1 mt-1"></div>
      <div className="col">
        <div className="row">
          <label for="passphrase" className="col-sm-2 col-form-label">ID: </label>
          <div className="col-sm-10">
            <input type="password" id="passphrase" name="passphrase" onChange={handleInputChange} className="form-control"/>
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