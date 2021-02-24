const { User, Thought } = require('../models')
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    // GET request functionality
    Query: {
        // get thoughts by username w/ destructured args param for username
        thoughts: async (parent, { username }) => {
            const params = username ? { username } : {};
            return Thought.find(params).sort({ createdAt: -1 });
        },
        thought: async(parent, { _id }) => {
            return Thought.findOne({ _id });
        },
        //returning all users so no need for params
        users: async() => {
            return User.find()
            // omit pw and mongoose __v property
            .select('-__v -password')
            .populate('friends')
            .populate('thoughts');
        },
        // get user by username w/ desctructured args of username
        user: async(parent, { username }) => {
            return User.findOne({ username })
            .select('-__v -password')
            .populate('friends')
            .populate('thoughts');
        }
    },
    // CREATE, UPDATE, DELETE request functionality
    Mutation: {
        addUser: async (parent, args) => {
            // mongoose User model creates new user in db w/ whatever is passed in as args
            const user = await User.create(args);

            return user;
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if(!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw) {
                throw new AuthenticationError('Incorrect credentials')
            }

            return user;
        }
    }
};

module.exports = resolvers;