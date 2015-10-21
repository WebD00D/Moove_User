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

     navigator.geolocation.watchPosition(function(position) {
         // Update latitude and longitude
         userLatitude = position.coords.latitude;
         userLongitude = position.coords.longitude;
         // Query Uber API if needed
         getEstimatesForUserLocation(userLatitude, userLongitude);
     });


  }); // end of document ready
})(jQuery); // end of jQuery name space

var partyLatitude = 37.5553965;
var partyLongitude = -77.4870686;



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
