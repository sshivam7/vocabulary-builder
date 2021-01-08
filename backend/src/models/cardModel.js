import mongoose from 'mongoose';

const { Schema } = mongoose;

const CardSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  definition: {
    type: String,
    required: true,
  },
  example: {
    type: String,
  },
  pronunciation: {
    type: String,
  },
  difficulty: {
    type: Number,
    default: 3,
    enum: [1, 2, 3, 4, 5],
  },
});

export default CardSchema;
