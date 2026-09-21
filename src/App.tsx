import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import { useMemo, useState } from "react";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import {
  Brightness4,
  Brightness7,
} from "@mui/icons-material";

import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import DashboardStats from "./components/DashboardStats";
import Chatbot from "./components/Chatbot";

import { useTasks } from "./viewmodels/useTasks";

import "./App.css";

function App() {
  /*
   * Light / Dark Mode
   */
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: "#1976d2",
          },
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
    addTask,
    editTask,
    toggleTask,
    deleteTask,
    successNotification,
    error,
    retryLoadTasks,
  } = useTasks();

  /*
   * Dashboard statistics
   */
  const totalTasks = tasks.length;

  const activeTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate || task.completed) {
      return false;
    }

    return new Date(task.dueDate) < new Date();
  }).length;

  /*
   * Loading error
   */
  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "background.default",
            color: "text.primary",
            transition:
              "background-color 0.3s ease, color 0.3s ease",
          }}
        >
          <Container maxWidth="md">

            {/* Theme button */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                pt: 2,
              }}
            >
              <IconButton
                onClick={() =>
                  setDarkMode((prev) => !prev)
                }
                color="inherit"
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                {darkMode ? (
                  <Brightness7 />
                ) : (
                  <Brightness4 />
                )}
              </IconButton>
            </Box>

            <Typography
              variant="h3"
              gutterBottom
              sx={{
                mt: 2,
              }}
            >
              TaskFlow
            </Typography>

            <Typography
              variant="subtitle1"
              sx={{
                mb: 4,
              }}
            >
              Manage your tasks easily
            </Typography>

            <Alert
              severity="error"
              sx={{
                mb: 2,
              }}
            >
              {error}
            </Alert>

            <Button
              variant="contained"
              onClick={retryLoadTasks}
            >
              Try Again
            </Button>

          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
          transition:
            "background-color 0.3s ease, color 0.3s ease",
        }}
      >
        <Container maxWidth="md">

          {/* =========================
              1. HEADER
          ========================== */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 3,
              mb: 3,
            }}
          >
            <Box>
              <Typography
                variant="h3"
                gutterBottom
              >
                TaskFlow
              </Typography>

              <Typography variant="subtitle1">
                Manage your tasks easily
              </Typography>
            </Box>

            {/* Light / Dark Mode */}
            <IconButton
              onClick={() =>
                setDarkMode((prev) => !prev)
              }
              color="inherit"
              sx={{
                border: "1px solid",
                borderColor: "divider",
                width: 45,
                height: 45,
              }}
            >
              {darkMode ? (
                <Brightness7 />
              ) : (
                <Brightness4 />
              )}
            </IconButton>
          </Box>

          {/* =========================
              2. ADD TASK
          ========================== */}

          <Box
            sx={{
              mt: 2,
              mb: 4,
            }}
          >
            <TaskForm onAdd={addTask} />
          </Box>

          {/* =========================
              3. SEARCH / CATEGORY / SORT
          ========================== */}

          <Paper
            elevation={2}
            sx={{
              p: 2,
              mb: 4,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 600,
              }}
            >
              Search / Category / Sort
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
              }}
            >

              {/* Search */}
              <TextField
                label="Search tasks"
                placeholder="Search by task name..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                size="small"
                sx={{
                  flex: 1,
                  minWidth: 200,
                }}
              />

              {/* Category */}
              <FormControl
                size="small"
                sx={{
                  minWidth: 160,
                }}
              >
                <InputLabel>
                  Category
                </InputLabel>

                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) =>
                    setCategoryFilter(e.target.value)
                  }
                >
                  <MenuItem value="all">
                    All Categories
                  </MenuItem>

                  <MenuItem value="University">
                    🎓 University
                  </MenuItem>

                  <MenuItem value="Work">
                    💼 Work
                  </MenuItem>

                  <MenuItem value="Personal">
                    👤 Personal
                  </MenuItem>

                  <MenuItem value="Shopping">
                    🛒 Shopping
                  </MenuItem>

                  <MenuItem value="Other">
                    📌 Other
                  </MenuItem>
                </Select>
              </FormControl>

              {/* Sort */}
              <FormControl
                size="small"
                sx={{
                  minWidth: 160,
                }}
              >
                <InputLabel>
                  Sort
                </InputLabel>

                <Select
                  value={sortBy}
                  label="Sort"
                  onChange={(e) =>
                    setSortBy(e.target.value)
                  }
                >
                  <MenuItem value="newest">
                    Newest
                  </MenuItem>

                  <MenuItem value="oldest">
                    Oldest
                  </MenuItem>

                  <MenuItem value="priority">
                    Priority
                  </MenuItem>

                  <MenuItem value="dueDate">
                    Due Date
                  </MenuItem>
                </Select>
              </FormControl>

            </Box>
          </Paper>

          {/* =========================
              4. TASKS
          ========================== */}

          <Box sx={{ mb: 4 }}>

            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontWeight: 600,
              }}
            >
              Tasks
            </Typography>

            <TaskList
              tasks={filteredTasks}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onEdit={editTask}
              emptyMessage="📝 No tasks yet. Create your first task!"
            />

          </Box>

          {/* =========================
              5. FILTERS
          ========================== */}

          <Box
            sx={{
              mb: 4,
            }}
          >

            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 600,
              }}
            >
              Filters
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
              }}
            >

              {/* All */}
              <Button
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

              {/* Active */}
              <Button
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

              {/* Completed */}
              <Button
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

              {/* Overdue */}
              <Button
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

          </Box>

          {/* =========================
              6. DASHBOARD
          ========================== */}

          <Box sx={{ mb: 5 }}>

            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontWeight: 600,
              }}
            >
              Dashboard
            </Typography>

            <DashboardStats
              totalTasks={totalTasks}
              activeTasks={activeTasks}
              completedTasks={completedTasks}
              overdueTasks={overdueTasks}
              tasks={tasks}
            />

          </Box>

          {/* =========================
              CHATBOT
          ========================== */}

          <Chatbot />

          {/* =========================
              SUCCESS NOTIFICATION
          ========================== */}

          {successNotification && (
            <Snackbar
              open={true}
              autoHideDuration={3000}
            >
              <Alert
                severity="success"
                variant="filled"
              >
                {successNotification.message}
              </Alert>
            </Snackbar>
          )}

        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;