from flask import jsonify, request
from bson.objectid import ObjectId

from quiz_service import app
from quiz_service import db


#Retornando todas os usuários no BD
@app.route("/quiz_service/users/", methods=["GET"])
def get_all_users():
    result = db.user.find()

    users = []
    for item in result:
        if item["_id"]:
            item["_id"] = str(item["_id"])
        users.append(item)

    return jsonify(users)
