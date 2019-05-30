/*signup.js*/

/**/


var PROTOCOL = window.location.protocol + "//";
var PORT = ":" + window.location.port;
var HOSTNAME = window.location.hostname;

var URL = PROTOCOL + HOSTNAME + PORT;


$(document).ready(function(){
  /* Inicialzando collapse button */
  $(".button-collapse").sideNav();

  $("#newPassword2").on("change", function(event) {
    var $p1 = $("#newPassword");

    if($p1.val() == $(this).val()) {
      $(this).css("border-bottom", "2px solid green");
      $("#password-error").css("font-weight", "bold").css("display", "block").css("color", "green").text("Tudo bem. Senhas combinam!")

    } else {
      $(this).css("border-bottom", "2px solid red");
      $("#password-error").css("font-weight", "bold").css("display", "block").css("color", "red").text("Ops! Senhas não combinam!")

    }
  });

});
