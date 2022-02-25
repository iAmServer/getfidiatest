const CreatorModel = require("./models/creator");

const Query = {
  creators: () =>
    CreatorModel.find({})
      .then((creators) => creators)
      .catch((err) => new Error(err)),

  creator: (_, { id }) =>
    CreatorModel.findById(id)
      .then((creator) => creator)
      .catch((err) => new Error(err)),
};

module.exports = Query;
