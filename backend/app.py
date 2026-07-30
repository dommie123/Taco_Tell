import json
import logging

from flask import Flask
from flask_restful import Api
from flask_cors import CORS

from constants import CORS_ALLOWED_ORIGINS

from resources.employee import EmployeeRegister, REmployee, EmployeeList

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///my_data.db'

api = Api(app)

# TODO add and set secret app key

cors = CORS(app, resources={ r"/*": {"origins": CORS_ALLOWED_ORIGINS }})

api.add_resource(EmployeeRegister, "/employee")
api.add_resource(REmployee, "/employee/<int:employee_id>")
api.add_resource(EmployeeList, "/employees")