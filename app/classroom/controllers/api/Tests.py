from classroom import app
from classroom import db

from bson.objectid import ObjectId

from flask import jsonify

import json

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

@app.route("/api/quiz/tests/<test_id>/")
def api_get_test(test_id):
    test = db.tests.find_one( {"_id": ObjectId(test_id)} )

    questions = []
    for id in test["questions"]:
        question = db.questions.find_one({"_id": ObjectId(id)})
        questions.append(question)

    test["questions"] = questions

    return JSONEncoder().encode(test)
