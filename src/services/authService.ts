export type AuthUser = {
    id: number;
    name: string;
    email: string;
  };
  
  export type AuthSession = {
    token: string;
    user: AuthUser;
  };
  
  type RegisterData = {
    name: string;
    email: string;
    password: string;
  };
  
  type LoginData = {
    email: string;
    password: string;
  };
  
  const TOKEN_KEY = "taskflow_token";
  const USER_KEY = "taskflow_user";
  
  export const AUTH_EVENT =
    "taskflow-auth-changed";
  
  async function parseResponse(
    response: Response
  ) {
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(
        data.error || "Authentication failed"
      );
    }
  
    return data;
  }
  
  export async function register(
    data: RegisterData
  ): Promise<AuthUser> {
    const response = await fetch(
      "/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(data),
      }
    );
  
    return parseResponse(response);
  }
  
  export async function login(
    data: LoginData
  ): Promise<AuthSession> {
    const response = await fetch(
      "/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(data),
      }
    );
  
    return parseResponse(response);
  }
  
  export function saveSession(
    session: AuthSession
  ): void {
    localStorage.setItem(
      TOKEN_KEY,
      session.token
    );
  
    localStorage.setItem(
      USER_KEY,
      JSON.stringify(session.user)
    );
  
    window.dispatchEvent(
      new Event(AUTH_EVENT)
    );
  }
  
  export function getToken(): string | null {
    return localStorage.getItem(
      TOKEN_KEY
    );
  }
  
  export function getStoredSession():
    | AuthSession
    | null {
    const token =
      localStorage.getItem(TOKEN_KEY);
  
    const userString =
      localStorage.getItem(USER_KEY);
  
    if (!token || !userString) {
      return null;
    }
  
    try {
      const user =
        JSON.parse(userString) as AuthUser;
  
      return {
        token,
        user,
      };
    } catch {
      clearSession();
      return null;
    }
  }
  
  export function clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  
    window.dispatchEvent(
      new Event(AUTH_EVENT)
    );
  }