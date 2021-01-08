import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import "./Home.css";
import HoverButton from "../misc/HoverButton";
import addIcon from "../../assets/images/add-property.png";
import list from "../../assets/images/list.png";

export default function Home() {
	const history = useHistory();

	const addDeck = () => history.push({pathname: "/addDeck", state: {update: false }});
	const viewDecks = () => history.push("/viewDecks");

	useEffect(() => {
		history.push('/');
	   }, [history]);

	return (
		<>
			<h1>Vocabulary Builder</h1>
			<h2 className="main-word">- Vocabulary</h2>
			<p className="main-definition">
				The body of words used in a particular language <span>or</span> the body of
				words known to an individual person. (--Oxford Lexico Dictionary)
			</p>
               <p className="main-definition"><span>Ex: </span>"They had a large vocabulary" </p>

			<div className="hover-button-one" onClick={addDeck}>
				<HoverButton
					img={addIcon}
					text="Create a new deck"
					color="var(--green-accent-color)"
					alt="Button to create a new deck"
				/>
			</div>
			<div className="hover-button-two" onClick={viewDecks}>
				<HoverButton
					img={list}
					text="View existing decks"
					color="var(--blue-accent-color)"
					alt="Button to view existing decks"
				/>
			</div>
		</>
	);
}
