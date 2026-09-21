const taskService = require("./taskService");

console.log("🔥 NEW CHATBOT SERVICE LOADED");

async function processMessage(userId, message) {
  const tasks = await taskService.getAllTasks(userId);

  const text = message.toLowerCase().trim();

  console.log("🤖 Chatbot message:", text);

  // Greeting
  if (
    text.includes("hello") ||
    text.includes("hi") ||
    text.includes("hey") ||
    text.includes("مرحبا") ||
    text.includes("سلام")
  ) {
    return "Hello! 👋 I'm your TaskFlow assistant. How can I help you with your tasks?";
  }

  // Show my tasks
  if (
    text.includes("show my tasks") ||
    text.includes("my tasks") ||
    text === "tasks" ||
    text.includes("all tasks") ||
    text.includes("مهامي") ||
    text === "المهام"
  ) {
    if (tasks.length === 0) {
      return "You don't have any tasks yet. 📝";
    }

    const taskList = tasks
      .map((task) => {
        const status = task.completed
          ? "✅ Completed"
          : "⬜ Active";

        return `${status} ${task.text}
Priority: ${task.priority || "medium"}
Category: ${task.category || "Other"}
Due date: ${task.dueDate || "No due date"}`;
      })
      .join("\n\n");

    return `You have ${tasks.length} task(s):

${taskList}`;
  }

  // Completed tasks
  if (
    text.includes("completed") ||
    text.includes("done") ||
    text.includes("مكتملة") ||
    text.includes("كملت")
  ) {
    const completedTasks = tasks.filter(
      (task) => task.completed
    );

    if (completedTasks.length === 0) {
      return "You don't have any completed tasks.";
    }

    const taskList = completedTasks
      .map(
        (task) =>
          `✅ ${task.text}
Priority: ${task.priority || "medium"}
Category: ${task.category || "Other"}`
      )
      .join("\n\n");

    return `You have ${completedTasks.length} completed task(s):

${taskList}`;
  }

  // Active tasks
  if (
    text.includes("active") ||
    text.includes("pending") ||
    text.includes("غير مكتملة") ||
    text.includes("الباقية")
  ) {
    const activeTasks = tasks.filter(
      (task) => !task.completed
    );

    if (activeTasks.length === 0) {
      return "You don't have any active tasks.";
    }

    const taskList = activeTasks
      .map(
        (task) =>
          `⬜ ${task.text}
Priority: ${task.priority || "medium"}
Category: ${task.category || "Other"}
Due date: ${task.dueDate || "No due date"}`
      )
      .join("\n\n");

    return `You have ${activeTasks.length} active task(s):

${taskList}`;
  }

  // Overdue tasks
  if (
    text.includes("overdue") ||
    text.includes("late") ||
    text.includes("متأخرة") ||
    text.includes("متأخر")
  ) {
    const today = new Date()
      .toISOString()
      .split("T")[0];

    const overdueTasks = tasks.filter(
      (task) =>
        !task.completed &&
        task.dueDate &&
        task.dueDate < today
    );

    if (overdueTasks.length === 0) {
      return "You don't have any overdue tasks. 🎉";
    }

    const taskList = overdueTasks
      .map(
        (task) =>
          `⚠️ ${task.text} - Due: ${task.dueDate}`
      )
      .join("\n");

    return `You have ${overdueTasks.length} overdue task(s):

${taskList}`;
  }

  // High priority tasks
  if (
    text.includes("high priority") ||
    text.includes("important") ||
    text.includes("urgent") ||
    text.includes("أهم")
  ) {
    const highTasks = tasks.filter(
      (task) =>
        !task.completed &&
        task.priority === "high"
    );

    if (highTasks.length === 0) {
      return "You don't have any high priority tasks.";
    }

    const taskList = highTasks
      .map(
        (task) =>
          `🔴 ${task.text}
Due date: ${task.dueDate || "No due date"}
Category: ${task.category || "Other"}`
      )
      .join("\n\n");

    return `You have ${highTasks.length} high priority task(s):

${taskList}`;
  }

  // Statistics
  if (
    text.includes("statistics") ||
    text.includes("stats") ||
    text.includes("summary") ||
    text.includes("ملخص")
  ) {
    const total = tasks.length;

    const completed = tasks.filter(
      (task) => task.completed
    ).length;

    const active = tasks.filter(
      (task) => !task.completed
    ).length;

    const today = new Date()
      .toISOString()
      .split("T")[0];

    const overdue = tasks.filter(
      (task) =>
        !task.completed &&
        task.dueDate &&
        task.dueDate < today
    ).length;

    return `📊 TaskFlow Summary:

📋 Total: ${total}
🔵 Active: ${active}
✅ Completed: ${completed}
⚠️ Overdue: ${overdue}`;
  }

  // Unknown message
  return `I can help you with your tasks. 🤖

Try:

• Show my tasks
• Show completed tasks
• Show active tasks
• Show overdue tasks
• Show high priority tasks
• Give me my statistics`;
}

module.exports = {
  processMessage,
};