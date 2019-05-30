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

  /*Habilitando modal*/
  $('.modal').modal();
  
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
    var p = $("#nq-private").prop("checked")

    /*pegando as opções da questão*/
    $(".option").each(function(index, element) {
      choices.push($(this).val());
    });

    $.ajax({
      url: URL + "/quiz/questions/" + questionId + "/",
      type: "PUT",
      data: {
        "title": title,
        "correctAnswer": correctAnswer,
        "choices": choices,
        "private": p
      },
      success: function(data) {
          window.location.replace(URL + "/classroom/quiz/tests/" + testId + "/answers/");
      }
    });

  });

  /*carregando questão para editar*/
  $(".btn-call-modal-edit-question").click(function(event){
    var questionId = $(this).siblings(".question-id").val();

    $.ajax({
      url: URL + "/quiz/questions/" + questionId + "/",
      type: "GET",
      success: function(data) {

        $("#modal-question-id").val(data["_id"]);
        $("#modal-question-title").val(data["title"]);

        if(data["type"] == "multipleChoice" || data["type"] == "trueOrFalse") {
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
        } else {
          $("#options").empty();

          var $choice = $("<li />")
                          .append($("<input />")
                              .addClass("option")
                              .attr("value", data["correctAnswer"])
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
        }
      }
    });
  });

  /*Apagando teste*/
  $("#btn-remove-test").click(function(event){
    var testId = $("#test-id").val();

    $.ajax({
      url: URL + "/quiz/tests/" + testId + "/",
      type: "DELETE",
      success: function(data) {
        window.location.replace(URL + "/classroom/quiz/");
      }
    });
  });

  /*carregando turmas para compartilhar teste*/
  $("#btn-share-test").click(function(event) {
    $.ajax({
      url: URL + "/quiz/classes/",
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
      url: URL + "/quiz/tests/" + test + "/",
      type: "PUT",
      data: {name: name, description: description},
      success: function(data) {
        console.log("Test " + test + " updated in " + Date());
        window.location.replace(URL + "/classroom/quiz/");
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
      url: URL + "/quiz/tests/" + test + "/classes/",
      type: "PUT",
      data: {"test": test, "classe": classe, "title": title, "description": description, "deadline": deadline},
      success: function(data) {
        console.log("Test " + test + "shared in " + Date());
        window.location.replace(URL + "/classroom/quiz/tests/" + test + "/answers/");

      }
    });
  });

});
