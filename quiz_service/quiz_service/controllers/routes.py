from flask import render_template, jsonify, request
from bson.objectid import ObjectId


from quiz_service import app
from quiz_service import db

#Redirecionando para o índice da aplicação
@app.route("/quiz_service/")
def index():
    return render_template("index.html")


#Retornando todas as questões do BD
@app.route("/quiz_service/questions/")
def get_all_questions():
    result = db.question.find()

    print(result)

    questions = []
    for item in result:
        if item["_id"]:
            item["_id"] = str(item["_id"])
            item["topic"]["_id"] = str(item["topic"]["_id"])
            item["topic"]["abstract"]["_id"] = str(item["topic"]["abstract"]["_id"])
        questions.append(item)

    return jsonify(questions)


#Retornando todas as questões por tópico
@app.route("/quiz_service/questions/", methods=["POST", "GET"])
def get_questions_by_topic():
    topic_id = request.form.get("topic_id")

    result = db.question.find({"topic._id" : ObjectId(topic_id)})

    print(result)

    questions = []
    for item in result:
        if item["_id"]:
            item["_id"] = str(item["_id"])
            item["topic"]["_id"] = str(item["topic"]["_id"])
            item["topic"]["abstract"]["_id"] = str(item["topic"]["abstract"]["_id"])
        questions.append(item)

    return jsonify(questions)

#Retornando todas as disciplinas no BD
@app.route("/quiz_service/abstracts/", methods=["GET"])
def get_all_abstracts():
    result = db.abstract.find()

    abstracts = []
    for item in result:
        if item["_id"]:
            item["_id"] = str(item["_id"])
        abstracts.append(item)

    return jsonify(abstracts)


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
