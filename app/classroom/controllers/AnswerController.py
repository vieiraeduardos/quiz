#!/usr/bin/env python
# -*- coding: utf-8 -*- 
from flask import render_template, redirect, request, jsonify, session
from bson.objectid import ObjectId

from classroom import app
from classroom import db

@app.route("/quiz/tasks/<task_id>/tests/<test_id>/answers/")
def get_result(task_id, test_id):
    task = db.tasks.find_one({"_id": ObjectId(task_id)})

    answer = db.answers.find_one(
             {
                "test._id": ObjectId(test_id),
                "user._id": ObjectId(session["_id"])
             })

    if answer:
        return render_template("quiz/answers/see_result.html", answer=answer, task=task)
    else:
        return redirect("/classroom/quiz/classes/" + str(task["class"]["_id"]) + "/tests/" + str(task["test"]["_id"]) + "/")


#vendo os detalhes da reposta
@app.route("/classroom/quiz/answers/<answer_id>/", methods=["GET"])
def see_answer(answer_id):

    answer = db.answers.find_one(
             {
                "_id" : ObjectId(answer_id)
             })
    print(answer)

    return render_template("quiz/answers/see.html", answer=answer)


#atualizando nota do quiz
@app.route("/quiz/answers/<answer_id>/", methods=["PUT"])
def update_grade(answer_id):
    grade = int(request.form.get("grade"))
    answer = db.answers.find_one(
             {
                "_id" : ObjectId(answer_id)
             })

    answer["grade"] = grade

    db.answers.update(
    {
        "_id" : ObjectId(answer_id)},
        answer
    )

    return "Ok"
