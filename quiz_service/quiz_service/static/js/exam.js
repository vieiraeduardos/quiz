/*exam.js*/
/*ações referentes a geração de provas em pdf*/

$(document).ready(function() {
  $("#btnGeneratePDF").on("click", function() {
    var doc = new jsPDF('p', 'mm', [400, 480]);

    doc.fromHTML($("#questions-list").get(0), 20, 20, {
      "width": 400 });

    doc.save("exam.pdf");
    
  });
});
