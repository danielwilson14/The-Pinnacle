import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ChatPage from './ChatPage';
import axios from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Mocks
jest.mock('axios');

describe('ChatPage', () => {
  beforeEach(() => {
    localStorage.setItem('userId', 'test-user-id');
    axios.get.mockResolvedValue({
      data: {
        messages: [],
        isFavourited: false,
      }
    });
  });

  test('renders ChatPage and input', async () => {
    render(
      <MemoryRouter initialEntries={['/chat/123']}>
        <Routes>
          <Route path="/chat/:chatId" element={<ChatPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();
    });
  });
});
