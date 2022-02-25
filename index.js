const { ApolloServer } = require("apollo-server-express");
require("dotenv").config();

const Query = require("./query");
const Mutation = require("./mutation");
const TypeDefs = require("./type");

const server = new ApolloServer({
  typeDefs: TypeDefs,
  resolvers: {
    Query,
    Mutation,
  },
  introspection: true,
  playground: true,
});

module.exports = server;
