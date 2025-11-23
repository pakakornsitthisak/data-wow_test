import { render, screen, fireEvent } from '@testing-library/react';
import ErrorDisplay from '../ErrorDisplay';
import { ApiError } from '@/lib/api';

describe('ErrorDisplay', () => {
  it('renders error message for Error object', () => {
    const error = new Error('Test error message');
    render(<ErrorDisplay error={error} onClose={() => {}} />);
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('renders error message for ApiError with string message', () => {
    const error: ApiError = {
      statusCode: 400,
      message: 'Validation failed',
    };
    render(<ErrorDisplay error={error} onClose={() => {}} />);
    expect(screen.getByText('Validation failed')).toBeInTheDocument();
  });

  it('renders error message for ApiError with array message', () => {
    const error: ApiError = {
      statusCode: 400,
      message: ['Field 1 is required', 'Field 2 is required'],
    };
    render(<ErrorDisplay error={error} onClose={() => {}} />);
    expect(screen.getByText('Field 1 is required, Field 2 is required')).toBeInTheDocument();
  });

  it('does not render when error is null', () => {
    const { container } = render(<ErrorDisplay error={null} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    const error = new Error('Test error');
    render(<ErrorDisplay error={error} onClose={onClose} />);
    
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not show close button when onClose is not provided', () => {
    const error = new Error('Test error');
    render(<ErrorDisplay error={error} />);
    
    const buttons = screen.queryAllByRole('button');
    expect(buttons).toHaveLength(0);
  });
});
