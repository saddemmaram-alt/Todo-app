require("../setupTests");

require("dotenv").config();

const request = require("supertest");
const app = require("../app");
const pool = require("../db");

describe("Tasks API", () => {
  let token;
  let secondUserToken;

  const password = "Password123!";

  const testEmail =
    `tasks-${Date.now()}@example.com`;

  const secondEmail =
    `tasks-second-${Date.now()}@example.com`;

  beforeAll(async () => {
    const firstRegister =
      await request(app)
        .post("/auth/register")
        .send({
          name: "Task User",
          email: testEmail,
          password,
        });

    expect(firstRegister.statusCode).toBe(201);

    const firstLogin =
      await request(app)
        .post("/auth/login")
        .send({
          email: testEmail,
          password,
        });

    expect(firstLogin.statusCode).toBe(200);

    token = firstLogin.body.token;

    const secondRegister =
      await request(app)
        .post("/auth/register")
        .send({
          name: "Second User",
          email: secondEmail,
          password,
        });

    expect(secondRegister.statusCode).toBe(201);

    const secondLogin =
      await request(app)
        .post("/auth/login")
        .send({
          email: secondEmail,
          password,
        });

    expect(secondLogin.statusCode).toBe(200);

    secondUserToken =
      secondLogin.body.token;
  });

  afterAll(async () => {
    await pool.query(
      `
        DELETE FROM users
        WHERE email IN ($1, $2)
      `,
      [testEmail, secondEmail]
    );

    await pool.end();
  });

  test(
    "GET /tasks returns 401 without authentication",
    async () => {
      const response =
        await request(app).get("/tasks");

      expect(response.statusCode).toBe(401);

      expect(response.body.error).toBe(
        "Authentication required"
      );
    }
  );

  test(
    "GET /tasks returns 200 and an array",
    async () => {
      const response =
        await request(app)
          .get("/tasks")
          .set(
            "Authorization",
            `Bearer ${token}`
          );

      expect(response.statusCode).toBe(200);

      expect(
        Array.isArray(response.body)
      ).toBe(true);
    }
  );

  test(
    "POST /tasks creates a task",
    async () => {
      const response =
        await request(app)
          .post("/tasks")
          .set(
            "Authorization",
            `Bearer ${token}`
          )
          .send({
            text: "Learn Jest",
          });

      expect(response.statusCode).toBe(201);

      expect(response.body.text).toBe(
        "Learn Jest"
      );

      expect(response.body.completed).toBe(
        false
      );
    }
  );

  test(
    "POST /tasks returns 400 for empty text",
    async () => {
      const response =
        await request(app)
          .post("/tasks")
          .set(
            "Authorization",
            `Bearer ${token}`
          )
          .send({
            text: "",
          });

      expect(response.statusCode).toBe(400);
    }
  );

  test(
    "POST /tasks returns 400 when text contains only spaces",
    async () => {
      const response =
        await request(app)
          .post("/tasks")
          .set(
            "Authorization",
            `Bearer ${token}`
          )
          .send({
            text: " ",
          });

      expect(response.statusCode).toBe(400);
    }
  );

  test(
    "POST /tasks returns 400 when text is missing",
    async () => {
      const response =
        await request(app)
          .post("/tasks")
          .set(
            "Authorization",
            `Bearer ${token}`
          )
          .send({});

      expect(response.statusCode).toBe(400);
    }
  );

  test(
    "POST /tasks returns 400 when text is null",
    async () => {
      const response =
        await request(app)
          .post("/tasks")
          .set(
            "Authorization",
            `Bearer ${token}`
          )
          .send({
            text: null,
          });

      expect(response.statusCode).toBe(400);
    }
  );

  test(
    "POST /tasks trims the text",
    async () => {
      const response =
        await request(app)
          .post("/tasks")
          .set(
            "Authorization",
            `Bearer ${token}`
          )
          .send({
            text: " Learn React ",
          });

      expect(response.statusCode).toBe(201);

      expect(response.body.text).toBe(
        "Learn React"
      );
    }
  );

  test(
    "PUT /tasks/:id updates a task",
    async () => {
      const created =
        await request(app)
          .post("/tasks")
          .set(
            "Authorization",
            `Bearer ${token}`
          )
          .send({
            text: "Old task",
            dueDate: "2026-09-10",
            priority: "medium",
          });

      expect(created.statusCode).toBe(201);

      const id = created.body.id;

      const response =
        await request(app)
          .put(`/tasks/${id}`)
          .set(
            "Authorization",
            `Bearer ${token}`
          )
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
    }
  );

  test(
    "PUT /tasks/:id trims updated text",
    async () => {
      const created =
        await request(app)
          .post("/tasks")
          .set(
            "Authorization",
            `Bearer ${token}`
          )
          .send({
            text: "Original task",
          });

      const id = created.body.id;

      const response =
        await request(app)
          .put(`/tasks/${id}`)
          .set(
            "Authorization",
            `Bearer ${token}`
          )
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
    }
  );

  test(
    "PUT /tasks/:id returns 400 for empty text",
    async () => {
      const created =
        await request(app)
          .post("/tasks")
          .set(
            "Authorization",
            `Bearer ${token}`
          )
          .send({
            text: "Task to edit",
          });

      const id = created.body.id;

      const response =
        await request(app)
          .put(`/tasks/${id}`)
          .set(
            "Authorization",
            `Bearer ${token}`
          )
          .send({
            text: "",
            priority: "medium",
          });

      expect(response.statusCode).toBe(400);

      expect(response.body.error).toBe(
        "Task text is required"
      );
    }
  );

  test(
    "PUT /tasks/:id returns 400 for spaces-only text",
    async () => {
      const created =
        await request(app)
          .post("/tasks")
          .set(
            "Authorization",
            `Bearer ${token}`
          )
          .send({
            text: "Task to edit",
          });

      const id = created.body.id;

      const response =
        await request(app)
          .put(`/tasks/${id}`)
          .set(
            "Authorization",
            `Bearer ${token}`
          )
          .send({
            text: " ",
            priority: "medium",
          });

      expect(response.statusCode).toBe(400);

      expect(response.body.error).toBe(
        "Task text is required"
      );
    }
  );

  test(
    "PUT /tasks/:id returns 400 for invalid priority",
    async () => {
      const created =
        await request(app)
          .post("/tasks")
          .set(
            "Authorization",
            `Bearer ${token}`
          )
          .send({
            text: "Task to edit",
          });

      const id = created.body.id;

      const response =
        await request(app)
          .put(`/tasks/${id}`)
          .set(
            "Authorization",
            `Bearer ${token}`
          )
          .send({
            text: "Updated task",
            priority: "urgent",
          });

      expect(response.statusCode).toBe(400);

      expect(response.body.error).toBe(
        "Invalid priority"
      );
    }
  );

  test(
    "PUT /tasks/:id returns 404 for unknown id",
    async () => {
      const response =
        await request(app)
          .put("/tasks/99999")
          .set(
            "Authorization",
            `Bearer ${token}`
          )
          .send({
            text: "Updated task",
            priority: "high",
          });

      expect(response.statusCode).toBe(404);

      expect(response.body.error).toBe(
        "Task not found"
      );
    }
  );

  test(
    "PATCH /tasks/:id toggles completed",
    async () => {
      const created =
        await request(app)
          .post("/tasks")
          .set(
            "Authorization",
            `Bearer ${token}`
          )
          .send({
            text: "Test PATCH",
          });

      const id = created.body.id;

      const response =
        await request(app)
          .patch(`/tasks/${id}`)
          .set(
            "Authorization",
            `Bearer ${token}`
          );

      expect(response.statusCode).toBe(200);

      expect(response.body.completed).toBe(
        true
      );
    }
  );

  test(
    "PATCH /tasks/:id toggles completed back",
    async () => {
      const created =
        await request(app)
          .post("/tasks")
          .set(
            "Authorization",
            `Bearer ${token}`
          )
          .send({
            text: "Test PATCH again",
          });

      const id = created.body.id;

      await request(app)
        .patch(`/tasks/${id}`)
        .set(
          "Authorization",
          `Bearer ${token}`
        );

      const response =
        await request(app)
          .patch(`/tasks/${id}`)
          .set(
            "Authorization",
            `Bearer ${token}`
          );

      expect(response.statusCode).toBe(200);

      expect(response.body.completed).toBe(
        false
      );
    }
  );

  test(
    "PATCH /tasks/:id returns 404 for unknown id",
    async () => {
      const response =
        await request(app)
          .patch("/tasks/99999")
          .set(
            "Authorization",
            `Bearer ${token}`
          );

      expect(response.statusCode).toBe(404);
    }
  );

  test(
    "DELETE /tasks/:id deletes a task",
    async () => {
      const created =
        await request(app)
          .post("/tasks")
          .set(
            "Authorization",
            `Bearer ${token}`
          )
          .send({
            text: "Task to delete",
          });

      const id = created.body.id;

      const response =
        await request(app)
          .delete(`/tasks/${id}`)
          .set(
            "Authorization",
            `Bearer ${token}`
          );

      expect(response.statusCode).toBe(204);
    }
  );

  test(
    "DELETE /tasks/:id returns 404 for unknown id",
    async () => {
      const response =
        await request(app)
          .delete("/tasks/99999")
          .set(
            "Authorization",
            `Bearer ${token}`
          );

      expect(response.statusCode).toBe(404);
    }
  );

  test(
    "user cannot update another user's task",
    async () => {
      const created =
        await request(app)
          .post("/tasks")
          .set(
            "Authorization",
            `Bearer ${token}`
          )
          .send({
            text: "Private task",
          });

      const id = created.body.id;

      const response =
        await request(app)
          .put(`/tasks/${id}`)
          .set(
            "Authorization",
            `Bearer ${secondUserToken}`
          )
          .send({
            text: "Hacked task",
            priority: "high",
          });

      expect(response.statusCode).toBe(404);

      expect(response.body.error).toBe(
        "Task not found"
      );
    }
  );

  test(
    "user cannot delete another user's task",
    async () => {
      const created =
        await request(app)
          .post("/tasks")
          .set(
            "Authorization",
            `Bearer ${token}`
          )
          .send({
            text: "Another private task",
          });

      const id = created.body.id;

      const response =
        await request(app)
          .delete(`/tasks/${id}`)
          .set(
            "Authorization",
            `Bearer ${secondUserToken}`
          );

      expect(response.statusCode).toBe(404);
    }
  );

  test(
    "user only receives their own tasks",
    async () => {
      const firstUserTask =
        await request(app)
          .post("/tasks")
          .set(
            "Authorization",
            `Bearer ${token}`
          )
          .send({
            text: "First user task",
          });

      await request(app)
        .post("/tasks")
        .set(
          "Authorization",
          `Bearer ${secondUserToken}`
        )
        .send({
          text: "Second user task",
        });

      const response =
        await request(app)
          .get("/tasks")
          .set(
            "Authorization",
            `Bearer ${token}`
          );

      expect(response.statusCode).toBe(200);

      expect(
        response.body.some(
          (task) =>
            task.id ===
            firstUserTask.body.id
        )
      ).toBe(true);

      expect(
        response.body.some(
          (task) =>
            task.text ===
            "Second user task"
        )
      ).toBe(false);
    }
  );
});