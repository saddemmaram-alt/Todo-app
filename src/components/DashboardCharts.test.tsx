import {
    render,
    screen,
  } from "@testing-library/react";
  
  import DashboardCharts from "./DashboardCharts";
  
  describe("DashboardCharts", () => {
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
  
    test("renders analytics sections", () => {
      render(
        <DashboardCharts
          tasks={tasks}
        />
      );
  
      expect(
        screen.getByText("Analytics")
      ).toBeInTheDocument();
  
      expect(
        screen.getByText(
          "Tasks by Priority"
        )
      ).toBeInTheDocument();
  
      expect(
        screen.getByText(
          "Tasks by Category"
        )
      ).toBeInTheDocument();
  
      expect(
        screen.getByText(
          "Completion Status"
        )
      ).toBeInTheDocument();
  
      expect(
        screen.getByText(
          "Priority Distribution"
        )
      ).toBeInTheDocument();
    });
  
    test("renders analytics with empty tasks", () => {
      render(
        <DashboardCharts tasks={[]} />
      );
  
      expect(
        screen.getByText("Analytics")
      ).toBeInTheDocument();
  
      expect(
        screen.getByText(
          "Tasks by Priority"
        )
      ).toBeInTheDocument();
  
      expect(
        screen.getByText(
          "Tasks by Category"
        )
      ).toBeInTheDocument();
  
      expect(
        screen.getByText(
          "Completion Status"
        )
      ).toBeInTheDocument();
    });
  });