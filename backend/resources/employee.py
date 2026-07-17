import re
import sqlite3

from flask_restful import Resource, reqparse
from db import db

from models.employee import Employee

def get_req_parser():
    parser = reqparse.RequestParser()
    parser.add_argument('first_name',
        type=str,
        required=True,
        help="This field cannot be blank!"
    )
    parser.add_argument('last_name',
        type=str,
        required=True,
        help="This field cannot be blank!"
    )
    parser.add_argument('phone',
        type=str,
        required=True,
        help="This field cannot be blank!"
    )

    return parser

class EmployeeRegister(Resource):
    parser = get_req_parser()
    parser.add_argument('employee_id',
        type=int,
        required=True,
        help="This field cannot be blank!"
    )

    def post(self):
        data = EmployeeRegister.parser.parse_args()
        if Employee.find_by_employee_id(data['employee_id']):
            return {'message': "This employee already exists in the database!"}, 400
        
        # TODO validate employee id

        # TODO validate employee phone number

        employee = Employee(**data)
        employee.save_employee()

        return {'message': 'Employee created successfully!'}, 201
    
class REmployee(Resource):
    parser = get_req_parser()

    @classmethod
    def put(cls, employee_id):
        employee = Employee.find_by_employee_id(employee_id=employee_id)
        if not employee:
            return {'message': "Employee not found!"}, 404
        
        data = REmployee.parser.parse_args()

        new_first_name = data['first_name']
        new_last_name  = data['last_name']
        new_phone = data['phone']

        employee.first_name = new_first_name
        employee.last_name = new_last_name
        employee.phone = new_phone

        db.session.commit()

        return employee.json(), 200
    
    @classmethod
    def get(cls, employee_id):
        employee = Employee.find_by_employee_id(employee_id=employee_id)
        if not employee:
            return {'message': "Employee not found!"}, 404
        return employee.json(), 200
    

class EmployeeList(Resource):
    def get(self):
        return {"employees": [employee.json() for employee in Employee.query.all()]}, 200