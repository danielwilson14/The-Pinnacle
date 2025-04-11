import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import PreviousChats from "./PreviousChats";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";

jest.mock("axios");

// Mock navigate from react-router
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("PreviousChats", () => {
  beforeEach(() => {
    localStorage.setItem("userId", "test-user");
    axios.get.mockResolvedValue({
      data: [
        {
          _id: "chat1",
          chat_name: "Test Chat 1",
          summary: "This is a test summary",
          isFavourited: true,
        },
        {
          _id: "chat2",
          chat_name: "",
          summary: "",
          isFavourited: false,
        },
      ],
    });
  });

  test("renders previous chats with correct content", async () => {
    render(
      <MemoryRouter>
        <PreviousChats isDarkMode={false} />
      </MemoryRouter>
    );

    expect(await screen.findByText("Test Chat 1")).toBeInTheDocument();
    expect(screen.getByText("This is a test summary")).toBeInTheDocument();
    expect(screen.getByText("Untitled Chat")).toBeInTheDocument();
    expect(screen.getByText("No summary available.")).toBeInTheDocument();
  });

  test("navigates to chat on click", async () => {
    render(
      <MemoryRouter>
        <PreviousChats isDarkMode={false} />
      </MemoryRouter>
    );

    const chatCard = await screen.findByText("Test Chat 1");
    fireEvent.click(chatCard);
    expect(mockNavigate).toHaveBeenCalledWith("/chat/chat1");
  });

  test("deletes a chat on confirm", async () => {
    axios.delete.mockResolvedValue({});
    window.confirm = jest.fn(() => true); // Simulate user confirming delete

    render(
      <MemoryRouter>
        <PreviousChats isDarkMode={false} />
      </MemoryRouter>
    );

    const deleteButton = await screen.findAllByText("Delete");
    fireEvent.click(deleteButton[0]);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        expect.stringContaining("/api/chats/chat1")
      );
    });
  });

  test("toggles favourite status", async () => {
    axios.post.mockResolvedValue({});

    render(
      <MemoryRouter>
        <PreviousChats isDarkMode={false} />
      </MemoryRouter>
    );

    const favButtons = await screen.findAllByRole("button");
    const heartBtn = favButtons.find((btn) => btn.innerHTML.includes("svg"));
    fireEvent.click(heartBtn);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/favourites/toggle"),
        { chat_id: "chat1" }
      );
    });
  });
});
