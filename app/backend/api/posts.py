from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from models.user import db, User, Notification
from models.post import Post, PostReaction, PostComment, PostView
from datetime import datetime, timedelta
from sqlalchemy import or_
import re

posts_bp = Blueprint('posts', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'avi'}
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '../uploads/posts')
MAX_FILE_SIZE_MB = 10
MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def notify_mentions(content, actor_id, context):
    mentioned_usernames = set(re.findall(r'@([A-Za-z0-9_]+)', content))
    for username in mentioned_usernames:
        user = User.query.filter_by(username=username).first()
        if user and user.id != actor_id:
            message = f'You were mentioned in a {context}.'
            notif = Notification(user_id=user.id, message=message)
            db.session.add(notif)
    db.session.commit()

@posts_bp.route('/api/posts', methods=['POST'])
@jwt_required()
def create_post():
    user_id = get_jwt_identity()
    title = request.form.get('title', '').strip()
    content = request.form.get('content')
    tags = request.form.get('tags', '').strip()
    visibility = request.form.get('visibility', 'public').strip()
    if not title:
        return jsonify({'error': 'Title is required.'}), 400
    if not content or content.strip() == '':
        return jsonify({'error': 'Content is required.'}), 400
    if visibility not in ['public', 'private']:
        return jsonify({'error': 'Invalid visibility value.'}), 400

    media_url = None
    if 'media' in request.files:
        file = request.files['media']
        if file and allowed_file(file.filename):
            file.seek(0, 2)
            file_length = file.tell()
            file.seek(0)
            if file_length > MAX_FILE_SIZE:
                return jsonify({'error': f'Media file too large (max {MAX_FILE_SIZE_MB}MB).'}), 400
            filename = secure_filename(f"{user_id}_{int(datetime.utcnow().timestamp())}_{file.filename}")
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)
            media_url = f"/uploads/posts/{filename}"
        else:
            return jsonify({'error': 'Invalid media file type.'}), 400

    post = Post(user_id=user_id, content=content, media_url=media_url, title=title, tags=tags, visibility=visibility)
    db.session.add(post)
    db.session.commit()
    notify_mentions(content, user_id, 'post')

    return jsonify({
        'id': post.id,
        'user_id': post.user_id,
        'title': post.title,
        'content': post.content,
        'tags': post.tags,
        'visibility': post.visibility,
        'media_url': post.media_url,
        'created_at': post.created_at.isoformat()
    }), 201

@posts_bp.route('/api/posts', methods=['GET'])
def list_posts():
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    tag_filter = request.args.get('tag')
    visibility = request.args.get('visibility')
    q = request.args.get('q')

    query = Post.query
    if tag_filter:
        query = query.filter(Post.tags.ilike(f'%{tag_filter}%'))
    if visibility in ['public', 'private']:
        query = query.filter(Post.visibility == visibility)
    if q:
        query = query.filter(or_(Post.title.ilike(f'%{q}%'), Post.content.ilike(f'%{q}%')))

    posts = query.order_by(Post.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        'posts': [
            {
                'id': post.id,
                'user_id': post.user_id,
                'title': post.title,
                'content': post.content,
                'tags': post.tags,
                'visibility': post.visibility,
                'media_url': post.media_url,
                'created_at': post.created_at.isoformat(),
                'like_count': len(post.reactions)
            } for post in posts.items
        ],
        'total': posts.total,
        'page': posts.page,
        'per_page': posts.per_page,
        'pages': posts.pages
    })

@posts_bp.route('/api/posts/<int:post_id>', methods=['PUT'])
@jwt_required()
def edit_post(post_id):
    user_id = get_jwt_identity()
    post = Post.query.get_or_404(post_id)
    if post.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    data = request.form
    title = data.get('title', post.title).strip()
    content = data.get('content', post.content)
    tags = data.get('tags', post.tags).strip()
    visibility = data.get('visibility', post.visibility).strip()
    if not title:
        return jsonify({'error': 'Title is required.'}), 400
    if not content or content.strip() == '':
        return jsonify({'error': 'Content is required.'}), 400
    if visibility not in ['public', 'private']:
        return jsonify({'error': 'Invalid visibility value.'}), 400
    post.title = title
    post.content = content
    post.tags = tags
    post.visibility = visibility
    # Media update not supported in edit for simplicity
    db.session.commit()
    return jsonify({'message': 'Post updated successfully.'})

