const postModel = require("../vendors/cosmos").postModel;
const insightsClient = require("../vendors/insights").client;
function UploadPhoto(postId, imageUrl) {
  console.log(imageUrl);
  const http = require("https");
  const stream = require("stream").Transform;
  const fs = require("fs");
  const storage = require("azure-storage");
  const blobService = storage.createBlobService(
    process.env.BLOB_STORAGE_ACCOUNT,
    process.env.BLOB_STORAGE_KEY
  );
  // var url = 'http://www.google.com/images/srpr/logo11w.png';
  let index = imageUrl.lastIndexOf(".");
  let type = imageUrl.substring(index + 1, imageUrl.length);

  http
    .request(imageUrl, function (response) {
      var data = new stream();
      console.log("in request");
      response.on("data", function (chunk) {
        data.push(chunk);
      });
      console.log("data");
      response.on("end", function () {
        // fs.writeFileSync("image.png", data.read());
        blobService.createBlockBlobFromStream(
          process.env.BLOB_CONTAINER_NAME,
          postId + "." + type,
          data,
          data.readableLength,
          {
            contentSettings: {
              contentType: "image/" + type,
            },
          },
          (err) => {
            if (err) {
              console.log("eroare" + err);
              return;
            }
            console.log("succes");
          }
        );
      });
    })
    .end();
}
async function create(req, res) {
  // console.log(req);
  // console.log(req.params);
  // console.log(req.body);
  // insights.defaultClient.trackNodeHttpRequest({ request: res, response: res });
  const postArgs = req.body;
  const post = await postModel.addPost(postArgs);
  UploadPhoto(post.postId, post.imageUrl);
  res.status(200);
  res.json({ post });
}

async function get(req, res) {
  // console.log(req.params);
  // insightsClient.trackNodeHttpRequest({ request: res, response: res });
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
