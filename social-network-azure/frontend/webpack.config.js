const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: {
    index: "./src/index.js",
    create: "./src/create.js",
  },
  output: {
    path: path.join(__dirname, "./dist"),
    filename: "[name].js",
  },
  plugins: [
    new Dotenv({
      path: "./.env",
    }),
  ],
};
