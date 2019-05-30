/*edit-test.js*/

/**/


var PROTOCOL = window.location.protocol + "//";
var PORT = ":" + window.location.port;
var HOSTNAME = window.location.hostname;

var URL = PROTOCOL + HOSTNAME + PORT;


$(document).ready(function(){
  $("#btn-update-test").click(function(event){
    var testId = $("#test-id").val();

    var name = $("#name").val();
    var description = $("#description").val();
    var numAttempts = $("#num-attempts").val();
    var time = $("#time").val();
    var questions = [];

    $("#questions-list li input").each(function(index, element) {
      questions.push($(this).val());
    });

    $.ajax({
      url: URL + "/quiz/tests/" + testId + "/",
      type: "PUT",
      data: {"name": name, "description": description, "questions": questions, "ntime": time, "numAttempts": numAttempts},
      success: function(data) {
        window.location.replace(URL + "/classroom/quiz/");

      }
    });

  });
});
