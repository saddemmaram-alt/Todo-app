const taskService = require("../services/taskService");

function getTasks(req, res) {
  const tasks = taskService.getAllTasks();

  res.status(200).json(tasks);
}

function createTask(req, res) {
  const task = taskService.createTask(
    req.body
  );

  res.status(201).json(task);
}

function updateTask(req, res) {
  const id = Number(req.params.id);

  const task = taskService.updateTask(
    id,
    req.body
  );

  if (!task) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  res.status(200).json(task);
}

function toggleTask(req, res) {
  const id = Number(req.params.id);

  const task = taskService.toggleTask(id);

  if (!task) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  res.status(200).json(task);
}

function deleteTask(req, res) {
  const id = Number(req.params.id);

  const deleted =
    taskService.deleteTask(id);

  if (!deleted) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  res.status(204).send();
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
};