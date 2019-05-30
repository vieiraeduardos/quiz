#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import session, jsonify, render_template, request

import math
from random import randint
import random

from bson.objectid import ObjectId

from classroom import app
from classroom import db


@app.route("/classroom/quiz/tests/<test_id>/", methods=["GET"])
def get_test_to_add_questions(test_id):
    test = db.tests.find_one({"_id": ObjectId(test_id)})

    questions = []
    for id in test["questions"]:
        question = db.questions.find_one({"_id": ObjectId(id)})
        questions.append(question)

    return render_template("quiz/tests/add_questions_to_test.html", test=test, questions=questions)


#Redirecionando para dashboard
@app.route("/classroom/quiz/tests/", methods=["GET"])
def dashboard():
        if "_id" in session:
            return render_template("quiz/tests/create_test.html")
        else:
            return render_template("errors/403.html")


#removendo um teste
@app.route("/quiz/tests/<test_id>/", methods=["DELETE"])
def remove_test(test_id):
    db.tests.remove( {"_id": ObjectId(test_id)} )
    #removendo respostas relacionadas ao teste
    db.answers.remove( {"test._id": ObjectId(test_id)} )

    return "OK"


#Retornando todas as questões por tópico
@app.route("/quiz/tests/<course>/<topic>/", methods=["POST"])
def create_test(course, topic):
    number = int(request.form.get("number")) #Número de questões
    type = request.form.get("type"); #Tipo de questão
    #Esta pode ser melhorada
    level = [{ "name" : "easy", "percentage" : float(request.form.get("easy")) },
            { "name" : "medium", "percentage" : float(request.form.get("medium")) },
            { "name" : "difficult", "percentage" : float(request.form.get("hard")) }]

    questions = []

    i = 0
    while(i < 3):
        amount = math.floor(level[i]["percentage"] * (number/100))
        if amount != 0:
            limite = db.questions.find(
                     {
                        "topic._id" : ObjectId(topic),
                        "level" : level[i]["name"],
                        "type": type
                     }).count()

            num_random = randint(0, limite)

            result = db.questions.find({
                "topic._id" : ObjectId(topic),
                "level" : level[i]["name"],
                "type": type,
                "private": "false"
            }).limit(amount).skip(num_random)

            for item in result:
                if item["_id"]:
                    item["_id"] = str(item["_id"])
                    item["topic"]["_id"] = str(item["topic"]["_id"])
                    item["topic"]["course"]["_id"] = str(item["topic"]["course"]["_id"])
                questions.append(item)

        i = i + 1

    return jsonify(questions)


#Criando teste
@app.route("/quiz/tests/", methods=["POST"])
def save_test():
    name = request.form.get("name")
    description = request.form.get("description")
    num_attempts = request.form.get("numAttempts")
    time = request.form.get("ntime")

    questions = request.form.getlist("questions[]")

    creator = db.users.find_one(
              {
                "email" : session["email"]
              })

    db.tests.insert_one({
        "name": name,
        "description": description,
        "creator": creator,
        "classes": [],
        "questions": questions,
        "numAttempts": num_attempts,
        "time": time
    })

    return "OK"



#Compartilhando teste
@app.route("/quiz/tests/<test_id>/classes/", methods=["PUT"])
def share_test(test_id):
    title = request.form.get("title")
    description = request.form.get("description")
    deadline = request.form.get("deadline")
    classe_id = request.form.get("classe")

    classe = db.classes.find_one( {"_id": ObjectId(classe_id)} )

    db.tests.update({"_id" : ObjectId(test_id)},{"$addToSet": {"classes": classe}})

    test = db.tests.find_one( {"_id": ObjectId(test_id)} )

    db.tasks.insert({
        "title": title,
        "description": description,
        "deadline": deadline,
        "class": classe,
        "test": test
    })

    return "OK"

#atualizando as informações do teste
@app.route("/quiz/tests/<test_id>/", methods=["PUT"])
def update_test(test_id):
    name = request.form.get("name")
    description = request.form.get("description")
    num_attempts = request.form.get("numAttempts")
    time = request.form.get("ntime")

    questions = request.form.getlist("questions[]")

    db.tests.update({"_id": ObjectId(test_id)},
    {"$set": {
        "name": name,
        "description": description,
        "classes": [],
        "questions": questions,
        "numAttempts": num_attempts,
        "time": time
            }
    })

    return "OK"



#Retornando um teste pelo ID
@app.route("/classroom/quiz/tests/<test_id>/answers/", methods=["GET"])
def test(test_id):
    try:
        test = db.tests.find_one(
               {
                    "_id" : ObjectId(test_id)
               })

        if str(test["creator"]["_id"]) == session["_id"]:
            test["_id"] = str(test["_id"])
            test["creator"]["_id"] = str(test["creator"]["_id"])

            questions = []

            for id in test["questions"]:
                question = db.questions.find_one({"_id": ObjectId(id)})

                if question["type"] == "multipleChoice":
                    questions.append({
                        "_id": str(question["_id"]),
                        "title": question["title"],
                        "type": question["type"],
                        "correctAnswer": question["correctAnswer"],
                        "choices": question["choices"]
                    })
                else:
                    questions.append({
                        "_id": str(question["_id"]),
                        "title": question["title"],
                        "type": question["type"],
                        "correctAnswer": question["correctAnswer"]
                    })


            answers = db.answers.find(
                      {
                        "test._id" : ObjectId(test_id)
                      })

            return render_template("quiz/tests/verify_test.html", test=test, answers=answers, questions=questions)
    except Exception as e:
        return render_template("errors/403.html")



