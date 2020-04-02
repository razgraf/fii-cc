const firebase = require("firebase");
const { t: typy } = require("typy");

module.exports.handleConnectedUser = function({ token, response }) {
  const credential = firebase.auth.GoogleAuthProvider.credential(token);

  firebase
    .auth()
    .signInWithCredential(credential)
    .then(() => {
      response.send({ result: "success" });
    })
    .catch(function(error) {
      response.send({ result: "error" });
    });
};

module.exports.handleDisconnectUser = function({ response }) {
  firebase
    .auth()
    .signOut()
    .then(() => {
      response.send({ result: "success" });
    })
    .catch(function(error) {
      response.send({ result: "error" });
    });
};

const createPostHtml = ({ content, location, name, timestamp, isSelf }) => `
<div class="item">
<div class="header">
  <div class="picture">
    <p>${typy(name, "[0]").safeString}</p>
  </div>
  <div class="content">
    <p class="title">${typy(name).safeString}</p>
    <p class="description">${typy(timestamp).safeString}</p>
  </div>
  ${isSelf ? `<div class="labelSelf"><span>You</span></div>` : ``}
</div>
<div class="content">
  <p>${typy(content).safeString}</p>
  <div class="location">
    <p>${typy(location).safeString}</p>
  </div>
</div>
</div>
`;

module.exports.handleGetPosts = async function() {
  const database = firebase.firestore();

  const user = firebase.auth().currentUser;

  const raw = await database.collection("posts").get();
  const list = await typy(raw, "docs")
    .safeArray.map(doc => ({
      ...doc.data(),
      id: doc.id
    }))
    .map(item => ({ ...item, isSelf: item.uid === user.uid }));

  console.log(list);

  return list.map(item => createPostHtml(item)).join("");
};

module.exports.handleCreatePost = async function({ request, response }) {
  const database = firebase.firestore();
  const posts = database.collection("posts");

  const { body } = request;

  const user = firebase.auth().currentUser;

  if (
    typy(body, "text").isFalsy ||
    typy(body, "address").isFalsy ||
    typy(body, "longitude").isNullOrUndefined ||
    typy(body, "latitude").isNullOrUndefined
  ) {
    response.send({ result: "error" });
    return;
  }

  await posts.add({
    content: typy(body, "text").safeString,
    location: typy(body, "address").safeString,
    coordinates: {
      latitude: body.latitude,
      longitude: body.longitude
    },
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  });

  response.send({ result: "success" });
};
