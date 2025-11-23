import { render, screen, fireEvent } from '@testing-library/react';
import ConcertCard from '../ConcertCard';
import { Concert } from '@/lib/api';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

const mockConcert: Concert = {
  id: 1,
  name: 'Test Concert',
  description: 'This is a test concert description',
  seat: 100,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('ConcertCard', () => {
  it('renders concert information', () => {
    render(<ConcertCard concert={mockConcert} />);
    
    expect(screen.getByText('Test Concert')).toBeInTheDocument();
    expect(screen.getByText('This is a test concert description')).toBeInTheDocument();
  });

  it('displays total seats for admin mode', () => {
    render(<ConcertCard concert={mockConcert} isAdmin={true} />);
    
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('displays reserved count for user mode', () => {
    render(<ConcertCard concert={mockConcert} reservedCount={25} isAdmin={false} />);
    
    expect(screen.getByText('25 / 100')).toBeInTheDocument();
  });

  it('shows Delete button for admin mode', () => {
    const onDelete = jest.fn();
    render(<ConcertCard concert={mockConcert} isAdmin={true} onDelete={onDelete} />);
    
    const deleteButton = screen.getByText('Delete');
    expect(deleteButton).toBeInTheDocument();
    
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledWith(mockConcert);
  });

  it('shows Reserve button for user mode without reservation', () => {
    const onReserve = jest.fn();
    render(<ConcertCard concert={mockConcert} userId="user1" onReserve={onReserve} isAdmin={false} />);
    
    const reserveButton = screen.getByText('Reserve');
    expect(reserveButton).toBeInTheDocument();
    
    fireEvent.click(reserveButton);
    expect(onReserve).toHaveBeenCalledWith(mockConcert.id);
  });

  it('shows Cancel button for user mode with reservation', () => {
    const onCancel = jest.fn();
    render(
      <ConcertCard
        concert={mockConcert}
        userId="user1"
        userReservationId={1}
        onCancel={onCancel}
        isAdmin={false}
      />
    );
    
    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toBeInTheDocument();
    
    fireEvent.click(cancelButton);
    expect(onCancel).toHaveBeenCalledWith(1);
  });

  it('shows Reserve button even when no handlers provided (button still renders)', () => {
    render(<ConcertCard concert={mockConcert} isAdmin={false} />);
    
    // The component always renders a button, but it won't do anything without handlers
    const reserveButton = screen.getByText('Reserve');
    expect(reserveButton).toBeInTheDocument();
    
    // Button should still be clickable (no error)
    fireEvent.click(reserveButton);
    // No handlers, so nothing happens - this is expected behavior
  });
});

