// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const AUTH_SERVICE_URL = `${API_BASE_URL}/auth`;

export interface LoginRequest {
  username: string;
  password: string;
  email: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${AUTH_SERVICE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Login failed");
    }

    return response.json();
  }

  async register(userData: RegisterRequest): Promise<User> {
    const response = await fetch(`${AUTH_SERVICE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Registration failed");
    }

    return response.json();
  }

  saveToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", token);
    }
  }

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
    return null;
  }

  removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    this.removeToken();
  }

  getCurrentUser(): User | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      // Decode JWT token (payload is the middle part)
      const payload = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payload));

      // Log the decoded payload for debugging
      console.log("Decoded JWT payload:", decodedPayload);

      // Check if userId exists in the token
      if (!decodedPayload.userId) {
        console.warn(
          "Token does not contain userId. Please log out and log in again."
        );
      }

      return {
        id: decodedPayload.userId,
        username: decodedPayload.sub, // sub contains the username
        email: decodedPayload.email,
        roles: decodedPayload.roles || [],
      };
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  }
}

export const authService = new AuthService();
