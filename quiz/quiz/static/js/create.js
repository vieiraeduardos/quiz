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
                        .addClass("btn red btn-remove-option")
                        .text("Remover")
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
