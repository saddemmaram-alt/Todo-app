import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import {
  login,
  register,
  saveSession,
  type AuthSession,
} from "../services/authService";

type AuthPageProps = {
  onAuthenticated: (
    session: AuthSession
  ) => void;
};

export default function AuthPage({
  onAuthenticated,
}: AuthPageProps) {
  const [isRegister, setIsRegister] =
    useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] =
    useState(false);

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      if (isRegister) {
        await register({
          name,
          email,
          password,
        });

        const session = await login({
          email,
          password,
        });

        saveSession(session);
        onAuthenticated(session);
      } else {
        const session = await login({
          email,
          password,
        });

        saveSession(session);
        onAuthenticated(session);
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Authentication failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegister(
      (current) => !current
    );

    setName("");
    setEmail("");
    setPassword("");
    setError("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        backgroundColor:
          "background.default",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: {
            xs: 3,
            sm: 4,
          },
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          align="center"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          TaskFlow
        </Typography>

        <Typography
          align="center"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          {isRegister
            ? "Create your account"
            : "Welcome back"}
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
        >
          {isRegister && (
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              slotProps={{
                htmlInput: {
                  "data-testid":
                    "name-input",
                },
              }}
              autoComplete="name"
              required
              sx={{ mb: 2 }}
            />
          )}

          <TextField
            fullWidth
            type="email"
            label="Email"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
            slotProps={{
              htmlInput: {
                "data-testid":
                  "email-input",
              },
            }}
            autoComplete="email"
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            slotProps={{
              htmlInput: {
                "data-testid":
                  "password-input",
              },
            }}
            autoComplete={
              isRegister
                ? "new-password"
                : "current-password"
            }
            required
            sx={{ mb: 2 }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{
              py: 1.3,
              mb: 2,
            }}
          >
            {isLoading ? (
              <CircularProgress
                size={24}
                color="inherit"
              />
            ) : isRegister ? (
              "Create account"
            ) : (
              "Login"
            )}
          </Button>
        </Box>

        <Button
          fullWidth
          variant="text"
          onClick={switchMode}
          disabled={isLoading}
        >
          {isRegister
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </Button>
      </Paper>
    </Box>
  );
}