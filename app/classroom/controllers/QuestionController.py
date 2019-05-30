#!/usr/bin/env python
# -*- coding: utf-8 -*- 
import math

from flask import render_template, jsonify, request
from bson.objectid import ObjectId

from classroom import app
from classroom import db

@app.route("/quiz/questions/<question_id>/", methods=["PUT"])
def update_question(question_id):
    title = request.form.get("title")
    correctAnswer = request.form.get("correctAnswer")
    choices = request.form.getlist("choices[]")
    private = request.form.get("private")

    db.questions.update({"_id": ObjectId(question_id)},
    {"$set": {
        "title": title,
        "correctAnswer": correctAnswer,
        "choices": choices,
        "private": private
    }})

    return "OK"


#Retornando uma questão pelo ID
@app.route("/quiz/questions/<question_id>/", methods=["GET"])
def get_question(question_id):
    result = db.questions.find_one( {"_id": ObjectId(question_id)} )

    if result["type"] == "multipleChoice":
        question = {
            "_id": str(result["_id"]),
            "title": result["title"],
            "type": result["type"],
            "correctAnswer": result["correctAnswer"],
            "choices": result["choices"]
        }
    else:
        question = {
            "_id": str(result["_id"]),
            "title": result["title"],
            "type": result["type"],
            "correctAnswer": result["correctAnswer"]
        }

    return jsonify(question)


#cadastrando uma nova questão
@app.route("/quiz/questions/", methods=["POST"])
def create_questions():
    title = request.form.get("title")
    type = request.form.get("type")
    level = request.form.get("level")
    correct_answer = request.form.get("correctAnswer")
    topic_id = request.form.get("topic")
    answers = request.form.getlist("answers[]")
    private = request.form.get("private")

    topic = db.topics.find_one({"_id": ObjectId(topic_id)})

    questions = db.questions
    id = questions.insert_one({
        "title": title,
        "type": type,
        "level": level,
        "correctAnswer": correct_answer,
        "choices": answers,
        "topic": topic,
        "private": private
    }).inserted_id

    question = db.questions.find_one({"_id": ObjectId(id)})
    if question["_id"]:
        question["_id"] = str(question["_id"])
        question["topic"]["_id"] = str(question["topic"]["_id"])
        question["topic"]["course"]["_id"] = str(question["topic"]["course"]["_id"])

    return jsonify(question)
