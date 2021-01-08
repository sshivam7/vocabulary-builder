import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sanitizeHtml from 'sanitize-html';

import UserSchema from '../models/userModel';
import validateRegistration from '../validation/register';
import validateLogin from '../validation/login';

const User = mongoose.model('User', UserSchema);
const saltRounds = 10;

// Register a new user
export const registerUser = async (request, response) => {
  try {
    let { email, password, displayName } = request.body;
    const { errorMessages, isValid } = validateRegistration(request.body);

    // Validate information
    if (!isValid) {
      return response.status(400).json({ msg: errorMessages });
    }

    // Check for an existing user with the same email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(400).json({ msg: ['This email already exists'] });
    }

    // sanitize data
    email = sanitizeHtml(email);
    password = sanitizeHtml(password);
    displayName = sanitizeHtml(displayName);

    const newUser = new User({
      email,
      password,
      displayName,
    });

    // Use bcrypt to has passwords before saving
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(newUser.password, salt);

    newUser.password = hash;
    const user = await newUser.save();

    response.json(user);
  } catch (error) {
    response.status(500).json({ error });
  }
};

// Login with an existing user
export const loginUser = async (request, response) => {
  try {
    const { errorMessages, isValid } = validateLogin(request.body);
    const { email, password } = request.body;

    // Validate information
    if (!isValid) {
      response.status(400).json({ msg: errorMessages });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      response.status(404).json({ msg: ['Email not found'] });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const payload = {
        id: user.id,
        displayName: user.displayName,
      };

      // 28800 is 8 hours in seconds 
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 28800 });
      response.json({ success: true, token: `Bearer ${token}` });
    } else {
      response.status(400).json({ msg: ['Incorrect password'] });
    }
  } catch (error) {
    response.status(500).json({ error });
  }
};

// Delete a user
export const deleteUser = async (request, response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(request.user);
    response.json(deletedUser);
  } catch (error) {
    response.status(500).json({ error });
  }
};

// Verify JWT token (return true or false accordingly)
export const isValidToken = async (request, response) => {
  try {
    let token = request.header('Authorization');
    if (!token) return response.json(false);

    // Remove "Bearer " if present in the string
    if (token.slice(0, 6) === 'Bearer') token = token.slice(7).trim();
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return response.json(false);

    // If no user matches the id found in the token payload return false
    const user = await User.findById(verified.id);
    if (!user) return response.json(false);

    return response.json(true);
  } catch (error) {
    response.status(500).json(false);
  }
};

// Get user information with JWT token
export const getUserWithID = async (request, response) => {
  const user = await User.findById(request.user);
  response.json({
    id: user._id,
    email: user.email,
    displayName: user.displayName,
  });
};
