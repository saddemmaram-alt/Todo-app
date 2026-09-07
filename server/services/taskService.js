let tasks = [];
let nextId = 1;

function getAllTasks() {
  return tasks;
}

function createTask({
  text,
  dueDate,
  priority,
  category,
}) {
  const task = {
    id: nextId++,
    text: text.trim(),
    completed: false,
    dueDate: dueDate || null,
    priority: priority || "medium",
    category: category || "Other",
  };

  tasks.push(task);

  return task;
}

function findTaskById(id) {
  return tasks.find(
    (task) => task.id === id
  );
}

function updateTask(
  id,
  {
    text,
    dueDate,
    priority,
    category,
  }
) {
  const task = findTaskById(id);

  if (!task) {
    return null;
  }

  task.text = text.trim();
  task.dueDate = dueDate || null;
  task.priority = priority || "medium";
  task.category =
    category || task.category || "Other";

  return task;
}

function toggleTask(id) {
  const task = findTaskById(id);

  if (!task) {
    return null;
  }

  task.completed = !task.completed;

  return task;
}

function deleteTask(id) {
  const index = tasks.findIndex(
    (task) => task.id === id
  );

  if (index === -1) {
    return false;
  }

  tasks.splice(index, 1);

  return true;
}

module.exports = {
  getAllTasks,
  createTask,
  findTaskById,
  updateTask,
  toggleTask,
  deleteTask,
};