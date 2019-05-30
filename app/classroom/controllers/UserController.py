#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import request, render_template, redirect, session
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash


from classroom import app
from classroom import db

#Verificando a autenticação do usuário
@app.route("/classroom/users/<user_id>/password/", methods=["PUT"])
def update_password(user_id):
    currentPassword = request.form.get("currentPassword")
    password = request.form.get("newPassword")

    user = db.users.find_one( {"_id": ObjectId(user_id)} )

    print(currentPassword)
    print(password)

    if user:
        if check_password_hash(user["password"], currentPassword):
            password = generate_password_hash(password)

            db.users.update({"_id": ObjectId(user_id)}, {"$set": {"password": password}})

            return "OK", 200

    return "Senha incorreta!", 400


@app.route("/classroom/users/<user_id>/", methods=["PUT"])
def update_user(user_id):
    try:
        name = request.form.get("name")
        email = request.form.get("email")

        u = db.users.find_one({"email": email})

        if u:
            user = db.users.find_one({"_id": ObjectId(user_id)})

            if user["email"] != email:
                return "Este e-mail já está sendo usado por outro usuário!", 400

        db.users.update({"_id": ObjectId(user_id)}, {"$set": {"name": name, "email": email}})

        return "OK", 200
    except:
        return "Error", 400


#redirecionando para página de edição de usuário
@app.route("/classroom/users/", methods=["GET"])
def redirect_user():
    user = db.users.find_one({"_id": ObjectId(session["_id"])});

    return render_template("users/edit-user.html", user=user), 200


#Redirecionando usuário para a página de login
@app.route("/classroom/login/", methods=["GET"])
def redirect_login():
    return render_template("login/login.html")


#Redirecionando usuário para a página de login
@app.route("/classroom/quiz/login/", methods=["GET"])
def redirect_quiz_login():
    return render_template("quiz/login/login.html")


#Verificando a autenticação do usuário
@app.route("/classroom/login/", methods=["POST"])
def login():
    email = request.form.get("email")
    password = request.form.get("password")

    user = db.users.find_one( {"email": email} )

    if user:
        if check_password_hash(user["password"], password):
            session["email"] = user["email"]
            session["_id"] = str(user["_id"])
            return redirect("/classroom/")

    error = "E-mail ou senha estão incorretos!"
    return render_template("login/login.html", error=error)


#Verificando a autenticação do usuário
@app.route("/quiz/login/", methods=["POST"])
def login_quiz():
    email = request.form.get("email")
    password = request.form.get("password")

    user = db.users.find_one( {"email": email} )

    if user:
        if check_password_hash(user["password"], password):
            session["email"] = user["email"]
            session["_id"] = str(user["_id"])
            return redirect("/classroom/quiz/")

    error = "E-mail ou senha estão incorretos!"
    return render_template("quiz/login/login.html", error=error)



#Redirecionando usuário para a página de signup
@app.route("/classroom/signup/", methods=["GET"])
def redirect_signup():
    return render_template("signup/signup.html")


#Redirecionando usuário para a página de signup
@app.route("/classroom/quiz/signup/", methods=["GET"])
def redirect_quiz_signup():
    return render_template("quiz/signup/signup.html")


#Cadastrando um novo usuário
@app.route("/classroom/signup/", methods=["POST"])
def signup():
    name = request.form.get("name")
    email = request.form.get("email")
    password = generate_password_hash(request.form.get("password"))

    user = db.users.find_one({"email": email})

    if user:
        return render_template("signup/signup.html", error="E-mail já está sendo usado por outro usuário!")
    else:
        db.users.insert_one(
        {
            "name": name,
            "email": email,
            "password": password
        })

        return redirect("/classroom/")

#Cadastrando um novo usuário
@app.route("/quiz/signup/", methods=["POST"])
def signup_quiz():
    name = request.form.get("name")
    email = request.form.get("email")
    password = generate_password_hash(request.form.get("password"))

    user = db.users.find_one({"email": email})

    if user:
        return render_template("quiz/signup/signup.html", error="E-mail já está sendo usado por outro usuário!")
    else:
        db.users.insert_one(
        {
            "name": name,
            "email": email,
            "password": password
        })

        return redirect("/classroom/quiz/")



#Logout do sistema
@app.route("/classroom/logout/", methods=["GET"])
def logout():
    session.pop("email", None)
    session.pop("_id", None)
    return redirect("/classroom/login/")
