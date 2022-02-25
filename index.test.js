const { createTestClient } = require("apollo-server-testing");

const server = require("./index");

test("read a list of books name", async () => {
  const { query } = createTestClient(server);

  const GET_CREATORS = `
  {
    creator {
      name
    }
  }
  `;

  const response = await query({ query: GET_CREATORS });

  expect(response.data.creators).toEqual([]);
});
