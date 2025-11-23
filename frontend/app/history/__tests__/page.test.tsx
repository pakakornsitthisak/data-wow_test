import { render, screen, waitFor } from '@testing-library/react';
import HistoryPage from '../page';
import { api } from '@/lib/api';

// Mock child components
jest.mock('@/components/Sidebar', () => ({
  __esModule: true,
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

jest.mock('@/components/ErrorDisplay', () => ({
  __esModule: true,
  default: ({ error }: any) =>
    error ? <div data-testid="error-display">{String(error.message || error)}</div> : null,
}));

// Mock API
jest.mock('@/lib/api', () => ({
  api: {
    getConcerts: jest.fn(),
    getReservations: jest.fn(),
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('HistoryPage', () => {
  const mockConcerts = [
    {
      id: 1,
      name: 'Concert 1',
      description: 'Description 1',
      seat: 100,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 2,
      name: 'Concert 2',
      description: 'Description 2',
      seat: 50,
      createdAt: '2024-01-02T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
    },
  ];

  const mockReservations = [
    {
      id: 1,
      userId: 'user1',
      concertId: 1,
      status: 'reserve' as const,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-02T12:00:00.000Z',
    },
    {
      id: 2,
      userId: 'user2',
      concertId: 2,
      status: 'cancel' as const,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T10:00:00.000Z',
    },
  ];

  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    (api.getConcerts as jest.Mock).mockResolvedValue(mockConcerts);
    (api.getReservations as jest.Mock).mockResolvedValue(mockReservations);
  });

  it('sets userMode to admin in localStorage', async () => {
    render(<HistoryPage />);
    
    await waitFor(() => {
      expect(localStorageMock.getItem('userMode')).toBe('admin');
    });
  });

  it('renders sidebar', async () => {
    render(<HistoryPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    (api.getConcerts as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<HistoryPage />);
    
    expect(screen.getByText('Loading history...')).toBeInTheDocument();
  });

  it('displays reservations table with correct columns', async () => {
    render(<HistoryPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Date Time')).toBeInTheDocument();
      expect(screen.getByText('Username')).toBeInTheDocument();
      expect(screen.getByText('Concert Name')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
    });
  });

  it('displays reservations with concert names', async () => {
    render(<HistoryPage />);
    
    await waitFor(() => {
      expect(screen.getByText('user1')).toBeInTheDocument();
      expect(screen.getByText('user2')).toBeInTheDocument();
      expect(screen.getByText('Concert 1')).toBeInTheDocument();
      expect(screen.getByText('Concert 2')).toBeInTheDocument();
    });
  });

  it('shows reservation status badges', async () => {
    render(<HistoryPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Reserve')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });

  it('displays formatted date time', async () => {
    render(<HistoryPage />);
    
    await waitFor(() => {
      // Date should be formatted
      const dateCells = screen.getAllByText(/2024/);
      expect(dateCells.length).toBeGreaterThan(0);
    });
  });

  it('sorts reservations by updatedAt in descending order', async () => {
    render(<HistoryPage />);
    
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      // Header row + 2 data rows
      expect(rows.length).toBeGreaterThanOrEqual(3);
    });

    // First reservation should be the one with latest updatedAt (user1, 2024-01-02T12:00:00)
    // The table rows should be sorted correctly
    const tableBody = screen.getAllByRole('row')[1]; // First data row
    expect(tableBody).toHaveTextContent('user1');
  });

  it('shows "Unknown Concert" for reservations with missing concert', async () => {
    const reservationWithMissingConcert = [
      {
        id: 3,
        userId: 'user3',
        concertId: 999, // Non-existent concert
        status: 'reserve' as const,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ];
    
    (api.getReservations as jest.Mock).mockResolvedValue(reservationWithMissingConcert);
    
    render(<HistoryPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Unknown Concert')).toBeInTheDocument();
    });
  });

  it('shows empty state when no reservations', async () => {
    (api.getReservations as jest.Mock).mockResolvedValue([]);
    
    render(<HistoryPage />);
    
    await waitFor(() => {
      expect(screen.getByText('No reservations found.')).toBeInTheDocument();
    });
  });

  it('displays error when API fails', async () => {
    const error = new Error('Failed to load');
    (api.getConcerts as jest.Mock).mockRejectedValue(error);
    
    render(<HistoryPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('error-display')).toBeInTheDocument();
    });
  });

  it('fetches all reservations (not filtered by userId)', async () => {
    render(<HistoryPage />);
    
    await waitFor(() => {
      expect(api.getReservations).toHaveBeenCalledWith(); // No userId parameter
      expect(api.getConcerts).toHaveBeenCalled();
    });
  });

  it('maps concert names correctly for all reservations', async () => {
    render(<HistoryPage />);
    
    await waitFor(() => {
      // Both reservations should have their concert names displayed
      const concert1Cell = screen.getByText('Concert 1');
      const concert2Cell = screen.getByText('Concert 2');
      expect(concert1Cell).toBeInTheDocument();
      expect(concert2Cell).toBeInTheDocument();
    });
  });
});

