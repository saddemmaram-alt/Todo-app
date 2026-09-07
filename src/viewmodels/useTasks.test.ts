import {
  renderHook,
  waitFor,
  act,
} from "@testing-library/react";

import { useTasks } from "./useTasks";

describe("useTasks", () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn();
  });

  it("loads tasks", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
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
    });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(1);
    });

    expect(result.current.tasks[0].text).toBe(
      "Learn React"
    );
  });

  it("adds a task", async () => {
    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: async () => [],
      })
      .mockResolvedValueOnce({
        json: async () => ({
          id: 2,
          text: "Learn Jest",
          completed: false,
          dueDate: null,
          priority: "medium",
          category: "University",
        }),
      });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.tasks).toEqual([]);
    });

    await act(async () => {
      await result.current.addTask(
        "Learn Jest",
        "",
        "medium",
        "University"
      );
    });

    expect(result.current.tasks).toHaveLength(1);

    expect(result.current.tasks[0].text).toBe(
      "Learn Jest"
    );

    expect(
      result.current.tasks[0].category
    ).toBe("University");
  });

  it("toggles a task", async () => {
    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({
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
        json: async () => ({
          id: 1,
          text: "Learn React",
          completed: true,
          dueDate: null,
          priority: "medium",
          category: "University",
        }),
      });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(1);
    });

    await act(async () => {
      await result.current.toggleTask(1);
    });

    expect(
      result.current.tasks[0].completed
    ).toBe(true);
  });

  it("deletes a task", async () => {
    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({
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
      .mockResolvedValueOnce({});

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(1);
    });

    await act(async () => {
      await result.current.deleteTask(1);
    });

    expect(result.current.tasks).toHaveLength(0);
  });

  it("filters tasks by search term", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [
        {
          id: 1,
          text: "Learn React",
          completed: false,
          dueDate: null,
          priority: "high",
          category: "University",
        },
        {
          id: 2,
          text: "Buy groceries",
          completed: false,
          dueDate: null,
          priority: "low",
          category: "Personal",
        },
        {
          id: 3,
          text: "React testing",
          completed: true,
          dueDate: null,
          priority: "medium",
          category: "University",
        },
      ],
    });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(3);
    });

    act(() => {
      result.current.setSearchTerm("react");
    });

    expect(result.current.filteredTasks).toHaveLength(2);

    expect(
      result.current.filteredTasks.map(
        (task) => task.text
      )
    ).toEqual([
      "Learn React",
      "React testing",
    ]);
  });

  it("filters tasks by category", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [
        {
          id: 1,
          text: "Learn React",
          completed: false,
          dueDate: null,
          priority: "high",
          category: "University",
        },
        {
          id: 2,
          text: "Buy groceries",
          completed: false,
          dueDate: null,
          priority: "low",
          category: "Personal",
        },
        {
          id: 3,
          text: "Prepare report",
          completed: false,
          dueDate: null,
          priority: "medium",
          category: "Work",
        },
      ],
    });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(3);
    });

    act(() => {
      result.current.setCategoryFilter(
        "University"
      );
    });

    expect(result.current.filteredTasks).toHaveLength(1);

    expect(
      result.current.filteredTasks[0].text
    ).toBe("Learn React");
  });

  it("combines search and category filters", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [
        {
          id: 1,
          text: "Learn React",
          completed: false,
          dueDate: null,
          priority: "high",
          category: "University",
        },
        {
          id: 2,
          text: "React testing",
          completed: false,
          dueDate: null,
          priority: "medium",
          category: "Work",
        },
        {
          id: 3,
          text: "Learn Java",
          completed: false,
          dueDate: null,
          priority: "low",
          category: "University",
        },
      ],
    });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(3);
    });

    act(() => {
      result.current.setSearchTerm("learn");
      result.current.setCategoryFilter(
        "University"
      );
    });

    expect(result.current.filteredTasks).toHaveLength(2);

    expect(
      result.current.filteredTasks.map(
        (task) => task.text
      )
    ).toEqual([
      "Learn React",
      "Learn Java",
    ]);
  });

  it("sorts tasks by priority from high to low", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [
        {
          id: 1,
          text: "Low task",
          completed: false,
          dueDate: null,
          priority: "low",
          category: "Other",
        },
        {
          id: 2,
          text: "High task",
          completed: false,
          dueDate: null,
          priority: "high",
          category: "Work",
        },
        {
          id: 3,
          text: "Medium task",
          completed: false,
          dueDate: null,
          priority: "medium",
          category: "University",
        },
      ],
    });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(3);
    });

    act(() => {
      result.current.setSortBy("priority-high");
    });

    expect(
      result.current.filteredTasks.map(
        (task) => task.text
      )
    ).toEqual([
      "High task",
      "Medium task",
      "Low task",
    ]);
  });

  it("sorts tasks by priority from low to high", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [
        {
          id: 1,
          text: "High task",
          completed: false,
          dueDate: null,
          priority: "high",
          category: "Work",
        },
        {
          id: 2,
          text: "Low task",
          completed: false,
          dueDate: null,
          priority: "low",
          category: "Other",
        },
        {
          id: 3,
          text: "Medium task",
          completed: false,
          dueDate: null,
          priority: "medium",
          category: "University",
        },
      ],
    });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(3);
    });

    act(() => {
      result.current.setSortBy("priority-low");
    });

    expect(
      result.current.filteredTasks.map(
        (task) => task.text
      )
    ).toEqual([
      "Low task",
      "Medium task",
      "High task",
    ]);
  });

  it("sorts tasks by due date", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [
        {
          id: 1,
          text: "Task A",
          completed: false,
          dueDate: "2026-09-20",
          priority: "medium",
          category: "Other",
        },
        {
          id: 2,
          text: "Task B",
          completed: false,
          dueDate: "2026-09-10",
          priority: "medium",
          category: "Other",
        },
        {
          id: 3,
          text: "Task C",
          completed: false,
          dueDate: "2026-09-15",
          priority: "medium",
          category: "Other",
        },
      ],
    });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(3);
    });

    act(() => {
      result.current.setSortBy("due-date");
    });

    expect(
      result.current.filteredTasks.map(
        (task) => task.text
      )
    ).toEqual([
      "Task B",
      "Task C",
      "Task A",
    ]);
  });

  it("sorts tasks alphabetically", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [
        {
          id: 1,
          text: "React",
          completed: false,
          dueDate: null,
          priority: "medium",
          category: "Other",
        },
        {
          id: 2,
          text: "Angular",
          completed: false,
          dueDate: null,
          priority: "medium",
          category: "Other",
        },
        {
          id: 3,
          text: "JavaScript",
          completed: false,
          dueDate: null,
          priority: "medium",
          category: "Other",
        },
      ],
    });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(3);
    });

    act(() => {
      result.current.setSortBy("alphabetical");
    });

    expect(
      result.current.filteredTasks.map(
        (task) => task.text
      )
    ).toEqual([
      "Angular",
      "JavaScript",
      "React",
    ]);
  });

  it("filters completed tasks", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [
        {
          id: 1,
          text: "Active task",
          completed: false,
          dueDate: null,
          priority: "medium",
          category: "Other",
        },
        {
          id: 2,
          text: "Completed task",
          completed: true,
          dueDate: null,
          priority: "medium",
          category: "Other",
        },
      ],
    });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(2);
    });

    act(() => {
      result.current.setFilter("completed");
    });

    expect(result.current.filteredTasks).toHaveLength(1);

    expect(
      result.current.filteredTasks[0].text
    ).toBe("Completed task");
  });

  it("shows loading while tasks are being fetched", async () => {
    let resolveFetch!: (value: {
      json: () => Promise<unknown>;
    }) => void;

    (globalThis.fetch as jest.Mock).mockReturnValueOnce(
      new Promise((resolve) => {
        resolveFetch = resolve;
      })
    );

    const { result } = renderHook(() => useTasks());

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolveFetch({
        json: async () => [],
      });
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });
});