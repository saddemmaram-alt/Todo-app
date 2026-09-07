import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
  } from "recharts";
  
  import {
    Box,
    Paper,
    Typography,
    useTheme,
  } from "@mui/material";
  
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
  
  type DashboardChartsProps = {
    tasks: Task[];
  };
  
  export default function DashboardCharts({
    tasks,
  }: DashboardChartsProps) {
    const theme = useTheme();
  
    const priorityData = [
      {
        name: "High",
        value: tasks.filter(
          (task) =>
            task.priority === "high"
        ).length,
      },
      {
        name: "Medium",
        value: tasks.filter(
          (task) =>
            task.priority === "medium"
        ).length,
      },
      {
        name: "Low",
        value: tasks.filter(
          (task) =>
            task.priority === "low"
        ).length,
      },
    ];
  
    const categoryData = [
      "University",
      "Work",
      "Personal",
      "Shopping",
      "Other",
    ].map((category) => ({
      name: category,
      value: tasks.filter(
        (task) =>
          (task.category ?? "Other") ===
          category
      ).length,
    }));
  
    const completionData = [
      {
        name: "Completed",
        value: tasks.filter(
          (task) => task.completed
        ).length,
      },
      {
        name: "Active",
        value: tasks.filter(
          (task) => !task.completed
        ).length,
      },
    ];
  
    return (
      <Box sx={{ mt: 3 }}>
        <Typography
          variant="h5"
          sx={{
            mb: 2,
            fontWeight: 600,
          }}
        >
          Analytics
        </Typography>
  
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
            },
            gap: 2,
          }}
        >
          <Paper
            elevation={2}
            sx={{
              p: {
                xs: 2,
                sm: 3,
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2 }}
            >
              Tasks by Priority
            </Typography>
  
            <Box
              sx={{
                width: "100%",
                height: 280,
              }}
            >
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={priorityData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -15,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                  />
  
                  <XAxis dataKey="name" />
  
                  <YAxis
                    allowDecimals={false}
                  />
  
                  <Tooltip />
  
                  <Bar
                    dataKey="value"
                    name="Tasks"
                    fill={
                      theme.palette.primary.main
                    }
                    radius={[
                      6,
                      6,
                      0,
                      0,
                    ]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
  
          <Paper
            elevation={2}
            sx={{
              p: {
                xs: 2,
                sm: 3,
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2 }}
            >
              Tasks by Category
            </Typography>
  
            <Box
              sx={{
                width: "100%",
                height: 280,
              }}
            >
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={categoryData}
                  layout="vertical"
                  margin={{
                    top: 10,
                    right: 20,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                  />
  
                  <XAxis
                    type="number"
                    allowDecimals={false}
                  />
  
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={90}
                  />
  
                  <Tooltip />
  
                  <Bar
                    dataKey="value"
                    name="Tasks"
                    fill={
                      theme.palette.secondary.main
                    }
                    radius={[
                      0,
                      6,
                      6,
                      0,
                    ]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
  
          <Paper
            elevation={2}
            sx={{
              p: {
                xs: 2,
                sm: 3,
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2 }}
            >
              Completion Status
            </Typography>
  
            <Box
              sx={{
                width: "100%",
                height: 280,
              }}
            >
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={completionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    label
                  >
                    {completionData.map(
                      (entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={
                            index === 0
                              ? theme.palette
                                  .success
                                  .main
                              : theme.palette
                                  .warning
                                  .main
                          }
                        />
                      )
                    )}
                  </Pie>
  
                  <Tooltip />
  
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
  
          <Paper
            elevation={2}
            sx={{
              p: {
                xs: 2,
                sm: 3,
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2 }}
            >
              Priority Distribution
            </Typography>
  
            <Box
              sx={{
                width: "100%",
                height: 280,
              }}
            >
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={priorityData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    label
                  >
                    {priorityData.map(
                      (entry, index) => {
                        const fills = [
                          theme.palette.error
                            .main,
                          theme.palette.warning
                            .main,
                          theme.palette.success
                            .main,
                        ];
  
                        return (
                          <Cell
                            key={entry.name}
                            fill={fills[index]}
                          />
                        );
                      }
                    )}
                  </Pie>
  
                  <Tooltip />
  
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>
      </Box>
    );
  }