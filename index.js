const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const Query = require("./query");
const Mutation = require("./mutation");
const TypeDefs = require("./type");

const app = express();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const server = new ApolloServer({
  introspection: true,
  playground: true,
  typeDefs: TypeDefs,
  resolvers: {
    Query,
    Mutation,
  },
});

server.start().then(() => {
  server.applyMiddleware({ app });

  app.listen({ port: process.env.PORT }, () =>
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
    )
  );
});
