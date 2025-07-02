import pymysql
pymysql.install_as_MySQLdb()

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from dotenv import load_dotenv

from models.user import db, User
from api.auth import auth_bp

# Load environment variables
load_dotenv()

# Import models
# from models.profile import Profile, Skill, Experience, Education

# Create Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
CORS(app)
JWTManager(app)

# Initialize database
db.init_app(app)

def setup_database():
    """Setup database tables"""
    with app.app_context():
        db.create_all()
        print("✅ Database tables created successfully!")

# Register blueprints
app.register_blueprint(auth_bp)

# Create a function to initialize the app
def create_app():
    """Application factory function"""
    return app

if __name__ == '__main__':
    # Setup database tables
    setup_database()
    
    # Run the app
    app.run(debug=True) 