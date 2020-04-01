const firebase = require("firebase");

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
