var uberClientId = "KBm1CGJRwFYKVRefpb6TwmQ5f8jamppM";
var uberServerToken = "isuO0uEgbauTgyUDh8-DxGTLmLBWoaEIAePdyIaE";

(function($){
  $(function(){

    $('.button-collapse').sideNav();
     $('select').material_select();

     alert(uberClientId);

     // create placeholder variables
     var userLatitude
       , userLongitude;
       , timer;





     navigator.geolocation.watchPosition(function(position) {
         // Update latitude and longitude
         userLatitude = position.coords.latitude;
         userLongitude = position.coords.longitude;
         // Query Uber API if needed

        // Create timer if needed
        // Once initialized, it will fire every 60 seconds as recommended by the Uber API
        // We only create the timer after we've gotten the user's location for the first time
        if (typeof timer === typeof undefined) {
          timer = setInterval(function() {
            getEstimatesForUserLocation(userLatitude, userLongitude);
          }, 60000);

          // Query Uber API if needed
          getEstimatesForUserLocation(userLatitude, userLongitude);

     });


  }); // end of document ready
})(jQuery); // end of jQuery name space

var partyLatitude = 37.5553965;
var partyLongitude = -77.4870686;

//https://api.uber.com/v1/estimates/price?start_latitude=37.625732&
//start_longitude=-122.377807&end_latitude=37.785114&end_longitude=-122.406677&server_token=isuO0uEgbauTgyUDh8-DxGTLmLBWoaEIAePdyIaE

function getEstimatesForUserLocation(latitude,longitude) {
  $.ajax({
    url: "https://api.uber.com/v1/estimates/price",
    headers: {
        Authorization: "Token " + uberServerToken
    },
    data: {
      start_latitude: latitude,
      start_longitude: longitude,
      end_latitude: partyLatitude,
      end_longitude: partyLongitude
    },
    success: function(result) {
      console.log(result);
      var data = result["prices"];
      if (typeof data != typeof undefined) {
        // Sort Uber products by time to the user's location
        data.sort(function(t0, t1) {
        return t0.duration - t1.duration;
        });

        // Update the Uber button with the shortest time
        var shortest = data[0];

        if (typeof shortest != typeof undefined) {
          console.log("Updating time estimate...");
          console.log("IN " + Math.ceil(shortest.duration / 60.0) + " MIN");
        }
    }
  });
}









$("#btnSignIn").click(function(){
  window.location.href = "Location.html";
})

$("#btnWhatstheMove").click(function(){
    window.location.href = "theMoove.html";
})

$(".dontmove").click(function(e){
  e.preventDefault();
})
