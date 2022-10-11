import React from 'react';
import {
  Link
} from 'react-router-dom'
import { getFileIcon, humanReadableSize } from '../../helpers/file';
import { Buffer } from "buffer";

const Confirmation = ({secretData}) => {

  return (
    <>
      <div id='files-list' className='row row-cols-4 g-1 mt-1'>
        {
          secretData.files.map((element, index) => {
            var bytes = new Uint8Array(element.blob.data);
            var blob = new Blob([bytes], {
              type: element.mimetype
            });
            var file = new File([blob], element.file_name, {
              type: element.mimetype
            });

            return (
              <div className='col'>
                <div className='card h-100'>
                  <div className='card-body d-flex flex-column align-items-center'>
                    <i className='bi ${getFileIcon(element.mimetype)} h1'></i>
                    <span className='font-monospace small'>{element.file_name}</span>
                    <span className='text-muted small fw-bold pt-2'>{humanReadableSize(element.size)}</span>
                    <a href={URL.createObjectURL(file)} download={element.file_name}>Download</a>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
      <textarea rows='20' cols='80' readOnly={true} value={secretData.text}></textarea>
    </>
  );
}

export default Confirmation;
