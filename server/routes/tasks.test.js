require("../setupTests");
const request = require("supertest");
const app = require("../app");

describe("Tasks API", () => {
  test("GET /tasks returns 200 and an array", async () => {
    const response = await request(app).get("/tasks");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("POST /tasks creates a task", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({ text: "Learn Jest" });

    expect(response.statusCode).toBe(201);
    expect(response.body.text).toBe("Learn Jest");
    expect(response.body.completed).toBe(false);
  });

  test("POST /tasks returns 400 for empty text", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({ text: "" });

    expect(response.statusCode).toBe(400);
  });

  test("POST /tasks returns 400 when text contains only spaces", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({ text: "   " });

    expect(response.statusCode).toBe(400);
  });

  test("POST /tasks returns 400 when text is missing", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({});

    expect(response.statusCode).toBe(400);
  });

  test("POST /tasks returns 400 when text is null", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({ text: null });

    expect(response.statusCode).toBe(400);
  });

  test("POST /tasks trims the text", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({ text: "   Learn React   " });

    expect(response.statusCode).toBe(201);
    expect(response.body.text).toBe("Learn React");
  });

  test("PATCH /tasks/:id toggles completed", async () => {
    const created = await request(app)
      .post("/tasks")
      .send({ text: "Test PATCH" });

    const id = created.body.id;

    const response = await request(app)
      .patch(`/tasks/${id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.completed).toBe(true);
  });

  test("PATCH /tasks/:id toggles completed back", async () => {
    const created = await request(app)
      .post("/tasks")
      .send({ text: "Test PATCH again" });

    const id = created.body.id;

    await request(app)
      .patch(`/tasks/${id}`);

    const response = await request(app)
      .patch(`/tasks/${id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.completed).toBe(false);
  });

  test("PATCH /tasks/:id returns 404 for unknown id", async () => {
    const response = await request(app)
      .patch("/tasks/99999");

    expect(response.statusCode).toBe(404);
  });

  test("DELETE /tasks/:id deletes a task", async () => {
    const created = await request(app)
      .post("/tasks")
      .send({ text: "Task to delete" });

    const id = created.body.id;

    const response = await request(app)
      .delete(`/tasks/${id}`);

    expect(response.statusCode).toBe(204);
  });

  test("DELETE /tasks/:id returns 404 for unknown id", async () => {
    const response = await request(app)
      .delete("/tasks/99999");

    expect(response.statusCode).toBe(404);
  });
});