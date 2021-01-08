import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";

import UserContext from "../../Context/UserContext";
import ErrorNotice from "../misc/ErrorNotice";
import "./AddDeck.css";

export default function AddDeck(props) {
	// Reroute to login page if user has not already logged in
	const { userData, loading } = useContext(UserContext);
	const history = useHistory();

	const { update, deck } = props.location.state;

	useEffect(() => {
		if (!loading && !userData.user) {
			history.push("/login");
		}
	});

	// Hold form information
	const [title, setTitle] = useState(update ? deck.title : "");
	const [description, setDescription] = useState(update ? deck.description : "");
	const [isPublic, setIsPublic] = useState(update ? deck.isPublic : false);
	const [error, setError] = useState();

	// function to toggle isPublic state
	const toggleButton = () => setIsPublic(!isPublic);

	// Submit form
	const submit = async (e) => {
		e.preventDefault();
		try {
			// make a post request with the auth token to create a new deck or update and existing deck
			const token = localStorage.getItem("auth-token");
			const newDeck = { title, description, isPublic };
			if (update) {
				await Axios.put(`http://localhost:4000/api/deck/update/${deck._id}`, newDeck, {
					headers: { Authorization: token}
				});
			} else {
				await Axios.post("http://localhost:4000/api/deck/createDeck", newDeck, {
					headers: { Authorization: token },
				});
			}

			// reroute user
			history.push("/viewDecks");
		} catch (err) {
			// If the post request fails set the appropriate error messages
			err.response.data.msg && setError(err.response.data.msg);
		}
	};

	return (
		<div className="form-page">
			<h2 className="form-title">{update ? "Update existing deck" : "Create a new deck"}</h2>
			{error && (
				<ErrorNotice msg={error} clearError={() => setError(undefined)} />
			)}
			<form className="add-form">
				<div>
					<label htmlFor="deck-title">Title</label>
					<input
						id="deck-title"
						className="title"
						type="text"
						defaultValue={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>
				<div>
					<label htmlFor="deck-description">Description</label>
					<textarea
						className="description"
						id="deck-description"
						cols="100"
						rows="10"
						defaultValue={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</div>

				<div className="toggle-switch">
					<label htmlFor="is-public">Is this deck Public: </label>
					<label className="switch">
						<input id="is-public" type="checkbox" defaultChecked={isPublic} onChange={toggleButton} />
						<span className="slider"></span>
					</label>
				</div>

				<input
					className="form-button"
					type="submit"
					value={update ? "Update Deck" : "Create Deck"}
					onClick={submit}
				/>
			</form>
		</div>
	);
}
