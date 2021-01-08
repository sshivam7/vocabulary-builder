import {Strategy, ExtractJwt} from 'passport-jwt';
import mongoose from 'mongoose';

import UserSchema from '../src/models/userModel';

const User = mongoose.model('User', UserSchema);

// Passport configuration
const opts = {
     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
     secretOrKey: process.env.JWT_SECRET
}

module.exports = (passport) => {
     passport.use(new Strategy(opts, (payload, done) => {
          User.findById(payload.id)
          .then(user => {
               if (user) {
                    return done(null, user);
               }
               return done(null, false);
          })
          .catch(error => console.error(error));
     }));
};

