/*index.js*/

/**/

$(document).ready(function(){
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
        url: "http://127.0.0.1/quiz_service/tests/",
        type: "GET",
        success: function(data) {
          for(index in data) {
            $("#tests").append(createTest(data[index]));
          }
        }
      });
  }
});
