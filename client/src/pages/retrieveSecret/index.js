import React from 'react';
import Form from './form';
import Confirmation from './confirmation';
import { useTitle } from '../../components/title';
import {
  useParams
} from "react-router-dom";

const RetrieveSecret = () => {
  const setTitle = useTitle("Unlock - ESSW Demo");
  const { id } = useParams();
  const [secretData, updateSecretData] = React.useState(undefined);
  const formResponse = (data) => {
    updateSecretData(data)
  }

  return (
    <>
      <h1>View Secret [{id}]</h1>
      {secretData ? <Confirmation secretData={secretData}/> : <Form formResponse={formResponse}/>}
    </>
    )
}

export default RetrieveSecret;
