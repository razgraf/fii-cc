const cosmosClient = require("@azure/cosmos").CosmosClient;
const insights = require("../vendors/insights").client;

class PostModel {
  constructor(cosmosClient, databaseId, containerId) {
    this.client = cosmosClient;
    this.databaseId = databaseId;
    this.collectionId = containerId;

    this.database = null;
    this.container = null;
  }
  async init() {
    // console.log("Enter init");
    const dbResponse = await this.client.databases.createIfNotExists({
      id: this.databaseId,
    });
    // console.log("Set up the database");
    this.database = dbResponse.database;
    const coResponse = await this.database.containers.createIfNotExists({
      id: this.collectionId,
    });
    this.container = coResponse.container;
    // console.log("Set up the container");

    // console.log("Init OK");
  }

  async checkDB() {
    if (this.container == null) {
      console.log("DB connection not initialised");
      await this.init((err) => {
        console.error(err);
      }).catch((err) => {
        console.error(err);
        console.error(
          "Shutting down because there was an error settinig up the database."
        );
        process.exit(1);
      });
    }
  }

  async addPost(post) {
    await this.checkDB();
    const { resource: doc } = await this.container.items.create(post);
    return doc;
  }

  async getPost(postId) {
    await this.checkDB();
    const partitionKey = undefined;
    const { resource } = await this.container.item(postId, partitionKey).read();
    return resource;
  }

  async listPosts() {
    await this.checkDB();
    const querySpec = {
      query: "SELECT * from c",
    };
    const { resources } = await this.container.items
      .query(querySpec)
      .fetchAll();
    return resources;
  }
}

module.exports = PostModel;
