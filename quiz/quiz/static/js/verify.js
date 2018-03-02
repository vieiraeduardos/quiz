/*answer.js*/

/**/


$(document).ready(function(){
  /*Habilitando o uso de efeitos do Materialize nos selects*/
  $('select').material_select();

  /*Inicializando o botão collapse*/
  $(".button-collapse").sideNav();

  /*Inicializando os modais*/
  $('.modal-trigger').leanModal();

  /*Apagando teste*/
  $("#btn-remove-test").click(function(event){
    var testId = $("#test-id").val();

    $.ajax({
      url: "http://127.0.0.1:5000/quiz/tests/" + testId + "/",
      type: "DELETE",
      success: function(data) {
        window.location.replace("http://127.0.0.1:5000/quiz/");
      }
    });
  });

  /*carregando turmas para compartilhar teste*/
  $("#btn-share-test").click(function(event) {
    $.ajax({
      url: "http://127.0.0.1:5000/quiz/classes/",
      type: "GET",
      success: function(data) {
        for(index in data) {
          $("#class").append($("<option />").text(data[index]["name"]).attr("value", data[index]["_id"]));
        }

        /*Habilitando o uso de efeitos do Materialize nos selects*/
        $('select').material_select();
      }
    });
  });

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


  /*Adicionando evento ao botão de compartilhar*/
  $("#btnShare").click(function(event) {
    var test = $("#test-id").val()
    var classe = $("#class :checked").val();
    var title = $("#task-title").val();
    var description = $("#task-description").val();
    var deadline = $("#deadline").val();

    $.ajax({
      url: "http://127.0.0.1:5000/quiz/tests/" + test + "/classes/",
      type: "PUT",
      data: {"test": test, "classe": classe, "title": title, "description": description, "deadline": deadline},
      success: function(data) {
        console.log("Test " + test + "shared in " + Date());
        window.location.replace("http://127.0.0.1:5000/quiz/tests/" + test + "/answers/");

      }
    });
  });

});
