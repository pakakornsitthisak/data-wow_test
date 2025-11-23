'use client';

import Image from 'next/image';
import { Concert } from '@/lib/api';

interface ConcertCardProps {
  concert: Concert;
  reservedCount?: number;
  userReservationId?: number | null;
  userId?: string;
  onReserve?: (concertId: number) => void;
  onCancel?: (reservationId: number) => void;
  onDelete?: (concert: Concert) => void;
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
  const hasReservation = !!userReservationId;

  const handleButtonClick = () => {
    if (isAdmin && onDelete) {
      onDelete(concert);
    } else if (hasReservation && userReservationId && onCancel) {
      onCancel(userReservationId);
    } else if (!hasReservation && onReserve) {
      onReserve(concert.id);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 w-full shadow-sm">
      {/* Part 1: Concert Name with horizontal line */}
      <div className="pt-6">
        <div className="px-6">
          <h3 className="text-xl font-semibold text-[#1692ec] mb-4">{concert.name}</h3>
        </div>
        <div className="border-b border-gray-200 mx-6"></div>
      </div>

      {/* Part 2: Concert Description */}
      <div className="px-6 py-4">
        <p className="text-gray-600">{concert.description}</p>
      </div>

      {/* Part 3: Bottom section with icons and button */}
      <div className="px-6 pb-6 flex justify-between items-center">
        {/* Bottom Left: User icon and seat count */}
        <div className="flex items-center space-x-2">
          <Image
            src="/svg/user.svg"
            alt="User"
            width={20}
            height={20}
            className="w-5 h-5 opacity-70"
          />
          <span className="text-gray-700 font-medium">
            {isAdmin ? concert.seat : `${reservedCount} / ${concert.seat}`}
          </span>
        </div>

        {/* Bottom Right: Action Button */}
        {isAdmin ? (
          <button
            onClick={handleButtonClick}
            className="flex items-center space-x-2 bg-[#e84e4e] text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            <Image
              src="/svg/trash.svg"
              alt="Delete"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <span>Delete</span>
          </button>
        ) : (
          <button
            onClick={handleButtonClick}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-medium ${
              hasReservation
                ? 'bg-[#e84e4e] text-white hover:bg-red-700'
                : 'bg-[#1692ec] text-white hover:bg-blue-700'
            }`}
          >
            <span>{hasReservation ? 'Cancel' : 'Reserve'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
