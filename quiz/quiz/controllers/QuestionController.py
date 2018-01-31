import math

from flask import render_template, jsonify, request
from bson.objectid import ObjectId

from quiz import app
from quiz import db

#Retornando todas as questões do BD
@app.route("/quiz/questions/", methods=["GET"])
def redirect_questions():
    courses = db.courses.find( {} )

    return render_template("questions/create.html", courses=courses)

#cadastrando uma nova questão
@app.route("/quiz/questions/", methods=["POST"])
def create_questions():
    title = request.form.get("title")
    type = request.form.get("type")
    level = request.form.get("level")
    correct_answer = request.form.get("correct_answer")
    topic_id = request.form.get("topic")

    topic = db.topics.find( {"_id": ObjectId(topic_id)} )

    question_id = db.questions.insertOne( {
        "title": title,
        "type" : type,
        "level": level,
        "correctAnswer": correct_answer,
        "topic": topic
    } )

    return question_id
