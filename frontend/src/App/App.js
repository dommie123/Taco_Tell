import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';

import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { CLIENT_URL } from '../constants';

import { setCMOpen, setCMCoords } from '../slices/globalSlice';

import Router from '../nav/router';
import { Drawer } from '../components/common';
// import { Employees } from '../components/feature';
// import { AddEmployee } from '../components/feature';

import './App.css';

function App() {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const dispatch = useDispatch();

	const handleOpenMenu = (event) => {
		// TODO toggle menu open or closed. This menu contains options, such as "Add Employee". It will also contain "Upload Spreadsheet" in the future.
		event.stopPropagation();

		dispatch(setCMCoords({x: event.clientX, y: event.clientY}));
		dispatch(setCMOpen(true));
	}

	const handleToggleDrawer = () => {
		setDrawerOpen(!drawerOpen);
	}

	const handleCloseDrawer = () => {
		setDrawerOpen(false);
	}

	const determineHeaderTitleFromLocation = () => {
		switch (window.location.pathname) {
			case "/":
				return "Taco Tell";
			case "/add_employee":
				return "Add New Employee";
			default:
				return "Oops!";
		}
	}

	return (
		<div className="App">
			<header className="app-header">
				<h1 className="app-h1">{determineHeaderTitleFromLocation()}</h1>
				<IconButton className="app-menu" onClick={handleToggleDrawer}>
					<MenuIcon />
				</IconButton>
			</header>
			{/* <Employees /> */}
			{/* <AddEmployee onEmployeeCreated={() => { console.log("Employee created!") }}/> */}
			<Router />
			<Drawer
				isOpen={drawerOpen}
				onClose={handleCloseDrawer}
				onItemSelect={(item) => { window.open(`${CLIENT_URL}/${item.props.value}`, "_self") }}
			>
				<div value="">Dashboard</div>
				<div value="add_employee">Add Employee</div>
			</Drawer>
		</div>
	);
}

export default App;
