import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";

import TaskList from "./TaskList";

describe("TaskList", () => {
  const tasks = [
    {
      id: 1,
      text: "Learn React",
      completed: false,
      priority: "medium" as const,
      dueDate: null,
      category: "University" as const,
    },
    {
      id: 2,
      text: "Prepare report",
      completed: true,
      priority: "high" as const,
      dueDate: null,
      category: "Work" as const,
    },
  ];

  test("displays tasks", () => {
    render(
      <TaskList
        tasks={tasks}
        onToggle={() => {}}
        onDelete={() => {}}
        onEdit={async () => {}}
      />
    );

    expect(
      screen.getByText("Learn React")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Prepare report")
    ).toBeInTheDocument();
  });

  test("displays default empty state", () => {
    render(
      <TaskList
        tasks={[]}
        onToggle={() => {}}
        onDelete={() => {}}
      />
    );

    expect(
      screen.getByText("No tasks yet")
    ).toBeInTheDocument();
  });

  test("displays custom empty state", () => {
    render(
      <TaskList
        tasks={[]}
        onToggle={() => {}}
        onDelete={() => {}}
        emptyMessage="No matching tasks"
      />
    );

    expect(
      screen.getByText("No matching tasks")
    ).toBeInTheDocument();
  });

  test("calls onToggle", () => {
    const onToggle = jest.fn();

    render(
      <TaskList
        tasks={tasks}
        onToggle={onToggle}
        onDelete={() => {}}
        onEdit={async () => {}}
      />
    );

    fireEvent.click(
      screen.getAllByRole("checkbox")[0]
    );

    expect(onToggle).toHaveBeenCalledWith(1);
  });

  test("opens delete confirmation", () => {
    const onDelete = jest.fn();

    render(
      <TaskList
        tasks={tasks}
        onToggle={() => {}}
        onDelete={onDelete}
        onEdit={async () => {}}
      />
    );

    fireEvent.click(
      screen.getAllByRole("button", {
        name: "Delete",
      })[0]
    );

    expect(
      screen.getByText("Delete task?")
    ).toBeInTheDocument();

    expect(onDelete).not.toHaveBeenCalled();
  });

  test("calls onDelete after confirmation", () => {
    const onDelete = jest.fn();

    render(
      <TaskList
        tasks={tasks}
        onToggle={() => {}}
        onDelete={onDelete}
        onEdit={async () => {}}
      />
    );

    fireEvent.click(
      screen.getAllByRole("button", {
        name: "Delete",
      })[0]
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete",
      })
    );

    expect(onDelete).toHaveBeenCalledWith(1);
  });
});