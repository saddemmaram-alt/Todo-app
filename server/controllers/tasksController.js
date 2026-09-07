const taskService = require("../services/taskService");

async function getTasks(req, res, next) {
  try {
    const tasks =
      await taskService.getAllTasks();

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
}

async function createTask(req, res, next) {
  try {
    const task =
      await taskService.createTask(
        req.body
      );

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
}

async function updateTask(req, res, next) {
  try {
    const id =
      Number(req.params.id);

    const task =
      await taskService.updateTask(
        id,
        req.body
      );

    if (!task) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
}

async function toggleTask(req, res, next) {
  try {
    const id =
      Number(req.params.id);

    const task =
      await taskService.toggleTask(
        id
      );

    if (!task) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
}

async function deleteTask(req, res, next) {
  try {
    const id =
      Number(req.params.id);

    const deleted =
      await taskService.deleteTask(
        id
      );

    if (!deleted) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
};