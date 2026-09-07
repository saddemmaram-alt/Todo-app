import {
    useMemo,
    useState,
  } from "react";
  
  import {
    Box,
    Button,
    Chip,
    IconButton,
    Paper,
    Typography,
  } from "@mui/material";
  
  import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
  import ChevronRightIcon from "@mui/icons-material/ChevronRight";
  
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
  
  type Task = {
    id: number;
    text: string;
    completed: boolean;
    dueDate?: string | null;
    priority: Priority;
    category?: Category;
  };
  
  type TaskCalendarProps = {
    tasks: Task[];
    initialDate?: string;
  };
  
  const weekDays = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];
  
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  
  function formatDateKey(
    date: Date
  ): string {
    const year = date.getFullYear();
  
    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");
  
    const day = String(
      date.getDate()
    ).padStart(2, "0");
  
    return `${year}-${month}-${day}`;
  }
  
  function getMondayOffset(
    date: Date
  ): number {
    const day = date.getDay();
  
    return day === 0
      ? 6
      : day - 1;
  }
  
  function getCalendarDays(
    year: number,
    month: number
  ): Date[] {
    const firstDay = new Date(
      year,
      month,
      1
    );
  
    const lastDay = new Date(
      year,
      month + 1,
      0
    );
  
    const startOffset =
      getMondayOffset(firstDay);
  
    const totalDays =
      lastDay.getDate();
  
    const totalCells =
      Math.ceil(
        (startOffset +
          totalDays) /
          7
      ) * 7;
  
    const days: Date[] = [];
  
    for (
      let index = 0;
      index < totalCells;
      index++
    ) {
      const dayNumber =
        index -
        startOffset +
        1;
  
      days.push(
        new Date(
          year,
          month,
          dayNumber
        )
      );
    }
  
    return days;
  }
  
  export default function TaskCalendar({
    tasks,
    initialDate,
  }: TaskCalendarProps) {
    const startingDate =
      initialDate
        ? new Date(
            `${initialDate}T00:00:00`
          )
        : new Date();
  
    const [
      currentMonth,
      setCurrentMonth,
    ] = useState(
      new Date(
        startingDate.getFullYear(),
        startingDate.getMonth(),
        1
      )
    );
  
    const [
      selectedDate,
      setSelectedDate,
    ] = useState(
      formatDateKey(startingDate)
    );
  
    const calendarDays = useMemo(
      () =>
        getCalendarDays(
          currentMonth.getFullYear(),
          currentMonth.getMonth()
        ),
      [currentMonth]
    );
  
    const tasksByDate =
      useMemo(() => {
        const grouped: Record<
          string,
          Task[]
        > = {};
  
        tasks.forEach((task) => {
          if (!task.dueDate) {
            return;
          }
  
          if (!grouped[task.dueDate]) {
            grouped[task.dueDate] = [];
          }
  
          grouped[task.dueDate].push(
            task
          );
        });
  
        return grouped;
      }, [tasks]);
  
    const selectedTasks =
      tasksByDate[selectedDate] ??
      [];
  
    const goToPreviousMonth =
      () => {
        setCurrentMonth(
          (current) =>
            new Date(
              current.getFullYear(),
              current.getMonth() - 1,
              1
            )
        );
      };
  
    const goToNextMonth = () => {
      setCurrentMonth(
        (current) =>
          new Date(
            current.getFullYear(),
            current.getMonth() + 1,
            1
          )
      );
    };
  
    const goToToday = () => {
      const today = new Date();
  
      setCurrentMonth(
        new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        )
      );
  
      setSelectedDate(
        formatDateKey(today)
      );
    };
  
    const isCurrentMonthDay = (
      date: Date
    ) => {
      return (
        date.getMonth() ===
          currentMonth.getMonth() &&
        date.getFullYear() ===
          currentMonth.getFullYear()
      );
    };
  
    const isToday = (
      date: Date
    ) => {
      const today = new Date();
  
      return (
        formatDateKey(date) ===
        formatDateKey(today)
      );
    };
  
    return (
      <Paper
        elevation={2}
        sx={{
          p: {
            xs: 2,
            sm: 3,
          },
          mt: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            gap: 1,
            mb: 3,
            flexWrap: "wrap",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
            }}
          >
            Calendar
          </Typography>
  
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Button
              variant="outlined"
              size="small"
              onClick={goToToday}
            >
              Today
            </Button>
  
            <IconButton
              onClick={
                goToPreviousMonth
              }
              aria-label="Previous month"
            >
              <ChevronLeftIcon />
            </IconButton>
  
            <IconButton
              onClick={goToNextMonth}
              aria-label="Next month"
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </Box>
  
        <Typography
          variant="h6"
          align="center"
          sx={{
            mb: 2,
            fontWeight: 600,
          }}
        >
          {
            monthNames[
              currentMonth.getMonth()
            ]
          }{" "}
          {currentMonth.getFullYear()}
        </Typography>
  
        {/* Week days */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              "repeat(7, 1fr)",
            gap: 0.5,
            mb: 0.5,
          }}
        >
          {weekDays.map((day) => (
            <Box
              key={day}
              sx={{
                textAlign: "center",
                py: 1,
                fontWeight: 600,
                fontSize: {
                  xs: "0.75rem",
                  sm: "0.875rem",
                },
              }}
            >
              {day}
            </Box>
          ))}
        </Box>
  
        {/* Calendar days */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              "repeat(7, 1fr)",
            gap: 0.5,
          }}
        >
          {calendarDays.map((date) => {
            const dateKey =
              formatDateKey(date);
  
            const dayTasks =
              tasksByDate[dateKey] ??
              [];
  
            const selected =
              dateKey ===
              selectedDate;
  
            return (
              <Button
                key={dateKey}
                variant={
                  selected
                    ? "contained"
                    : "outlined"
                }
                onClick={() =>
                  setSelectedDate(
                    dateKey
                  )
                }
                sx={{
                  minWidth: 0,
                  minHeight: {
                    xs: 58,
                    sm: 78,
                  },
                  p: {
                    xs: 0.5,
                    sm: 1,
                  },
                  opacity:
                    isCurrentMonthDay(
                      date
                    )
                      ? 1
                      : 0.45,
                  display: "flex",
                  flexDirection:
                    "column",
                  justifyContent:
                    "flex-start",
                  alignItems:
                    "center",
                  gap: 0.4,
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontSize: {
                      xs: "0.75rem",
                      sm: "0.875rem",
                    },
                    fontWeight:
                      isToday(date)
                        ? 700
                        : 400,
                  }}
                >
                  {date.getDate()}
                </Typography>
  
                {isToday(date) && (
                  <Typography
                    component="span"
                    sx={{
                      fontSize: {
                        xs: "0.55rem",
                        sm: "0.65rem",
                      },
                      fontWeight: 700,
                    }}
                  >
                    Today
                  </Typography>
                )}
  
                {dayTasks.length >
                  0 && (
                  <Chip
                    label={`${dayTasks.length} ${
                      dayTasks.length === 1
                        ? "task"
                        : "tasks"
                    }`}
                    size="small"
                    color="primary"
                    sx={{
                      maxWidth: "100%",
                      height: {
                        xs: 18,
                        sm: 22,
                      },
                      fontSize: {
                        xs: "0.55rem",
                        sm: "0.65rem",
                      },
                      opacity: selected
                        ? 0.9
                        : 1,
                    }}
                  />
                )}
              </Button>
            );
          })}
        </Box>
  
        {/* Selected day */}
        <Box sx={{ mt: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 1.5 }}
          >
            Tasks for{" "}
            {selectedDate}
          </Typography>
  
          {selectedTasks.length ===
          0 ? (
            <Typography
              color="text.secondary"
            >
              No tasks scheduled for
              this day.
            </Typography>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection:
                  "column",
                gap: 1,
              }}
            >
              {selectedTasks.map(
                (task) => (
                  <Paper
                    key={task.id}
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      display: "flex",
                      flexDirection: {
                        xs: "column",
                        sm: "row",
                      },
                      justifyContent:
                        "space-between",
                      alignItems: {
                        xs: "flex-start",
                        sm: "center",
                      },
                      gap: 1,
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          textDecoration:
                            task.completed
                              ? "line-through"
                              : "none",
                          fontWeight: 500,
                        }}
                      >
                        {task.text}
                      </Typography>
  
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Priority:{" "}
                        {task.priority}
                        {" • "}
                        Category:{" "}
                        {task.category ??
                          "Other"}
                      </Typography>
                    </Box>
  
                    <Chip
                      label={
                        task.completed
                          ? "Completed"
                          : "Active"
                      }
                      size="small"
                      color={
                        task.completed
                          ? "success"
                          : "warning"
                      }
                    />
                  </Paper>
                )
              )}
            </Box>
          )}
        </Box>
      </Paper>
    );
  }