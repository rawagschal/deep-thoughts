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
    
    # auth with JWT
    type Auth {
        token: ID!
        user: User
    }

    type Reaction {
        _id: ID
        reactionBody: String
        createdAt: String
        username: String
    }

    type Query {
        # get the user that is logged in w/ JWT
        me: User
        users: [User]
        # adding username param for ability to look up user by username (required)
        user(username: String!): User
        # adding username param for ability to look up thought by username (not required)
        thoughts(username: String): [Thought]
        # adding _id param for ability to look up thought by _id (required)
        thought(_id: ID!): Thought 
    }

    type Mutation {
        # return Auth data type which includes user and JWT
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
    }
`;

//export typeDefs
module.exports = typeDefs;