/*script.js*/
/*scripts do sistema*/

$(document).ready(function() {
  /*Habilitando o uso de efeitos do Materialize nos selects*/
  $('select').material_select();

  /*Criando um novo tópico*/
  function createTopic(abstract) {
    $topic = $("<option />").text(abstract["name"]).attr("value", abstract["_id"]);

    return $topic;

  }

  /*Criando uma nova disciplina*/
  function createAbstract(abstract) {
    $abstract = $("<option />").text(abstract["name"]).attr("value", abstract["_id"]);

    return $abstract;

  }

  /*Criando uma nova questão*/
  function createQuestion(question) {
    $question = $("<li />")
                .addClass("row")
                  .append($("<p />")
                    .text(question["title"]))
                    .append($("<div />")
                      .addClass("chip")
                      .text(convertLevel(question["level"])));


     return $question
  }

  /*Carregando disciplinas disponíveis no BD*/
  function loadAbstracts() {
    $.ajax({
      url: "http://127.0.0.1:5000/quiz_service/abstracts/",
      type: "GET",
      success: function(data) {
        for(index in data) {
          $("#abstract").append(createAbstract(data[index]));
        }
        /*Recarregando as configurações de efeitos do Materialize nos selects*/
        $('select').material_select();
      }
    });
  }

  loadAbstracts();

  /*Carregando os tópicos no BD*/
  function loadTopics(abstract_id) {
    $.ajax({
      url: "http://127.0.0.1:5000/quiz_service/topics/",
      type: "POST",
      data: {abstract_id: abstract_id},
      success: function(data) {
        for(index in data) {
          $("#topic").append(createTopic(data[index]));
        }
        /*Recarregando as configurações de efeitos do Materialize nos selects*/
        $('select').material_select();
      }
    });
  }

  /*Carregando tópicos quando disciplina selecionada*/
  $("#abstract").change(function(event) {
    var abstract_id = $("select#abstract").val();
    loadTopics(abstract_id);
  });


  /*Carregando questões consultadas no BD*/
  function loadQuestions(topic_id, number, level) {
    $.ajax({
      url: "http://127.0.0.1:5000/quiz_service/questions/",
      type: "POST",
      /*Melhore esta parte*/
      data: {topic_id : topic_id, number: number, easy: level[0], medium: level[1], hard: level[2]},
      success: function(data) {
        for(index in data) {
          $("#questions-list").append(createQuestion(data[index]));
        }
      }
    });
  }

  /*Pesquisando uma lista de questões por tópico*/
  $("#btnSearch").click(function(event) {
    $("#questions-list").empty();

    var topic_id = $("select#topic").val();
    var number = $("#number").val();
    var level = []

    $(".level").each(function( index, element ) {
      level.push($(this).val());
    });

    console.log(level);

    loadQuestions(topic_id, number, level);
  });

});
