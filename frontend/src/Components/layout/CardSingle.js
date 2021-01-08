import React from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";

import editIcon from "../../assets/images/edit.png";
import trashIcon from "../../assets/images/trash.png";
import "./CardSingle.css";

export default function CardSingle(props) {
	const history = useHistory();

	// reroute to addCard to update current deck
	const editCard = () =>
		history.push({
			pathname: "/addCard",
			state: { update: true, card: props.currentCard, deck: props.deck },
		});

	// Make a request to delete the current deck
	const deleteCard = async () => {
		const token = localStorage.getItem("auth-token");

		await Axios.delete(
			`http://localhost:4000/api/card/delete/${props.deck._id}/${props.currentCard._id}`,
			{
				headers: { Authorization: token },
			}
		);
		// reload page to update displayed data
		window.location.reload();
	};

	return (
		<div className="selected-container">
			<div className="header-container">
				<h3>{props.currentCard.title}</h3>
				<div className="rating">
					<span>{props.currentCard.difficulty < 1 ? "☆" : "★"}</span>
					<span>{props.currentCard.difficulty < 2 ? "☆" : "★"}</span>
					<span>{props.currentCard.difficulty < 3 ? "☆" : "★"}</span>
					<span>{props.currentCard.difficulty < 4 ? "☆" : "★"}</span>
					<span>{props.currentCard.difficulty < 5 ? "☆" : "★"}</span>
				</div>
			</div>

			<div className="card-content">
				<p className="label">Definition</p>
				<p className="card-text">{props.currentCard.definition}</p>

				<p className="label">Example</p>
				<p className="card-text">{props.currentCard.example}</p>

				<p className="label">Pronunciation</p>
				<p className="card-text">{props.currentCard.pronunciation}</p>
			</div>

			{props.currentCard._id ? (
				<div className="card-actions">
					<button className="action-button" onClick={editCard}>
						<img src={editIcon} width="20px" alt="edit deck" />
					</button>
					<button className="action-button" onClick={deleteCard}>
						<img src={trashIcon} width="20px" alt="delete deck" />
					</button>
				</div>
			) : (
				<></>
			)}
		</div>
	);
}
