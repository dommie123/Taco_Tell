import React, { useState, useCallback, useEffect, useMemo } from 'react';

import './addEmployee.css';

export const AddEmployee = ({ onEmployeeCreated, debug = false }) => {
    const initialEmployeeState = useMemo(() => { return {
        first_name: "",
        last_name: "",
        employee_id: 0,
        phone: ""
    }}, []);

    const initialErrorState = useMemo(() => { return {
        first_name: false,
        last_name: false,
        employee_id: false,
        phone: false
    }}, [])

    const [employee, setEmployee] = useState(initialEmployeeState);
    const [error, setError] = useState(initialErrorState);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [submitAttempt, setSubmitAttempt] = useState(0);

    const validateFirstName = useCallback(() => {
        const reName = new RegExp("[a-zA-Z]+", "gi");
        
        if (employee.first_name === "") {
            return "empty";
        } else {
            return reName.test(employee.first_name)
        }

    }, [employee.first_name])

    const validateLastName = useCallback(() => {
        const reName = new RegExp("[a-zA-Z]+", "gi");
        
        if (employee.last_name === "") {
            return "empty";
        } else { 
            return reName.test(employee.last_name);
        } 
    }, [employee.last_name])

    const validateEmployeeID = useCallback(() => {
        const reEmpID = new RegExp("[0-9]{4}", "g");
        return reEmpID.test(employee.employee_id);
    }, [employee.employee_id]);

    const validatePhoneNumber = useCallback(() => {
        const rePhone = new RegExp("^\\s*(?:\\+?(\\d{1,3}))?([-. (]*(\\d{3})[-. )]*)?((\\d{3})[-. ]*(\\d{2,4})(?:[-.x ]*(\\d+))?)\\s*$", "g");
        
        if (employee.phone === "") {
            return "empty";
        } else {
            return rePhone.test(employee.phone);
        }
    }, [employee.phone])

    const validateProperties = () => {
        const firstNameValid = validateFirstName();
        const lastNameValid = validateLastName();
        const employeeIDValid = validateEmployeeID();
        const phoneNumberValid = validatePhoneNumber();

        let newErrorState = initialErrorState;

        if (firstNameValid === "empty") {
            newErrorState = {...newErrorState, first_name: "First name cannot be empty!"}
        } else if (!firstNameValid) {
            newErrorState = {...newErrorState, first_name: "First name should only contain letters!"}
        } 

        if (lastNameValid === "empty") {
            newErrorState = {...newErrorState, last_name: "Last name cannot be empty!"}

        } else if (!lastNameValid) {
            newErrorState = {...newErrorState, last_name: "Last name should only contain letters!"}
        } 

        if (!employeeIDValid) {
            newErrorState = {...newErrorState, employee_id: "Employee ID should contain exactly four digits!"}
        } 

        if (phoneNumberValid === "empty") {
            newErrorState = {...newErrorState, phone: "Phone number cannot be empty!"}
        } else if (!phoneNumberValid) {
            newErrorState = {...newErrorState, phone: "Please enter a valid phone number (i.e. 555-555-1234)!"}
        }

        setError(newErrorState);
    }

    const isEmployeeValid = useCallback(() => {
        let employeeValid = true;
        Object.values(employee).forEach(value => {
            if (!value) {
                employeeValid = false;
                return;
            }
        })

        return employeeValid;
    }, [employee]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitAttempt(submitAttempt + 1);

        validateProperties();
        const employeeValid = isEmployeeValid();

        if (!employeeValid) {
            setSubmitDisabled(true);
            return;
        }

        // TODO if all information is valid, submit form data to server and send user back to main dashboard
        console.log("Submitting Employee Info...");
        onEmployeeCreated();
    }

    useEffect(() => {
        if (submitAttempt <= 0 && !debug) {
            return;
        }

        validateProperties();
        setSubmitDisabled(!(error.first_name || error.last_name || error.employee_id || error.phone));

    }, [employee, submitAttempt, debug])

    useEffect(() => {
        if (debug) {
            isEmployeeValid();
        }
        
        return () => {
            setEmployee(initialEmployeeState);
            setError(initialErrorState);
            setSubmitAttempt(0);
        }

    }, [initialErrorState, initialEmployeeState])

    return (
        <form className="add-employee-form" role="form" onSubmit={handleSubmit}>
            <label className={`add-employee-input-label ${error.first_name ? "error" : ""}`} htmlFor="first-name">First Name: </label>
            <input className={`add-employee-textbox ${error.first_name ? "error" : ""}`} type="text" id="first-name" onChange={(e) => { setEmployee({ ...employee, first_name: e.target.value }) }} />
            {error.first_name ? <p className="add-employee-input-error-message">{error.first_name}</p> : null}

            <label className={`add-employee-input-label ${error.last_name ? "error" : ""}`} htmlFor="last-name">Last Name: </label>
            <input className={`add-employee-textbox ${error.last_name ? "error" : ""}`} type="text" id="last-name" onChange={(e) => { setEmployee({ ...employee, last_name: e.target.value }) }} />
            {error.last_name ? <p className="add-employee-input-error-message">{error.last_name}</p> : null}

            <label className={`add-employee-input-label ${error.employee_id ? "error" : ""}`} htmlFor="employee-id">Employee ID: </label>
            <input className={`add-employee-textbox ${error.employee_id ? "error" : ""}`} type="text" id="employee-id" onChange={(e) => { setEmployee({ ...employee, employee_id: e.target.value }) }} />
            {error.employee_id ? <p className="add-employee-input-error-message">{error.employee_id}</p> : null}

            <label className={`add-employee-input-label ${error.phone ? "error" : ""}`} htmlFor="phone-number">Phone Number: </label>
            <input className={`add-employee-textbox ${error.phone ? "error" : ""}`} type="tel" id="phone-number" onChange={(e) => { setEmployee({ ...employee, phone: e.target.value }) }} />
            {error.phone ? <p className="add-employee-input-error-message">{error.phone}</p> : null}

            <input className={`add-employee-submit-btn${submitDisabled ? " disabled" : ""}`} type="submit" value="Add Employee" disabled={submitDisabled} />
        </form>
    )
}