import { List, Typography } from "@mui/material";

import TaskItem from "./TaskItem";

type Category =
  | "University"
  | "Work"
  | "Personal"
  | "Shopping"
  | "Other";

type Task = {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: string | null;
  priority: "high" | "medium" | "low";
  category?: Category;
};

type TaskListProps = {
  tasks: Task[];

  onToggle: (id: number) => void;

  onDelete: (id: number) => void;

  onEdit?: (
    id: number,
    text: string,
    dueDate: string,
    priority: "high" | "medium" | "low",
    category: Category
  ) => void | Promise<void>;

  emptyMessage?: string;
};

export default function TaskList({
  tasks,
  onToggle,
  onDelete,
  onEdit,
  emptyMessage = "No tasks yet",
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <Typography
        align="center"
        sx={{
          py: 4,
          color: "text.secondary",
        }}
      >
        {emptyMessage}
      </Typography>
    );
  }

  return (
    <List>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </List>
  );
}