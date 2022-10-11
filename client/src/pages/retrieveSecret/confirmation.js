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
        { secretData.files.map((element, index) => {
          var buffer = Buffer.from(element.blob.data);
          console.log(buffer)
          var file = new Blob([buffer]);

          return (
          <div class='col'>
            <div class='card h-100'>
              <div class='card-body d-flex flex-column align-items-center'>
                <i class='bi ${getFileIcon(element.mimetype)} h1'></i>
                <span class='font-monospace small'>{element.file_name}</span>
                <span class='text-muted small fw-bold pt-2'>{humanReadableSize(element.size)}</span>
                <a href={URL.createObjectURL(file)} download={element.file_name}>Download</a>
              </div>
            </div>
          </div>
        )})
        }
      </div>
      <textarea rows='20' cols='80' readOnly={true}>{secretData.text}</textarea>
        }
    </>
  );
}

export default Confirmation;
