  Parse.initialize("JcVNtENTjHAn2pOrldHR7pnDj2dnaqzm5zhKxE37", "6qnbKsBLmRvpa6ksobU7NuYv2haPtzWVf8jzYs0c");

  var uberClientId = "KBm1CGJRwFYKVRefpb6TwmQ5f8jamppM";
  var uberServerToken = "isuO0uEgbauTgyUDh8-DxGTLmLBWoaEIAePdyIaE";

  // create placeholder variables
  var userLatitude,
      userLongitude;

      //gettheLocation();

  var theLocation = url('?location');
  findByLocations(theLocation);

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
        $("#loadingMooves").hide();
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

    var resultObject = results[1];
    var selectedAreaName = resultObject.get('AreaDisplayName');
    $("#areaName").text(selectedAreaName);


    for (var i = 0; i < results.length; i++) {
    var object = results[i];
    var name = object.get('Name');
    var MooveCount = object.get('MooveCount');
    var MooveOnCount = object.get('MooveOnCount');
    var DestinationLatitude = object.get('Latitude');
    var DestinationLongitude = object.get('Longitude');
    var isMooveParnter = object.get('isMoovePartner');
    var promo;
    var theDateToday = new Date()
    var theday = theDateToday.getDay();
    switch(theday) {
    case 0:
        promo = object.get('sunday');
        break;
    case 1:
          promo = object.get('monday');
        break;
        case 2:
              promo = object.get('tuesday');
            break;
            case 3:
                  promo = object.get('wednesday');
                break;
                case 4:
                      promo = object.get('thursday');
                    break;
                    case 5:
                          promo = object.get('friday');
                        break;
                        case 6:
                              promo = object.get('saturday');
                            break;
                              default:
                                promo = object.get('theSpecial');
                                                    }
    var isPartnerIcon = "<i class='fa fa-star teal-text'></i> ";
    if (typeof promo === 'undefined' || promo === ''){
      promo = '...';
    }
    if (typeof isMooveParnter === 'undefined' || isMooveParnter == false){
     isPartnerIcon = '';
    }

    //TO DO: Get this data returned so we can parse through and set the html up
    //getEstimatesForUserLocation(userLatitude,userLongitude,DestinationLatitude,DestinationLongitude,object.id);

    LocalDestinations.push(object.id)


    if (typeof MooveCount === 'undefined' ){
      MooveCount = 0;
    }
    if (typeof MooveOnCount === 'undefined' ){
      MooveOnCount = 0;
    }

    var content = "<div data-address='"+ object.get('address') +"' data-name='"+ name +"' class='col s12 establishmentpanel' style='padding-left:0px;padding-right:0px'>" +

      " <div class='card-panel' style='background-color:#f5f5f5;padding:0px;margin:0px'>" +
        "<div style='min-height:200px;background-image:url("+ object.get('profilePic') +");background-size:cover;'>"+

        "<div class='white-text' style='padding:5px;background-color:rgba(01,01,01,0.7);font-size:large'>" +
         isPartnerIcon +"<b>"+ name +"</b>" +
         "  <span class='right black-text' style='padding-left:5px;padding-right:5px;padding-top:0px;'><span style='color:white' id="+ 'mooveon' + object.id +" > " + MooveOnCount + " </span><i class='fa fa-thumbs-o-down pink-text'></i> </span> " +
         "  <span class='right' style='padding-top:0px;'><span style='color:white' id="+ 'moove'+ object.id +"> "+ MooveCount +" </span><i class='fa fa-thumbs-o-up pink-text'></i> </span> " +
        "</div>" +

      "  </div>"+

      " <ul id="+ object.id +" class='collection' style='margin-top:0px;margin-bottom:0px'> </ul> " +

      " <div data-name='"+ name +"' data-objectid="+ object.id +" class='  mademoove' style='padding-top:7px;padding-bottom:7px;font-weight:200;background-color:rgba(33,33,33,1.0)'> " +
      "<label class='white-text ' style='font-size:17px;padding-left:10px'><i class='fa fa-bullhorn'></i><span style='padding-left:10px;'>"+ promo +"</span></label>" +

      " </div> " +
      " </div> " +
      " </div> " +

      $(content).appendTo(".destinations");


  }

    $("#loadingMooves").hide();
    LoadReviews();

 },
  error: function(error) {
  //alert("Error: " + error.code + " " + error.message);
  }

  });
}

  function refreshSingleView(location){

    //update new Counts
    getNewCounts(location);

    //clear out the reviews for the ul with the id of the moove made and pull in any new ones excluding the empties.
    var Review = Parse.Object.extend("Reviews");
    var query = new Parse.Query(Review);
    query.equalTo("DestinationID", location);
    query.descending("createdAt");
    query.limit(3);
    query.find({
    success: function(results) {

      if (results.length > 0){
        $("#"+location).empty();
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          var datetime = object.get('createdAt');

          var reviewYear = datetime.getFullYear();
          var reviewMonth = datetime.getMonth() + 1;
          var reviewDay = datetime.getDate();
          var reviewHours = datetime.getHours(); //returns 0-23
          var reviewMinutes = datetime.getMinutes(); //returns 0-59

          var today = new Date();
          var todaysYear = today.getFullYear();
          var todaysMonth = today.getMonth() +1;
          var todaysday = today.getDate();

          var currentTime = new Date(todaysYear + '/' + todaysMonth + '/' + todaysday + ' ' + today.getHours() + ':' + today.getMinutes());
        //  console.log(currentTime);
          var commentTime = new Date(reviewYear + '/' + reviewMonth + '/' + reviewDay + ' ' + reviewHours + ':' + reviewMinutes);
          var difference = currentTime.getTime() - commentTime.getTime(); // This will give difference in milliseconds

          var resultInMinutes = Math.round(difference / 60000);
        //  console.log('total minutes' + resultInMinutes);
        //  console.log('total hours' + Math.floor(resultInMinutes / 60));
        //  console.log('remaining minutes' +  resultInMinutes % 60);


          var totalhours = Math.floor( resultInMinutes / 60 );
          var remainingMinutes = resultInMinutes % 60


          if (totalhours === 0){
            if (remainingMinutes < 1){
              timetext = 'just now..' ;
            } else {
              if (remainingMinutes === 1){
               timetext = remainingMinutes + ' minute ago..' ;
             }
             else {
               timetext = remainingMinutes + ' minutes ago..' ;
             }
            }


          } else {

            if ( reviewMinutes === 0 ){
              if (totalhours === 1){
                timetext = totalhours + ' hour ago..';
              } else {
                timetext = totalhours + ' hours ago..';
              }

            } else {
              if (totalhours === 1){
                  if (remainingMinutes === 1){
                    timetext = totalhours + ' hour, ' + remainingMinutes + ' minute ago..';
                  } else {
                    timetext = totalhours + ' hour, ' + remainingMinutes + ' minutes ago..';
                  }

              } else {
                  timetext = totalhours + ' hours, ' + remainingMinutes + ' minutes ago..';
              }

            }
          }


          var listitem =  " <li class='collection-item' style='text-align:justify;'><i class='fa fa-quote-left pink-text'></i> " +
            object.get('Review') + ' ' +
           "     <Br> " +
           "  <small class='pink-text'> " + timetext + "</small> " +
           "   </li> "


           if (totalhours < 12){
             var theReview = object.get('Review');
             if (theReview != ''){
               $(listitem).appendTo("#"+location);
             }

           }


        }
      }


    },
    error:function(object,error){

    }});



  } // end refresh single view

  function getNewCounts(location){
    var Destinations = Parse.Object.extend("Destinations");
    var query = new Parse.Query(Destinations);
    query.get(location, {
   success: function(destination) {

     var MooveCount = destination.get('MooveCount');
     var MooveOnCount = destination.get('MooveOnCount');
     if (typeof MooveCount === 'undefined' ){
       MooveCount = 0;
     }
     if (typeof MooveOnCount === 'undefined' ){
       MooveOnCount = 0;
     }


     $("#moove"+location).text( MooveCount + " ");
     $("#mooveon"+location).text( MooveOnCount + " ");


   },
  error: function(object, error) {
    // The object was not retrieved successfully.
    // error is a Parse.Error with an error code and message.
  }
  });
  } // end get New Counts


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

        $("#"+theID).empty();

        if (results.length > 0){
          for (var i = 0; i < results.length; i++) {
            var object = results[i];
            var datetime = object.get('createdAt');

            var reviewYear = datetime.getFullYear();
            var reviewMonth = datetime.getMonth() + 1;
            var reviewDay = datetime.getDate();
            var reviewHours = datetime.getHours(); //returns 0-23
            var reviewMinutes = datetime.getMinutes(); //returns 0-59

            var today = new Date();
            var todaysYear = today.getFullYear();
            var todaysMonth = today.getMonth() +1;
            var todaysday = today.getDate();

            var currentTime = new Date(todaysYear + '/' + todaysMonth + '/' + todaysday + ' ' + today.getHours() + ':' + today.getMinutes());
          //  console.log(currentTime);
            var commentTime = new Date(reviewYear + '/' + reviewMonth + '/' + reviewDay + ' ' + reviewHours + ':' + reviewMinutes);
            var difference = currentTime.getTime() - commentTime.getTime(); // This will give difference in milliseconds

            var resultInMinutes = Math.round(difference / 60000);
          //  console.log('total minutes' + resultInMinutes);
          //  console.log('total hours' + Math.floor(resultInMinutes / 60));
          //  console.log('remaining minutes' +  resultInMinutes % 60);


            var totalhours = Math.floor( resultInMinutes / 60 );
            var remainingMinutes = resultInMinutes % 60


            if (totalhours === 0){
              if (remainingMinutes < 1){
                timetext = 'just now..' ;
              } else {
                if (remainingMinutes === 1){
                 timetext = remainingMinutes + ' minute ago..' ;
               }
               else {
                 timetext = remainingMinutes + ' minutes ago..' ;
               }
              }


            } else {

              if ( reviewMinutes === 0 ){
                if (totalhours === 1){
                  timetext = totalhours + ' hour ago..';
                } else {
                  timetext = totalhours + ' hours ago..';
                }

              } else {
                if (totalhours === 1){
                    if (remainingMinutes === 1){
                      timetext = totalhours + ' hour, ' + remainingMinutes + ' minute ago..';
                    } else {
                      timetext = totalhours + ' hour, ' + remainingMinutes + ' minutes ago..';
                    }

                } else {
                    timetext = totalhours + ' hours, ' + remainingMinutes + ' minutes ago..';
                }

              }
            }


            var listitem =  " <li class='collection-item' style='text-align:justify;'><i class='fa fa-quote-left pink-text'></i> " +
              object.get('Review') + ' ' +
             "     <Br> " +
             "  <small class='pink-text'> " + timetext + "</small> " +
             "   </li> "


             if (totalhours < 12){
               var theReview = object.get('Review');
               if (theReview != ''){
                 $(listitem).appendTo("#"+theID);
               }

             }


          }
        }

      },
      error: function(error) {
        //alert("Error: " + error.code + " " + error.message);
      }
    });

  });
  }

  function LoadUberFairs(){
    console.log("UBER ESTIMATES LENGTH: " +uberEstimates.length);
    for (var i = 0; i < uberEstimates.length; i++){
      var estimateID = uberEstimates[i][2];
      var timeID = uberEstimates[i][3];
      var theEstimate =  uberEstimates[i][0];
      var theTime = uberEstimates[i][1] ;
      console.log("TIMEID:" + timeID +"Time: " + theTime + " Estimate: " + theEstimate);
      $("#"+estimateID).text(theEstimate);
      $("#"+timeID).text(theTime);
    }

  } // end Load Uber Fairs




