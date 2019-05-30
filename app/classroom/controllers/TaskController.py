#!/usr/bin/env python
# -*- coding: utf-8 -*- 
from flask import request, session, render_template, jsonify
from bson.objectid import ObjectId

from classroom import app
from classroom import db

@app.route("/classroom/tasks/<task_id>/", methods=["PUT"])
def update_task(task_id):
    title = request.form.get("title")
    description = request.form.get("description")
    deadline = request.form.get("deadline")

    db.tasks.update({"_id": ObjectId(task_id)}, {"$set": {
        "title": title,
        "description": description,
        "deadline": deadline
    }} )

    return "OK"


@app.route("/classroom/tasks/<task_id>/", methods=["GET"])
def get_task(task_id):
    result = db.tasks.find_one({"_id": ObjectId(task_id)})

    task = {
        "_id": str(result["_id"]),
        "title": result["title"],
        "description": result["description"],
        "deadline": result["deadline"]
    }

    return jsonify(task)


@app.route("/classroom/tasks/<task_id>/", methods=["DELETE"])
def delete_task(task_id):
    db.tasks.remove({"_id": ObjectId(task_id)})

    return "OK"

@app.route("/classroom/tasks/", methods=["POST"])
def create_task():
    title = request.form.get("title")
    description = request.form.get("description")
    deadline = request.form.get("deadline")
    test_id = request.form.get("test")
    class_id = request.form.get("classId")
    c = db.classes.find_one( {"_id": ObjectId(class_id)} )

    test = db.tests.find_one({"_id": ObjectId(test_id)})

    db.tasks.insert( {
        "title": title,
        "description": description,
        "deadline": deadline,
        "class": c,
        "test": test
    } )

    return "OK"
