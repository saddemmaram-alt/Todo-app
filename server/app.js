require("dotenv").config();

const express = require("express");
const cors = require("cors");

const swaggerUi =
  require("swagger-ui-express");

const swaggerSpec =
  require("./swagger");

const tasksRouter = require(
  "./routes/tasks"
);

const errorHandler = require(
  "./middleware/errorHandler"
);

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("TaskFlow API is running");
});

app.use(
  "/tasks",
  tasksRouter
);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.use(errorHandler);

module.exports = app;