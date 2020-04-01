const express = require("express");
const parser = require("body-parser");

const { endpoints, PORT } = require("./constants");

const app = express();
const router = express.Router();

app.use(parser.json());
app.use(express.static(__dirname + "/public"));
app.use("/", router);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
