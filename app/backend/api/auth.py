from flask import Blueprint, request, jsonify
from models.user import db, User
from flask_jwt_extended import create_access_token
from sqlalchemy.exc import IntegrityError
from sqlalchemy import or_
from werkzeug.security import check_password_hash
from models.profile import Profile, Skill, Experience, Education

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    is_admin = data.get('is_admin', False)
    if not username or not email or not password:
        return jsonify({'error': 'Missing required fields'}), 400
    user = User(
        username=username,
        email=email,
        bio="",
        skills="",
        work_experience="",
        education="",
        contact_info="",
        image_url="",
        is_admin=is_admin
    )
    user.set_password(password)
    db.session.add(user)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Username or email already exists'}), 400
    return jsonify({'message': 'User created'}), 201

@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    identifier = data.get('username') or data.get('email')
    password = data.get('password')
    if not identifier or not password:
        return jsonify({'error': 'Missing credentials'}), 400
    user = User.query.filter(or_(User.username == identifier, User.email == identifier)).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity=str(user.id))
        return jsonify({'token': access_token, 'user': {'id': user.id, 'username': user.username, 'email': user.email}}), 200
    return jsonify({'error': 'Invalid credentials'}), 401

# Routes will be implemented here 