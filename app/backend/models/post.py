from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from models.user import User, db

class Post(db.Model):
    __tablename__ = 'posts'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    media_url = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    title = db.Column(db.String(120), nullable=False)
    tags = db.Column(db.String(255), nullable=True)
    visibility = db.Column(db.String(10), default='public')
    # Add metadata fields as needed for future search/indexing
    # e.g., tags, is_public, etc.

    user = db.relationship('User', backref=db.backref('posts', lazy=True))

    def __init__(self, user_id, content, media_url=None, title='', tags='', visibility='public'):
        self.user_id = user_id
        self.content = content
        self.media_url = media_url
        self.title = title
        self.tags = tags
        self.visibility = visibility

class PostReaction(db.Model):
    __tablename__ = 'post_reactions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref=db.backref('post_reactions', lazy=True))
    post = db.relationship('Post', backref=db.backref('reactions', lazy=True))
    
    __table_args__ = (db.UniqueConstraint('user_id', 'post_id', name='unique_user_post_like'),)

class PostComment(db.Model):
    __tablename__ = 'post_comments'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('post_comments.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('comments', lazy=True))
    post = db.relationship('Post', backref=db.backref('comments', lazy=True))
    replies = db.relationship('PostComment', backref=db.backref('parent', remote_side=[id]), lazy=True)

    def __init__(self, user_id, post_id, content, parent_id=None):
        self.user_id = user_id
        self.post_id = post_id
        self.content = content
        self.parent_id = parent_id

class PostView(db.Model):
    __tablename__ = 'post_views'
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    viewed_at = db.Column(db.DateTime, default=datetime.utcnow)

    post = db.relationship('Post', backref=db.backref('views', lazy=True))
