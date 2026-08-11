type TaskItemProps = {
  task: {
    id: number;
    text: string;
    completed: boolean;
  };
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function TaskItem({
  task,
  onToggle,
  onDelete,
}: TaskItemProps) {
  return (
    <li>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
      />

      <span>{task.text}</span>

      <button onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </li>
  );
}