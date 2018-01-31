from flask import jsonify

from quiz import app
from quiz import db


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
