/*users.js*/

/**/


var PROTOCOL = window.location.protocol + "//";
var PORT = ":" + window.location.port;
var HOSTNAME = window.location.hostname;

var URL = PROTOCOL + HOSTNAME + PORT;


$(document).ready(function(){
  /*Inicializando o botão collapse*/
  $(".button-collapse").sideNav();

  $("#newPassword2").on("change", function(event) {
    var $p1 = $("#newPassword");

    if($p1.val() == $(this).val()) {
      $(this).css("border-bottom", "1px solid green");
    } else {
      $(this).css("border-bottom", "1px solid red");
    }
  });


  $("#btnEditPI").click(function(event){
    var userId = $("#userId").val();
    var name = $("#name").val();
    var email = $("#email").val();

    $.ajax({
      url: URL + "/classroom/users/" + userId + "/",
      type: "PUT",
      data: {"name": name, "email": email},
      success: function(data) {
        window.location.replace(URL + "/classroom/");
      },
      error: function(data) {
        $("#email-error").css("display", "block").css("color", "red").text(data["responseText"]);
      }
    });
  });

  $("#btnUpdatePassword").click(function(event){
    userId = $("#userId").val();
    var currentPassword = $("#currentPassword").val();
    var p1 = $("#newPassword").val();
    var p2 = $("#newPassword2").val();

    if(p1 == p2) {
      $.ajax({
        url: URL + "/classroom/users/" + userId + "/password/",
        type: "PUT",
        data: {"currentPassword": currentPassword,"newPassword": p1},
        success: function(data) {
          window.location.replace(URL + "/classroom/");
        },
        error: function(data) {
          $("#password-error").css("display", "block").css("color", "red").text("Senha incorreta!");
        }
      });

    } else {
      $("#password-error").css("display", "block").css("color", "red").text("Senhas não são iguais!");

    }

  });

});
