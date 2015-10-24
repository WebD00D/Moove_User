  Parse.initialize("JcVNtENTjHAn2pOrldHR7pnDj2dnaqzm5zhKxE37", "6qnbKsBLmRvpa6ksobU7NuYv2haPtzWVf8jzYs0c");

  var uberClientId = "KBm1CGJRwFYKVRefpb6TwmQ5f8jamppM";
  var uberServerToken = "isuO0uEgbauTgyUDh8-DxGTLmLBWoaEIAePdyIaE";

  // create placeholder variables
  var userLatitude,
      userLongitude;

(function($){
  $(function(){

     $('.button-collapse').sideNav();
     $('select').material_select();
      $('.modal-trigger').leanModal();

      }); // end of document ready
})(jQuery); // end of jQuery name space



function findByLocations(area){
  $(".destinations").empty();
  var Destinations = Parse.Object.extend("Destinations");
  var query = new Parse.Query(Destinations);
  query.equalTo("Area", area);
  query.limit(100);
  query.find({
  success: function(results) {
    alert(results.length);
    for (var i = 0; i < results.length; i++) {
    var object = results[i];
    var name = object.get('Name');
    DestinationID = object.id;

    var theNumber = GetLatestReviews(DestinationID);


    var reviewList =   " <li class='collection-item' style='text-align:justify;'><i class='fa fa-quote-left pink-text'></i> " +
    "     The ratio is on POINT! "+ theNumber +" Make the Moove doods! Like it is so awesome in here. Like so awesome. " +
    "     <Br> " +
    "  <small class='pink-text'>-- 5 min ago...</small> " +
    "   </li> "


    var content = "<div class='col s12 m6 l6'>" +
      " <div class='card-panel' style='background-color:#f5f5f5;padding:0px'>" +
      "  <span > " +
      "  <b style='color:#ED4877;padding-left:15px;font-size:x-large'>"+ name +"</b> " +
      "  <span class='right black-text' style='padding-left:15px;padding-right:15px;padding-top:7px;font-size:larger'> " + 46 + " <i class='fa fa-thumbs-o-down red-text'></i> </span> " +
      "  <span class='right' style='padding-top:7px;font-size:larger'> "+ 123 +" <i class='fa fa-thumbs-o-up green-text'></i> </span> " +
      " </span> " +

      " <ul class='collection' style='margin-top:0px;margin-bottom:0px'> " +
        reviewList +
      " </ul> " +

      " <div class='center-align' style='background-color:#eeeeee;padding-top:10px;padding-bottom:5px'> " +
      "   <img height='15px' src='http://uber-codes.com/images/SIGN-UP-HERE-FOR-UBER.png'> " +
      "   <Br> " +
      "   <span><span style='color:#22313f'><b>FAIR ESTIMATES</b></span></span> " +
      "   <br> " +
      "   <span style='font-size:larger'><span style='color:#ED4877'><i class='fa fa-usd'></i></span>16-34 <span style='color:#ED4877'><i  style='color:#ED4877' class='fa fa-clock-o'></i></span> 6 min</span> " +
      "  </div> " +
      " <div class='center-align  mademoove' style='background-color:#22313f;padding:10px;'> " +
      "    <a style='color:white'>Made the Moove?</a> " +
      " </div> " +
      " </div> " +
      " </div> " +

      $(content).appendTo(".destinations");

  }
 },
  error: function(error) {
  alert("Error: " + error.code + " " + error.message);
  }
});
}

function GetLatestReviews(DestinationID){
  var Review = Parse.Object.extend("Reviews");
  var query = new Parse.Query(Review);
  query.equalTo("DestinationID", DestinationID);
  query.find({
  success: function(results) {
    alert("Successfully retrieved " + results.length + " reviews.");
    // Do something with the returned Parse.Object values
    for (var i = 0; i < results.length; i++) {
      var object = results[i];
      return object;
    }
  },
  error: function(error) {
    alert("Error: " + error.code + " " + error.message);
  }
});
}





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
        console.log(shortest.estimate);

        if (typeof shortest != typeof undefined) {
          console.log("Updating time estimate...");
          console.log("IN " + Math.ceil(shortest.duration / 60.0) + " MIN");
        }
    }
  }
})
}



function GetCurrentLocation(){
  navigator.geolocation.watchPosition(function(position) {
      // Update latitude and longitude
      userLatitude = position.coords.latitude;
      userLongitude = position.coords.longitude;
      getEstimatesForUserLocation(userLatitude, userLongitude);
   });
}


$(".destinations").delegate(".mademoove","mouseover",function(){
  $(this).css("background-color","#2C3E50");
  $(this).css("cursor","pointer");
})
$(".destinations").delegate(".mademoove","mouseout",function(){
  $(this).css("background-color","#22313f");
})
$(".destinations").delegate(".mademoove","click",function(){
  $('#modal1').openModal();
})




$("#btnWhatstheMove").click(function(){
    selectedLocation = $("#ddlLocationSelect option:selected").val();
    window.location.href = "theMoove.html?location=" + selectedLocation;
})

$(".dontmove").click(function(e){
  e.preventDefault();
})
