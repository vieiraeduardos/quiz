/*topics.js*/

/*funções relacionadas a criação de tópicos*/


var PROTOCOL = window.location.protocol + "//";
var PORT = ":" + window.location.port;
var HOSTNAME = window.location.hostname;

var URL = PROTOCOL + HOSTNAME + PORT;

$(document).ready(function(){
  /*Recarregando as configurações de efeitos do Materialize nos selects*/
  $('select').material_select();


  /*criando um novo tópico*/
  $("#btn-create-topic").click(function(event){
    var name = $("#modal-topic-name").val();
    var courseId = $("#modal-topic-course :checked").val();

    $.ajax({
      url: URL + "/quiz/topics/",
      type: "POST",
      data: {"name": name, "courseId": courseId},
      success: function(data) {
        window.location.replace(URL + "/classroom/quiz/tests/");
      }
    });
  });

  /*carregando disciplinas para modal de criação de novo tópico*/
  $("#btn-call-modal-new-topic").click(function(event){
    $.ajax({
      url: URL + "/quiz/courses/",
      type: "GET",
      success: function(data) {
        $("#modal-topic-course").empty();

        for(index in data) {
          $("#modal-topic-course").append($("<option />").text(data[index]["name"]).attr("value", data[index]["_id"]));
        }
        /*Recarregando as configurações de efeitos do Materialize nos selects*/
        $('select').material_select();
      }
    });
  });
});
