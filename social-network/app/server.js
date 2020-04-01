const express = require("express");
const { t: typy } = require("typy");

const { endpoints, PORT } = require("./constants");

const app = express();

app.get(endpoints.home.root, (request, response) => {
  response.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
