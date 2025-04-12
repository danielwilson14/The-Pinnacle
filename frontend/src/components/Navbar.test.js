import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from './Navbar';
import { MemoryRouter } from 'react-router-dom';

// Mocks
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
  useLocation: jest.fn(), // we'll override this per test
}));

import { useLocation } from 'react-router-dom'; // import after mocking

describe('Navbar component', () => {
  const defaultProps = {
    setChatId: jest.fn(),
    setMessages: jest.fn(),
  };

  beforeEach(() => {
    localStorage.clear();
    mockedNavigate.mockClear();
    defaultProps.setChatId.mockClear();
    defaultProps.setMessages.mockClear();
  });

  test('hides on login page', () => {
    useLocation.mockReturnValue({ pathname: '/' });

    const { container } = render(<Navbar {...defaultProps} />, { wrapper: MemoryRouter });
    expect(container.firstChild).toBeNull();
  });

  test('renders links on /chat', () => {
    useLocation.mockReturnValue({ pathname: '/chat' });

    render(<Navbar {...defaultProps} />, { wrapper: MemoryRouter });

    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
    expect(screen.getByText(/New Chat/i)).toBeInTheDocument();
    expect(screen.getByText(/Favourites/i)).toBeInTheDocument();
    expect(screen.getByText(/Calendar/i)).toBeInTheDocument();
    expect(screen.getByText(/Previous Chats/i)).toBeInTheDocument();
    expect(screen.getAllByText(/FAQ/i)[0]).toBeInTheDocument(); // Two FAQ icons
  });

  test('clicking logout clears localStorage and navigates to "/"', () => {
    useLocation.mockReturnValue({ pathname: '/chat' });
    localStorage.setItem('userId', '123');

    render(<Navbar {...defaultProps} />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByText(/Logout/i));
    expect(localStorage.getItem('userId')).toBeNull();
    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });

  test('clicking New Chat resets chat and navigates to /chat', () => {
    useLocation.mockReturnValue({ pathname: '/calendar' });

    render(<Navbar {...defaultProps} />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByText(/New Chat/i));
    expect(defaultProps.setChatId).toHaveBeenCalledWith(null);
    expect(defaultProps.setMessages).toHaveBeenCalledWith([]);
    expect(mockedNavigate).toHaveBeenCalledWith('/chat');
  });
});
