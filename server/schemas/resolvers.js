const { User, Thought } = require('../models')

const resolvers = {
    // GET request definitions
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
    }
};

module.exports = resolvers;