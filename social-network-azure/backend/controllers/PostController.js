const postModel = require("../vendors/cosmos").postModel;
const insightsClient = require("../vendors/insights").client;
const axios = require("axios");

const http = require("https");
const Stream = require("stream").Transform;
const fs = require("fs");

const storage = require("azure-storage");

async function UploadPhoto(postId, imageUrl) {
  console.log(imageUrl);

  const blobService = storage.createBlobService(
    process.env.BLOB_STORAGE_ACCOUNT,
    process.env.BLOB_STORAGE_KEY
  );

  let index = imageUrl.lastIndexOf(".");
  let type = imageUrl.substring(index + 1, imageUrl.length);

  http
    .request(imageUrl, function (response) {
      var data = new stream();
      console.log("in request");
      response.on("data", function (chunk) {
        console.log(chunk);
        data.push(chunk);
      });
      console.log("data");

      size = data.writableLength;
      response.on("end", function () {
        console.log("end");
        console.log(data);
        blobService.createBlockBlobFromStream(
          process.env.BLOB_CONTAINER_NAME,
          postId + "." + type,
          data,
          size,
          {
            contentSettings: {
              contentType: "image/" + (type === "jpg" ? "jpeg" : type),
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
function download(imageUrl, callback) {
  console.log("downloading photo...");

  return http
    .request(imageUrl, function (response) {
      var data = new Stream();

      response.on("data", function (chunk) {
        data.push(chunk);
      });

      response.on("end", function () {
        fs.writeFileSync("image.png", data.read());
        console.log("downloaded photo successfully");
        callback();
      });
    })
    .end();
}
function deleteFile() {
  console.log("deleting photo...");
  const fs = require("fs");
  fs.unlink("image.png", (err) => {
    if (err) {
      console.log("failed to delete");
      console.log(err);
      return;
    }
  });
  console.log("deleted photo successfully");
}

async function UploadPhoto_v2(postId, imageUrl, finalRemoveCallback) {
  const storage = require("azure-storage");
  const blobService = storage.createBlobService(
    process.env.BLOB_STORAGE_ACCOUNT,
    process.env.BLOB_STORAGE_KEY
  );
  download(imageUrl, () => {
    console.log("creating blob...");
    blobService.createBlockBlobFromLocalFile(
      process.env.BLOB_CONTAINER_NAME,
      postId + ".png",
      "image.png",
      {
        contentSettings: {
          contentType: "image/png",
        },
      },
      (err) => {
        if (finalRemoveCallback) finalRemoveCallback();

        if (err) {
          console.log("eroare" + err);
          return;
        }
        console.log("created blob successfully");
      }
    );
  });
}
async function create(req, res) {
  const postArgs = req.body;
  const post = await postModel.addPost(postArgs);
  await UploadPhoto_v2(post.id, post.imageUrl, deleteFile);
  res.status(200);
  res.json({ post });
}

async function get(req, res) {
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
