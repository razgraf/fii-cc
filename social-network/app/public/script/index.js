let clicked = false;
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

          const button = document.querySelector("#buttonSignOut");
          button.style.opacity = 1;

          button.onclick = async () => {
            console.log("here");
            try {
              if (clicked) return;
              clicked = true;

              console.log("here 2");

              const auth2 = gapi.auth2.getAuthInstance();
              auth2.signOut().then(function() {
                console.log("User signed out.");
                requestSignOut();
              });
            } catch (e) {
              console.error(e);
            } finally {
              clicked = false;
            }
          };
        },
        error => {
          console.log("onError");
        }
      );
  });
}

function requestSignOut() {
  try {
    const url = new URL(`${ROOT}/api/disconnect`);
    fetch(url)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.error("errorrrr");
        } else {
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
