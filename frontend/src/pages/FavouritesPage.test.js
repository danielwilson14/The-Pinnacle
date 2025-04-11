import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import { MemoryRouter } from "react-router-dom";
import FavouritesPage from "./FavouritesPage";
import axios from "axios";

jest.mock("axios");

describe("FavouritesPage", () => {
  const mockChats = [
    {
      _id: "chat1",
      chat_name: "Favourite Chat 1",
      summary: "This is a summary.",
    },
    {
      _id: "chat2",
      chat_name: "Favourite Chat 2",
      summary: "Another summary.",
    },
  ];

  beforeEach(() => {
    localStorage.setItem("userId", "test-user-id");
    axios.get.mockResolvedValue({ data: mockChats });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders and fetches favourite chats", async () => {
    render(
      <MemoryRouter>
        <FavouritesPage isDarkMode={false} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Favourites/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Favourite Chat 1")).toBeInTheDocument();
      expect(screen.getByText("Favourite Chat 2")).toBeInTheDocument();
    });
  });

  test("deletes a chat when confirmed", async () => {
    window.confirm = jest.fn(() => true); // Simulate confirm returning true
    axios.delete.mockResolvedValue({}); // Mock delete success

    render(
      <MemoryRouter>
        <FavouritesPage isDarkMode={false} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Favourite Chat 1")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole("button");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        expect.stringContaining("/api/chats/chat1")
      );
    });
  });

  test("does not delete a chat if confirm is cancelled", async () => {
    window.confirm = jest.fn(() => false); // Simulate cancel
    render(
      <MemoryRouter>
        <FavouritesPage isDarkMode={false} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Favourite Chat 1")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole("button");
    fireEvent.click(deleteButtons[0]);

    expect(axios.delete).not.toHaveBeenCalled();
  });
});
