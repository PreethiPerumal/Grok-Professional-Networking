import pymysql
pymysql.install_as_MySQLdb()

from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from dotenv import load_dotenv
from flask_migrate import Migrate
import os

from models.user import db, User
from api.auth import auth_bp
from api.profile import profile_bp
from api.posts import posts_bp

# Load environment variables
load_dotenv()

# Import models
# from models.profile import Profile, Skill, Experience, Education

# Create Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
CORS(app, origins=["http://localhost:5173"])
JWTManager(app)

# Initialize database
db.init_app(app)
migrate = Migrate(app, db)

# Serve uploaded files
@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    uploads_dir = os.path.join(os.path.dirname(__file__), 'uploads')
    return send_from_directory(uploads_dir, filename)

def setup_database():
    """Setup database tables"""
    with app.app_context():
        db.create_all()
        print("✅ Database tables created successfully!")

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(profile_bp)
app.register_blueprint(posts_bp)

# Create a function to initialize the app
def create_app():
    """Application factory function"""
    return app

if __name__ == '__main__':
    # Setup database tables
    setup_database()
    
    # Run the app
    app.run(debug=True) 