import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import "./AuthOptions.css";
import UserContext from "../../Context/UserContext";

export default function AuthOptions() {
	// Get user data 
	const { userData, setUserData } = useContext(UserContext);
	const history = useHistory();

	// functions to route user to specific pages 
	const myContent = () => history.push("/myContent");
	const register = () => history.push("/register")
	const login = () => history.push("/login");
	const logout = () => {
		setUserData({
			token: undefined,
			user: undefined,
		});
		localStorage.setItem('auth-token', "");
	}

	return (
		<>
			{userData.user ? (
				<>
					<button onClick={myContent}>My Content</button>
					<button className="accent-button" onClick={logout}>Logout</button>
				</>
			) : (
				<>
				<button onClick={register}>Register</button>
					<button className="accent-button" onClick={login}>
						Login
					</button>
				</>
			)}
		</>
	);
}