#enviando uma nova answer
@app.route("/quiz/tests/<test_id>/answers/", methods=["POST"])
def send_answer(test_id):
    #verificando se existir uma resposta anterior
    last_answer = db.answers.find_one({
        "test._id": ObjectId(test_id),
        "user._id": ObjectId(session["_id"])
    })

    if last_answer:
        num_attempts = int(last_answer["numAttempts"]) + 1
        db.answers.update({"_id": last_answer["_id"]}, {"$inc": {"numAttempts": 1}})

    else:
        num_attempts = 1

    answers = request.form.getlist("answers[]")
    values = request.form.getlist("values[]")

    test = db.tests.find_one(
           {
                "_id" : ObjectId(test_id)
           })

    user = db.users.find_one(
           {
                "_id" : ObjectId(session["_id"])
           })

    num_questions = len(test["questions"])
    num_correct_questions = 0

    questions = []

    #analisando se a questão está certa
    for answer, value in zip(answers, values):
        for id in test["questions"]:
            question = db.questions.find_one({"_id": ObjectId(id)})

            if value == str(question["_id"]):
                question["answer"] = answer
                questions.append(question)

                if question["type"] == "trueOrFalse" or question["type"] == "multipleChoice":
                    if question["correctAnswer"] == question["answer"]:
                        num_correct_questions += 1

    if num_questions == 0:
        grade = 0
    else:
        grade = num_correct_questions / num_questions * 10

    if last_answer:
        if last_answer["grade"] > grade:
            return "OK"
        else:
            #apagando resposta anterior
            db.answers.remove({"_id": last_answer["_id"]})

    #salvando resposta no BD
    db.answers.insert({
        "user": user,
        "test": test,
        "grade": grade,
        "numAttempts": num_attempts,
        "answers": questions
    })

    return "OK"

'''
#Retornando um teste pelo ID
@app.route("/classroom/quiz/classes/<class_id>/tests/<test_id>/", methods=["GET"])
def get_test_by_id(class_id, test_id):
    try:
        turma = db.classes.find_one( {"_id": ObjectId(class_id)} )
        test = db.tests.find_one( {"_id": ObjectId(test_id)} )

    except:
        return render_template("errors/404.html"), 404

    user = db.users.find_one({"_id": ObjectId(session["_id"])})

    classe = db.classes.find_one( {"_id": ObjectId(turma["_id"]), "participants": {"$in": [ObjectId(user["_id"])]}} )

    if classe == None:
        return render_template("errors/403.html"), 403

    answer = db.answers.find_one({"user._id": ObjectId(session["_id"]), "test._id": test["_id"]})

    num_attempts = int(test["numAttempts"])

    if answer:
        num_attempts -= int(answer["numAttempts"])

        if num_attempts == 0:
            return render_template("errors/403.html"), 403

    test["_id"] = str(test["_id"])
    test["creator"]["_id"] = str(test["creator"]["_id"])

    questions = []
    for id in test["questions"]:
        item = db.questions.find_one({"_id": ObjectId(id)})

        if item["_id"]:
            item["_id"] = str(item["_id"])
            item["topic"]["_id"] = str(item["topic"]["_id"])
            item["topic"]["course"]["_id"] = str(item["topic"]["course"]["_id"])
            if item["type"] == "multipleChoice" or item["type"] == "trueOrFalse":
                random.shuffle(item["choices"])
        questions.append(item)

    test["questions"] = questions

    return render_template("quiz/tests/answer_test.html", test=test, num_attempts=num_attempts)
'''

#Retornando um teste pelo ID
@app.route("/classroom/quiz/classes/<class_id>/tests/<test_id>/", methods=["GET"])
def get_test_by_id(class_id, test_id):
    try:
        user = db.users.find_one({"_id": ObjectId(session["_id"])})
        classe = db.classes.find_one( {"_id": ObjectId(class_id), "participants": {"$in": [ObjectId(user["_id"])]}} )
        test = db.tests.find_one( {"_id": ObjectId(test_id)} )

    except:
        return render_template("errors/404.html"), 404

    if classe == None:
        return render_template("errors/403.html"), 403

    attempt = db.attempts.find_one({"user": user["_id"], "test": test["_id"]})

    print(attempt)

    if attempt:
        db.attempts.update(
            {"_id": attempt["_id"]},
            { "$inc": { "number": 1}
        })
        print(test["numAttempts"])
        if(( attempt["number"] + 1 ) > int(test["numAttempts"])):
            return render_template("errors/403.html")

        num_attempts=(int(test["numAttempts"]) - attempt["number"])

    else:
        db.attempts.insert({"user": user["_id"], "test": test["_id"], "number": 1})
        num_attempts=(int(test["numAttempts"]) - 1)

    answer = db.answers.find_one({"user._id": ObjectId(session["_id"]), "test._id": test["_id"]})

    test["_id"] = str(test["_id"])
    test["creator"]["_id"] = str(test["creator"]["_id"])

    questions = []
    for id in test["questions"]:
        item = db.questions.find_one({"_id": ObjectId(id)})

        if item["_id"]:
            item["_id"] = str(item["_id"])
            item["topic"]["_id"] = str(item["topic"]["_id"])
            item["topic"]["course"]["_id"] = str(item["topic"]["course"]["_id"])
            if item["type"] == "multipleChoice" or item["type"] == "trueOrFalse":
                random.shuffle(item["choices"])
        questions.append(item)

    test["questions"] = questions

    return render_template("quiz/tests/answer_test.html", test=test, num_attempts=num_attempts)

#retornando testes criados
@app.route("/classroom/tests/", methods=["GET"])
def get_all_tests():
    result = db.tests.find({"creator._id": ObjectId(session["_id"])})

    tests = []

    for t in result:
        tests.append({"_id": str(t["_id"]), "name": t["name"]})

    return jsonify(tests)
