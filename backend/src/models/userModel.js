import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: { unique: true },
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
});

export default UserSchema;