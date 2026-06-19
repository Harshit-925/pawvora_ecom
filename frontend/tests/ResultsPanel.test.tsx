import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ResultsPanel } from '../src/components/ResultsPanel';
import { useAppStore } from '../src/store/useAppStore';

expect.extend(toHaveNoViolations);

describe('ResultsPanel', () => {
  beforeEach(() => {
    useAppStore.setState({ result: null, error: null, isLoading: false });
  });

  it('has no accessibility violations when empty', async () => {
    const { container } = render(<ResultsPanel />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('displays error with role=alert', () => {
    useAppStore.setState({ error: 'Network error occurred' });
    render(<ResultsPanel />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Network error occurred')).toBeInTheDocument();
  });

  it('displays insights correctly', () => {
    useAppStore.setState({
      result: {
        session_id: '123',
        timestamp: new Date().toISOString(),
        recommended_calories: 1200,
        ai_insights: ['Insight 1', 'Insight 2', 'Insight 3'],
        fallback_used: false
      }
    });
    render(<ResultsPanel />);
    expect(screen.getByText('Nutrition Plan')).toBeInTheDocument();
    expect(screen.getByText('1200')).toBeInTheDocument();
    expect(screen.getByText('Insight 1')).toBeInTheDocument();
  });
});
