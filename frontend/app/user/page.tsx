'use client';

import { useEffect, useState } from 'react';
import { api, Concert, Reservation } from '@/lib/api';
import ConcertCard from '@/components/ConcertCard';
import ErrorDisplay from '@/components/ErrorDisplay';
import Sidebar from '@/components/Sidebar';
import { ApiError } from '@/lib/api';

export default function UserHome() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [userReservations, setUserReservations] = useState<Reservation[]>([]);
  const [allReservations, setAllReservations] = useState<Reservation[]>([]);
  const [error, setError] = useState<ApiError | Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId] = useState<string>('test user'); // In a real app, this would come from auth

  useEffect(() => {
    localStorage.setItem('userMode', 'user');
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [concertsData, userReservationsData, allReservationsData] = await Promise.all([
        api.getConcerts(),
        api.getReservations(userId),
        api.getReservations(), // Get all reservations for counts
      ]);
      setConcerts(concertsData);
      setUserReservations(userReservationsData);
      setAllReservations(allReservationsData);
    } catch (err) {
      setError(err as ApiError | Error);
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async (concertId: number) => {
    try {
      setError(null);
      await api.createReservation({ userId, concertId });
      await loadData();
    } catch (err) {
      setError(err as ApiError | Error);
    }
  };

  const handleCancel = async (reservationId: number) => {
    try {
      setError(null);
      await api.cancelReservation({ userId, reservationId });
      await loadData();
    } catch (err) {
      setError(err as ApiError | Error);
    }
  };

  const getReservedCount = (concertId: number) => {
    return allReservations.filter(
      (r) => r.concertId === concertId && r.status === 'reserve',
    ).length;
  };

  const getUserReservationId = (concertId: number): number | null => {
    const reservation = userReservations.find(
      (r) => r.concertId === concertId && r.status === 'reserve',
    );
    return reservation ? reservation.id : null;
  };

  // Calculate statistics
  const totalSeats = concerts.reduce((sum, concert) => sum + concert.seat, 0);
  const reserveCount = userReservations.filter((r) => r.status === 'reserve').length;
  const cancelCount = userReservations.filter((r) => r.status === 'cancel').length;

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
              <p className="mt-4 text-gray-600">Loading concerts...</p>
            </div>
          ) : concerts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-600">No concerts available at the moment.</p>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              {concerts.map((concert) => {
                const reservedCount = getReservedCount(concert.id);
                const userReservationId = getUserReservationId(concert.id);

                return (
                  <ConcertCard
                    key={concert.id}
                    concert={concert}
                    reservedCount={reservedCount}
                    userReservationId={userReservationId}
                    userId={userId}
                    onReserve={handleReserve}
                    onCancel={handleCancel}
                    isAdmin={false}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

