import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  } = useTasks();

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const activeTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const overdueTasks = tasks.filter(
    (task) =>
      !task.completed &&
      task.dueDate &&
      task.dueDate < today
  ).length;

  return (
    <Container
      maxWidth="md"
      sx={{ py: 4 }}
    >
      {/* Header */}

      <Typography
        variant="h3"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
      >
        TaskFlow
      </Typography>

      <Typography
        variant="subtitle1"
        textAlign="center"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Manage your tasks easily
      </Typography>

      {/* Dashboard Statistics */}

      <DashboardStats
        totalTasks={totalTasks}
        activeTasks={activeTasks}
        completedTasks={completedTasks}
        overdueTasks={overdueTasks}
        tasks={tasks}
      />

      {/* Task Form */}

      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
        }}
      >
        <TaskForm onAdd={addTask} />
      </Paper>

      {/* Search + Filters + Sort */}

      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 2 }}
        >
          Find and organize your tasks
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "2fr 1fr 1fr",
            },
            gap: 2,
          }}
        >
          {/* Search */}

          <TextField
            label="Search tasks"
            placeholder="Search by task name..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            fullWidth
          />

          {/* Category */}

          <FormControl fullWidth>
            <InputLabel>
              Category
            </InputLabel>

            <Select
              value={categoryFilter}
              label="Category"
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value as
                    | "all"
                    | "University"
                    | "Work"
                    | "Personal"
                    | "Shopping"
                    | "Other"
                )
              }
            >
              <MenuItem value="all">
                All Categories
              </MenuItem>

              <MenuItem value="University">
                University
              </MenuItem>

              <MenuItem value="Work">
                Work
              </MenuItem>

              <MenuItem value="Personal">
                Personal
              </MenuItem>

              <MenuItem value="Shopping">
                Shopping
              </MenuItem>

              <MenuItem value="Other">
                Other
              </MenuItem>
            </Select>
          </FormControl>

          {/* Sort */}

          <FormControl fullWidth>
            <InputLabel>
              Sort by
            </InputLabel>

            <Select
              value={sortBy}
              label="Sort by"
              onChange={(event) =>
                setSortBy(
                  event.target.value as
                    | "default"
                    | "priority-high"
                    | "priority-low"
                    | "due-date"
                    | "alphabetical"
                )
              }
            >
              <MenuItem value="default">
                Default
              </MenuItem>

              <MenuItem value="priority-high">
                Priority: High → Low
              </MenuItem>

              <MenuItem value="priority-low">
                Priority: Low → High
              </MenuItem>

              <MenuItem value="due-date">
                Due Date
              </MenuItem>

              <MenuItem value="alphabetical">
                Alphabetical
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Status Filters */}

        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            mt: 3,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              alignSelf: "center",
              mr: 1,
              fontWeight: "bold",
            }}
          >
            Status:
          </Typography>

          <button
            type="button"
            onClick={() => setFilter("all")}
            className={
              filter === "all"
                ? "filter-button active"
                : "filter-button"
            }
          >
            All Tasks
          </button>

          <button
            type="button"
            onClick={() => setFilter("active")}
            className={
              filter === "active"
                ? "filter-button active"
                : "filter-button"
            }
          >
            Active
          </button>

          <button
            type="button"
            onClick={() =>
              setFilter("completed")
            }
            className={
              filter === "completed"
                ? "filter-button active"
                : "filter-button"
            }
          >
            Completed
          </button>

          <button
            type="button"
            onClick={() => setFilter("overdue")}
            className={
              filter === "overdue"
                ? "filter-button active"
                : "filter-button"
            }
          >
            Overdue
          </button>
        </Box>
      </Paper>

      {/* Task List */}

      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 2 }}
        >
          My Tasks
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          Showing {filteredTasks.length} of{" "}
          {tasks.length} task(s)
        </Typography>

        <TaskList
          tasks={filteredTasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={editTask}
        />
      </Paper>

      {/* Chatbot */}

      <Chatbot />
    </Container>
  );
}

export default App;