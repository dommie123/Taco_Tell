import json

from flask import Flask
from flask_restful import Api

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///my_data.db'

api = Api(app)

# TODO add and set secret app key

cors = CORS(app, resources={ r"/*": {"origins": CORS_ALLOWED_ORIGINS }})