const postModel = require("../vendors/cosmos").postModel;

async function create(req, res) {
  // console.log(req);
  // console.log(req.params);
  // console.log(req.body);
  const postArgs = req.body;
  const post = await postModel.addPost(postArgs);
  res.status(200);
  res.json({ post });
}

async function get(req, res) {
  // console.log(req.params);
  const post = await postModel.getPost(req.params.postId);
  res.status(200);
  res.json(post);
}

async function list(req, res) {
  const posts = await postModel.listPosts();
  res.status(200);
  res.json(posts);
}

async function edit(req, res) {
  res.json({ message: "Edit not implemented yet", params: req.params });
}

async function remove(req, res) {
  res.json({ message: "Remove not implemented yet" });
}

module.exports = {
  create,
  edit,
  remove,
  get,
  list,
};
