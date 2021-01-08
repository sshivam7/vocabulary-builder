import React from "react";
import { useLocation, useHistory } from "react-router-dom";

import './Navbar.css';
import AuthOptions from '../auth/AuthOptions';

function Navbar() {
	const location = useLocation();
	const history = useHistory();

	const home = () => history.push("/");

	// If the current path is not the home screen display the "Home" button in the nav bar 
	let homeBtn;
	if (location.pathname !== "/") {
		homeBtn = (<button onClick={home}>Home</button>);
	} else {
		homeBtn = null;
	}
	
	return (
		<nav>
			{homeBtn}
			<AuthOptions />
		</nav>
	);
}

export default Navbar;
