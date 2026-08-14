import React, { useState, useEffect } from 'react';

import { MOCK_EMPLOYEES_DATA } from '../../../constants';
import { axiosGet } from '../../../utils/axiosHelpers';

import { DynamicTable } from '../../common';

import './employees.css';

export const Employees = ({ debug = false, mockEmployees = MOCK_EMPLOYEES_DATA, mockColumns }) => {
    const [employees, setEmployees] = useState([]);
    const [employeesFetched, setEmployeesFetched] = useState(false);

    const handleUpdateEmployees = () => {
        // TODO iterate through employee list and send each employee an update
    }

    const handleAddNewEmployee = () => {
        // TODO add a new employee to the database
    }

    useEffect(() => {
        if (employeesFetched || employees.length > 0) {
            return;
        }

        if (debug) {
            setEmployees(mockEmployees);
            return;
        }
        
        axiosGet("employees").then(res => {
            setEmployees(res.data.employees);
            setEmployeesFetched(true);
        });

        // eslint-disable-next-line
    }, [employees, employeesFetched])

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