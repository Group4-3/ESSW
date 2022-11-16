import React from 'react';
import Form from './form';
import Confirmation from './confirmation';
import { useTitle } from '../../components/title';


const SubmitSecret = () => {
  const setTitle = useTitle("Share - ESSW Demo");
  const [secretData, updateSecretData] = React.useState(undefined);
  const formResponse = (data) => {
    updateSecretData(data)
  }

  return secretData ? <Confirmation secretData={secretData}/> : <Form formResponse={formResponse}/>
}

export default SubmitSecret;
