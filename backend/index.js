import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';

import userRouter from './src/routes/userRouter';
import deckRouter from './src/routes/deckRouter';
import cardRouter from './src/routes/cardRouter';

require('dotenv').config();

// Express setup
const app = express();
const PORT = process.env.PORT || 4000;

// CORS setup
app.use(cors());

// Connecting to Mongo
mongoose.Promise = global.Promise;
mongoose
  .connect('mongodb://localhost/vocabDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('Database Connection Established'))
  .catch((error) => console.error(error));

// body-parser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Passport setup
app.use(passport.initialize());
require('./config/passport')(passport);

// Routes
app.use('/api/users', userRouter);
app.use('/api/deck', deckRouter);
app.use('/api/card', cardRouter);

app.get('/', (request, response) => {
  response.send(`The backend server is running on port: ${PORT}`);
});

app.listen(PORT, () => console.log(`The backend server is running on port: ${PORT}`));

