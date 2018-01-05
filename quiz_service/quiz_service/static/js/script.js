
$(document).ready(function() {
  function createQuestion(title, classe, button) {
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
                                .text(title)))
                        .append($("<div />")
                            .addClass("card-action")
                            .append($("<a />")
                                .addClass(classe)
                                .addClass("btn-floating halfway-fab waves-effect waves-light red")
                                .append($("<i />")
                                    .addClass("material-icons")
                                    .text(button))))));

     return $question
}

  /*Carregando questões consultadas no BD*/
  function loadQuestions(questions) {
    for(index in questions) {
      $("#questions-list").append(createQuestion(questions[index][1], "btnAdd", "add"));
    }
  }


  /*Habilitando o uso de efeitos do Materialize nos selects*/
  $('select').material_select();

  /*Pesquisando uma lista de questões no BD*/
  $("#btnSearch").click(function(event) {
      console.log("Pesquisando uma lista de questões no BD")

      $.ajax({
        url: "http://127.0.0.1:5000/quiz_service/questions/1",
        type: "GET",
        success: function(data) {
          loadQuestions(data);
        }
      });
  });

});
