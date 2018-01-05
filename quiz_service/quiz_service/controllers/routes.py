from flask import render_template, jsonify

from quiz_service import app
from quiz_service import db

#Redirecionando para o índice da aplicação
@app.route("/quiz_service/")
def index():
    return render_template("index.html")


#Retornando todas as questões do BD
@app.route("/quiz_service/questions/")
def get_all_questions():
    qs = db.question.find()

    #Melhore esta parte do código
    questions = []
    for q in qs:
        question = [
            str(q["_id"]),
            q["title"],
            q["topic"],
            q["level"]
            ]
        questions.append(question)

    return jsonify(questions)

#Retornando todas as questões com tópico igual a topic
@app.route("/quiz_service/questions/<topic>", methods=["GET"])
def get_questions_by_topic(topic):
    qs = db.question.find({"topic" : topic})

    #Melhore esta parte do código
    questions = []
    for q in qs:
        question = [
            str(q["_id"]),
            q["title"],
            q["topic"],
            q["level"]
            ]
        questions.append(question)

    return jsonify(questions)
