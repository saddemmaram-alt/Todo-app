const express = require("express");

const {
  getTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
} = require("../controllers/tasksController");

const validateTask = require(
  "../middleware/validateTask"
);

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

// Protect all task routes with JWT authentication
router.use(authMiddleware);

/**
 * @openapi
 * /tasks:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Get all tasks for the authenticated user
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: Authentication required
 */
router.get(
  "/",
  getTasks
);

/**
 * @openapi
 * /tasks:
 *   post:
 *     tags:
 *       - Tasks
 *     summary: Create a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTask'
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Invalid task data
 *       401:
 *         description: Authentication required
 */
router.post(
  "/",
  validateTask,
  createTask
);

/**
 * @openapi
 * /tasks/{id}:
 *   put:
 *     tags:
 *       - Tasks
 *     summary: Update a task
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTask'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Invalid task data
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Task not found
 */
router.put(
  "/:id",
  validateTask,
  updateTask
);

/**
 * @openapi
 * /tasks/{id}:
 *   patch:
 *     tags:
 *       - Tasks
 *     summary: Toggle task completion
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task status updated
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Task not found
 */
router.patch(
  "/:id",
  toggleTask
);

/**
 * @openapi
 * /tasks/{id}:
 *   delete:
 *     tags:
 *       - Tasks
 *     summary: Delete a task
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Task not found
 */
router.delete(
  "/:id",
  deleteTask
);

/**
 * @openapi
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - id
 *         - text
 *         - completed
 *         - priority
 *         - category
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         text:
 *           type: string
 *           example: Learn React
 *         completed:
 *           type: boolean
 *           example: false
 *         dueDate:
 *           type: string
 *           format: date
 *           nullable: true
 *           example: 2026-09-15
 *         priority:
 *           type: string
 *           enum:
 *             - high
 *             - medium
 *             - low
 *           example: medium
 *         category:
 *           type: string
 *           enum:
 *             - University
 *             - Work
 *             - Personal
 *             - Shopping
 *             - Other
 *           example: University
 *
 *     CreateTask:
 *       type: object
 *       required:
 *         - text
 *       properties:
 *         text:
 *           type: string
 *           example: Learn React
 *         dueDate:
 *           type: string
 *           format: date
 *           nullable: true
 *           example: 2026-09-15
 *         priority:
 *           type: string
 *           enum:
 *             - high
 *             - medium
 *             - low
 *           example: medium
 *         category:
 *           type: string
 *           enum:
 *             - University
 *             - Work
 *             - Personal
 *             - Shopping
 *             - Other
 *           example: University
 */
 
module.exports = router;