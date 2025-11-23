import { api, Concert, Reservation, CreateConcertDto, CreateReservationDto, CancelReservationDto } from '../api';

// Mock fetch globally
global.fetch = jest.fn();

describe('ApiClient', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  const mockConcert: Concert = {
    id: 1,
    name: 'Test Concert',
    description: 'Test Description',
    seat: 100,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  const mockReservation: Reservation = {
    id: 1,
    userId: 'user1',
    concertId: 1,
    status: 'reserve',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  describe('getConcerts', () => {
    it('fetches all concerts', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockConcert],
      });

      const result = await api.getConcerts();

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/concerts', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result).toEqual([mockConcert]);
    });
  });

  describe('getConcert', () => {
    it('fetches a single concert by id', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockConcert,
      });

      const result = await api.getConcert(1);

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/concerts/1', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result).toEqual(mockConcert);
    });
  });

  describe('createConcert', () => {
    it('creates a new concert', async () => {
      const createDto: CreateConcertDto = {
        name: 'New Concert',
        description: 'New Description',
        seat: 50,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockConcert, ...createDto }),
      });

      const result = await api.createConcert(createDto);

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/concerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createDto),
      });
      expect(result.name).toBe('New Concert');
    });
  });

  describe('deleteConcert', () => {
    it('deletes a concert', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Concert deleted successfully' }),
      });

      const result = await api.deleteConcert(1);

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/concerts/1', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result).toEqual({ message: 'Concert deleted successfully' });
    });
  });

  describe('getReservations', () => {
    it('fetches all reservations when no userId provided', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockReservation],
      });

      const result = await api.getReservations();

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/reservations', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result).toEqual([mockReservation]);
    });

    it('fetches reservations for specific user', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockReservation],
      });

      const result = await api.getReservations('user1');

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/reservations?userId=user1', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result).toEqual([mockReservation]);
    });
  });

  describe('createReservation', () => {
    it('creates a new reservation', async () => {
      const createDto: CreateReservationDto = {
        userId: 'user1',
        concertId: 1,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockReservation,
      });

      const result = await api.createReservation(createDto);

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createDto),
      });
      expect(result).toEqual(mockReservation);
    });
  });

  describe('cancelReservation', () => {
    it('cancels a reservation', async () => {
      const cancelDto: CancelReservationDto = {
        userId: 'user1',
        reservationId: 1,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Reservation cancelled successfully' }),
      });

      const result = await api.cancelReservation(cancelDto);

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/reservations/cancel', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cancelDto),
      });
      expect(result).toEqual({ message: 'Reservation cancelled successfully' });
    });
  });

  describe('error handling', () => {
    it('throws ApiError when response is not ok', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          statusCode: 400,
          message: 'Validation failed',
        }),
      });

      await expect(api.getConcerts()).rejects.toMatchObject({
        statusCode: 400,
        message: 'Validation failed',
      });
    });

    it('handles array error messages', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          statusCode: 400,
          message: ['Error 1', 'Error 2'],
        }),
      });

      await expect(api.getConcerts()).rejects.toMatchObject({
        statusCode: 400,
        message: ['Error 1', 'Error 2'],
      });
    });
  });
});

