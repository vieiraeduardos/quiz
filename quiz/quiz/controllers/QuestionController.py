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
    correct_answer = request.form.get("correctAnswer")
    topic_id = request.form.get("topic")
    answers = request.form.getlist("answers[]")

    topic = db.topics.find_one({"_id": ObjectId(topic_id)})

    questions = db.questions
    id = questions.insert_one({
        "title": title,
        "type": type,
        "level": level,
        "correctAnswer": correct_answer,
        "choices": answers,
        "topic": topic
    }).inserted_id

    question = db.questions.find_one({"_id": ObjectId(id)})
    if question["_id"]:
        question["_id"] = str(question["_id"])
        question["topic"]["_id"] = str(question["topic"]["_id"])
        question["topic"]["course"]["_id"] = str(question["topic"]["course"]["_id"])

    return jsonify(question)
