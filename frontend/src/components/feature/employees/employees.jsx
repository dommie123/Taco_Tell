import React, { useState, useEffect } from 'react';

import { DynamicTable } from '../../common';

import './employees.css';

const mockEmployeesData = [
    { id: 1, employee_id: 6747, first_name: "Jay", last_name: "Ray", phone: "385-555-1234"},
    { id: 2, employee_id: 29, first_name: "Dom", last_name: "Wiley", phone: "385-555-7744"},
    { id: 3, employee_id: 1, first_name: "Miles", last_name: "Morales", phone: "385-555-2020"},
    { id: 4, employee_id: 77, first_name: "Miles", last_name: "Prower", phone: "385-555-9195"},
    { id: 5, employee_id: 420, first_name: "Tyler", last_name: "Robinson", phone: "385-555-8811"},
]

export const Employees = ({ debug = false, mockEmployees = mockEmployeesData, mockColumns }) => {
    const [employees, setEmployees] = useState([]);

    const handleUpdateEmployees = () => {
        // TODO iterate through employee list and send each employee an update
    }

    const handleAddNewEmployee = () => {
        // TODO add a new employee to the database
    }

    useEffect(() => {
        // TODO fetch employees from backend and update the state

        if (debug) {
            setEmployees(mockEmployees);
        }

        // eslint-disable-next-line
    }, [])

    return (
        <div className="employees-container">
            <DynamicTable
                className="employees-table"
                items={employees}
                columns={debug ? mockColumns : undefined}
            />
            { employees.length > 0 ? 
            <button 
                className="send-update-to-employees-btn"
                onClick={handleUpdateEmployees}
            >
                Update Employees
            </button> : 
            <button className="add-employee-btn" onClick={handleAddNewEmployee}>Add Employee</button>
            }
        </div>

    )
}