@posts_bp.route('/api/posts/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    user_id = get_jwt_identity()
    post = Post.query.get_or_404(post_id)
    if post.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    db.session.delete(post)
    db.session.commit()
    return jsonify({'message': 'Post deleted successfully.'})

@posts_bp.route('/api/posts/<int:post_id>/like', methods=['POST'])
@jwt_required()
def like_post(post_id):
    user_id = get_jwt_identity()
    post = Post.query.get_or_404(post_id)
    existing = PostReaction.query.filter_by(user_id=user_id, post_id=post_id).first()
    if existing:
        return jsonify({'error': 'Already liked'}), 400
    reaction = PostReaction(user_id=user_id, post_id=post_id)
    db.session.add(reaction)
    db.session.commit()
    like_count = PostReaction.query.filter_by(post_id=post_id).count()
    return jsonify({'message': 'Post liked', 'like_count': like_count})

@posts_bp.route('/api/posts/<int:post_id>/like', methods=['DELETE'])
@jwt_required()
def unlike_post(post_id):
    user_id = get_jwt_identity()
    reaction = PostReaction.query.filter_by(user_id=user_id, post_id=post_id).first()
    if not reaction:
        return jsonify({'error': 'Not liked yet'}), 400
    db.session.delete(reaction)
    db.session.commit()
    like_count = PostReaction.query.filter_by(post_id=post_id).count()
    return jsonify({'message': 'Post unliked', 'like_count': like_count})

# Helper to build comment tree
def build_comment_tree(comments):
    comment_dict = {c.id: {**c.__dict__, 'replies': []} for c in comments}
    root_comments = []
    for c in comments:
        if c.parent_id:
            comment_dict[c.parent_id]['replies'].append(comment_dict[c.id])
        else:
            root_comments.append(comment_dict[c.id])
    # Remove SQLAlchemy state from dicts
    for c in comment_dict.values():
        c.pop('_sa_instance_state', None)
    return root_comments

@posts_bp.route('/api/posts/<int:post_id>/comments', methods=['GET'])
def get_comments(post_id):
    post = Post.query.get_or_404(post_id)
    comments = PostComment.query.filter_by(post_id=post_id).order_by(PostComment.created_at.asc()).all()
    tree = build_comment_tree(comments)
    return jsonify(tree)

@posts_bp.route('/api/posts/<int:post_id>/comments', methods=['POST'])
@jwt_required()
def add_comment(post_id):
    user_id = get_jwt_identity()
    post = Post.query.get_or_404(post_id)
    data = request.get_json()
    content = data.get('content', '').strip()
    parent_id = data.get('parent_id')
    if not content:
        return jsonify({'error': 'Content is required.'}), 400
    comment = PostComment(user_id=user_id, post_id=post_id, content=content, parent_id=parent_id)
    db.session.add(comment)
    db.session.commit()
    notify_mentions(content, user_id, 'comment')
    return jsonify({'message': 'Comment added.'}), 201

@posts_bp.route('/api/posts/<int:post_id>', methods=['GET'])
@jwt_required(optional=True)
def get_post(post_id):
    post = Post.query.get_or_404(post_id)
    user_id = get_jwt_identity()
    # Record view
    view = PostView(post_id=post_id, user_id=user_id)
    db.session.add(view)
    db.session.commit()
    # Prepare response
    return jsonify({
        'id': post.id,
        'user_id': post.user_id,
        'title': post.title,
        'content': post.content,
        'tags': post.tags,
        'visibility': post.visibility,
        'media_url': post.media_url,
        'created_at': post.created_at.isoformat(),
        'like_count': len(post.reactions),
        'comment_count': len(post.comments),
        'view_count': len(post.views)
    })

@posts_bp.route('/api/posts/trending', methods=['GET'])
def trending_posts():
    since = datetime.utcnow() - timedelta(days=7)
    posts = (
        Post.query
        .join(PostView)
        .filter(PostView.viewed_at >= since)
        .group_by(Post.id)
        .order_by(db.func.count(PostView.id).desc())
        .limit(5)
        .all()
    )
    return jsonify([
        {
            'id': post.id,
            'user_id': post.user_id,
            'title': post.title,
            'content': post.content,
            'tags': post.tags,
            'visibility': post.visibility,
            'media_url': post.media_url,
            'created_at': post.created_at.isoformat(),
            'like_count': len(post.reactions),
            'comment_count': len(post.comments),
            'view_count': len(post.views)
        } for post in posts
    ])

@posts_bp.route('/api/admin/posts/<int:post_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_post(post_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return jsonify({'error': 'Admin only'}), 403
    post = Post.query.get_or_404(post_id)
    db.session.delete(post)
    db.session.commit()
    return jsonify({'message': 'Post deleted by admin.'})

@posts_bp.route('/api/admin/users', methods=['GET'])
@jwt_required()
def admin_list_users():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return jsonify({'error': 'Admin only'}), 403
    users = User.query.all()
    return jsonify([
        {
            'id': u.id,
            'username': u.username,
            'email': u.email,
            'is_admin': u.is_admin,
            'post_count': len(u.posts) if hasattr(u, 'posts') else 0
        } for u in users
    ])

@posts_bp.route('/api/posts/search', methods=['GET'])
def search_posts():
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    q = request.args.get('q')
    user_id = request.args.get('user_id')
    tag = request.args.get('tag')
    date_from = request.args.get('date_from')
    date_to = request.args.get('date_to')

    query = Post.query
    if q:
        query = query.filter(or_(Post.title.ilike(f'%{q}%'), Post.content.ilike(f'%{q}%')))
    if user_id:
        query = query.filter(Post.user_id == int(user_id))
    if tag:
        query = query.filter(Post.tags.ilike(f'%{tag}%'))
    if date_from:
        query = query.filter(Post.created_at >= date_from)
    if date_to:
        query = query.filter(Post.created_at <= date_to)

    posts = query.order_by(Post.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        'posts': [
            {
                'id': post.id,
                'user_id': post.user_id,
                'title': post.title,
                'content': post.content,
                'tags': post.tags,
                'visibility': post.visibility,
                'media_url': post.media_url,
                'created_at': post.created_at.isoformat(),
                'like_count': len(post.reactions),
                'comment_count': len(post.comments),
                'view_count': len(post.views)
            } for post in posts.items
        ],
        'total': posts.total,
        'page': posts.page,
        'per_page': posts.per_page,
        'pages': posts.pages
    })

# Routes will be implemented here 