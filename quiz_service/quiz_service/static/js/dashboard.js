/*dashboard.js*/

$(document).ready(function(){
  /*Salvando teste*/
  function saveTest(name, description, questions) {
      $.ajax({
        url: "http://127.0.0.1:5000/quiz_service/tests/",
        type: "POST",
        data: {"name": name, "description": description, "questions": questions},
        success: function(data) {
          console.log("Test saved!");
        }
      });
  }

  /*Adicionando evento para o botão de salvar teste*/
  $("#btnSave").click(function(event) {
    var name = $("#name").val();
    var description = $("#description").val();
    var questions = [];

    $("#questions-list li input").each(function(index, element) {
      questions.push($(this).val());
    });

    saveTest(name, description, questions);
  });
});
