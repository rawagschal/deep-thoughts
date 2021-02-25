const { User, Thought } = require('../models')
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

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
        },
        // get the user that is logged in
        me: async(parent, args, context) => {
            // check if user is authenticated
            if (context.user) {
                const userData = await User.findOne({})
                .select('-__v -password')
                .populate('thoughts')
                .populate('friends');

                return userData;
            }
            // if user isn't authenticated, 
            throw new AuthenticationError('Not logged in')
        }
    },
    // CREATE, UPDATE, DELETE request functionality
    Mutation: {
        addUser: async (parent, args) => {
            // mongoose User model creates new user in db w/ whatever is passed in as args
            const user = await User.create(args);
            // sign a token for the user
            const token = signToken(user);
            
            return { token, user } ;
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
            //sign token after express auth passes
            const token = signToken(user);
            return { token, user };
        },
        addThought: async (parent, args, context) => {
            // if the user is authenticated
            if (context.user) {
                // create a new thought by that user
                const thought = await Thought.create({ ...args, username: context.user.username });
                // update this instance of the User document (model) with the new thought
                await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    // using Mongo $push operator to update the thoughts array on the user
                    { $push: { thoughts: thought._id } },
                    // tells mongoDB to return updated version
                    { new: true }
                );

                return thought;
            }

            throw new AuthenticationError('You need to be logged in to add a thought!');
        },
        addReaction: async (parent, { thoughtId, reactionBody }, context) => {
            // if the user is authenticated
            if (context.user) {
                // update this instance of the Thought doc with a new reaction
                const updatedThought = await Thought.findOneAndUpdate(
                    { _id: thoughtId },
                    // using Mongo $push operator to push new reaction to the reactions array on Thought
                    { $push: {reactions: { reactionBody, username: context.user.username, } } },
                    { new: true, runValidators: true }
                );

                return updatedThought;
            }

            throw new AuthenticationError('You need to be logged in to add a reaction!');
        },
        addFriend: async (parent, { friendId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    // using Mongo $addToSet so that the same friend can only be added once
                    { $addToSet: { friends: friendId } },
                    { new: true }
                ).populate('friends');

                return updatedUser;
            }

            throw new AuthenticationError('You need to be logged in to add a friend!');
        }
    }
};

module.exports = resolvers;