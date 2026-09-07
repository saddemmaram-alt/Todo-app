import {
  Box,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";

import DashboardCharts from "./DashboardCharts";
import TaskCalendar from "./TaskCalendar";
import TaskReminders from "./TaskReminders";

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

type DashboardStatsProps = {
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
  overdueTasks: number;
  tasks?: Task[];
};

export default function DashboardStats({
  totalTasks,
  activeTasks,
  completedTasks,
  overdueTasks,
  tasks = [],
}: DashboardStatsProps) {
  const completionRate =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks /
            totalTasks) *
            100
        );

  const highPriorityTasks =
    tasks.filter(
      (task) =>
        task.priority === "high"
    ).length;

  const mediumPriorityTasks =
    tasks.filter(
      (task) =>
        task.priority === "medium"
    ).length;

  const lowPriorityTasks =
    tasks.filter(
      (task) =>
        task.priority === "low"
    ).length;

  const universityTasks =
    tasks.filter(
      (task) =>
        (task.category ?? "Other") ===
        "University"
    ).length;

  const workTasks = tasks.filter(
    (task) =>
      (task.category ?? "Other") ===
      "Work"
  ).length;

  const personalTasks =
    tasks.filter(
      (task) =>
        (task.category ?? "Other") ===
        "Personal"
    ).length;

  const shoppingTasks =
    tasks.filter(
      (task) =>
        (task.category ?? "Other") ===
        "Shopping"
    ).length;

  const otherTasks = tasks.filter(
    (task) =>
      (task.category ?? "Other") ===
      "Other"
  ).length;

  return (
    <Box sx={{ mb: 4 }}>
      {/* Main statistics */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {[
          {
            value: totalTasks,
            label: "Total",
          },
          {
            value: activeTasks,
            label: "Active",
          },
          {
            value: completedTasks,
            label: "Completed",
          },
          {
            value: overdueTasks,
            label: "Overdue",
          },
        ].map((stat) => (
          <Paper
            key={stat.label}
            elevation={2}
            sx={{
              p: {
                xs: 1.5,
                sm: 2,
              },
              textAlign: "center",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontSize: {
                  xs: "1.8rem",
                  sm: "2.125rem",
                },
                fontWeight: "bold",
              }}
            >
              {stat.value}
            </Typography>

            <Typography>
              {stat.label}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Completion Rate */}
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
          sx={{ mb: 1 }}
        >
          Completion Rate
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 2,
            fontSize: {
              xs: "2rem",
              sm: "2.125rem",
            },
          }}
        >
          {completionRate}%
        </Typography>

        <LinearProgress
          variant="determinate"
          value={completionRate}
          sx={{
            height: 10,
            borderRadius: 5,
          }}
        />
      </Paper>

      {/* Tasks by Priority */}
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
          sx={{ mb: 2 }}
        >
          Tasks by Priority
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(3, 1fr)",
            },
            gap: 2,
          }}
        >
          <Box>
            <Typography>
              🔴 High: {highPriorityTasks}
            </Typography>

            <LinearProgress
              variant="determinate"
              value={
                totalTasks === 0
                  ? 0
                  : (highPriorityTasks /
                      totalTasks) *
                    100
              }
              sx={{ mt: 1 }}
            />
          </Box>

          <Box>
            <Typography>
              🟠 Medium:{" "}
              {mediumPriorityTasks}
            </Typography>

            <LinearProgress
              variant="determinate"
              value={
                totalTasks === 0
                  ? 0
                  : (mediumPriorityTasks /
                      totalTasks) *
                    100
              }
              sx={{ mt: 1 }}
            />
          </Box>

          <Box>
            <Typography>
              🟢 Low: {lowPriorityTasks}
            </Typography>

            <LinearProgress
              variant="determinate"
              value={
                totalTasks === 0
                  ? 0
                  : (lowPriorityTasks /
                      totalTasks) *
                    100
              }
              sx={{ mt: 1 }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Tasks by Category */}
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
          sx={{ mb: 2 }}
        >
          Tasks by Category
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              md: "repeat(5, 1fr)",
            },
            gap: 2,
          }}
        >
          <Box>
            <Typography>
              🎓 University
            </Typography>

            <Typography
              variant="h5"
              sx={{ fontWeight: "bold" }}
            >
              {universityTasks}
            </Typography>
          </Box>

          <Box>
            <Typography>
              💼 Work
            </Typography>

            <Typography
              variant="h5"
              sx={{ fontWeight: "bold" }}
            >
              {workTasks}
            </Typography>
          </Box>

          <Box>
            <Typography>
              👤 Personal
            </Typography>

            <Typography
              variant="h5"
              sx={{ fontWeight: "bold" }}
            >
              {personalTasks}
            </Typography>
          </Box>

          <Box>
            <Typography>
              🛒 Shopping
            </Typography>

            <Typography
              variant="h5"
              sx={{ fontWeight: "bold" }}
            >
              {shoppingTasks}
            </Typography>
          </Box>

          <Box>
            <Typography>
              📌 Other
            </Typography>

            <Typography
              variant="h5"
              sx={{ fontWeight: "bold" }}
            >
              {otherTasks}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Task Reminders */}
      <TaskReminders tasks={tasks} />

      {/* Advanced Analytics */}
      <DashboardCharts tasks={tasks} />

      {/* Calendar */}
      <TaskCalendar tasks={tasks} />
    </Box>
  );
}