import { useEffect, useState } from "react";

type Priority = "high" | "medium" | "low";

export type Category =
  | "University"
  | "Work"
  | "Personal"
  | "Shopping"
  | "Other";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  dueDate: string | null;
  priority: Priority;
  category?: Category;
}

type TaskFilter =
  | "all"
  | "active"
  | "completed"
  | "overdue";

type CategoryFilter = "all" | Category;

type SortOption =
  | "default"
  | "priority-high"
  | "priority-low"
  | "due-date"
  | "alphabetical";

type SuccessNotification = {
  id: number;
  message: string;
};

const API_URL = "/tasks";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [filter, setFilter] =
    useState<TaskFilter>("all");

  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilter>("all");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [sortBy, setSortBy] =
    useState<SortOption>("default");

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    successNotification,
    setSuccessNotification,
  ] =
    useState<SuccessNotification | null>(
      null
    );

  const showSuccess = (message: string) => {
    setSuccessNotification((current) => ({
      id: (current?.id ?? 0) + 1,
      message,
    }));
  };

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (response.ok === false) {
        throw new Error(
          "Failed to load tasks"
        );
      }

      const data = await response.json();

      setTasks(data);
    } catch (error) {
      console.error(
        "Error loading tasks:",
        error
      );

      setError(
        "Unable to load tasks. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async (
    text: string,
    dueDate: string = "",
    priority: Priority = "medium",
    category: Category = "Other"
  ) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          dueDate,
          priority,
          category,
        }),
      });

      const newTask = await response.json();

      if (response.ok === false) {
        throw new Error(
          newTask.error ||
            "Failed to add task"
        );
      }

      setTasks((currentTasks) => [
        ...currentTasks,
        newTask,
      ]);

      showSuccess(
        "Task added successfully"
      );
    } catch (error) {
      console.error(
        "Error adding task:",
        error
      );
    }
  };

  const editTask = async (
    id: number,
    text: string,
    dueDate: string = "",
    priority: Priority = "medium",
    category: Category = "Other"
  ): Promise<void> => {
    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            dueDate,
            priority,
            category,
          }),
        }
      );

      const updatedTask =
        await response.json();

      if (response.ok === false) {
        throw new Error(
          updatedTask.error ||
            "Failed to edit task"
        );
      }

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === id
            ? updatedTask
            : task
        )
      );

      showSuccess(
        "Task updated successfully"
      );
    } catch (error) {
      console.error(
        "Error editing task:",
        error
      );

      throw error;
    }
  };

  const toggleTask = async (id: number) => {
    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "PATCH",
        }
      );

      const updatedTask =
        await response.json();

      if (response.ok === false) {
        throw new Error(
          updatedTask.error ||
            "Failed to update task"
        );
      }

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === id
            ? updatedTask
            : task
        )
      );

      showSuccess(
        updatedTask.completed
          ? "Task completed"
          : "Task marked as active"
      );
    } catch (error) {
      console.error(
        "Error updating task:",
        error
      );
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok === false) {
        throw new Error(
          "Failed to delete task"
        );
      }

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task.id !== id
        )
      );

      showSuccess(
        "Task deleted successfully"
      );
    } catch (error) {
      console.error(
        "Error deleting task:",
        error
      );
    }
  };

  const filteredTasks = tasks.filter(
    (task) => {
      let matchesStatus = true;
      let matchesCategory = true;
      let matchesSearch = true;

      if (filter === "active") {
        matchesStatus = !task.completed;
      }

      if (filter === "completed") {
        matchesStatus = task.completed;
      }

      if (filter === "overdue") {
        matchesStatus =
          !task.completed &&
          task.dueDate !== null &&
          new Date(task.dueDate) <
            new Date();
      }

      if (categoryFilter !== "all") {
        matchesCategory =
          (task.category ?? "Other") ===
          categoryFilter;
      }

      if (searchTerm.trim() !== "") {
        matchesSearch = task.text
          .toLowerCase()
          .includes(
            searchTerm
              .trim()
              .toLowerCase()
          );
      }

      return (
        matchesStatus &&
        matchesCategory &&
        matchesSearch
      );
    }
  );

  const sortedTasks = [...filteredTasks];

  const priorityOrder: Record<
    Priority,
    number
  > = {
    high: 1,
    medium: 2,
    low: 3,
  };

  if (sortBy === "priority-high") {
    sortedTasks.sort(
      (a, b) =>
        priorityOrder[a.priority] -
        priorityOrder[b.priority]
    );
  }

  if (sortBy === "priority-low") {
    sortedTasks.sort(
      (a, b) =>
        priorityOrder[b.priority] -
        priorityOrder[a.priority]
    );
  }

  if (sortBy === "due-date") {
    sortedTasks.sort((a, b) => {
      if (!a.dueDate && !b.dueDate) {
        return 0;
      }

      if (!a.dueDate) {
        return 1;
      }

      if (!b.dueDate) {
        return -1;
      }

      return (
        new Date(a.dueDate).getTime() -
        new Date(b.dueDate).getTime()
      );
    });
  }

  if (sortBy === "alphabetical") {
    sortedTasks.sort((a, b) =>
      a.text.localeCompare(b.text)
    );
  }

  return {
    tasks,
    filteredTasks: sortedTasks,

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
    retryLoadTasks: loadTasks,

    successNotification,

    addTask,
    editTask,
    toggleTask,
    deleteTask,
  };
}