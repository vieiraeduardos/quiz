#!/usr/bin/env python
# -*- coding: utf-8 -*-
import datetime

from flask import request, session, render_template, jsonify, redirect
from bson.objectid import ObjectId

from classroom import app
from classroom import db

from flask_mail import Message
from classroom import mail


#aceitando pedido para entrar em turma
@app.route("/classroom/invites/<invite_id>/", methods=["GET"])
def accept_invite(invite_id):
    try:
        invite = db.invites.find_one( {"_id": ObjectId(invite_id)} )
        user = db.users.find_one( {"_id": invite["user"]["_id"]} )

        db.classes.update({"_id": invite["class"]["_id"]}, {"$addToSet": {"participants": user["_id"]}})
        db.invites.remove({"_id": ObjectId(invite_id)})

    except Exception as error:
        return "Error", 400

    return "OK"


#apagando convite para entrar em turma
@app.route("/classroom/invites/<invite_id>/", methods=["DELETE"])
def refuse_invite(invite_id):
    try:
        db.invites.remove({"_id": ObjectId(invite_id)})
    except Exception as e:
        print(e)

    return "OK"


#registrando pedido para entrar em turma
@app.route("/classroom/classes/<class_id>/invites/", methods=["POST"])
def send_invite(class_id):
    try:
        user = db.users.find_one( {"_id": ObjectId(session["_id"])} )
        classe = db.classes.find_one( {"_id": ObjectId(class_id)} )

        db.invites.insert({
            "user": user,
            "class": classe,
            "type": "normal"
        })
    except:
        return "Error"

    return "OK"


def getMes(mes):
    if mes == 1:
        return "Janeiro"
    if mes == 2:
        return "Fevereiro"
    if mes == 3:
        return "Março"
    if mes == 4:
        return "Abril"
    if mes == 5:
        return "Maio"
    if mes == 6:
        return "Junho"
    if mes == 7:
        return "Julho"
    if mes == 8:
        return "Agosto"
    if mes == 9:
        return "Setembro"
    if mes == 10:
        return "Outubro"
    if mes == 11:
        return "Novembro"
    if mes == 12:
        return "Dezembro"


@app.route("/classroom/user/<user_id>/classes/<class_id>/", methods=["GET"])
def get_index_student(class_id, user_id):
    date = datetime.datetime.now().strftime("%Y-%m-%d")

    classe = db.classes.find_one({"_id": ObjectId(class_id)})

    users = []

    for user_id in classe["participants"]:
        u = db.users.find_one(user_id)
        users.append(u)

    tasks = db.tasks.find({
        "class._id": classe["_id"],
        "deadline" : { "$gte" : date }
    }).sort([("deadline", -1)])

    warnings = db.warnings.find({"class._id": classe["_id"]})

    return render_template("classes/student.html", c=classe, tasks=tasks, warnings=warnings, participants=users)


#Criando uma nova turma
@app.route("/classroom/classes/", methods=["POST"])
def create_class():
    name = request.form.get("name")
    description = request.form.get("description")
    creator = db.users.find_one( {"_id": ObjectId(session["_id"])} )
    participants = []

    db.classes.insert( {
        "name": name,
        "description": description,
        "creator": creator,
        "participants": participants
    } )

    return "OK"

#redirecionando para painel de gerenciamento de turmas
@app.route("/classes/<class_id>/", methods=["GET"])
def get_class_by_id(class_id):
    result = db.classes.find_one( {"_id": ObjectId(class_id)} )

    c = {"name": result["name"], "description": result["description"]}

    return jsonify(c)


#redirecionando para painel de gerenciamento de turmas
@app.route("/classroom/classes/<class_id>/", methods=["GET"])
def get_class(class_id):
    try:
        c = db.classes.find_one( {"_id": ObjectId(class_id)} )

        if(session["_id"] == str(c["creator"]["_id"])):
            tasks = db.tasks.find({"class._id": c["_id"]}).sort([("deadline", -1)])

            invites = db.invites.find({"class._id": c["_id"], "type": "normal"})

            warnings = db.warnings.find({"class._id": c["_id"]})

            users = []

            for user_id in c["participants"]:
                u = db.users.find_one(user_id)
                users.append(u)

            return render_template("classes/index.html", c=c, tasks=tasks, invites=invites, warnings=warnings, participants=users)

    except Exception as e:
        return render_template("errors/403.html")

#removendo turma
@app.route("/classroom/classes/<class_id>/", methods=["DELETE"])
def delete_class(class_id):
    db.classes.remove({"_id": ObjectId(class_id)})

    return "OK"


#atualizando turma
@app.route("/classroom/classes/<class_id>/", methods=["PUT"])
def update_class(class_id):
    name = request.form.get("name")
    description = request.form.get("description")

    db.classes.update({"_id": ObjectId(class_id)}, {"$set": {"name": name, "description": description}})

    return "OK"


#deixando de participar de uma turma
@app.route("/classroom/classes/<class_id>/participants/", methods=["DELETE"])
def left_class(class_id):
    if '_id' in session:
        db.classes.update({"_id": ObjectId(class_id)}, {"$pull": {"participants": ObjectId(session["_id"])}})

        return "OK"

#enviando convite por email para usúario
@app.route("/classroom/classes/<class_id>/participants/", methods=["PUT"])
def add_participant(class_id):
    try:
        email = request.form.get("email")
        classe = db.classes.find_one({"_id": ObjectId(class_id)})
        user = db.users.find_one({"email": email})
        invite_id = db.invites.insert_one({"user": user, "class": classe}).inserted_id

        msg = Message(
                  'Convite Classroom',
                   sender='lawsclassroom@gmail.com',
                   recipients=
                   [email])
        msg.html = "Você foi convidado para participar de {0} no Classroom!<br><a href='http://200.137.131.118/classroom/invites/{1}/entry/'>Aceitar</a>".format(classe["name"], invite_id)
        mail.send(msg)
        return "Sent"
    except Exception as e:
        return "error", 400


@app.route("/classroom/invites/<invite_id>/entry/")
def entry_at_class(invite_id):
    try:
        if '_id' in session:
            user = db.users.find_one({"_id": ObjectId(session["_id"])})
            invite = db.invites.find_one({"_id": ObjectId(invite_id)})

            if str(user["_id"]) == str(invite["user"]["_id"]):
                db.classes.update({"_id": ObjectId(invite["class"]["_id"])}, {"$addToSet": {"participants": user["_id"]}})

                db.invites.remove({"_id": ObjectId(invite_id)})
                return redirect("/classroom/")
            else:
                return render_template("errors/403.html")
    except Exception as e:
        return render_template("errors/403.html")
