from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
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

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def update_profile(self, data):
        # Update only provided fields
        for field in ["bio", "skills", "work_experience", "education", "contact_info", "image_url"]:
            if field in data:
                setattr(self, field, data[field])
