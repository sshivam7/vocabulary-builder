import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Axios from "axios";
import jwtDecode from "jwt-decode";

import UserContext from "../../Context/UserContext";
import ErrorNotice from "../misc/ErrorNotice";
import "./UserForm.css";

export default function Login() {
	// Store form input
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();
	const [error, setError] = useState();

	// If user is already logged in reroute to home page
	const { userData, setUserData } = useContext(UserContext);
	const history = useHistory();

	useEffect(() => {
          if (userData.user) {
               history.push("/");
		}
     });

	// Login user on form submit 
	const submit = async (e) => {
		try {
			e.preventDefault();
			const loginUser = { email, password };
			const loginResponse = await Axios.post(
				"http://localhost:4000/api/users/login",
				loginUser
			);

			// get user information from JWT payload 
			const payload = jwtDecode(loginResponse.data.token);

			setUserData({
				token: loginResponse.data.token,
				user: {
					id: payload.id,
					displayName: payload.displayName,
				},
			});

			// Store user token 
			localStorage.setItem("auth-token", loginResponse.data.token);
			history.goBack();
		} catch (err) {
			// If request fails set error messages 
			err.response.data.msg && setError(err.response.data.msg);
		}
	};

	const home = () => history.push("/");

	return (
		<div className="form-page">
			<h2>Login</h2>
			{error && (
				<ErrorNotice msg={error} clearError={() => setError(undefined)} />
			)}
			<form>
				<div>
					<label htmlFor="login-email">Email</label>
					<input
						id="login-email"
						type="email"
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>

				<div>
					<label htmlFor="login-password">Password</label>
					<input
						id="login-password"
						type="password"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>

				<div className="alternate">
					<Link to="/register">Don't have an account? Create one now.</Link>
				</div>

				<input
					className="form-button"
					type="submit"
					value="Login"
					onClick={submit}
				/>
				<button className="form-button" onClick={home}>
					Return Home
				</button>
			</form>
		</div>
	);
}
