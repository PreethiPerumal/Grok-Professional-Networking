from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import db, User, Notification
import os
from werkzeug.utils import secure_filename
from PIL import Image
import time
import uuid

profile_bp = Blueprint('profile', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads', 'profile_images')
THUMBNAIL_FOLDER = os.path.join(UPLOAD_FOLDER, 'thumbnails')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
MAX_IMAGE_DIMENSIONS = (1024, 1024)  # Max width/height
THUMBNAIL_SIZE = (150, 150)  # Thumbnail size

# Create directories if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(THUMBNAIL_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def generate_unique_filename(user_id, extension):
    """Generate a unique filename with UUID to prevent conflicts"""
    unique_id = str(uuid.uuid4())[:8]
    timestamp = int(time.time())
    return f"profile_{user_id}_{timestamp}_{unique_id}.{extension}"

def process_image(image_path, output_path, max_size=None, quality=85):
    """Process image with compression, resizing, and format conversion"""
    try:
        with Image.open(image_path) as img:
            # Convert to RGB if necessary
            if img.mode in ('RGBA', 'LA', 'P'):
                img = img.convert('RGB')
            
            # Resize if max_size is specified
            if max_size:
                img.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            # Save with compression
            img.save(output_path, format='JPEG', quality=quality, optimize=True)
            return True
    except Exception as e:
        print(f"Image processing error: {e}")
        return False

@profile_bp.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    profile = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'bio': user.bio,
        'skills': user.skills,
        'work_experience': user.work_experience,
        'education': user.education,
        'contact_info': user.contact_info,
        'image_url': user.image_url
    }
    return jsonify(profile), 200

@profile_bp.route('/api/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    data = request.get_json()
    allowed_fields = ["username", "email", "bio", "skills", "work_experience", "education", "contact_info", "image_url"]
    update_data = {k: v for k, v in data.items() if k in allowed_fields}
    # Validation rules
    for field, value in update_data.items():
        if not isinstance(value, str):
            return jsonify({'error': f'{field} must be a string'}), 400
        if field == 'username':
            if len(value) > 80:
                return jsonify({'error': 'Username must be 80 characters or less.'}), 400
            # Check uniqueness
            existing = type(user).query.filter_by(username=value).filter(type(user).id != user_id).first()
            if existing:
                return jsonify({'error': 'Username already exists.'}), 400
        if field == 'email':
            if len(value) > 120 or not ("@" in value and "." in value):
                return jsonify({'error': 'Enter a valid email address (max 120 chars).'}), 400
            # Check uniqueness
            existing = type(user).query.filter_by(email=value).filter(type(user).id != user_id).first()
            if existing:
                return jsonify({'error': 'Email already exists.'}), 400
        if field == 'bio' and len(value) > 1000:
            return jsonify({'error': 'Bio too long (max 1000 chars)'}), 400
        if field == 'skills' and len(value) > 500:
            return jsonify({'error': 'Skills too long (max 500 chars)'}), 400
        if field == 'work_experience' and len(value) > 2000:
            return jsonify({'error': 'Work experience too long (max 2000 chars)'}), 400
        if field == 'education' and len(value) > 1000:
            return jsonify({'error': 'Education too long (max 1000 chars)'}), 400
        if field == 'contact_info' and len(value) > 500:
            return jsonify({'error': 'Contact info too long (max 500 chars)'}), 400
        if field == 'image_url' and len(value) > 256:
            return jsonify({'error': 'Image URL too long (max 256 chars)'}), 400
    if not update_data:
        return jsonify({'error': 'No valid fields to update'}), 400
    # Actually update fields
    for field, value in update_data.items():
        setattr(user, field, value)
    db.session.commit()
    profile = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'bio': user.bio,
        'skills': user.skills,
        'work_experience': user.work_experience,
        'education': user.education,
        'contact_info': user.contact_info,
        'image_url': user.image_url
    }
    return jsonify(profile), 200

@profile_bp.route('/api/profile/image', methods=['POST'])
@jwt_required()
def upload_profile_image():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Check if image file is present
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Validate file type
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Only jpg, jpeg, png allowed.'}), 400
    
    # Check file size
    file.seek(0, os.SEEK_END)
    file_length = file.tell()
    file.seek(0)
    if file_length > MAX_FILE_SIZE:
        return jsonify({'error': f'File too large (max {MAX_FILE_SIZE // (1024*1024)}MB)'}), 400
    
    # Generate unique filename
    if not file.filename or '.' not in file.filename:
        return jsonify({'error': 'Invalid filename'}), 400
    ext = file.filename.rsplit('.', 1)[1].lower()
    filename = generate_unique_filename(user_id, ext)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    
    try:
        # Save original file temporarily
        file.save(filepath)
        
        # Process the image (resize, compress, convert to JPEG)
        processed_filename = f"{filename.rsplit('.', 1)[0]}.jpg"
        processed_filepath = os.path.join(UPLOAD_FOLDER, processed_filename)
        
        if not process_image(filepath, processed_filepath, MAX_IMAGE_DIMENSIONS, quality=85):
            # Clean up on failure
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({'error': 'Image processing failed'}), 400
        
        # Generate thumbnail
        thumbnail_filename = f"thumb_{processed_filename}"
        thumbnail_filepath = os.path.join(THUMBNAIL_FOLDER, thumbnail_filename)
        
        if not process_image(processed_filepath, thumbnail_filepath, THUMBNAIL_SIZE, quality=80):
            # Clean up on failure
            if os.path.exists(filepath):
                os.remove(filepath)
            if os.path.exists(processed_filepath):
                os.remove(processed_filepath)
            return jsonify({'error': 'Thumbnail generation failed'}), 400
        
        # Remove original file (keep only processed version)
        if os.path.exists(filepath):
            os.remove(filepath)
        
        # Update user profile with new image URL
        user.image_url = f'/uploads/profile_images/{processed_filename}'
        db.session.commit()
        
        return jsonify({
            'image_url': user.image_url,
            'thumbnail_url': f'/uploads/profile_images/thumbnails/{thumbnail_filename}',
            'message': 'Profile image uploaded successfully'
        }), 200
        
    except Exception as e:
        # Clean up any files that might have been created
        for path in [filepath, processed_filepath, thumbnail_filepath]:
            if 'path' in locals() and os.path.exists(path):
                os.remove(path)
        return jsonify({'error': 'Image upload failed', 'details': str(e)}), 400

@profile_bp.route('/api/users', methods=['GET'])
def list_users():
    users = User.query.with_entities(User.id, User.username).all()
    return jsonify([{'id': u.id, 'username': u.username} for u in users])

@profile_bp.route('/api/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()
    notifs = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).all()
    return jsonify([
        {
            'id': n.id,
            'message': n.message,
            'is_read': n.is_read,
            'created_at': n.created_at.isoformat()
        } for n in notifs
    ])

@profile_bp.route('/api/notifications/<int:notif_id>/read', methods=['PATCH'])
@jwt_required()
def mark_notification_read(notif_id):
    user_id = get_jwt_identity()
    notif = Notification.query.filter_by(id=notif_id, user_id=user_id).first_or_404()
    notif.is_read = True
    db.session.commit()
    return jsonify({'message': 'Notification marked as read.'})

