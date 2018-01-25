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
      url: "http://127.0.0.1:5000/quiz_service/tests/" + test + "/answers/",
      type: "POST",
      data: {answers: answers}
    });
  }

  /*adicionando evento ao botão de enviar resposta*/
  $("#btnAnswer").click(function(event) {
    var test = $("#test-id").val(); /*ID do quiz*/
    var answers = []; /*lista de repostas do quiz*/

    /*pegando todas as repostas do quiz*/
    $(".answer").each(function(index, element) {
      answers.push($(this).val());
    });

    sendAnswer(test, answers);
  });

});
