import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";

import TaskForm from "./TaskForm";

describe("TaskForm", () => {
  test("calls onAdd with the task text", () => {
    const onAdd = jest.fn();

    render(<TaskForm onAdd={onAdd} />);

    const input = screen.getByLabelText(
      "Write a task"
    );

    fireEvent.change(input, {
      target: {
        value: "Learn React",
      },
    });

    const button = screen.getByRole(
      "button",
      {
        name: "Add",
      }
    );

    fireEvent.click(button);

    expect(onAdd).toHaveBeenCalledWith(
      "Learn React",
      "",
      "medium",
      "Other"
    );
  });

  test("does not add a task shorter than 3 characters", () => {
    const onAdd = jest.fn();

    render(<TaskForm onAdd={onAdd} />);

    const input = screen.getByLabelText(
      "Write a task"
    );

    fireEvent.change(input, {
      target: {
        value: "Hi",
      },
    });

    const button = screen.getByRole(
      "button",
      {
        name: "Add",
      }
    );

    fireEvent.click(button);

    expect(onAdd).not.toHaveBeenCalled();

    expect(
      screen.getByText(
        "Task must contain at least 3 characters"
      )
    ).toBeInTheDocument();
  });

  test("adds a valid task with selected priority", () => {
    const onAdd = jest.fn();

    render(<TaskForm onAdd={onAdd} />);

    const input = screen.getByLabelText(
      "Write a task"
    );

    fireEvent.change(input, {
      target: {
        value: "Learn Jest",
      },
    });

    const selects =
      screen.getAllByRole("combobox");

    const prioritySelect = selects[0];

    fireEvent.mouseDown(prioritySelect);

    fireEvent.click(
      screen.getByText("🔴 High")
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add",
      })
    );

    expect(onAdd).toHaveBeenCalledWith(
      "Learn Jest",
      "",
      "high",
      "Other"
    );
  });

  test("adds a valid task with selected category", () => {
    const onAdd = jest.fn();

    render(<TaskForm onAdd={onAdd} />);

    const input = screen.getByLabelText(
      "Write a task"
    );

    fireEvent.change(input, {
      target: {
        value: "Study React",
      },
    });

    const selects =
      screen.getAllByRole("combobox");

    const categorySelect = selects[1];

    fireEvent.mouseDown(categorySelect);

    fireEvent.click(
      screen.getByText("🎓 University")
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add",
      })
    );

    expect(onAdd).toHaveBeenCalledWith(
      "Study React",
      "",
      "medium",
      "University"
    );
  });
});