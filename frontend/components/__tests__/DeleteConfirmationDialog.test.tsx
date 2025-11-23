import { render, screen, fireEvent } from '@testing-library/react';
import DeleteConfirmationDialog from '../DeleteConfirmationDialog';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('DeleteConfirmationDialog', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <DeleteConfirmationDialog
        concertName="Test Concert"
        isOpen={false}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('renders when isOpen is true', () => {
    render(
      <DeleteConfirmationDialog
        concertName="Test Concert"
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );
    
    expect(screen.getByText('Are you sure to delete')).toBeInTheDocument();
    expect(screen.getByText('"Test Concert"?')).toBeInTheDocument();
  });

  it('displays concert name correctly', () => {
    render(
      <DeleteConfirmationDialog
        concertName="Rock Concert 2024"
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );
    
    expect(screen.getByText('"Rock Concert 2024"?')).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', () => {
    const onClose = jest.fn();
    render(
      <DeleteConfirmationDialog
        concertName="Test Concert"
        isOpen={true}
        onClose={onClose}
        onConfirm={jest.fn()}
      />
    );
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when Yes, Delete button is clicked', () => {
    const onConfirm = jest.fn();
    render(
      <DeleteConfirmationDialog
        concertName="Test Concert"
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={onConfirm}
      />
    );
    
    const confirmButton = screen.getByText('Yes, Delete');
    fireEvent.click(confirmButton);
    
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('renders both Cancel and Yes, Delete buttons', () => {
    render(
      <DeleteConfirmationDialog
        concertName="Test Concert"
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );
    
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Yes, Delete')).toBeInTheDocument();
  });
});

