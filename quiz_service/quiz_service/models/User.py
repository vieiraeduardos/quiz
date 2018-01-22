
from quiz_service import db

class User():
    def get_user_by_email(self, email):
        return db.user.find({"email": email})
