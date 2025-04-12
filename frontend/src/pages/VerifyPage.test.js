import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';
import VerifyPage from './VerifyPage';
import axios from 'axios';

jest.mock('axios');

// Mock useNavigate to prevent actual redirection
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
  useParams: () => ({ token: 'mocktoken123' }),
}));

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

describe('VerifyPage', () => {
  test('displays initial verification message', () => {
    render(
      <MemoryRouter>
        <VerifyPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Verifying your email/i)).toBeInTheDocument();
  });

  test('shows success message and redirects', async () => {
    axios.get.mockResolvedValueOnce({ data: { message: 'Email verified successfully!' } });

    render(
      <MemoryRouter>
        <VerifyPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Email verified successfully/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/');
    }, { timeout: 3500 }); // Allow some buffer for the 3s timeout
  });

  test('shows error message on failure', async () => {
    axios.get.mockRejectedValueOnce(new Error('Invalid link'));

    render(
      <MemoryRouter>
        <VerifyPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Invalid or expired verification link/i)).toBeInTheDocument();
  });
});
