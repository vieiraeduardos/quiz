$(document).ready(function(){
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
    
                //Criando lista de questões
                questions = [
                             {"ID": 1, "title": "Calcule 2  +  2.", "level": 0},
                             {"ID": 2, "title": "Calcule 7  +  2.", "level": 0},
                             {"ID": 3, "title": "Calcule 2  +  6.", "level": 0}
                            ];

                //Mostrando lista de questões na tela
                for(index in questions) {
                    $("#questions").append(createQuestion(questions[index].title, "btnAdd", "add"));
                }

                 /*Removendo a questão do exame*/
                $(".btnRemove").click(function(event) {
                    alert("Ok")
        
                });

                function remove() {
                    $(this).parent().parent().parent().parent().remove();
                }

                //Adicionando questão no teste
                $(".btnAdd").click(function(event) {
                    var title = $(this).parent().parent().children(".card-content").children("span[name='title']").text()
                    
                    var $question = createQuestion(title, "btnRemove", "remove")
                    $question.find("a").on("click", remove);
                    $("#test").append($question);
;
                });

});
