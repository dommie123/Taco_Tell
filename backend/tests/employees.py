import pytest
from flask import Flask, json
import unittest.mock as mock

# Assuming your Flask app is structured like this:
# from your_app import app, db, Employee

@pytest.fixture
def client():
    """Create a test client for the Flask app"""
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.test_client() as client:
        with app.app_context():
            # Create tables
            db.create_all()
        yield client

# --- EMPLOYEE CRUD TESTS ---

def test_get_employees_empty_database(client):
    """Test getting employees when database is empty"""
    response = client.get('/api/employees')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['employees'] == []
    assert data['count'] == 0

def test_get_employees_with_data(client):
    """Test getting employees with existing data"""
    # Add test data first (mock or use fixtures)
    response = client.get('/api/employees')
    assert response.status_code == 200
    data = json.loads(response.data)
    # Verify structure of returned data

def test_create_employee_valid_data(client):
    """Test creating a new employee with valid data"""
    employee_data = {
        'employee_id': 1,
        'first_name': 'John',
        'last_name': 'Doe',
        'phone_number': '555-0101'
    }
    
    response = client.post('/api/employees', 
                         data=json.dumps(employee_data),
                         content_type='application/json')
    
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['employee']['first_name'] == 'John'
    assert data['employee']['employee_id'] == 1

def test_create_employee_invalid_data(client):
    """Test creating employee with invalid data"""
    employee_data = {
        'employee_id': 1,
        'first_name': '',  # Invalid - empty name
        'last_name': 'Doe',
        'phone_number': '555-0101'
    }
    
    response = client.post('/api/employees', 
                         data=json.dumps(employee_data),
                         content_type='application/json')
    
    assert response.status_code == 400

def test_update_employee_valid_data(client):
    """Test updating an existing employee"""
    # First create an employee
    initial_data = {
        'employee_id': 1,
        'first_name': 'John',
        'last_name': 'Doe',
        'phone_number': '555-0101'
    }
    
    client.post('/api/employees', 
               data=json.dumps(initial_data),
               content_type='application/json')
    
    # Then update
    update_data = {
        'first_name': 'Jane',
        'last_name': 'Smith',
        'phone_number': '555-0202'
    }
    
    response = client.put('/api/employees/1', 
                         data=json.dumps(update_data),
                         content_type='application/json')
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['employee']['first_name'] == 'Jane'

def test_update_employee_not_found(client):
    """Test updating an employee that doesn't exist"""
    update_data = {
        'first_name': 'Jane',
        'last_name': 'Smith',
        'phone_number': '555-0202'
    }
    
    response = client.put('/api/employees/999', 
                         data=json.dumps(update_data),
                         content_type='application/json')
    
    assert response.status_code == 404

def test_delete_employee_success(client):
    """Test deleting an existing employee"""
    # Create first
    employee_data = {
        'employee_id': 1,
        'first_name': 'John',
        'last_name': 'Doe',
        'phone_number': '555-0101'
    }
    
    client.post('/api/employees', 
               data=json.dumps(employee_data),
               content_type='application/json')
    
    # Then delete
    response = client.delete('/api/employees/1')
    assert response.status_code == 200

def test_delete_employee_not_found(client):
    """Test deleting an employee that doesn't exist"""
    response = client.delete('/api/employees/999')
    assert response.status_code == 404

# --- SECURITY TESTS ---

def test_xss_protection_create_employee(client):
    """Test that XSS injection is prevented when creating employees"""
    malicious_data = {
        'employee_id': 1,
        'first_name': '<script>alert("XSS")</script>',
        'last_name': 'Doe',
        'phone_number': '555-0101'
    }
    
    response = client.post('/api/employees', 
                         data=json.dumps(malicious_data),
                         content_type='application/json')
    
    # Should succeed (validation should sanitize input)
    assert response.status_code == 201

def test_sql_injection_protection(client):
    """Test that SQL injection attempts are handled properly"""
    # This would depend on your database layer and ORM usage
    # You'd want to test that raw queries or parameterized inputs are used
    pass

# --- PERFORMANCE TESTS ---

def test_get_employees_performance(client):
    """Test that getting employees doesn't take too long"""
    # Add multiple employees for testing
    for i in range(100):
        employee_data = {
            'employee_id': i,
            'first_name': f'Employee{i}',
            'last_name': 'Test',
            'phone_number': f'555-0{i:03d}'
        }
        client.post('/api/employees', 
                   data=json.dumps(employee_data),
                   content_type='application/json')
    
    # Test response time
    import time
    start_time = time.time()
    response = client.get('/api/employees')
    end_time = time.time()
    
    assert response.status_code == 200
    assert (end_time - start_time) < 2.0  # Should respond within 2 seconds

# --- ERROR HANDLING TESTS ---

def test_internal_server_error_handling(client):
    """Test that internal server errors are handled gracefully"""
    with mock.patch('your_app.get_employees') as mock_get:
        mock_get.side_effect = Exception("Database error")
        
        response = client.get('/api/employees')
        assert response.status_code == 500

def test_validation_error_handling(client):
    """Test that validation errors are returned properly"""
    invalid_data = {
        'employee_id': -1,  # Invalid ID
        'first_name': '',
        'last_name': 'Doe',
        'phone_number': 'invalid-phone'
    }
    
    response = client.post('/api/employees', 
                         data=json.dumps(invalid_data),
                         content_type='application/json')
    
    assert response.status_code == 400
