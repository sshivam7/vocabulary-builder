import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from "react-router-dom";
import Axios from "axios";

import UserContext from '../../Context/UserContext';
import DeckLayout from "../layout/DeckLayout";
import "./MyContent.css"

export default function Browse() {
     const { userData, loading } = useContext(UserContext)
     const history = useHistory();

     const [decks, setDecks] = useState([{title: "", description: "", isPublic: false}]);
     const [isMounted, setIsMounted] = useState(false);

     useEffect(() => {
          const viewMyDecks = async () => {
               try {
                    // Make a get request with the auth token to get all decks 
                    // created by the current user 
                    const token = localStorage.getItem("auth-token");
                    const response =  await Axios.get("http://localhost:4000/api/deck/", {
                         headers: { Authorization: token},
                    });
                    setDecks(response.data);
               } catch (err) {
                    setDecks(err);
               }
          }

          setIsMounted(true);
          if (!loading && !userData.user) {
               history.push("/login");
          } else if (!isMounted) {
               viewMyDecks();
          }
          return () => {
               setIsMounted(false);
          }
     }, [loading, isMounted, history, userData.user]);

     

     return (
          <div>
               <h1><span>Hello, </span>{userData.user ? userData.user.displayName : "Loading"}</h1>
               <h3 className="sub-heading">My Decks</h3>
               <DeckLayout deckList={decks} actions={false}/>
          </div>
     )
}
