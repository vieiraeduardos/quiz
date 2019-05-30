#!/usr/bin/env python
# -*- coding: utf-8 -*- 
from flask import jsonify, request

from classroom import app
from classroom import db

#criando nova disciplina
@app.route("/quiz/courses/", methods=["POST"])
def create_course():
    name = request.form.get("name")

    db.courses.insert({"name": name})

    return "OK"


#Retornando todas as disciplinas no BD
@app.route("/quiz/courses/", methods=["GET"])
def get_all_courses():
    result = db.courses.find()

    courses = []
    for item in result:
        if item["_id"]:
            item["_id"] = str(item["_id"])
        courses.append(item)

    return jsonify(courses)
