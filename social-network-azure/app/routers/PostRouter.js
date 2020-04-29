const express = require("express");
const PostController = require("../controllers/PostController");

const PostRouter = express.Router();

PostRouter.get("/:postId", PostController.get);
PostRouter.get("/", PostController.list);
PostRouter.post("/", PostController.create);
PostRouter.patch("/:postId", PostController.edit);
PostRouter.delete("/:postId", PostController.remove);

module.exports = PostRouter;
