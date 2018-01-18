from flask import jsonify

from quiz_service import app
from quiz_service import db


#Retornando todas as disciplinas no BD
@app.route("/quiz_service/courses/", methods=["GET"])
def get_all_courses():
    result = db.abstract.find()

    abstracts = []
    for item in result:
        if item["_id"]:
            item["_id"] = str(item["_id"])
        abstracts.append(item)

    return jsonify(abstracts)
