import React, { useState } from 'react';

import { IconButton } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

import { CLIENT_URL } from '../constants';

import Router from '../nav/router';
import { Drawer } from '../components/common';

import { ReactComponent as TacoTellIcon } from '../assets/tt_logo.svg';

import './App.css';

function App() {
	const [drawerOpen, setDrawerOpen] = useState(false);

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
				<div className="app-logo-container">
					<TacoTellIcon width={50} height={50} />
					<h1 className="app-h2">Taco Tell</h1>
				</div>
				<h1 className="app-h1">{determineHeaderTitleFromLocation()}</h1>
				<IconButton className="app-menu" onClick={handleToggleDrawer}>
					<MenuIcon />
				</IconButton>
			</header>
			<Router />
			<Drawer
				isOpen={drawerOpen}
				onClose={handleCloseDrawer}
				onItemSelect={(item) => { window.open(`${CLIENT_URL}/${item.props.value}`, "_self") }}
			>
				<div value=""><DashboardIcon style={{ paddingRight: "10px" }} /><p className="left-align important">Dashboard</p></div>
				<div value="add_employee"><PersonAddAlt1Icon style={{ paddingRight: "10px" }} /><p className="left-align important">Add Employee</p></div>
			</Drawer>
		</div>
	);
}

export default App;
