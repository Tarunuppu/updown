from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from flask_cors import CORS
import os

from src.extensions.sqlalchemy import db
from src.blueprints import auth_api, dashboard_api


def create_app():
    app = Flask(__name__)
    load_dotenv()
    app.config['SQLALCHEMY_DATABASE_URI'] = (f"mysql+pymysql://{os.getenv('MYSQL_USER')}:{os.getenv('MYSQL_PASSWORD')}"f"@{os.getenv('MYSQL_HOST')}/{os.getenv('MYSQL_DATABASE')}")
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET', 'jwt-secret-string')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = int(os.getenv('JWT_ACCESS', 900))
    
    #initialize db
    db.init_app(app)

    #initialize migrate
    migrate = Migrate(app, db)

    #initialize jwt
    jwt = JWTManager(app)

    #register blueprints
    app.register_blueprint(auth_api, url_prefix='/auth')
    app.register_blueprint(dashboard_api, url_prefix='/dashboard')

    allowed_origins = os.getenv('ALLOWED_ORIGINS').split(',')
    CORS(app, origins=allowed_origins)

    return app

app = create_app()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'}), 200