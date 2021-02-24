//import graphQL tagged template functoin
const { gql } = require('apollo-server-express');

//create typeDefs w/ tagged template function

const typeDefs = gql `
    type Thought {
        # key:value pairs where value is GQL scalar
        _id: ID
        thoughtText: String
        createdAt: String
        username: String
        reactionCount: Int
        reactions: [Reaction]
    }

    type User {
        _id: ID
        username: String
        email: String
        friendCount: Int
        thoughts: [Thought]
        friends: [User]
    }

    type Reaction {
        _id: ID
        reactionBody: String
        createdAt: String
        username: String
    }

    type Query {
        users: [User]
        # adding username param for ability to look up user by username (required)
        user(username: String!): User
        # adding username param for ability to look up thought by username (not required)
        thoughts(username: String): [Thought]
        # adding _id param for ability to look up thought by _id (required)
        thought(_id: ID!): Thought 
    }

    type Mutation {
        login(email: String!, password: String!): User
        addUser(username: String!, email: String!, password: String!): User
    }
`;

//export typeDefs
module.exports = typeDefs;