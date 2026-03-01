import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResourceForm } from './ResourceForm';
import { beforeEach, vi, describe, it, expect } from 'vitest';

describe('ResourceForm', () => {
  let user;
  let mockOnSubmit;

  beforeEach(() => {
    user = userEvent.setup();
    mockOnSubmit = vi.fn();
  });

  it('renders title and category fields correctly', () => {
    render(<ResourceForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/Track Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Track/i })).toBeInTheDocument();
  });

  it('generates track_id from title and calls onSubmit with correct data', async () => {
    render(<ResourceForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/Track Title/i), 'React Architecture');
    
    await user.selectOptions(screen.getByLabelText(/Category/i), 'backend');

    await user.click(screen.getByRole('button', { name: /Create Track/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'React Architecture',
      track_id: 'react-architecture',
      category: 'backend',
    });
  });

  it('disables submit button when title is empty', async () => {
    render(<ResourceForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /Create Track/i });
    expect(submitButton).toBeDisabled();

    await user.type(screen.getByLabelText(/Track Title/i), 'Test');
    expect(submitButton).not.toBeDisabled();
  });

  it('shows auto-generated ID preview', async () => {
    render(<ResourceForm onSubmit={mockOnSubmit} />);

    expect(screen.getByText(/no-title-yet/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/Track Title/i), 'Data Science');
    expect(screen.getByText(/data-science/i)).toBeInTheDocument();
  });

  it('does not call onSubmit when form is submitted with empty title', async () => {
    render(<ResourceForm onSubmit={mockOnSubmit} />);

    await user.click(screen.getByRole('button', { name: /Create Track/i }));
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});