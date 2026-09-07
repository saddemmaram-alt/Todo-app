import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import TaskItem from "./TaskItem";

describe("TaskItem", () => {
  const task = {
    id: 1,
    text: "Learn React",
    completed: false,
    dueDate: null,
    priority: "medium" as const,
    category: "University" as const,
  };

  test("displays the task text", () => {
    render(
      <TaskItem
        task={task}
        onToggle={() => {}}
        onDelete={() => {}}
        onEdit={async () => {}}
      />
    );

    expect(
      screen.getByText("Learn React")
    ).toBeInTheDocument();
  });

  test("calls onToggle when checkbox is clicked", () => {
    const onToggle = jest.fn();

    render(
      <TaskItem
        task={task}
        onToggle={onToggle}
        onDelete={() => {}}
        onEdit={async () => {}}
      />
    );

    fireEvent.click(
      screen.getByRole("checkbox")
    );

    expect(onToggle).toHaveBeenCalledWith(1);
  });

  test("opens delete confirmation when Delete is clicked", () => {
    const onDelete = jest.fn();

    render(
      <TaskItem
        task={task}
        onToggle={() => {}}
        onDelete={onDelete}
        onEdit={async () => {}}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete",
      })
    );

    expect(
      screen.getByText("Delete task?")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Learn React")
    ).toBeInTheDocument();

    expect(onDelete).not.toHaveBeenCalled();
  });

  test("calls onDelete when delete is confirmed", () => {
    const onDelete = jest.fn();

    render(
      <TaskItem
        task={task}
        onToggle={() => {}}
        onDelete={onDelete}
        onEdit={async () => {}}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete",
      })
    );

    expect(
      screen.getByText("Delete task?")
    ).toBeInTheDocument();

    const deleteButtons =
      screen.getAllByRole("button", {
        name: "Delete",
      });

    const confirmDeleteButton =
      deleteButtons[deleteButtons.length - 1];

    fireEvent.click(confirmDeleteButton);

    expect(onDelete).toHaveBeenCalledWith(1);
  });

  test("does not delete when Cancel is clicked", async () => {
    const onDelete = jest.fn();

    render(
      <TaskItem
        task={task}
        onToggle={() => {}}
        onDelete={onDelete}
        onEdit={async () => {}}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete",
      })
    );

    expect(
      screen.getByText("Delete task?")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Cancel",
      })
    );

    expect(onDelete).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(
        screen.queryByText("Delete task?")
      ).not.toBeInTheDocument();
    });
  });

  test("opens the edit dialog when Edit is clicked", () => {
    render(
      <TaskItem
        task={task}
        onToggle={() => {}}
        onDelete={() => {}}
        onEdit={async () => {}}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Edit",
      })
    );

    expect(
      screen.getByText("Edit Task")
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue("Learn React")
    ).toBeInTheDocument();
  });

  test("calls onEdit when Save is clicked", async () => {
    const onEdit = jest
      .fn()
      .mockResolvedValue(undefined);

    render(
      <TaskItem
        task={task}
        onToggle={() => {}}
        onDelete={() => {}}
        onEdit={onEdit}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Edit",
      })
    );

    const taskInput =
      screen.getByLabelText("Task");

    fireEvent.change(taskInput, {
      target: {
        value: "Updated Task",
      },
    });

    const dateInput =
      screen.getByLabelText("Due date");

    fireEvent.change(dateInput, {
      target: {
        value: "2026-09-15",
      },
    });

    const comboboxes =
      screen.getAllByRole("combobox");

    const prioritySelect = comboboxes[0];

    fireEvent.mouseDown(prioritySelect);

    const highOption =
      await screen.findByText("🔴 High");

    fireEvent.click(highOption);

    const categorySelect = comboboxes[1];

    fireEvent.mouseDown(categorySelect);

    const workOption =
      await screen.findByText("💼 Work");

    fireEvent.click(workOption);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save",
      })
    );

    await waitFor(() => {
      expect(onEdit).toHaveBeenCalledWith(
        1,
        "Updated Task",
        "2026-09-15",
        "high",
        "Work"
      );
    });
  });
});