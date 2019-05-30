#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import render_template, redirect, request, jsonify
from bson.objectid import ObjectId

from classroom import app
from classroom import db


@app.route("/classroom/warnings/<warning_id>/", methods=["DELETE"])
def delete_warning(warning_id):
    db.warnings.remove({"_id": ObjectId(warning_id)})

    return "OK"


@app.route("/classroom/warnings/<warning_id>/", methods=["PUT"])
def update_warning(warning_id):
    title = request.form.get("title")
    description = request.form.get("description")

    db.warnings.update({"_id": ObjectId(warning_id)}, {"$set": {
        "title": title,
        "description": description
    }})

    return "OK"


@app.route("/classroom/warnings/<warning_id>/", methods=["GET"])
def get_warning(warning_id):
    result = db.warnings.find_one({"_id": ObjectId(warning_id)})

    warning = {
        "_id": str(result["_id"]),
        "title": result["title"],
        "description": result["description"]
    }

    return jsonify(warning)


#vendo os detalhes da reposta
@app.route("/classroom/classes/<class_id>/warnings/", methods=["POST"])
def create_warning(class_id):
    title = request.form.get("title")
    description = request.form.get("description")
    created_at = request.form.get("created_at")

    classe = db.classes.find_one({"_id": ObjectId(class_id)})

    db.warnings.insert({
        "title": title,
        "description": description,
        "class": classe,
        "created_at": created_at,
    })

    return "OK"
