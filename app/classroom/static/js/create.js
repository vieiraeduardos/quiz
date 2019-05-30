/*create.js*/

/**/


var PROTOCOL = window.location.protocol + "//";
var PORT = ":" + window.location.port;
var HOSTNAME = window.location.hostname;

var URL = PROTOCOL + HOSTNAME + PORT;


$(document).ready(function() {
  /*Habilitando o uso de efeitos do Materialize nos selects*/
  $("select").material_select();

  /*Criando uma nova disciplina*/
  function createCourse(course) {
    $course = $("<option />").text(course["name"]).attr("value", course["_id"]);

    return $course;

  }

  /*Carregando disciplinas disponíveis no BD*/
  function loadCoursesForPainel() {
    $.ajax({
      url: URL + "/quiz/courses/",
      type: "GET",
      success: function(data) {
        $("#nq-course").empty();
        for(index in data) {
          $("#nq-course").append(createCourse(data[index]));
        }
        /*Recarregando as configurações de efeitos do Materialize nos selects*/
        $('select').material_select();
      }
    });

  }

  $("#btnCreate").click(function(event) {
    $.ajax({
      url: URL + "/quiz/courses/",
      type: "GET",
      success: function(data) {
        for(index in data) {
          $("#nq-course").append(createCourse(data[index]));
        }
        /*Recarregando as configurações de efeitos do Materialize nos selects*/
        $('select').material_select();
      }
    });

  });

  /*adicionando um novo campo de opção*/
  $("#btn-add-option").click(function(event) {

    var $option = $("<li />")
                    .append($("<input />")
                        .addClass("option")
                        .attr("type", "text"))
                    .append($("<a />")
                        .addClass("btn red waves-effect waves-light btn-remove-option")
                        .click(function(event) {
                          $(this).parent().remove();
                        })
                          .append($("<i />")
                            .addClass("material-icons")
                            .text("remove")));

    $("#options").append($option);
  });

  /*Criando um novo tópico*/
  function createTopic(topic) {
    $topic = $("<option />").text(topic["name"]).attr("value", topic["_id"]);

    return $topic;

  }

  /*Criando um novo opção*/
  function createOption(topic) {
    $topic = $("<option />").text(topic).attr("value", topic);

    return $topic;

  }

  /*Carregando tópicos quando disciplina selecionada*/
  $("#nq-course").change(function(event) {
    var course = $("select#nq-course").val();
    $("#nq-topic").empty(); /*apagando tópicos antigos*/

    $.ajax({
      url: URL + "/quiz/courses/" + course + "/topics/",
      type: "GET",
      success: function(data) {
        /*apagando disciplinas anteriores da tela*/
        $("#nq-topic").empty();

        for(index in data) {
          $("#nq-topic").append(createTopic(data[index]));
        }

        /*Recarregando as configurações de efeitos do Materialize nos selects*/
        $('select').material_select();
      }
    });
  });

  /*Criando uma nova questão*/
  function createQuestion(question) {
    /*Criando questões de resposta curta ou verdadeiro ou falso*/
    if(question["type"] == "shortAnswer" || question["type"] == "trueOrFalse") {
      $question = $("<li />")
                  .addClass("row")
                    .append($("<input />")
                      .attr("type", "hidden")
                      .attr("value", question["_id"]))
                    .append($("<p />")
                      .text(question["title"]))
                    .append($("<a />")
                        .addClass("btn red waves-effect waves-light")
                        .click(function(event) {
                          $(this).parent().remove();
                        })
                          .append($("<i />")
                            .addClass("material-icons")
                            .text("remove")));

    /*Criando questões de múltipla escolha*/
    } else {
      var $choices = $("<p />");

      $(question["choices"]).each(function(index, element){
        $choice = $("<p />")
                  .text(element);

        $choices.append($choice);

      });

      var $question = $("<li />")
                      .addClass("row")
                        .append($("<input />")
                          .attr("type", "hidden")
                          .attr("value", question["_id"]))
                        .append($("<p />")
                          .text(question["title"]))
                        .append($choices)
                        .append($("<a />")
                            .addClass("btn red waves-effect waves-light")
                            .click(function(event) {
                              $(this).parent().remove();
                            })
                              .append($("<i />")
                                .addClass("material-icons")
                                .text("remove")));
    }

    return $question
  }

  /*criando nova questão manualmente*/
  $("#btn-create-question").click(function(event) {
    var title = $("#nq-title").val();
    var topic = $("select#nq-topic").val();
    var type = $("select#nq-type").val();
    var level = $("#nq-level :checked").val();
    var correctAnswer = $(".option:first").val();
    var answers = [];
    var p = $("#nq-private").prop("checked")

    /*pegando as opções da questão*/
    $(".option").each(function(index, element) {
      answers.push($(this).val());

    });

    console.log(correctAnswer);

    $.ajax({
      url: URL + "/quiz/questions/",
      type: "POST",
      data: {private: p, title: title, type: type, level: level, topic: topic, correctAnswer: correctAnswer, answers: answers},
      success: function(data) {
          $("#questions-list").append(createQuestion(data))
      }
    });
  });
});
