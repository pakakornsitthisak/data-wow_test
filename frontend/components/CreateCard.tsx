'use client';

import { useState } from 'react';
import Image from 'next/image';

interface CreateCardProps {
  onCreate?: (data: { name: string; description: string; seat: number }) => Promise<void>;
  onSuccess?: () => void;
}

export default function CreateCard({ onCreate, onSuccess }: CreateCardProps) {
  const [concertName, setConcertName] = useState('');
  const [totalSeats, setTotalSeats] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!concertName.trim() || !totalSeats || !description.trim()) {
      setError('Please fill in all fields');
      return;
    }

    const seatNumber = parseInt(totalSeats, 10);
    if (isNaN(seatNumber) || seatNumber < 1) {
      setError('Please enter a valid number of seats (at least 1)');
      return;
    }

    if (!onCreate) {
      setError('Create handler not provided');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onCreate({
        name: concertName.trim(),
        description: description.trim(),
        seat: seatNumber,
      });
      
      // Reset form on success
      setConcertName('');
      setTotalSeats('');
      setDescription('');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to create concert');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 w-full shadow-sm">
      {/* Section 1: Title "Create" with horizontal divider */}
      <div className="pt-6">
        <div className="px-6">
          <h3 className="text-xl font-semibold text-[#1692ec] mb-4">Create</h3>
        </div>
        <div className="border-b border-gray-200 mx-6"></div>
      </div>

      {/* Section 2: Two input items on the same line */}
      <div className="px-6 py-4">
        <div className="flex flex-row gap-6">
          {/* Item 1: Concert Name */}
          <div className="flex flex-col space-y-2 flex-1">
            <label className="text-sm font-medium text-gray-700">Concert Name</label>
            <input
              type="text"
              value={concertName}
              onChange={(e) => setConcertName(e.target.value)}
              placeholder="Please input concert name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1692ec] focus:border-transparent text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Item 2: Total of seat with icon */}
          <div className="flex flex-col space-y-2 flex-1">
            <label className="text-sm font-medium text-gray-700">Total of seat</label>
            <div className="relative">
              <input
                type="number"
                value={totalSeats}
                onChange={(e) => setTotalSeats(e.target.value)}
                placeholder="Please input total of seats"
                min="1"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1692ec] focus:border-transparent text-gray-900 placeholder-gray-400"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                <Image
                  src="/svg/total_of_seats.svg"
                  alt="Total of seats"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                  style={{ filter: 'brightness(0) saturate(100%) invert(50%)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Description */}
      <div className="px-6 py-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please input description"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1692ec] focus:border-transparent text-gray-900 placeholder-gray-400 resize-none"
          />
        </div>
      </div>

      {/* Section 4: Save Button */}
      <div className="px-6 pb-6 flex justify-end">
        {error && (
          <div className="mr-4 text-red-600 text-sm flex items-center">{error}</div>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={loading || !concertName.trim() || !totalSeats || !description.trim()}
          className="flex items-center space-x-2 bg-[#1690e9] text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          <Image
            src="/svg/save.svg"
            alt="Save"
            width={16}
            height={16}
            className="w-4 h-4"
          />
          <span>{loading ? 'Saving...' : 'Save'}</span>
        </button>
      </div>
    </div>
  );
}

