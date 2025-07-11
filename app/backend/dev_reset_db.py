from main import app
from models.user import db

if __name__ == "__main__":
    with app.app_context():
        print("Dropping all tables...")
        db.drop_all()
        print("All tables dropped.")
        print("Creating all tables...")
        db.create_all()
        print("✅ Database reset complete!") 