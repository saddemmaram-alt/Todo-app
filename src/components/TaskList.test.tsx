import { render, screen } from "@testing-library/react";
import TaskList from "./TaskList";

describe("TaskList", () => {
  const tasks = [
    {
      id: 1,
      text: "Learn React",
      completed: false,
    },
    {
      id: 2,
      text: "Write tests",
      completed: true,
    },
  ];

  test("displays all tasks", () => {
    render(
      <TaskList
        tasks={tasks}
        onToggle={() => {}}
        onDelete={() => {}}
      />
    );

    expect(screen.getByText("Learn React")).toBeInTheDocument();
    expect(screen.getByText("Write tests")).toBeInTheDocument();
  });

  test("renders an empty list when there are no tasks", () => {
    render(
      <TaskList
        tasks={[]}
        onToggle={() => {}}
        onDelete={() => {}}
      />
    );

    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });
});