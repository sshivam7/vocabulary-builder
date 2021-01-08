import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";

import UserContext from "../../Context/UserContext";
import DeckLayout from "../layout/DeckLayout";
import "./ViewDeck.css";

export default function ViewDecks() {
	const { userData, loading } = useContext(UserContext);
	const history = useHistory();

	const [isMounted, setIsMounted] = useState(false);
	const [decks, setDecks] = useState([
		{ title: "", description: "", isPublic: false },
	]);

	useEffect(() => {
		setIsMounted(true);
		if (!userData.user && !loading) {
			history.push("/login");
		} else if (!isMounted) {
			viewMyDecks();
		}
		return () => {
			setIsMounted(false);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const viewMyDecks = async () => {
		try {
			// Make a get request with the auth token to get all decks
			// created by the current user
			const token = localStorage.getItem("auth-token");
			const response = await Axios.get("http://localhost:4000/api/deck/", {
				headers: { Authorization: token },
			});
			setDecks(response.data);
		} catch (err) {
			setDecks(err);
		}
	};

	const viewPublicDecks = async () => {
		try {
			// Get all public decks
			const response = await Axios.get("http://localhost:4000/api/deck/public");
			setDecks(response.data);
		} catch (err) {
			setDecks(err);
		}
	};

	return (
		<>
			<div className="sidebar">
				<h2 className="sidebar-title">View Decks</h2>
				<div className="sidebar-btn-container">
					<button className="sidebar-btn" onClick={viewMyDecks}>
						My Decks
					</button>
					<button className="sidebar-btn" onClick={viewPublicDecks}>
						Public Decks
					</button>
				</div>
			</div>

			<div className="deck-content">
				{<DeckLayout deckList={decks} actions={true} />}
			</div>
		</>
	);
}
