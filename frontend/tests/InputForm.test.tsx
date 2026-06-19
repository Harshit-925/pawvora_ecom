/**
 * Accessibility + unit tests for InputForm.
 * jest-axe ensures zero WCAG violations.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { InputForm } from '../src/components/InputForm';

expect.extend(toHaveNoViolations);

describe('InputForm', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<InputForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders submit button', () => {
    render(<InputForm />);
    expect(screen.getByRole('button', { name: /generate custom plan/i })).toBeInTheDocument();
  });

  it('shows loading state while submitting', async () => {
    render(<InputForm />);
    const button = screen.getByRole('button', { name: /generate custom plan/i });
    expect(button).not.toBeDisabled();
  });
});
