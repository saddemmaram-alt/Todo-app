const swaggerSpec = {
  openapi: "3.0.0",

  info: {
    title: "TaskFlow API",
    version: "1.0.0",
    description:
      "REST API for the TaskFlow task management application.",
  },

  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server",
    },
  ],

  tags: [
    {
      name: "Authentication",
      description:
        "User registration and login operations",
    },

    {
      name: "Tasks",
      description:
        "Task management operations",
    },
  ],

  paths: {
    "/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a new user",

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                $ref:
                  "#/components/schemas/RegisterUser",
              },
            },
          },
        },

        responses: {
          201: {
            description:
              "User registered successfully",
          },

          400: {
            description:
              "Invalid registration data",
          },

          409: {
            description:
              "Email already registered",
          },
        },
      },
    },

    "/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Login user",

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                $ref:
                  "#/components/schemas/LoginUser",
              },
            },
          },
        },

        responses: {
          200: {
            description:
              "Login successful",

            content: {
              "application/json": {
                schema: {
                  $ref:
                    "#/components/schemas/LoginResponse",
                },
              },
            },
          },

          400: {
            description:
              "Invalid login data",
          },

          401: {
            description:
              "Invalid email or password",
          },
        },
      },
    },

    "/tasks": {
      get: {
        tags: ["Tasks"],
        summary: "Get all tasks",

        security: [
          {
            bearerAuth: [],
          },
        ],

        responses: {
          200: {
            description:
              "List of tasks",

            content: {
              "application/json": {
                schema: {
                  type: "array",

                  items: {
                    $ref:
                      "#/components/schemas/Task",
                  },
                },
              },
            },
          },

          401: {
            description:
              "Authentication required",
          },
        },
      },

      post: {
        tags: ["Tasks"],
        summary: "Create a new task",

        security: [
          {
            bearerAuth: [],
          },
        ],

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                $ref:
                  "#/components/schemas/CreateTask",
              },
            },
          },
        },

        responses: {
          201: {
            description:
              "Task created successfully",
          },

          400: {
            description:
              "Invalid task data",
          },

          401: {
            description:
              "Authentication required",
          },
        },
      },
    },

    "/tasks/{id}": {
      put: {
        tags: ["Tasks"],
        summary: "Update a task",

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,

            schema: {
              type: "integer",
            },
          },
        ],

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                $ref:
                  "#/components/schemas/CreateTask",
              },
            },
          },
        },

        responses: {
          200: {
            description:
              "Task updated successfully",
          },

          400: {
            description:
              "Invalid task data",
          },

          401: {
            description:
              "Authentication required",
          },

          404: {
            description:
              "Task not found",
          },
        },
      },

      patch: {
        tags: ["Tasks"],
        summary:
          "Toggle task completion",

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,

            schema: {
              type: "integer",
            },
          },
        ],

        responses: {
          200: {
            description:
              "Task status updated",
          },

          401: {
            description:
              "Authentication required",
          },

          404: {
            description:
              "Task not found",
          },
        },
      },

      delete: {
        tags: ["Tasks"],
        summary: "Delete a task",

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,

            schema: {
              type: "integer",
            },
          },
        ],

        responses: {
          204: {
            description:
              "Task deleted successfully",
          },

          401: {
            description:
              "Authentication required",
          },

          404: {
            description:
              "Task not found",
          },
        },
      },
    },
  },

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },

    schemas: {
      RegisterUser: {
        type: "object",

        required: [
          "name",
          "email",
          "password",
        ],

        properties: {
          name: {
            type: "string",
            example: "Maram",
          },

          email: {
            type: "string",
            format: "email",
            example:
              "maram@example.com",
          },

          password: {
            type: "string",
            format: "password",
            example:
              "password123",
          },
        },
      },

      LoginUser: {
        type: "object",

        required: [
          "email",
          "password",
        ],

        properties: {
          email: {
            type: "string",
            format: "email",
            example:
              "maram@example.com",
          },

          password: {
            type: "string",
            format: "password",
            example:
              "password123",
          },
        },
      },

      LoginResponse: {
        type: "object",

        properties: {
          token: {
            type: "string",
            example:
              "eyJhbGciOiJIUzI1NiIs...",
          },

          user: {
            type: "object",

            properties: {
              id: {
                type: "integer",
                example: 1,
              },

              name: {
                type: "string",
                example: "Maram",
              },

              email: {
                type: "string",
                example:
                  "maram@example.com",
              },
            },
          },
        },
      },

      Task: {
        type: "object",

        required: [
          "id",
          "text",
          "completed",
          "priority",
          "category",
        ],

        properties: {
          id: {
            type: "integer",
            example: 1,
          },

          text: {
            type: "string",
            example:
              "Learn React",
          },

          completed: {
            type: "boolean",
            example: false,
          },

          dueDate: {
            type: "string",
            format: "date",
            nullable: true,
            example:
              "2026-09-15",
          },

          priority: {
            type: "string",

            enum: [
              "high",
              "medium",
              "low",
            ],

            example: "medium",
          },

          category: {
            type: "string",

            enum: [
              "University",
              "Work",
              "Personal",
              "Shopping",
              "Other",
            ],

            example:
              "University",
          },
        },
      },

      CreateTask: {
        type: "object",

        required: ["text"],

        properties: {
          text: {
            type: "string",
            example:
              "Learn React",
          },

          dueDate: {
            type: "string",
            format: "date",
            nullable: true,
            example:
              "2026-09-15",
          },

          priority: {
            type: "string",

            enum: [
              "high",
              "medium",
              "low",
            ],

            example: "medium",
          },

          category: {
            type: "string",

            enum: [
              "University",
              "Work",
              "Personal",
              "Shopping",
              "Other",
            ],

            example:
              "University",
          },
        },
      },
    },
  },
};

module.exports = swaggerSpec;