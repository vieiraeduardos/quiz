from flask import Flask
from pymongo import MongoClient

app = Flask(__name__);

client = MongoClient('mongodb://localhost:27017/')
db = client.quizservicedb

from quiz_service.controllers import routes
from quiz_service.controllers import AbstractController
from quiz_service.controllers import QuestionController
from quiz_service.controllers import TopicController
