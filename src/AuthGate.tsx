import {
    useEffect,
    useState,
  } from "react";
  
  import {
    Box,
    Button,
    Chip,
  } from "@mui/material";
  
  import App from "./App";
  
  import AuthPage from "./components/AuthPage";
  
  import {
    AUTH_EVENT,
    clearSession,
    getStoredSession,
    type AuthSession,
  } from "./services/authService";
  
  export default function AuthGate() {
    const [session, setSession] =
      useState<AuthSession | null>(
        () => getStoredSession()
      );
  
    useEffect(() => {
      const handleAuthChange = () => {
        setSession(
          getStoredSession()
        );
      };
  
      window.addEventListener(
        AUTH_EVENT,
        handleAuthChange
      );
  
      return () => {
        window.removeEventListener(
          AUTH_EVENT,
          handleAuthChange
        );
      };
    }, []);
  
    const handleLogout = () => {
      clearSession();
      setSession(null);
    };
  
    if (!session) {
      return (
        <AuthPage
          onAuthenticated={setSession}
        />
      );
    }
  
    return (
      <>
        <Box
          sx={{
            position: "fixed",
            top: {
              xs: 8,
              sm: 16,
            },
            left: {
              xs: 8,
              sm: "auto",
            },
            right: {
              xs: 8,
              sm: 16,
            },
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          <Chip
            label={session.user.name}
            variant="outlined"
          />
  
          <Button
            size="small"
            variant="outlined"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
  
        <App />
      </>
    );
  }