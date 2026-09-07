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
      name: "Tasks",
      description:
        "Task management operations",
    },
  ],

  paths: {
    "/tasks": {
      get: {
        tags: ["Tasks"],
        summary: "Get all tasks",
        responses: {
          200: {
            description:
              "List of tasks",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Task",
                  },
                },
              },
            },
          },
        },
      },

      post: {
        tags: ["Tasks"],
        summary: "Create a new task",

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
        },
      },
    },

    "/tasks/{id}": {
      put: {
        tags: ["Tasks"],
        summary: "Update a task",

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

          404: {
            description:
              "Task not found",
          },
        },
      },

      delete: {
        tags: ["Tasks"],
        summary: "Delete a task",

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

          404: {
            description:
              "Task not found",
          },
        },
      },
    },
  },

  components: {
    schemas: {
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
            example: "Learn React",
          },

          completed: {
            type: "boolean",
            example: false,
          },

          dueDate: {
            type: "string",
            format: "date",
            nullable: true,
            example: "2026-09-15",
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
            example: "University",
          },
        },
      },

      CreateTask: {
        type: "object",

        required: ["text"],

        properties: {
          text: {
            type: "string",
            example: "Learn React",
          },

          dueDate: {
            type: "string",
            format: "date",
            nullable: true,
            example: "2026-09-15",
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
            example: "University",
          },
        },
      },
    },
  },
};

module.exports = swaggerSpec;