/*index.js*/

/**/

$(document).ready(function(){
  /*Habilitando o uso de efeitos do Materialize nos selects*/
  $('select').material_select();

  /*Inicializando o botão collapse*/
  $(".button-collapse").sideNav();

  /*Inicializando os modais*/
  $('.modal-trigger').leanModal();

  $(".btnAnswer").click(function(event) {
    var test = $(this).attr("value");

    $.ajax({
      url: "http://127.0.0.1:5000/quiz_service/tests/" + test + "/answers/",
      type: "GET",

    });
  });
});
