const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Creator {
    id: ID
    name: String!
    phone: String!
    email: String!
    password: String!
    country: String
    verified: Boolean
  }

  input CreatorInput {
    name: String!
    email: String!
    password: String!
    phone: String!
    country: String!
  }

  type AuthPayload {
    token: String
    error: String
    creator: Creator
  }

  type EmailPayload {
    success: Boolean!
    error: String
  }

  type Query {
    creators: [Creator]
    creator(id: ID!): Creator
  }

  type Mutation {
    signup(creator: CreatorInput): AuthPayload
    confirmEmail(token: String!): EmailPayload
    resendEmailVerification(token: String!): EmailPayload
    login(email: String!, password: String!): AuthPayload
  }
`;

module.exports = typeDefs;
