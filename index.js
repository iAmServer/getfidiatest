const { ApolloServer } = require("apollo-server-express");
require("dotenv").config();

const Query = require("./query");
const Mutation = require("./mutation");
const TypeDefs = require("./type");

const server = new ApolloServer({
  introspection: true,
  playground: true,
  typeDefs: TypeDefs,
  resolvers: {
    Query,
    Mutation,
  },
});

module.exports = server;
