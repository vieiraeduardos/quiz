from flask import jsonify, request, render_template, redirect, session
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash

from quiz import app
from quiz import db

#Retornando todas os usuários no BD
@app.route("/quiz/users/", methods=["GET"])
def get_all_users():
    result = db.users.find()

    users = []
    for item in result:
        if item["_id"]:
            item["_id"] = str(item["_id"])
        users.append(item)

    return jsonify(users)


#Redirecionando usuário para a página de login
@app.route("/quiz/login/", methods=["GET"])
def redirect_login():
    return render_template("login/index.html")


#Verificando a autenticação do usuário
@app.route("/quiz/login/", methods=["POST"])
def login():
    email = request.form.get("email")
    password = request.form.get("password")

    user = db.users.find_one(
            {
                "email": email
            })
    if user:
        if check_password_hash(user["password"], password):
            session["email"] = user["email"]
            return redirect("/quiz/")

    error = "E-mail ou senha estão incorretos!"
    return render_template("login/index.html", error=error)


#Redirecionando usuário para a página de signup
@app.route("/quiz/signup/", methods=["GET"])
def redirect_signup():
    return render_template("signup/index.html")


#Cadastrando um novo usuário
@app.route("/quiz/signup/", methods=["POST"])
def signup():
    name = request.form.get("name")
    email = request.form.get("email")
    password = generate_password_hash(request.form.get("password"))

    db.users.insert_one(
    {
        "name": name,
        "email": email,
        "password": password
    })

    return redirect("/quiz/")

#Logout do sistema
@app.route("/quiz/logout/", methods=["GET"])
def logout():
    session.pop("email", None)
    return redirect("/quiz/login/")
