(function($){
  $(function(){

    $('.button-collapse').sideNav();
     $('select').material_select();

  }); // end of document ready
})(jQuery); // end of jQuery name space




$("#btnSignIn").click(function(){
  window.location.href = "Location.html";
})

$("#btnWhatstheMove").click(function(){
    window.location.href = "theMoove.html";
})

$(".dontmove").click(function(e){
  e.preventDefault();
})
