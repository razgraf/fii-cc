const cosmosClient = require("@azure/cosmos").CosmosClient;
const postModel = require("../models/PostModel");

const endpoint = process.env.COSMOS_URI;
const key = process.env.COSMOS_PRIMARY_KEY;
const databaseId = process.env.COSMOS_DATABASE_ID;
const containerId = process.env.COSMOS_CONTAINER_ID;

// console.log(process.env.COSMOS_URI);
const client = new cosmosClient({
  endpoint,
  key,
});

const model = new postModel(client, databaseId, containerId);

module.exports.endpoint = endpoint;
module.exports.key = key;
module.exports.databaseId = databaseId;
module.exports.containerId = containerId;
module.exports.cosmosClient = client;
module.exports.postModel = model;
