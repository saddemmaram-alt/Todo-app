const express = require("express");

const router = express.Router();

let tasks = [];
let nextId = 1;

// GET /tasks
router.get("/", (req, res) => {
  res.status(200).json(tasks);
});

// POST /tasks
router.post("/", (req, res) => {
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({
      error: "Task text is required",
    });
  }

  const task = {
    id: nextId++,
    text: text.trim(),
    completed: false,
  };

  tasks.push(task);

  res.status(201).json(task);
});

// PATCH /tasks/:id
router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  task.completed = !task.completed;

  res.status(200).json(task);
});

// DELETE /tasks/:id
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  tasks.splice(index, 1);

  res.status(204).send();
});

module.exports = router;