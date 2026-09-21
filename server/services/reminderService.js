const pool = require("../db");
const { sendEmail } = require("./emailService");

async function checkAndSendReminders() {
  const result = await pool.query(`
    SELECT
      tasks.id,
      tasks.text,
      tasks.due_date,
      users.email
    FROM tasks
    JOIN users
      ON users.id = tasks.user_id
    WHERE tasks.completed = false
      AND tasks.due_date IS NOT NULL
      AND (
        tasks.due_date = CURRENT_DATE + INTERVAL '1 day'
        OR tasks.due_date = CURRENT_DATE
        OR tasks.due_date < CURRENT_DATE
      )
  `);

  console.log(
    `Found ${result.rows.length} task(s) requiring reminders.`
  );

  for (const task of result.rows) {
    let reminderType;
    let subject;
    let text;

    const dueDate = new Date(task.due_date);
    const today = new Date();

    const dueDateString = dueDate.toISOString().slice(0, 10);
    const todayString = today.toISOString().slice(0, 10);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tomorrowString = tomorrow.toISOString().slice(0, 10);

    if (dueDateString === tomorrowString) {
      reminderType = "tomorrow";

      subject = "TaskFlow Reminder - Task due tomorrow";

      text = `Reminder: your task "${task.text}" is due tomorrow.`;
    } else if (dueDateString === todayString) {
      reminderType = "today";

      subject = "TaskFlow Reminder - Task due today";

      text = `Reminder: your task "${task.text}" is due today.`;
    } else {
      reminderType = "overdue";

      subject = "TaskFlow Reminder - Task overdue";

      text = `Reminder: your task "${task.text}" is overdue.`;
    }

    const existingReminder = await pool.query(
      `
        SELECT id
        FROM task_reminders
        WHERE task_id = $1
          AND reminder_type = $2
      `,
      [task.id, reminderType]
    );

    if (existingReminder.rows.length > 0) {
      console.log(
        `Reminder already sent for task ${task.id}: ${reminderType}`
      );

      continue;
    }

    console.log(
      `Sending ${reminderType} reminder for task ${task.id} → ${task.email}`
    );

    await sendEmail({
      to: task.email,
      subject,
      text,
    });

    await pool.query(
      `
        INSERT INTO task_reminders (
          task_id,
          reminder_type
        )
        VALUES ($1, $2)
      `,
      [task.id, reminderType]
    );

    console.log(
      `Reminder sent successfully for task ${task.id}: ${reminderType}`
    );
  }
}

module.exports = {
  checkAndSendReminders,
};