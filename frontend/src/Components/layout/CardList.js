import React from "react";
import { useHistory } from "react-router-dom";

import addIcon from "../../assets/images/add-filled.png";
import "./CardList.css";

export default function CardList(props) {
	const history = useHistory();

	const cards = props.cardList.map((card, i) => (
		<React.Fragment key={i}>
			<li>
				<button
					className="card-list-button"
					onClick={props.setCurrentCard.bind(null, card)}
				>
					{card.title}
				</button>
			</li>
		</React.Fragment>
	));

	return (
		<>
			<ul className="card-collection">
				<li>
					<button
						className="card-list-button"
						onClick={() =>
							history.push({ pathname: "/addCard", state: { update: false, deck: props.deck } })
						}
					>
						<img src={addIcon} alt="add new deck" width="40px" />
					</button>
				</li>
				{cards}
			</ul>
		</>
	);
}
