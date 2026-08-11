import { useState } from "react";
import { validateTask } from "../utils/validateTask";

type TaskFormProps = {
  onAdd: (text: string) => void;
};

export default function TaskForm({ onAdd }: TaskFormProps) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateTask(text)) {
      setError("Task must contain at least 3 characters");
      return;
    }

    setError("");
    onAdd(text.trim());
    setText("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Write a task"
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          setError("");
        }}
      />

      <button type="submit">Add</button>

      {error && <p role="alert">{error}</p>}
    </form>
  );
}