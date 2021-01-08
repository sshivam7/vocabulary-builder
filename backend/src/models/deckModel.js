import mongoose from 'mongoose';

const { Schema } = mongoose;

const DeckSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    index: { unique: true },
  },
  slug: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  description: {
    type: String,
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  cards: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
});

export default DeckSchema;
