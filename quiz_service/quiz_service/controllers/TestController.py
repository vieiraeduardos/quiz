import math

from flask import render_template, jsonify, request
from bson.objectid import ObjectId

from quiz_service import app
from quiz_service import db


#Retornando todas as questões por tópico
@app.route("/quiz_service/test/<course>/<topic>/", methods=["POST", "GET"])
def create_test(course, topic):
    number = int(request.form.get("number")) #Número de questões
    type = request.form.get("type"); #Tipo de questão
    #Esta pode ser melhorada
    level = [0, 0, 0]
    level[0] = float(request.form.get("easy")) # Fácil
    level[1] = float(request.form.get("medium")) # Médio
    level[2] = float(request.form.get("hard"))  # Díficil

    questions = []

    i = 0
    while(i < 3):
        amount = math.floor(level[i] * (number/100))
        if amount != 0:
            result = db.question.find({"topic._id" :ObjectId(topic), "level" : i, "type": type}).limit(amount)

            for item in result:
                if item["_id"]:
                    item["_id"] = str(item["_id"])
                    item["topic"]["_id"] = str(item["topic"]["_id"])
                    item["topic"]["abstract"]["_id"] = str(item["topic"]["abstract"]["_id"])
                questions.append(item)

        i = i + 1

    return jsonify(questions)
