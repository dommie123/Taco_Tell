import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';

import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

// import { setCMOpen, setCMCoords } from '../slices/globalSlice';

import { Drawer } from '../components/common';
import { Employees } from '../components/feature';

import './App.css';

function App() {
	const [drawerOpen, setDrawerOpen] = useState(false);
	// const dispatch = useDispatch();

	// const handleOpenMenu = (event) => {
	// 	// TODO toggle menu open or closed. This menu contains options, such as "Add Employee". It will also contain "Upload Spreadsheet" in the future.
	// 	event.stopPropagation();

	// 	dispatch(setCMCoords({x: event.clientX, y: event.clientY}));
	// 	dispatch(setCMOpen(true));
	// }

	const handleToggleDrawer = () => {
		setDrawerOpen(!drawerOpen);
	}

	const handleCloseDrawer = () => {
		setDrawerOpen(false);
	}

	return (
		<div className="App">
			<header className="app-header">
				<h1 className="app-h1">Taco Tell</h1>
				<IconButton className="app-menu" onClick={handleToggleDrawer}>
					<MenuIcon />
				</IconButton>
			</header>
			<Employees />
			<Drawer
				isOpen={drawerOpen}
				onClose={handleCloseDrawer}
				onItemSelect={(item) => { console.log({item}) }}
			>
				<div>Add Employee</div>
			</Drawer>
			{/* <div className="context-menu-btn-test-suite">
				<button className="cm-anchor-btn-1" onClick={handleOpenMenu}>Menu 1</button>
				<button className="cm-anchor-btn-2" onClick={handleOpenMenu}>Menu 2</button>
				<ContextMenu 
					anchorPosition={"top-left"}
					onMenuItemClick={(item) => { console.log(`itemClicked: ${item}`)}}
				>
					<div className="cm-item-one">Item One</div>
					<div className="cm-item-two">Item Two</div>
				</ContextMenu>
			</div> */}
		</div>
	);
}

export default App;
