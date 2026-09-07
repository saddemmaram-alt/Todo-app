import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import App from "./App";

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.fetch = jest.fn();
  });

  test("displays Todo List title and loads tasks", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 1,
          text: "Learn React",
          completed: false,
        },
      ],
    });

    render(<App />);

    expect(
      screen.getByText("TaskFlow")
    ).toBeInTheDocument();

    await screen.findByText("Learn React");

    expect(
      globalThis.fetch
    ).toHaveBeenCalledWith("/tasks");
  });

  test("displays error state when loading tasks fails", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (
      globalThis.fetch as jest.Mock
    ).mockRejectedValueOnce(
      new Error("GET error")
    );

    render(<App />);

    expect(
      await screen.findByText(
        "Unable to load tasks. Please try again."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Try Again",
      })
    ).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  test("reloads tasks when Try Again is clicked", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (
      globalThis.fetch as jest.Mock
    )
      .mockRejectedValueOnce(
        new Error("GET error")
      )
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: 1,
            text: "Task after retry",
            completed: false,
          },
        ],
      });

    render(<App />);

    const retryButton =
      await screen.findByRole("button", {
        name: "Try Again",
      });

    fireEvent.click(retryButton);

    expect(
      await screen.findByText(
        "Task after retry"
      )
    ).toBeInTheDocument();

    expect(
      globalThis.fetch
    ).toHaveBeenCalledTimes(2);

    consoleSpy.mockRestore();
  });

  test("shows empty state when there are no tasks", async () => {
    (
      globalThis.fetch as jest.Mock
    ).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<App />);

    expect(
      await screen.findByText(
        "📝 No tasks yet. Create your first task!"
      )
    ).toBeInTheDocument();
  });

  test("adds a new task", async () => {
    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 1,
          text: "Learn React",
          completed: false,
        }),
      });

    render(<App />);

    await screen.findByText(
      "📝 No tasks yet. Create your first task!"
    );

    const input = screen.getByRole(
      "textbox",
      {
        name: "Write a task",
      }
    );

    const button = screen.getByRole(
      "button",
      {
        name: "Add",
      }
    );

    fireEvent.change(input, {
      target: {
        value: "Learn React",
      },
    });

    fireEvent.click(button);

    await screen.findByText(
      "Learn React"
    );

    expect(
      globalThis.fetch
    ).toHaveBeenCalledWith(
      "/tasks",
      expect.objectContaining({
        method: "POST",
      })
    );
  });

  test("handles error when adding a task", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockRejectedValueOnce(
        new Error("POST error")
      );

    render(<App />);

    await screen.findByText(
      "📝 No tasks yet. Create your first task!"
    );

    const input = screen.getByRole(
      "textbox",
      {
        name: "Write a task",
      }
    );

    const button = screen.getByRole(
      "button",
      {
        name: "Add",
      }
    );

    fireEvent.change(input, {
      target: {
        value: "Learn React",
      },
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  test("toggles a task", async () => {
    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: 1,
            text: "Learn React",
            completed: false,
          },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 1,
          text: "Learn React",
          completed: true,
        }),
      });

    render(<App />);

    await screen.findByText(
      "Learn React"
    );

    const checkbox =
      screen.getByRole("checkbox");

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(
        globalThis.fetch
      ).toHaveBeenCalledWith(
        "/tasks/1",
        {
          method: "PATCH",
        }
      );
    });
  });

  test("handles error when toggling a task", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: 1,
            text: "Learn React",
            completed: false,
          },
        ],
      })
      .mockRejectedValueOnce(
        new Error("PATCH error")
      );

    render(<App />);

    await screen.findByText(
      "Learn React"
    );

    const checkbox =
      screen.getByRole("checkbox");

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  test("deletes a task after confirmation", async () => {
    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: 1,
            text: "Task to delete",
            completed: false,
          },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
      });

    render(<App />);

    await screen.findByText(
      "Task to delete"
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete",
      })
    );

    expect(
      screen.getByText("Delete task?")
    ).toBeInTheDocument();

    const deleteButtons =
      screen.getAllByRole("button", {
        name: "Delete",
      });

    fireEvent.click(
      deleteButtons[deleteButtons.length - 1]
    );

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Task to delete"
        )
      ).not.toBeInTheDocument();
    });

    expect(
      globalThis.fetch
    ).toHaveBeenCalledWith(
      "/tasks/1",
      {
        method: "DELETE",
      }
    );
  });

  test("handles error when deleting a task", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: 1,
            text: "Task to delete",
            completed: false,
          },
        ],
      })
      .mockRejectedValueOnce(
        new Error("DELETE error")
      );

    render(<App />);

    await screen.findByText(
      "Task to delete"
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete",
      })
    );

    expect(
      screen.getByText("Delete task?")
    ).toBeInTheDocument();

    const deleteButtons =
      screen.getAllByRole("button", {
        name: "Delete",
      });

    fireEvent.click(
      deleteButtons[deleteButtons.length - 1]
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    expect(
      screen.getByText(
        "Task to delete"
      )
    ).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  test("keeps other tasks unchanged when toggling one task", async () => {
    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: 1,
            text: "Learn React",
            completed: false,
          },
          {
            id: 2,
            text: "Learn TypeScript",
            completed: false,
          },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 1,
          text: "Learn React",
          completed: true,
        }),
      });

    render(<App />);

    await screen.findByText(
      "Learn React"
    );

    await screen.findByText(
      "Learn TypeScript"
    );

    const checkboxes =
      screen.getAllByRole("checkbox");

    fireEvent.click(checkboxes[0]);

    await waitFor(() => {
      expect(
        checkboxes[0]
      ).toBeChecked();
    });

    expect(
      checkboxes[1]
    ).not.toBeChecked();
  });

  test("shows success toast after adding a task", async () => {
    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 1,
          text: "New Task",
          completed: false,
          dueDate: null,
          priority: "medium",
          category: "Other",
        }),
      });

    render(<App />);

    await screen.findByText(
      "📝 No tasks yet. Create your first task!"
    );

    const input = screen.getByRole(
      "textbox",
      {
        name: "Write a task",
      }
    );

    fireEvent.change(input, {
      target: {
        value: "New Task",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add",
      })
    );

    expect(
      await screen.findByText(
        "Task added successfully"
      )
    ).toBeInTheDocument();
  });

  test("shows success toast after completing a task", async () => {
    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: 1,
            text: "Learn React",
            completed: false,
            dueDate: null,
            priority: "medium",
            category: "University",
          },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 1,
          text: "Learn React",
          completed: true,
          dueDate: null,
          priority: "medium",
          category: "University",
        }),
      });

    render(<App />);

    await screen.findByText(
      "Learn React"
    );

    fireEvent.click(
      screen.getByRole("checkbox")
    );

    expect(
      await screen.findByText(
        "Task completed"
      )
    ).toBeInTheDocument();
  });

  test("shows success toast after deleting a task", async () => {
    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: 1,
            text: "Task to delete",
            completed: false,
            dueDate: null,
            priority: "medium",
            category: "Other",
          },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
      });

    render(<App />);

    await screen.findByText(
      "Task to delete"
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete",
      })
    );

    expect(
      screen.getByText("Delete task?")
    ).toBeInTheDocument();

    const deleteButtons =
      screen.getAllByRole("button", {
        name: "Delete",
      });

    fireEvent.click(
      deleteButtons[deleteButtons.length - 1]
    );

    expect(
      await screen.findByText(
        "Task deleted successfully"
      )
    ).toBeInTheDocument();
  });
});