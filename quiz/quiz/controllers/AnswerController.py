from flask import render_template, redirect, request, jsonify
from bson.objectid import ObjectId

from quiz import app
from quiz import db

#vendo os detalhes da reposta
@app.route("/quiz/answers/<answer_id>/", methods=["GET"])
def see_answer(answer_id):

    answer = db.answers.find_one(
             {
                "_id" : ObjectId(answer_id)
             })

    return render_template("answers/see.html", answer=answer)


#atualizando nota do quiz
@app.route("/quiz/answers/<answer_id>/", methods=["PUT"])
def update_grade(answer_id):
    grade = int(request.form.get("grade"))
    answer = db.answers.find_one(
             {
                "_id" : ObjectId(answer_id)
             })

    answer["grade"] = grade

    db.answers.update(
    {
        "_id" : ObjectId(answer_id)},
        answer
    )

    return "Ok"
