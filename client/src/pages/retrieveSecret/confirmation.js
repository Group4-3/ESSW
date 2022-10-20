import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Link } from 'react-router-dom';
import { Buffer } from "buffer";
import { getFileIcon, humanReadableSize } from '../../helpers/file';
import { unescape } from '../../helpers/text';
import { languages } from '../../helpers/syntaxHighlighterAvailableLanguages';

const Confirmation = ({secretData}) => {
  const [languageType, setLanguageType] = React.useState('plaintext');

  return (
    <>
      <div id='files-list' className='row row-cols-4 g-1 mt-3'>
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
      <SyntaxHighlighter language={languageType} style={docco}>
        {unescape(secretData.text)}
      </SyntaxHighlighter>
      <select id='method' name='method' onChange={ (e) => setLanguageType(e.target.value) } className='form-select'>
        {languages.map((option) => {
            if(option !== 'plaintext')
              return(<option value={option}>{option}</option>)
            else
              return(<option selected='selected' value={option}>{option}</option>)
          })
        }
      </select>
      <a href='/' className='btn btn-light d-block w-100 mt-3'>Share your own secret</a>
    </>
  );
}

export default Confirmation;
