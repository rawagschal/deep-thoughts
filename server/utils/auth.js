const jwt = require('jsonwebtoken');
require('dotenv').config();

// use .env vars for these in production
const secret = process.env.SECRET;
const expiration = process.env.EXPIRATION;

module.exports = {
    // expects a user object with the specified properties
    signToken: function({ username, email, _id }) {
        const payload = { username, email, _id };

        return jwt.sign({ data: payload}, secret, { expiresIn: expiration });
    }
};

