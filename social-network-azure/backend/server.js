require("dotenv").config();
const express = require("express");
const cosmosClient = require("@azure/cosmos").CosmosClient;
const parser = require("body-parser");
const cors = require("cors");
const { PORT, STATUS } = require("./constants");
const PostRouter = require("./routers/PostRouter");
const PostModel = require("./models/PostModel");
const dbContext = require("./vendors/cosmos");

const app = express();

app.use(cors());
// app.use(parser.json());
app.use(express.json());
app.use(express.static("public"));

// const endpoint = process.env.COSMOS_URI;
// const key = process.env.COSMOS_PRIMARY_KEY;
// const databaseId = process.env.COSMOS_DATABASE_ID;
// const containerId = process.end.COSMOS_CONTAINER_ID;

// const cosmosClient = new CosmosClient({
//   endpoint, key
// });

// const postModel = new PostModel(cosmosClient, databaseId, containerId);

app.get("/", async (req, res) => {
  res.status(STATUS.OK);
  res.json({ message: "Welcome Home" });
});

app.use("/posts", PostRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
