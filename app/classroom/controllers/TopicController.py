#!/usr/bin/env python
# -*- coding: utf-8 -*- 
from flask import jsonify, request
from bson.objectid import ObjectId

from classroom import app
from classroom import db

#criando novo tópico
@app.route("/quiz/topics/", methods=["POST"])
def create_topic():
    name = request.form.get("name")
    course_id = request.form.get("courseId")

    course = db.courses.find_one({"_id": ObjectId(course_id)})

    db.topics.insert({"name": name, "course": course })

    return "OK"


#Retornando todas os tópicos no BD
@app.route("/quiz/topics/", methods=["GET"])
def get_all_topics():
    result = db.topics.find()

    topics = []
    for item in result:
        if item["_id"]:
            item["_id"] = str(item["_id"])
            item["course"]["_id"] = str(item["course"]["_id"])
        topics.append(item)

    return jsonify(topics)

#Retornando todos os tópicos por disciplina
@app.route("/quiz/courses/<course_id>/topics/", methods=["GET"])
def get_topics_by_course(course_id):

    result = db.topics.find(
             {
                "course._id" : ObjectId(course_id)
             })

    topics = []
    for item in result:
        if item["_id"]:
            item["_id"] = str(item["_id"])
            item["course"]["_id"] = str(item["course"]["_id"])
        topics.append(item)

    return jsonify(topics)
