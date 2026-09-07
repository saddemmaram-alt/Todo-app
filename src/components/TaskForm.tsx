import { useState } from "react";

import {
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

import { validateTask } from "../utils/validateTask";

type Category =
  | "University"
  | "Work"
  | "Personal"
  | "Shopping"
  | "Other";

type TaskFormProps = {
  onAdd: (
    text: string,
    dueDate: string,
    priority: "high" | "medium" | "low",
    category: Category
  ) => void;
};

export default function TaskForm({
  onAdd,
}: TaskFormProps) {
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [priority, setPriority] =
    useState<
      "high" | "medium" | "low"
    >("medium");

  const [category, setCategory] =
    useState<Category>("Other");

  const [error, setError] = useState("");

  const handleSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!validateTask(text)) {
      setError(
        "Task must contain at least 3 characters"
      );
      return;
    }

    setError("");

    onAdd(
      text.trim(),
      dueDate,
      priority,
      category
    );

    setText("");
    setDueDate("");
    setCategory("Other");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "flex-start",
        mb: 3,
        flexWrap: "wrap",
      }}
    >
      <TextField
        label="Write a task"
        variant="outlined"
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          setError("");
        }}
        error={!!error}
        helperText={error}
        sx={{
          flex: "1 1 260px",
          minWidth: {
            xs: "100%",
            sm: 220,
          },
        }}
      />

      <TextField
        label="Due date"
        type="date"
        value={dueDate}
        onChange={(event) =>
          setDueDate(event.target.value)
        }
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
        sx={{
          flex: "1 1 180px",
          minWidth: {
            xs: "100%",
            sm: 180,
          },
        }}
      />

      <FormControl
        sx={{
          flex: {
            xs: "1 1 100%",
            sm: "0 1 140px",
          },
          minWidth: {
            xs: "100%",
            sm: 140,
          },
        }}
      >
        <InputLabel>
          Priority
        </InputLabel>

        <Select
          value={priority}
          label="Priority"
          onChange={(event) =>
            setPriority(
              event.target.value as
                | "high"
                | "medium"
                | "low"
            )
          }
        >
          <MenuItem value="high">
            🔴 High
          </MenuItem>

          <MenuItem value="medium">
            🟠 Medium
          </MenuItem>

          <MenuItem value="low">
            🟢 Low
          </MenuItem>
        </Select>
      </FormControl>

      <FormControl
        sx={{
          flex: {
            xs: "1 1 100%",
            sm: "0 1 140px",
          },
          minWidth: {
            xs: "100%",
            sm: 140,
          },
        }}
      >
        <InputLabel>
          Category
        </InputLabel>

        <Select
          value={category}
          label="Category"
          onChange={(event) =>
            setCategory(
              event.target.value as Category
            )
          }
        >
          <MenuItem value="University">
            🎓 University
          </MenuItem>

          <MenuItem value="Work">
            💼 Work
          </MenuItem>

          <MenuItem value="Personal">
            👤 Personal
          </MenuItem>

          <MenuItem value="Shopping">
            🛒 Shopping
          </MenuItem>

          <MenuItem value="Other">
            📌 Other
          </MenuItem>
        </Select>
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        sx={{
          height: 56,
          width: {
            xs: "100%",
            sm: "auto",
          },
        }}
      >
        Add
      </Button>
    </Box>
  );
}