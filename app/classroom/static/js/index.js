/*index.js*/

/**/


var PROTOCOL = window.location.protocol + "//";
var PORT = ":" + window.location.port;
var HOSTNAME = window.location.hostname;

var URL = PROTOCOL + HOSTNAME + PORT;

$(document).ready(function(){
  /*Inicialzando collapse button*/
  $(".button-collapse").sideNav();

  /*Habilitando modal*/
  $('.modal').modal();


  /*registrando-se em nova turma*/
  $("#btn-signup-in-class").click(function(event) {
    var classId = $("#modal-class-id").val();

    $.ajax({
      url: URL + "/classroom/classes/" + classId + "/invites/",
      type: "POST",
      success: function(event){
        window.location.replace(URL + "/classroom/");
      }
    });
  });

  $("#btn-create-class").click(function(event) {
    console.log(URL);

    var name = $("#name").val();
    var description = $("#description").val();

    $.ajax({
      url: URL + "/classroom/classes/",
      type: "POST",
      data: {name: name, description: description},
      success: function(data) {
        window.location.replace(URL + "/classroom/");
      }
    });
  });
});
