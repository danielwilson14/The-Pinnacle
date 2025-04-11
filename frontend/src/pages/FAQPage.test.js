import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import FAQPage from "./FAQPage";

describe("FAQPage", () => {
  test("renders the FAQ heading and description", () => {
    render(<FAQPage />);
    expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument();
    expect(screen.getByText(/Find answers to common questions/i)).toBeInTheDocument();
  });

  test("renders all FAQ questions", () => {
    render(<FAQPage />);
    const questions = screen.getAllByRole("button");
    expect(questions.length).toBe(6); // matches the number of questions in the array
  });

  test("toggles answer visibility on question click", () => {
    render(<FAQPage />);
    const firstQuestion = screen.getByText(/How does the chatbot work?/i);
    fireEvent.click(firstQuestion);
    expect(
      screen.getByText(/The chatbot uses AI to generate responses/i)
    ).toBeInTheDocument();

    // Collapse it again
    fireEvent.click(firstQuestion);
    expect(
      screen.queryByText(/The chatbot uses AI to generate responses/i)
    ).not.toBeInTheDocument();
  });

  test("only one answer is visible at a time", () => {
    render(<FAQPage />);
    const first = screen.getByText(/How does the chatbot work?/i);
    const second = screen.getByText(/Is my data stored?/i);

    fireEvent.click(first);
    expect(screen.getByText(/The chatbot uses AI to generate responses/i)).toBeInTheDocument();

    fireEvent.click(second);
    expect(screen.getByText(/your chats are stored in our database/i)).toBeInTheDocument();
    expect(screen.queryByText(/The chatbot uses AI to generate responses/i)).not.toBeInTheDocument();
  });
});
