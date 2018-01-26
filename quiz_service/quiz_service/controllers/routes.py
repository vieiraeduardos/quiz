from flask import render_template, request, redirect, session

from quiz_service import app
from quiz_service import db

#Redirecionando para o índice da aplicação
@app.route("/quiz_service/", methods=["GET"])
def index():
    if "email" in session:
        created_tests = db.tests.find(
                        {
                            "creator.email" : session["email"]
                        })
        tests = db.tests.find(
                {
                    "people" : session["email"]
                })

        return render_template("index.html", created_tests=created_tests, tests=tests)

    return redirect("/quiz_service/login/")

#Redirecionando para dashboard
@app.route("/quiz_service/dashboard/", methods=["GET"])
def dashboard():
    return render_template("dashboard/index.html")
