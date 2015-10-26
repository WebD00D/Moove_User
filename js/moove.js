  Parse.initialize("JcVNtENTjHAn2pOrldHR7pnDj2dnaqzm5zhKxE37", "6qnbKsBLmRvpa6ksobU7NuYv2haPtzWVf8jzYs0c");

  var uberClientId = "KBm1CGJRwFYKVRefpb6TwmQ5f8jamppM";
  var uberServerToken = "isuO0uEgbauTgyUDh8-DxGTLmLBWoaEIAePdyIaE";

  // create placeholder variables
  var userLatitude,
      userLongitude;

      gettheLocation();


  var theLocation = url('?location');


(function($){
  $(function(){
     $('.button-collapse').sideNav();
      $('.parallax').parallax();
     $('select').material_select();
      $('.modal-trigger').leanModal();

      }); // end of document ready
})(jQuery); // end of jQuery name space




function gettheLocation(){

  navigator.geolocation.watchPosition(function(position) {
    // Update latitude and longitude
    userLatitude = position.coords.latitude;
    userLongitude = position.coords.longitude;
  });

  if(typeof userLatitude === 'undefined' || typeof userLongitude === 'undefined') {
     console.log('waiting for location');
     setTimeout(function(){ gettheLocation(); }, 500); // Try to submit form after timeout
     return false;
   } else {
     // Continue with location found...
        console.log('found the location: ' + userLatitude + ' ,' + userLongitude);
        findByLocations(theLocation);
   }
}


var LocalDestinations = [];
var uberEstimates = [];

function findByLocations(area){
  $(".destinations").empty();
  var Destinations = Parse.Object.extend("Destinations");
  var query = new Parse.Query(Destinations);
  query.equalTo("Area", area);
  query.descending("MooveCount");
  query.find({
  success: function(results) {

    for (var i = 0; i < results.length; i++) {
    var object = results[i];
    var name = object.get('Name');
    var MooveCount = object.get('MooveCount');
    var MooveOnCount = object.get('MooveOnCount');
    var DestinationLatitude = object.get('Latitude');
    var DestinationLongitude = object.get('Longitude');

    console.log("DESTINATION " + DestinationLatitude + ' ' + DestinationLongitude);
    console.log("USER " + userLatitude + ' ' + userLongitude);

    //TO DO: Get this data returned so we can parse through and set the html up
    getEstimatesForUserLocation(userLatitude,userLongitude,DestinationLatitude,DestinationLongitude);

    LocalDestinations.push(object.id)


    if (typeof MooveCount === 'undefined' ){
      MooveCount = 0;
    }
    if (typeof MooveOnCount === 'undefined' ){
      MooveOnCount = 0;
    }



    var content = "<div class='col s12 m6 l6'>" +
      " <div class='card-panel' style='background-color:#f5f5f5;padding:0px'>" +
      "  <span > " +
      "  <b style='color:#ED4877;padding-left:15px;font-size:x-large'>"+ name +"</b> " +
      "  <span class='right black-text' style='padding-left:15px;padding-right:15px;padding-top:7px;font-size:larger'> " + MooveOnCount + " <i class='fa fa-thumbs-o-down red-text'></i> </span> " +
      "  <span class='right' style='padding-top:7px;font-size:larger'> "+ MooveCount +" <i class='fa fa-thumbs-o-up green-text'></i> </span> " +
      " </span> " +

      " <ul id="+ object.id +" class='collection' style='margin-top:0px;margin-bottom:0px'> </ul> " +

      " <div class='center-align' style='background-color:#eeeeee;padding-top:10px;padding-bottom:5px'> " +
      "   <img height='15px' src='http://uber-codes.com/images/SIGN-UP-HERE-FOR-UBER.png'> " +
      "   <Br> " +
      "   <span><span style='color:#22313f'><b>FAIR ESTIMATES</b></span></span> " +
      "   <br> " +
      "   <span style='font-size:larger'><span style='color:#ED4877'><i class='fa fa-usd'></i></span>16-34 <span style='color:#ED4877'><i  style='color:#ED4877' class='fa fa-clock-o'></i></span> 6 min</span> " +
      "  </div> " +
      " <div data-name='"+ name +"' data-objectid="+ object.id +" class='center-align  mademoove' style='background-color:#22313f;padding:10px;'> " +
      "    <a  style='color:white'>Made the Moove?</a> " +
      " </div> " +
      " </div> " +
      " </div> " +

      $(content).appendTo(".destinations");

  }

    LoadReviews();
    LoadUberFairs();

 },
  error: function(error) {
  alert("Error: " + error.code + " " + error.message);
  }


  });


}


  function LoadUberFairs(){
    console.log("UBER ESTIMATES ARRAY " + uberEstimates);
  }



  function LoadReviews(){

    $.each(LocalDestinations, function( index, value ) {
      var theID = LocalDestinations[index];

      var Review = Parse.Object.extend("Reviews");
      var query = new Parse.Query(Review);
      query.equalTo("DestinationID", theID);
      query.descending("createdAt");
      query.limit(3);
      query.find({
      success: function(results) {
        if (results.length > 0){
          for (var i = 0; i < results.length; i++) {
            var object = results[i];
            var listitem =  " <li class='collection-item' style='text-align:justify;'><i class='fa fa-quote-left pink-text'></i> " +
              object.get('Review') + ' ' +
             "     <Br> " +
             "  <small class='pink-text'>-- 5 min ago...</small> " +
             "   </li> "
            $(listitem).appendTo("#"+theID);
          }

        }

      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });



  });

  }







//https://api.uber.com/v1/estimates/price?start_latitude=37.625732&
//start_longitude=-122.377807&end_latitude=37.785114&end_longitude=-122.406677&server_token=isuO0uEgbauTgyUDh8-DxGTLmLBWoaEIAePdyIaE

function getEstimatesForUserLocation(latitude,longitude,endLatitude,endLongitude) {
  $.ajax({
    url: "https://api.uber.com/v1/estimates/price",
    headers: {
        Authorization: "Token " + uberServerToken
    },
    data: {
      start_latitude: latitude,
      start_longitude: longitude,
      end_latitude: endLatitude,
      end_longitude: endLongitude
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

          console.log("IN " + Math.ceil(shortest.duration / 60.0) + " MIN");
        }

        var uberStuff = [shortest.estimate,shortest.duration / 60.0];
        uberEstimates.push(uberStuff);
        //console.log("Logging Returned UBER Data " + data[0]);
    }
  }
})
}



