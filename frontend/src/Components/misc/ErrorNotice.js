import React from "react";

import "./ErrorNotice.css";

export default function ErrorNotice(props) {
	// Map array of errors to array objects 
	const errorMessages = props.msg.map((error, i) => ({ id: i, msg: error }));

	return (
		<div className="error-list">
			<ul>
                    {errorMessages.map((error) => (
                         <li key={error.id}>{error.msg}</li>
                    ))}
               </ul>
		</div>
	);
}
