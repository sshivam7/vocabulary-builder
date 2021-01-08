import mongoose from 'mongoose';
import sanitizeHtml from 'sanitize-html';

import DeckSchema from '../models/deckModel';
import CardSchema from '../models/cardModel';
import validateCard from '../validation/card';

const Deck = mongoose.model('Deck', DeckSchema);
const Card = mongoose.model('Card', CardSchema);

// Create a new cards and add it to the associated deck
export const addCardToDeck = async (request, response) => {
  try {
    let { title, definition, example, pronunciation } = request.body;
    const { difficulty } = request.body;
    const { errorMessages, isValid } = validateCard(request.body);

    // Ensure user has permission to modify this deck
    const deck = await Deck.findOne({ userId: request.user, _id: request.params.DeckId });

    if (!deck) {
      return response.status(400).json({ msg: ['You do not have permission to modify this deck'] });
    }

    // Validate data
    if (!isValid) {
      return response.status(400).json({ msg: errorMessages });
    }

    // Sanitize data
    title = sanitizeHtml(title);
    definition = sanitizeHtml(definition);
    example = sanitizeHtml(example);
    pronunciation = sanitizeHtml(pronunciation);

    const newCard = new Card({
      title,
      definition,
      pronunciation,
      example,
      difficulty,
      userId: request.user,
    });

    // Create a new card document and add the id to the cards array for
    // the associated deck
    const savedCard = await newCard.save();
    deck.cards.push(savedCard._id);

    // Update the deck with the new list of ids
    await Deck.findByIdAndUpdate({ _id: request.params.DeckId }, deck);

    response.json(savedCard);
  } catch (error) {
    response.status(500).json({ error });
  }
};

// Get a particular card given the id
export const getCardById = async (request, response) => {
  try {
    const card = Card.findOne({ userId: request.user, _id: request.params.id });
    response.json(card);
  } catch (error) {
    response.status(500).json({ error });
  }
};

// Delete a particular card when given the id
export const deleteCardById = async (request, response) => {
  try {
    // Ensure user has permission to modify this deck
    const deck = await Deck.findOne({ userId: request.user, _id: request.params.DeckId });

    if (!deck) {
      return response.status(400).json({ msg: ['You do not have permission to modify this deck'] });
    }

    // Delete card and remove entry from the associated deck
    const deletedCard = await Card.findByIdAndDelete(request.params.CardId);
    deck.cards = deck.cards.filter((card) => card != request.params.CardId);

    // Update the deck with the new list of ids
    await Deck.findByIdAndUpdate({ _id: request.params.DeckId }, deck);

    response.json(deletedCard);
  } catch (error) {
    response.status(500).json({ error });
  }
};

// Update a specific card when given the id
export const updateCardById = async (request, response) => {
  try {
    // Ensure user has permission to modify this deck
    const deck = await Deck.findOne({ userId: request.user, _id: request.params.DeckId });

    if (!deck) {
      return response.status(400).json({ msg: ['You do not have permission to modify this deck'] });
    }

    let { title, definition, example, pronunciation } = request.body;
    const { difficulty } = request.body;
    const { errorMessages, isValid } = validateCard(request.body);

    // validate information
    if (!isValid) {
      return response.status(400).json({ msg: errorMessages });
    }

    // sanitize data
    title = sanitizeHtml(title);
    definition = sanitizeHtml(definition);
    example = sanitizeHtml(example);
    pronunciation = sanitizeHtml(pronunciation);

    const newCard = new Card({
      _id: request.params.CardId,
      title,
      definition,
      example,
      difficulty,
      pronunciation,
      userId: request.user,
    });
    

    // Update deck with new data 
    const updatedDeck = await Card.findOneAndUpdate({ _id: request.params.CardId }, newCard, {
      new: true,
      useFindAndModify: false,
    });
    response.json(updatedDeck);
  } catch (error) {
    response.status(500).json({ error });
  }
};
