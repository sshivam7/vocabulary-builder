import express from 'express';
import passport from 'passport';

import {
  addCardToDeck,
  getCardById,
  deleteCardById,
  updateCardById,
} from '../controllers/cardControllers';

const router = express.Router();

// Add a new card to the deck (user must be logged in)
router.post('/add/:DeckId', passport.authenticate('jwt', { session: false }), addCardToDeck);

// Get a specific card by id
router.get('/:id', passport.authenticate('jwt', { session: false }), getCardById);

// Delete a specific card by id (user must be logged in)
router.delete(
  '/delete/:DeckId/:CardId',
  passport.authenticate('jwt', { session: false }),
  deleteCardById
);

// Update a specific car by id (user must be logged in)
router.put(
  '/update/:DeckId/:CardId',
  passport.authenticate('jwt', { session: false }),
  updateCardById
);

export default router;
