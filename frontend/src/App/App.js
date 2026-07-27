import React from 'react';

import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { Employees } from '../components/feature';

import './App.css';

function App() {
	const handleOpenMenu = () => {
		// TODO toggle menu open or closed. This menu contains options, such as "Add Employee". It will also contain "Upload Spreadsheet" in the future.
	}

	return (
		<div className="App">
			<header className="app-header">
				<h1 className="app-h1">Taco Tell</h1>
				<IconButton className="app-menu" onClick={handleOpenMenu}>
					<MenuIcon />
				</IconButton>
			</header>
			<Employees />
		</div>
	);
}

export default App;
