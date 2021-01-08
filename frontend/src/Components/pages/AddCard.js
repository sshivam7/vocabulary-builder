import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";

import UserContext from "../../Context/UserContext";
import ErrorNotice from "../misc/ErrorNotice";
import "./AddCard.css";

export default function AddCard(props) {
	// Reroute to login page if user has not already logged in
	const { userData, loading } = useContext(UserContext);
	const history = useHistory();

	const { update, card, deck } = props.location.state;

	useEffect(() => {
		if (!loading && !userData.user) {
			history.push("/login");
		}
	});

	// Hold form information
	const [title, setTitle] = useState(update ? card.title : "");
	const [definition, setDefinition] = useState(update ? card.definition : "");
	const [example, setExample] = useState(update ? card.example : "");
	const [pronunciation, setPronunciation] = useState(
		update ? card.pronunciation : ""
	);
	const [difficulty, setDifficulty] = useState(update ? card.difficulty : 3);
	const [error, setError] = useState();

	const submit = async (e) => {
		e.preventDefault();
		try {
			// Update or create a new card in the current deck
			const token = localStorage.getItem("auth-token");
			const newCard = { title, definition, example, pronunciation, difficulty };

			if (update) {
				await Axios.put(
					`http://localhost:4000/api/card/update/${deck._id}/${card._id}`,
					newCard,
					{
						headers: { Authorization: token },
					}
				);
			} else {
				await Axios.post(
					`http://localhost:4000/api/card/add/${deck._id}`,
					newCard,
					{
						headers: { Authorization: token },
					}
				);
			}

			// reroute user
			history.push(`/deck/${deck.slug}`);
		} catch (err) {
			// If the post request fails set the appropriate error messages
			err.response.data.msg && setError(err.response.data.msg);
		}
	};

	const autoFill = async (e) => {
		try {
			e.preventDefault();
			const owlbotRes = await Axios.get(
				`https://owlbot.info/api/v4/dictionary/${title}`,
				{
					headers: {
						Authorization: "Token TOKEN_HERE",
					},
				}
			);

			setDefinition(owlbotRes.data.definitions[0].definition);
			setExample(owlbotRes.data.definitions[0].example);
			setPronunciation(owlbotRes.data.pronunciation);
		} catch (error) {
			setDefinition("Could not complete your request");
		}
		return false;
	};

	return (
		<div className="form-page">
			<h2 className="form-title">
				{update ? "Update existing card " : "Add a new card "}
				in {deck.title}
			</h2>
			{error && (
				<ErrorNotice msg={error} clearError={() => setError(undefined)} />
			)}
			<form className="add-form">
				<div>
					<label htmlFor="card-title">Word</label>
					<input
						id="card-title"
						className="title"
						type="text"
						defaultValue={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>

				<div>
					<label className="ta-label" htmlFor="card-definition">
						Definition
					</label>
					<textarea
						className="definition"
						id="card-definition"
						cols="100"
						rows="5"
						defaultValue={definition}
						onChange={(e) => setDefinition(e.target.value)}
					/>
				</div>

				<div>
					<label className="ta-label" htmlFor="card-example">
						Example
					</label>
					<textarea
						className="example"
						id="card-example"
						cols="100"
						rows="5"
						defaultValue={example}
						onChange={(e) => setExample(e.target.value)}
					/>
				</div>

				<div>
					<label className="ta-label" htmlFor="card-pronunciation">
						Pronunciation
					</label>
					<input
						id="card-pronunciation"
						className="pronunciation"
						type="text"
						defaultValue={pronunciation}
						onChange={(e) => setPronunciation(e.target.value)}
					/>
				</div>

				<div className="difficulty-buttons">
					<label className="radio-label" htmlFor="one">
						1
					</label>
					<input
						type="radio"
						id="one"
						name="difficulty"
						onClick={() => setDifficulty(1)}
					/>

					<label className="radio-label" htmlFor="two">
						2
					</label>
					<input
						type="radio"
						id="two"
						name="difficulty"
						onClick={() => setDifficulty(2)}
					/>

					<label className="radio-label" htmlFor="three">
						3
					</label>
					<input
						type="radio"
						id="three"
						name="difficulty"
						onClick={() => setDifficulty(3)}
					/>

					<label className="radio-label" htmlFor="four">
						4
					</label>
					<input
						type="radio"
						id="four"
						name="difficulty"
						onClick={() => setDifficulty(4)}
					/>

					<label className="radio-label" htmlFor="five">
						5
					</label>
					<input
						type="radio"
						id="five"
						name="difficulty"
						onClick={() => setDifficulty(5)}
					/>
				</div>

				<input
					className="form-button"
					type="submit"
					value={update ? "Update Card" : "Create Card"}
					onClick={submit}
				/>

				<button onClick={autoFill} className="owlbot-button">
					Use Owlbot to autofill fields
				</button>
			</form>
			<p className="info">
				Autofill uses the OwlBot Api to get dictionary data. Word field must be
				filled before making the request.
			</p>
		</div>
	);
}
