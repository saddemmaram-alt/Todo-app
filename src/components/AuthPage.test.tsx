import {
    fireEvent,
    render,
    screen,
    waitFor,
  } from "@testing-library/react";
  
  import AuthPage from "./AuthPage";
  
  describe("AuthPage", () => {
    beforeEach(() => {
      globalThis.fetch = jest.fn();
      localStorage.clear();
    });
  
    test("renders login form", () => {
      render(
        <AuthPage
          onAuthenticated={jest.fn()}
        />
      );
  
      expect(
        screen.getByText("TaskFlow")
      ).toBeInTheDocument();
  
      expect(
        screen.getByTestId("email-input")
      ).toBeInTheDocument();
  
      expect(
        screen.getByTestId("password-input")
      ).toBeInTheDocument();
  
      expect(
        screen.getByRole("button", {
          name: "Login",
        })
      ).toBeInTheDocument();
    });
  
    test("switches to register mode", () => {
      render(
        <AuthPage
          onAuthenticated={jest.fn()}
        />
      );
  
      fireEvent.click(
        screen.getByRole("button", {
          name: /Don't have an account/,
        })
      );
  
      expect(
        screen.getByTestId("name-input")
      ).toBeInTheDocument();
  
      expect(
        screen.getByTestId("email-input")
      ).toBeInTheDocument();
  
      expect(
        screen.getByTestId("password-input")
      ).toBeInTheDocument();
  
      expect(
        screen.getByRole("button", {
          name: "Create account",
        })
      ).toBeInTheDocument();
    });
  
    test("logs in successfully", async () => {
      (
        globalThis.fetch as jest.Mock
      ).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          token: "test-token",
          user: {
            id: 1,
            name: "Maram",
            email: "maram@example.com",
          },
        }),
      });
  
      const onAuthenticated =
        jest.fn();
  
      render(
        <AuthPage
          onAuthenticated={
            onAuthenticated
          }
        />
      );
  
      fireEvent.change(
        screen.getByTestId(
          "email-input"
        ),
        {
          target: {
            value:
              "maram@example.com",
          },
        }
      );
  
      fireEvent.change(
        screen.getByTestId(
          "password-input"
        ),
        {
          target: {
            value: "Password123!",
          },
        }
      );
  
      fireEvent.click(
        screen.getByRole("button", {
          name: "Login",
        })
      );
  
      await waitFor(() => {
        expect(
          onAuthenticated
        ).toHaveBeenCalledWith({
          token: "test-token",
          user: {
            id: 1,
            name: "Maram",
            email:
              "maram@example.com",
          },
        });
      });
  
      expect(
        localStorage.getItem(
          "taskflow_token"
        )
      ).toBe("test-token");
    });
  
    test("shows authentication error", async () => {
      (
        globalThis.fetch as jest.Mock
      ).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error:
            "Invalid email or password",
        }),
      });
  
      render(
        <AuthPage
          onAuthenticated={jest.fn()}
        />
      );
  
      fireEvent.change(
        screen.getByTestId(
          "email-input"
        ),
        {
          target: {
            value:
              "wrong@example.com",
          },
        }
      );
  
      fireEvent.change(
        screen.getByTestId(
          "password-input"
        ),
        {
          target: {
            value: "WrongPassword!",
          },
        }
      );
  
      fireEvent.click(
        screen.getByRole("button", {
          name: "Login",
        })
      );
  
      expect(
        await screen.findByText(
          "Invalid email or password"
        )
      ).toBeInTheDocument();
    });
  });