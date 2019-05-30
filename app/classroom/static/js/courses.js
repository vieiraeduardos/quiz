/*courses.js*/

/*funções referentes a criação de disciplinas*/


var PROTOCOL = window.location.protocol + "//";
var PORT = ":" + window.location.port;
var HOSTNAME = window.location.hostname;

var URL = PROTOCOL + HOSTNAME + PORT;

$(document).ready(function(){
  /*criando uma nova disciplina*/
  $("#btn-create-course").click(function(event){
    var name = $("#modal-course-name").val();

    $.ajax({
      url: URL + "/quiz/courses/",
      type: "POST",
      data: {"name": name},
      success: function(data) {
        window.location.replace(URL + "/classroom/quiz/tests/");
      }
    });
  });
});
