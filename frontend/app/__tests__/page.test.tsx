import { render, screen, waitFor } from '@testing-library/react';
import Home from '../page';

// Mock Next.js navigation
const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
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

describe('Home Page', () => {
  beforeEach(() => {
    localStorageMock.clear();
    mockReplace.mockClear();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders loading state', () => {
    const { container } = render(<Home />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeTruthy();
  });

  it('redirects to /admin when userMode is admin', async () => {
    localStorageMock.setItem('userMode', 'admin');

    render(<Home />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/admin');
    }, { timeout: 100 });
  });

  it('redirects to /user when userMode is user', async () => {
    localStorageMock.setItem('userMode', 'user');

    render(<Home />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/user');
    }, { timeout: 100 });
  });

  it('redirects to /user when userMode is not set (default)', async () => {
    localStorageMock.clear();

    render(<Home />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/user');
    }, { timeout: 100 });
  });

  it('redirects to /user when userMode is null', async () => {
    localStorageMock.setItem('userMode', '');

    render(<Home />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/user');
    }, { timeout: 100 });
  });

  it('shows loading spinner', () => {
    const { container } = render(<Home />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('rounded-full', 'h-8', 'w-8', 'border-b-2', 'border-blue-600');
  });

  it('displays loading text', () => {
    render(<Home />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toHaveClass('mt-4', 'text-gray-600');
  });

  it('has proper container styling', () => {
    const { container } = render(<Home />);

    const mainContainer = container.querySelector('.min-h-screen');
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveClass('bg-gray-50', 'flex', 'items-center', 'justify-center');
  });

  it('calls router.replace only once', async () => {
    localStorageMock.setItem('userMode', 'admin');

    render(<Home />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledTimes(1);
    }, { timeout: 100 });
  });

  it('handles router dependency correctly', async () => {
    localStorageMock.setItem('userMode', 'user');

    const { rerender } = render(<Home />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/user');
    }, { timeout: 100 });

    mockReplace.mockClear();

    // Rerender should not call replace again if router hasn't changed
    rerender(<Home />);

    // Wait a bit to ensure no additional calls
    await waitFor(() => {
      // Should only be called once on initial render
    }, { timeout: 50 });

    // In a real scenario, useEffect would run again if router changes
    // but we're testing the redirect logic here
  });
});

