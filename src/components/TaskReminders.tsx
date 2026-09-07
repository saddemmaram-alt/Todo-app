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
      difference / (1000 * 60 * 60 * 24)
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
  
  export default function TaskReminders({
    tasks,
  }: TaskRemindersProps) {
    const today = new Date();
  
    const reminders: Reminder[] = tasks
      .map((task) => ({
        task,
        type: getReminderType(
          task,
          today
        ),
      }))
      .filter(
        (
          reminder
        ): reminder is Reminder =>
          reminder.type !== null
      )
      .sort((a, b) => {
        const order: Record<
          ReminderType,
          number
        > = {
          overdue: 1,
          today: 2,
          tomorrow: 3,
          upcoming: 4,
        };
  
        return (
          order[a.type] -
          order[b.type]
        );
      });
  
    if (reminders.length === 0) {
      return null;
    }
  
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
                    Priority:{" "}
                    {task.priority}
                    {" • "}
                    Category:{" "}
                    {task.category ??
                      "Other"}
                  </Typography>
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