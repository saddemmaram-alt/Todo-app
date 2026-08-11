import { render, screen, fireEvent } from "@testing-library/react";
import TaskItem from "./TaskItem";

describe("TaskItem", () => {
  const task = {
    id: 1,
    text: "Learn React",
    completed: false,
  };

  test("displays the task text", () => {
    render(
      <TaskItem
        task={task}
        onToggle={() => {}}
        onDelete={() => {}}
      />
    );

    expect(screen.getByText("Learn React")).toBeInTheDocument();
  });

  test("calls onToggle when checkbox is clicked", () => {
    const onToggle = jest.fn();

    render(
      <TaskItem
        task={task}
        onToggle={onToggle}
        onDelete={() => {}}
      />
    );

    fireEvent.click(screen.getByRole("checkbox"));

    expect(onToggle).toHaveBeenCalledWith(1);
  });

  test("calls onDelete when Delete is clicked", () => {
    const onDelete = jest.fn();

    render(
      <TaskItem
        task={task}
        onToggle={() => {}}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(onDelete).toHaveBeenCalledWith(1);
  });
});