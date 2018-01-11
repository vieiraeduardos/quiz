from flask import render_template

from quiz_service import app


#Redirecionando para o índice da aplicação
@app.route("/quiz_service/")
def index():
    return render_template("index.html")
