/*dashboard.js*/

/**/


var PROTOCOL = window.location.protocol + "//";
var PORT = ":" + window.location.port;
var HOSTNAME = window.location.hostname;

var URL = PROTOCOL + HOSTNAME + PORT;

$(document).ready(function(){
  /*Habilitando o uso de efeitos do Materialize nos selects*/
  $('select').material_select();

  // Initialize collapse button
  $(".button-collapse").sideNav();
  // Initialize collapsible (uncomment the line below if you use the dropdown variation)
  $('.collapsible').collapsible();

  /*Habilitando modal*/
  $('.modal').modal();

  $(".btn-remove-question-of-test").click(function(event){
    $(this).parent().remove();
  });

  $(".btn-remove-question-of-test2").click(function(event){

  });

  function createTest(test) {
    $test = $("<tr />")
              .append($("<td />")
                .attr("name", "name")
                .text(test["name"]))
              .append($("<td />")
                .attr("name", "description")
                .text(test["description"]))
              .append($("<td />")
                .attr("name", "option")
                  .append($("<a />"))
                    .attr("href", "#")
                    .text("Compartilhar"))

    return $test;
  }

  function loadTests() {
      $.ajax({
        url: "http://127.0.0.1/quiz/tests/",
        type: "GET",
        success: function(data) {
          for(index in data) {
            $("#tests").append(createTest(data[index]));
          }
        }
      });
  }

  /*Criando um novo tópico*/
  function createTopic(topic) {
    $topic = $("<option />").text(topic["name"]).attr("value", topic["_id"]);

    return $topic;

  }

  /*Criando uma nova disciplina*/
  function createCourse(course) {
    $course = $("<option />").text(course["name"]).attr("value", course["_id"]);

    return $course;

  }

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


  /*Carregando disciplinas disponíveis no BD*/
  function loadCourses() {
    $.ajax({
      url: URL + "/quiz/courses/",
      type: "GET",
      success: function(data) {
        for(index in data) {
          $("#course").append(createCourse(data[index]));
        }
        /*Recarregando as configurações de efeitos do Materialize nos selects*/
        $('select').material_select();
      }
    });
  }

  loadCourses();

  /*Carregando os tópicos no BD*/
  function loadTopics(course) {
    $.ajax({
      url: URL + "/quiz/courses/" + course + "/topics/",
      type: "GET",
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
  $("#course").change(function(event) {
    var course = $("select#course").val();
    $("#topic").empty(); /*apagando tópicos antigos*/

    loadTopics(course);
  });

  /*Atualizando níveis*/
  $(".level").change(function(event) {
    var $level = [] /*Nível da questão*/

    $(".level").each(function(index, element) {
      $level.push($(this));
    });

    $level[0].attr("max", 100 - $level[1].val() - $level[2].val())
    $level[1].attr("max", 100 - $level[0].val() - $level[2].val())
    $level[2].attr("max", 100 - $level[0].val() - $level[1].val())

  });


  /*Carregando questões consultadas no BD*/
  function loadQuestions(course, topic, number, level, type) {
    $.ajax({
      url: URL + "/quiz/tests/" + course + "/" + topic + "/",
      type: "POST",
      /*Melhore esta parte*/
      data: { number: number, easy: level[0], medium: level[1], hard: level[2], type: type},
      success: function(data) {
          var codes = []
          $("#questions-list li").each(function(index, value) {
              codes.push($(this).children("input").val());
          });

          for(index in data) {
            if(codes.indexOf(data[index]["_id"])) {
              $("#questions-list").append(createQuestion(data[index]));
            } else {
              console.log("Questão Repetida")
            }
          }
      }
    });
  }

  /*Pesquisando uma lista de questões por tópico*/
  $("#btnSearch").click(function(event) {
    var course = $("select#course").val(); /*ID do curso*/
    var topic = $("select#topic").val(); /*ID do tópico*/
    var number = $("#number").val(); /*Número de questões*/
    var type = $("#type :checked").val(); /*Tipo de questão*/
    var level = [] /*Nível da questão*/

    $(".level").each(function(index, element) {
      level.push($(this).val());
    });

    loadQuestions(course, topic, number, level, type);
  });

  /*Salvando teste*/
  function saveTest(name, description, questions, numAttempts, time) {
      if(name) {
        $.ajax({
          url: URL + "/quiz/tests/",
          type: "POST",
          data: {"name": name, "description": description, "questions": questions, "ntime": time, "numAttempts": numAttempts},
          success: function(data) {
            console.log("New test saved in " + Date());
            window.location.replace(URL + "/classroom/quiz/");

          }
        });
      } else {
        $("#error").css("display", "block").css("color", "red").text("Vocẽ deve escolher um nome para o teste!");
      }
  }

  /*Adicionando evento para o botão de salvar teste*/
  $("#btnSave").click(function(event) {
    var name = $("#name").val();
    var description = $("#description").val();
    var numAttempts = $("#num-attempts").val();
    var time = $("#time").val();
    var questions = [];

    $("#questions-list li input").each(function(index, element) {
      questions.push($(this).val());
    });

    saveTest(name, description, questions, numAttempts, time);
  });

});
