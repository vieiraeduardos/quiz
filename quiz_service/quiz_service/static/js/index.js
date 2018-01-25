/*index.js*/

/**/

$(document).ready(function(){
  /*Habilitando o uso de efeitos do Materialize nos selects*/
  $('select').material_select();

  /*Inicializando o botão collapse*/
  $(".button-collapse").sideNav();

  /*Inicializando os modais*/
  $('.modal-trigger').leanModal();

  /*Compartilhando teste*/
  function shareTest(test, email) {
    $.ajax({
      url: "http://127.0.0.1:5000/quiz_service/tests/" + test + "/people/",
      type: "PUT",
      data: {"test": test, "email": email},
      sucess: function(data) {
        console.log("Test " + test + "shared in " + Date())
      }
    });
  }

  /*Adicionando evento ao botão de compartilhar*/
  $("#btnShare").click(function(event) {
    var test = $("select#test").val()
    var email = $("#email").val();

    shareTest(test, email);
  });

  function loadTests() {
    $("#created_tests tr").each(function(index, element) {
      var test = $("#created_tests tr input").val();
      var name = $("#created_tests tr td:first a").text();

      var $option = $("<option />")
                      .attr("value", test)
                      .text(name)

      $("#test").append($option);

      /*Recarregando as configurações de efeitos do Materialize nos selects*/
      $("select").material_select();

    });
  }

  $("#call").click(function(event) {
    loadTests();
  });

  $(".btnAnswer").click(function(event) {
    var test = $(this).attr("value");

    $.ajax({
      url: "http://127.0.0.1:5000/quiz_service/tests/" + test + "/answers/",
      type: "GET",

    });
  });
});