function GetCurrentLocation(latEnd, longEnd){
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
  var location = $(this).attr('data-objectid');
  $("#btnMooveOn").attr('data-objectid',location);
  $("#btnMakeMooves").attr('data-objectid',location);
  $("#mDestinationName").text($(this).attr('data-name'));
})



$("#btnMooveOn").click(function(e){
  e.preventDefault()
  var location = $(this).attr("data-objectid");
  //need to save a the review if its not empty, and has met the length requirements.
  var review = $("#input_text").val();
  if (review.length > 0){
    if (review.length > 60){
      return
    } else {
      //save the review to the database.
      saveReview(location,review);
    }
  }
  // if no review , then just need to update the counter for Moove On
  // Refresh to show the data.
  incrementTotals("MooveOnCount",location);


})

$("#btnMakeMooves").click(function(e){
  e.preventDefault();
  var location = $(this).attr("data-objectid");
  var review = $("#input_text").val();
  if (review.length > 0){
    if (review.length > 60){
      return
    } else {
      //save the review to the database.
      saveReview(location,review);
    }
  }
  incrementTotals("MooveCount",location);

})

function saveReview(destination,reviewz){

var currentdate = new Date();
var datetime = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();

  //var Review = Parse.Object.extend("Reviews");
  //var review = new Review();
  //review.set("DestinationID", destination);
  //review.set("Review", review);
  //review.save("ReviewTime",datetime);

  var GameScore = Parse.Object.extend("Reviews");
  var gameScore = new GameScore();

  gameScore.save({
  DestinationID: destination,
  Review: reviewz,


}, {
  success: function(gameScore) {
    // The object was saved successfully.
  },
  error: function(gameScore, error) {
    // The save failed.
    // error is a Parse.Error with an error code and message.
    console.log(error.message);
  }
});



}

function incrementTotals(Kind,LocationID){

var Destinations = Parse.Object.extend("Destinations");
var destinations = new Destinations();
destinations.id = LocationID;
destinations.increment(Kind);
destinations.save();
refreshAfterReview();

}


function refreshAfterReview(){
  location.reload(true);
}


$("#btnWhatstheMove").click(function(){
    selectedLocation = $("#ddlLocationSelect option:selected").val();
    window.location.href = "theMoove.html?location=" + selectedLocation;
})

$(".dontmove").click(function(e){
  e.preventDefault();
})
