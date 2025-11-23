const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Concert {
  id: number;
  name: string;
  description: string;
  seat: number;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: number;
  userId: string;
  concertId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConcertDto {
  name: string;
  description: string;
  seat: number;
}

export interface CreateReservationDto {
  userId: string;
  concertId: number;
}

export interface CancelReservationDto {
  userId: string;
  reservationId: number;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  timestamp?: string;
  path?: string;
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const error: ApiError = {
        statusCode: response.status,
        message: data.message || 'An error occurred',
        ...data,
      };
      throw error;
    }

    return data;
  }

  // Concert endpoints
  async getConcerts(): Promise<Concert[]> {
    return this.request<Concert[]>('/concerts');
  }

  async getConcert(id: number): Promise<Concert> {
    return this.request<Concert>(`/concerts/${id}`);
  }

  async createConcert(data: CreateConcertDto): Promise<Concert> {
    return this.request<Concert>('/concerts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteConcert(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/concerts/${id}`, {
      method: 'DELETE',
    });
  }

  // Reservation endpoints
  async getReservations(userId?: string): Promise<Reservation[]> {
    const endpoint = userId
      ? `/reservations?userId=${userId}`
      : '/reservations';
    return this.request<Reservation[]>(endpoint);
  }

  async createReservation(
    data: CreateReservationDto,
  ): Promise<Reservation> {
    return this.request<Reservation>('/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async cancelReservation(
    data: CancelReservationDto,
  ): Promise<{ message: string }> {
    return this.request<{ message: string }>('/reservations/cancel', {
      method: 'DELETE',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();

