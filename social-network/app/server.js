require("dotenv").config();
const express = require("express");
const parser = require("body-parser");
const path = require("path");
const firebase = require("firebase");
const cors = require("cors");
const handlebars = require("express-handlebars");
const { endpoints, PORT, ROOT, vendors } = require("./constants");

const app = express();

const {
  handleConnectedUser,
  handleDisconnectUser,
  handleGetPosts
} = require("./handler");

firebase.initializeApp(vendors.firebase.config);

app.set("view engine", "handlebars");
app.engine(
  "handlebars",
  handlebars({
    layoutsDir: __dirname + "/views/layouts"
  })
);

app.use(cors());
app.use(parser.json());
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const user = firebase.auth().currentUser;
  if (user) {
    const posts = await handleGetPosts();

    res.render("main", { layout: "index", ROOT, posts });
  } else {
    res.redirect(endpoints.connect.root);
  }
});

app.get(endpoints.connect.root, function(req, res) {
  const user = firebase.auth().currentUser;
  if (user) {
    res.redirect(endpoints.home.root);
  } else {
    res.render("main", { layout: "connect", ROOT });
  }
});

app.get(endpoints.createPost.root, function(req, res) {
  const user = true; //firebase.auth().currentUser;
  if (user) {
    res.render("main", {
      layout: "createPost",
      ROOT,
      KEY: process.env.ENV_GOOGLE_MAPS_KEY
    });
  } else {
    res.redirect(endpoints.home.root);
  }
});

app.get(endpoints.api.manage.root, function(req, res) {
  handleConnectedUser({ token: req.params.token, response: res });
});

app.get(endpoints.api.disconnect.root, function(req, res) {
  handleDisconnectUser({ response: res });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
