import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Axios from "axios";

import "./App.css";
import Home from "./pages/Home";
import Login from "./auth/Login";
import Register from "./auth/Register";
import MyContent from "./pages/MyContent";
import AddDeck from "./pages/AddDeck";
import AddCard from "./pages/AddCard";
import ViewDecks from "./pages/ViewDecks";
import Deck from "./pages/Deck";
import UserContext from "../Context/UserContext";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import My404Component from "./pages/My404Component";
import RedirectToNotFound from "./misc/RedirectToNotFound"

function App() {
	const [userData, setUserData] = useState({
		token: undefined,
		user: undefined,
	});

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkLoggedIn = async () => {
			let token = localStorage.getItem("auth-token");
			if (token === null) {
				localStorage.setItem("auth-token", "");
				token = "";
			}
			const tokenResponse = await Axios.post(
				"http://localhost:4000/api/users/isValidToken",
				null,
				{
					headers: { Authorization: token },
				}
			);
			if (tokenResponse.data) {
				const userResponse = await Axios.get(
					"http://localhost:4000/api/users/getUser",
					{
						headers: { Authorization: token },
					}
				);
				setUserData({
					token,
					user: userResponse.data,
				});
			}
			setLoading(false);
		};

		setLoading(true);
		checkLoggedIn();
	}, []);

	const NavBarRoutes = () => {
		return (
			<>
				<Navbar />
				<div className="page-container">
				<Switch>
					<Route exact path="/" component={Home} />
					<Route path="/myContent" component={MyContent} />
					<Route path="/addDeck" component={AddDeck} />
					<Route path="/viewDecks" component={ViewDecks} />
					<Route path="/deck/:title" component={Deck} />
					<Route path="/addCard" component={AddCard} />
					<Route component={RedirectToNotFound} />
				</Switch>
				</div>
				<Footer />
			</>
		);
	};

	return (
		<>
			<BrowserRouter>
				<UserContext.Provider value={{ userData, setUserData, loading, setLoading }}>
					<Switch>
						<Route path="/404notfound" component={My404Component} />
						<Route path="/login" component={Login} />
						<Route path="/register" component={Register} />
						<Route component={NavBarRoutes} />
					</Switch>
				</UserContext.Provider>
			</BrowserRouter>
		</>
	);
}

export default App;
