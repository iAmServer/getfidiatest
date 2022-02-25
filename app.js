const express = require("express");
const mongoose = require("mongoose");
const apolloServer = require("./index");
require("dotenv").config();

const app = express();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

apolloServer.start().then(() => {
  apolloServer.applyMiddleware({ app });

  app.listen({ port: process.env.PORT }, () =>
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
    )
  );
});
