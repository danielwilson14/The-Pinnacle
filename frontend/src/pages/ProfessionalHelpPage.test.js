import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import ProfessionalHelpPage from "./ProfessionalHelpPage";

describe("ProfessionalHelpPage", () => {
  test("renders main heading and intro", () => {
    render(<ProfessionalHelpPage />);
    expect(screen.getByText(/You're Not Alone – Help is Available/i)).toBeInTheDocument();
    expect(screen.getByText(/Below are some resources/i)).toBeInTheDocument();
  });

  test("renders emergency help section", () => {
    render(<ProfessionalHelpPage />);
    expect(screen.getByText(/Immediate Help/i)).toBeInTheDocument();
    expect(screen.getByText(/999 \(UK\)/)).toBeInTheDocument();
    expect(screen.getByText(/988 \(USA\)/)).toBeInTheDocument();
    expect(screen.getByText(/112 \(EU\)/)).toBeInTheDocument();
  });

  test("renders child support section", () => {
    render(<ProfessionalHelpPage />);
    expect(screen.getByText(/Support for Children & Young People/i)).toBeInTheDocument();
    expect(screen.getByText(/Childline \(UK\): 0800 1111/)).toBeInTheDocument();
  });

  test("renders therapist resources", () => {
    render(<ProfessionalHelpPage />);
    expect(screen.getByText(/Speaking to a Therapist/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /BACP/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Psychology Today/i })).toBeInTheDocument();
  });

  test("renders community support links", () => {
    render(<ProfessionalHelpPage />);
    expect(screen.getByText(/Community & Peer Support/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Mental Health Forum/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Reddit r\/depression/i })).toBeInTheDocument();
  });

  test("renders footer message", () => {
    render(<ProfessionalHelpPage />);
    expect(
      screen.getByText((text) =>
        text.includes("Seeking help is") && text.includes("You're not alone")
      )
    ).toBeInTheDocument();
  });
  
});
