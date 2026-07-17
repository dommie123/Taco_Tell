from db import db

class Employee(db.Model):
    __tablename__ = "employees"

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80))
    last_name = db.Column(db.String(80))
    employee_id = db.Column(db.Integer)
    phone = db.Column(db.String(80))

    def __init__(self, first_name, last_name, employee_id, phone):
        self.first_name = first_name
        self.last_name = last_name
        self.employee_id = employee_id
        self.phone = phone

    def json(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'employee_id': self.employee_id,
            'phone': self.phone
        }
    
    def save_employee(self):
        db.session.add(self)
        db.session.commit()

    def delete_employee(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def find_by_employee_id(cls, employee_id):
        return cls.query.filter_by(employee_id=employee_id).first()
    
    @classmethod
    def find_by_id(cls, id):
        return cls.query.filter_by(id=id).first()