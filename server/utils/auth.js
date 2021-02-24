const jwt = require('jsonwebtoken');

// use .env vars for these in production
const secret = 'mysecretshh';
const expiration = '2h';

module.exports = {
    // expects a user object with the specified properties
    signToken: function({ username, email, _id }) {
        const payload = { username, email, _id };

        return jwt.sign({ data: payload}, secret, { expiresIn: expiration });
    },
    // JWT auth middleware
    authMiddleware: function({ req }) {
        // allows token to be sent via req.body, req.query, or headers
        let token = req.body.token || req.query.token || req.headers.authorization;

        // separate "Bearer" from token value
        if (req.headers.authorization) {
            token = token
                .split(' ')
                .pop()
                .trim();
        }
        
        // if no token, return object as is
        if (!token) {
            return req;
        }
        // try...catch to mute error in case user w/invalid token wants to see all thoughts
        try {
            // decode and attatch user data to req object
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            req.user = data;
        } catch {
            console.log('Invalid token');
        }

        //return updated req object
        return req;
    }
};