//https://api.uber.com/v1/estimates/price?start_latitude=37.625732&
//start_longitude=-122.377807&end_latitude=37.785114&end_longitude=-122.406677&server_token=isuO0uEgbauTgyUDh8-DxGTLmLBWoaEIAePdyIaE

function getEstimatesForUserLocation(latitude,longitude,endLatitude,endLongitude,obj) {

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

        var uberStuff = [shortest.estimate,shortest.duration / 60.0,"eUBER"+obj,"dUBER"+obj];
        //console.log(uberStuff);
        uberEstimates.push(uberStuff);

        var estimateID = "eUBER"+obj;
        var timeID = "dUBER"+obj;
        var theEstimate = shortest.estimate;
        var theTime = Math.ceil(shortest.duration / 60.0);
        $("#"+estimateID).text(theEstimate);
        $("#"+timeID).text(theTime + " min.");
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


//$(".destinations").delegate(".mademoove","mouseover",function(){
//  $(this).css("background-color","#2C3E50");
//  $(this).css("cursor","pointer");
//})
//$(".destinations").delegate(".mademoove","mouseout",function(){
//  $(this).css("background-color","#22313f");
//})
//$(".destinations").delegate(".mademoove","click",function(){
//  $('#modal1').openModal();
//  var location = $(this).attr('data-objectid');
//  $("#btnMooveOn").attr('data-objectid',location);
//  $("#btnMakeMooves").attr('data-objectid',location);
//  $("#mDestinationName").text($(this).attr('data-name'));
//})

var theReviewDate;

$("#btnMooveOn").click(function(e){
  $("#modaldiv").removeClass("red").addClass("teal");

  $("#modalMessage").text("Saving...");
  var canLeaveReview = false;
  e.preventDefault();
  if ($("#ddlLocalDestinations option:selected").text() === 'Select a destination'){
    $("#modaldiv").removeClass("teal").addClass("red");

    $("#modalMessage").text("Please select a location!");
    return;
  }
  var location = $(this).attr("data-objectid");
  var isParnter = $(this).attr("data-isMoovePartner");
  var currentUser = Parse.User.current();
  var pointsNeeded = $(this).attr("data-pointsNeeded");

  //check if user has left a review in the last 5 minutes at this location.
  //if so then, don't let them make a review.
  var Reviews = Parse.Object.extend("Reviews");
  var query = new Parse.Query(Reviews);
  query.equalTo("theUser", currentUser);
  query.equalTo("DestinationID", location);
  query.ascending("createdAt");
  query.find({
  success: function(results) {
    console.log(results.length);
    if (results.length > 0){
      // Do something with the returned Parse.Object values
      for (var i = 0; i < results.length; i++) {

        var object = results[i];
        var datetime = object.get('createdAt');

        var reviewYear = datetime.getFullYear();
        var reviewMonth = datetime.getMonth() + 1;
        var reviewDay = datetime.getDate();
        var reviewHours = datetime.getHours(); //returns 0-23
        var reviewMinutes = datetime.getMinutes(); //returns 0-59

        var today = new Date();
        var todaysYear = today.getFullYear();
        var todaysMonth = today.getMonth() +1;
        var todaysday = today.getDate();

        var currentTime = new Date(todaysYear + '/' + todaysMonth + '/' + todaysday + ' ' + today.getHours() + ':' + today.getMinutes());
        console.log('the current time is: ' + currentTime);
        var commentTime = new Date(reviewYear + '/' + reviewMonth + '/' + reviewDay + ' ' + reviewHours + ':' + reviewMinutes);
        var difference = currentTime.getTime() - commentTime.getTime(); // This will give difference in milliseconds

        var resultInMinutes = Math.round(difference / 60000);

        if (resultInMinutes <= 30){
          canLeaveReview = false;
        }else {
          canLeaveReview = true;
        }


      } //end for each review
    } else {
      canLeaveReview = true;
    }


    if (canLeaveReview == true){
      var review = $("#input_text").val();
      saveReview(location,review);
      incrementTotals("MooveOnCount",location);
      addPoints(location,isParnter,$("#ddlLocalDestinations option:selected").text(),pointsNeeded);
    } else {
      $("#modaldiv").removeClass("teal").addClass("red");
      //$("#modaldiv").addClass("lighten-2");
      $("#modalMessage").text("You just rated "+ $("#ddlLocalDestinations option:selected").text() + "!");
    }


  },
  error: function(error) {
    console.log("Error: " + error.code + " " + error.message);
  }
});




})



$("#btnMakeMooves").click(function(e){
  $("#modaldiv").removeClass("red").addClass("teal");
  // $("#modaldiv").removeClass("lighten-2");
  $("#modalMessage").text("Saving...");
  var canLeaveReview = false;
  e.preventDefault();
  if ($("#ddlLocalDestinations option:selected").text() === 'Select a destination'){
    $("#modaldiv").removeClass("teal").addClass("red");
    // $("#modaldiv").addClass("lighten-2");
    $("#modalMessage").text("Please select a location!");
    return;
  }
  var location = $(this).attr("data-objectid");
  var isParnter = $(this).attr("data-isMoovePartner");
  var currentUser = Parse.User.current();
  var pointsNeeded = $(this).attr("data-pointsNeeded");

  //check if user has left a review in the last 5 minutes at this location.
  //if so then, don't let them make a review.
  var Reviews = Parse.Object.extend("Reviews");
  var query = new Parse.Query(Reviews);
  query.equalTo("theUser", currentUser);
  query.equalTo("DestinationID", location);
  query.ascending("createdAt");
  query.find({
  success: function(results) {
    console.log(results.length);
    if (results.length > 0){
      // Do something with the returned Parse.Object values
      for (var i = 0; i < results.length; i++) {

        var object = results[i];
        var datetime = object.get('createdAt');

        var reviewYear = datetime.getFullYear();
        var reviewMonth = datetime.getMonth() + 1;
        var reviewDay = datetime.getDate();
        var reviewHours = datetime.getHours(); //returns 0-23
        var reviewMinutes = datetime.getMinutes(); //returns 0-59

        var today = new Date();
        var todaysYear = today.getFullYear();
        var todaysMonth = today.getMonth() +1;
        var todaysday = today.getDate();

        var currentTime = new Date(todaysYear + '/' + todaysMonth + '/' + todaysday + ' ' + today.getHours() + ':' + today.getMinutes());

        var commentTime = new Date(reviewYear + '/' + reviewMonth + '/' + reviewDay + ' ' + reviewHours + ':' + reviewMinutes);
        var difference = currentTime.getTime() - commentTime.getTime(); // This will give difference in milliseconds

        var resultInMinutes = Math.round(difference / 60000);


        if (resultInMinutes <= 30){
          canLeaveReview = false;
        }else {
          canLeaveReview = true;
        }


      } //end for each review
    } else {
      canLeaveReview = true;
    }


    if (canLeaveReview == true){
      var review = $("#input_text").val();

      saveReview(location,review);
      incrementTotals("MooveCount",location);
      addPoints(location,isParnter,$("#ddlLocalDestinations option:selected").text(),pointsNeeded);
    } else {
      $("#modaldiv").removeClass("teal").addClass("red");
      //$("#modaldiv").addClass("lighten-2");
      $("#modalMessage").text("You just rated "+ $("#ddlLocalDestinations option:selected").text() + "!");
    }


  },
  error: function(error) {
    console.log("Error: " + error.code + " " + error.message);
  }
});

})

function addPoints(destination,isPartner,establishment,pointsTheyNeed){

  var pointData;
  // check Moove Points to see if user can earn points at the location.
  if (isPartner === 'true'){
    // check to see if user has made moove to a location since monday.
    var currentUser = Parse.User.current();
    var weekStart,theUser,theDestination;
    var theDate = new Date(Date.parse("last sunday"));
    var MoovePoints = Parse.Object.extend("Points");
    var query = new Parse.Query(MoovePoints);
    query.equalTo("User", currentUser);
    query.equalTo("DestinationID", destination);

    query.greaterThanOrEqualTo("startedOn", theDate);

    query.find({
      success: function(results) {

        pointData = results[0];

        if (results.length < 1){
          //create new record and add point

          var Points = Parse.Object.extend("Points");
          var points = new Points();

          points.set("User", currentUser);
          points.set("DestinationID", destination);
          points.set("Points", 1);
          points.set("rewardEarned", false);
          points.set("isClaimed", false);
          points.set("startedOn", theDate);

          points.save(null, {
            success: function(points) {
              swal({
                confirmButtonColor: "#009688",
                title: "+1 Point Earned!",
                text: "You've earned 1 point at " + establishment + "!",
                type: "success"
              })

            },
            error: function(points, error) {
              console.log('Failed to create new object, with error code: ' + error.message);
            }
          }); // end save


        } else {

          //TODO: update points
          // but before we update, lets compare their point threshhold to see  if the user
          // has earned anything.

          //use pointsTheyNeed variable as the establishments required points.
          var pointsTheyHave = pointData.get('Points');

          var titleMessage = '';
          var confirmMessage = '';
          var rewardEarned = false;

          if (pointsTheyHave + 1 == pointsTheyNeed){
            titleMessage = 'Hurray!'
            confirmMessage = "You've just earned a reward at ";
            rewardEarned = true;
          } else {
            titleMessage = '+1 Point Earned!'
            confirmMessage = "You've earned another point at ";
          }


          // find out how many points the user currently has there.
          // if less than points they need update. but if after update points are the amount they need show notification that
          // they earned something.

          // if not, then simply update the amount of points and tell how many more they have to go.

          //will need to change out the message text, if they have earned a reward or not. and if they have
          // earned a reward,use rewardEarned variable to update. When we pull rewards we will look for the Date
          // and the flag of rewardEarned set to true.


          var message = '';

          var isRewardClaimed = pointData.get('isClaimed');
          if (isRewardClaimed){

              message = "Thanks for making all the mooves you have at " + establishment + "!  Start again next Monday to earn another reward!";
          } else {

            message = "Did you know you have a reward for " + establishment + " waiting to be used? Hurry and use it before it expires on Monday!"
          }

          if (pointsTheyHave == pointsTheyNeed){
            //they've already earned the reward, so no need to update anything. Maybe just let them know they
            //can't earn any more points until they redeem their current reward.
            swal({
              confirmButtonColor: "#009688",
              title: "Moove Made!",
              text: message,
              type: "success"
            })
            return;
          }


          var PointSystem = Parse.Object.extend("Points");
          var pointsystem = new PointSystem();
              pointsystem.id = pointData.id;
              pointsystem.increment("Points");
              pointsystem.set("rewardEarned",rewardEarned);
              pointsystem.save();
              swal({
                confirmButtonColor: "#009688",
                title: titleMessage,
                text: confirmMessage + ' ' + establishment + "!",
                type: "success"
              })

        }

      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });

  } else{

  }// end check if moove partner is true
} // end addPoints fucnction


function saveReview(destination,reviewz){
var currentUser = Parse.User.current();
var currentdate = new Date();
var datetime = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();

  var Review = Parse.Object.extend("Reviews");
  var review = new Review();

  review.save({
  DestinationID: destination,
  theUser:currentUser,
  Review: reviewz,



}, {
  success: function(review) {
    console.log("success!");
    $("#input_text").val('');

  },
  error: function(review, error) {
    console.log("failed:" + error.message);
    // The save failed.
    // error is a Parse.Error with an error code and message.
  //  alert(error.message);
  }
});

}

function incrementTotals(Kind,LocationID){
$("#modalMessage").text("Moove made!");
var Destinations = Parse.Object.extend("Destinations");
var destinations = new Destinations();
    destinations.id = LocationID;
    destinations.increment(Kind);
    destinations.save();
    refreshSingleView(LocationID);
}



$(".dontmove").click(function(e){
  e.preventDefault();
})
