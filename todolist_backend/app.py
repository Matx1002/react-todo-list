import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from models import Todo, db
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

# Protect to-do routes with JWT
@app.route('/todos', methods=['GET', 'POST'])
@jwt_required()
def todos():
    user_id = get_jwt_identity()

    if request.method == 'POST':
        task = request.json.get('task')
        if not task:
            return jsonify({'msg': 'Missing task'}), 400

        new_todo = Todo(task=task, user_id=user_id)
        db.session.add(new_todo)
        db.session.commit()

        return jsonify({'id': new_todo.id, 'task': new_todo.task}), 201

    todos = Todo.query.filter_by(user_id=user_id).all()
    return jsonify([{'id': todo.id, 'task': todo.task} for todo in todos]), 200


@app.route('/todos/<int:id>', methods=['PUT'])
@jwt_required()
def update_todo(id):
    user_id = get_jwt_identity()
    todo = Todo.query.filter_by(id=id, user_id=user_id).first()

    if not todo:
        return jsonify({'msg': 'Todo not found'}), 404

    data = request.json
    task = data.get('task')
    if not task:
        return jsonify({'msg': 'Missing task'}), 400

    todo.task = task
    db.session.commit()
    return jsonify({'id': todo.id, 'task': todo.task}), 200

# Endpoint to delete a task
@app.route('/todos/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_todo(id):
    user_id = get_jwt_identity()
    todo = Todo.query.filter_by(id=id, user_id=user_id).first()

    if not todo:
        return jsonify({'msg': 'Todo not found'}), 404

    db.session.delete(todo)
    db.session.commit()
    return jsonify({'msg': 'Todo deleted successfully'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
