// LoginPage.test.js
import { render, screen } from '@testing-library/react';
import LoginPage from '../../src/views/LoginPage'; // Adjust the import path as needed
import React from 'react';

describe('LoginPage', () => {
  test('renders McMaster GSA Softball League title', () => {
    render(<LoginPage />);
    const titleElement = screen.getByText(/McMaster GSA Softball League/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders login/signup header', () => {
    render(<LoginPage />);
    const headerElement = screen.getByText(/Login\/Sign Up to Access League/i);
    expect(headerElement).toBeInTheDocument();
  });
});
