from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(512), nullable=False)
    bio = db.Column(db.Text, default="")
    skills = db.Column(db.Text, default="")  # Comma-separated skills
    work_experience = db.Column(db.Text, default="")
    education = db.Column(db.Text, default="")
    contact_info = db.Column(db.Text, default="")
    image_url = db.Column(db.String(256), default="")
    is_admin = db.Column(db.Boolean, default=False)

    def __init__(self, username, email, password_hash=None, bio="", skills="", work_experience="", education="", contact_info="", image_url="", is_admin=False):
        self.username = username
        self.email = email
        if password_hash:
            self.password_hash = password_hash
        self.bio = bio
        self.skills = skills
        self.work_experience = work_experience
        self.education = education
        self.contact_info = contact_info
        self.image_url = image_url
        self.is_admin = is_admin

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def update_profile(self, data):
        # Update only provided fields
        for field in ["bio", "skills", "work_experience", "education", "contact_info", "image_url"]:
            if field in data:
                setattr(self, field, data[field])

class Notification(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=db.func.now())
