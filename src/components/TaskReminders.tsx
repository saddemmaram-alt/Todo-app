import {
  Box,
  Chip,
  Paper,
  Typography,
} from "@mui/material";

type Priority =
  | "high"
  | "medium"
  | "low";

type Category =
  | "University"
  | "Work"
  | "Personal"
  | "Shopping"
  | "Other";

type Task = {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: string | null;
  priority: Priority;
  category?: Category;
};

type ReminderType =
  | "overdue"
  | "today"
  | "tomorrow"
  | "upcoming";

type Reminder = {
  task: Task;
  type: ReminderType;
  daysDifference: number;
};

type TaskRemindersProps = {
  tasks: Task[];
};

function startOfDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

function getDayDifference(
  dueDate: string,
  today: Date
): number {
  const due = startOfDay(
    new Date(`${dueDate}T00:00:00`)
  );

  const current = startOfDay(today);

  const difference =
    due.getTime() -
    current.getTime();

  return Math.round(
    difference /
      (1000 * 60 * 60 * 24)
  );
}

function getReminderType(
  task: Task,
  today: Date
): ReminderType | null {
  if (!task.dueDate || task.completed) {
    return null;
  }

  const difference = getDayDifference(
    task.dueDate,
    today
  );

  if (difference < 0) {
    return "overdue";
  }

  if (difference === 0) {
    return "today";
  }

  if (difference === 1) {
    return "tomorrow";
  }

  if (difference <= 7) {
    return "upcoming";
  }

  return null;
}

function getReminderLabel(
  type: ReminderType
): string {
  switch (type) {
    case "overdue":
      return "Overdue";

    case "today":
      return "Due today";

    case "tomorrow":
      return "Due tomorrow";

    case "upcoming":
      return "Upcoming";

    default:
      return "Upcoming";
  }
}

function getReminderColor(
  type: ReminderType
): "error" | "warning" | "info" {
  switch (type) {
    case "overdue":
      return "error";

    case "today":
      return "warning";

    case "tomorrow":
      return "warning";

    case "upcoming":
      return "info";

    default:
      return "info";
  }
}

function getPriorityColor(
  priority: Priority
): "error" | "warning" | "success" {
  switch (priority) {
    case "high":
      return "error";

    case "medium":
      return "warning";

    case "low":
      return "success";

    default:
      return "warning";
  }
}

export default function TaskReminders({
  tasks,
}: TaskRemindersProps) {
  const today = new Date();

  const reminders: Reminder[] = tasks
    .map((task) => {
      const daysDifference = task.dueDate
        ? getDayDifference(
            task.dueDate,
            today
          )
        : 0;

      return {
        task,
        type: getReminderType(
          task,
          today
        ),
        daysDifference,
      };
    })
    .filter(
      (
        reminder
      ): reminder is Reminder =>
        reminder.type !== null
    )
    .sort(
      (a, b) =>
        a.daysDifference -
        b.daysDifference
    );

  if (reminders.length === 0) {
    return null;
  }

  const overdueCount =
    reminders.filter(
      (reminder) =>
        reminder.type === "overdue"
    ).length;

  const todayCount =
    reminders.filter(
      (reminder) =>
        reminder.type === "today"
    ).length;

  const upcomingCount =
    reminders.filter(
      (reminder) =>
        reminder.type === "tomorrow" ||
        reminder.type === "upcoming"
    ).length;

  return (
    <Paper
      elevation={2}
      sx={{
        p: {
          xs: 2,
          sm: 3,
        },
        mb: 3,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 600,
        }}
      >
        🔔 Task Reminders
      </Typography>

      {/* Reminder Summary */}

      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        {overdueCount > 0 && (
          <Chip
            label={`${overdueCount} Overdue`}
            color="error"
            size="small"
          />
        )}

        {todayCount > 0 && (
          <Chip
            label={`${todayCount} Due Today`}
            color="warning"
            size="small"
          />
        )}

        {upcomingCount > 0 && (
          <Chip
            label={`${upcomingCount} Upcoming`}
            color="info"
            size="small"
          />
        )}
      </Box>

      {/* Reminder List */}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        {reminders.map(
          ({
            task,
            type,
          }) => (
            <Box
              key={task.id}
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: {
                  xs: "flex-start",
                  sm: "center",
                },
                gap: 1,
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                p: 1.5,
                border: "1px solid",
                borderColor:
                  "divider",
                borderRadius: 2,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  {task.text}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Due:{" "}
                  {task.dueDate}

                  {" • "}

                  Category:{" "}
                  {task.category ??
                    "Other"}
                </Typography>

                <Chip
                  label={
                    task.priority
                      .charAt(0)
                      .toUpperCase() +
                    task.priority.slice(1)
                  }
                  color={getPriorityColor(
                    task.priority
                  )}
                  size="small"
                  sx={{
                    mt: 1,
                  }}
                />
              </Box>

              <Chip
                label={getReminderLabel(
                  type
                )}
                color={getReminderColor(
                  type
                )}
                size="small"
              />
            </Box>
          )
        )}
      </Box>
    </Paper>
  );
}