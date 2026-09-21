const cron = require("node-cron");

const {
  checkAndSendReminders,
} = require("./services/reminderService");

function startReminderScheduler() {
  cron.schedule("* * * * *", async () => {
    console.log("Checking task reminders...");

    try {
      await checkAndSendReminders();
    } catch (error) {
      console.error("Reminder scheduler error:", error);
    }
  });

  console.log("Reminder scheduler started.");
}

module.exports = {
  startReminderScheduler,
};