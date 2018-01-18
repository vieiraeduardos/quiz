from flask import render_template, request, redirect

from quiz_service import app
from quiz_service import db

#Redirecionando para o índice da aplicação
@app.route("/quiz_service/")
def index():
    return render_template("index.html")


@app.route("/quiz_service/dashboard/", methods=["GET"])
def dashboard():
    return render_template("dashboard/index.html")
