import React from 'react';
import { getFileIcon, humanReadableSize } from '../../helpers/file';

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

const encryptionoptions = [
  {label: 'aes', value: 'aes'},
  {label: 'des', value: 'des'},
  {label: 'tripledes', value: 'tripledes'},
  {label: 'rabbit', value: 'rabbit'},
  {label: 'rc4', value: 'rc4'},
  {label: 'rc4drop', value: 'rc4drop'}
];

const maxattemptsoptions = [
  {label: '1', value: 1*1},
  {label: '2', value: 2*1},
  {label: '3', value: 3*1},
  {label: '4', value: 4*1},
  {label: '5', value: 5*1},
  {label: 'Infinite', value: -1*1}
];

// const ipbasedattemptsoptions = [
//   {label: 'True', value: 'True'},
//   {label: 'False', value: 'False'}
// ];



const Form = ({formResponse}) => {
  const [errorMessage, updateErrorMessage] = React.useState('');
  const [formData, updateFormData] = React.useState(Object.freeze({
    text: '',
    files: [],
    passphrase: '',
    expiry: 5*60,
    method: 'aes',
    max_access_attempts: 1*1 
    // ip_based_access_attempts: ''
  }));



  const handleInputChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim()
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let body = new FormData();
      for (const [key, value] of Object.entries(formData)) {
        if (key === 'files') {
          for (const file of formData.files) {
            body.append('files', file);
          }
          continue;
        }
        body.append(key, value);
      };

      let res = await fetch('http://localhost:3001/api/v2/secret/submit', {
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

  return (
    <>
      <h1>Create a secret message</h1>
      {errorMessage && (
        <div className='alert alert-danger'>{errorMessage}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className='row g-3'>
          <textarea id="text" name="text" placeholder="Our little secret..." onChange={handleInputChange} className="form-control" rows="3"></textarea>
          <input id="files" type="file" onChange={handleFileChange} className="form-control"/>
          <div id="files-list" className="row row-cols-4 g-1 mt-1"></div>
          <div className="col">
            <div className="row">
              <label for="passphrase" className="col-sm-2 col-form-label">Secret key</label>
              <div className="col-sm-10">
                <input type="password" id="passphrase" name="passphrase" onChange={handleInputChange} className="form-control"/>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h6>Advanced Options</h6>
              <div className="mb-3 row">
                <label for="expiry" className="col-sm-2 col-form-label">Expires in</label>
                <div className="col-sm-10">
                  <select id="expiry" name="expiry" onChange={handleInputChange} className="form-select">
                    {expiryOptions.map((option) => <option value={option.value}>{option.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="mb-4 row">
                <label for="method" className="col-sm-2 col-form-label">Encryption Method</label>
                <div className="col-sm-10">
                  <select id="method" name="method" onChange={handleInputChange} className="form-select">
                    {encryptionoptions.map((option) => <option value={option.value}>{option.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="mb-5 row">
                <label for="max_access_attempts" className="col-sm-2 col-form-label">Access Attempts</label>
                <div className="col-sm-10">
                  <select id="max_access_attempts" name="max_access_attempts" onChange={handleInputChange} className="form-select">
                    {maxattemptsoptions.map((option) => <option value={option.value}>{option.label}</option>)}
                  </select>
                </div>
              </div>
              {/* <div className="mb-6 row">
                <label for="ip_based_access_attempts" className="col-sm-2 col-form-label">Ip Based Attempts</label>
                <div className="col-sm-10">
                  <select id="ip_based_access_attempts" name="ip_based_access_attempts" onChange={handleInputChange} className="form-select">
                    {ipbasedattemptsoptions.map((option) => <option value={option.value}>{option.label}</option>)}
                  </select>
                </div>
              </div> */}
            </div>
          </div>
          <button type="submit" className="btn btn-primary d-block w-100">Submit secret</button>
        </div>
      </form>
    </>
  )
}

export default Form;