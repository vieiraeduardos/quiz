/*create.js*/

/**/

$(document).ready(function() {
  /*Habilitando o uso de efeitos do Materialize nos selects*/
  $("select").material_select();

  /*Inicializando os modais*/
  $(".modal-trigger").leanModal();

  /*Criando uma nova disciplina*/
  function createCourse(course) {
    $course = $("<option />").text(course["name"]).attr("value", course["_id"]);

    return $course;

  }

  /*Carregando disciplinas disponíveis no BD*/
  function loadCoursesForPainel() {
    $.ajax({
      url: "http://127.0.0.1:5000/quiz/courses/",
      type: "GET",
      success: function(data) {
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
      url: "http://127.0.0.1:5000/quiz/courses/",
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
      url: "http://127.0.0.1:5000/quiz/topics/",
      type: "POST",
      data: { course: course },
      success: function(data) {
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
    console.log(question);
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
                        .addClass("btn btn-remove-option")
                        .text("Remover Questão")
                        .click(function(event) {
                          $(this).parent().remove();
                        })
                          .append($("<i />")
                            .addClass("material-icons right")
                            .text("remove")));

    /*Criando questões de múltipla escolha*/
    } else {
      var $question = $("<li />")
                      .addClass("row")
                        .append($("<input />")
                          .attr("type", "hidden")
                          .attr("value", question["_id"]))
                        .append($("<p />")
                          .text(question["title"]))
                        .append($("<p />")
                          .text(question["choices"][0]))
                        .append($("<p />")
                          .text(question["choices"][1]))
                        .append($("<p />")
                          .text(question["choices"][2]))
                        .append($("<a />")
                            .addClass("btn btn-remove-option")
                            .text("Remover Questão")
                            .click(function(event) {
                              $(this).parent().remove();
                            })
                              .append($("<i />")
                                .addClass("material-icons right")
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

    /*pegando as opções da questão*/
    $(".option").each(function(index, element) {
      answers.push($(this).val());
    });

    console.log(correctAnswer);

    $.ajax({
      url: "http://127.0.0.1:5000/quiz/questions/",
      type: "POST",
      data: {title: title, type: type, level: level, topic: topic, correctAnswer: correctAnswer, answers: answers},
      success: function(data) {
          $("#questions-list").append(createQuestion(data))
      }
    });
  });
});
