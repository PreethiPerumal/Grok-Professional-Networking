from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    bio = db.Column(db.String(256))

class Skill(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    profile_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(64), nullable=False)

class Experience(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    profile_id = db.Column(db.Integer, nullable=False)
    company = db.Column(db.String(128))
    role = db.Column(db.String(128))
    start_date = db.Column(db.String(32))
    end_date = db.Column(db.String(32))

class Education(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    profile_id = db.Column(db.Integer, nullable=False)
    institution = db.Column(db.String(128))
    degree = db.Column(db.String(128))
    start_year = db.Column(db.String(16))
    end_year = db.Column(db.String(16))
