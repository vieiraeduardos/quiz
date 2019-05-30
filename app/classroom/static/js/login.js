/*login.js*/

/**/


var PROTOCOL = window.location.protocol + "//";
var PORT = ":" + window.location.port;
var HOSTNAME = window.location.hostname;


var URL = PROTOCOL + HOSTNAME + PORT;

$(document).ready(function(){
  /* Inicialzando collapse button */
  $(".button-collapse").sideNav();

});
