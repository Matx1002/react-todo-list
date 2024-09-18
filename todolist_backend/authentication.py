import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from models import User, db
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('POSTGRES_URL')
app.config['JWT_SECRET_KEY'] = os.getenv('POSTGRES_URL')

# db = SQLAlchemy(app)
db.init_app(app)
with app.app_context():
    db.create_all()
jwt = JWTManager(app)

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'msg': 'Missing username or password'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'msg': 'Username already exists'}), 400

    user = User(username=username)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({'msg': 'User registered successfully'}), 201


# Login user and return JWT token
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if user and user.check_password(password):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({'msg': 'Invalid credentials'}), 401


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
