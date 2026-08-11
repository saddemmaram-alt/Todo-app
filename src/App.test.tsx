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
      json: async () => [
        {
          id: 1,
          text: "Learn React",
          completed: false,
        },
      ],
    });

    render(<App />);

    expect(screen.getByText("Todo List")).toBeInTheDocument();

    await screen.findByText("Learn React");

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/tasks"
    );
  });

  test("handles error when loading tasks", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (globalThis.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("GET error")
    );

    render(<App />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  test("adds a new task", async () => {
    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: async () => [],
      })
      .mockResolvedValueOnce({
        json: async () => ({
          id: 1,
          text: "Learn React",
          completed: false,
        }),
      });

    render(<App />);

    await screen.findByText("No tasks yet");

    const input = screen.getByPlaceholderText("Write a task");

    const button = screen.getByRole("button", {
      name: "Add",
    });

    fireEvent.change(input, {
      target: {
        value: "Learn React",
      },
    });

    fireEvent.click(button);

    await screen.findByText("Learn React");

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/tasks",
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
        json: async () => [],
      })
      .mockRejectedValueOnce(
        new Error("POST error")
      );

    render(<App />);

    await screen.findByText("No tasks yet");

    const input = screen.getByPlaceholderText("Write a task");

    const button = screen.getByRole("button", {
      name: "Add",
    });

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
        json: async () => [
          {
            id: 1,
            text: "Learn React",
            completed: false,
          },
        ],
      })
      .mockResolvedValueOnce({
        json: async () => ({
          id: 1,
          text: "Learn React",
          completed: true,
        }),
      });

    render(<App />);

    await screen.findByText("Learn React");

    const checkbox = screen.getByRole("checkbox");

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "http://localhost:3000/tasks/1",
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

    await screen.findByText("Learn React");

    const checkbox = screen.getByRole("checkbox");

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  test("deletes a task", async () => {
    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: async () => [
          {
            id: 1,
            text: "Task to delete",
            completed: false,
          },
        ],
      })
      .mockResolvedValueOnce({});

    render(<App />);

    await screen.findByText("Task to delete");

    const deleteButton = screen.getByRole("button", {
      name: /delete/i,
    });

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(
        screen.queryByText("Task to delete")
      ).not.toBeInTheDocument();
    });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/tasks/1",
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

    await screen.findByText("Task to delete");

    const deleteButton = screen.getByRole("button", {
      name: /delete/i,
    });

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  test("keeps other tasks unchanged when toggling one task", async () => {
    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({
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
        json: async () => ({
          id: 1,
          text: "Learn React",
          completed: true,
        }),
      });

    render(<App />);

    await screen.findByText("Learn React");
    await screen.findByText("Learn TypeScript");

    const checkboxes = screen.getAllByRole("checkbox");

    fireEvent.click(checkboxes[0]);

    await waitFor(() => {
      expect(checkboxes[0]).toBeChecked();
    });

    expect(checkboxes[1]).not.toBeChecked();
  });
});