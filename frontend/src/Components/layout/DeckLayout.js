import React from "react";
import Axios from "axios";
import { Link, useHistory } from "react-router-dom";

import "./DeckLayout.css";
import addIcon from "../../assets/images/add-filled.png";
import editIcon from "../../assets/images/edit.png";
import trashIcon from "../../assets/images/trash.png";

export default function MyDecks(props) {
	const history = useHistory();

	// reroute to addDeck to update current deck
	const editDeck = (deck) =>
		history.push({ pathname: "/addDeck", state: { update: true, deck } });

	// Make a request to delete the current deck 
	const deleteDeck = async (deckId) => {
		const token = localStorage.getItem("auth-token");

		await Axios.delete(`http://localhost:4000/api/deck/delete/${deckId}`, {
			headers: { Authorization: token },
		});
		// reload page to update displayed data
          window.location.reload();
	};

	// Load deck items into JSX
	const decks = props.deckList.map((deck, i) => (
		<React.Fragment key={i}>
			<Link
				to={{
					pathname: `/deck/${deck.slug}`,
					state: { deck: deck },
				}}
			>
				<li className="display-card">
					<h4>
						<b>{deck.title}</b>
					</h4>
					<div className={deck.isPublic ? "solid" : "faded"}>
						{deck.isPublic ? "Public" : "Not Public"}
					</div>
					<p>{deck.description}</p>
				</li>
			</Link>

			{props.actions ? (
				<></>
			) : (
				<div className="actions">
					<button
						className="action-button"
						onClick={editDeck.bind(null, deck)}
					>
						<img src={editIcon} width="20px" alt="edit deck" />
					</button>
					<button
						className="action-button"
						onClick={deleteDeck.bind(null, deck._id)}
					>
						<img src={trashIcon} width="20px" alt="delete deck" />
					</button>
				</div>
			)}
		</React.Fragment>
	));

	return (
		<div>
			<ul className="deck-list">
				{props.deckList ? decks : <></>}
				<Link
					to={{
						pathname: "/addDeck",
						state: { update: false },
					}}
				>
					<li className="display-card add-card">
						<img src={addIcon} alt="add new deck" />
					</li>
				</Link>
			</ul>
		</div>
	);
}
