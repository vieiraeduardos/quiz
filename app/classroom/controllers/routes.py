#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import session, render_template, redirect

from bson.objectid import ObjectId

from classroom import app
from classroom import db

# Rota para acessar página inicial da aplicação
@app.route("/classroom/", methods=["GET"])
def index():
    # Verifica se o usuário está logado, procurando pelo email dele na sessão
    if "email" in session:
        # Pegue do banco de dados as classes deste usuário
        classes = db.classes.find( {"creator.email": session["email"]} )
        # ?
        my_classes = db.classes.find( {"participants": {"$in": [ObjectId(session["_id"])]}} )

        # Renderiza a página principal mostrando as classes do usuário logado
        return render_template("index.html", classes=classes, my_classes=my_classes, user=session["_id"])

    # Redireciona o usuário para página de login
    return redirect("/classroom/login/")


@app.route("/classroom/quiz/", methods=["GET"])
def index_quiz():

    # Verifica se o usuário está logado, procurando pelo email dele na sessão
    if "email" in session:

        # Requisita do banco os quizes criados pelo usuário
        quizzes = db.tests.find(
                        {
                            "creator._id" : ObjectId(session["_id"])
                        })

        # Renderiza a página mostrando os quizes do usuário logado
        return render_template("index.html", quizzes=quizzes)

    # Redireciona o usuário para página de login
    return redirect("/classroom/quiz/login/")

# Rota para acessar página de tarefas
@app.route("/classroom/questions/",methods=['GET'])
def index_questions():
        # Verifica se o usuário está logado, procurando pelo email dele na sessão
        if "email" in session:

            # Requisita do banco todas as questões
            questions = db.questions.find()

            # Renderiza a página mostrando todas questões
            return render_template("index.html", questions=questions)

        # Redireciona o usuário para página de login
        return redirect("/classroom")
