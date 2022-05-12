const express = require('express');
const path = require('path');

const expressApp = express();

expressApp.post('/api', (request, response) => {
  response.json({ message: 'OK', code: 200 });
});

expressApp.get('*', (request, response) => {
  const url = request.originalUrl.split('?').shift();
  response.sendFile(path.join(__dirname, `/www${url}`));
});

expressApp.listen(8080, () => {
  console.log('Listening on port 8080');
});
