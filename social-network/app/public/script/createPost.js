(function() {
  initialize();
})();

function initialize() {
  const button = document.querySelector("#buttonSave");
  button.onclick = () => {
    console.log("click");
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
        infoWindow.setContent(data.results[0].formatted_address);
        infoWindow.open(map);
      })
      .catch(function(err) {
        // There was an error
        console.warn("Something went wrong.", err);
      });
  });
}
