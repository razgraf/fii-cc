console.log(ROOT);

function init() {
  gapi.load("auth2", () => {
    gapi.auth2
      .init({
        client_id:
          "192803036566-1qcajpvl19qnf9qu043o5fdoaq8762lk.apps.googleusercontent.com"
      })
      .then(
        () => {
          console.log("onInit");
          const button = document.querySelector("#buttonSignIn");
          button.style.opacity = 1;
        },
        error => {
          console.log("onError");
        }
      );
  });
}

function onSignIn(googleUser) {
  const profile = googleUser.getBasicProfile();
  const token = googleUser.getAuthResponse().id_token;
  console.log("token: ", token ? "true" : "false");
  console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log("Name: " + profile.getName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.

  requestConnection({ token });
}

function requestConnection({ token }) {
  try {
    const url = new URL(`${ROOT}/api/manage/${token}`);

    fetch(url)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.error("errorrrr");
        } else {
          console.log("here");
          console.log(res);
          window.location.reload(true);
        }
      })
      .catch(error => {
        console.error("catch");
        throw new Error(error);
      });
  } catch (e) {
    console.error(e);
  }
}
