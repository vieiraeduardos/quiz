/*tasks.js*/

/**/


var PROTOCOL = window.location.protocol + "//";
var PORT = ":" + window.location.port;
var HOSTNAME = window.location.hostname;

var URL = PROTOCOL + HOSTNAME + PORT;


function fillModalEditTask(taskId) {
  $.ajax({
    url: URL + "/classroom/tasks/" + taskId + "/",
    type: "GET",
    success: function(data) {

      $("#modal-edit-task-id").val(data["_id"]);
      $("#modal-edit-task-title").val(data["title"]);
      $("#modal-edit-task-description").val(data["description"]);
      $("#modal-edit-task-deadline").val(data["deadline"]);

    }
  });
}


$(document).ready(function() {
  $("#btn-edit-task").click(function(event) {
    var classId = $("#class-id").val();
    var taskId = $("#modal-edit-task-id").val();
    var title = $("#modal-edit-task-title").val();
    var description = $("#modal-edit-task-description").val();
    var deadline = $("#modal-edit-task-deadline").val();

    $.ajax({
      url: URL + "/classroom/tasks/" + taskId + "/",
      type: "PUT",
      data: {"title": title, "description": description, "deadline": deadline},
      success: function(data) {
        window.location.replace(URL + "/classroom/classes/" + classId + "/")
      }
    });
  });
});
