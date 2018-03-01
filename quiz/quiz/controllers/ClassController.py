from flask
from bson.objectid import ObjectId

from quiz import app
from quiz import db

@app.route("/quiz/classes/", methods=["GET"])
def get_classes():
    classes = db.classes.find( {"creator.email": ObjectId(session["_id"])} )

    for c in classes:
        c["_id"] = str(c["_id"])
        c["creator._id"] = str(c["creator._id"])

    return jsonify(c)
