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

const createPostHtml = ({content, location, name, timestamp}) => `
<div class="item">
<div class="header">
  <div class="picture">
    <p>${typy(name,"[0]").safeString}</p>
  </div>
  <div class="content">
    <p class="title">${typy(name).safeString}</p>
    <p class="description">${typy(timestamp).safeString}</p>
  </div>
</div>
<div class="content">
  <p>${typy(content).safeString}</p>
  <div class="location">
    <p>${typy(location).safeString}</p>
  </div>
</div>
</div>
`;




module.exports.handleGetPosts = async function(){


  const database = firebase.firestore();

  const raw = await database.collection("posts").get();
  const list = await typy(raw, "docs").safeArray.map(doc => ({ ...doc.data(), id: doc.id }));

  
  return list.map(item => createPostHtml(item));

}