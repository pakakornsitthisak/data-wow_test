'use client';

import { Concert } from '@/lib/api';
import { useState } from 'react';

interface ConcertCardProps {
  concert: Concert;
  reservedCount?: number;
  userReservationId?: number | null;
  userId?: string;
  onReserve?: (concertId: number) => Promise<void>;
  onCancel?: (reservationId: number) => Promise<void>;
  onDelete?: (concertId: number) => Promise<void>;
  isAdmin?: boolean;
}

export default function ConcertCard({
  concert,
  reservedCount = 0,
  userReservationId = null,
  userId,
  onReserve,
  onCancel,
  onDelete,
  isAdmin = false,
}: ConcertCardProps) {
  const [isReserving, setIsReserving] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const availableSeats = concert.seat - reservedCount;
  const isSoldOut = availableSeats <= 0;
  const hasUserReservation = !!userReservationId;

  const handleReserve = async () => {
    if (!onReserve || !userId) return;
    setIsReserving(true);
    try {
      await onReserve(concert.id);
    } finally {
      setIsReserving(false);
    }
  };

  const handleCancel = async () => {
    if (!onCancel || !userReservationId) return;
    setIsCancelling(true);
    try {
      await onCancel(userReservationId);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!confirm('Are you sure you want to delete this concert?')) return;
    setIsDeleting(true);
    try {
      await onDelete(concert.id);
    } finally {
      setIsDeleting(false);
    }
  };

  // Format date from createdAt
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 flex flex-col">
      {/* Image Placeholder */}
      <div className="w-full h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <svg
          className="w-20 h-20 text-white/80"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Concert Name */}
        <h3 className="text-xl font-bold text-green-50 mb-2 line-clamp-2">
          {concert.name}
        </h3>

        {/* Date and Location */}
        <div className="space-y-1 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <svg
              className="w-4 h-4 mr-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {formatDate(concert.createdAt)}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg
              className="w-4 h-4 mr-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="truncate">{concert.description || 'Concert Venue'}</span>
          </div>
        </div>

        {/* Available Seats */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              <span className="font-semibold text-gray-900">{availableSeats}</span>
              <span className="text-gray-500"> / {concert.seat} seats available</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4">
            {isAdmin ? (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                {isDeleting ? 'Deleting...' : 'Delete Concert'}
              </button>
            ) : userId ? (
              hasUserReservation ? (
                <button
                  onClick={handleCancel}
                  disabled={isCancelling}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  {isCancelling ? 'Cancelling...' : 'Cancel Reservation'}
                </button>
              ) : (
                <button
                  onClick={handleReserve}
                  disabled={isReserving || isSoldOut}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  {isReserving
                    ? 'Reserving...'
                    : isSoldOut
                      ? 'Sold Out'
                      : 'Reserve'}
                </button>
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

