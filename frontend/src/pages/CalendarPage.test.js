import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CalendarPage from './CalendarPage';
import axios from 'axios';

jest.mock('axios');

describe('CalendarPage', () => {
  beforeEach(() => {
    // Clear any localStorage and mocks before each test
    localStorage.setItem('userId', 'test-user-id');
    axios.get.mockResolvedValue({ data: {} });
  });

  test('renders calendar with all months', () => {
    render(<CalendarPage />);
    const months = screen.getAllByRole('heading', { level: 3 });
    expect(months.length).toBe(12);
  });

  test('calls API to fetch chats on load', async () => {
    const fakeData = {
      "2025-04-10": [
        {
          _id: "chat-id-1",
          chat_name: "Test Chat",
          summary: "Test Summary"
        }
      ]
    };
    axios.get.mockResolvedValueOnce({ data: fakeData });

    render(<CalendarPage />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/calendar'),
        expect.objectContaining({
          params: { user_id: 'test-user-id' },
        })
      );
    });
  });
});
