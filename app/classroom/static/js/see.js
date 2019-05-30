/*see.js*/

/**/


var PROTOCOL = window.location.protocol + "//";
var PORT = ":" + window.location.port;
var HOSTNAME = window.location.hostname;

var URL = PROTOCOL + HOSTNAME + PORT;


$(document).ready(function() {
  $('.tabs').tabs();

  /*Inicializando o botão collapse*/
  $(".button-collapse").sideNav();

  /*atualizando a nota da resposta*/
  function updateGrade(answer, grade) {
    var testId = $("#test-id").val();

    $.ajax({
      url: URL + "/quiz/answers/" + answer + "/",
      type: "PUT",
      data: {grade: grade},
      success: function(data) {
        console.log("Test's grade " + test + "updated in " + Date());
        window.location.replace(URL + "/classroom/quiz/tests/" + testId + "/answers/");
      }
    });
  }

  /*adicionando evento no botão de atualizar a nota*/
  $("#btnUpdateGrade").click(function(event) {
    var answer = $("#answer-id").val();
    var grade = $("#grade").val();
    updateGrade(answer, grade);
  });
});
