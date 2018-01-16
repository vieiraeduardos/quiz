import math

from flask import render_template, jsonify, request
from bson.objectid import ObjectId

from quiz_service import app
from quiz_service import db


#Retornando todas as questões do BD
@app.route("/quiz_service/questions/")
def get_all_questions():
    result = db.question.find()

    print(result)

    questions = []
    for item in result:
        if item["_id"]:
            item["_id"] = str(item["_id"])
            item["topic"]["_id"] = str(item["topic"]["_id"])
            item["topic"]["abstract"]["_id"] = str(item["topic"]["abstract"]["_id"])
        questions.append(item)

    return jsonify(questions)


#Retornando todas as questões por tópico
@app.route("/quiz_service/questions/", methods=["POST", "GET"])
def get_questions_by_topic():
    topic_id = request.form.get("topic_id")
    number = int(request.form.get("number"))
    type = request.form.get("type");
    level = [0, 0, 0]
    level[0] = float(request.form.get("easy")) # Fácil
    level[1] = float(request.form.get("medium")) # Médio
    level[2] = float(request.form.get("hard"))  # Díficil

    questions = []

    i = 0
    while(i < 3):
        amount = math.floor(level[i] * (number/100))
        if amount != 0:
            result = db.question.find({"topic._id" :ObjectId(topic_id), "level" : i, "type": type}).limit(amount)

            for item in result:
                if item["_id"]:
                    item["_id"] = str(item["_id"])
                    item["topic"]["_id"] = str(item["topic"]["_id"])
                    item["topic"]["abstract"]["_id"] = str(item["topic"]["abstract"]["_id"])
                questions.append(item)

        i = i + 1

    print(questions)
    return jsonify(questions)
