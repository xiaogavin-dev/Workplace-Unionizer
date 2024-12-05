from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)
    from .encryption import encryption_blueprint
    app.register_blueprint(encryption_blueprint)
    return app
