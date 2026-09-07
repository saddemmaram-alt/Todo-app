require("../setupTests");

const request = require("supertest");
const app = require("../app");
const pool = require("../db");

describe("Tasks API", () => {
  afterAll(async () => {
    await pool.end();
  });

  test("GET /tasks returns 200 and an array", async () => {
    const response = await request(app).get("/tasks");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("POST /tasks creates a task", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({
        text: "Learn Jest",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.text).toBe("Learn Jest");
    expect(response.body.completed).toBe(false);
  });

  test("POST /tasks returns 400 for empty text", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({
        text: "",
      });

    expect(response.statusCode).toBe(400);
  });

  test("POST /tasks returns 400 when text contains only spaces", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({
        text: " ",
      });

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
      .send({
        text: null,
      });

    expect(response.statusCode).toBe(400);
  });

  test("POST /tasks trims the text", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({
        text: " Learn React ",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.text).toBe(
      "Learn React"
    );
  });

  // PUT /tasks/:id - EDIT

  test("PUT /tasks/:id updates a task", async () => {
    const created = await request(app)
      .post("/tasks")
      .send({
        text: "Old task",
        dueDate: "2026-09-10",
        priority: "medium",
      });

    const id = created.body.id;

    const response = await request(app)
      .put(`/tasks/${id}`)
      .send({
        text: "Updated task",
        dueDate: "2026-09-15",
        priority: "high",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(id);
    expect(response.body.text).toBe(
      "Updated task"
    );
    expect(response.body.dueDate).toBe(
      "2026-09-15"
    );
    expect(response.body.priority).toBe(
      "high"
    );
  });

  test("PUT /tasks/:id trims updated text", async () => {
    const created = await request(app)
      .post("/tasks")
      .send({
        text: "Original task",
      });

    const id = created.body.id;

    const response = await request(app)
      .put(`/tasks/${id}`)
      .send({
        text: " Updated task ",
        priority: "low",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.text).toBe(
      "Updated task"
    );
    expect(response.body.priority).toBe(
      "low"
    );
  });

  test("PUT /tasks/:id returns 400 for empty text", async () => {
    const created = await request(app)
      .post("/tasks")
      .send({
        text: "Task to edit",
      });

    const id = created.body.id;

    const response = await request(app)
      .put(`/tasks/${id}`)
      .send({
        text: "",
        priority: "medium",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(
      "Task text is required"
    );
  });

  test("PUT /tasks/:id returns 400 for spaces-only text", async () => {
    const created = await request(app)
      .post("/tasks")
      .send({
        text: "Task to edit",
      });

    const id = created.body.id;

    const response = await request(app)
      .put(`/tasks/${id}`)
      .send({
        text: " ",
        priority: "medium",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(
      "Task text is required"
    );
  });

  test("PUT /tasks/:id returns 400 for invalid priority", async () => {
    const created = await request(app)
      .post("/tasks")
      .send({
        text: "Task to edit",
      });

    const id = created.body.id;

    const response = await request(app)
      .put(`/tasks/${id}`)
      .send({
        text: "Updated task",
        priority: "urgent",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(
      "Invalid priority"
    );
  });

  test("PUT /tasks/:id returns 404 for unknown id", async () => {
    const response = await request(app)
      .put("/tasks/99999")
      .send({
        text: "Updated task",
        priority: "high",
      });

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe(
      "Task not found"
    );
  });

  // PATCH /tasks/:id - COMPLETE / UNCOMPLETE

  test("PATCH /tasks/:id toggles completed", async () => {
    const created = await request(app)
      .post("/tasks")
      .send({
        text: "Test PATCH",
      });

    const id = created.body.id;

    const response = await request(app)
      .patch(`/tasks/${id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.completed).toBe(true);
  });

  test("PATCH /tasks/:id toggles completed back", async () => {
    const created = await request(app)
      .post("/tasks")
      .send({
        text: "Test PATCH again",
      });

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

  // DELETE /tasks/:id

  test("DELETE /tasks/:id deletes a task", async () => {
    const created = await request(app)
      .post("/tasks")
      .send({
        text: "Task to delete",
      });

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