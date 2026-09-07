import {
    render,
    screen,
    within,
  } from "@testing-library/react";
  
  import DashboardStats from "./DashboardStats";
  
  describe("DashboardStats", () => {
    const tasks = [
      {
        id: 1,
        text: "Learn React",
        completed: true,
        dueDate: null,
        priority: "high" as const,
        category: "University" as const,
      },
      {
        id: 2,
        text: "Prepare report",
        completed: false,
        dueDate: "2026-09-15",
        priority: "medium" as const,
        category: "Work" as const,
      },
      {
        id: 3,
        text: "Buy groceries",
        completed: false,
        dueDate: null,
        priority: "low" as const,
        category: "Personal" as const,
      },
    ];
  
    test("displays main task statistics", () => {
      render(
        <DashboardStats
          totalTasks={3}
          activeTasks={2}
          completedTasks={1}
          overdueTasks={0}
          tasks={tasks}
        />
      );
  
      const totalCard =
        screen.getByText("Total").parentElement;
  
      const activeCard =
        screen.getByText("Active").parentElement;
  
      const completedCard =
        screen.getByText("Completed").parentElement;
  
      const overdueCard =
        screen.getByText("Overdue").parentElement;
  
      expect(
        within(totalCard!).getByText("3")
      ).toBeInTheDocument();
  
      expect(
        within(activeCard!).getByText("2")
      ).toBeInTheDocument();
  
      expect(
        within(completedCard!).getByText("1")
      ).toBeInTheDocument();
  
      expect(
        within(overdueCard!).getByText("0")
      ).toBeInTheDocument();
    });
  
    test("calculates completion rate", () => {
      render(
        <DashboardStats
          totalTasks={4}
          activeTasks={1}
          completedTasks={3}
          overdueTasks={0}
          tasks={tasks}
        />
      );
  
      expect(
        screen.getByText("75%")
      ).toBeInTheDocument();
  
      expect(
        screen.getByText("Completion Rate")
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
        screen.getByText("🔴 High: 1")
      ).toBeInTheDocument();
  
      expect(
        screen.getByText("🟠 Medium: 1")
      ).toBeInTheDocument();
  
      expect(
        screen.getByText("🟢 Low: 1")
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
        screen.getByText("Tasks by Category")
      ).toBeInTheDocument();
  
      expect(
        screen.getByText("🎓 University")
      ).toBeInTheDocument();
  
      expect(
        screen.getByText("💼 Work")
      ).toBeInTheDocument();
  
      expect(
        screen.getByText("👤 Personal")
      ).toBeInTheDocument();
    });
  
    test("returns 0% completion rate when there are no tasks", () => {
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
        screen.getByText("0%")
      ).toBeInTheDocument();
    });
  });