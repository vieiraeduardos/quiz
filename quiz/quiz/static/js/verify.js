/*answer.js*/

/**/


$(document).ready(function(){
  /*Habilitando o uso de efeitos do Materialize nos selects*/
  $('select').material_select();

  /*Inicializando o botão collapse*/
  $(".button-collapse").sideNav();

  /*Inicializando os modais*/
  $('.modal-trigger').leanModal();

  /*adicionando um novo campo de opção*/
  $("#btn-add-option").click(function(event) {
    var $option = $("<li />")
                    .append($("<input />")
                        .addClass("option")
                        .attr("value", "")
                        .attr("type", "text"))
                    .append($("<a />")
                        .addClass("btn btn-remove-option")
                        .text("Remover Opção")
                        .click(function(event) {
                          $(this).parent().remove();
                        })
                          .append($("<i />")
                            .addClass("material-icons right")
                            .text("remove")));

    $("#options").append($option);
  });

  /*salvando questão editada*/
  $("#btn-save-question").click(function(event){
    var testId = $("#test-id").val();
    var questionId = $("#modal-question-id").val();
    var title = $("#modal-question-title").val();
    var correctAnswer = $(".option:first").val();
    var choices = [];

    /*pegando as opções da questão*/
    $(".option").each(function(index, element) {
      choices.push($(this).val());
    });

    $.ajax({
      url: "http://127.0.0.1:5000/quiz/questions/" + questionId + "/",
      type: "PUT",
      data: {
        "title": title,
        "correctAnswer": correctAnswer,
        "choices": choices
      },
      success: function(data) {
          window.location.replace("http://127.0.0.1:5000/quiz/tests/" + testId + "/answers/");
      }
    });

  });

  /*carregando questão para editar*/
  $(".btn-call-modal-edit-question").click(function(event){
    var questionId = $(this).siblings(".question-id").val();

    $.ajax({
      url: "http://127.0.0.1:5000/quiz/questions/" + questionId + "/",
      type: "GET",
      success: function(data) {

        $("#modal-question-id").val(data["_id"]);
        $("#modal-question-title").val(data["title"]);

        if(data["type"] == "multipleChoice") {
          $("#options").empty();

          $(data["choices"]).each(function(index, element) {
            var $choice = $("<li />")
                            .append($("<input />")
                                .addClass("option")
                                .attr("value", element)
                                .attr("type", "text"))
                            .append($("<a />")
                                .addClass("btn btn-remove-option")
                                .text("Remover")
                                .click(function(event) {
                                  $(this).parent().remove();
                                })
                                  .append($("<i />")
                                    .addClass("material-icons right")
                                    .text("remove")));

            $("#options").append($choice);
          });
        }
      }
    });
  });

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
