import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfileIcon from './ProfileIcon';
import axios from 'axios';
import '@testing-library/jest-dom';

// Mock axios
jest.mock('axios');

// Setup localStorage before each test
beforeEach(() => {
  localStorage.setItem('userId', 'testUserId');
  localStorage.setItem('darkMode', 'false');
  jest.clearAllMocks();
});

describe('ProfileIcon Component', () => {
  test('renders icon and opens popup on click', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        display_name: 'Test User',
        email: 'test@example.com',
        dob: '2000-01-01',
        location: 'Testville',
        pronouns: 'they/them',
        profile_pic: ''
      },
    });

    render(<ProfileIcon />);
    const icon = screen.getByTestId('profile-icon-container');
    fireEvent.click(icon);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Profile' })).toBeInTheDocument();
      expect(screen.getByText(/Test User/)).toBeInTheDocument();
    });
  });

  test('clicking "Edit Profile" shows input fields', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        display_name: 'Test User',
        email: 'test@example.com',
        dob: '',
        location: '',
        pronouns: '',
        profile_pic: ''
      },
    });

    render(<ProfileIcon />);
    fireEvent.click(screen.getByTestId('profile-icon-container'));

    await screen.findByText('Edit Profile');
    fireEvent.click(screen.getByText('Edit Profile'));

    expect(screen.getByLabelText(/Display Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date of Birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pronouns/i)).toBeInTheDocument();
  });

  test('dark mode toggles correctly', async () => {
    render(<ProfileIcon />);
    fireEvent.click(screen.getByTestId('profile-icon-container'));
    fireEvent.click(screen.getByText('Settings'));

    const toggleButton = screen.getByText(/Enable Dark Mode/i);
    fireEvent.click(toggleButton);

    expect(localStorage.getItem('darkMode')).toBe('true');
    // Optional: check that body class is updated
    expect(document.body.classList.contains('dark-mode')).toBe(true);
  });
});
