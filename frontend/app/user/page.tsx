'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
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
  const [userId] = useState<string>('user1'); // In a real app, this would come from auth

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
    return allReservations.filter((r) => r.concertId === concertId).length;
  };

  const getUserReservationId = (concertId: number): number | null => {
    const reservation = userReservations.find((r) => r.concertId === concertId);
    return reservation ? reservation.id : null;
  };

  // Calculate statistics
  const totalSeats = concerts.reduce((sum, concert) => sum + concert.seat, 0);
  const reserveCount = userReservations.length;
  const cancelCount = 0; // TODO: Track cancelled reservations when implemented

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total of seats */}
            <div className="bg-[#0070a4] rounded-lg p-6 text-white flex flex-col items-center justify-center w-full">
              <div className="mb-3">
                <Image
                  src="/svg/total_of_seats.svg"
                  alt="Total of seats"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
              </div>
              <div className="text-sm font-medium opacity-90 mb-2">Total of seats</div>
              <div className="text-3xl font-bold">{totalSeats}</div>
            </div>
            
            {/* Reserve */}
            <div className="bg-[#01a48b] rounded-lg p-6 text-white flex flex-col items-center justify-center w-full">
              <div className="mb-3">
                <Image
                  src="/svg/reserve.svg"
                  alt="Reserve"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
              </div>
              <div className="text-sm font-medium opacity-90 mb-2">Reserve</div>
              <div className="text-3xl font-bold">{reserveCount}</div>
            </div>
            
            {/* Cancel */}
            <div className="bg-[#e84e4e] rounded-lg p-6 text-white flex flex-col items-center justify-center w-full">
              <div className="mb-3">
                <Image
                  src="/svg/cancel.svg"
                  alt="Cancel"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
              </div>
              <div className="text-sm font-medium opacity-90 mb-2">Cancel</div>
              <div className="text-3xl font-bold">{cancelCount}</div>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Available Concerts
            </h2>
            <p className="text-gray-600">
              Browse and reserve your seats for amazing concerts. One seat per user per concert.
            </p>
          </div>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

