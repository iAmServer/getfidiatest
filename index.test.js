const { createTestClient } = require("apollo-server-testing");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const apolloServer = require("./index");
const mongodb = await MongoMemoryServer.create();

const connectDB = async () => {
  const uri = mongodb.getUri();
  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 10,
  };

  await mongoose.connect(uri, mongooseOpts);
};

const closeDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongodb.stop();
};

const clearDB = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

describe("Creator test", () => {
  beforeAll(async () => await connectDB());
  // afterEach(async () => await clearDB());
  afterAll(async () => await closeDB());

  test("list creators", async () => {
    const { query, mutate } = createTestClient(apolloServer);

    const GET_CREATORS = `
    {
      creators {
        id,
        name,
        email
      }
    }
    `;

    const response = await query({ query: GET_CREATORS });
    expect(response.data.creators).toEqual([]);

    // const SIGN_UP = `
    // mutation {
    //   signup(
    //     "name": "Ola Dayo",
    //     "email": "dasthdeer@outlook.com",
    //     "password": "Phpmyadmin1",
    //     "phone": "08122517750",
    //     "country": "NG"
    //   )
    // }
    // `;

    // response = await mutate({ mutation: SIGN_UP });
    // expect(response.error).toBeUndefined();

    // response = await query({ query: GET_CREATORS });
    expect(response.data.creators).toEqual([]);
  });
});
