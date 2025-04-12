import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Banner from './Banner';

describe('Banner component', () => {
  afterEach(() => {
    localStorage.clear();
  });

  test('renders the banner if user is not verified', () => {
    localStorage.setItem('verified', 'false');
    render(<Banner />);
    expect(screen.getByText(/Verify your email to unlock all features/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Click here/i })).toHaveAttribute('href', '/verify');
  });

  test('does not render the banner if user is verified', () => {
    localStorage.setItem('verified', 'true');
    const { container } = render(<Banner />);
    expect(container).toBeEmptyDOMElement();
  });
});
