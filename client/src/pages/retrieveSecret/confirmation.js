import React from 'react';
import {
  Link
} from 'react-router-dom'

const Confirmation = ({secretData}) => {

  return (
    <>
      <textarea rows='20' cols='80' readOnly={true}>{secretData.text}</textarea>
    </>
  );
}

export default Confirmation;
