import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import LoginPage from "@/app/login/page";
import { authService } from "@/lib/auth-service";
import { useAuth } from "@/contexts/auth-context";

// Mock the modules
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/lib/auth-service", () => ({
  authService: {
    login: jest.fn(),
  },
}));

jest.mock("@/contexts/auth-context", () => ({
  useAuth: jest.fn(),
}));

describe("LoginPage", () => {
  const mockPush = jest.fn();
  const mockLogin = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });
    jest.clearAllMocks();
  });

  it("renders login form correctly", () => {
    render(<LoginPage />);

    expect(screen.getByText("Login to Your Account")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account\?/i)).toBeInTheDocument();
  });

  it("shows error when fields are empty", async () => {
    render(<LoginPage />);

    const submitButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Please fill in all fields")).toBeInTheDocument();
    });
  });

  it("handles successful login", async () => {
    const mockToken = "mock-jwt-token";
    (authService.login as jest.Mock).mockResolvedValue({
      accessToken: mockToken,
    });

    render(<LoginPage />);

    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        username: "testuser",
        password: "password123",
      });
      expect(mockLogin).toHaveBeenCalledWith(mockToken);
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("handles login failure", async () => {
    const errorMessage = "Invalid credentials";
    (authService.login as jest.Mock).mockRejectedValue(new Error(errorMessage));

    render(<LoginPage />);

    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("disables form during submission", async () => {
    (authService.login as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<LoginPage />);

    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(usernameInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it("has link to register page", () => {
    render(<LoginPage />);

    const registerLink = screen.getByRole("link", { name: /register here/i });
    expect(registerLink).toHaveAttribute("href", "/register");
  });

  it("has navigation to home", () => {
    render(<LoginPage />);

    const homeLink = screen.getByRole("link", { name: /BlogHive/i });
    expect(homeLink).toHaveAttribute("href", "/");
  });
});
