from flask import jsonify, request, render_template
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


#Redirecioando usuário para a página de login
@app.route("/quiz_service/login/", methods=["GET"])
def redirect_login():
    return render_template("login/index.html")


#Verificando a autenticação do usuário
@app.route("/quiz_service/login/", methods=["POST"])
def login():
    email = request.form.get("email")
    password = request.form.get("password")

    user = db.user.find_one({"email": email, "password": password})

    if user:
        return redirect("/quiz_service/")
    else:
        return render_template("login/index.html")


#Redirecionando usuário para a página de signup
@app.route("/quiz_service/signup/", methods=["GET"])
def redirect_signup():
    return render_template("signup/index.html")


#Cadastrando um novo usuário
@app.route("/quiz_service/signup/", methods=["POST"])
def signup():
    name = request.form.get("name")
    email = request.form.get("email")
    password = request.form.get("password")

    db.user.insert_one({"name": name, "email": email, "password": password})

    return redirect("/quiz_service/")
