const { createTestClient } = require("apollo-server-testing");

const apolloServer = require("./index");
const { dbConnect, dbDisconnect } = require("./db");

describe("Creator test", () => {
  beforeAll(async () => await dbConnect());
  afterAll(async () => await dbDisconnect());

  test("creator sign up", async () => {
    const { mutate } = createTestClient(apolloServer);

    const mutation = `
      mutation Signup {
        signup (creator: {
          name: "Ola Dayo",
          email: "test@gmail.com",
          password: "1234",
          phone: "1111111111",
          country: "NG"
        }){
          token
          error
          creator{
            name
            email
            phone
            id
            country
          }
        }
      }
    `;

    response = await mutate({ mutation: mutation });
    expect(response.errors).toBeUndefined();
    expect(response.data.signup.error).toBeNull();
    expect(response.data.signup.token).toBeDefined();
  });

  test("login test", async () => {
    const { mutate } = createTestClient(apolloServer);

    const mutation = `
      mutation Login {
        login (email: "test@gmail.com", password: "1234"){
          error
        }
      }
    `;

    response = await mutate({ mutation: mutation });
    expect(response.data.login.error).toBe(
      "User not verified, check your email"
    );
  });

  test("list creators", async () => {
    const { query } = createTestClient(apolloServer);

    const queries = `
    {
      creators {
        id,
        name,
        email,
        country
      }
    }
    `;

    const response = await query({ query: queries });
    expect(response.data.creators).toBeDefined();
  });
});
