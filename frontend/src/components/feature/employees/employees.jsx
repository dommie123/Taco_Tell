import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { MOCK_EMPLOYEES_DATA, CLIENT_URL } from '../../../constants';
import { InvalidContextMenuOptionError } from '../../../errors';

import { setCMOpen, setCMCoords } from '../../../slices/globalSlice';
import { axiosGet, axiosDelete } from '../../../utils/axiosHelpers';

import { DynamicTable, ContextMenu, Modal } from '../../common';

import './employees.css';

export const Employees = ({ debug = false, mockEmployees = MOCK_EMPLOYEES_DATA, mockColumns }) => {
    const cmOpen = useSelector(state => state.global.cmOpen);
    const [employees, setEmployees] = useState([]);
    const [employeesFetched, setEmployeesFetched] = useState(false);
    const [cmItem, setCMItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const dispatch = useDispatch();

    const handleOpenMenu = (event) => {
		// TODO toggle menu open or closed. This menu contains options, such as "Add Employee". It will also contain "Upload Spreadsheet" in the future.
		event.stopPropagation();

		dispatch(setCMCoords({x: event.clientX, y: event.clientY}));
		dispatch(setCMOpen(!cmOpen));
	}

    const handleEditEmplopyee = (emp) => {
        alert("Feature coming soon...");
    }

    const handleCloseModal = () => {
        setModalVisible(false);
    }

    const handleRemoveEmployee = (emp) => {
        handleCloseModal();

        axiosDelete(`employee/${emp.employee_id}`).then(() => {}).catch(err => {
            alert(err.response.data.message);
        });
    }

    const handleCMItemClick = (item) => {
        switch (item) {
            case "Edit":
                handleEditEmplopyee(item);
                break;
            case "Remove":
                // TODO display modal with yes or no options asking to confirm whether they want to remove the user
                // let userResponse = window.confirm(`Are you sure you want to remove user ${cmItem.employee_id} from the database?`);
                // if (userResponse) {
                //     axiosDelete(`employee/${cmItem.employee_id}`).then(() => {}).catch(err => {
                //         alert(err.response.data.message);
                //     });
                // }
                setModalVisible(true);
                break;
            default:
                throw new InvalidContextMenuOptionError();
        }

        dispatch(setCMOpen(false));
    }

    const handleUpdateEmployees = () => {
        // TODO iterate through employee list and send each employee an update
    }

    const handleAddNewEmployee = () => {
        window.open(`${CLIENT_URL}/add_employee`, '_self');
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
                onItemAltClicked={(event, item) => {
                    setCMItem(item);
                    handleOpenMenu(event);
                }}
                dataOptionsEnabled={true}
                onEntryOptionsClicked={(event, item) => {
                    handleOpenMenu(event);
                    setCMItem(item);
                }}
            />
            <ContextMenu 
                anchorPosition="top-left"
                onMenuItemClick={handleCMItemClick}
            >
                <div className="cm-item">Edit</div>
                <div className="cm-item">Remove</div>
            </ContextMenu>
            { employees.length > 0 ? 
            <button 
                className="send-update-to-employees-btn"
                onClick={handleUpdateEmployees}
            >
                Update Employees
            </button> : 
            <button className="add-employee-btn" onClick={handleAddNewEmployee}>Add Employee</button>
            }
            {modalVisible ? <Modal title="Confirm Employee Removal" isOpen={true} closable={false}>
                <p className="employee-confirm-removal-message">Are you sure you want to remove this employee?</p>
                <div className="employee-confirm-removal-btn-suite">
                    <button className="employee-confirm-removal-btn-yes" onClick={() => { handleRemoveEmployee(cmItem) }}>Yes</button>
                    <button className="employee-confirm-removal-btn-no" onClick={() => { handleCloseModal() }}>No</button>
                </div>
            </Modal> : <></>}
        </div>

    )
}