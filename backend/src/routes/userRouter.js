import express from 'express';
import passport from 'passport';

import {
  registerUser,
  loginUser,
  deleteUser,
  isValidToken,
  getUserWithID,
} from '../controllers/userControllers';

const router = express.Router();

// Route to register a new user
router.post('/register', registerUser);

// Route to login
router.post('/login', loginUser);

// Get a user (user must be logged in)
router.get('/getUser', passport.authenticate('jwt', { session: false }), getUserWithID);

// Route to delete an existing user if authorized
router.delete('/delete', passport.authenticate('jwt', { session: false }), deleteUser);

// Check if token is valid
router.post('/isValidToken', isValidToken);

export default router;
