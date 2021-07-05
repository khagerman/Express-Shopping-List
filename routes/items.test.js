process.env.NODE_ENV = "test";
// npm packages
const request = require("supertest");
// app imports
const app = require("../app");

let items = require("../fakeDb");

let cheese = { name: "cheese", price: 1.99 };

beforeEach(function () {
  items.push(cheese);
});

afterEach(function () {
  // make sure this *mutates*, not redefines, `items`
  items.length = 0;
});

describe("GET /items", () => {
  test("Get all items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(res.body.items[0]).toEqual(cheese);
    expect(items).toHaveLength(1);
  });
});

describe("GET /items/:name", () => {
  test("Get item by name", async () => {
    const res = await request(app).get(`/items/${cheese.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(cheese);
  });
  test("Responds with 404 for invalid item", async () => {
    const res = await request(app).get(`/items/cottoncandy`);
    expect(res.statusCode).toBe(404);
  });
});

describe("POST /items", () => {
  test("Creating a item", async () => {
    const res = await request(app)
      .post("/items")
      .send({ name: "popcorn", price: 2.89 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ added: { name: "popcorn", price: 2.89 } });
  });
  test("Responds with 400 if name is missing", async () => {
    const res = await request(app).post("/items").send({});
    expect(res.statusCode).toBe(400);
  });
});

describe("/PATCH /items/:name", () => {
  test("Updating a item's name", async () => {
    const res = await request(app)
      .patch(`/items/${cheese.name}`)
      .send({ name: "chedder" });

    expect(res.body).toEqual({ updated: { name: "chedder", price: 1.99 } });
  });
  test("Responds with 404 for invalid name", async () => {
    const res = await request(app)
      .patch(`/items/dkjkdjdkjskdifdj`)
      .send({ name: "chedder" });
    expect(res.statusCode).toBe(404);
  });
});

describe("/DELETE /items/:name", () => {
  test("Deleting a item", async () => {
    const res = await request(app).delete(`/items/${cheese.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Deleted" });
  });
  test("Responds with 404 for deleting invalid item", async () => {
    const res = await request(app).delete(`/items/ham`);
    expect(res.statusCode).toBe(404);
  });
});
