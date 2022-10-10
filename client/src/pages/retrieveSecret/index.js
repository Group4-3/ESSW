import React from 'react';
import Form from './form';
import Confirmation from './confirmation';


const RetrieveSecret = () => {
  const [secretData, updateSecretData] = React.useState(undefined);
  const formResponse = (data) => {
    updateSecretData(data)
  }

  return secretData ? <Confirmation secretData={secretData}/> : <Form formResponse={formResponse}/>
}

export default RetrieveSecret;
