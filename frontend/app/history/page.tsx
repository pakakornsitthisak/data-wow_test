'use client';

import { useEffect, useState } from 'react';
import { api, Concert, Reservation } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import ErrorDisplay from '@/components/ErrorDisplay';
import { ApiError } from '@/lib/api';

interface ReservationWithConcertName extends Reservation {
  concertName: string;
}

export default function HistoryPage() {
  const [reservations, setReservations] = useState<ReservationWithConcertName[]>([]);
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [error, setError] = useState<ApiError | Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem('userMode', 'admin');
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [concertsData, reservationsData] = await Promise.all([
        api.getConcerts(),
        api.getReservations(), // Get all reservations
      ]);
      setConcerts(concertsData);
      
      // Map reservations with concert names
      const reservationsWithNames: ReservationWithConcertName[] = reservationsData.map(
        (reservation) => {
          const concert = concertsData.find((c) => c.id === reservation.concertId);
          return {
            ...reservation,
            concertName: concert?.name || 'Unknown Concert',
          };
        },
      );
      
      // Sort by date (most recent first)
      reservationsWithNames.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
      
      setReservations(reservationsWithNames);
    } catch (err) {
      setError(err as ApiError | Error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const getStatusLabel = (status: string) => {
    return status === 'reserve' ? 'Reserve' : 'Cancel';
  };

  const getStatusColor = (status: string) => {
    return status === 'reserve'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Error Display */}
          <ErrorDisplay error={error} onClose={() => setError(null)} />

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading history...</p>
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-600">No reservations found.</p>
            </div>
          ) : (
            /* Table */
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Concert Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDateTime(reservation.updatedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reservation.userId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reservation.concertName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            reservation.status,
                          )}`}
                        >
                          {getStatusLabel(reservation.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

