import { render, screen } from "@testing-library/react";

import TaskReminders from "./TaskReminders";

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

describe("TaskReminders", () => {
  test("displays overdue tasks", () => {
    const today = new Date();

    today.setDate(
      today.getDate() - 2
    );

    const overdueDate =
      formatLocalDate(today);

    render(
      <TaskReminders
        tasks={[
          {
            id: 1,
            text: "Overdue task",
            completed: false,
            dueDate: overdueDate,
            priority: "high",
            category: "Work",
          },
        ]}
      />
    );

    expect(
      screen.getByText("🔔 Task Reminders")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Overdue task")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Overdue")
    ).toBeInTheDocument();
  });

  test("does not display completed tasks", () => {
    const today = new Date();

    const dueDate =
      formatLocalDate(today);

    render(
      <TaskReminders
        tasks={[
          {
            id: 1,
            text: "Completed task",
            completed: true,
            dueDate,
            priority: "high",
            category: "Work",
          },
        ]}
      />
    );

    expect(
      screen.queryByText("🔔 Task Reminders")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("Completed task")
    ).not.toBeInTheDocument();
  });

  test("displays tomorrow tasks", () => {
    const tomorrow = new Date();

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    const dueDate =
      formatLocalDate(tomorrow);

    render(
      <TaskReminders
        tasks={[
          {
            id: 1,
            text: "Tomorrow task",
            completed: false,
            dueDate,
            priority: "medium",
            category: "University",
          },
        ]}
      />
    );

    expect(
      screen.getByText("Tomorrow task")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Due tomorrow")
    ).toBeInTheDocument();
  });

  test("displays upcoming tasks within seven days", () => {
    const upcoming = new Date();

    upcoming.setDate(
      upcoming.getDate() + 5
    );

    const dueDate =
      formatLocalDate(upcoming);

    render(
      <TaskReminders
        tasks={[
          {
            id: 1,
            text: "Upcoming task",
            completed: false,
            dueDate,
            priority: "low",
            category: "Personal",
          },
        ]}
      />
    );

    expect(
      screen.getByText("Upcoming task")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Upcoming")
    ).toBeInTheDocument();
  });

  test("does not render when there are no reminders", () => {
    render(
      <TaskReminders tasks={[]} />
    );

    expect(
      screen.queryByText("🔔 Task Reminders")
    ).not.toBeInTheDocument();
  });
});