import math

from flask import redirect, render_template, jsonify, request, session
from bson.objectid import ObjectId

from quiz_service import app
from quiz_service import db

#Compartilhando teste
@app.route("/quiz_service/tests/<test_id>/people/", methods=["PUT"])
def share_test(test_id):
    email = request.form.get("email")
    test = db.test.find_one({"_id": ObjectId(test_id)})

    emails = []
    if test["people"]:
        emails.append(test["people"])

    emails.append(email)

    test["people"] = emails

    db.test.update({"_id": ObjectId(test_id)}, test)

    return redirect("/quiz_service/")

#Criando teste
@app.route("/quiz_service/tests/", methods=["POST"])
def save_test():
    name = request.form.get("name")
    description = request.form.get("description")
    questions = request.form.getlist("questions[]")
    creator = db.user.find_one({"email": session["email"]})

    test = {"name": name, "description": description, "creator": creator, "people": "", "questions": []}

    for question in questions:
        result = db.question.find_one({"_id": ObjectId(question)})
        test["questions"].append(result)

    db.test.insert_one(test)

    return render_template("index.html")


#Retornando todas as questões por tópico
@app.route("/quiz_service/test/<course>/<topic>/", methods=["POST"])
def create_test(course, topic):
    number = int(request.form.get("number")) #Número de questões
    type = request.form.get("type"); #Tipo de questão
    #Esta pode ser melhorada
    level = [0, 0, 0]
    level[0] = float(request.form.get("easy")) # Fácil
    level[1] = float(request.form.get("medium")) # Médio
    level[2] = float(request.form.get("hard"))  # Díficil

    print(course)
    print(topic)
    print(number)
    print(type)
    print(level)

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


#Retornando um teste pelo ID
@app.route("/quiz_service/tests/<test_id>")
def get_test_by_id(test_id):
    test = db.test.find_one({"_id": ObjectId(test_id)})

    test["_id"] = str(test["_id"])
    test["creator"]["_id"] = str(test["creator"]["_id"])

    questions = []
    for item in test["questions"]:
        if item["_id"]:
            item["_id"] = str(item["_id"])
            item["topic"]["_id"] = str(item["topic"]["_id"])
            item["topic"]["abstract"]["_id"] = str(item["topic"]["abstract"]["_id"])
        questions.append(item)

    test["questions"] = questions

    return render_template("tests/answer.html", test=test)


#Retornando um teste pelo ID
@app.route("/quiz_service/tests/<test_id>/answers/", methods=["GET"])
def test(test_id):
    test = db.test.find_one({"_id": ObjectId(test_id)})

    test["_id"] = str(test["_id"])
    test["creator"]["_id"] = str(test["creator"]["_id"])

    questions = []
    for item in test["questions"]:
        if item["_id"]:
            item["_id"] = str(item["_id"])
            item["topic"]["_id"] = str(item["topic"]["_id"])
            item["topic"]["abstract"]["_id"] = str(item["topic"]["abstract"]["_id"])
        questions.append(item)

    test["questions"] = questions

    return render_template("tests/verify.html", test=test, answers=None)
