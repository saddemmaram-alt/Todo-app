import { useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import DashboardStats from "./components/DashboardStats";

import { useTasks } from "./viewmodels/useTasks";

import "./App.css";

function App() {
  const [darkMode, setDarkMode] =
    useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode
            ? "dark"
            : "light",
        },
      }),
    [darkMode]
  );

  const {
    tasks,
    filteredTasks,

    filter,
    setFilter,

    categoryFilter,
    setCategoryFilter,

    searchTerm,
    setSearchTerm,

    sortBy,
    setSortBy,

    isLoading,
    error,
    retryLoadTasks,

    successNotification,

    addTask,
    editTask,
    toggleTask,
    deleteTask,
  } = useTasks();

  const [
    snackbarOpen,
    setSnackbarOpen,
  ] = useState(false);

  const [
    snackbarMessage,
    setSnackbarMessage,
  ] = useState("");

  useMemo(() => {
    if (successNotification) {
      setSnackbarMessage(
        successNotification.message
      );

      setSnackbarOpen(true);
    }
  }, [successNotification]);

  const totalTasks = tasks.length;

  const activeTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const overdueTasks = tasks.filter(
    (task) =>
      !task.completed &&
      task.dueDate !== null &&
      new Date(task.dueDate) <
        new Date()
  ).length;

  const hasNoTasks = tasks.length === 0;

  const hasNoMatchingTasks =
    tasks.length > 0 &&
    filteredTasks.length === 0;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Container
        maxWidth="md"
        sx={{
          px: {
            xs: 1.5,
            sm: 2,
          },
        }}
      >
        <Paper
          elevation={4}
          sx={{
            mt: {
              xs: 2,
              sm: 6,
            },
            p: {
              xs: 2,
              sm: 4,
            },
            borderRadius: {
              xs: 2,
              sm: 3,
            },
            position: "relative",
          }}
        >
          {/* Theme button */}
          <Box
            sx={{
              position: "absolute",
              top: {
                xs: 8,
                sm: 12,
              },
              right: {
                xs: 8,
                sm: 12,
              },
            }}
          >
            <IconButton
              onClick={() =>
                setDarkMode(
                  (current) => !current
                )
              }
              aria-label={
                darkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {darkMode ? (
                <LightModeIcon />
              ) : (
                <DarkModeIcon />
              )}
            </IconButton>
          </Box>

          <Typography
            variant="h3"
            component="h1"
            align="center"
            gutterBottom
            sx={{
              fontSize: {
                xs: "2rem",
                sm: "3rem",
              },
              pr: {
                xs: 4,
                sm: 0,
              },
            }}
          >
            TaskFlow
          </Typography>

          <Typography
            variant="body1"
            align="center"
            sx={{ mb: 3 }}
          >
            Manage your tasks easily
          </Typography>

          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 8,
                gap: 2,
              }}
            >
              <CircularProgress />

              <Typography>
                Loading tasks...
              </Typography>
            </Box>
          ) : error ? (
            <Box sx={{ py: 4 }}>
              <Alert
                severity="error"
                sx={{ mb: 2 }}
              >
                {error}
              </Alert>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="contained"
                  onClick={retryLoadTasks}
                >
                  Try Again
                </Button>
              </Box>
            </Box>
          ) : (
            <>
              <DashboardStats
                totalTasks={totalTasks}
                activeTasks={activeTasks}
                completedTasks={
                  completedTasks
                }
                overdueTasks={
                  overdueTasks
                }
                tasks={tasks}
              />

              <TaskForm onAdd={addTask} />

              <TextField
                fullWidth
                label="Search tasks"
                placeholder="Search by task name..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                sx={{ mb: 3 }}
              />

              <Typography
                variant="h6"
                sx={{ mb: 1 }}
              >
                Status
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mb: 3,
                  flexWrap: "wrap",
                }}
              >
                <Button
                  sx={{
                    flex: {
                      xs: "1 1 calc(50% - 8px)",
                      sm: "0 1 auto",
                    },
                  }}
                  variant={
                    filter === "all"
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() =>
                    setFilter("all")
                  }
                >
                  All Tasks
                </Button>

                <Button
                  sx={{
                    flex: {
                      xs: "1 1 calc(50% - 8px)",
                      sm: "0 1 auto",
                    },
                  }}
                  variant={
                    filter === "active"
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() =>
                    setFilter("active")
                  }
                >
                  Active
                </Button>

                <Button
                  sx={{
                    flex: {
                      xs: "1 1 calc(50% - 8px)",
                      sm: "0 1 auto",
                    },
                  }}
                  variant={
                    filter === "completed"
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() =>
                    setFilter("completed")
                  }
                >
                  Completed
                </Button>

                <Button
                  sx={{
                    flex: {
                      xs: "1 1 calc(50% - 8px)",
                      sm: "0 1 auto",
                    },
                  }}
                  variant={
                    filter === "overdue"
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() =>
                    setFilter("overdue")
                  }
                >
                  Overdue
                </Button>
              </Box>

              <Typography
                variant="h6"
                sx={{ mb: 1 }}
              >
                Categories
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  mb: 3,
                }}
              >
                {[
                  {
                    value: "all" as const,
                    label: "All",
                  },
                  {
                    value:
                      "University" as const,
                    label: "🎓 University",
                  },
                  {
                    value: "Work" as const,
                    label: "💼 Work",
                  },
                  {
                    value:
                      "Personal" as const,
                    label: "👤 Personal",
                  },
                  {
                    value:
                      "Shopping" as const,
                    label: "🛒 Shopping",
                  },
                  {
                    value: "Other" as const,
                    label: "📌 Other",
                  },
                ].map((category) => (
                  <Button
                    key={category.value}
                    sx={{
                      flex: {
                        xs: "1 1 calc(50% - 8px)",
                        sm: "0 1 auto",
                      },
                    }}
                    variant={
                      categoryFilter ===
                      category.value
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() =>
                      setCategoryFilter(
                        category.value
                      )
                    }
                  >
                    {category.label}
                  </Button>
                ))}
              </Box>

              <FormControl
                fullWidth
                sx={{ mb: 3 }}
              >
                <InputLabel>
                  Sort tasks
                </InputLabel>

                <Select
                  value={sortBy}
                  label="Sort tasks"
                  onChange={(event) =>
                    setSortBy(
                      event.target
                        .value as
                        | "default"
                        | "priority-high"
                        | "priority-low"
                        | "due-date"
                        | "alphabetical"
                    )
                  }
                >
                  <MenuItem value="default">
                    Default order
                  </MenuItem>

                  <MenuItem value="priority-high">
                    Priority: High → Low
                  </MenuItem>

                  <MenuItem value="priority-low">
                    Priority: Low → High
                  </MenuItem>

                  <MenuItem value="due-date">
                    Due date
                  </MenuItem>

                  <MenuItem value="alphabetical">
                    Alphabetical A → Z
                  </MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ mt: 2 }}>
                <TaskList
                  tasks={filteredTasks}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  onEdit={editTask}
                  emptyMessage={
                    hasNoTasks
                      ? "📝 No tasks yet. Create your first task!"
                      : hasNoMatchingTasks
                        ? "🔍 No matching tasks. Try changing your search or filters."
                        : "No tasks yet"
                  }
                />
              </Box>
            </>
          )}
        </Paper>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() =>
            setSnackbarOpen(false)
          }
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Alert
            severity="success"
            variant="filled"
            onClose={() =>
              setSnackbarOpen(false)
            }
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}

export default App;