import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Axios from "axios";
import jwtDecode from "jwt-decode";

import UserContext from "../../Context/UserContext";
import ErrorNotice from "../misc/ErrorNotice";
import "./UserForm.css";

export default function Register() {
	// Hold form information 
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();
	const [passwordCheck, setPasswordCheck] = useState();
	const [displayName, setDisplayName] = useState();
	const [error, setError] = useState();

	// If user is already logged in reroute to homepage 
	const { userData, setUserData } = useContext(UserContext);
	const history = useHistory();

     useEffect(() => {
          if (userData.user) {
               history.push("/");
          }
     });

	// Register a new user on form submit 
	const submit = async (e) => {
		e.preventDefault();
		try {
			// Register new user 
			const newUser = { email, password, passwordCheck, displayName };
			await Axios.post("http://localhost:4000/api/users/register", newUser);
			// Login the new user 
			const loginResponse = await Axios.post(
				"http://localhost:4000/api/users/login",
				{
					email,
					password,
				}
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
			localStorage.setItem("auth-token", loginResponse.data.token);
			history.push("/");
		} catch (err) {
			// If request fails set the appropriate error messages 
			err.response.data.msg && setError(err.response.data.msg);
		}
	};

	const home = () => history.push("/");

	return (
		<div className="form-page">
			<h2>Register</h2>
			{error && (
				<ErrorNotice msg={error} clearError={() => setError(undefined)} />
			)}
			<form>
				<div>
					<label htmlFor="register-name">Display Name</label>
					<input
						id="register-name"
						type="text"
						onChange={(e) => setDisplayName(e.target.value)}
					/>
				</div>
				<div>
					<label htmlFor="register-email">Email</label>
					<input
						id="register-email"
						type="email"
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>

				<div>
					<label htmlFor="register-password">Password</label>
					<input
						id="register-password"
						type="password"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>

				<div>
					<label htmlFor="verify-password">Verify Password</label>
					<input
						id="verify-password"
						type="password"
						onChange={(e) => setPasswordCheck(e.target.value)}
					/>
				</div>

				<div className="alternate">
					<Link to="/login">Already have an account? Login now.</Link>
				</div>

				<input
					className="form-button"
					type="submit"
					value="Register"
					onClick={submit}
				/>
				<button className="form-button" onClick={home}>
					Return Home
				</button>
			</form>
		</div>
	);
}
