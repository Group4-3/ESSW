import React from 'react';


const RetrieveSecret = () => {
  return (
      <form>
        <div className='row g-3'>
          <div id="files-list" className="row row-cols-4 g-1 mt-1"></div>
          <div className="col">
            <div className="row">
              <label for="passphrase" className="col-sm-2 col-form-label">ID: </label>
              <div className="col-sm-10">
                <input type="password" id="passphrase" name="passphrase"  className="form-control"/>
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary d-block w-100">Retrieve secret</button>
        </div>
      </form>
    
  );
}

export default RetrieveSecret;