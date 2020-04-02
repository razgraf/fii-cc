let address = null;
let text = null;
let coordinates = {};
(function() {
  initialize();
})();

function initialize() {
  const button = document.querySelector("#buttonSave");
  button.onclick = () => {
    text = document.querySelector("#postInput").value;
    if (text != null && text != "" && address != null) {
      requestCreatePost({ text, address, coordinates });
      button.dataset.active = false;
    } else {
      console.log("no text or no address");
    }
  };
}

function initMap() {
  map = null;
  infoWindow = null;

  let options = {
    zoom: 14,
    center: { lat: 40.7829, lng: -73.9654 },
    mapTypeControl: false
  };

  map = new google.maps.Map(document.getElementById("map"), options);

  map.addListener("click", mapsMouseEvent => {
    // if(marker != null)marker.setMap(null);
    if (infoWindow != null) infoWindow.close();
    // marker = new google.maps.Marker({
    //     position: mapsMouseEvent.latLng,
    //     map
    // });
    infoWindow = new google.maps.InfoWindow({
      position: mapsMouseEvent.latLng
    });

    console.log(
      mapsMouseEvent.latLng.lat() + " " + mapsMouseEvent.latLng.lng()
    );
    coordinates = {
      latitude: mapsMouseEvent.latLng.lat(),
      longitude: mapsMouseEvent.latLng.lng()
    };

    let URL =
      "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
      mapsMouseEvent.latLng.lat() +
      "," +
      mapsMouseEvent.latLng.lng() +
      "&key=" +
      KEY;
    fetch(URL)
      .then(function(response) {
        // The API call was successful!
        return response.json();
      })
      .then(function(data) {
        // This is the JSON from our response
        address = data.results[0].formatted_address;

        console.log(address);
        document.querySelector("#preview").innerText = String(address);
        infoWindow.setContent(address);
        infoWindow.open(map);
      })
      .catch(function(err) {
        // There was an error
        console.warn("Something went wrong.", err);
      });
  });
}

function requestCreatePost({ text, address, coordinates }) {
  try {
    const url = new URL(`${ROOT}/api/post`);
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        text,
        address,
        ...coordinates
      }),
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.error("errorrrr");
        } else {
          console.log("success");
          window.location.href = "/";
        }
      })
      .catch(error => {
        console.error("catch");
        throw new Error(error);
      })
      .finally(() => {
        document.querySelector("#buttonSave").dataset.active = true;
      });
  } catch (e) {
    console.error(e);
  } finally {
    document.querySelector("#buttonSave").dataset.active = true;
  }
}
