/*answer.js*/

/**/

var PROTOCOL = window.location.protocol + "//";
var PORT = ":" + window.location.port;
var HOSTNAME = window.location.hostname;

var URL = PROTOCOL + HOSTNAME + PORT;

$(document).ready(function(){
  /*Habilitando o uso de efeitos do Materialize nos selects*/
  $('select').material_select();

  /*Inicializando o botão collapse*/
  $(".button-collapse").sideNav();

  var c = $("#test-time").val() * 60;
  var t;
  var timer_is_on = 0;

  function timedCount() {
    $("#time").text(c);
    c = c - 1;

    if(c == 0) {
      window.location.replace(URL + "/classroom/");
    }

    t = setTimeout(function(){
      timedCount()
    }, 1000);
  }

  function startCount() {
      if (!timer_is_on) {
          timer_is_on = 1;
          timedCount();
      }
  }

  startCount();


  /*respondendo o quiz*/
  function sendAnswer(test, answers, values) {

    $.ajax({
      url: URL + "/quiz/tests/" + test + "/answers/",
      type: "POST",
      data: {answers: answers, values: values},
      success: function(data) {
        console.log("Test " + test + "answered in " + Date());
        window.location.replace(URL + "/classroom/");
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

    sendAnswer(test, answers, values);
  });
});
