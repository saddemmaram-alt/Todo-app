const pool = require("../db");

function mapTask(row) {
  return {
    id: row.id,
    text: row.text,
    completed: row.completed,
    dueDate: row.due_date,
    priority: row.priority,
    category: row.category,
  };
}

async function getAllTasks(userId) {
  const result = await pool.query(
    `
      SELECT
        id,
        text,
        completed,
        TO_CHAR(due_date, 'YYYY-MM-DD') AS due_date,
        priority,
        category
      FROM tasks
      WHERE user_id = $1
      ORDER BY id ASC
    `,
    [userId]
  );

  return result.rows.map(mapTask);
}

async function createTask(
  userId,
  {
    text,
    dueDate,
    priority,
    category,
  }
) {
  const result = await pool.query(
    `
      INSERT INTO tasks (
        user_id,
        text,
        due_date,
        priority,
        category
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        text,
        completed,
        TO_CHAR(due_date, 'YYYY-MM-DD') AS due_date,
        priority,
        category
    `,
    [
      userId,
      text.trim(),
      dueDate || null,
      priority || "medium",
      category || "Other",
    ]
  );

  return mapTask(result.rows[0]);
}

async function findTaskById(
  id,
  userId
) {
  const result = await pool.query(
    `
      SELECT
        id,
        text,
        completed,
        TO_CHAR(due_date, 'YYYY-MM-DD') AS due_date,
        priority,
        category
      FROM tasks
      WHERE id = $1
        AND user_id = $2
    `,
    [id, userId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapTask(result.rows[0]);
}

async function updateTask(
  id,
  userId,
  {
    text,
    dueDate,
    priority,
    category,
  }
) {
  const existingTask =
    await findTaskById(id, userId);

  if (!existingTask) {
    return null;
  }

  const result = await pool.query(
    `
      UPDATE tasks
      SET
        text = $1,
        due_date = $2,
        priority = $3,
        category = $4
      WHERE id = $5
        AND user_id = $6
      RETURNING
        id,
        text,
        completed,
        TO_CHAR(due_date, 'YYYY-MM-DD') AS due_date,
        priority,
        category
    `,
    [
      text.trim(),
      dueDate || null,
      priority || "medium",
      category ||
        existingTask.category ||
        "Other",
      id,
      userId,
    ]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapTask(result.rows[0]);
}

async function toggleTask(
  id,
  userId
) {
  const result = await pool.query(
    `
      UPDATE tasks
      SET completed = NOT completed
      WHERE id = $1
        AND user_id = $2
      RETURNING
        id,
        text,
        completed,
        TO_CHAR(due_date, 'YYYY-MM-DD') AS due_date,
        priority,
        category
    `,
    [id, userId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapTask(result.rows[0]);
}

async function deleteTask(
  id,
  userId
) {
  const result = await pool.query(
    `
      DELETE FROM tasks
      WHERE id = $1
        AND user_id = $2
      RETURNING id
    `,
    [id, userId]
  );

  return result.rows.length > 0;
}

module.exports = {
  getAllTasks,
  createTask,
  findTaskById,
  updateTask,
  toggleTask,
  deleteTask,
};