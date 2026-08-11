import { render, screen, fireEvent } from "@testing-library/react";
import TaskForm from "./TaskForm";

describe("TaskForm", () => {
  test("allows the user to type a task", () => {
    render(<TaskForm onAdd={() => {}} />);

    const input = screen.getByPlaceholderText("Write a task");

    fireEvent.change(input, {
      target: { value: "Learn React" },
    });

    expect(input).toHaveValue("Learn React");
  });

  test("calls onAdd with the task text", () => {
    const onAdd = jest.fn();

    render(<TaskForm onAdd={onAdd} />);

    const input = screen.getByPlaceholderText("Write a task");
    const button = screen.getByRole("button", { name: "Add" });

    fireEvent.change(input, {
      target: { value: "Learn React" },
    });

    fireEvent.click(button);

    expect(onAdd).toHaveBeenCalledWith("Learn React");
  });

  test("does not add an empty task", () => {
    const onAdd = jest.fn();

    render(<TaskForm onAdd={onAdd} />);

    const button = screen.getByRole("button", { name: "Add" });

    fireEvent.click(button);

    expect(onAdd).not.toHaveBeenCalled();
  });

  test("does not add a task shorter than 3 characters", () => {
    const onAdd = jest.fn();

    render(<TaskForm onAdd={onAdd} />);

    const input = screen.getByPlaceholderText("Write a task");
    const button = screen.getByRole("button", { name: "Add" });

    fireEvent.change(input, {
      target: { value: "Hi" },
    });

    fireEvent.click(button);

    expect(onAdd).not.toHaveBeenCalled();
  });

  test("displays an error when the task is empty", () => {
    const onAdd = jest.fn();

    render(<TaskForm onAdd={onAdd} />);

    const button = screen.getByRole("button", { name: "Add" });

    fireEvent.click(button);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Task must contain at least 3 characters"
    );

    expect(onAdd).not.toHaveBeenCalled();
  });
});