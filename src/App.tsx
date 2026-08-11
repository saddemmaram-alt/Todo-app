import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Get tasks from backend
  useEffect(() => {
    fetch("http://localhost:3000/tasks")
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => {
        console.error("Error loading tasks:", error);
      });
  }, []);

  // Add task
  const addTask = async (text: string) => {
    try {
      const response = await fetch(
        "http://localhost:3000/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        }
      );

      const newTask = await response.json();

      setTasks((currentTasks) => [
        ...currentTasks,
        newTask,
      ]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Toggle task
  const toggleTask = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/tasks/${id}`,
        {
          method: "PATCH",
        }
      );

      const updatedTask = await response.json();

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === id ? updatedTask : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete task
  const deleteTask = async (id: number) => {
    try {
      await fetch(
        `http://localhost:3000/tasks/${id}`,
        {
          method: "DELETE",
        }
      );

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task.id !== id
        )
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div>
      <h1>Todo List</h1>

      <p>
        Number of tasks: {tasks.length}
      </p>

      <TaskForm onAdd={addTask} />

      <TaskList
        tasks={tasks}
        onToggle={toggleTask}
        onDelete={deleteTask}
      />
    </div>
  );
}

export default App;