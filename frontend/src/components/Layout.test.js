import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Layout from './Layout';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

jest.mock('./Navbar', () => () => <div data-testid="navbar" />);
jest.mock('./ProfileIcon', () => () => <div data-testid="profile-icon" />);
jest.mock('./Banner', () => () => <div data-testid="banner" />);

const renderWithPath = (path, verified = 'false') => {
  localStorage.setItem('userId', 'mockUser');
  localStorage.setItem('verified', verified);

  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="*"
          element={
            <Layout isDarkMode={false} setIsDarkMode={jest.fn()}>
              <div data-testid="child">Page Content</div>
            </Layout>
          }
        />
      </Routes>
    </MemoryRouter>
  );
};

describe('Layout component', () => {
  afterEach(() => {
    localStorage.clear();
  });

  test('hides Navbar and Banner on login page ("/")', () => {
    renderWithPath('/');
    expect(screen.queryByTestId('navbar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('banner')).not.toBeInTheDocument();
  });

  test('hides Navbar and Banner on register page ("/register")', () => {
    renderWithPath('/register');
    expect(screen.queryByTestId('navbar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('banner')).not.toBeInTheDocument();
  });

  test('shows Navbar, ProfileIcon, and Banner on /chat when not verified', () => {
    renderWithPath('/chat', 'false');
    expect(screen.getAllByTestId('navbar')).toHaveLength(2);
    expect(screen.getByTestId('profile-icon')).toBeInTheDocument();
    expect(screen.getByTestId('banner')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
  
  test('shows Navbar and ProfileIcon but hides Banner when verified', () => {
    renderWithPath('/chat', 'true');
    expect(screen.getAllByTestId('navbar')).toHaveLength(2);
    expect(screen.getByTestId('profile-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('banner')).not.toBeInTheDocument();
  });
  
});
