/*answer.js*/

/**/


$(document).ready(function(){
  /*Habilitando o uso de efeitos do Materialize nos selects*/
  $('select').material_select();

  /*Inicializando o botão collapse*/
  $(".button-collapse").sideNav();

  /*Inicializando os modais*/
  $('.modal-trigger').leanModal();

  /*adicionando evento ao botão de modal de edição*/
  $("#call").click(function(event) {
    var name = $("#name").text();
    var description = $("#description").text()

    $("#modal-test-name").attr("value", name);
    $("#modal-test-description").attr("value", description);

  });

  /*adicionando evento ao botão para salvar a edição*/
  $("#btnEditAndSave").click(function(event) {
    var test = $("#test-id").val();
    var name = $("#modal-test-name").val(); /*novo nome*/
    var description = $("#modal-test-description").val(); /*nova descrição*/

    $.ajax({
      url: "http://127.0.0.1:5000/quiz/tests/" + test + "/",
      type: "PUT",
      data: {name: name, description: description},
      success: function(data) {
        console.log("Test " + test + " updated in " + Date());
        window.location.replace("http://127.0.0.1:5000/quiz/tests/" + test + "/answers/");
      }
    });
  });

  /*Compartilhando teste*/
  function shareTest(test, email) {
    $.ajax({
      url: "http://127.0.0.1:5000/quiz/tests/" + test + "/people/",
      type: "PUT",
      data: {"test": test, "email": email},
      success: function(data) {
        console.log("Test " + test + "shared in " + Date());
        window.location.replace("http://127.0.0.1:5000/quiz/");

      }
    });
  }

  /*Adicionando evento ao botão de compartilhar*/
  $("#btnShare").click(function(event) {
    var test = $("#test-id").val()
    var email = $("#email").val();

    shareTest(test, email);
  });

});