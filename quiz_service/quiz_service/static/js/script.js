
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
    $question = $("<div />")
                .addClass("row")
                .append($("<div />")
                    .addClass("col s12")
                    .append($("<div />")
                        .addClass("card blue-grey darken-1")
                        .append($("<div />")
                            .addClass("card-content white-text")
                            .append($("<span />")
                                .addClass("card-title")
                                .attr("name", "title")
                                .text(question["title"])))
                        .append($("<div />")
                            .addClass("card-action")
                            .append($("<a />")
                                .addClass("btn-floating halfway-fab waves-effect waves-light red")
                                .append($("<i />")
                                    .addClass("material-icons")
                                    .text("add"))))));

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
        /*Recarregando as configurações do selects*/
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
        /*Recarregando as configurações do selects*/
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
  function loadQuestions(topic_id) {
    $.ajax({
      url: "http://127.0.0.1:5000/quiz_service/questions/",
      type: "POST",
      data: {topic_id : topic_id},
      success: function(data) {
        for(index in data) {
          $("#questions-list").append(createQuestion(data[index]));
        }
      }
    });
  }

  /*Pesquisando uma lista de questões por tópico*/
  $("#btnSearch").click(function(event) {
    var topic_id = $("select#topic").val();
    console.log(topic_id)
    loadQuestions(topic_id);
  });

});
