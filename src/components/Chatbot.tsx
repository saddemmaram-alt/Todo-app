import { useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { getToken } from "../services/authService";

type Message = {
  sender: "user" | "bot";
  text: string;
};

function Chatbot() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] =
    useState<Message[]>([
      {
        sender: "bot",
        text:
          "Hello! 👋 I'm your TaskFlow assistant. How can I help you with your tasks?",
      },
    ]);

  const [loading, setLoading] =
    useState(false);

  async function sendMessage() {
    if (!message.trim() || loading) {
      return;
    }

    const userMessage =
      message.trim();

    // Add user's message
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const token = getToken();

      const response = await fetch(
        "/chatbot",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            message: userMessage,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Something went wrong"
        );
      }

      // Add bot response
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.response,
        },
      ]);
    } catch (error) {
      console.error(
        "Chatbot error:",
        error
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            "Sorry, I couldn't process your request. 😕",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  }

  return (
    <Paper
      elevation={4}
      sx={{
        mt: 4,
        p: 3,
        borderRadius: 3,
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ mb: 2 }}
      >
        🤖 TaskFlow Assistant
      </Typography>

      {/* Messages */}
      <Box
        sx={{
          height: 300,
          overflowY: "auto",
          mb: 2,
          p: 2,
          backgroundColor:
            "#f5f5f5",
          borderRadius: 2,
        }}
      >
        {messages.map(
          (msg, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent:
                  msg.sender === "user"
                    ? "flex-end"
                    : "flex-start",
                mb: 1.5,
              }}
            >
              <Box
                sx={{
                  maxWidth: "75%",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  backgroundColor:
                    msg.sender === "user"
                      ? "#1976d2"
                      : "#ffffff",
                  color:
                    msg.sender === "user"
                      ? "#ffffff"
                      : "#222222",
                  whiteSpace: "pre-line",
                }}
              >
                {msg.text}
              </Box>
            </Box>
          )
        )}

        {loading && (
          <Typography
            color="text.secondary"
          >
            🤖 Thinking...
          </Typography>
        )}
      </Box>

      {/* Input */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          value={message}
          onChange={(event) =>
            setMessage(
              event.target.value
            )
          }
          onKeyDown={handleKeyDown}
          placeholder="Ask me about your tasks..."
          size="small"
        />

        <Button
          variant="contained"
          onClick={sendMessage}
          disabled={
            loading ||
            !message.trim()
          }
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
}

export default Chatbot;