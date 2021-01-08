import express from 'express';
import passport from 'passport';

import {
  createDeck,
  getAllDecks,
  getDeckById,
  getDeckBySlug,
  updateDeckById,
  deleteDeckById,
  getAllCards,
  getPublicDecks,
} from '../controllers/deckController';

const router = express.Router();

// Create a new deck associated with the current user (user must be logged in)
router.post('/createDeck', passport.authenticate('jwt', { session: false }), createDeck);

// Get all decks associated with the current user (user must be logged in)
router.get('/', passport.authenticate('jwt', { session: false }), getAllDecks);

// Get all public decks 
router.get('/public', getPublicDecks);

// Get a specific deck associated with the current user (user must be logged in)
router.get('/:id', passport.authenticate('jwt', { session: false }), getDeckById);

// Get a specific deck by title 
router.get('/get/:slug', passport.authenticate('jwt', { session: false }), getDeckBySlug);

// Update a specific deck associated with the user (user must be logged in)
router.put('/update/:id', passport.authenticate('jwt', { session: false }), updateDeckById);

// Delete a selected deck (user must be logged in)
router.delete('/delete/:id', passport.authenticate('jwt', { session: false }), deleteDeckById);

// Get all cards belonging to the selected deck (user must be logged in)
router.get('/getAllCards/:id', passport.authenticate('jwt', { session: false }), getAllCards);

export default router;
