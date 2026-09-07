import { useState } from "react";

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

type Priority =
  | "high"
  | "medium"
  | "low";

type Category =
  | "University"
  | "Work"
  | "Personal"
  | "Shopping"
  | "Other";

type TaskItemProps = {
  task: {
    id: number;
    text: string;
    completed: boolean;
    dueDate?: string | null;
    priority: Priority;
    category?: Category;
  };

  onToggle: (id: number) => void;

  onDelete: (id: number) => void;

  onEdit?: (
    id: number,
    text: string,
    dueDate: string,
    priority: Priority,
    category: Category
  ) => void | Promise<void>;
};

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onEdit,
}: TaskItemProps) {
  const [openEdit, setOpenEdit] =
    useState(false);

  const [openDelete, setOpenDelete] =
    useState(false);

  const [text, setText] =
    useState(task.text);

  const [dueDate, setDueDate] =
    useState(task.dueDate ?? "");

  const [priority, setPriority] =
    useState<Priority>(task.priority);

  const [category, setCategory] =
    useState<Category>(
      task.category ?? "Other"
    );

  const handleEdit = () => {
    setText(task.text);
    setDueDate(task.dueDate ?? "");
    setPriority(task.priority);
    setCategory(
      task.category ?? "Other"
    );

    setOpenEdit(true);
  };

  const handleSave = async () => {
    if (!text.trim()) {
      return;
    }

    if (onEdit) {
      await onEdit(
        task.id,
        text.trim(),
        dueDate,
        priority,
        category
      );
    }

    setOpenEdit(false);
  };

  const handleDeleteClick = () => {
    setOpenDelete(true);
  };

  const handleCancelDelete = () => {
    setOpenDelete(false);
  };

  const handleConfirmDelete = () => {
    onDelete(task.id);
    setOpenDelete(false);
  };

  return (
    <>
      <ListItem
        secondaryAction={
          <>
            <IconButton
              edge="end"
              aria-label="Edit"
              onClick={handleEdit}
              sx={{ mr: 1 }}
            >
              <EditIcon />
            </IconButton>

            <IconButton
              edge="end"
              aria-label="Delete"
              onClick={handleDeleteClick}
            >
              <DeleteIcon />
            </IconButton>
          </>
        }
      >
        <Checkbox
          checked={task.completed}
          onChange={() =>
            onToggle(task.id)
          }
        />

        <ListItemText
          primary={task.text}
          secondary={
            <>
              Priority: {task.priority}
              {" • "}
              Category:{" "}
              {task.category ?? "Other"}
              {task.dueDate
                ? ` • Due: ${task.dueDate}`
                : ""}
            </>
          }
          sx={{
            textDecoration:
              task.completed
                ? "line-through"
                : "none",
          }}
        />
      </ListItem>

      {/* Edit Dialog */}
      <Dialog
        open={openEdit}
        onClose={() =>
          setOpenEdit(false)
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Edit Task
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Task"
            value={text}
            onChange={(event) =>
              setText(
                event.target.value
              )
            }
            margin="normal"
          />

          <TextField
            fullWidth
            label="Due date"
            type="date"
            value={dueDate}
            onChange={(event) =>
              setDueDate(
                event.target.value
              )
            }
            margin="normal"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />

          <FormControl
            fullWidth
            margin="normal"
          >
            <InputLabel>
              Priority
            </InputLabel>

            <Select
              value={priority}
              label="Priority"
              onChange={(event) =>
                setPriority(
                  event.target.value as Priority
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
            fullWidth
            margin="normal"
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
        </DialogContent>

        <DialogActions>
          <Button
            type="button"
            onClick={() =>
              setOpenEdit(false)
            }
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="contained"
            onClick={handleSave}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDelete}
        onClose={handleCancelDelete}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          Delete task?
        </DialogTitle>

        <DialogContent>
          Are you sure you want to delete
          <strong> "{task.text}"</strong>?
        </DialogContent>

        <DialogActions>
          <Button
            type="button"
            onClick={handleCancelDelete}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}