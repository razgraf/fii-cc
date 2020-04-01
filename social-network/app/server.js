require("dotenv").config();

const express = require("express");
const parser = require("body-parser");
const path = require("path");
const { endpoints, PORT } = require("./constants");

const app = express();
const router = express.Router();

app.use(parser.json());
app.use(express.static(__dirname + "/public"));
app.use("/", router);

router.get(endpoints.home.root, function(req, res) {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

router.get("/connect", function(req, res) {
  res.sendFile(path.join(__dirname + "/public/connect.html"));
});

router.get("/secret", (req, res) => {
  res.send(process.env.ENV_SECRET);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
