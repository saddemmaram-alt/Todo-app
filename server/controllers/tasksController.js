const taskService =
  require("../services/taskService");

async function getTasks(req, res, next) {
  try {
    const userId = req.user.userId;

    const tasks =
      await taskService.getAllTasks(
        userId
      );

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
}

async function createTask(req, res, next) {
  try {
    const userId = req.user.userId;

    const task =
      await taskService.createTask(
        userId,
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

    const userId =
      req.user.userId;

    const task =
      await taskService.updateTask(
        id,
        userId,
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

    const userId =
      req.user.userId;

    const task =
      await taskService.toggleTask(
        id,
        userId
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

    const userId =
      req.user.userId;

    const deleted =
      await taskService.deleteTask(
        id,
        userId
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