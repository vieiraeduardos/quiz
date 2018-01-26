from flask import jsonify, request
from bson.objectid import ObjectId

from quiz_service import app
from quiz_service import db


#Retornando todas os tópicos no BD
@app.route("/quiz_service/topics/", methods=["GET"])
def get_all_topics():
    result = db.topics.find()

    topics = []
    for item in result:
        if item["_id"]:
            item["_id"] = str(item["_id"])
            item["course"]["_id"] = str(item["course"]["_id"])
        topics.append(item)

    return jsonify(topics)

#Retornando todos os tópicos por disciplinas
@app.route("/quiz_service/topics/", methods=["POST"])
def get_topics_by_course():
    course = request.form.get("course")

    result = db.topics.find(
             {
                "course._id" : ObjectId(course)
             })

    topics = []
    for item in result:
        if item["_id"]:
            item["_id"] = str(item["_id"])
            item["course"]["_id"] = str(item["course"]["_id"])
        topics.append(item)

    return jsonify(topics)
