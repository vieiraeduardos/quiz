/*courses.js*/

/*funções referentes a criação de disciplinas*/

$(document).ready(function(){
  /*criando uma nova disciplina*/
  $("#btn-create-course").click(function(event){
    var name = $("#modal-course-name").val();

    $.ajax({
      url: "http://127.0.0.1:5000/quiz/courses/",
      type: "POST",
      data: {"name": name},
      success: function(data) {
        window.location.replace("http://127.0.0.1:5000/quiz/dashboard/");
      }
    });
  });
});
