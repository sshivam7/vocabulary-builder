import React from 'react'
import { useHistory } from "react-router-dom";

import "./My404Component.css";

export default function My404Component() {
     const history = useHistory();

     const returnToLast = () => history.push("/");

     return (
          <>
               <h1>404 : Page not found</h1>
               <button className="return-button" onClick={returnToLast}>Return</button>
          </>
     )
}
