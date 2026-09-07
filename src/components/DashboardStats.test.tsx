import {
  render,
  screen,
} from "@testing-library/react";

import DashboardStats from "./DashboardStats";

describe("DashboardStats", () => {
  const tasks = [
    {
      id: 1,
      text: "Learn React",
      completed: false,
      dueDate: null,
      priority: "high" as const,
      category: "University" as const,
    },
    {
      id: 2,
      text: "Prepare report",
      completed: true,
      dueDate: null,
      priority: "medium" as const,
      category: "Work" as const,
    },
    {
      id: 3,
      text: "Buy groceries",
      completed: false,
      dueDate: null,
      priority: "low" as const,
      category: "Shopping" as const,
    },
  ];

  test("displays main statistics", () => {
    render(
      <DashboardStats
        totalTasks={3}
        activeTasks={2}
        completedTasks={1}
        overdueTasks={0}
        tasks={tasks}
      />
    );

    expect(
      screen.getByText("Total")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Active")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Completed")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Overdue")
    ).toBeInTheDocument();
  });

  test("displays completion rate", () => {
    render(
      <DashboardStats
        totalTasks={3}
        activeTasks={2}
        completedTasks={1}
        overdueTasks={0}
        tasks={tasks}
      />
    );

    expect(
      screen.getByText("Completion Rate")
    ).toBeInTheDocument();

    expect(
      screen.getByText("33%")
    ).toBeInTheDocument();
  });

  test("displays priority statistics", () => {
    render(
      <DashboardStats
        totalTasks={3}
        activeTasks={2}
        completedTasks={1}
        overdueTasks={0}
        tasks={tasks}
      />
    );

    expect(
      screen.getByText(/🔴 High: 1/)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/🟠 Medium: 1/)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/🟢 Low: 1/)
    ).toBeInTheDocument();
  });

  test("displays category statistics", () => {
    render(
      <DashboardStats
        totalTasks={3}
        activeTasks={2}
        completedTasks={1}
        overdueTasks={0}
        tasks={tasks}
      />
    );

    expect(
      screen.getAllByText("Tasks by Category")
    ).toHaveLength(2);

    expect(
      screen.getByText("🎓 University")
    ).toBeInTheDocument();

    expect(
      screen.getByText("💼 Work")
    ).toBeInTheDocument();

    expect(
      screen.getByText("🛒 Shopping")
    ).toBeInTheDocument();
  });

  test("handles empty task list", () => {
    render(
      <DashboardStats
        totalTasks={0}
        activeTasks={0}
        completedTasks={0}
        overdueTasks={0}
        tasks={[]}
      />
    );

    expect(
      screen.getByText("Total")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Completion Rate")
    ).toBeInTheDocument();

    expect(
      screen.getAllByText("Tasks by Category")
    ).toHaveLength(2);
  });
});