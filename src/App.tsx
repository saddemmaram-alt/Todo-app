import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import DashboardStats from "./components/DashboardStats";
import Chatbot from "./components/Chatbot";
import { useTasks } from "./viewmodels/useTasks";

import "./App.css";

function App() {
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
   * Display loading error
   */
  if (error) {
    return (
      <Container maxWidth="md">
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            mt: 4,
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
    );
  }

  return (
    <Container maxWidth="md">
      {/* Header */}
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          mt: 4,
        }}
      >
        TaskFlow
      </Typography>

      <Typography
        variant="subtitle1"
        sx={{
          mb: 3,
        }}
      >
        Manage your tasks easily
      </Typography>

      {/* Dashboard statistics */}
      <DashboardStats
        totalTasks={totalTasks}
        activeTasks={activeTasks}
        completedTasks={completedTasks}
        overdueTasks={overdueTasks}
        tasks={tasks}
      />

      {/* Add task form */}
      <Box
        sx={{
          mt: 3,
          mb: 3,
        }}
      >
        <TaskForm onAdd={addTask} />
      </Box>

      {/* Search / Category / Sort */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 3,
        }}
      >
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
            <InputLabel>Category</InputLabel>

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
            </Select>
          </FormControl>

          {/* Sort */}
          <FormControl
            size="small"
            sx={{
              minWidth: 160,
            }}
          >
            <InputLabel>Sort</InputLabel>

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

      {/* Status filters */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          mb: 3,
        }}
      >
        <Button
          variant={
            filter === "all"
              ? "contained"
              : "outlined"
          }
          onClick={() => setFilter("all")}
        >
          All Tasks
        </Button>

        <Button
          variant={
            filter === "active"
              ? "contained"
              : "outlined"
          }
          onClick={() => setFilter("active")}
        >
          Active
        </Button>

        <Button
          variant={
            filter === "completed"
              ? "contained"
              : "outlined"
          }
          onClick={() => setFilter("completed")}
        >
          Completed
        </Button>

        <Button
          variant={
            filter === "overdue"
              ? "contained"
              : "outlined"
          }
          onClick={() => setFilter("overdue")}
        >
          Overdue
        </Button>
      </Box>

      {/* Task list */}
      <TaskList
        tasks={filteredTasks}
        onToggle={toggleTask}
        onDelete={deleteTask}
        onEdit={editTask}
        emptyMessage="📝 No tasks yet. Create your first task!"
      />

      {/* Chatbot */}
      <Chatbot />

      {/* Success notification */}
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
  );
}

export default App;