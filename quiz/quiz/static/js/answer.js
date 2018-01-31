/*answer.js*/

/**/


$(document).ready(function(){
  /*Habilitando o uso de efeitos do Materialize nos selects*/
  $('select').material_select();

  /*Inicializando o botão collapse*/
  $(".button-collapse").sideNav();

  /*respondendo o quiz*/
  function sendAnswer(test, answers) {
    $.ajax({
      url: "http://127.0.0.1:5000/quiz/tests/" + test + "/answers/",
      type: "POST",
      data: {answers: answers},
      success: function(data) {
        console.log("Test " + test + "answered in " + Date());
        window.location.replace("http://127.0.0.1:5000/quiz/");
      }
    });
  }

  /*adicionando evento ao botão de enviar resposta*/
  $("#btnAnswer").click(function(event) {
    var test = $("#test-id").val(); /*ID do quiz*/
    var answers = []; /*lista de repostas do quiz*/
    var type = $("#test-type").val();

    if(type == "shortAnswer") {
      /*pegando todas as repostas do quiz*/
      $(".answer").each(function(index, element) {
        answers.push($(this).val());

      });

    } else if(type == "trueOrFalse") {
      /*pegando todas as repostas do quiz*/
      $(".answer").each(function(index, element) {
        answers.push($(this).prop("checked"));
      });

    } else {
      /*multiple choice*/

      /*pegando todas as repostas do quiz*/
      $(".answer :checked").each(function(index, element) {
        answers.push($(this).val());

      });
    }

    sendAnswer(test, answers);
  });

});
