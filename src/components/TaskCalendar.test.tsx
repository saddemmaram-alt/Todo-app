import {
    fireEvent,
    render,
    screen,
  } from "@testing-library/react";
  
  import TaskCalendar from "./TaskCalendar";
  
  describe("TaskCalendar", () => {
    const tasks = [
      {
        id: 1,
        text: "Submit internship report",
        completed: false,
        dueDate: "2026-09-12",
        priority: "high" as const,
        category: "Work" as const,
      },
      {
        id: 2,
        text: "Study React",
        completed: true,
        dueDate: "2026-09-12",
        priority: "medium" as const,
        category: "University" as const,
      },
      {
        id: 3,
        text: "Buy groceries",
        completed: false,
        dueDate: "2026-09-18",
        priority: "low" as const,
        category: "Shopping" as const,
      },
    ];
  
    test("renders the calendar", () => {
      render(
        <TaskCalendar
          tasks={tasks}
          initialDate="2026-09-01"
        />
      );
  
      expect(
        screen.getByText("Calendar")
      ).toBeInTheDocument();
  
      expect(
        screen.getByText(
          "September 2026"
        )
      ).toBeInTheDocument();
  
      expect(
        screen.getByText("Mon")
      ).toBeInTheDocument();
  
      expect(
        screen.getByText("Sun")
      ).toBeInTheDocument();
    });
  
    test("displays the number of tasks on a due date", () => {
      render(
        <TaskCalendar
          tasks={tasks}
          initialDate="2026-09-01"
        />
      );
  
      expect(
        screen.getByText("2 tasks")
      ).toBeInTheDocument();
  
      expect(
        screen.getByText("1 task")
      ).toBeInTheDocument();
    });
  
    test("shows tasks for the selected date", () => {
      render(
        <TaskCalendar
          tasks={tasks}
          initialDate="2026-09-01"
        />
      );
  
      const dayButtons =
        screen.getAllByRole("button");
  
      const september12Button =
        dayButtons.find(
          (button) =>
            button.textContent?.includes(
              "12"
            )
        );
  
      expect(
        september12Button
      ).toBeDefined();
  
      fireEvent.click(
        september12Button!
      );
  
      expect(
        screen.getByText(
          "Submit internship report"
        )
      ).toBeInTheDocument();
  
      expect(
        screen.getByText(
          "Study React"
        )
      ).toBeInTheDocument();
    });
  
    test("navigates to the next month", () => {
      render(
        <TaskCalendar
          tasks={tasks}
          initialDate="2026-09-01"
        />
      );
  
      fireEvent.click(
        screen.getByRole("button", {
          name: "Next month",
        })
      );
  
      expect(
        screen.getByText(
          "October 2026"
        )
      ).toBeInTheDocument();
    });
  
    test("navigates to the previous month", () => {
      render(
        <TaskCalendar
          tasks={tasks}
          initialDate="2026-09-01"
        />
      );
  
      fireEvent.click(
        screen.getByRole("button", {
          name: "Previous month",
        })
      );
  
      expect(
        screen.getByText(
          "August 2026"
        )
      ).toBeInTheDocument();
    });
  
    test("shows empty state for a day without tasks", () => {
      render(
        <TaskCalendar
          tasks={tasks}
          initialDate="2026-09-01"
        />
      );
  
      const dayButtons =
        screen.getAllByRole("button");
  
      const september5Button =
        dayButtons.find(
          (button) =>
            button.textContent?.includes(
              "5"
            )
        );
  
      expect(
        september5Button
      ).toBeDefined();
  
      fireEvent.click(
        september5Button!
      );
  
      expect(
        screen.getByText(
          "No tasks scheduled for this day."
        )
      ).toBeInTheDocument();
    });
  
    test("renders correctly with no tasks", () => {
      render(
        <TaskCalendar
          tasks={[]}
          initialDate="2026-09-01"
        />
      );
  
      expect(
        screen.getByText(
          "September 2026"
        )
      ).toBeInTheDocument();
  
      expect(
        screen.getByText(
          "No tasks scheduled for this day."
        )
      ).toBeInTheDocument();
    });
  });