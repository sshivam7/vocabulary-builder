import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import Axios from "axios";

import UserContext from "../../Context/UserContext";
import CardList from "../layout/CardList";
import CardSingle from "../layout/CardSingle";
import editIcon from "../../assets/images/edit.png";
import trashIcon from "../../assets/images/trash.png";
import "./Deck.css";

export default function Deck(props) {
	const { userData, loading } = useContext(UserContext);
	const { title } = useParams();
	const history = useHistory();

	const [isMounted, setIsMounted] = useState(false);

	const getDeck = async () => {
		let token = localStorage.getItem("auth-token");
		const deck = await Axios.get(
			`http://localhost:4000/api/deck/get/${title}`,
			{
				headers: { Authorization: token },
			}
		);

		if (!deck.data) {
			history.push("/notfound");
		}

		setDeck(deck.data);
	};

	const [deck, setDeck] = useState(
		props.location.state ? props.location.state.deck : { title: "Loading" }
	);

	// Store list of all cards and current selected card
	const [cards, setCards] = useState([]);
	const [currentCard, setCurrentCard] = useState({ title: "No card Selected" });

	useEffect(() => {
		const loadCards = async () => {
			try {
				await getDeck();
				// Make a request to get all cards associated with the current deck
				let token = localStorage.getItem("auth-token");
				if (deck._id) {
					const cardsResponse = await Axios.get(
						`http://localhost:4000/api/deck/getAllCards/${deck._id}`,
						{
							headers: { Authorization: token },
						}
					);
					setCards(cardsResponse.data);
				}
			} catch (error) {
				console.log("Could not load data");
			}
		};

		if (!userData.user && !loading) {
			history.push("/login");
		} else if (!isMounted) {
			loadCards();
		}
		return () => {
			setIsMounted(false);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deck._id]);

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

	return (
		<>
			<div className="deck-options">
				<h2 className="deck-title">{deck.title}</h2>

				<div className="actions">
					<button
						className="action-button"
						onClick={editDeck.bind(null, deck)}
					>
						<img src={editIcon} width="30px" alt="edit deck" />
					</button>
					<button
						className="action-button"
						onClick={deleteDeck.bind(null, deck._id)}
					>
						<img src={trashIcon} width="30px" alt="delete deck" />
					</button>
				</div>
			</div>

			<div className="main-container">
				<CardList cardList={cards} setCurrentCard={setCurrentCard} deck={deck} />
				<CardSingle currentCard={currentCard} deck={deck}/>
			</div>
		</>
	);
}
