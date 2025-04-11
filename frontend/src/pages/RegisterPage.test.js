import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterPage from './RegisterPage';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';

// Mocks
jest.mock('axios');
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    localStorage.clear();
    mockedNavigate.mockClear();
  });

  test('renders registration form elements', () => {
    render(<RegisterPage />, { wrapper: MemoryRouter });
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
    expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();
  });

  test('shows error if passwords do not match', async () => {
    render(<RegisterPage />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/^Password$/i), {
      target: { value: 'StrongPass123!' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), {
      target: { value: 'Mismatch123' },
    });

    fireEvent.click(screen.getByText(/^Register$/i));
    expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  test('shows error for weak password', async () => {
    render(<RegisterPage />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/^Password$/i), {
      target: { value: 'weak' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), {
      target: { value: 'weak' },
    });

    fireEvent.click(screen.getByText(/^Register$/i));
    expect(await screen.findByText(/too weak/i)).toBeInTheDocument();
  });

  test('submits and navigates on successful registration', async () => {
    axios.post.mockResolvedValueOnce({
      data: { token: 'mockToken', user_id: 'mockUserId' },
    });

    render(<RegisterPage />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'user@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/^Password$/i), {
      target: { value: 'StrongPass123!' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), {
      target: { value: 'StrongPass123!' },
    });

    fireEvent.click(screen.getByText(/^Register$/i));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/api/register'), {
        email: 'user@test.com',
        password: 'StrongPass123!',
      });
      expect(mockedNavigate).toHaveBeenCalledWith('/chat');
    });
  });

  test('displays API error message on failure', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { error: 'Email already in use' } },
    });

    render(<RegisterPage />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'user@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/^Password$/i), {
      target: { value: 'StrongPass123!' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), {
      target: { value: 'StrongPass123!' },
    });

    fireEvent.click(screen.getByText(/^Register$/i));

    expect(await screen.findByText(/Email already in use/i)).toBeInTheDocument();
  });
});
