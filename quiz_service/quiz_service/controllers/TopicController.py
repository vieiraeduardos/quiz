from flask import jsonify, request
from bson.objectid import ObjectId

from quiz_service import app
from quiz_service import db


#Retornando todas os tópicos no BD
@app.route("/quiz_service/topics/", methods=["GET"])
def get_all_topics():
    result = db.topic.find()

    topics = []
    for item in result:
        if item["_id"]:
            item["_id"] = str(item["_id"])
            item["abstract"]["_id"] = str(item["abstract"]["_id"])
        topics.append(item)

    return jsonify(topics)

#Retornando todos os tópicos por disciplinas
@app.route("/quiz_service/topics/", methods=["POST", "GET"])
def get_topics_by_abstract():
    abstract_id = request.form.get("abstract_id")

    result = db.topic.find({"abstract._id" : ObjectId(abstract_id)})

    topics = []
    for item in result:
        if item["_id"]:
            item["_id"] = str(item["_id"])
            item["abstract"]["_id"] = str(item["abstract"]["_id"])
        topics.append(item)

    return jsonify(topics)
