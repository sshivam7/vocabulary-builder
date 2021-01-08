import React from "react";

import "./HoverButton.css";

export default function HoverButton(props) {
	return (
		<button className="hover-button">
			<div className="button-container" style={{backgroundColor: props.color ? props.color : "white"}}>
				<div className="button-icon">
					<img src={props.img} width="25px" alt={props.alt} />
				</div>

				<div className="button-text">
					{props.text}
				</div>
			</div>
		</button>
	);
}
