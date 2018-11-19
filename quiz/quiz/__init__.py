from flask import Flask
from pymongo import MongoClient

app = Flask(__name__);

app.config["SECRET_KEY"] = "secret key"

client = MongoClient("mongodb://eduardo:secretPassword@200.137.131.118/classroomdb")
db = client.classroomdb

from quiz.controllers.quiz import routes, CourseController, QuestionController, TopicController, UserController, TestController, AnswerController, ClassController
