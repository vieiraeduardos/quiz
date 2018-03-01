from flask import Flask
from pymongo import MongoClient

app = Flask(__name__);

app.config["SECRET_KEY"] = "secret key"

client = MongoClient('mongodb://localhost:27017/')
db = client.quizdb

from quiz.controllers import routes
from quiz.controllers import CourseController
from quiz.controllers import QuestionController
from quiz.controllers import TopicController
from quiz.controllers import UserController
from quiz.controllers import TestController
from quiz.controllers import AnswerController
from quiz.controllers import ClassController
