const app = require("./app");

const {
  startReminderScheduler,
} = require("./scheduler");

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  startReminderScheduler();
});