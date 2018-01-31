from flask import render_template, request, redirect, session

from quiz import app
from quiz import db

#Redirecionando para o índice da aplicação
@app.route("/quiz/", methods=["GET"])
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

    return redirect("/quiz/login/")

#Redirecionando para dashboard
@app.route("/quiz/dashboard/", methods=["GET"])
def dashboard():
    return render_template("dashboard/index.html")
