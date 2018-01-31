import math

from flask import render_template, jsonify, request
from bson.objectid import ObjectId

from quiz import app
from quiz import db


#Retornando todas as questões do BD
@app.route("/quiz/questions/", methods=["GET"])
def get_all_questions():
    result = db.questions.find()

    questions = []
    for item in result:
        item["_id"] = str(item["_id"])
        item["topic"]["_id"] = str(item["topic"]["_id"])
        item["topic"]["course"]["_id"] = str(item["topic"]["course"]["_id"])
        questions.append(item)

    return jsonify(questions)
