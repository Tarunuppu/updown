import re
from flask import jsonify
from flask_jwt_extended import create_access_token
from src.models import User
from src.extensions.sqlalchemy import db


class AuthService:
    @staticmethod
    def register(name, email, password):
        if not AuthService.validate_email(email):
            return jsonify({'message': 'invalid email / user already exists'}), 400
        new_user = User(name, email, password)
        try:
            db.session.add(new_user)
            db.session.commit()
            return jsonify({'message': 'user created'}), 200
        except Exception as e:
            print(e)
            return jsonify({'message': 'internal server error'}), 500

    @staticmethod
    def login(email, password):
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'message': 'user not found'}), 404
        if not user.check_password(password):
            return jsonify({'message': 'invalid password'}), 400
        jwt = create_access_token(identity=user.id)
        return jsonify({'access_token': jwt, 'user_name' : user.name}), 200

    @staticmethod
    def logout():
        pass

    @staticmethod
    def validate_email(email):
        email_regex = r'^[a-zA-Z0-9_.+-]+@gmail\.com$'
        if not re.match(email_regex, email):
            return False
        if User.query.filter_by(email=email).first():
            return False
        return True

    @staticmethod
    def verify_token(user_id):
        user = User.query.get(user_id)
        if not user:
            return jsonify({'isAuthenticated': False}), 200
        return jsonify({'isAuthenticated': True}), 200
