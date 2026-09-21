import { Box, Typography } from "@mui/material";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: React.ComponentProps<typeof TaskItem>["task"][];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit?: (
    id: number,
    text: string,
    dueDate?: string,
    priority?: "high" | "medium" | "low",
    category?: string
  ) => void;
  emptyMessage?: string;
}

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
    <Box>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </Box>
  );
}