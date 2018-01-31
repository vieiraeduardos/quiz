/*create.js*/

/**/

$(document).ready(function() {
  /*Habilitando o uso de efeitos do Materialize nos selects*/
  $('select').material_select();

  $("select").change(function(event) {
    var type = $(this).val();

    if(type == "shortAnswer") {
      $("#multiple-choice-painel").css("display", "none")
      $("#true-or-false-painel").css("display", "none");
      $("#short-answer-painel").css("display", "block");
    } else if(type == "trueOrFalse") {
      $("#multiple-choice-painel").css("display", "none")
      $("#short-answer-painel").css("display", "none");
      $("#true-or-false-painel").css("display", "block");
    } else {
      $("#short-answer-painel").css("display", "none");
      $("#true-or-false-painel").css("display", "none");
      $("#multiple-choice-painel").css("display", "block")
    }
  });

  $(".btn-remove-option").click(function(event) {
    alert("oka");
  });

  $("#btn-add-option").click(function(event) {
    var $option = $("<li />")
                    .append($("<input />")
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

  /*Carregando os tópicos no BD*/
  function loadTopics(course) {
    $.ajax({
      url: "http://127.0.0.1:5000/quiz/topics/",
      type: "POST",
      data: {course: course},
      success: function(data) {
        for(index in data) {
          $("#topics").append(createTopic(data[index]));
        }
        /*Recarregando as configurações de efeitos do Materialize nos selects*/
        $('select').material_select();
      }
    });
  }

  /*Carregando tópicos quando disciplina selecionada*/
  $("#courses").change(function(event) {
    var course = $("select#courses").val();
    $("#topics").empty(); /*apagando tópicos antigos*/

    loadTopics(course);
  });

  $("#btn-create-question").click(function(event) {
    var title = $("#title").val();
    var topic = $("select#topics").val();
    var type = $("select#types").val();
    var level = $("#level :checked").val();
    var correctAnswer = $("select#answers").val();

    console.log(title);
    console.log(topic);
    console.log(type);
    console.log(level);
    console.log(correctAnswer);

});

});
