//import graphQL tagged template functoin
const { gql } = require('apollo-server-express');

//create typeDefs w/ tagged template function
const typeDefs = gql `
    type Thought {
        _id: ID
        thoughtText: String
        createdAt: String
        username: String
        reactionCount: Int
        reactions: [Reaction]
    }

    type Reaction {
        _id: ID
        reactionBody: String
        createdAt: String
        username: String
    }

    type Query {
        thoughts(username: String): [Thought]
    }
`;

//export typeDefs
module.exports = typeDefs;