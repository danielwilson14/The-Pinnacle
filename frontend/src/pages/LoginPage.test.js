import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import { MemoryRouter } from "react-router-dom";
import LoginPage from "./LoginPage";
import axios from "axios";

jest.mock("axios");

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("LoginPage", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("renders login form", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument(); // fixed
    expect(screen.getByText("Register?")).toBeInTheDocument();
  });

  test("logs in successfully and navigates", async () => {
    axios.post.mockResolvedValue({
      data: {
        token: "test-token",
        user_id: "user-123",
        verified: true,
      },
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i })); // fixed

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(localStorage.getItem("token")).toBe("test-token");
      expect(localStorage.getItem("userId")).toBe("user-123");
      expect(localStorage.getItem("verified")).toBe("true");
      expect(mockedNavigate).toHaveBeenCalledWith("/chat");
    });
  });

  test("shows error on login failure", async () => {
    axios.post.mockRejectedValue(new Error("Login failed"));

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i })); // fixed

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });
});
