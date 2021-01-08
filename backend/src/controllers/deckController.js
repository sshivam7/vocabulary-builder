import mongoose from 'mongoose';
import sanitizeHtml from 'sanitize-html';
import urlSlug from 'url-slug';

import DeckSchema from '../models/deckModel';
import CardSchema from '../models/cardModel'
import validateDeck from '../validation/deck';

const Deck = mongoose.model('Deck', DeckSchema);
const Card = mongoose.model('Card', CardSchema);

// Create a new deck
export const createDeck = async (request, response) => {
  try {
    let { title, description } = request.body;
    const { isPublic } = request.body;
    const { errorMessages, isValid } = validateDeck(request.body);

    // validate information
    if (!isValid) {
      return response.status(400).json({ msg: errorMessages });
    }

    // Check for an existing deck with the same name and user id
    const existingDeck = await Deck.findOne({ title, userId: request.user });
    if (existingDeck) {
      return response
        .status(400)
        .json({ msg: ['A deck already exists with that name under this account'] });
    }

    // sanitize data
    title = sanitizeHtml(title);
    description = sanitizeHtml(description);

    const newDeck = new Deck({
      title,
      slug: urlSlug(title),
      userId: request.user,
      description,
      isPublic,
    });

    // Save new deck
    const savedDeck = await newDeck.save();
    response.json(savedDeck);
  } catch (error) {
    response.status(500).json({ error });
  }
};

// Get all decks for the given user
export const getAllDecks = async (request, response) => {
  try {
    // find all decks that belong to the logged in user
    const decks = await Deck.find({ userId: request.user });
    response.json(decks);
  } catch (error) {
    response.status(500).json({ error });
  }
};

export const getPublicDecks = async (request, response) => {
  try {
    const decks = await Deck.find({ isPublic: true });
    response.json(decks);
  } catch (error) {
    response.status(500).json({ error });
  }
}

// Get a particular deck by id
export const getDeckById = async (request, response) => {
  try {
    // find a deck that belongs to the logged in user and matches request id
    const deck = await Deck.findOne({ userId: request.user, _id: request.params.id });
    response.json(deck);
  } catch (error) {
    response.status(500).json({ error });
  }
};

// Get a deck by slug
export const getDeckBySlug = async (request, response) => {
  try {
    // find a deck that belongs to the logged in user and matches request id
    const deck = await Deck.findOne({ userId: request.user, slug: request.params.slug });
    response.json(deck);
  } catch (error) {
    response.status(500).json({ error });
  }
};

// Update a deck when given deck id
export const updateDeckById = async (request, response) => {
  try {
    // Ensure user has permission to modify this deck
    const deck = await Deck.findOne({ userId: request.user, _id: request.params.id });

    if (!deck) {
      return response.status(400).json({ msg: ['You do not have permission to modify this deck'] });
    }

    let { title, description } = request.body;
    const { isPublic } = request.body;
    const { errorMessages, isValid } = validateDeck(request.body);

    // validate information
    if (!isValid) {
      return response.status(400).json({ msg: errorMessages });
    }

    // Check for an existing deck with the same name and user id
    const existingDeck = await Deck.findOne({ title, userId: request.user });
    if (existingDeck && existingDeck.id !== request.params.id) {
      return response
        .status(400)
        .json({ msg: ['A deck already exists with that name under this account'] });
    }

    // sanitize data
    title = sanitizeHtml(title);
    description = sanitizeHtml(description);

    const newDeck = new Deck({
      _id: request.params.id,
      title,
      cards: deck.cards,
      slug: urlSlug(title),
      userId: request.user,
      description,
      isPublic,
    });

    // Update the deck with new deck information
    const updatedDeck = await Deck.findOneAndUpdate({ _id: request.params.id }, newDeck, {
      new: true,
      useFindAndModify: false,
    });
    response.json(updatedDeck);
  } catch (error) {
    response.status(500).json({ error });
  }
};

// Delete a specific deck when given deck id
export const deleteDeckById = async (request, response) => {
  try {
    // Ensure user has permission to modify this deck
    const deck = await Deck.findOne({ userId: request.user, _id: request.params.id });

    if (!deck) {
      return response.status(400).json({ msg: ['You do not have permission to modify this deck'] });
    }

    // delete cards associated with the current deck 
    await Card.deleteMany({_id: {$in: deck.cards}});

    // delete deck
    const deletedDeck = await Deck.findByIdAndDelete(request.params.id);
    response.json(deletedDeck);
  } catch (error) {
    response.status(500).json({ error });
  }
};

// Get all cards that belong to the current deck
export const getAllCards = async (request, response) => {
  try {
    // Ensure user has permission to modify this deck
    const deck = await Deck.findOne({ userId: request.user, _id: request.params.id });

    if (!deck) {
      return response.status(400).json({ msg: ['You do not have permission to modify this deck'] });
    }

	 // Use the populate feature to return all cards belonging to the selected deck 
    const cards = await Deck.findOne({_id: request.params.id}).populate('cards');
    response.json(cards.cards);
  } catch (error) {
    response.status(500).json({ error });
  }
};
