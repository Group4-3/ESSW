const express = require("express");
const path = require("path");

const expressApp = express();

/*
  v1.0.1 - Added comment
  TODO: Add feature

*/
expressApp.post("/api", (request, response) => {
  response.json({ message: "OK", code: 200 });
  //Change
});

expressApp.get("*", (request, response) => {
  const url = request.originalUrl.split("?").shift();
  response.sendFile(path.join(__dirname, `/www${url}`));
});

expressApp.listen(8080, () => {
  console.log("Listening on port 8080");
});
