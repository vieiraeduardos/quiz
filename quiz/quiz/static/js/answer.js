/*answer.js*/

/**/


$(document).ready(function(){
  /*Habilitando o uso de efeitos do Materialize nos selects*/
  $('select').material_select();

  /*Inicializando o botão collapse*/
  $(".button-collapse").sideNav();

  /*respondendo o quiz*/
  function sendAnswer(test, answers, values) {

    $.ajax({
      url: "http://127.0.0.1:5000/quiz/tests/" + test + "/answers/",
      type: "POST",
      data: {answers: answers, values: values},
      success: function(data) {
        console.log("Test " + test + "answered in " + Date());
        window.location.replace("http://127.0.0.1:5000/quiz/");
      }
    });
  }

  /*adicionando evento ao botão de enviar resposta*/
  $("#btnAnswer").click(function(event) {
    var test = $("#test-id").val(); /*ID do quiz*/
    var values = []; /*lista dos valores do ID de cada resposta*/
    var answers = [];
    /*pegando respostas curtas*/
    $(".question").each(function(index, element){
      var resposta = $(this).children(".answer").val();

      if(resposta) {
        var resposta_id = $(this).children(".id").val();
        answers.push(resposta);
        values.push(resposta_id);
      }
    });

    /*pegando respostas de verdadeiro ou falso*/
    $(".answer").each(function(index, element) {
      var resposta = $(this).prop("checked");

      if(resposta == true || resposta == false) {
        var resposta_id = $(this).parent().parent().siblings(".id").val();
        answers.push(resposta);
        values.push(resposta_id);
      }
    });

    /*pegando respostas de múltipla escolha*/
    $(".answer :checked").each(function(index, element) {
      var resposta = $(this).val();

      if(resposta) {
        var resposta_id = $(this).parent().parent().siblings(".id").val();
        answers.push(resposta);
        values.push(resposta_id);
      }
    });

    console.log(answers);

    sendAnswer(test, answers, values);
  });
});
